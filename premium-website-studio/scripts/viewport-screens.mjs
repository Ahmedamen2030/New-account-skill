#!/usr/bin/env node
// Capture identical-viewport screenshots across the responsive matrix and report layout problems.
// Usage: node viewport-screens.mjs <url> <outDir> [--reduced-motion] [--only=1440,390] [--no-full]
// Output: <outDir>/<width>x<height>[-rm]-{viewport,full}.png and <outDir>/viewports.json
// Reports per viewport: horizontal overflow (and the widest offending elements), console errors,
// failed requests, tap targets < 44px, images missing alt, links with href="#"/empty.
// Requires Playwright (preinstalled in Claude Code cloud; otherwise `npm i -D playwright`).
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { console.error("Playwright not found. Install with: npm i -D playwright && npx playwright install chromium"); process.exit(2); }

const MATRIX = [
  [1920, 1080, "large-desktop"], [1440, 900, "desktop"], [1280, 800, "laptop"],
  [1024, 768, "tablet-landscape"], [768, 1024, "tablet-portrait"], [390, 844, "mobile"], [360, 740, "small-mobile"],
];
const [url, outDir = "screens"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!url) { console.error("Usage: node viewport-screens.mjs <url> <outDir> [--reduced-motion] [--only=1440,390] [--no-full]"); process.exit(2); }
const flags = process.argv.slice(2).filter((a) => a.startsWith("--"));
const rm = flags.includes("--reduced-motion");
const noFull = flags.includes("--no-full");
const only = flags.find((f) => f.startsWith("--only="))?.split("=")[1].split(",").map(Number);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const report = { url, reducedMotion: rm, date: new Date().toISOString(), viewports: [] };
for (const [w, h, name] of MATRIX.filter(([w]) => !only || only.includes(w))) {
  const mobile = w < 1024;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile && w < 800, reducedMotion: rm ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const consoleErrors = [], failed = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text().slice(0, 300)));
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message.slice(0, 300)));
  page.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 200)}`));
  const entry = { name, width: w, height: h };
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => page.goto(url, { waitUntil: "load", timeout: 45000 }));
    await page.waitForTimeout(1200);
    const tag = `${w}x${h}${rm ? "-rm" : ""}`;
    await page.screenshot({ path: join(outDir, `${tag}-viewport.png`) });
    if (!noFull) {
      // Scroll through to trigger lazy content and scroll-driven reveals, then return to top.
      await page.evaluate(async () => {
        const step = innerHeight * 0.6;
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        scrollTo(0, 0); await new Promise((r) => setTimeout(r, 400));
      });
      await page.screenshot({ path: join(outDir, `${tag}-full.png`), fullPage: true });
    }
    Object.assign(entry, await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflow = document.documentElement.scrollWidth > vw + 1;
      const offenders = [];
      if (overflow) for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && r.width > 0 && getComputedStyle(el).position !== "fixed") offenders.push({ sel: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""), right: Math.round(r.right) });
        if (offenders.length > 15) break;
      }
      const small = [];
      for (const el of document.querySelectorAll("a, button, input, select, textarea, [role=button]")) {
        const r = el.getBoundingClientRect();
        if (r.width && r.height && (r.width < 44 || r.height < 44)) small.push({ text: (el.innerText || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) });
      }
      const deadLinks = [...document.querySelectorAll("a")].filter((a) => { const h = a.getAttribute("href"); return h === null || h === "" || h === "#"; }).map((a) => (a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 40));
      const noAlt = [...document.querySelectorAll("img:not([alt])")].map((i) => i.currentSrc?.slice(-80) || i.src.slice(-80));
      return { documentHeight: document.documentElement.scrollHeight, horizontalOverflow: overflow, overflowOffenders: offenders, smallTapTargets: small.slice(0, 30), smallTapTargetCount: small.length, deadLinks, imagesMissingAlt: noAlt, h1Count: document.querySelectorAll("h1").length };
    }));
  } catch (e) { entry.error = String(e.message || e).slice(0, 300); }
  entry.consoleErrors = consoleErrors; entry.failedRequests = failed.slice(0, 20);
  report.viewports.push(entry);
  console.log(`${name} ${w}x${h}: ${entry.error ? "ERROR " + entry.error : `overflow=${entry.horizontalOverflow} smallTargets=${entry.smallTapTargetCount} deadLinks=${entry.deadLinks.length} consoleErrors=${consoleErrors.length}`}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(outDir, "viewports.json"), JSON.stringify(report, null, 2));
console.log(`Wrote ${join(outDir, "viewports.json")} — now Read the PNGs to judge composition; this script only catches mechanical problems.`);
