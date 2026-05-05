# SoloSHEThings Catch-up Roadmap

**Last updated:** May 5, 2026

This is the current execution order for the next SoloSHEThings improvement batches.
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

### 1. Auth session hardening

**Why this first:** if auth is shaky, everything downstream gets noisier.

**Source docs:**
- `docs/contracts/AUTH_CONTRACT.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/procedures/ENVIRONMENT_PROCEDURE.md`

**Focus areas:**
- login / signup redirects
- profile bootstrap and repair rules
- middleware / route protection behavior
- session handoff after refresh or logout
- clear error states for auth failures

**Definition of done:**
- users can sign in and out without weird edge cases
- redirects are consistent
- protected routes stay protected
- auth behavior matches the contract docs

---

### 2. Dashboard shell and navigation polish

**Why this is next:** the dashboard is the first real app surface people feel after auth.

**Current surfaces:**
- `app/(app)/dashboard/page.tsx`
- `app/(app)/layout.tsx`
- `components/nav/header.tsx`

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

### 3. Profile and account continuity

**Why this matters:** auth only feels complete when profile and account flows are easy to recover.

**Current surfaces:**
- `app/(app)/profile/page.tsx`
- `app/actions/profile.ts`
- any account/settings screens already in the app

**Focus areas:**
- profile edit and persistence
- role-aware behavior where needed
- avatar / identity continuity
- settings/account affordances

**Definition of done:**
- profile changes are dependable
- account flows are easy to find and understand
- user identity feels consistent after login

---

### 4. Public/private surface QA

**Why this stays in the queue:** the product should never leak or confuse access boundaries.

**Source docs:**
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `docs/SECURITY_INVARIANTS.md`

**Focus areas:**
- authenticated vs anonymous route behavior
- subscription-gated surfaces if applicable
- safe redirects from private pages
- content visibility rules in the public shell

**Definition of done:**
- access rules are easy to reason about
- private content stays private
- public pages do not feel bolted on

---

### 5. Smoke tests, docs sync, and release prep

**Why this is last:** fixes only stick if they’re verified and documented.

**Source docs:**
- `docs/proof/MVP_SMOKE_CHECKLIST.md`
- `docs/proof/E2E_SMOKE_PATHS.md`
- `docs/procedures/PRE_PUSH_CHECKLIST.md`

**Definition of done:**
- auth and dashboard flows are smoke-tested
- docs match the implementation
- the repo is ready for a clean push

---

## Cursor execution rule

Work top to bottom.
Do not start the next batch until the current one is done, verified, and documented.

After each batch:
- update the relevant docs
- verify the implementation
- leave the repo in a shippable state
