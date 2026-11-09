# Agent briefs

These are prompt briefs to paste into a subagent (Agent/Task tool) — they are not pre-registered agents. Pass the brief plus the minimal context listed. Model tiers are guidance: use whatever models the session actually offers; pick the cheapest that can do the job.

| Brief | When to spawn | Context to pass | Model tier |
|---|---|---|---|
| creative-director | Open brief, need 2 directions or a direction review | brief.md, research-synthesis.md | Top tier (judgement-heavy) |
| reference-researcher | ≥ 2 references to study (one agent per URL, in parallel) | URL, brief summary, skill path | Mid tier |
| ui-ux-architect | Multi-page site or complex flows | brief.md, creative-direction.md, content inventory | Mid/top |
| typography-specialist | Type system from scratch or licensing questions | creative-direction.md, constraints | Mid |
| motion-engineer | Signature/scroll moments to build or debug | experience-map storyboard, component paths, tokens | Top tier (tricky code) |
| frontend-engineer | Large isolated build chunks | design-system.md, tokens.css, section spec | Mid/top |
| performance-engineer | Before release, or perf regressions | URL/build cmd, budgets | Mid |
| qa-auditor | Always before release (independent) | URL, brief, creative direction, tokens — NOT implementation notes | Mid/top, different instance from builder |

Do not delegate trivial work (a single component, a color tweak) — the context transfer costs more than it saves.
