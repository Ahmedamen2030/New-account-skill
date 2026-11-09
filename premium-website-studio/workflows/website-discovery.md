# Workflow: Discovery (Phase 1)

Goal: a brief that makes later decisions defensible. Time-box it; don't interrogate the user.

## Steps

1. **Read what exists**: repo (stack, existing styles, components, content), brand assets (logo, colors, fonts), current site if any (run a quick audit with `premium-ui-audit.md` rules).
2. **Infer, then ask only the gaps.** Ask at most ~5 questions, batched, each with a suggested default:
   - Who is the audience and what should they do (primary action)?
   - What makes this brand different (one sentence)?
   - Which assets/content exist (photos, video, 3D, copy)? Placeholders OK?
   - Any references they love/hate, and why?
   - Constraints: stack, hosting, CMS, deadline, languages, legal (fonts licensing budget).
3. If the user wants you to proceed without questions, record assumptions explicitly.
4. **Write `docs/brief.md`**:

```markdown
# Brief — <project>
## Business & offer
## Audience (primary / secondary) and their questions
## Primary action / secondary actions
## Content inventory (exists / needed / placeholder)
## Brand constraints (existing logo, colors, type)
## Technical constraints (stack, hosting, CMS, i18n, browsers)
## Success metrics (e.g. demo bookings, time on case studies, Lighthouse ≥ 90)
## Assumptions
## Out of scope
```

5. Confirm the brief in one short message (or proceed if told to), then go to Research.
