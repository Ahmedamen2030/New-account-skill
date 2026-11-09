# Typography System

## Contents
1. Choosing typefaces from the concept
2. Licensing check (mandatory)
3. Roles and the type scale
4. Fluid sizing with clamp()
5. Setting: line-height, tracking, measure, wrapping
6. Loading fonts well
7. Deliverable: type spec table

---

## 1. Choose from the concept, not from habit

Start from the creative direction adjectives. Map them to a classification, then search Typewolf / Fonts In Use / Google Fonts for real-world use of candidates.

| Voice | Classifications to explore | Free (verify licence) examples to evaluate | Commercial examples to evaluate |
|---|---|---|---|
| Editorial, cultured | Modern / transitional serif, high contrast display serif | Fraunces, Newsreader, Instrument Serif, Playfair Display, Cormorant | Editorial New, GT Super, Canela, Tiempos |
| Precise, technical | Neo-grotesque, mono accents | Geist, Geist Mono, IBM Plex Sans/Mono, JetBrains Mono, Hanken Grotesk | Neue Haas Grotesk, Suisse Int'l, ABC Diatype |
| Warm, human | Humanist sans, soft serif | Manrope, DM Sans, Figtree, Source Serif 4 | Söhne, GT America |
| Bold, cultural, loud | Condensed grotesk, wide extended, display | Anton, Bebas Neue, Archivo (width axis), Big Shoulders, Unbounded | Druk, PP Neue Machina, Monument Extended |
| Luxury, quiet | Light didone / fine serif + airy sans | Bodoni Moda, Italiana, Cormorant Garamond | Saol, Ogg, Romie |
| Experimental | Variable display, stencil, pixel | Bricolage Grotesque, Space Grotesk, Syne, Silkscreen | Pangram Pangram families |

These are candidates to evaluate, not answers. Inter/Roboto/Arial/Open Sans are acceptable only when the brief justifies them (e.g. matching an existing product UI) — say why.

**Pairing logic.** Pair by contrast of one property while sharing another: serif display + grotesk text (contrast of structure, shared x-height feel); one superfamily in two widths; mono for metadata only. Max 2 families + optional mono. Test pairs at real sizes with real copy, not specimen sentences.

## 2. Licensing check

Record in `docs/design-system.md` for each family: source URL, licence name, whether web embedding/self-hosting is allowed, any page-view or domain limits, who must buy it. Google Fonts families are distributed under open licences (most SIL OFL) — confirm on the family's page. For commercial foundries, never embed a font the user has not licensed; propose a free alternative and flag the purchase. Never pull font files from a reference site.

## 3. Roles

| Role | Typical use | Notes |
|---|---|---|
| display | Hero statement, section openers | Tight tracking (-0.02 to -0.05em), leading 0.85–1.0 |
| h1–h4 | Page/section/subsection headings | Clear steps; don't use 6 levels if 3 suffice |
| lead | Intro paragraph | 1.15–1.35× body |
| body | Reading text | 16–20px, leading 1.45–1.65 |
| small / caption / meta | Credits, dates, labels | Often uppercase + tracking +0.04–0.1em, or mono |
| nav / button | Controls | Legible at small size, weight ≥ 450 on dark |

## 4. Fluid scale with clamp()

Choose a ratio per viewport end (e.g. 1.2 at 360px, 1.333 at 1440px) and interpolate. Formula for a size from `minPx`@`minVw` to `maxPx`@`maxVw`:

```
slope = (maxPx - minPx) / (maxVw - minVw)
intercept = minPx - slope * minVw
font-size: clamp(minPx/16 rem, intercept/16 rem + slope*100 vw, maxPx/16 rem)
```

Example tokens (360→1440):

```css
:root{
  --step--1: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-0:  clamp(1rem, 0.96rem + 0.19vw, 1.125rem);
  --step-1:  clamp(1.2rem, 1.12rem + 0.37vw, 1.5rem);
  --step-2:  clamp(1.44rem, 1.29rem + 0.66vw, 2rem);
  --step-3:  clamp(1.728rem, 1.47rem + 1.13vw, 2.666rem);
  --step-4:  clamp(2.074rem, 1.65rem + 1.87vw, 3.554rem);
  --step-display: clamp(3rem, 1.5rem + 8vw, 10rem);
}
```

Always include a `rem` component so user zoom still scales text (WCAG 1.4.4). Display sizes may jump rather than interpolate if the composition changes per breakpoint.

## 5. Setting

- Measure: 55–75 characters for body (`max-inline-size: 65ch`).
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs (progressive enhancement).
- `font-optical-sizing: auto` for variable fonts with an `opsz` axis.
- Tabular numerals for data/prices: `font-variant-numeric: tabular-nums`.
- Hanging punctuation / optical left alignment for large quotes when supported.
- Don't letter-space lowercase body text. Do open up small caps/uppercase labels.
- Kerning on (`font-kerning: normal`); avoid faux bold/italic (`font-synthesis: none` when all styles are loaded).

## 6. Loading

- Self-host WOFF2 when possible (better caching control, no third-party request); subset to needed scripts.
- Preload only the 1–2 fonts used above the fold: `<link rel="preload" as="font" type="font/woff2" crossorigin href="...">`.
- `font-display: swap` for text; consider `optional` for decorative display faces.
- Reduce layout shift with fallback metrics: `size-adjust`, `ascent-override`, `descent-override` on a local fallback `@font-face`, or Next.js `next/font` which does this automatically.
- Google Fonts CSS2 API: axis ranges with `..`, axes alphabetical, e.g. `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap` (verify the family's actual axes on its page).
- SplitText/line animations must re-split after fonts load (`autoSplit: true` or `document.fonts.ready`).

## 7. Deliverable: type spec

| Token | Family | Weight | Size (min→max) | Line-height | Tracking | Case | Use |
|---|---|---|---|---|---|---|---|
| --type-display | … | … | 48→160px | 0.9 | -0.04em | none | hero |

Plus: rationale (1 paragraph), licence table, loading strategy, fallback stack.
