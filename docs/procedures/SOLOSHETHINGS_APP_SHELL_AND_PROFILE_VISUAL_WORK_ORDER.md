# SoloSHEThings App Shell + Profile Visual Work Order

**Execution batch for extending the warmer, more playful front-end system beyond the dashboard.**

**Status (2026-05-15):** Ready for execution.

**Why this exists:** The dashboard just got a stronger color pass and more personality. The next job is to make the rest of the signed-in shell feel like it belongs to the same product instead of dropping back to quieter/default surfaces.

**Primary source docs:**
- [BRAND_STYLE_GUIDE.md](../BRAND_STYLE_GUIDE.md)
- [UX_REFERENCE_AWA.md](../UX_REFERENCE_AWA.md)
- [SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md](./SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md)
- [LOCAL_CURSOR_WORKFLOW.md](./LOCAL_CURSOR_WORKFLOW.md)
- [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)

**Primary surfaces:**
- `components/layout/SiteHeader.tsx`
- `components/nav/NavClient.tsx`
- `app/(app)/layout.tsx`
- `app/(app)/profile/page.tsx`
- `components/profile/profile-form.tsx`
- any shared authenticated-shell helpers already used by `/dashboard`, `/profile`, `/saved`, `/places`, `/reports`, `/submit`

---

## Batch goal

Make the authenticated shell feel more fun, more premium, and more emotionally consistent.

The user request behind this batch was simple and valid:
- use more of the existing colors
- make the dashboard/app feel better
- make the project feel more fun for users by how it looks

This is **not** a redesign from scratch.
This is a **system extension** batch.

---

## What this batch should cover

### 1) Signed-in shell personality

The header/app shell should feel less like a neutral wrapper and more like part of the brand.

**What to improve:**
- more confident use of the orange / brown / cream / gold palette
- stronger visual distinction between public nav and signed-in nav
- better active-state personality
- more intentional sticky-header behavior
- richer mobile menu treatment without becoming cluttered

**Definition of done:**
- the shell feels branded even before the user scrolls into a page body
- nav states feel deliberate, not generic
- mobile and desktop both still scan clearly

### 2) Profile page as a destination, not just a form

Right now the profile route risks feeling utilitarian.

**What to improve:**
- frame the profile form inside a richer warm shell
- add more obvious section hierarchy
- use color to make completion/progress feel rewarding instead of administrative
- make avatar/upload/edit states feel more premium and less flat
- improve empty/incomplete profile states with more inviting design language

**Definition of done:**
- `/profile` feels like a real part of the product experience
- editing your account feels encouraging, not like filling out paperwork

### 3) Reusable signed-in visual primitives

Do not hand-style every page.

**What to improve:**
- shared “warm panel” / “accent panel” / “dark cocoa panel” patterns
- shared section headers / helper rows / badges where useful
- shared accent background glows or panel depth rules
- consistent button and chip hierarchy across signed-in surfaces

**Definition of done:**
- new surfaces can reuse the same patterns instead of inventing page-local styling
- the palette reads as intentional, not random

---

## Constraints

- Use the existing SoloSHEThings palette already established in `app/globals.css`
- Do not introduce a new UI library
- Do not turn this into a large architecture refactor
- Do not regress auth/navigation clarity
- Keep body text readable; fun should not reduce usability
- Prefer reusable primitives over one-off gradient spam

---

## Acceptance criteria

- signed-in shell feels more branded and alive
- profile page feels meaningfully more polished and welcoming
- color use expands without becoming noisy
- mobile nav still behaves well
- the new visual language can be reused on `/places`, `/saved`, `/reports`, and `/submit`

---

## Verification

Run:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Then manually review:
1. header before and after scroll
2. mobile nav open/close behavior
3. `/dashboard` to `/profile` transition
4. profile form on mobile and desktop
5. any new hover/focus states for readability and contrast

---

## Cursor prompt pack

### Prompt 1 — signed-in header color pass

You are working in the SoloSHEThings repo.

Read first:
- `docs/BRAND_STYLE_GUIDE.md`
- `docs/UX_REFERENCE_AWA.md`
- `docs/procedures/SOLOSHETHINGS_APP_SHELL_AND_PROFILE_VISUAL_WORK_ORDER.md`
- `components/layout/SiteHeader.tsx`
- `components/nav/NavClient.tsx`
- `app/globals.css`

Goal:
Make the signed-in header/nav feel warmer, more colorful, and more premium using the existing orange/brown/cream/gold palette.

Constraints:
- do not add a new UI library
- do not reduce readability
- do not overdo gradients or make the nav noisy
- keep mobile behavior solid
- prefer reusable CSS primitives or shared classes over page-local hacks

Definition of done:
- auth nav feels more intentional than it does now
- active states feel special but still clean
- mobile menu feels branded
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass

### Prompt 2 — profile page shell upgrade

Read first:
- `docs/procedures/SOLOSHETHINGS_APP_SHELL_AND_PROFILE_VISUAL_WORK_ORDER.md`
- `app/(app)/profile/page.tsx`
- `components/profile/profile-form.tsx`
- `app/globals.css`

Goal:
Turn `/profile` into a richer destination instead of a plain edit form.

What to improve:
- stronger page intro / hierarchy
- warm branded shells around editing controls
- more satisfying progress/completion treatment
- nicer avatar/upload area presentation
- better incomplete-state visual design

Constraints:
- keep the form honest and functional
- do not break server/client boundaries
- do not hide important form states behind decorative styling

Definition of done:
- profile page feels premium and coherent with the dashboard
- the page is more fun and inviting without feeling childish
- all validation and form behavior still work
- typecheck/lint/build pass

### Prompt 3 — signed-in visual primitives pass

Read first:
- `docs/procedures/SOLOSHETHINGS_APP_SHELL_AND_PROFILE_VISUAL_WORK_ORDER.md`
- `app/globals.css`
- `app/(app)/dashboard/page.tsx`
- `components/nav/NavClient.tsx`
- `components/profile/profile-form.tsx`

Goal:
Extract or strengthen reusable visual primitives for signed-in surfaces so color and card styles can be reused across profile/community pages.

Examples:
- warm panel classes
- ember accent panel classes
- darker cocoa panel classes
- section heading treatments
- badge/chip styling helpers

Do not:
- create a giant abstraction layer
- move everything into a design system folder unless it clearly reduces duplication

Definition of done:
- signed-in surfaces share obvious reusable patterns
- the CSS feels more systematic
- no visual drift is introduced
- typecheck/lint/build pass

### Prompt 4 — mobile delight without chaos

Read first:
- `docs/procedures/SOLOSHETHINGS_APP_SHELL_AND_PROFILE_VISUAL_WORK_ORDER.md`
- `components/nav/NavClient.tsx`
- `components/profile/profile-form.tsx`

Goal:
Improve the emotional feel of the authenticated experience on mobile while keeping it clear and usable.

Focus on:
- spacing rhythm
- button hierarchy
- panel stacking
- avatar/form presence
- menu clarity

Avoid:
- tiny text
- overpacked cards
- long centered paragraphs
- decorative changes that make touch targets worse

Definition of done:
- mobile feels intentionally designed, not just squeezed desktop UI
- build/lint/typecheck pass

### Prompt 5 — final shell/profile polish + docs sync

Read first:
- `docs/procedures/SOLOSHETHINGS_APP_SHELL_AND_PROFILE_VISUAL_WORK_ORDER.md`
- `docs/DOCUMENTATION_INDEX.md`
- `docs/BRAND_STYLE_GUIDE.md`

Goal:
Finish the shell/profile visual batch cleanly and update docs only if the visual system changed in a way future work should follow.

Deliverables:
- concise summary of what changed
- note any new reusable classes or patterns
- keep docs truthful and minimal
- do not create duplicate docs for the same visual rule

Definition of done:
- code is clean
- docs match reality where needed
- typecheck/lint/build pass
