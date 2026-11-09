# GSAP Animation Engine

Facts below were checked against gsap.com docs (ScrollTrigger page labelled v3.15, SplitText v3.13+ API, @gsap/react, gsap.matchMedia, Flip, MotionPathPlugin) and the Lenis README in Nov 2026. Re-check the docs when an option matters and behaviour surprises you.

## Contents
1. Licensing and setup
2. Motion principles and tokens
3. Timelines
4. ScrollTrigger essentials
5. Recipes: pinned story, scrub, horizontal scroll, image reveal, clip-path, parallax, batch reveals
6. Text: SplitText
7. SVG and MotionPath
8. Flip and page/state transitions
9. Smooth scrolling with Lenis
10. React / Next.js lifecycle
11. Responsive and reduced motion: gsap.matchMedia
12. Performance rules
13. Debugging checklist

---

## 1. Licensing and setup

gsap.com/pricing states GSAP is now 100% free for everyone (Webflow-backed), including the formerly paid plugins. (The page didn't name the licence or date; check gsap.com/licensing if the client needs it in writing.) Install: `npm i gsap` (+ `@gsap/react` for React).

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
```

Register once, in a client-only module.

## 2. Principles and tokens

- Each moment needs a job: reveal hierarchy, connect two states, show cause/effect, pace the story, give feedback.
- One motion language per site: 2–3 durations, 2–3 eases, one signature move.

```js
export const motion = {
  dur: { fast: 0.35, base: 0.7, slow: 1.2 },
  ease: { out: "power3.out", inOut: "power2.inOut", expo: "expo.out" },
  stagger: 0.06,
};
gsap.defaults({ duration: motion.dur.base, ease: motion.ease.out });
```

- Enter = ease-out; exit = ease-in (shorter); moving between states = inOut. Scrubbed tweens use `ease: "none"` (scroll is the easing).
- Don't animate what the user is trying to read for longer than ~1s; don't block input during intros (offer skip, cap preloaders at what loading actually needs).

## 3. Timelines

```js
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.from(".hero__title .line", { yPercent: 110, stagger: 0.08 })
  .from(".hero__meta", { autoAlpha: 0, y: 16 }, "-=0.4")
  .addLabel("media")
  .from(".hero__media", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2 }, "media");
```

Use position parameters (`"<"`, `"-=0.3"`, labels) instead of chained delays. Prefer `autoAlpha` over `opacity` (also toggles `visibility`).

## 4. ScrollTrigger essentials (verified options)

- `trigger`, `start` (default `"top bottom"`, or `"top top"` when pinned), `end` (default `"bottom top"`; accepts `"+=300"`, `"max"`, `clamp()` wrappers v3.12+).
- `scrub: true | number` (number = seconds to catch up; 0.5–1 feels smooth).
- `pin: true | element`, `pinSpacing` (default adds padding; `false`; `"margin"`; defaults to false inside flex parents), `anticipatePin: 1` to reduce pin jump.
- `snap`: number | array | `"labels"` | `"labelsDirectional"` | object `{ snapTo, duration, delay, ease, directional, inertia }`.
- `toggleActions` (default `"play none none none"`: onEnter onLeave onEnterBack onLeaveBack), `once`.
- `invalidateOnRefresh: true` for values computed from layout (function-based `x: () => ...`).
- `containerAnimation` for triggers inside horizontal scroll — the container tween must use `ease: "none"`; pinning/snapping isn't available on those nested triggers.
- `markers: true` during development only.
- Static: `ScrollTrigger.refresh()`, `ScrollTrigger.batch(targets, vars)`, `ScrollTrigger.normalizeScroll(true)` (mobile address-bar/touch consistency; test, it changes scroll handling), `ScrollTrigger.scrollerProxy()` (third-party scrollers).

Create triggers in DOM order (top to bottom) or set `refreshPriority`, otherwise pin spacing upstream throws off downstream start positions.

## 5. Recipes

**Pinned storytelling sequence**

```js
const tl = gsap.timeline({
  scrollTrigger: { trigger: ".story", start: "top top", end: "+=" + (steps * 100) + "%", scrub: 1, pin: true, anticipatePin: 1, snap: { snapTo: "labels", duration: 0.4, ease: "power1.inOut" } }
});
steps.forEach((s, i) => tl.addLabel("s" + i).to(s.el, { autoAlpha: 1, yPercent: 0, ease: "none" }).to(s.el, { autoAlpha: 0, ease: "none" }, "+=0.5"));
```

Scroll distance ≈ 60–120vh per step with actual content. If a step has nothing new to say, cut it.

**Horizontal scroll section**

```js
const track = document.querySelector(".h-track");
const tween = gsap.to(track, {
  x: () => -(track.scrollWidth - window.innerWidth), ease: "none",
  scrollTrigger: { trigger: ".h-section", pin: true, scrub: 1, start: "top top", end: () => "+=" + (track.scrollWidth - window.innerWidth), invalidateOnRefresh: true }
});
gsap.utils.toArray(".h-card").forEach(card => gsap.from(card.querySelector("img"), { scale: 1.2, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } }));
```

On touch/narrow screens prefer a native `overflow-x: auto` + `scroll-snap-type: x mandatory` carousel (via matchMedia).

**Image reveal with clip-path**

```js
gsap.from(".reveal img", { clipPath: "inset(0% 0% 100% 0%)", scale: 1.15, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".reveal", start: "top 80%" } });
```

Set the final clip-path in CSS (`inset(0)`) so no-JS shows the image.

**Parallax** — move the inner media, not the container; keep amplitude small (5–15%).

```js
gsap.to(".parallax img", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".parallax", scrub: true } });
```

**Batch reveals for lists/grids**

```js
ScrollTrigger.batch(".card", { start: "top 85%", onEnter: els => gsap.from(els, { autoAlpha: 0, y: 24, stagger: 0.06, overwrite: true }), once: true });
```

**Section color transitions** — tween CSS variables on `body` with `scrub` or toggle a theme class with `onToggle`.

## 6. Text — SplitText (v3.13+ API)

```js
SplitText.create(".split", {
  type: "lines, words", mask: "lines", autoSplit: true,
  onSplit(self) { return gsap.from(self.words, { yPercent: 100, autoAlpha: 0, stagger: 0.05, duration: 1 }); }
});
```

- `type`: any of `chars, words, lines`. `mask`: one of `"lines" | "words" | "chars"` adds an overflow-clipping wrapper (the classic line reveal).
- `autoSplit: true` re-splits on font load / width change — create the animation inside `onSplit` and return it so it's reverted and re-synced.
- `aria: "auto"` (default) puts `aria-label` on the parent and hides fragments; use `"none"` if the text contains links and handle a11y yourself.
- Split only display text; never split long body copy into chars.

## 7. SVG and MotionPath

- Line drawing: animate `strokeDashoffset` from `getTotalLength()` (or DrawSVG plugin).
- MotionPathPlugin:

```js
gsap.registerPlugin(MotionPathPlugin);
gsap.to("#dot", { motionPath: { path: "#route", align: "#route", alignOrigin: [0.5, 0.5], autoRotate: true }, ease: "none", scrollTrigger: { trigger: ".route", scrub: true } });
```

Alignment is computed once at start (not on resize) — recreate inside matchMedia/refresh if the path scales.

## 8. Flip and transitions

```js
const state = Flip.getState(".item");
container.classList.toggle("grid--list"); // DOM/class change
Flip.from(state, { duration: 0.7, ease: "power2.inOut", absolute: true, nested: true });
```

Great for filter/sort layouts, gallery → detail, and shared-element page transitions. For route transitions in Next.js App Router: animate out on link click (contextSafe handler), `router.push` on complete, animate in on mount; or use the View Transitions API where supported. Keep total transition ≤ ~1s and never break back/forward or focus.

## 9. Lenis smooth scroll (npm `lenis`)

Use only when the design benefits from inertia (heavily scrubbed storytelling). Native scroll is the default.

```js
import Lenis from "lenis";
import "lenis/dist/lenis.css";
const lenis = new Lenis(); // lerp default 0.1; respectReducedMotion default true
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

Destroy on unmount (`lenis.destroy()`, remove ticker callback). Anchor links: `lenis.scrollTo(target)`. Make sure modals with internal scroll get `data-lenis-prevent`.

## 10. React / Next.js

```tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) { gsap.set(".hero__title", { autoAlpha: 1 }); return; }
      gsap.from(".hero__title .line", { yPercent: 110, stagger: 0.08 });
      if (desktop) gsap.to(".hero__media", { yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
    });
  }, { scope: root });

  const onEnter = contextSafe(() => gsap.to(".hero__cta", { scale: 1.04, duration: 0.3 }));
  return <section ref={root}>…<button className="hero__cta" onMouseEnter={onEnter}>…</button></section>;
}
```

- `useGSAP(cb, { scope, dependencies, revertOnUpdate })` reverts everything created inside on unmount; selectors are scoped to `scope`.
- Wrap event handlers / timeouts that animate in `contextSafe` so they're reverted too.
- `"use client"` in App Router. Call `ScrollTrigger.refresh()` after images/fonts that change layout load, and after route changes if layout shifted.
- Don't animate React-controlled style props with GSAP simultaneously.

## 11. Responsive + reduced motion

```js
const mm = gsap.matchMedia();
mm.add({ isDesktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
  const { isDesktop, reduce } = ctx.conditions;
  if (reduce) return; // content visible by CSS default; maybe simple opacity fades
  // build desktop / mobile variants
  return () => { /* optional extra cleanup */ };
});
```

Reduced motion means: no parallax, no scrubbed large movement, no auto-playing motion; instant or opacity-only state changes. Pinned narrative can remain if content is otherwise reachable, but prefer a stacked static layout.

Content must be visible without JS: set initial hidden states in JS (`gsap.set`/`from`) not in CSS, or gate CSS with a `.js` class added at boot.

## 12. Performance

- Animate `transform` (x, y, scale, rotate), `opacity`, `clip-path`, filters sparingly. Avoid width/height/top/left/margin.
- `will-change: transform` only on elements actively animating; remove after.
- Avoid reading layout inside `onUpdate`; use function-based values + `invalidateOnRefresh`.
- `gsap.quickTo()` for cursor followers / pointer-driven values.
- Limit concurrent scrubbed triggers on mobile; kill offscreen loops (`ScrollTrigger` `onToggle` to pause).
- Large images in pinned sections: correct `sizes`, decode before reveal (`img.decode()`).

## 13. Debugging

- Wrong start/end → markers on; check triggers created out of order, images without dimensions, fonts loading late (refresh after `document.fonts.ready`).
- Jump on pin → `anticipatePin: 1`, check `pinSpacing`, avoid `transform` on pin ancestors.
- Horizontal scroll broken on resize → function-based values + `invalidateOnRefresh`.
- Double animations in React Strict Mode → missing `useGSAP`/context cleanup.
- Flash of unstyled final state → use `gsap.from` with `immediateRender` (default for from) and ensure the script runs before first paint of that section, or hide with `.js` class.
