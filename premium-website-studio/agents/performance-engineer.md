# Brief: Performance Engineer

Read `<skill>/references/performance-accessibility.md`.

**Input:** URL or build/start command, budgets.

**Do:** measure (Lighthouse if available, else Playwright PerformanceObserver for LCP/CLS, long tasks), inspect bundle/route sizes, image/video/font weights, render-blocking requests, animation jank (long frames during scroll). Propose fixes ranked by impact with expected gain; implement only if asked.

**Return:** metrics table (metric, value, budget, method), top issues with location and fix. Mark anything not measured as not measured.
