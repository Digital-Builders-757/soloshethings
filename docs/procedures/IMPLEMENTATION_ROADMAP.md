# Implementation Roadmap

**Purpose:** canonical current execution plan and resume guide for SoloSHEThings.

**Status:** ✅ CANONICAL
**Owner:** Procedures Layer
**Last Updated:** 2026-06-01

---

## What this document is for

Use this file for **what to build next** and **how to resume work quickly**.

Use these companion docs for everything else:
- `docs/MVP_STATUS_NOTION.md` — canonical shipped status + progress history
- `docs/DOCUMENTATION_INDEX.md` — canonical doc map
- `docs/contracts/` — live behavior rules
- `docs/proof/` — QA, smoke, and monitoring expectations
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md` — historical May 2026 catch-up archive
- `docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md` — historical post-catch-up checkpoint archive

---

## Current repo state

### Active operational blocker

- **Supabase hosted migration CI/CD recovery (2026-05-15)** — GitHub Actions migration workflows exist for `develop` and `main`, but rollout/debugging exposed repeated confusion around GitHub secret scope, project-ref injection, and staging/production DB password pairing. Treat this as the current recovery lane until at least staging `supabase db push` is boring again. Work-order anchor: `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`.

### Completed checkpoints

- Catch-up batches **1–5** are complete for the May 2026 smoke + release milestone.
- The follow-on finish-line batches for auth reliability, frontend/system cleanup, and docs/prompt cleanup are complete.
- Since those checkpoints, the repo has also shipped:
  - profile continuity improvements and private avatar uploads
  - authenticated `/submit` with real community post image uploads
  - authenticated `/places`, `/saved`, and `/reports` member surfaces
  - owner story edit/archive/restore/photo-management controls
  - discovery/search/filter/load-more/member-filter polish across member surfaces
  - hosted Supabase storage setup documentation for Dashboard SQL
  - webpack build/dev defaults and recent auth redirect/schema fixes
  - **Observability + error UX (2026-05-14)** — structured server logging (`logServerFailure` in `lib/server-log.ts`), safe Supabase mapping plus `safeThrownErrorMessage` for deliberate throws (`lib/supabase-errors.ts`), Sentry bootstrap/wiring, on-brand `app/error.tsx` / `app/global-error.tsx` (Sentry only when `NEXT_PUBLIC_SENTRY_DSN` is set), honest machine-facing responses for WordPress revalidate/preview, and profile/WP read paths using the shared logger instead of ad hoc `console.error`.
  - **Stripe subscription + premium gating (2026-05-14)** — `/pricing`, `/subscribe` Checkout, `POST /api/webhooks/stripe` + `stripe_webhook_ledger`, Supabase-only entitlements and `community_post_reads` free-tier read caps.

  - **Community second-pass depth (2026-05-15)** — optional `place_label` + capped `story_tags` on `community_posts` (migration `20260515194500_community_place_label_story_tags.sql`), honest `/places` facet chips + `place`/`topic`/`sort` query helpers, stronger `getCommunityRelatedPosts` ranking from shared anchors/tags (no ML), owner `post_images` alt + reorder via new `UPDATE` RLS policy (`app/actions/community-posts.ts`, `components/submit/owner-post-image-manager.tsx`).
  - **Moderation operator increment (2026-05-16)** — migration `20260516203000_moderation_admin_rls_reports.sql`, `/admin/moderation`, reporter `withdraw_post_report`, admin-only `moderator_update_report`, `withdrawn` report status surfaced across member UIs, owner permanent-remove confirmation.
  - **Honest homepage marketing-interest capture (2026-05-17)** — `marketing_interest` table + `/` newsletter panel (`submitMarketingInterest`, service role insert/update); no outbound marketing/automation bundled.
  - **Product learning signals (2026-05-17)** — `captureProductSignal` Sentry **Logs** (`Sentry.logger.info`, attribute `product_signal`: signup, Stripe checkout open/return, community post create/save, report filed); muted with `DISABLE_PRODUCT_SIGNALS`; see `MONITORING_SENTRY_POSTURE.md`.
  - **Profile system v1.3 + community integration (2026-06)** — public `/members/[username]` with RPC visibility gates; avatar visibility storage policies; shared `MemberProfileLink` / `CommunityAuthorPreview`; community author rows link to member profiles; branded enumeration-safe member not-found.
  - **UI/UX catch-up pass (2026-06-01)** — roadmap item **#2** complete per `SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md` (Phases A–G, Prompts 1–8). Shared UI primitives (`EmptyState`, `NoResultsState`, `SectionHeader`, `StatusBadge`, `UpgradePrompt`, `LoadingState`, `ErrorRecoveryCard`), dashboard/profile home-base polish, blog editorial adoption, `CommunityStoryCard` / `CommunityReportCard` family, `/submit` trust/safety workspace pass, empty/loading/error + mobile/a11y cleanup. Visual/composition only — no schema, RLS, auth, billing, or workflow changes.

### Live in-progress work

- **Mandatory operational lane:** hosted Supabase migration stability / secret-scope recovery (`SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`)
- **Product queue remains paused behind the blocker above** unless the work in hand is clearly unrelated or safely visual-only.

### Resume pointer

- **Branch target:** `develop`
- **Operational recovery doc:** `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`
- **Latest shipped batch (2026-06-01):** UI/UX catch-up pass complete — shared member/community UI primitives, card family, submit trust workspace, loading/error recovery, mobile/a11y composition fixes. Work-order record: `SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md`.
- **Prior batch (2026-05-17):** truthful `marketing_interest` UX + **`product_signal`** instrumentation + doc sync across work orders (`MONITORING_SENTRY_POSTURE`, QA proofs).
- **Known verification note:** the production build may still emit non-blocking `Critical dependency: the request of a dependency is an expression` warnings from Sentry/OpenTelemetry transitive packages during webpack; treat as upstream noise unless the build fails or runtime breaks.
- **Next focus after recovery:** ESP-backed broadcasts / richer analytics dashboards **only when** ops justifies (`SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md` §2–§3 stretch).

---

## Canonical current plan

Work top to bottom unless a regression or blocker forces a reorder.

### 1) Supabase hosted migration recovery — 🚧 ACTIVE OPERATIONAL BLOCKER

**Goal:** make GitHub Actions hosted Supabase migration deploys (`supabase link` → `supabase db push`) reliable again by fixing secret scope, project-ref injection, and DB password pairing confusion.

**Work order anchor:** `docs/procedures/SOLOSHETHINGS_SUPABASE_CICD_RECOVERY_WORK_ORDER.md`

**What this covers:**
- repository secrets vs environment secrets vs GitHub Agents secret confusion
- staging / production project-ref pairing
- staging / production database password pairing
- workflow validation without thrashing app code or Vercel deploys

**Definition of done:** staging hosted migration run is boring; production path is either validated or blocked by one explicit documented issue.

### 2) UI/UX catch-up pass — ✅ SHIPPED (2026-06-01)

**Goal:** close the product-experience gap between the already-shipped functionality and the current presentation so SoloSHEThings feels like a trustworthy travel publication, private member community, calm member dashboard, premium subscription product, and privacy-aware platform.

**Work order anchor:** `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md` (Phases A–G complete; Prompts 1–8 complete)

**Shipped highlights:**
- Shared UI primitives: `EmptyState`, `NoResultsState`, `SectionHeader`, `StatusBadge`, `UpgradePrompt`, `LoadingState`, `ErrorRecoveryCard`, `PrivacyNotice`
- Dashboard + profile member-home polish; blog index/slug editorial adoption
- Community card family: `CommunityStoryCard`, `CommunityReportCard` on `/places`, `/saved`, `/reports`, related grid on `/places/[slug]`
- `/submit` trust/safety workspace pass (upload/privacy/moderation copy, lifecycle badges, designed empties)
- Auth/app loading skeletons; blog segment `not-found`; filtered-list `NoResultsState`; mobile footer stacking + keyboard focus on community nav/cards

**Verification (2026-06-01):** `pnpm typecheck`, `pnpm lint`, `pnpm build` pass.

**Hard guardrail honored:** no schema, migrations, RLS, auth, billing, or protected-behavior changes in this lane.

### 3) Community second-pass depth — ✅ SHIPPED (2026-05-15)

Honest taxonomy + place anchors tied to publisher input, deterministic related-story ranking within RLS-visible candidates, richer owner media controls (description + ordering), feed sort + anchored discovery UX on `/places`.

**Implementation pointers:** [`lib/community-story-taxonomy.ts`](../../lib/community-story-taxonomy.ts), [`lib/queries/community-posts.ts`](../../lib/queries/community-posts.ts), migration `supabase/migrations/20260515194500_community_place_label_story_tags.sql`.

**Historical work-order notes:** `docs/procedures/SOLOSHETHINGS_COMMUNITY_DEPTH_WORK_ORDER.md` (execution checklist / context).

### 4) Moderation/admin surfaces + owner lifecycle depth — ✅ First pass shipped (2026-05-16)

**Goal:** follow the member-facing community work with the operational surfaces that keep it manageable.

**Work order anchor:** `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`

**Shipped in this increment:**
- Platform role `profiles.role = 'admin'` plus `/admin/moderation` queue (App Router + RLS-backed reads)
- Reporter-only `withdraw_post_report`, admin-only `moderator_update_report`, `report_status.withdrawn`, audited `reviewed_at` / `reviewed_by`
- Owner **permanent remove** with destructive-action guardrails (complements archive/restore)

**Still open / intentionally out of scope for this increment:**
- Rich editorial workflows, analytics dashboards, non-post report targets
- Optional future admin post-creation tooling if product priorities change

### 5) Newsletter + marketing operations follow-through — 🚧 Bounded capture shipped

**Goal:** Replace placeholder marketing CTAs with **honest, operations-friendly** tooling while larger ESP integrations stay optional.

**Work order anchor:** `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`

**Shipped in this increment (2026-05-17):**
- `marketing_interest` table migration (`supabase/migrations/20260517194500_marketing_interest_newsletter_capture.sql`)
- Authentic public homepage form routed through **`submitMarketingInterest`** (`app/actions/marketing-interest.ts`) via **service-role** inserts/updates (`SUPABASE_SERVICE_ROLE_KEY`)
- UI + success/error copy stating **explicitly** that automated marketing sends are **not wired** yet; operators manually export/import

**Companion backlog deliverable (prompt pack Prompt 3, 2026-05-17):**

- Coarse **`product_signal.*`** funnel signals emitted via **`captureProductSignal`** ([`lib/analytics/product-signals.ts`](../../lib/analytics/product-signals.ts)); query **Sentry Logs** via attribute **`product_signal`** — opt out globally with **`DISABLE_PRODUCT_SIGNALS=1`**.

**Still deliberate follow-up (explicitly optional / backlog-driven):**
- ESP audience sync & scheduled campaigns
- Double opt-in or compliance tooling if/when broadcasts begin
- Dedicated dashboards interpreting `product_signal` volume beyond raw **Sentry Logs** search

## Priority override rule

If a regression appears in auth, access control, billing, or data safety, fix that first even if it interrupts the queue above.

---

## Historical work-order map

These files remain useful as **completed batch records / implementation notes**, not as the active queue:
- `docs/procedures/SOLOSHETHINGS_UIUX_CATCHUP_WORK_ORDER.md` (UI/UX catch-up — **complete 2026-06-01**)
- `docs/procedures/SOLOSHETHINGS_AUTH_DASHBOARD_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_AUTH_RELIABILITY_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_FRONTEND_SYSTEM_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_DOCS_PROMPT_PIPELINE_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_SITE_POLISH_PERFORMANCE_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_LAUNCH_HARDENING_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_SMOKE_AND_RELEASE_WORK_ORDER.md`

Only reopen one of those if a regression sends work back into that lane.

---

## Resume checklist

When resuming SoloSHEThings work, read in this order:
1. `docs/procedures/IMPLEMENTATION_ROADMAP.md`
2. `docs/MVP_STATUS_NOTION.md`
3. the contract docs for the active lane
4. the proof docs for the active lane
5. the relevant historical work order only if you need prior batch notes

Then check live repo state:
```bash
git status --short --branch
git log --oneline -20
npm run typecheck
npm run lint
npm run build
```

(Or `pnpm typecheck`, `pnpm lint`, `pnpm build` — equivalent project scripts.)

---

## Documentation rules

- Keep **this file** as the single source of truth for the active plan.
- Keep `docs/MVP_STATUS_NOTION.md` as the single source of truth for shipped status/history.
- Do not create a second “current plan” doc.
- When a batch finishes, update status/history docs in the same pass.
- When a batch becomes historical, leave the work order in place but label it through the index/README as archival context, not active queue.

---

**Related Documents:**
- `docs/MVP_STATUS_NOTION.md`
- `docs/DOCUMENTATION_INDEX.md`
- `docs/contracts/`
- `docs/proof/`
