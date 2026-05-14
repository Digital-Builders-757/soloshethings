# Implementation Roadmap

**Purpose:** canonical current execution plan and resume guide for SoloSHEThings.

**Status:** ✅ CANONICAL
**Owner:** Procedures Layer
**Last Updated:** 2026-05-14

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

### Live in-progress work

- None queued ahead of the canonical plan below; next up is **community second-pass depth**.

### Resume pointer

- **Branch target:** `develop`
- **Latest shipped batch (2026-05-14):** Stripe subscription + premium gating (see `docs/contracts/BILLING_STRIPE_CONTRACT.md`, `PUBLIC_PRIVATE_SURFACE_CONTRACT.md`, `docs/MVP_STATUS_NOTION.md`) plus prior observability work.
- **Known verification note:** the production build may still emit non-blocking `Critical dependency: the request of a dependency is an expression` warnings from Sentry/OpenTelemetry transitive packages during webpack; treat as upstream noise unless the build fails or runtime breaks.
- **Next focus:** community second-pass depth (see §1 below).

---

## Canonical current plan

Work top to bottom unless a regression or blocker forces a reorder.

### 1) Community second-pass depth

**Goal:** make the shipped member/community surfaces feel deeper and more useful without inventing fake scope.

**Scope:**
- taxonomy/location-aware discovery
- stronger recommendation logic beyond the current first-pass related stories
- richer image handling (reorder, replace, alt text, broader viewing surfaces)
- any honest pagination/filter improvements still needed after real QA

**Primary source docs:**
- `docs/MVP_STATUS_NOTION.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `docs/contracts/UPLOADS_STORAGE_CONTRACT.md`

### 2) Moderation/admin surfaces + owner lifecycle depth

**Goal:** follow the member-facing community work with the operational surfaces that keep it manageable.

**Scope:**
- broader trust & safety / moderation surfaces
- report resolution workflows where they are still missing
- admin post creation / editorial support where appropriate
- deeper owner lifecycle actions beyond the current archive/restore pass

### 3) Newsletter + marketing operations follow-through

**Goal:** replace placeholder interest capture with a real pipeline when product priorities justify it.

**Scope:**
- dedicated newsletter delivery path
- honest CTA and marketing follow-through
- docs and operational notes for whoever owns campaign execution

---

## Priority override rule

If a regression appears in auth, access control, billing, or data safety, fix that first even if it interrupts the queue above.

---

## Historical work-order map

These files remain useful as **completed batch records / implementation notes**, not as the active queue:
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
