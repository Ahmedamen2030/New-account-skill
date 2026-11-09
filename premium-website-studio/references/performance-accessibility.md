# Performance & Accessibility

## Budgets (release gates)

- Core Web Vitals "good" at p75 (web.dev, verified): **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1**.
- JS (gzipped) for the home route: aim ≤ 200 KB excluding 3D chunks loaded on demand. GSAP core + ScrollTrigger is modest; Three.js is large — lazy-load.
- Fonts: ≤ 4 files on first load, WOFF2, subsetted.
- Hero media: LCP image ≤ ~200 KB (AVIF/WebP), `fetchpriority="high"`, not lazy. Video: muted, `playsinline`, poster, `preload="metadata"`, ≤ ~2–4 MB, H.264 MP4 + optional WebM/AV1, don't autoplay when reduced motion or Save-Data.

## Loading

- Images: explicit `width`/`height` or `aspect-ratio`, `loading="lazy"` below the fold, responsive `srcset/sizes`, modern formats.
- Code-split heavy interactive sections (`dynamic import`), load 3D on visibility or idle.
- Preconnect only to origins used immediately; self-host fonts when possible.
- Avoid render-blocking third-party scripts; defer analytics.
- Next.js: `next/image`, `next/font`, server components for static content, `"use client"` only where needed.

## Runtime

- Animate compositor-friendly properties (transform, opacity). Watch for long tasks > 50ms in the Performance panel.
- Throttle pointer handlers via `gsap.quickTo`/rAF; passive listeners for scroll/touch.
- Pause offscreen video, canvas and loops.

## Measuring (only report what you ran)

- `npx lighthouse <url> --preset=desktop --output=json --chrome-flags="--headless --no-sandbox"` (and mobile default). If Lighthouse isn't available, measure with Playwright: `performance.getEntriesByType('largest-contentful-paint')` via a PerformanceObserver, and CLS from `layout-shift` entries.
- Bundle: framework build output (`next build` prints route sizes) or `vite build` report.

## Accessibility checklist (WCAG 2.2 AA unless noted)

- Semantic landmarks: `header`, `nav`, `main`, `footer`; one `h1`; heading levels not skipped.
- Contrast: text 4.5:1 (large ≥ 24px / 18.66px bold: 3:1); UI component boundaries and focus indicators 3:1 (SC 1.4.11).
- Keyboard: everything operable, logical order, visible `:focus-visible` style, no traps (except intentional modal trap with Esc), skip link.
- Motion: `prefers-reduced-motion` honored (SC 2.3.3 is AAA but treat as required); nothing flashes > 3/sec; auto-moving content > 5s has pause (SC 2.2.2).
- Images: meaningful `alt`; decorative `alt=""`; SVG icons `aria-hidden` with labelled parent control.
- Split text keeps an accessible name (SplitText `aria: "auto"`).
- Forms: labels, errors linked, autocomplete.
- Language `lang` attribute; zoom to 200% without loss; reflow at 320px (SC 1.4.10).
- Smooth scroll libraries must not break keyboard scrolling (Space/PageDown/arrows) or find-in-page.
- Automated: `npx @axe-core/cli <url>` or inject axe-core via Playwright — automated tools catch only part of issues; also do a manual keyboard pass.
