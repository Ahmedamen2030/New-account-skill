# Color, Spacing and Grid

## Contents
1. Color: roles before swatches
2. Building and validating a palette
3. Dark / alternate themes
4. Spacing architecture
5. Grid and layout
6. Token naming

---

## 1. Roles before swatches

Define what each color does, then pick values.

| Role | Token | Job |
|---|---|---|
| Background | `--color-bg` | Page canvas; sets mood |
| Background alt | `--color-bg-alt` | Section contrast / chapter breaks |
| Surface | `--color-surface` | Cards, menus, inputs |
| Text | `--color-text` | Primary reading |
| Text muted | `--color-text-muted` | Meta, captions (still ≥ 4.5:1 if it's real text) |
| Border | `--color-border` | Dividers, input outlines (≥ 3:1 vs adjacent if it identifies a control) |
| Primary | `--color-primary` | Brand anchor, often a near-neutral |
| Accent | `--color-accent` | The one color with a job: CTA, focus, active state — used sparingly |
| Secondary | `--color-secondary` | Optional supporting hue for illustration/sections |
| States | `--color-success/-warning/-danger` | Feedback only |
| Focus | `--color-focus` | Focus ring; ≥ 3:1 against both bg and component |
| Selection | `--color-selection` | `::selection` |

A premium palette is usually 1 tinted neutral family (5–9 steps) + 1 accent + maybe 1 secondary. Pure `#000`/`#fff` are fine when intentional; tinted neutrals (e.g. warm off-white `#F4F1EA`, ink `#141413`) often feel more crafted.

## 2. Building and validating

1. Derive the hue story from the concept (material, place, product, heritage), not from trends.
2. Explore on coolors.co (lock known brand colors, generate around them) or build in OKLCH for perceptually even steps: `oklch(L C H)`, vary L for steps, keep H, taper C at extremes.
3. Record final values as HEX (plus OKLCH if used) in tokens.
4. Validate every text/background pair and control/background pair: `node scripts/contrast-check.mjs styles/tokens.css` — targets: 4.5:1 normal text, 3:1 large text (≥ 24px, or ≥ 18.66px bold), 3:1 UI component boundaries and focus indicators (WCAG 1.4.11 — verify against the current W3C text if borderline).
5. Check in context: screenshots in grayscale (hierarchy should survive) and a color-blind simulation if the accent carries meaning.

## 3. Themes

- Dark theme is a separate design, not an inversion: raise surface lightness for elevation, desaturate accents slightly, reduce pure-white text to ~90–95% L to limit halation.
- Implement with `[data-theme]` or `@media (prefers-color-scheme)` overriding role tokens only.
- Section-level themes (dark chapter in a light site) via a class that swaps role tokens — components stay unchanged.

## 4. Spacing architecture

- Base unit 4px or 8px. Scale (example, 8-based with fluid ends):

```css
:root{
  --space-3xs: clamp(0.25rem, 0.23rem + 0.09vw, 0.3125rem);
  --space-2xs: clamp(0.5rem, 0.47rem + 0.19vw, 0.625rem);
  --space-xs:  clamp(0.75rem, 0.7rem + 0.28vw, 0.9375rem);
  --space-s:   clamp(1rem, 0.93rem + 0.37vw, 1.25rem);
  --space-m:   clamp(1.5rem, 1.4rem + 0.56vw, 1.875rem);
  --space-l:   clamp(2rem, 1.86rem + 0.74vw, 2.5rem);
  --space-xl:  clamp(3rem, 2.79rem + 1.11vw, 3.75rem);
  --space-2xl: clamp(4rem, 3.5rem + 2.5vw, 6rem);
  --space-3xl: clamp(6rem, 4.9rem + 5vw, 10rem);
  --space-section: clamp(6rem, 3rem + 12vw, 16rem);
}
```

- Rules: related things close (proximity), groups separated by at least two steps more than intra-group spacing; section spacing varies with narrative weight (a pause before a big statement can be larger than standard).
- Every margin/padding uses a token. A value outside the scale must be justified in a comment (optical correction).
- Vertical rhythm: align body line-height and spacing to the base unit where practical.

## 5. Grid and layout

- Desktop: 12 columns (or 16 for dense editorial), gutter `--space-s`–`--space-m`, outer margin `--space-m`–`--space-xl`. Tablet: 8. Mobile: 4 (or 6).
- Content max width for reading: ~65ch; for full compositions allow full-bleed with an inner grid.
- Use CSS Grid with named lines for asymmetry: e.g. text on columns 2–6, image on 7–12, caption hung in the gutter.
- Use `subgrid` (where supported) to align card internals across rows.
- Asymmetry should still be on-grid. Off-grid elements are deliberate exceptions (one per view, max).
- Section heights from content; use `min-height: 100svh` (small viewport units) for full-screen moments so mobile URL bars don't crop.

```css
.grid{display:grid;grid-template-columns:repeat(var(--cols,12),minmax(0,1fr));column-gap:var(--gutter);padding-inline:var(--margin)}
@media (max-width:1023px){.grid{--cols:8}}
@media (max-width:639px){.grid{--cols:4}}
```

## 6. Token naming

Two layers: primitives (`--ink-900: #141413`) and semantic roles (`--color-text: var(--ink-900)`). Components consume only semantic tokens. Motion, radius, shadow and z-index also get tokens (see `assets/design-tokens.template.css`).
