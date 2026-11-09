#!/usr/bin/env node
// WCAG 2.x contrast checker for design tokens. No dependencies.
// Usage:
//   node contrast-check.mjs styles/tokens.css            # checks "@contrast A on B [large|ui]" comments in the file
//   node contrast-check.mjs styles/tokens.css --all      # also checks every --color-text* against every --color-bg*/surface*
//   node contrast-check.mjs --pair "#111111" "#f5f2ec"   # ad-hoc pair
// Thresholds: normal text 4.5, large text 3, ui (non-text, WCAG 1.4.11) 3.
// Exit code 1 if any check fails.
import { readFileSync } from "node:fs";

const THRESH = { text: 4.5, large: 3, ui: 3 };

function parseColor(v) {
  v = v.trim().toLowerCase();
  let m;
  if ((m = v.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a };
  }
  if ((m = v.match(/^rgba?\(([^)]+)\)$/))) {
    const parts = m[1].split(/[\s,\/]+/).filter(Boolean);
    const [r, g, b] = parts.slice(0, 3).map((p) => (p.endsWith("%") ? (parseFloat(p) * 255) / 100 : parseFloat(p)));
    let a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    if (parts[3] && parts[3].endsWith("%")) a = parseFloat(parts[3]) / 100;
    return { r, g, b, a };
  }
  if (v === "white") return { r: 255, g: 255, b: 255, a: 1 };
  if (v === "black") return { r: 0, g: 0, b: 0, a: 1 };
  return null;
}

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
function blend(fg, bg) {
  if (fg.a >= 1) return fg;
  return { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 };
}
export function ratio(fg, bg) {
  const f = blend(fg, bg);
  const [L1, L2] = [lum(f), lum(bg)].sort((a, b) => b - a);
  return (L1 + 0.05) / (L2 + 0.05);
}
const toHex = ({ r, g, b }) => "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");

function parseVars(css) {
  // Only first-level :root declarations; later overrides (media queries/themes) are reported separately if needed.
  const vars = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css))) if (!(m[1] in vars)) vars[m[1]] = m[2].trim();
  return vars;
}
function resolve(name, vars, depth = 0) {
  if (depth > 20) return null;
  let v = name.startsWith("--") ? vars[name] : name;
  if (v == null) return null;
  const m = v.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/);
  if (m) return resolve(m[1], vars, depth + 1) ?? (m[2] ? resolve(m[2].trim(), vars, depth + 1) : null);
  return parseColor(v);
}

function check(label, fgName, bgName, kind, vars) {
  const fg = resolve(fgName, vars), bg = resolve(bgName, vars);
  if (!fg || !bg) return { label, ok: null, msg: `could not resolve ${!fg ? fgName : bgName} to a color (oklch/hsl/color-mix not supported — give HEX)` };
  const r = ratio(fg, bg);
  const need = THRESH[kind];
  // WCAG: ratios are not rounded up; 4.499 fails.
  return { label, ok: r >= need, r, need, kind, fg: toHex(blend(fg, bg)), bg: toHex(bg) };
}

const args = process.argv.slice(2);
const results = [];
if (args[0] === "--pair") {
  results.push(check(`${args[1]} on ${args[2]}`, args[1], args[2], args[3] || "text", {}));
} else if (args[0]) {
  const css = readFileSync(args[0], "utf8");
  const vars = parseVars(css);
  const re = /@contrast\s+(\S+)\s+on\s+(\S+)(?:\s+(large|ui|text))?/g;
  let m;
  while ((m = re.exec(css))) results.push(check(`${m[1]} on ${m[2]}`, m[1], m[2], m[3] || "text", vars));
  if (args.includes("--all") || results.length === 0) {
    const fgs = Object.keys(vars).filter((k) => /^--color-text/.test(k));
    const bgs = Object.keys(vars).filter((k) => /^--color-(bg|surface)/.test(k));
    for (const f of fgs) for (const b of bgs) {
      const label = `${f} on ${b}`;
      if (!results.some((r) => r.label === label)) results.push(check(label, f, b, "text", vars));
    }
  }
} else {
  console.error("Usage: node contrast-check.mjs <tokens.css> [--all] | --pair <fg> <bg> [text|large|ui]");
  process.exit(2);
}

let fail = 0;
for (const r of results) {
  if (r.ok === null) { console.log(`?    ${r.label}: ${r.msg}`); continue; }
  if (!r.ok) fail++;
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.label}: ${r.r.toFixed(2)}:1 (needs ${r.need}:1 ${r.kind}) [${r.fg} / ${r.bg}]`);
}
console.log(`\n${results.length} checks, ${fail} failed.`);
process.exit(fail ? 1 : 0);
