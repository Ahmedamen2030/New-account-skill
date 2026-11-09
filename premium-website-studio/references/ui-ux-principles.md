# UI/UX Principles

## Contents
1. Information architecture
2. Navigation
3. Story & conversion
4. Components and states
5. Forms
6. Search, filtering, discovery
7. Interaction honesty rules

---

## 1. Information architecture

- Start from the content inventory (what exists, what must be created) and the user's top 3 tasks. Every page answers: where am I, what can I do, where next?
- Sitemap depth ≤ 3 for brand sites. Name pages with the user's words, not internal jargon.
- Write `docs/experience-map.md`: route → purpose → sections → primary action → secondary actions.

## 2. Navigation

- Primary nav ≤ 5–7 items, always reachable (sticky header that hides on scroll-down and returns on scroll-up is a good default for long pages).
- Current page indicated visually and with `aria-current="page"`.
- Mobile menu: a real `<button aria-expanded aria-controls>`; full-screen overlay is fine if focus is trapped inside, Esc and close button work, body scroll is locked, and focus returns to the trigger on close.
- Skip link (`Skip to content`) as first focusable element.
- Footer repeats key links + contact + legal.
- Experimental nav (side index, scroll-progress chapters, cursor-driven menus) must still be discoverable within 3 seconds and keyboard-usable.

## 3. Story & conversion

Arc for a home page: **Hook** (who/what in one look) → **Proof** (work, results, product in use) → **Depth** (how/why, details for the interested) → **Trust** (clients, press, numbers — real only) → **Action** (one clear CTA, then secondary contact).

- Primary CTA visible in the first viewport and repeated at the end; one primary action per view.
- Microcopy specific: "Book a 20-minute call" beats "Get started".
- Long scroll experiences show progress (chapter index, progress bar) and allow jumping.

## 4. Components and states

Every interactive component specifies: default, hover (pointer), focus-visible, active/pressed, disabled, loading, error, success, empty. Data-driven views specify loading (skeleton matching final layout to avoid CLS), empty (explain + next action), error (what happened + retry), partial results.

Use cards only for collections of comparable items. Use tables for comparable data. Use accordions only when content is optional; never hide core info.

## 5. Forms

- Visible `<label>` for each input (placeholder is not a label). Group with `<fieldset><legend>`.
- Correct `type`/`inputmode`/`autocomplete` attributes.
- Validate on blur and on submit; errors next to fields, linked with `aria-describedby`, summary at top on submit with focus moved to it.
- Submission: disabled + loading state, success confirmation with next step, error with retry, no data loss.
- If there's no backend, say so in the report and wire to a clearly documented placeholder (e.g. `mailto:`, Formspree, a Next.js route handler stub) — don't fake success.

## 6. Search, filtering, discovery

- Filters reflect real attributes; show counts; allow clear-all; reflect state in the URL (`?category=…`) so it's shareable and back-button safe.
- Animate filter result changes with Flip or Motion `layout` for orientation (≤ 500ms).
- Search: label, clear button, results count announced via `aria-live="polite"`, no-results state with suggestions.

## 7. Interaction honesty

- No element looks clickable without being clickable (underline, pointer, arrow ⇒ it works).
- No `href="#"`. Placeholder destinations are listed in the final report.
- Custom controls use native elements (`button`, `a`, `input`, `details`) underneath.
- Hover-only information must also be available on focus and touch.
