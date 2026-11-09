# Component Sourcing with 21st.dev

21st.dev is a community registry of React + Tailwind components (shadcn-style: code is copied into your repo, not installed as a dependency). Verified Nov 2026: setup via `npx @21st-dev/cli@latest init --client <cursor|claude|codex|vscode|devin>`; each component page has a shadcn CLI install command and a "copy prompt". An official MCP server exists ("21st MCP", formerly "Magic MCP"; the `@21st-dev/magic` package still works; endpoint `https://21st.dev/api/mcp`; needs an API key from 21st.dev/mcp; tools include `search`, `get_component`, `get_inspiration`, `search_logo`, `generate`).

**Only use the MCP tools if they appear in your tool list this session.** Otherwise browse/fetch 21st.dev and say MCP wasn't connected. Never claim a component was fetched via MCP when it wasn't.

## Workflow

1. **Search** for the pattern you specified in the experience map (e.g. "marquee", "pricing table", "command menu") — not "something cool".
2. **Inspect the source**: dependencies (framer-motion vs motion, radix, specific icon libs), client-only APIs, bundle weight, accessibility (roles, keyboard, focus), hardcoded colors/sizes.
3. **Evaluate**: does it fit the creative direction? Is it accessible? Is the dependency already in the stack? Score: fit / quality / a11y / weight.
4. **Adapt**: replace hardcoded values with project tokens; swap fonts, colors, radii, motion durations/eases to the motion tokens; remove decorative extras that don't serve the concept; align props and naming with project conventions; make it work without hover.
5. **Integrate**: place under `components/`, type props, add reduced-motion handling, wire real data/links.
6. **Test**: keyboard, screen reader labels, all viewports, reduced motion, no console errors.
7. **Credit/licence**: record the source URL and licence in `docs/design-system.md` or a code comment.

## Red flags

Unchanged demo styling (the "21st look") · demo copy left in · new dependency for a trivial effect · div-based buttons · animations that ignore reduced motion · duplicate animation libraries.
