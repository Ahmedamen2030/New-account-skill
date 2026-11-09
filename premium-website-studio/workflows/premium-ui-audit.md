# Workflow: Independent Premium UI Audit (Phase 9)

Use for auditing your own build or any existing site the user points to.

## Independence

If a subagent tool exists, spawn the auditor with `agents/qa-auditor.md` as its brief and pass only: the running URL (or build command), `docs/brief.md`, `docs/creative-direction.md`, `styles/tokens.css`/`docs/design-system.md`. Do not pass implementation notes or your opinion of the result. If you must self-audit, inspect the running site (screenshots, DOM) rather than recalling code.

## Steps

1. **Capture**: `viewport-screens.mjs` across the matrix; reduced-motion run (`--reduced-motion`); console errors and failed requests are written to the report.
2. **Function sweep**: every link (status code, not `#`), every button, menu open/close + Esc, forms (valid/invalid submit), keyboard tab-through of each route (record order and focus visibility with screenshots).
3. **Motion review**: scroll top→bottom→top slowly (frames), resize mid-page, check ScrollTrigger positions, check route-change cleanup, check nothing replays unintentionally.
4. **Accessibility**: axe (if available), headings/landmarks, contrast script, alt text, reduced motion.
5. **Performance**: Lighthouse mobile + desktop if available; otherwise LCP/CLS via PerformanceObserver; JS/asset weights.
6. **Design review** against the creative direction and `references/quality-control.md` dimensions 1–6, at identical viewport sizes vs references.
7. **Write `docs/audit.md`** using `assets/audit-report.template.md`: scores with evidence, findings sorted by severity in the strict format, "not tested" list.

The auditor's job is to find problems. An audit with zero findings on a first build is suspicious — re-check.
