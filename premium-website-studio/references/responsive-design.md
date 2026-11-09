# Responsive Design

## Viewport matrix (test all; report which you actually tested)

| Name | Size (CSS px) | Notes |
|---|---|---|
| Large desktop | 1920×1080 | Max-width behaviour, huge type not absurd |
| Desktop | 1440×900 | Primary design reference |
| Laptop | 1280×800 | Most common real laptop; pinned sections must fit |
| Tablet landscape | 1024×768 | Hover may not exist |
| Tablet portrait | 768×1024 | Grid switches |
| Mobile | 390×844 | Primary mobile reference |
| Small mobile | 360×740 (and 320 spot-check) | Overflow, long words, buttons |

`node scripts/viewport-screens.mjs <url> <outDir>` captures these full-page.

## Mobile is its own composition

- Re-order and re-compose: hero image may go above or below text; side-by-side becomes stacked with a different emphasis; horizontal scroll becomes native swipe carousel.
- Display type scales down but stays dramatic; check the longest word fits at 320px (`overflow-wrap: anywhere` as safety, `hyphens: auto` with `lang`).
- Touch targets ≥ 44×44px (WCAG 2.5.8 AA minimum is 24×24; 44 is the comfortable target), spacing between targets.
- No hover-dependent content; replace cursor effects with tap/scroll-based ones or none.
- Use `svh`/`dvh` for full-height sections; avoid `100vh` jumps from browser chrome.
- Pinned scrubbed sections on mobile: shorter distances, fewer layers, or replace with stacked content. Test with real touch scroll (Playwright `hasTouch: true` + device emulation).
- Respect safe areas: `padding: env(safe-area-inset-*)` for fixed bars.

## Technique

- Fluid tokens (`clamp()`) for type and space; breakpoints for composition changes only.
- Container queries (`@container`) for components that live in different column widths.
- Images: `<img srcset sizes>` / `next/image` with correct `sizes`; `object-fit` + `object-position` chosen per breakpoint (art direction via `<picture>` when crop must change).
- Avoid horizontal overflow: check `document.documentElement.scrollWidth > innerWidth` at every width (the viewport script reports this).
- Tables/code: horizontal scroll inside a labelled, focusable container.

## Checklist per viewport

Typography scale · overflow-x · image crops · nav open/close · tap targets · pinned/scrubbed sections · animation smoothness (no jank) · section heights · spacing rhythm · forms and keyboards (input not hidden by virtual keyboard) · orientation change.
