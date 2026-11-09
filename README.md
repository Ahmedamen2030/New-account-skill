# Claude Code skills

## premium-website-studio

A global Claude Code skill for premium, Awwwards-level website projects. It covers discovery, evidence-based reference reverse-engineering, creative direction, a design system, scroll storytelling with GSAP/ScrollTrigger, Motion, Three.js/R3F, responsive work, accessibility, performance and an independent QA audit.

### Install (any machine)

```bash
git clone https://github.com/Ahmedamen2030/New-account-skill.git
cd New-account-skill
bash install.sh
```

Windows without bash: copy the `premium-website-studio` folder into `%USERPROFILE%\.claude\skills\`.

This copies the skill to `~/.claude/skills/premium-website-studio/`, where every Claude Code project can use it.

### Use

- Explicit: `/premium-website-studio build a site for …`
- Implicit: describe a website task ("redesign my portfolio so it feels like an Awwwards site", "study https://… and tell me how their scroll animations work"). The skill's description triggers it.

### Contents

| Path | Purpose |
|---|---|
| `SKILL.md` | Activation, non-negotiables, the 10-phase workflow, file map |
| `references/` | Deep guides: design research, typography, color & spacing, GSAP engine, Motion, 3D, UI/UX, responsive, perf & a11y, 21st.dev sourcing, QC checklist |
| `workflows/` | Step-by-step runbooks: discovery, reverse-engineering, build, audit, release |
| `agents/` | Briefs for subagents (creative director … independent QA auditor) |
| `scripts/` | `extract-reference.mjs` (Playwright evidence extractor), `viewport-screens.mjs` (responsive matrix + mechanical QA), `contrast-check.mjs` (WCAG contrast for tokens) |
| `assets/` | Templates: creative brief, reference analysis, design tokens CSS, audit report |
| `evals/` | Test cases in `claude plugin eval` format |

### Example prompts

1. `Study https://gsap.com and write up their typography, palette, spacing and scroll animation architecture — I want the principles, not a copy.`
2. `I'm launching "Halden", handmade Norwegian oak furniture (€2–9k). Give me creative direction and a full design system with tokens.css.`
3. `Build a cinematic single-page site for an espresso machine repair workshop in Lisbon, with GSAP scroll storytelling, and make sure it works on mobile.`
4. `Audit my site at http://localhost:3000 like an Awwwards juror and a QA engineer — specific issues with locations and fixes.`
5. `/premium-website-studio Next.js portfolio for an architectural photographer, with a horizontal-scroll gallery and page transitions.`
