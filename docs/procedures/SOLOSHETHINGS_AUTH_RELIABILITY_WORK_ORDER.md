# SoloSHEThings Auth Reliability Work Order

**Execution batch for login, signup, logout, redirects, and profile repair sanity.**
Source docs: [AUTH_CONTRACT.md](../contracts/AUTH_CONTRACT.md), [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](../contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md), [DEBUG_AUTH.md](../runbooks/DEBUG_AUTH.md), [ENVIRONMENT_PROCEDURE.md](./ENVIRONMENT_PROCEDURE.md), and [SOLOSHETHINGS_FINISH_LINE_ROADMAP.md](./SOLOSHETHINGS_FINISH_LINE_ROADMAP.md).

---

## Batch goal

Make authentication boring.

If a user signs in, signs out, refreshes, or lands on a protected route, the app should behave predictably and explain itself clearly when something is wrong.

This is a reliability batch, not a redesign batch.

---

## What this batch should cover

### 1) Login / signup / logout sanity

Audit the real auth flow end to end.

**Surfaces to inspect:**
- `app/actions/auth.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/login/login-form.tsx`
- `app/(auth)/signup/page.tsx`
- `components/layout/SiteHeader.tsx`
- `components/nav/NavClient.tsx`
- `app/(app)/layout.tsx`
- `proxy.ts`
- `lib/supabase/server.ts`
- `lib/auth-redirects.ts`

**Focus areas:**
- `getUser()` remains the auth gate, not `getSession()`
- signed-in users skip auth pages cleanly
- logout clears session and UI state without weird stale shell behavior
- redirect targets stay same-origin and loop-safe
- header/nav auth state always matches the real session

---

### 2) Profile bootstrap and bounded repair

Make sure the account exists when the app expects it to exist.

**Surfaces to inspect:**
- `lib/queries/profiles.ts`
- `app/(app)/profile/page.tsx`
- `app/(app)/dashboard/page.tsx`
- `components/profile/ProfileErrorFallback` and related profile fallback UI

**Focus areas:**
- signup creates the profile row when it should
- missing-profile repair is bounded, not recursive
- dashboard and profile never spin in a loop when profile repair fails
- fallback copy is honest and helpful
- the user has a clear next step if repair fails

---

### 3) Protected route behavior

Verify the route boundary matches the contract.

**Routes to check:**
- `/dashboard`
- `/profile`
- `/settings`
- `/submit`
- other protected app surfaces in the proxy matcher

**Focus areas:**
- unauthenticated users are redirected to login with the original path preserved
- authenticated users do not get bounced back to login
- redirect paths do not open up loops or cross-origin paths
- role-aware redirect behavior stays intentional

---

### 4) Auth docs honesty

If a real bug is found, document it in the same batch.

**Focus areas:**
- update `AUTH_CONTRACT.md` if behavior changed
- update `DEBUG_AUTH.md` if the troubleshooting steps changed
- update `PUBLIC_PRIVATE_SURFACE_CONTRACT.md` if route boundary behavior changed
- update `DOCUMENTATION_INDEX.md` if new truth docs were added

---

## UX requirements

- Errors should be readable, not vague.
- Redirects should feel deliberate, not accidental.
- Authenticated users should see the dashboard as a home base, not a dead end.
- Anonymous users should see a clean login path, not a loop or a blank state.
- Any repair flow should cap itself and fail safely.

---

## Acceptance criteria

- login works and sends users to the right place
- signup creates or repairs the needed profile state
- logout reliably clears the authenticated shell
- protected routes redirect correctly
- auth pages do not show stale signed-in state
- docs reflect the real behavior
- typecheck, lint, and build pass

---

## Verification

Run the standard gates:
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Then manually smoke:
1. sign up
2. sign out
3. sign back in
4. refresh the dashboard
5. hit `/profile` while signed out
6. verify redirect preservation
7. intentionally break profile data if needed and confirm the fallback is bounded

---

## Definition of done

This batch is done when:
- auth feels stable enough that the user stops thinking about it
- route protection is consistent with the docs
- failure states are calm and understandable
- no obvious auth bug remains in the current build

---

## Cursor handoff prompt

Use this prompt in Cursor:

```md
You are working in the SoloSHEThings repo.

Goal: re-audit and harden auth so login, signup, logout, redirects, and profile repair feel boring and dependable.

Read first:
- docs/DOCUMENTATION_INDEX.md
- docs/ARCHITECTURE_CONSTITUTION.md
- docs/PROJECT_CONTEXT_PROMPT.md
- docs/contracts/AUTH_CONTRACT.md
- docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md
- docs/runbooks/DEBUG_AUTH.md
- docs/procedures/SOLOSHETHINGS_AUTH_RELIABILITY_WORK_ORDER.md

Important repo context:
- `getUser()` is the security-critical auth check.
- `proxy.ts` protects app routes.
- `app/actions/auth.ts` owns signup, login, logout.
- Profile repair must stay bounded.
- The current dashboard is the app home base, so auth bugs show up there fast.

Implement this batch with these constraints:
- do not invent a new auth system
- do not use `getSession()` for security decisions
- keep redirects same-origin and loop-safe
- keep missing-profile repair bounded
- keep login/signup/logout copy calm and honest
- if a real auth bug is found, update the relevant docs in the same batch

Acceptance criteria:
- login, signup, logout, and protected routes behave predictably
- profile repair does not loop
- signed-in and signed-out UI state stays honest
- docs match the actual auth behavior
- typecheck, lint, and build all pass

After coding:
1. update any canonical docs touched by behavior changes
2. run `npm run typecheck`
3. run `npm run lint`
4. run `npm run build`
5. summarize the real auth behavior, the exact files changed, and any remaining risk
```
