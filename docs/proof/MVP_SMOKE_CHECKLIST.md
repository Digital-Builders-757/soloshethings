# MVP Smoke Test Checklist

**Purpose:** Definitive QA run to verify MVP is usable and stable before declaring "MVP done."

**When to Run:** Before any demo, before tagging "MVP ready", after major changes.

**Duration:** ~20 minutes

**Environment:** Test on **Vercel Production** (or preview) and once locally if possible.

---

## A) Anonymous User Tests

### ✅ Test 1: Public Landing Page
- [ ] Visit `/`
- [ ] Page loads without errors
- [ ] No console errors
- [ ] Navigation visible

### ✅ Test 2: Blog List (No WP_URL)
- [ ] Visit `/blog`
- [ ] If `WP_URL` is NOT configured: Should see "Coming Soon" message
- [ ] **MUST NOT crash** - graceful fallback required
- [ ] No white screen or error page

### ✅ Test 3: Blog Detail (No WP_URL)
- [ ] Visit `/blog/some-slug`
- [ ] If `WP_URL` is NOT configured: Should see 404 (notFound) or "Coming Soon"
- [ ] **MUST NOT crash** - graceful fallback required

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
- [ ] Should redirect to `/dashboard` after successful signup
- [ ] Profile should be created automatically

### ✅ Test 6: Dashboard After Signup
- [ ] After signup, verify dashboard loads
- [ ] Profile info should be visible
- [ ] Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Dashboard should still load correctly
- [ ] Profile data should persist

### ✅ Test 7: Profile Edit
- [ ] Go to `/profile`
- [ ] Edit username, full name, or bio
- [ ] Click "Save Changes"
- [ ] Should see success message
- [ ] Hard refresh `/profile` page
- [ ] Values should persist (not reset)

### ✅ Test 8: Profile Persistence
- [ ] Edit profile on `/profile`
- [ ] Navigate to `/dashboard`
- [ ] Profile changes should be visible
- [ ] Navigate back to `/profile`
- [ ] Changes should still be there

---

## C) Auth Boundary Tests

### ✅ Test 9: Logout Flow
- [ ] While logged in, click "Sign Out" button
- [ ] Should redirect to home (`/`) or login page
- [ ] Session should be cleared
- [ ] Header should show "Sign In" instead of "Sign Out"

### ✅ Test 10: Protected Route After Logout
- [ ] After logout, try to visit `/dashboard`
- [ ] Should redirect to `/login`
- [ ] Should NOT show dashboard content

### ✅ Test 11: Login After Logout
- [ ] Logout (if not already logged out)
- [ ] Go to `/login`
- [ ] Enter credentials
- [ ] Submit form
- [ ] Should redirect to `/dashboard`
- [ ] Dashboard should load cleanly
- [ ] No errors in console

### ✅ Test 12: Auth Route Redirect
- [ ] While logged in, try to visit `/login`
- [ ] Should redirect to `/dashboard` (middleware prevents access to auth routes when authenticated)

---

## D) Failure Mode Tests (Critical)

### ✅ Test 13: Missing Profile Repair
**Setup:**
1. Create a test user via signup
2. Manually delete their profile row in Supabase dashboard
   - Or simulate missing profile by temporarily breaking profile creation

**Test:**
- [ ] Login with the test user
- [ ] Should attempt profile repair (bounded, max 1 retry)
- [ ] Profile should be recreated automatically
- [ ] Should land on dashboard successfully
- [ ] **MUST NOT create redirect loop**
- [ ] **MUST NOT retry indefinitely**

**If Repair Fails:**
- [ ] Should show error page (not redirect loop)
- [ ] Error message should be user-safe
- [ ] Should provide escape hatch (link back to login)

---

## E) Edge Cases

### ✅ Test 14: Concurrent Requests
- [ ] While logged in, open dashboard in multiple tabs
- [ ] Edit profile in one tab
- [ ] Refresh other tabs
- [ ] Changes should propagate (or at least not break)

### ✅ Test 15: Session Expiry
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
- [ ] Run `npm run build`
- [ ] Build should complete without errors
- [ ] No TypeScript errors
- [ ] No linting errors

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
- ✅ Tests run on both local and Vercel production

---

## Known Limitations (Not Failures)

These are expected MVP limitations, not bugs:

- WordPress preview mode may show published content only (Phase 1 limitation)
- No Stripe subscription yet (explicitly NOT MVP)
- No community posting yet (explicitly NOT MVP)
- No avatar uploads yet (explicitly NOT MVP)

---

## Notes

- **If any critical test fails:** Fix before declaring MVP done
- **If edge case fails:** Document as known issue, proceed if not blocking
- **Profile repair test is critical:** This prevents production support issues

---

**Last Updated:** 2025-01-27  
**Maintainer:** Development Team

