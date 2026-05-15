# SoloSHEThings Community Visual Joy Work Order

**Execution batch for making the signed-in community surfaces feel more alive, playful, and premium.**

**Status (2026-05-15):** Ready for execution.

**Why this exists:** `/places`, `/saved`, `/reports`, and `/submit` already do real work. The next opportunity is to make them feel better — more colorful, more expressive, more memorable — without losing trust, clarity, or privacy boundaries.

**Primary source docs:**
- [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)
- [BRAND_STYLE_GUIDE.md](../BRAND_STYLE_GUIDE.md)
- [UX_REFERENCE_AWA.md](../UX_REFERENCE_AWA.md)
- [DATA_ACCESS_QUERY_CONTRACT.md](../contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](../contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- [UPLOADS_STORAGE_CONTRACT.md](../contracts/UPLOADS_STORAGE_CONTRACT.md)

**Primary surfaces:**
- `app/(app)/places/page.tsx`
- `app/(app)/places/[slug]/page.tsx`
- `app/(app)/saved/page.tsx`
- `app/(app)/reports/page.tsx`
- `app/(app)/submit/page.tsx`
- shared community UI in `components/community/` and `components/cards/`

---

## Batch goal

Take the community/member surfaces from “functional and warm” to “distinctive and fun to use.”

This batch is about:
- more expressive use of the existing palette
- stronger surface differentiation
- more satisfying cards, headers, empty states, and action areas
- better emotional reward for browsing, saving, reporting, and publishing

It is **not** about changing privacy behavior or inventing fake product scope.

---

## What this batch should cover

### 1) Community browse surfaces with more visual energy

`/places` and `/saved` should feel rich and browseable, not just filtered lists.

**What to improve:**
- stronger hero/header treatment
- more engaging filter and summary areas
- better visual rhythm between cards and sections
- improved use of accent colors for featured, saved, yours, reported, with-photos states
- clearer differentiation between ordinary list content and important highlights

**Definition of done:**
- list surfaces feel like product destinations, not utility pages
- color creates clarity and delight, not clutter

### 2) Story detail and report history polish

Story detail/report surfaces should feel thoughtful and emotionally coherent.

**What to improve:**
- story detail section hierarchy
- related-story and back-navigation presentation
- nicer moderation/report status visuals
- more premium treatment for side info and metadata
- stronger empty/report-history states where current treatment feels plain

**Definition of done:**
- detail/report surfaces feel polished enough to match the dashboard tone
- important trust/safety states stay clear

### 3) Submit flow visual encouragement

Publishing should feel encouraging and creative.

**What to improve:**
- submit page intro / page shell
- image-upload and submission-history presentation
- better emotional reward after saving/submitting
- clearer separation between drafting, managing, archived, and published states

**Definition of done:**
- `/submit` feels like a creative workspace, not just a form stack
- the experience still reads clearly on mobile

### 4) Shared community styling patterns

Make sure the improvements are reusable.

**What to improve:**
- shared card treatments for member/community surfaces
- shared badge tones for featured/saved/report/admin-type states
- reusable empty-state and summary-row patterns
- consistent hover/focus transitions

**Definition of done:**
- the community surfaces feel like one visual family
- future passes can extend the system without page-by-page drift

---

## Constraints

- Keep privacy and RLS boundaries intact
- Do not fake new product functionality through visual language
- Do not break list/detail/history context preservation
- No new UI library
- Avoid generic SaaS defaults and avoid random “rainbow” styling
- Use the existing SoloSHEThings palette more boldly, not a different palette

---

## Acceptance criteria

- `/places`, `/saved`, `/reports`, and `/submit` feel more joyful and intentional
- featured/saved/reported/private/public states read more clearly and attractively
- story-detail and history surfaces feel richer and easier to scan
- mobile layouts still feel composed and readable
- typecheck/lint/build pass after the batch

---

## Verification

Run:
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Manually review:
1. `/places` on mobile + desktop
2. `/saved` on mobile + desktop
3. `/reports` state badges and empty/history variants
4. `/submit` create/manage/archive flow
5. `/places/[slug]` detail + related-story flow

---

## Cursor prompt pack

### Prompt 1 — `/places` visual energy pass

You are working in the SoloSHEThings repo.

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `docs/BRAND_STYLE_GUIDE.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `app/(app)/places/page.tsx`
- relevant shared community components

Goal:
Make `/places` feel more premium, colorful, and fun to browse using the existing orange/brown/cream/gold system.

Focus on:
- header/hero treatment
- active filter area
- summary chips/badges
- story card hierarchy
- featured/high-signal content treatment

Do not:
- change query semantics without a real need
- break filter preservation or privacy rules
- add fake AI or recommendation copy

Definition of done:
- `/places` is more visually magnetic and easier to scan
- behavior remains intact
- typecheck/lint/build pass

### Prompt 2 — `/saved` visual library upgrade

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `app/(app)/saved/page.tsx`
- shared saved/community card components

Goal:
Make `/saved` feel like a real personal library instead of only a filtered list.

Focus on:
- stronger library-like header
- richer saved-card presentation
- better empty states and filter states
- more satisfying remove/cleanup affordances
- use color to separate public/private/featured/reported states more clearly

Definition of done:
- `/saved` feels more personal and polished
- the page is visually richer without getting busy
- typecheck/lint/build pass

### Prompt 3 — `/reports` trust-and-clarity polish

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `app/(app)/reports/page.tsx`
- any report status badge helpers/components

Goal:
Give `/reports` a stronger visual treatment that still feels calm, trustworthy, and legible.

Focus on:
- report status badge hierarchy
- better summary/header treatment
- improved empty states and filtered states
- visual distinction between reviewed/resolved/dismissed/withdrawn states

Avoid:
- flashy styling that undermines trust
- vague status treatment

Definition of done:
- report history feels more intentional and readable
- trust/safety clarity improves, not just aesthetics
- typecheck/lint/build pass

### Prompt 4 — `/submit` creative-workspace pass

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `docs/contracts/UPLOADS_STORAGE_CONTRACT.md`
- `app/(app)/submit/page.tsx`
- `app/actions/community-posts.ts`
- relevant upload/submit components

Goal:
Make `/submit` feel more like a creative workspace and less like a basic form page.

Focus on:
- intro panel and page framing
- form section hierarchy
- image upload presentation
- submission history visuals
- archived/published/manage states

Do not:
- change storage/privacy behavior unless truly required
- create fake autosave/draft claims

Definition of done:
- the page feels more encouraging and premium
- the creative flow is clearer
- typecheck/lint/build pass

### Prompt 5 — story detail delight pass

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `app/(app)/places/[slug]/page.tsx`
- related story/detail shared components

Goal:
Make story detail feel more immersive and editorial while staying within the real product boundaries.

Focus on:
- title/meta hierarchy
- photo/story section treatment
- related stories area
- back-navigation and workspace-return links
- better use of accent colors for important metadata

Definition of done:
- story detail feels more memorable and premium
- navigation context remains clear
- typecheck/lint/build pass

### Prompt 6 — shared community card/badge system pass

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `app/globals.css`
- community cards/components in `components/community/` and `components/cards/`

Goal:
Strengthen reusable community card and badge patterns so the color/storytelling improvements are systemic instead of page-local.

Examples:
- featured badge tone
- reported-by-you tone
- private/public chips
- saved-state styling
- reusable warm/dark panel variants

Definition of done:
- shared component styling is more cohesive
- repeated visual rules are centralized where practical
- typecheck/lint/build pass

### Prompt 7 — mobile-first visual cleanup on community surfaces

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `/places`, `/saved`, `/reports`, `/submit`, and related shared components

Goal:
Make the colorful visual pass hold up on mobile.

Focus on:
- spacing compression
- chip wrapping
- card stacking
- scroll rhythm
- CTA placement
- avoiding overlong hero/header blocks on small screens

Definition of done:
- mobile looks intentional and readable
- the pages still feel fun, not cramped
- typecheck/lint/build pass

### Prompt 8 — docs/truth sync after the visual pass

Read first:
- `docs/procedures/SOLOSHETHINGS_COMMUNITY_VISUAL_JOY_WORK_ORDER.md`
- `docs/BRAND_STYLE_GUIDE.md`
- `docs/DOCUMENTATION_INDEX.md`

Goal:
After the community visual pass is implemented, update docs only where the visual system now has reusable patterns future work should follow.

Rules:
- do not duplicate the work order into multiple docs
- keep notes concise and source-of-truth oriented
- do not claim features that are not actually shipped

Definition of done:
- docs stay honest and useful
- typecheck/lint/build pass after final code changes
