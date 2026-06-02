# Profile Page — Phase 1 + Phase 4 Handoff Note

**Last updated:** May 2026
**Status:** Production-ready on develop, awaiting merge to main

---

## What was shipped — Phase 1 (commit 882d6a4)

- Full structural redesign of `components/profile/profile-form.tsx`
- Removed checklist/gamification system; replaced with `presenceNote` editorial signals
- Removed outer form card; page uses open surface zones directly
- Editorial typography, warm ink palette, atmospheric depth aligned with dashboard system
- Compositional imperfection pass: micro-asymmetry, field drift, varied spacing cadence
- Portrait zone redesigned as vertical narrative (display → upload)
- Bio textarea styled as a writing surface (warm bg, generous padding, line-height 1.72)
- Save conclusion: long approach, quiet right-aligned exit link
- 7 dead CSS classes removed from `globals.css`
- `.editorial-input` text color fixed from cold `#3a3a3a` to warm `#4a2c18`
- `sm:mb-18` broken Tailwind rule fixed to `sm:mb-[4.5rem]`
- `SaveProfileButton` cleaned of conflicting Tailwind overrides
- Documentation: `docs/PROFILE_PAGE_IMPLEMENTATION.md` created and indexed

## What was shipped — Phase 4 (this commit)

- **Visibility radio-card system:** `<select>` replaced with 3 editorial radio-cards (`VISIBILITY_OPTIONS` constant, `privacyLevel` state). `role="radiogroup"`, `sr-only` inputs, warm dot selection indicator. Server action unchanged.
- **Identity field two-column layout:** `grid-cols-1` mobile → `md:grid-cols-[2fr_3fr]` on desktop. `md:max-w-none` on username, `md:ml-0` cancels compositional drift at desktop. Gap replaces top-margin for stacking.
- **Portrait strip redesign:** Replaced two stacked blocks with a responsive CSS grid. Mobile: 2-row `[auto_1fr]` (avatar+meta / upload spans full width). Desktop `md+`: 3-column strip `[auto_1fr_14rem]`, vertically centered. Upload label `md:sr-only`.
- **Spacing rhythm refinements:**
  - Hero → rule: asymmetric — `mb-7 sm:mb-9` above, `mb-6 sm:mb-7` below. Rule leans toward portrait.
  - Portrait section: `mb-10 sm:mb-12` (down from `mb-14 sm:mb-[4.5rem]`), `pb-6 sm:pb-7` (down from `pb-8 sm:pb-10`)
  - Portrait eyebrow: `mb-4 sm:mb-5` (down from `mb-6`)
- Documentation synced: `PROFILE_PAGE_IMPLEMENTATION.md` fully updated for Phases 1+4

---

## Intentionally postponed

| Item | Status | Notes |
|---|---|---|
| ~~Profile visibility UX~~ | **Done** | Editorial radio-card system, Phase 4 |
| ~~Travel style tags~~ | **Done** | `profiles.travel_styles text[]` column + cardinality CHECK + GIN index; 12-option curated chip grid below bio; max 8 selections enforced in UI, server action, and DB |
| Avatar upload (upload, storage, retrieval, persistence, cleanup) | **Done — Production Verified (June 1, 2026)** | See `docs/testing/AVATAR_UPLOAD_VERIFICATION_REPORT.md` |
| Avatar crop/preview modal | **Implemented — pending QA** | `react-image-crop` + `AvatarCropModal`; 512px max output; original >2MB rejected pre-crop; server action unchanged |
| Profile public view | **Done — Phase 2** | `/members/[username]` — Server Component + `resolve_member_profile` RPC gates |
| Avatar cross-user portrait on member profiles | **Follow-up (storage)** | `avatars` bucket RLS is owner-only SELECT; cross-user `getAvatarSignedUrl` fails → initials fallback. Add visibility-aware storage policy (separate from Phase 2). See `UPLOADS_STORAGE_CONTRACT.md`. |
| Social/link fields | Pending | Low priority; schema extension needed |
| Mobile camera capture | Pending | Nice-to-have; current file picker works |
| Optimistic save feedback | Pending | `router.refresh()` is correct for now |
| Animated save button | Pending | Text-only pending state is sufficient |

---

## Pre-existing lint issues (not introduced here)

Previously present in unrelated files — resolved after pnpm lockfile sync (May 2026):
- `components/cards/save-community-post-button.tsx` — was 2× `react-hooks/set-state-in-effect`
- `components/landing/wes-anderson-hero.tsx` — was 1× `react-hooks/set-state-in-effect`

Lint is now fully clean (0 errors, 0 warnings).

---

## What to tackle next (profile system)

1. **Avatar crop QA** — manual pass on crop modal, save flow, dashboard refresh (see implementation doc QA checklist)
2. ~~**Profile public view**~~ — **Done (Phase 2):** `/members/[username]` with RPC visibility gates  
3. **Avatar storage RLS for cross-user portraits** — visibility-aware SELECT on `avatars` bucket (not blocking Phase 2)

---

## Files changed

```
Phase 1 (882d6a4):
  components/profile/profile-form.tsx       — full structural redesign
  app/globals.css                           — dead CSS removal, editorial-input color fix
  docs/PROFILE_PAGE_IMPLEMENTATION.md       — developer reference (new)
  docs/DOCUMENTATION_INDEX.md              — indexed new doc

Phase 4 (this commit):
  components/profile/profile-form.tsx       — visibility cards, portrait strip, identity grid, spacing
  docs/PROFILE_PAGE_IMPLEMENTATION.md       — fully synced with Phase 4 layout/spacing decisions
  docs/HANDOFF_PROFILE_PHASE1.md           — updated with Phase 4 shipped items and next steps
```
