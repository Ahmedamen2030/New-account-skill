# Design Research — sources, method, anti-patterns

## Contents
1. Which source for which question
2. Research method (from galleries to principles)
3. Originality rules
4. The generic-AI-website catalogue and what to do instead
5. Premium signals worth studying

---

## 1. Which source for which question

| Question | Go to | What to extract | Don't |
|---|---|---|---|
| What does ambitious creative direction look like in this category right now? | awwwards.com (SOTD/SOTM, filter by category), recent.design | Concept, pacing, signature moment, how type and image share the stage | Copy the winner's layout |
| How do restrained sites compose space? | siteinspire.com, minimal.gallery | Margins, column logic, image/text ratio, how few elements carry a page | Mistake emptiness for restraint |
| What do real landing pages in this niche contain? | land-book.com, onepagelove.com, lapa.ninja, maxibestof.one | Section inventory, content order, CTA placement | Treat the median as the target |
| How is a specific technique built? | tympanus.net/codrops (articles + demos, usually with source) | Technique, its cost, its accessibility gaps | Ship a demo without adapting |
| How do real products handle this flow? | mobbin.com, refero.design | Onboarding, nav, filters, checkout, empty/error states | Invent UX conventions without reason |
| Is there a production-ready component? | 21st.dev | Implementation, deps, a11y | Paste unchanged (see `component-sourcing-21st.md`) |
| What typefaces fit this voice? | typewolf.com, fontsinuse.com, fonts.google.com | Pairings in real use, sizes/weights in context, foundry | Pick by name recognition |
| How should motion be implemented? | gsap.com/docs/v3, motion.dev, threejs.org, r3f.docs.pmnd.rs | APIs, cleanup patterns, performance notes | Rely on blog snippets over docs |
| Palette exploration | coolors.co (generate/lock), real references | Starting points to then test for contrast and role | Pick trendy colors without roles |

Some galleries (Mobbin, Refero) need accounts; if blocked, say so and use public alternatives rather than describing screens you have not seen.

## 2. Research method

1. **Frame the question** from the brief: e.g. "How do premium architecture studios balance portfolio imagery with editorial text?"
2. **Collect 6–12 candidates** across at least 3 sources. Note URL, date seen, why chosen.
3. **Shortlist 2–4** for deep study using `workflows/reference-reverse-engineering.md`.
4. **Extract principles**, phrased transferably: "Section transitions use a hard color cut synced to a type change, no fades" — not "copy their About section".
5. **Map principles to the brief.** For each: adopt / adapt / reject, with a reason.
6. **Write `docs/research-synthesis.md`**: principles table, the gap our site will own, risks.

## 3. Originality rules

- Use at least two references per principle so no single site is being transcribed.
- Change at least the structure, the typographic voice and the signature interaction relative to any one reference.
- Never reuse a reference's images, illustrations, copy, logos, 3D models or custom fonts.
- When the user says "make it like X": deliver the qualities of X (pace, density, confidence) in an original form, and explain the mapping.

## 4. Generic-AI-website catalogue

| Smell | Why it reads cheap | Instead |
|---|---|---|
| Hero → 3 icon cards → testimonials → CTA band | Zero information about this brand | Derive sections from the content inventory and the story arc |
| Inter/Roboto/system font everywhere | No voice | Concept-led pairing (`typography-system.md`) |
| Purple/blue gradients, mesh blobs | Trend signal, no meaning | Flat color fields with one accent with a job |
| Glassmorphism on every panel | Low contrast, muddy hierarchy | Solid surfaces; use blur once where depth means something |
| Every section `padding: 96px 0`, everything centered | No rhythm | Spacing scale with deliberate contrasts (tight clusters, big breaks), asymmetric grid |
| Fade-up on every element, 0.6s, same ease | Motion as wallpaper | Choreograph a few moments; let most content just be there |
| Emoji / generic icon sets as decoration | Toy-like | Typography, numerals, custom marks, or no icon |
| Rounded-2xl cards with soft shadows for everything | Dashboard aesthetic on a brand site | Use cards only for repeated, comparable items |
| Floating decorative 3D/abstract shapes | Effort without meaning | 3D only for product/space/data that benefits from it |
| Scroll-jacked 600vh hero showing one phrase | Wastes time, breaks scroll expectations | Scroll length proportional to content |
| Lorem ipsum, "Lorem Corp", fake logos wall | Unshippable | Real or clearly marked placeholder copy |

## 5. Premium signals worth studying

- **Typographic confidence:** very large display sizes balanced by small, well-set supporting text; tight display tracking; generous body leading.
- **Precise alignment:** everything snaps to a visible or implied grid; optical alignment of large type.
- **Image direction:** consistent crops, treatment and color grade; images sized by the grid.
- **Pacing:** alternating density — a dense information block followed by a single large statement.
- **Material honesty:** few colors, one accent used sparingly, real photography or crafted illustration.
- **Motion with intent:** a recognisable signature (a mask reveal, a typographic morph, a spatial transition) repeated as a motif rather than many unrelated effects.
- **Details:** custom focus states, good 404, thoughtful loading, cursor states that inform.
