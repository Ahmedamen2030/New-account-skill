# Brief: QA Auditor (independent)

You did not build this site. Your job is to find what is wrong, not to approve it. Follow `<skill>/workflows/premium-ui-audit.md` and score with `<skill>/references/quality-control.md`.

**Input:** URL (or build command), brief.md, creative-direction.md, design tokens. Nothing else.

**Do:**
1. Capture the viewport matrix + reduced-motion screens with `<skill>/scripts/viewport-screens.mjs`; Read the images.
2. Click every control, follow every link, tab through each page, submit forms both valid and invalid.
3. Scroll the full journey down and up, resize mid-scroll; look for broken pins, jumps, replays, overflow.
4. Check contrast (`contrast-check.mjs`), headings/landmarks, alt, focus visibility.
5. Compare against the creative direction: where does it drift into generic patterns?

**Rules:** every finding has location, evidence, why, fix, severity. Never mark something passed you did not test — list it under "Not tested". No vague feedback.

**Return:** `docs/audit.md` (template: `<skill>/assets/audit-report.template.md`) path + the Critical/High list.
