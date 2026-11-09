# Workflow: Build (Phases 3–8)

Precondition: `docs/brief.md` and research synthesis exist (or the user explicitly skipped them — note it).

## Phase 3 — Creative direction
1. Draft 2 directions if the brief is open (1 if constrained), using `assets/creative-brief.template.md`: concept line, adjectives (+ "not"), tension, type mood, color story, image direction, motion language, signature moment, "we will not" list.
2. Recommend one with reasons tied to the brief. Get a quick yes or proceed if authorised.

## Phase 4 — Design system
1. Copy `assets/design-tokens.template.css` → `styles/tokens.css` and fill it (type, space, grid, color roles, radius, shadow, motion, z-index).
2. Type: follow `references/typography-system.md`; record licences.
3. Color: roles first, then values; run `node <skill>/scripts/contrast-check.mjs styles/tokens.css` and fix failures.
4. Write `docs/design-system.md`: tokens table, type spec, component inventory with states.
5. Optional but valuable: a `/styleguide` route or `styleguide.html` rendering tokens and components — it doubles as a visual test.

## Phase 5 — Experience architecture
`docs/experience-map.md`:
- Sitemap + per-route purpose.
- Section list for each page with: goal, content, layout sketch (grid columns), primary interaction.
- Motion storyboard table:

| Section | Trigger | What moves | Duration / scroll distance | Ease | Purpose | Reduced motion | Mobile |
|---|---|---|---|---|---|---|---|

## Phase 6 — Implementation
1. Choose stack (SKILL.md §6). Scaffold minimal: e.g. `npm create vite@latest` (react-ts) or `npx create-next-app@latest --ts --app --eslint` — only after confirming the user wants a new project in this location.
2. Structure:
```
src/ (or app/)
  styles/tokens.css, base.css (reset, typography roles), utilities.css
  components/ (ui/ primitives, sections/ page sections)
  motion/ (gsap setup, motion tokens, hooks like useReveal)
  content/ (copy and data, typed)
  assets/ (optimised media)
```
3. Build static, semantic, accessible layout first with all content; verify at 1440 and 390 before adding motion.
4. Real links and working controls; placeholders listed.
5. Source components per `references/component-sourcing-21st.md` when it saves time without lowering quality.

## Phase 7 — Animation
1. Implement storyboard moments in priority order: signature moment → hero intro → section transitions → micro-interactions.
2. Central GSAP setup module; `useGSAP` + `gsap.matchMedia` in every animated component (React); reduced-motion branch for each.
3. After each moment: test scroll down/up, resize, route change, reduced motion.
4. Add Lenis only if storyboard calls for it.

## Phase 8 — Responsive
Run `node <skill>/scripts/viewport-screens.mjs http://localhost:PORT screens/` and Read the PNGs. Fix overflow, crops, type, nav, pinned sections per `references/responsive-design.md`. Re-run.

Then go to `premium-ui-audit.md`.
