# Workflow: Production Release (Phase 10)

1. **Fix** all Critical and High audit findings; decide (with the user if needed) on Medium.
2. **Production build**: `npm run build` (+ `npm run start` / `npx serve dist`). Must succeed without warnings you haven't explained. Run typecheck and lint.
3. **Re-verify** on the production build, not dev: viewport screens, reduced motion, keyboard pass, console clean, Lighthouse/perf metrics vs budgets in `references/performance-accessibility.md`.
4. **Ship hygiene**:
   - `<title>`, meta description, canonical, Open Graph/Twitter image, favicon + apple-touch-icon, `lang`, theme-color.
   - 404 page designed, `robots.txt`, `sitemap.xml` for multi-page.
   - Fonts licensed for the production domain; credits for third-party components/assets.
   - No secrets in client bundle; env vars documented.
   - Third-party scripts from a CDN are pinned to an exact version and carry `integrity` (SRI) + `crossorigin="anonymous"`, or are self-hosted. The page stays readable if the CDN fails (content visible without JS).
   - Analytics/consent if required by the user.
5. **Release report** (SKILL.md final report format) including a table of verification steps with command/method and result, plus everything not verified.
