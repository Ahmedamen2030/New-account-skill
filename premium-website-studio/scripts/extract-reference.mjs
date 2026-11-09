#!/usr/bin/env node
// Evidence extractor for reference websites. Everything in report.json is MEASURED from the live page
// (computed styles / DOM / network) — interpretation is your job, and anything not here is not verified.
// Usage: node extract-reference.mjs <url> <outDir> [--frames] [--frames-step=400]
// Output: report.json, screenshots (1440, 1024, 390: viewport + full), optional scroll frames (1440) in frames/.
// Requires Playwright (preinstalled in Claude Code cloud; otherwise `npm i -D playwright`).
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { console.error("Playwright not found. Install with: npm i -D playwright && npx playwright install chromium"); process.exit(2); }

const pos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flags = process.argv.slice(2).filter((a) => a.startsWith("--"));
const [url, outDir = "reference"] = pos;
if (!url) { console.error("Usage: node extract-reference.mjs <url> <outDir> [--frames] [--frames-step=400]"); process.exit(2); }
const wantFrames = flags.includes("--frames");
const frameStep = Number(flags.find((f) => f.startsWith("--frames-step="))?.split("=")[1] || 400);
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = [[1440, 900], [1024, 768], [390, 844]];
const report = { url, inspectedAt: new Date().toISOString(), method: "Playwright Chromium headless; getComputedStyle + DOM + network", access: "unknown", viewports: {} };

// Runs in the page. Keep self-contained.
function collect() {
  const toHex = (c) => {
    const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    if (p.length > 3 && p[3] === 0) return null;
    return "#" + p.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, "0")).join("") + (p.length > 3 && p[3] < 1 ? ` @${p[3]}` : "");
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
  const typo = (el) => { const s = getComputedStyle(el); return { family: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: toHex(s.color), sample: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 60) }; };
  const out = { title: document.title, lang: document.documentElement.lang, documentHeight: document.documentElement.scrollHeight, viewportWidth: innerWidth };

  // Typography samples per role (first 3 visible of each selector)
  const roles = { h1: "h1", h2: "h2", h3: "h3", h4: "h4", p: "p", a: "a", button: "button", nav: "nav a, nav button", small: "small, figcaption, time", li: "li" };
  out.typography = {};
  for (const [k, sel] of Object.entries(roles)) out.typography[k] = [...document.querySelectorAll(sel)].filter(visible).slice(0, 3).map(typo);

  // Largest text on page (likely display type)
  const texts = [...document.querySelectorAll("body *")].filter((el) => el.childElementCount === 0 && (el.innerText || "").trim().length > 1 && visible(el));
  out.largestText = texts.map((el) => ({ el, px: parseFloat(getComputedStyle(el).fontSize) })).sort((a, b) => b.px - a.px).slice(0, 6).map(({ el }) => ({ tag: el.tagName.toLowerCase(), ...typo(el) }));

  // Font usage frequency (by text element count)
  const fam = {};
  for (const el of texts) { const f = getComputedStyle(el).fontFamily; fam[f] = (fam[f] || 0) + 1; }
  out.fontFamilyUsage = Object.entries(fam).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // @font-face rules (where stylesheets are readable) + document.fonts
  out.fontFaces = []; out.unreadableStylesheets = 0;
  for (const sh of document.styleSheets) {
    try { for (const r of sh.cssRules) if (r.constructor.name === "CSSFontFaceRule" || r.type === 5) out.fontFaces.push({ family: r.style.getPropertyValue("font-family"), weight: r.style.getPropertyValue("font-weight"), style: r.style.getPropertyValue("font-style"), src: r.style.getPropertyValue("src").slice(0, 200), display: r.style.getPropertyValue("font-display") }); }
    catch { out.unreadableStylesheets++; }
  }
  out.loadedFonts = [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight} ${f.style}`).slice(0, 40);

  // Color frequency weighted by area
  const colors = { text: {}, background: {}, border: {} };
  for (const el of document.querySelectorAll("body, body *")) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el); const r = el.getBoundingClientRect(); const area = Math.min(r.width * r.height, innerWidth * 2000);
    const bg = toHex(s.backgroundColor); if (bg) colors.background[bg] = (colors.background[bg] || 0) + area;
    if (el.childElementCount === 0 && (el.innerText || "").trim()) { const c = toHex(s.color); if (c) colors.text[c] = (colors.text[c] || 0) + (el.innerText.length); }
    if (parseFloat(s.borderTopWidth) > 0) { const b = toHex(s.borderTopColor); if (b) colors.border[b] = (colors.border[b] || 0) + 1; }
  }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([hex, w]) => ({ hex, weight: Math.round(w) }));
  out.colors = { background: top(colors.background, 10), text: top(colors.text, 10), border: top(colors.border, 6) };

  // CSS custom properties on :root (design tokens if exposed)
  const rootStyle = getComputedStyle(document.documentElement); out.rootCustomProperties = {};
  for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.selectorText === ":root" || r.selectorText === "html") for (const p of r.style) if (p.startsWith("--")) out.rootCustomProperties[p] = rootStyle.getPropertyValue(p).trim(); } catch {} }
  if (Object.keys(out.rootCustomProperties).length > 150) out.rootCustomProperties = Object.fromEntries(Object.entries(out.rootCustomProperties).slice(0, 150));

  // Sections: top-level blocks inside main/body
  const container = document.querySelector("main") || document.body;
  let blocks = [...container.children].filter(visible);
  if (blocks.length === 1 && blocks[0].children.length > 1) blocks = [...blocks[0].children].filter(visible);
  out.sections = blocks.slice(0, 40).map((el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return { tag: el.tagName.toLowerCase(), id: el.id || undefined, class: typeof el.className === "string" ? el.className.slice(0, 80) : undefined, top: Math.round(r.top + scrollY), height: Math.round(r.height), paddingTop: s.paddingTop, paddingBottom: s.paddingBottom, bg: toHex(s.backgroundColor), display: s.display, gridTemplateColumns: s.display.includes("grid") ? s.gridTemplateColumns.slice(0, 120) : undefined, position: s.position }; });

  // Spacing samples: paddings/gaps frequency
  const sp = {};
  for (const el of document.querySelectorAll("section, header, footer, main > *, [class*=container], [class*=wrapper], [class*=grid]")) {
    const s = getComputedStyle(el);
    for (const v of [s.paddingTop, s.paddingBottom, s.paddingLeft, s.rowGap, s.columnGap]) if (v && v !== "0px" && v !== "normal") sp[v] = (sp[v] || 0) + 1;
  }
  out.spacingFrequency = Object.entries(sp).sort((a, b) => b[1] - a[1]).slice(0, 20);

  // Max content widths
  const mw = {};
  for (const el of document.querySelectorAll("body *")) { const v = getComputedStyle(el).maxWidth; if (v !== "none" && v.endsWith("px")) mw[v] = (mw[v] || 0) + 1; }
  out.maxWidths = Object.entries(mw).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Technology detection (evidence strings)
  const scripts = [...document.scripts].map((s) => s.src).filter(Boolean);
  const html = document.documentElement;
  const w = window;
  const tech = [];
  const has = (name, cond, ev) => { if (cond) tech.push({ name, evidence: ev }); };
  has("GSAP", w.gsap || scripts.some((s) => /gsap/i.test(s)), w.gsap ? `window.gsap v${w.gsap.version || "?"}` : "script src matches /gsap/");
  has("ScrollTrigger", w.ScrollTrigger || scripts.some((s) => /ScrollTrigger/i.test(s)) || document.querySelector(".pin-spacer"), w.ScrollTrigger ? "window.ScrollTrigger" : document.querySelector(".pin-spacer") ? ".pin-spacer elements present" : "script src");
  has("Lenis", w.lenis || html.classList.contains("lenis") || scripts.some((s) => /lenis/i.test(s)), html.classList.contains("lenis") ? "html.lenis class" : "window.lenis or script src");
  has("Locomotive Scroll", html.classList.contains("has-scroll-smooth") || document.querySelector("[data-scroll-container]"), "[data-scroll-container] / has-scroll-smooth");
  has("Three.js", w.THREE || w.__THREE__ || scripts.some((s) => /three/i.test(s)), w.__THREE__ ? `__THREE__ r${w.__THREE__}` : "window.THREE or script src");
  has("WebGL canvas", [...document.querySelectorAll("canvas")].length > 0, `${document.querySelectorAll("canvas").length} canvas element(s)`);
  has("Next.js", w.__NEXT_DATA__ || document.querySelector("#__next") || scripts.some((s) => /\/_next\//.test(s)), "__NEXT_DATA__/#__next/_next scripts");
  has("Nuxt", w.__NUXT__ || document.querySelector("#__nuxt"), "__NUXT__/#__nuxt");
  has("React", document.querySelector("[data-reactroot]") || [...document.querySelectorAll("body *")].slice(0, 200).some((el) => Object.keys(el).some((k) => k.startsWith("__react"))), "react fiber keys on DOM nodes");
  has("Webflow", html.hasAttribute("data-wf-site") || w.Webflow, "html[data-wf-site]");
  has("Framer (site builder)", document.querySelector("[data-framer-component-type], #__framer-badge-container") || scripts.some((s) => /framerusercontent|framer\.com/i.test(s)), "framer attributes/scripts");
  has("Barba.js", w.barba || document.querySelector("[data-barba]"), "[data-barba]");
  has("Swup", w.swup || document.querySelector("#swup"), "#swup");
  has("Tailwind (heuristic)", !!document.querySelector('[class*="px-"][class*="py-"], [class*="md:"]'), "utility class names (heuristic)");
  out.technologies = tech;

  // Live ScrollTrigger inventory (only when the page exposes window.ScrollTrigger)
  if (w.ScrollTrigger && typeof w.ScrollTrigger.getAll === "function") {
    const desc = (el) => !el || typeof el === "boolean" ? el : typeof el === "string" ? el : (el.tagName ? el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "") : String(el));
    const all = w.ScrollTrigger.getAll();
    out.scrollTriggers = { count: all.length, note: "Live instances at this viewport; start/end are resolved px. Media-query-gated triggers only exist at matching sizes.", items: all.slice(0, 80).map((st) => {
      const v = st.vars || {};
      const anim = st.animation;
      return { trigger: desc(st.trigger), startVar: typeof v.start === "function" ? "fn" : v.start, endVar: typeof v.end === "function" ? "fn" : v.end, startPx: Math.round(st.start), endPx: Math.round(st.end), distancePx: Math.round(st.end - st.start), pin: desc(st.pin) || false, scrub: v.scrub ?? false, snap: v.snap ? true : false, toggleActions: v.toggleActions, horizontal: !!st.horizontal || !!v.containerAnimation, once: !!v.once, animationDuration: anim ? Number(anim.duration().toFixed(3)) : null, animationTargets: anim && anim.targets ? anim.targets().length : null };
    }) };
  }
  if (w.gsap && w.gsap.globalTimeline) out.gsapGlobalChildren = w.gsap.globalTimeline.getChildren(false, true, true).length;
  out.scriptSrcs = scripts.slice(0, 40);

  // Assets
  const imgs = [...document.images];
  out.assets = { images: imgs.length, imagesLazy: imgs.filter((i) => i.loading === "lazy").length, imageFormats: [...new Set(imgs.map((i) => (i.currentSrc || i.src).split("?")[0].split(".").pop().slice(0, 5)))], videos: document.querySelectorAll("video").length, svgs: document.querySelectorAll("svg").length, canvases: document.querySelectorAll("canvas").length };
  out.horizontalOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  out.reducedMotionRules = (() => { let n = 0; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.media && /prefers-reduced-motion/.test(r.media.mediaText)) n++; } catch {} } return n; })();
  return out;
}

const browser = await chromium.launch();
try {
  for (const [w, h] of VIEWPORTS) {
    const mobile = w < 800;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, userAgent: undefined });
    const page = await ctx.newPage();
    const requests = [];
    page.on("response", (r) => requests.push({ url: r.url().slice(0, 200), status: r.status(), type: r.request().resourceType(), bytes: Number(r.headers()["content-length"] || 0) }));
    let resp;
    try { resp = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }); }
    catch { resp = await page.goto(url, { waitUntil: "load", timeout: 45000 }).catch((e) => { throw new Error("INACCESSIBLE: " + e.message); }); }
    const status = resp?.status();
    report.access = status && status < 400 ? "accessible" : `http ${status}`;
    await page.waitForTimeout(2000);
    const tag = `${w}x${h}`;
    await page.screenshot({ path: join(outDir, `${tag}-viewport.png`) });
    // Scroll to trigger lazy loads / reveals.
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.5) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } scrollTo(0, 0); await new Promise((r) => setTimeout(r, 500)); });
    const data = await page.evaluate(collect);
    await page.screenshot({ path: join(outDir, `${tag}-full.png`), fullPage: true }).catch(() => {});
    const byType = {};
    for (const r of requests) { byType[r.type] = byType[r.type] || { count: 0, bytes: 0 }; byType[r.type].count++; byType[r.type].bytes += r.bytes; }
    data.network = { byType, fontRequests: requests.filter((r) => r.type === "font").map((r) => r.url), note: "bytes from content-length headers; 0 when absent/compressed" };
    if (wantFrames && w === 1440) {
      const fdir = join(outDir, "frames"); mkdirSync(fdir, { recursive: true });
      const frames = [];
      const total = data.documentHeight;
      for (let y = 0, i = 0; y < total && i < 80; y += frameStep, i++) {
        await page.mouse.wheel(0, i === 0 ? 0 : frameStep);
        await page.waitForTimeout(350);
        const sy = await page.evaluate(() => scrollY);
        const f = join(fdir, `${String(i).padStart(3, "0")}-y${sy}.png`);
        await page.screenshot({ path: f }); frames.push({ i, scrollY: sy, file: f });
      }
      data.scrollFrames = { step: frameStep, waitMs: 350, frames: frames.length, note: "Wheel-driven frames; compare consecutive frames for pins (content static while scrollY grows), reveals, parallax." };
    }
    report.viewports[tag] = data;
    console.log(`${tag}: ok (${data.sections.length} sections, ${data.technologies.map((t) => t.name).join(", ") || "no libs detected"})`);
    await ctx.close();
  }
} catch (e) {
  report.access = String(e.message || e).startsWith("INACCESSIBLE") ? String(e.message).slice(0, 300) : "error: " + String(e.message || e).slice(0, 300);
  console.error(report.access);
} finally {
  await browser.close();
  writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(`Wrote ${join(outDir, "report.json")} (access: ${report.access}). Label these values MEASURED; Read the screenshots before interpreting.`);
}
