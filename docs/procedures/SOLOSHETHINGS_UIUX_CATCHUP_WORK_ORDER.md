# SoloSHEThings UI/UX Catch-Up Work Order

**Execution batch for bringing the product experience layer up to the level of the already-shipped functionality.**

**Status (2026-05-15):** Ready for execution as a **safe parallel lane** while Supabase CI/CD recovery remains the active operational blocker.

**Why this exists:** SoloSHEThings is no longer a simple landing-page/blog concept. It is now a mobile-first member platform with public editorial content, authenticated community surfaces, Stripe subscription gates, moderation, uploads, Sentry/product signals, and a first-pass visual system. The current opportunity is not random new UI. The current opportunity is to make the existing product feel intentional, premium, scannable, safe, and complete.

**Primary source docs:**
- [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)
- [MVP_STATUS_NOTION.md](../MVP_STATUS_NOTION.md)
- [BRAND_STYLE_GUIDE.md](../BRAND_STYLE_GUIDE.md)
- [UX_REFERENCE_AWA.md](../UX_REFERENCE_AWA.md)
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](../contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- [DATA_ACCESS_QUERY_CONTRACT.md](../contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- [AUTH_CONTRACT.md](../contracts/AUTH_CONTRACT.md)
- [UPLOADS_STORAGE_CONTRACT.md](../contracts/UPLOADS_STORAGE_CONTRACT.md)
- [BILLING_STRIPE_CONTRACT.md](../contracts/BILLING_STRIPE_CONTRACT.md)
- [MONITORING_SENTRY_POSTURE.md](../proof/MONITORING_SENTRY_POSTURE.md)

**Important implementation truth:** the live product palette is the warm editorial system documented in `app/globals.css` and `BRAND_STYLE_GUIDE.md` (orange / brown / cream / gold / gray / dark). Older blue-heavy drafts are not the source of truth anymore.

---

## Product truth before doing this batch

### What SoloSHEThings already is

SoloSHEThings is now a real product with:
- public editorial routes (`/`, `/about`, `/pricing`, `/blog`, `/blog/[slug]`, `/contact`, `/collections`, `/map`)
- auth routes (`/login`, `/signup`)
- member routes (`/dashboard`, `/profile`, `/submit`, `/places`, `/places/[slug]`, `/saved`, `/reports`, `/subscribe`)
- admin route (`/admin/moderation`)
- profile management and avatar uploads
- community submissions, saved stories, reporting, owner story management, and moderation
- Stripe checkout + entitlement gates
- honest marketing-interest capture
- Sentry monitoring and product-signal instrumentation
- a first-pass shared visual system across signed-in/community surfaces

### What is still weak

The product is functionally ahead of its presentation.

The biggest UX gap is the **product experience layer**:
- the dashboard is still closer to a shell than a rich member home base
- blog/editorial can look more publication-grade
- empty/loading/error states need stronger design language
- trust/safety/privacy cues should be more visible
- community cards need a tighter reusable visual language
- mobile-first polish needs a more deliberate audit pass

### Operational constraint while this batch runs

The canonical active blocker remains:
- `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`

This UI/UX batch is allowed as a **safe parallel lane** only when it avoids:
- schema changes
- migration changes
- RLS/policy changes
- new protected behavior
- billing/auth logic changes

This is a design-system and UX-composition batch, not an infrastructure or product-scope expansion batch.

---

## UX diagnosis

The product should increasingly feel like all five of these at once:

1. **A trustworthy travel publication**
2. **A private member community**
3. **A calm dashboard for solo travelers**
4. **A premium subscription product**
5. **A safe, privacy-aware platform**

That means the work here should focus on:
- visual hierarchy
- layout consistency
- mobile-first polish
- editorial readability
- dashboard usefulness
- empty/loading/error states
- accessibility
- conversion paths
- trust and safety signals

Not just gradients. Not just “make it modern.”

---

## Best-practice lens for this batch

Use this batch to apply grounded UX principles to the actual product:

### 1) Visibility of system status

Users should always understand what is:
- saved
- reported
- public
- private
- featured
- archived
- premium-gated
- awaiting moderation

### 2) Match the user’s language

Use user-facing language like:
- stories
- places
- saved
- privacy
- membership
- report
- journey

Avoid internal engineering language leaking into UI copy.

### 3) Recognition over recall

The app should not make members remember where common actions live.

Important actions should be surfaced clearly:
- submit a story
- browse places
- revisit saved stories
- edit profile
- review reports
- manage owner content

### 4) Minimal but premium

Remove visual clutter, but do not flatten the product into generic SaaS minimalism.

### 5) Mobile-first accessibility

Treat these sizes as first-class review targets:
- 320px
- 375px
- 390px
- 768px
- desktop

---

## What this batch should cover

### 1) Dashboard as a real member home base

The dashboard should answer immediately:
- Who am I here?
- What can I do next?
- What is my membership status?
- What stories have I submitted?
- What have I saved?
- What needs attention?
- What is public vs private?

**Recommended modules:**
- welcome card with profile completion state
- membership status card (`limited` vs `full`, plus subscribe path when needed)
- quick actions
- recent activity modules when existing data makes that honest
- privacy/safety reminder
- admin moderation entry when `role === 'admin'`
- designed empty states

**Definition of done:** dashboard feels like a useful member home, not only a shell.

### 2) Blog/editorial publication upgrade

The blog should feel like a trusted solo-travel publication.

**Recommended improvements:**
- stronger blog index hero
- featured/latest article treatment
- category/topic chips if the data path supports them honestly
- better article cards (image, title, excerpt, date, reading cues)
- stronger `/blog/[slug]` template with hero image, deck/subtitle, metadata row, related posts or fallback CTA, community/subscription CTA, better prose styling
- better empty/fallback state when WordPress is unavailable

**Definition of done:** editorial feels publication-grade, not like a thin content list.

### 3) Community card system refinement

Every story card across `/places`, `/saved`, `/reports`, and related surfaces should consistently communicate:
- image or graceful placeholder
- title
- storyteller/member
- place label
- tags/topics
- visibility badge (`Public`, `Private`, `Featured`)
- saved state
- report state where relevant
- primary CTA and appropriate secondary actions

**Definition of done:** community surfaces feel like one card family, not page-local variants.

### 4) Empty, loading, and error states that feel designed

Add or strengthen reusable patterns like:
- `EmptyState`
- `LoadingState`
- `ErrorRecoveryCard`
- `UpgradePrompt`
- `PrivacyNotice`
- `ProfileCompletionCard`
- `NoResultsState`

**Definition of done:** no important surface feels visually abandoned when there is no data or something goes wrong.

### 5) Trust and safety visibility

Because this is a privacy-aware solo-travel platform, the UI should show reassurance more clearly around:
- privacy toggles
- public/private visibility
- report status
- moderation state
- safe upload expectations
- what membership unlocks

**Definition of done:** trust/safety feels visible, not hidden in product assumptions.

### 6) Mobile-first polish and accessibility audit

Use the existing routes to do a real composition pass:
- no horizontal overflow
- large tap targets
- filter chips that wrap or scroll intentionally
- stacked cards with clear actions
- digestible form sections
- visible keyboard focus
- readable contrast

**Definition of done:** the product holds up at mobile widths without looking like squeezed desktop UI.

---

## Suggested execution order

### Phase A — Audit first (no coding)

Before changing code, inspect the current surfaces and produce a concise route-by-route plan covering:
- existing shared primitives
- repeated page-local styles that should become reusable
- routes with weakest visual hierarchy
- accessibility/mobile risks
- proposed files to change

### Phase B — Shared primitives

Strengthen shared components/utilities before doing page-by-page polish.

Examples:
- `components/ui/empty-state.tsx`
- `components/ui/section-header.tsx`
- `components/ui/status-badge.tsx`
- `components/ui/filter-chip.tsx`
- `components/ui/metric-card.tsx`
- `components/ui/action-card.tsx`
- shared blog/community/dashboard card wrappers

### Phase C — Dashboard + profile

Use the dashboard/profile routes to establish the signed-in member-home tone.

### Phase D — Blog/public editorial

Upgrade publication quality on `/blog` and `/blog/[slug]` without changing the WordPress contract.

### Phase E — Member workspace polish

Polish `/places`, `/saved`, `/reports`, `/submit`, and `/places/[slug]`.

### Phase F — Empty/loading/error + mobile QA

Finish with state design and mobile/accessibility cleanup.

### Phase G — Docs sync

Only update docs where reusable patterns or execution guidance truly changed.

---

## Hard constraints

Do **not**:
- add or edit migrations
- change Supabase policies/RLS
- bypass auth boundaries
- change Stripe entitlement logic
- change WordPress behavior beyond visual fallbacks/composition
- claim marketing automation exists when it does not
- invent analytics dashboards beyond raw `product_signal` logs unless explicitly requested
- duplicate styling locally when shared primitives already exist
- treat old draft brand colors as authoritative over `BRAND_STYLE_GUIDE.md`

---

## Acceptance criteria

This batch is done only when:
- the dashboard clearly communicates status and next actions
- the blog feels publication-grade
- member/community surfaces share one coherent card/chip/badge language
- empty/loading/error states feel intentional
- trust/safety/private/public status is easier to understand
- mobile layouts work at 320px / 375px / 390px / tablet / desktop
- no contracts, schema, auth, or RLS behavior were changed
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass

---

## Cursor prompt pack

### Prompt 1 — audit before coding

Audit the SoloSHEThings UI/UX without coding yet.

Read:
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- `docs/MVP_STATUS_NOTION.md`
- `docs/BRAND_STYLE_GUIDE.md`
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `app/globals.css`
- `app/(public)/blog/page.tsx`
- `app/(public)/blog/[slug]/page.tsx`
- `app/(app)/dashboard/page.tsx`
- `app/(app)/places/page.tsx`
- `app/(app)/places/[slug]/page.tsx`
- `app/(app)/saved/page.tsx`
- `app/(app)/reports/page.tsx`
- `app/(app)/submit/page.tsx`
- `app/(app)/profile/page.tsx`
- `components/community/*`
- `components/nav/*`

Return only:
1. current visual strengths
2. current UX weaknesses
3. reusable components/utilities that should be created or improved
4. route-by-route polish plan
5. risks / contract boundaries
6. recommended implementation order

Do not edit files yet.

### Prompt 2 — shared UI primitives pass

You are working in the SoloSHEThings repo.

Read first:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `docs/BRAND_STYLE_GUIDE.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `app/globals.css`
- current shared UI/community components

Goal:
Create or improve reusable UI primitives for empty states, section headers, chips/badges, action cards, and metric/status cards so later route work is more consistent.

Constraints:
- no schema or data-access changes
- no new UI library
- prefer existing primitives first
- avoid giant abstractions

Run `pnpm typecheck`, `pnpm lint`, `pnpm build` before finishing.

### Prompt 3 — dashboard + profile home-base pass

Read first:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `app/(app)/dashboard/page.tsx`
- `app/(app)/profile/page.tsx`
- `components/profile/profile-form.tsx`
- relevant shared components

Goal:
Make the dashboard and profile routes feel like a calm, premium member home base.

Focus on:
- status clarity
- membership cues
- profile completion
- recent-activity or empty-state framing when current data supports it honestly
- privacy/public-vs-private guidance
- reusable section hierarchy

Do not add new unsafe queries or change auth rules.

Run `pnpm typecheck`, `pnpm lint`, `pnpm build`.

### Prompt 4 — blog publication-grade pass

Read first:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `docs/WORDPRESS_SUPABASE_BLUEPRINT.md`
- `app/(public)/blog/page.tsx`
- `app/(public)/blog/[slug]/page.tsx`
- blog/shared public components

Goal:
Make `/blog` and `/blog/[slug]` feel like a trusted solo-travel publication without changing WordPress contracts.

Focus on:
- featured/latest article treatment
- stronger hero/metadata/prose hierarchy
- related posts or fallback CTA
- better empty/fallback states when WordPress is unavailable
- tasteful membership/community conversion points

Do not change fetch architecture or sanitize rules unless required for a visual fallback.

Run `pnpm typecheck`, `pnpm lint`, `pnpm build`.

### Prompt 5 — community-card family pass

Read first:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `components/community/community-story-surface.tsx`
- `app/(app)/places/page.tsx`
- `app/(app)/saved/page.tsx`
- `app/(app)/reports/page.tsx`
- `app/(app)/places/[slug]/page.tsx`

Goal:
Create a stronger shared community-card language across browse, saved, reports, and detail surfaces.

Focus on:
- consistent card hierarchy
- clearer state badges
- report/saved/private/public/featured visibility
- improved scanability and CTA hierarchy

Do not change privacy or list-context behavior.

Run `pnpm typecheck`, `pnpm lint`, `pnpm build`.

### Prompt 6 — submit + trust/safety UX pass

Read first:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `docs/contracts/UPLOADS_STORAGE_CONTRACT.md`
- `app/(app)/submit/page.tsx`
- submit-related shared components

Goal:
Make `/submit` feel like a trustworthy creative workspace with better trust/safety communication.

Focus on:
- section framing
- upload-state reassurance
- archived/published/manage-state clarity
- privacy/public messaging
- better empty/error/help states

Do not change storage or moderation behavior.

Run `pnpm typecheck`, `pnpm lint`, `pnpm build`.

### Prompt 7 — mobile/accessibility cleanup pass

Read first:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- touched routes/components from the earlier phases

Goal:
Do a mobile-first accessibility and composition cleanup across the polished surfaces.

Check:
- 320px / 375px / 390px / tablet / desktop layouts
- no horizontal overflow
- focus visibility
- tap targets
- heading clarity
- contrast/readability

Run `pnpm typecheck`, `pnpm lint`, `pnpm build`.

### Prompt 8 — final docs + verification summary

Read first:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`
- `docs/DOCUMENTATION_INDEX.md`
- `docs/BRAND_STYLE_GUIDE.md`
- any touched work-order docs

Goal:
After the implementation pass, update docs only where reusable UI rules or work-order guidance changed materially.

Return:
1. summary of improvements
2. files changed
3. route-by-route UX impact
4. accessibility notes
5. anything intentionally not changed
6. verification results

Keep docs honest and non-duplicative.
