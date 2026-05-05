# SoloSHEThings Auth + Dashboard Work Order

**Execution batch for auth reliability and the first real dashboard polish pass.**
Source docs: [AUTH_CONTRACT.md](../contracts/AUTH_CONTRACT.md), [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](../contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), and [SOLOSHETHINGS_CATCHUP_ROADMAP.md](./SOLOSHETHINGS_CATCHUP_ROADMAP.md).

---

## Batch goal

Make auth boring and dependable, then make the dashboard feel like a real home base instead of a placeholder.

This batch should fix the core trust issues first, then improve the visible logged-in experience using the existing design system and app shell.

---

## What this batch should cover

### 1) Auth reliability

Focus on the actual user-facing failure points:
- signup
- login
- logout
- session handoff after refresh
- role-aware redirect behavior
- bounded profile repair
- protected route behavior
- header auth state

**Source of truth:** `docs/contracts/AUTH_CONTRACT.md`

**Non-negotiables:**
- use `getUser()`, not `getSession()`
- all protected routes must check server-side
- profile bootstrap must happen on signup
- missing profile repair must be bounded
- auth errors must be safe and helpful

---

### 2) Dashboard visual + UX polish

Make the dashboard feel intentional and premium.

**Current surfaces to improve:**
- `app/(app)/dashboard/page.tsx`
- `app/(app)/layout.tsx`
- `components/nav/header.tsx`
- any shared dashboard/profile UI pieces already in the repo

**What should improve:**
- stronger first impression
- clearer hierarchy and CTA flow
- better mobile spacing and rhythm
- more polished card/layout treatment
- less “coming soon” energy
- a dashboard that feels like a proper product home

---

### 3) Profile / account continuity

Keep the user identity experience coherent after auth.

**Focus areas:**
- profile display and edit entry points
- fallback behavior when profile data is missing
- role-aware copy where it matters
- keep the logged-in nav useful without being noisy

---

### 4) Verification + cleanup

Close the loop so the batch ships cleanly.

**Must verify:**
- login and signup still work
- redirects are correct
- protected routes stay protected
- dashboard renders for logged-in users
- profile repair does not loop
- docs reflect the current behavior

---

## Execution order

### Step 1, auth hardening

Fix auth first.

Deliverables:
- login / signup / logout behavior is stable
- redirect logic is consistent
- bounded profile repair is enforced
- protected route checks stay server-side
- header reflects auth state correctly

Definition of done:
- auth works without weird edge cases
- the contract docs still match behavior
- no user gets stuck in a redirect loop

---

### Step 2, dashboard redesign

Then redesign the dashboard shell and hierarchy.

Deliverables:
- a better dashboard layout
- stronger hero / welcome section
- useful quick actions
- profile/account summary
- mobile-friendly spacing and structure
- cleaner logged-in navigation treatment

Definition of done:
- dashboard feels like the product home
- it looks deliberate, not placeholder-ish
- it reads well on mobile and desktop

---

### Step 3, docs + QA

Finish by validating and documenting.

Deliverables:
- update any contract or roadmap notes if behavior changed
- confirm auth flows still match the docs
- confirm the dashboard layout is the intended new baseline

Definition of done:
- repo is shippable
- docs are not lying
- next batch can start cleanly

---

## Cursor prompt pack

### Prompt 1, auth reliability batch

Read `docs/contracts/AUTH_CONTRACT.md` and `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md` first. Then inspect the current auth and protected app surfaces in `app/actions/auth.ts`, `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `app/(app)/dashboard/page.tsx`, `app/(app)/profile/page.tsx`, `app/(app)/layout.tsx`, and `components/nav/header.tsx`.

Fix the auth flow so it is actually dependable end to end:
- use `getUser()` for auth decisions
- keep protected routes server-side
- keep profile bootstrap on signup
- keep profile repair bounded to one retry
- clean up login/signup/logout redirect behavior
- make auth errors safe and understandable
- make the header reflect the signed-in state correctly

Do not introduce new auth patterns that conflict with the contract docs.

### Prompt 2, dashboard visual redesign

After auth is stable, redesign the dashboard so it feels like a real home base for signed-in users.

Use the existing app shell and current brand styles. Improve `app/(app)/dashboard/page.tsx` and any shared UI it depends on so the dashboard has:
- a stronger welcome / hero section
- clearer card hierarchy
- useful quick actions
- profile/account summary
- cleaner mobile spacing
- less placeholder energy
- a more polished, premium look

Keep it practical. Do not add new design systems or libraries. Make the dashboard feel intentionally built, not just technically complete.

### Prompt 3, profile continuity and nav cleanup

Review the signed-in experience across profile and navigation.

Tighten up the logged-in nav, profile entry points, and fallback states so the user never feels lost after auth. If profile data is missing, handle it gracefully without loops. If any copy or routing needs to change to support the new dashboard, update it.

### Prompt 4, verification and docs sync

After the UI and auth work are done, verify the flows and update docs only where behavior actually changed.

Check:
- signup
- login
- logout
- protected route redirects
- dashboard load for signed-in users
- profile fallback handling
- mobile readability of the dashboard

If anything changed materially, update the relevant source docs. Keep the docs honest and minimal.

---

## Useful source docs

- `docs/contracts/AUTH_CONTRACT.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`
- `docs/MVP_STATUS_NOTION.md`
- `docs/DOCUMENTATION_INDEX.md`
