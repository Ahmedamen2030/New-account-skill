# Motion & Micro-interactions (GSAP vs Motion vs CSS)

## Choosing the tool

| Need | Use | Why |
|---|---|---|
| Hover, focus, press, color/underline changes | CSS transitions | Zero JS, interruptible, cheapest |
| Scroll storytelling, pinned/scrubbed sequences, complex timelines, SVG, text splitting | GSAP + ScrollTrigger | Timeline control, scroll precision |
| React UI state: mount/unmount, menus, modals, tabs, accordions, layout/shared-element transitions | Motion for React (`npm i motion`, `import { motion, AnimatePresence } from "motion/react"` — formerly Framer Motion) | Declarative, tied to React state, `layout`/`layoutId` |
| Simple scroll-linked UI (progress bar) in React | Motion `useScroll` or CSS scroll-driven animations (`animation-timeline: scroll()`, progressive enhancement) | Less code than ScrollTrigger |
| 3D | Three.js / R3F (`threejs-and-3d.md`) | |

Don't run GSAP and Motion on the same element/property.

## Motion for React patterns (verified on motion.dev/docs/react)

```tsx
import { motion, AnimatePresence } from "motion/react";

<AnimatePresence>
  {open && (
    <motion.nav key="menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />
  )}
</AnimatePresence>

<motion.div layout />            // animates layout changes
<motion.img layoutId={`p-${id}`} /> // shared element between views
<motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} />
```

Reduced motion: Motion offers `MotionConfig reducedMotion="user"` and a `useReducedMotion` hook (not shown on the main React page during research — confirm on motion.dev before relying on exact API).

## Micro-interaction catalogue (each must give feedback or orientation)

- **Buttons:** 120–200ms color/underline/arrow shift; pressed state; loading state with spinner + disabled + `aria-busy`.
- **Links:** underline draw (`background-size` transition) or arrow nudge.
- **Magnetic buttons:** small pull (≤ 8px) via `gsap.quickTo` on pointer devices only (`(hover: hover) and (pointer: fine)`).
- **Custom cursor:** only if it conveys state (view/drag/play). Keep native cursor for text and inputs; disable on touch and reduced motion; never hide the system cursor without a replacement that is always visible.
- **Image hover:** subtle scale (1.03–1.06) inside an overflow-hidden frame, or reveal a caption.
- **Menus:** open ≤ 400ms, staggered items ≤ 40ms, focus moved into menu, Esc closes.
- **Forms:** inline validation on blur, success transition on submit, never shake for > 300ms.
- **Preloader:** only if assets genuinely need it; show real progress, ≤ ~2s typical, skip on repeat visits.
- **Page transitions:** ≤ ~800ms, preserve focus management and history.

## Timing reference (starting points, tune by eye)

| Kind | Duration | Ease |
|---|---|---|
| Hover/feedback | 0.15–0.25s | ease-out |
| Small UI enter | 0.25–0.4s | `cubic-bezier(0.22,1,0.36,1)` / power3.out |
| Section reveal | 0.7–1.2s | power3.out / expo.out |
| Exit | 60–75% of enter | ease-in |
| Stagger | 0.03–0.08s per item, cap total ≤ 0.6s | |
