# SoloSHEThings Launch Hardening Work Order

**Execution batch for the last-mile pass after auth/dashboard and site polish work.**
Source docs: [AUTH_CONTRACT.md](../contracts/AUTH_CONTRACT.md), [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](../contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md), [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md), [SOLOSHETHINGS_CATCHUP_ROADMAP.md](./SOLOSHETHINGS_CATCHUP_ROADMAP.md), [QA_CHECKLIST.md](../proof/QA_CHECKLIST.md), [E2E_SMOKE_PATHS.md](../proof/E2E_SMOKE_PATHS.md), and [MVP_STATUS_NOTION.md](../MVP_STATUS_NOTION.md).

---

## Batch goal

Turn the current merged state into something that feels launch-ready, not just functional.

This pass should finish the remaining polish on profile/account flows, access boundaries, loading states, and docs/QA so the app feels clean on every screen and the docs keep pace with the code.

---

## What this batch should cover

### 1) Profile + account continuity

Make the signed-in user experience feel coherent after auth.

**Surfaces to review:**
- `app/(app)/profile/page.tsx`
- `app/actions/profile.ts`
- `components/profile/profile-form.tsx`
- `components/profile/profile-error-fallback.tsx`
- `components/profile/retry-page-button.tsx`
- any account or settings entry points already in the app

**What to improve:**
- profile edit persistence
- graceful missing-profile fallback
- bounded retry behavior
- clear account entry points from the dashboard/nav
- consistent identity display after login

---

### 2) Public/private surface QA

Make sure access rules are obvious and stable.

**Source docs:**
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `docs/SECURITY_INVARIANTS.md`

**What to verify:**
- authenticated vs anonymous route behavior
- private surfaces stay protected
- redirects stay safe and non-enumerating
- public routes stay public and clean
- no confusing access leaks in the shell or nav

---

### 3) Loading and perceived performance finish

Make the app feel calm while it loads.

**Surfaces to review:**
- `app/(app)/loading.tsx`
- `app/(auth)/loading.tsx`
- `app/(public)/loading.tsx`
- `components/ui/skeleton.tsx`
- any route-level loading or fallback components

**What to improve:**
- skeletons that match the real layout
- less layout shift
- better perceived speed
- predictable loading states on mobile and desktop
- no dead blank screens where a lightweight placeholder would help

---

### 4) Final docs + QA sync

Close the loop so the repo stays trustworthy.

**Must verify:**
- the docs index still points to the right sources
- the roadmap order still matches reality
- smoke paths still reflect the actual UI
- changed pages still render cleanly on mobile and desktop
- no stale guidance remains after the batch

---

## Execution order

### Step 1, profile/account continuity

Stabilize the signed-in account experience first.

Deliverables:
- dependable profile editing and persistence
- graceful retry / fallback handling
- dashboard and nav entry points to account areas
- no looping or dead-end states

Definition of done:
- a user can recover their account/profile state without confusion
- the logged-in experience feels coherent

---

### Step 2, access-control QA

Then verify the route boundaries and redirects.

Deliverables:
- private routes stay private
- public routes remain public
- redirects stay safe
- contract docs match behavior

Definition of done:
- the app does not leak or confuse permissions
- auth boundaries are easy to reason about

---

### Step 3, loading/performance finish

Tighten the loading behavior and perceived speed.

Deliverables:
- skeletons and loading states that match the UI
- less visual jumpiness
- calmer route transitions
- better mobile loading feel

Definition of done:
- the app feels smoother, not just functional
- loading never feels like a broken page

---

### Step 4, docs and QA sync

Finish with verification and documentation.

Deliverables:
- docs updated only where behavior changed
- route and smoke docs still accurate
- roadmap and queue order still honest
- repo ready for the next batch or release

Definition of done:
- docs and code agree
- the next pass can start without guesswork

---

## Cursor prompt pack

### Prompt 1, profile and account continuity

Read `docs/contracts/AUTH_CONTRACT.md`, `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`, and `docs/MVP_STATUS_NOTION.md` first. Then inspect `app/(app)/profile/page.tsx`, `app/actions/profile.ts`, `components/profile/profile-form.tsx`, `components/profile/profile-error-fallback.tsx`, and `components/profile/retry-page-button.tsx`.

Finish the profile/account experience so it feels coherent and recoverable:
- make profile editing dependable
- keep missing-profile repair bounded
- make fallback states graceful
- keep account entry points obvious from the dashboard/nav
- avoid loops and dead ends

Do not introduce new auth patterns. Keep this aligned with the existing contracts.

### Prompt 2, access-control QA

Read `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`, `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`, and `docs/SECURITY_INVARIANTS.md` first. Then review the public and private route behavior across the app.

Verify that:
- anonymous users only see public surfaces
- protected routes stay protected
- redirects do not leak information
- public navigation and shells stay clean
- the current behavior matches the contract docs

If any route, shell, or nav copy creates ambiguity around access, fix it.

### Prompt 3, loading and perceived performance

Inspect the loading components and fallbacks in `app/(app)/loading.tsx`, `app/(auth)/loading.tsx`, `app/(public)/loading.tsx`, and `components/ui/skeleton.tsx`.

Make the app feel calmer and faster while it loads:
- match skeletons to the real layout
- reduce layout shift
- keep placeholders lightweight
- avoid empty white waits where a calm loading state would help
- keep the loading treatment consistent across route groups

Minimal diff only. No new UI libraries.

### Prompt 4, final docs and QA sync

After the UI and flow work is done, verify the important paths on mobile and desktop and update docs if behavior changed.

Make sure:
- the docs index points at the right source documents
- the roadmap order still matches the actual queue
- smoke paths still reflect the real app
- no stale guidance remains
- the repo is ready for the next batch

### Prompt 5, release-ready sweep

Do one last sweep for anything that still feels unfinished: rough spacing, broken hierarchy, confusing copy, or an odd loading edge case.

Only fix what materially improves the launch readiness of the app. Keep the changes tight and shippable.

---

## Useful source docs

- `docs/contracts/AUTH_CONTRACT.md`
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `docs/SECURITY_INVARIANTS.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_CATCHUP_ROADMAP.md`
- `docs/procedures/SOLOSHETHINGS_AUTH_DASHBOARD_WORK_ORDER.md`
- `docs/procedures/SOLOSHETHINGS_SITE_POLISH_PERFORMANCE_WORK_ORDER.md`
- `docs/proof/QA_CHECKLIST.md`
- `docs/proof/E2E_SMOKE_PATHS.md`

---

## Implementation notes (Batch 3 — launch hardening)

**Profile & account**

- `app/actions/profile.ts`: single `getUser`/`createClient` import; `revalidatePath('/', 'layout')` after successful save so the shell can pick up layout-scoped data if needed.
- `components/profile/profile-form.tsx`: `useFormStatus` submit state (“Saving…”); `min-w-0` / `overflow-x-clip`; accessible success/error regions (`role`, `aria-live`); shorter success copy; `autoComplete` on fields.
- `app/(app)/profile/loading.tsx`: skeleton aligned with the profile form card.
- `components/profile/profile-error-fallback.tsx`: clearer copy about **one bounded repair per load**; `role="alert"`; cross-links between **dashboard** and **profile** so users are never marooned.
- `components/profile/retry-page-button.tsx`: **Refresh** (`router.refresh()`) for a new server render + bounded repair, plus **Hard reload** as an escape hatch.

**Route boundaries**

- `app/(app)/places/[slug]/page.tsx` and `app/(app)/submit/page.tsx`: server `getUser()` + `redirect('/login?redirectTo=…')` in addition to middleware (defense in depth, matches AUTH_CONTRACT).
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md`: proxy example query param corrected to **`redirectTo`** (matches `proxy.ts` and the login form).
