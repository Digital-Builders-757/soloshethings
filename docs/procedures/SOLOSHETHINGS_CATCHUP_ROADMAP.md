# SoloSHEThings Catch-up Roadmap

**Last updated:** May 6, 2026

**Execution status:** Steps **1–5** below are **implemented** and verified for the May 2026 smoke + release milestone (see `docs/procedures/SOLOSHETHINGS_SMOKE_AND_RELEASE_WORK_ORDER.md`). **Next:** resume work from `docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md`.

The sections below record the **catch-up batches 1–5** (auth through smoke/release) in execution order. Use them as an audit trail; **what to build next** lives in `docs/procedures/SOLOSHETHINGS_FINISH_LINE_ROADMAP.md` and product priorities.
Use it with `docs/procedures/IMPLEMENTATION_ROADMAP.md` and the contracts in `docs/contracts/`.

---

## Product goal

SoloSHEThings should feel like a calm, premium membership and community product, with auth that disappears when it should and a dashboard that immediately tells people where they are and what to do next.

The site should be stronger at:
- making sign-in and sign-up feel reliable
- making the dashboard feel like a real home base
- keeping authenticated and public surfaces clearly separated
- keeping profiles and account flows easy to recover
- staying usable on mobile
- keeping docs and implementation aligned

---

## Product principles

1. **Auth should be boring**
   - Sign-up, login, redirect, and session recovery should feel predictable.

2. **Dashboard is the home base**
   - Users should land somewhere that is clear, welcoming, and actionable.

3. **Public/private boundaries stay obvious**
   - Anonymous, authenticated, and subscribed surfaces must never blur together.

4. **Reuse the contract layer**
   - Prefer the existing auth and surface contracts over new one-off rules.

5. **Docs stay honest**
   - If behavior changes, update the source docs instead of creating parallel notes.

---

## Execution order

### 1. Auth + dashboard foundation

**Why this first:** if auth is shaky, the dashboard cannot feel trustworthy.

**Work order:** `docs/procedures/SOLOSHETHINGS_AUTH_DASHBOARD_WORK_ORDER.md`

**Source docs:**
- `docs/contracts/AUTH_CONTRACT.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/procedures/ENVIRONMENT_PROCEDURE.md`

**Focus areas:**
- login / signup redirects
- profile bootstrap and repair rules
- middleware / route protection behavior
- session handoff after refresh or logout
- header auth state
- dashboard shell and visual hierarchy
- clear error states for auth failures

**Definition of done:**
- users can sign in and out without weird edge cases
- redirects are consistent
- protected routes stay protected
- auth behavior matches the contract docs
- dashboard feels like a real home base, not a placeholder

---

### 2. Dashboard shell and visual polish

**Why this is next:** the dashboard is the first real app surface people feel after auth.

**Current surfaces:**
- `app/(app)/dashboard/page.tsx`
- `app/(app)/layout.tsx`
- `components/layout/SiteHeader.tsx`
- `components/nav/NavClient.tsx`

**Focus areas:**
- dashboard hierarchy and welcome state
- nav clarity for logged-in users
- mobile readability and spacing
- account/profile entry points
- making the dashboard feel intentional, not placeholder-ish

**Definition of done:**
- the dashboard reads as the product home
- navigation makes sense for authenticated users
- no major density or spacing issues remain on mobile

---

### 3. Site polish, performance, and docs hardening

**Why this is next:** once the dashboard foundation is in place, the whole app needs the clean/fast pass that makes the product feel finished.

**Work order:** `docs/procedures/SOLOSHETHINGS_SITE_POLISH_PERFORMANCE_WORK_ORDER.md`

**Focus areas:**
- shared shell cleanup
- responsive route sweep
- loading and perceived performance
- docs and QA hardening

**Definition of done:**
- the app feels clean on every screen
- loading feels calmer and faster
- docs still match the real implementation

---

### 4. Launch hardening, profile continuity, and access-control QA

**Why this is next:** after the core visual pass, finish the trust and boundary details that make the app feel actually shippable.

**Work order:** `docs/procedures/SOLOSHETHINGS_LAUNCH_HARDENING_WORK_ORDER.md`

**Focus areas:**
- profile edit and persistence
- bounded missing-profile fallback
- authenticated vs anonymous route behavior
- subscription-gated or private surfaces if applicable
- safe redirects from private pages
- loading states and responsive leftovers that still feel unfinished

**Definition of done:**
- profile changes are dependable
- account flows are easy to find and understand
- user identity feels consistent after login
- access rules are easy to reason about
- the app feels launch-ready instead of merely functional

---

### 5. Smoke tests, docs sync, and release prep

**Why this is last:** fixes only stick if they’re verified and documented.

**Work order:** `docs/procedures/SOLOSHETHINGS_SMOKE_AND_RELEASE_WORK_ORDER.md`

**Source docs:**
- `docs/proof/MVP_SMOKE_CHECKLIST.md`
- `docs/proof/E2E_SMOKE_PATHS.md`
- `docs/procedures/PRE_PUSH_CHECKLIST.md`
- `docs/procedures/RELEASE_PROCEDURE.md`

**Definition of done (2026-05-06):**
- Auth and dashboard flows smoke-tested; protected-route redirects verified
- Docs and webhook/release notes aligned with the live app (`/api/revalidate`, MVP vs future Playwright paths)
- `npm run typecheck`, `npm run lint`, and `npm run build` pass locally

---

## Cursor execution rule

Work top to bottom.
Do not start the next batch until the current one is done, verified, and documented.

After each batch:
- update the relevant docs
- verify the implementation
- leave the repo in a shippable state
