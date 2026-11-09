# Three.js & React Three Fiber

## 1. Justification test (answer all before adding 3D)

1. What does 3D let the user understand or do that 2D/video cannot? (rotate a product, explore a space, see data in depth, a brand world with a narrative)
2. Is there a real asset (model, scan, product CAD) or budget to make one?
3. Does it run acceptably on a mid-range phone? If not, what is the fallback?
4. Would a pre-rendered video/image sequence give 90% of the effect at 10% of the cost? If yes, use that.

If 1 has no strong answer, don't use 3D.

## 2. Stack

- Vanilla `three` for a single canvas in a non-React site.
- React: `@react-three/fiber` (docs at r3f.docs.pmnd.rs, v9 at time of research) + `@react-three/drei` helpers. Load the canvas lazily (`next/dynamic` with `ssr: false` or `React.lazy`) so it doesn't block LCP.
- Models: glTF/GLB, Draco or Meshopt compressed, textures as KTX2/WebP, aim for < 2–5 MB total for hero scenes.

## 3. Performance (verified on R3F docs: scaling-performance, pitfalls)

- `<Canvas frameloop="demand">` for scenes that aren't constantly animating; call `invalidate()` to request a frame (calls coalesce; drei controls call it automatically).
- Each mesh is a draw call — keep to a few hundred at most; use `<instancedMesh>` / drei `Instances` for repeats.
- Never `setState` inside `useFrame`; mutate refs and use `delta` for frame-rate independence.
- Adaptive quality: drei `<PerformanceMonitor onDecline={…} onIncline={…}>` adjusting `dpr` (e.g. `<Canvas dpr={[1, 2]}>` then lower on decline); `<Canvas performance={{ min: 0.5 }}>` + `regress()` during interaction.
- Reuse geometries/materials; dispose on unmount (R3F does it for its own objects; manually dispose loaded resources when swapping).
- Pause rendering when offscreen (IntersectionObserver → set frameloop to "never"/"demand").

## 4. Scroll integration

- Drive camera/object values from a ScrollTrigger progress stored in a ref (`onUpdate: self => progress.current = self.progress`), read it in `useFrame`, `invalidate()` if demand mode.
- Or drei `ScrollControls` for self-contained scroll scenes (it owns the scroller — integrate carefully with page scroll).

## 5. Accessibility and fallbacks

- Canvas is invisible to screen readers: provide adjacent text describing what's shown; decorative canvases get `aria-hidden="true"`.
- Controls (rotate/zoom) need keyboard alternatives or buttons.
- Reduced motion: stop autorotation, disable camera flights; show a static frame.
- No WebGL / low-power: render a poster image (`<picture>`) in the same box to avoid layout shift.
- Don't capture scroll/wheel inside a canvas the user didn't ask to interact with.
