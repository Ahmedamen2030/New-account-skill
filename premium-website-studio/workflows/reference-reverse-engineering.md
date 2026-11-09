# Workflow: Reference Reverse-Engineering (Phase 2)

Purpose: turn a reference URL into verified evidence and transferable principles. Never fabricate.

## Evidence labels (use on every fact)

- `OBSERVED` — seen directly (screenshot, DOM, CSS rule, network request).
- `MEASURED` — extracted numerically by a tool; give the value and the method (e.g. "getComputedStyle on h1 @1440: 128px/0.9, -5.12px tracking").
- `HYPOTHESIS` — inferred; give the reasoning (e.g. "likely Lenis: html.lenis class present, inertial scroll feel").
- `UNKNOWN` — could not be verified; say why (blocked, obfuscated, canvas-rendered, login wall).

If the page fails to load (bot protection, auth, timeout), record it as inaccessible and stop analysis for that URL. Do not describe it from memory or from gallery thumbnails as if inspected (you may say "from the Awwwards gallery screenshot only").

## Steps

1. **Automated extraction**
   ```bash
   node <skill>/scripts/extract-reference.mjs https://example.com docs/references/example
   ```
   Produces `report.json` + screenshots at 1440×900, 1024×768 and 390×844 (full page + first viewport). It records: computed typography for h1–h6/p/a/button/nav samples, font families + `@font-face` sources, most-used colors (text/background/border) as HEX, spacing samples (section paddings, gaps), section bounding boxes, detected libraries (gsap, ScrollTrigger, lenis, locomotive, three, framer/motion, barba, swup, webflow, react/next/nuxt), CSS custom properties on `:root`, media/asset counts, overflow-x per viewport, and, when the page exposes `window.ScrollTrigger`, a live inventory of every ScrollTrigger (trigger, start/end vars and resolved px, scroll distance, pin, scrub, snap, horizontal, tween duration). Compare that inventory across the 1440/1024/390 runs to see which effects are gated by media queries.
2. **Look at the screenshots yourself** (Read the PNGs). Note composition, grid, density, image direction.
3. **Observe motion**: open the page in Playwright headed-less with a scripted slow scroll capturing frames every N px (`extract-reference.mjs --frames`), or in a real browser tool if available. Record: loading sequence, scroll-linked effects, pins (start/end in viewport %), easing feel, durations (estimated from frame timestamps → label MEASURED only if timed), hover states (hover elements with Playwright and screenshot).
4. **Inspect code when useful**: script URLs, CSS files, inline GSAP config (search for `scrollTrigger`, `SplitText`, `ease:`). Quote what you find as OBSERVED.
5. **Mobile behaviour**: compare 390 screens; note what is removed, re-composed, or disabled.
6. **Fill the template** `assets/reference-analysis.template.md` → `docs/references/<site>.md`.
7. **Extract principles** (3–7), each phrased so it could apply to a different brand, with adopt/adapt/reject for the current brief.

## Analysis sections (template order)

Design philosophy · Typography system · Color palette (HEX + role + label) · Spacing scale · Layout & grid · Section dimensions · Animation architecture · Scroll behaviour · Interaction patterns · Responsive behaviour · Asset strategy · Performance observations · Technologies (with evidence) · Principles to transfer · Unknowns.

## Ethics

Study, don't copy: never lift assets, copy, or proprietary fonts; don't reproduce a signature interaction 1:1 unless the user owns the reference.
