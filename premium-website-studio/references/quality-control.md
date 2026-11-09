# Quality Control Checklist

Score each dimension 0–3 (0 = failing, 1 = generic, 2 = good, 3 = exceptional). Each score needs **evidence** (screenshot path, metric, selector, or "not tested" — which scores as unknown, never as pass). Release bar: no 0s, no open Critical issues, average ≥ 2.

| # | Dimension | Check | How to verify |
|---|---|---|---|
| 1 | Visual originality | Could this be mistaken for a template or another brand? Is the signature moment distinct? Any generic-AI smells (`design-research.md` §4)? | Side-by-side with references at identical viewport; smell list |
| 2 | Design consistency | Same component looks/behaves the same everywhere; one motion language | Screens of every route; grep for one-off styles |
| 3 | Typography | Families match concept & are licensed; scale steps clear; measure 55–75ch; no orphans/widows in display; leading/tracking per role | Screens at 1440/390; computed styles; licence table |
| 4 | Spacing precision | Only tokens used; rhythm intentional; alignment to grid | `grep` for raw px/rem in styles; grid overlay screenshot |
| 5 | Color | Roles used consistently; accent scarce; contrast passes | `contrast-check.mjs`; grayscale screenshot |
| 6 | Hierarchy | 1 dominant element per view; squint test; primary CTA obvious | Blurred/zoomed-out screenshot |
| 7 | Animation quality | Purposeful; consistent timing; no jank; no conflicts; no repeated replays; cleanup on unmount; correct ScrollTrigger positions after resize | Scroll recording/frames; resize test; React route-change test; console |
| 8 | Interaction functionality | Every link/button/form works; no `href="#"` | Crawl links (Playwright); click every control |
| 9 | UX | Nav clear; story arc coherent; states (loading/empty/error) exist; scroll length justified | Walkthrough of top 3 tasks |
| 10 | Responsive | Matrix tested; no overflow; mobile composed; touch targets | `viewport-screens.mjs` report |
| 11 | Accessibility | Keyboard pass; focus visible; landmarks/headings; alt; reduced motion; axe clean of serious issues | Manual + axe; emulate `reducedMotion: 'reduce'` |
| 12 | Performance | LCP/INP/CLS within budget; JS weight; images/fonts optimised | Lighthouse or Playwright perf entries; build output |
| 13 | Code quality | Typed, small components; tokens; no dead code; lint/typecheck clean | `tsc --noEmit`, lint, review |
| 14 | Production readiness | Prod build succeeds; meta/OG/favicon; 404; no console errors; env/secrets safe | `build` + `start`; console capture |

## Severity

- **Critical** — broken function, inaccessible core flow, crash, layout broken at a matrix width, failing contrast on body text.
- **High** — clearly generic/off-concept section, janky signature animation, CLS > 0.1, missing reduced motion.
- **Medium** — inconsistency, spacing off-scale, weak hierarchy in one section.
- **Low** — polish.

## Finding format (no vague feedback)

```
[High] Home › "Process" section @1280×800 — pinned sequence ends 340px before the last step's text is fully visible.
Evidence: screens/1280-process-end.png; ScrollTrigger end "+=200%" with 3 steps.
Why: user misses the final step; narrative ends without payoff.
Fix: end: () => "+=" + steps.length * 100 + "%", invalidateOnRefresh: true; re-test at 1280 and 1024.
```

"Make it more premium" is not a finding. Say what, where, why, and how.

## Comparing against a reference

Capture reference and implementation at identical viewport sizes and scroll positions; compare type scale, density, spacing, and pacing — to verify the *principles* transferred, not to measure pixel sameness.
