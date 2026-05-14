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

### Live in-progress work

- **Observability + error UX hardening is currently in the working tree and should be treated as in progress until verified.**
  - Structured server failure logging (`lib/server-log.ts`)
  - Safe Supabase error mapping (`lib/supabase-errors.ts`)
  - Sentry bootstrap / config wiring
  - Route/global error boundaries
  - Safer opaque 500 handling for the WordPress revalidate webhook

### Pause / Cursor handoff snapshot (2026-05-14)

If work is being paused and later resumed in Cursor, start from this exact stopping point:

- **Branch target:** `develop`
- **Paused batch:** observability + error UX hardening
- **What is already changed:** shared server logging, shared Supabase error mapping, Sentry package/config wiring, route/global error boundaries, related docs consolidation, and roadmap cleanup
- **Verification snapshot (2026-05-14):** `npm run typecheck`, `npm run lint`, and `npm run build` pass on the current tree
- **Known verification note:** the production build currently emits non-blocking `Critical dependency: the request of a dependency is an expression` warnings from Sentry/OpenTelemetry transitive packages during webpack build
- **What still must happen before moving on:** ship this batch cleanly, then move to Stripe work
- **After this batch ships:** move directly to Stripe subscription integration + premium gating

This is the handoff point Cursor should resume from unless a regression forces a higher-priority detour.

---

## Canonical current plan

Work top to bottom unless a regression or blocker forces a reorder.

### 1) Finish the observability + error UX batch

**Goal:** make failures easier to diagnose without leaking secrets or showing brittle raw errors to users.

**Scope:**
- verify the current Sentry/bootstrap/error-boundary changes
- keep `docs/proof/MONITORING_SENTRY_POSTURE.md` aligned with the actual implementation
- update any touched contracts/proof docs if behavior changed
- land the batch only after `npm run typecheck`, `npm run lint`, and `npm run build` pass

**Done when:**
- server-side errors use the shared logging path where appropriate
- user-facing failures show calm safe copy
- route/global error boundaries exist and are documented
- monitoring docs match the code
- verification passes cleanly

### 2) Stripe subscription integration + premium gating

**Goal:** ship the first real billing gate for paid member access.

**Scope:**
- Stripe checkout / subscription activation
- trial handling and webhook processing
- premium-aware access control in app surfaces
- docs/contracts/proof updates

**Primary source docs:**
- `docs/contracts/BILLING_STRIPE_CONTRACT.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/proof/QA_CHECKLIST.md`

### 3) Community second-pass depth

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

### 4) Moderation/admin surfaces + owner lifecycle depth

**Goal:** follow the member-facing community work with the operational surfaces that keep it manageable.

**Scope:**
- broader trust & safety / moderation surfaces
- report resolution workflows where they are still missing
- admin post creation / editorial support where appropriate
- deeper owner lifecycle actions beyond the current archive/restore pass

### 5) Newsletter + marketing operations follow-through

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
