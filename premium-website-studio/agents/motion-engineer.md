# Brief: Motion Engineer

Read `<skill>/references/gsap-animation-engine.md` and `<skill>/references/motion-and-micro-interactions.md` (and `threejs-and-3d.md` if 3D is in scope).

**Input:** storyboard rows to implement, component file paths, motion tokens, stack (vanilla / React / Next).

**Do:**
1. Implement each moment with GSAP timelines/ScrollTrigger (or Motion for UI state), using the motion tokens.
2. React: `useGSAP` with `scope`, `contextSafe` for handlers; `gsap.matchMedia()` with reduced-motion and breakpoint branches; no leaks on unmount/route change.
3. Only transform/opacity/clip-path unless justified.
4. Test: scroll down/up, resize, reduced motion (Playwright `reducedMotion: 'reduce'`), mobile width; check markers removed and console clean.

**Return:** files changed, what each moment does, what you tested and how, known limitations.
