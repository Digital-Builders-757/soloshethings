# MVP Smoke Test Checklist

**Purpose:** Definitive QA run to verify MVP is usable and stable before declaring "MVP done."

**Automated gate (local / CI):** `pnpm run lint`, `pnpm run typecheck`, and `pnpm run build` should all pass. Auth flows below are **manual** and require a running app plus Supabase (see `.env.local`).

**UI/UX catch-up (2026-06-01):** Roadmap item **#2** complete. Member/community surfaces use shared `EmptyState` / `NoResultsState` for global and filtered empties, `LoadingState` for auth and `(app)` segment loading, and `ErrorRecoveryCard` for route/profile recovery. Re-run filtered-empty and loading checks after major UI changes.

**When to Run:** Before any demo, before tagging "MVP ready", after major changes.

**Duration:** ~20 minutes

**Environment:** Test on **Vercel Production** (or preview) and once locally if possible.

**Implementation notes (2026-05):** Root `viewport.viewportFit: "cover"` plus CSS utilities `shell-inline` / `shell-pb-safe` / `section-y` in `app/globals.css` align gutters with iOS safe-area insets. `--shell-chrome-height` approximates the banner+header stack for homepage hero `min-height` math. Logged-in header uses **My dashboard** / **Browse stories** / **Saved stories** / **My profile** / **Submit story** (`components/layout/SiteHeader.tsx`).

**Device matrix (manual):** Re-run sections **A–D** at **~320px**, **~375px**, **~390px**, **~768px** (tablet), and **~1280px** (desktop). Focus: no horizontal scroll on marketing and member shells, nav usable (overflow scroll on tight desktop if needed), auth CTAs visible, community card footers stack cleanly on narrow widths, keyboard focus visible on workspace nav and card links.

---

## A) Anonymous User Tests

### ✅ Test 1: Public Landing Page
- [ ] Visit `/`
- [ ] Page loads without errors
- [ ] No console errors
- [ ] Navigation visible
- [ ] At ~375px viewport width: **no horizontal scroll** on the main column (hero + first sections)
- [ ] Optional: slow 3G — confirm a **loading skeleton** appears briefly (`LoadingState` / route `loading.tsx`) instead of a long blank paint on public and `(app)` routes

- [ ] Optional: scroll to the homepage **Stay in the loop** panel, submit an address, and confirm the success messaging matches reality (persisted intent only—no promised inbox automation)

### ✅ Test 2: Blog List (No WP_URL)
- [ ] Visit `/blog`
- [ ] If `WP_URL` is NOT configured: Should see "Coming Soon" message
- [ ] **MUST NOT crash** - graceful fallback required
- [ ] No white screen or error page

### ✅ Test 3: Blog Detail (No WP_URL)
- [ ] Visit `/blog/some-slug`
- [ ] If `WP_URL` is NOT configured: Should see designed blog not-found (`app/(public)/blog/not-found.tsx`) or graceful 404 — **MUST NOT crash**
- [ ] No white screen or error page

### ✅ Test 4: Protected Route Redirect
- [ ] Visit `/dashboard` while logged out
- [ ] Should redirect to `/login` (or equivalent)
- [ ] Redirect URL should preserve original path (`?redirectTo=/dashboard`)

---

## B) New User Flow Tests

### ✅ Test 5: Signup Flow
- [ ] Go to `/signup`
- [ ] Fill form (email, password, username)
- [ ] Submit form
- [ ] **If email confirmation is off in Supabase:** redirect to `/dashboard` and profile row exists
- [ ] **If email confirmation is on:** redirect to `/login?notice=confirm_email` after profile insert (no session yet)
- [ ] Profile row should exist in `profiles` after signup completes (check Supabase)
- [ ] **If profile insert fails:** form shows error and session is cleared (`signOut`); user is not left signed in without a profile

### ✅ Test 6: Dashboard After Signup
- [ ] After signup, verify dashboard loads
- [ ] Profile info should be visible
- [ ] Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Dashboard should still load correctly
- [ ] Profile data should persist

### ✅ Test 7: Profile Edit
- [ ] Go to `/profile`
- [ ] Edit username, full name, **visibility (privacy)**, or bio
- [ ] Click "Save changes"
- [ ] Should see success message (**"Profile saved."**); list should refresh server data (`router.refresh` + keyed form)
- [ ] Hard refresh `/profile` page
- [ ] Values should persist (not reset)

**Edge recovery:** `updateProfile` can **INSERT** a `profiles` row if none exists when Save runs (rare—normally the page only shows the form after `getProfileWithBoundedRepair` succeeds). Useful if the row disappears between render and submit or via a future entry point.

### ✅ Test 8: Profile Persistence
- [ ] Edit profile on `/profile`
- [ ] Navigate to `/dashboard`
- [ ] Profile changes should be visible
- [ ] Navigate back to `/profile`
- [ ] Changes should still be there

---

## C) Auth Boundary Tests

### ✅ Test 9: Logout Flow
- [ ] While logged in, click **Sign out** (header)
- [ ] Should redirect to `/login?signedOut=1` (banner may confirm sign-out)
- [ ] Session should be cleared
- [ ] Header should show **Sign In** / **Get Started** instead of **My dashboard** / **My profile** links

### ✅ Test 10: Protected Route After Logout
- [ ] After logout, try to visit `/dashboard`
- [ ] Should redirect to `/login`
- [ ] Should NOT show dashboard content

### ✅ Test 11: Login After Logout
- [ ] Logout (if not already logged out)
- [ ] Go to `/login` (optionally with `?redirectTo=/profile`)
- [ ] Enter credentials
- [ ] Submit form
- [ ] Should redirect to `redirectTo` when present and safe (same-origin path), else default post-auth path (currently `/dashboard` for all roles)
- [ ] Dashboard should load cleanly
- [ ] No errors in console

### ✅ Test 12: Auth Route Redirect
- [ ] While logged in, try to visit `/login` or `/signup`
- [ ] Middleware should redirect away (destination from `profiles.role` via `getPostAuthRedirectPath`; currently `/dashboard` for `talent` and `client`)

---

## D) Failure Mode Tests (Critical)

### ✅ Test 13: Missing Profile Repair
**Setup:**
1. Create a test user via signup
2. Manually delete their profile row in Supabase dashboard
   - Or simulate missing profile by temporarily breaking profile creation

**Test:**
- [ ] Login with the test user
- [ ] **Bounded repair (server):** `getProfileWithBoundedRepair` runs **one** insert attempt per page load (plus read-after-write race handling)—not an infinite loop
- [ ] If repair succeeds: land on **dashboard** with data; `/profile` loads the form
- [ ] **MUST NOT** create an automatic **redirect loop** between `/dashboard` and `/profile`

**If repair fails (both app surfaces):**
- [ ] Dashboard and `/profile` show **`ProfileErrorFallback`**: static message, signed-in **email** shown, **no redirects** between pages
- [ ] **Refresh page** (`router.refresh`) and **Hard reload** (`location.reload()`) on `ProfileErrorFallback` run a fresh server load (bounded repair runs again **once** for that request)
- [ ] **Sign out & try again**, **Contact support**, **Back to home** all work
- [ ] Login repair failure path: user is signed out and sees a safe form error (no in-session retry loop)

**Note:** If the fallback is showing, the user **cannot** reach the profile form until repair succeeds or an admin fixes the row—by design avoids UX loops.

---

## E) Edge Cases

### ✅ Test 14: Concurrent Requests
- [ ] While logged in, open dashboard in multiple tabs
- [ ] Edit profile in one tab

### ✅ Test 15: Save, Search, and Filter Community Stories
- [ ] While logged in, open `/places`
- [ ] Save a visible community story from a feed card
- [ ] Open that story detail and confirm the save control renders the saved state
- [ ] Return to `/places` and use keyword search to find a known story by title, story text, or member name
- [ ] Toggle the quick views for `Public`, `My stories`, `Saved`, `Reported by you`, and `With photos` and confirm counts/results update honestly
- [ ] Use `Load older stories` and confirm the next feed slice keeps the current search/filter context
- [ ] Use `Show fewer` and confirm the feed steps back without dropping that context
- [ ] Visit `/saved` and confirm the story appears there
- [ ] Use saved-story search or quick filters (for example Public, Private, Your stories, Reported by you, or With photos) and confirm the list updates without leaking hidden stories
- [ ] If enough saved stories exist, use `Load more saves` and `Show fewer` to confirm the current saved-list context is preserved
- [ ] Remove the save from `/saved` and confirm the current saved-list search/filter context is preserved after refresh
- [ ] Refresh `/saved` and confirm the story is gone
- [ ] If testing a private story you authored, verify it appears only for your account and is not accessible from another signed-in user
- [ ] If you reported the story, confirm `/places`, `/saved`, and `/places/[id]` show the latest report status and link back to `/reports`
- [ ] Open any story detail and confirm the new explore shortcuts deep-link back into honest live feed filters (same-member author filter, featured stories, photo stories, or your own stories when relevant)
- [ ] Use a `More from {member}` link from `/places` or `/saved` and confirm the resulting list is filtered to that exact member while preserving any active quick view or keyword search
- [ ] On `/places` and `/saved`, confirm an active member-filter banner appears with the selected member name and that `Clear member filter` removes only the member filter while keeping the current quick view and keyword search
- [ ] While a member filter is active on `/places` or `/saved`, use the shared community workspace nav and confirm `Browse stories`, `Saved stories`, and `Safety reports` keep that same member selected
- [ ] On that same detail page, confirm the related-story section only surfaces stories already visible to the signed-in member and does not include the current story itself
- [ ] Open `/reports` and, if enough report entries exist, use `Load older reports` and `Show fewer` to confirm the current report-history context is preserved
- [ ] From a report card, use `Only this member's stories` and confirm `/reports` narrows to that exact storyteller while preserving any active status view or keyword search
- [ ] On `/reports`, confirm the same active member-filter banner appears and that `Clear member filter` keeps the current status view and keyword search intact
- [ ] While a member filter is active on `/reports`, use the shared community workspace nav and confirm the same member stays selected when you switch back to browse or saved surfaces
- [ ] With a **pending** post report you filed, withdraw it from `/reports` (or equivalent control) and confirm the status badge updates to Withdrawn consistently on `/reports`, `/places`, and `/saved`
- [ ] As a signed-in member **without** `profiles.role = 'admin'`, visit `/admin/moderation` and confirm you cannot reach or use the operator queue UI
- [ ] Try a filter or search that returns no matches on `/places`, `/saved`, `/reports`, or `/submit` and confirm **`NoResultsState`** (or equivalent filtered empty) explains that filters—not missing data—caused the result
- [ ] Refresh other tabs
- [ ] Changes should propagate (or at least not break)

### ✅ Test 16: Owner Edit, Photo Management, and Archive Controls
- [ ] Save a new story from `/submit` and confirm the success banner offers a direct `Open story controls` link
- [ ] Open one of your own published stories from `/submit` or `/places`
- [ ] If you opened from a filtered `/submit` view, confirm story detail breadcrumbs point back to that same owner-history context
- [ ] If you opened a story from a filtered `/saved` or `/reports` view, confirm the detail sidebar helper link returns you to that same workspace context instead of dropping filters
- [ ] Update the title, story text, or visibility from the owner controls card
- [ ] Confirm the detail page refreshes with the saved values
- [ ] Remove one existing story photo from the owner photo manager and confirm it disappears after refresh
- [ ] Add one or more new story photos from the owner photo manager without exceeding the 5-photo limit
- [ ] Confirm the newly added photos render on the detail page and `/submit` recent submissions surface
- [ ] Archive that story
- [ ] Confirm `/submit` shows the archived confirmation and the story is labeled archived
- [ ] Use `/submit` search or quick filters (for example Archived, Private, or With photos) to find the story without leaving owner history
- [ ] If enough owner stories exist, use `Load older submissions` and `Show fewer` to confirm the current owner-history context is preserved
- [ ] Confirm the archived story is no longer reachable from `/places`, `/places/[id]`, or `/saved`
- [ ] Restore that story from `/submit`
- [ ] Confirm `/submit` shows the restored confirmation and owner controls are available again
- [ ] Confirm the current `/submit` filter/search context stays intact after the restore refresh
- [ ] Archive from story detail after opening via `/submit` and confirm you land back in that same filtered `/submit` context with the archived confirmation visible
- [ ] Confirm the restored story is reachable again from `/places`, `/places/[id]`, and `/saved`

### ✅ Test 17: Session Expiry
- [ ] Login
- [ ] Wait for session to expire (or manually expire in Supabase)
- [ ] Try to access `/dashboard`
- [ ] Should redirect to `/login` (not crash)

### ✅ Test 16: Invalid Form Data
- [ ] Try to signup with invalid email
- [ ] Try to signup with password < 6 chars
- [ ] Try to signup with invalid username (special chars)
- [ ] Should show user-safe error messages
- [ ] Should NOT crash

---

## F) WordPress Integration (If WP_URL Configured)

### ✅ Test 17: Blog List (With WP_URL)
- [ ] Visit `/blog`
- [ ] Should show WordPress posts
- [ ] Posts should render correctly
- [ ] Images should load (if present)

### ✅ Test 18: Blog Detail (With WP_URL)
- [ ] Click on a blog post
- [ ] Should navigate to `/blog/[slug]`
- [ ] Content should render correctly
- [ ] Sanitization should work (no XSS)

---

## G) Performance & Errors

### ✅ Test 19: Build Check
- [ ] Run `pnpm lint` (zero warnings)
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm build`
- [ ] Build should complete without errors (non-blocking Sentry/OpenTelemetry webpack warnings are acceptable)

### ✅ Test 20: Runtime Errors
- [ ] Check browser console (all tests above)
- [ ] No unhandled errors
- [ ] No React hydration mismatches
- [ ] No middleware invocation failures

---

## Pass Criteria

**MVP is DONE when:**
- ✅ All tests A-D pass (critical path)
- ✅ Test 13 (profile repair) passes (prevents production issues)
- ✅ Test 19 (build) passes
- ✅ Test 20 (no runtime errors) passes

**Optional but Recommended:**
- ✅ Tests E-F pass (edge cases and WordPress)
- ✅ Tests run on **local and Vercel production**
- ✅ Sections A–D spot-checked at **320px**, **375px**, **390px**, **tablet (~768px)**, and **desktop (~1280px)** viewports

---

## Known Limitations (Not Failures)

These are expected MVP limitations, not bugs:

- WordPress preview mode may show published content only (Phase 1 limitation)
- Stripe subscription checkout and entitlement gates are live; trial/limited reading rules apply per billing contract
- Community browsing is live at `/places`; owner archive/restore and `/submit` history filters cover the basic self-service post lifecycle
- Submit owner shelf cards use inline editorial cards (lifecycle-specific), not the browse `CommunityStoryCard` family
- `/submit` trust/safety copy and lifecycle badges shipped in UI/UX catch-up (2026-06-01); owner detail photo manager unchanged in behavior
- Members can open `/reports` to review report history, filter by status, and jump back to associated stories when available
- Avatar uploads are implemented; richer avatar management remains a future polish item
- Full manual viewport matrix (320–desktop) is checklist-driven, not CI-automated

---

## Notes

- **If any critical test fails:** Fix before declaring MVP done
- **If edge case fails:** Document as known issue, proceed if not blocking
- **Profile repair test is critical:** This prevents production support issues

---

**Last Updated:** 2026-06-01  
**Maintainer:** Development Team

