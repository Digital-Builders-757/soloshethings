# QA Checklist

**Purpose:** Phase 1 quality assurance checklist covering core flows, security checks, performance checks, upload checks, and billing checks for SoloSheThings.

## Non-Negotiables

1. **All Phase 1 Flows Must Pass** - No feature is complete until all core flows work.
2. **Security Checks Required** - RLS and access boundaries must be verified.
3. **Performance Checks Required** - ISR and revalidation must work correctly.
4. **Upload Privacy Must Work** - Privacy toggles must be enforced.
5. **Billing Flow Must Work** - Trial → Subscribe → Revoke must function correctly.

## Phase 1 Core Flows

### Flow 1: Signup → Profile → Dashboard

**Steps:**
- [ ] User can sign up with email/password
- [ ] Profile is created automatically after signup
- [ ] User is redirected to correct dashboard based on role
- [ ] Trial subscription is created automatically
- [ ] Trial countdown displays correctly
- [ ] Welcome email is sent (check logs)

**Verification:**
```sql
-- Verify profile created
SELECT id, username, role FROM profiles WHERE id = '<user-id>';

-- Verify subscription created
SELECT id, user_id, status, trial_end FROM subscriptions WHERE user_id = '<user-id>';
```

**Expected:** Profile exists, subscription status is 'trialing', trial_end is 7 days from now

### Flow 2: Login → Access Protected Routes

**Steps:**
- [ ] User can log in with email/password
- [ ] Session persists across page reloads
- [ ] User can access `/dashboard`
- [ ] User can access `/profile`
- [ ] User can access `/saved`
- [ ] User cannot access admin routes without admin role
- [ ] Logout works correctly

**Verification:**
- Check cookies are set after login
- Verify `getUser()` returns user object
- Verify protected routes load correctly
- Verify logout clears session

### Flow 3: WordPress Blog Read (Anonymous)

**Steps:**
- [ ] Anonymous user can access `/blog`
- [ ] Blog post list loads without authentication
- [ ] Anonymous user can click on blog post
- [ ] Blog post detail page loads
- [ ] Blog post content displays correctly
- [ ] Blog post images load
- [ ] ISR caching works (check response headers)
- [ ] Webhook revalidation works (trigger WP update, verify page updates)

**Verification:**
```bash
# Check ISR headers
curl -I https://app.com/blog
# Should see: x-vercel-cache: HIT or MISS

# Check revalidation after WP update
# Trigger WP webhook, verify page updates within revalidate window
```

**Expected:** Blog accessible without auth, ISR working, revalidation working

### Flow 4: Community Post Creation

**Steps:**
- [ ] Authenticated user can navigate to "Create Post"
- [ ] Post form loads correctly
- [ ] User can enter title and content
- [ ] User can upload images (multiple)
- [ ] User can set privacy level (public/private)
- [ ] Post submission succeeds
- [ ] Post appears in community feed
- [ ] Post detail page loads correctly
- [ ] Images display correctly

**Verification:**
```sql
-- Verify post created
SELECT id, title, author_id, is_public, status 
FROM community_posts 
WHERE author_id = '<user-id>' 
ORDER BY created_at DESC LIMIT 1;

-- Verify images uploaded
SELECT id, post_id, storage_path, order_index 
FROM post_images 
WHERE post_id = '<post-id>' 
ORDER BY order_index;
```

**Expected:** Post created, images uploaded, privacy setting respected

### Flow 5: Saved Posts (WordPress)

**Steps:**
- [ ] User can view WordPress blog post
- [ ] User can click "Save Post" button
- [ ] Post is saved to `saved_posts` table
- [ ] User can navigate to `/saved`
- [ ] Saved posts list loads
- [ ] User can click saved post to view
- [ ] User can unsave post
- [ ] Post is removed from saved list

**Verification:**
```sql
-- Verify saved post
SELECT id, user_id, wp_post_slug, post_type 
FROM saved_posts 
WHERE user_id = '<user-id>' 
AND wp_post_slug = '<post-slug>';
```

**Expected:** Post saved, appears in saved list, can be unsaved

## Security Checks

### RLS Enforcement

**Checks:**
- [ ] Anonymous user cannot query `profiles` table (except public profiles)
- [ ] Anonymous user cannot query `community_posts` table (except public posts)
- [ ] Anonymous user cannot query `saved_posts` table
- [ ] User A cannot see User B's private posts
- [ ] User A cannot update User B's profile
- [ ] User A cannot delete User B's posts
- [ ] User can only upload to own folder in storage
- [ ] User cannot access other users' private images

**Verification:**
```sql
-- Test as anonymous user
SET ROLE anon;

-- Should return 0 rows (private profiles blocked)
SELECT COUNT(*) FROM profiles WHERE privacy_level = 'private';

-- Should return public profiles only
SELECT COUNT(*) FROM profiles WHERE privacy_level = 'public';

-- Test as User A trying to access User B's data
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-a-id>';

-- Should return 0 rows (User B's private post blocked)
SELECT COUNT(*) FROM community_posts 
WHERE author_id = '<user-b-id>' 
AND is_public = false;
```

**Expected:** RLS blocks unauthorized access, only public data accessible to anon

### Anonymous Access Boundaries

**Checks:**
- [ ] Anonymous user can access `/` (landing page)
- [ ] Anonymous user can access `/blog` (blog list)
- [ ] Anonymous user can access `/blog/[slug]` (blog detail)
- [ ] Anonymous user can access `/about`, `/pricing`, `/contact`
- [ ] Anonymous user CANNOT access `/dashboard`
- [ ] Anonymous user CANNOT access `/profile`
- [ ] Anonymous user CANNOT access `/saved`
- [ ] Anonymous user CANNOT access `/posts/create`
- [ ] Anonymous user CANNOT access `/posts/[id]` (if private)

**Verification:**
- Navigate to protected routes without auth
- Verify redirect to `/login`
- Check middleware logs for access attempts

**Expected:** Public routes accessible, protected routes redirect to login

### Service Role Key Security

**Checks:**
- [ ] Service role key is NOT in client code
- [ ] Service role key is NOT in `NEXT_PUBLIC_*` env vars
- [ ] Service role key is only used in server-side code
- [ ] Service role client only used for admin operations
- [ ] No service role queries in client components

**Verification:**
```bash
# Check for service role key in client bundle
grep -r "SUPABASE_SERVICE_ROLE_KEY" .next/
# Should return nothing

# Check env vars
echo $NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
# Should be empty
```

**Expected:** Service role key never exposed to client

### Explicit Selects

**Checks:**
- [ ] No `select('*')` queries in codebase
- [ ] All queries use explicit column selection
- [ ] Sensitive columns (email, internal IDs) not exposed unnecessarily

**Verification:**
```bash
# Find select('*') usage
grep -r "select('*')" app/ lib/
# Should return nothing

# Find select("*") usage
grep -r 'select("*")' app/ lib/
# Should return nothing
```

**Expected:** No wildcard selects found

## Performance Checks

### ISR (Incremental Static Regeneration)

**Checks:**
- [ ] Blog list page (`/blog`) uses ISR
- [ ] Blog detail page (`/blog/[slug]`) uses ISR
- [ ] ISR revalidation time is set correctly (1 hour)
- [ ] Pages are statically generated on build
- [ ] Pages regenerate after revalidation period

**Verification:**
```bash
# Check build output
npm run build
# Should see: ○ (Static) for blog pages

# Check response headers
curl -I https://app.com/blog
# Should see: x-vercel-cache or similar ISR headers
```

**Expected:** Blog pages use ISR, regenerate after revalidation period

### Webhook Revalidation

**Checks:**
- [ ] WordPress webhook endpoint exists (`/api/revalidate`)
- [ ] Webhook verifies secret token
- [ ] Webhook triggers revalidation for updated post
- [ ] Revalidation updates page content
- [ ] Revalidation works for new posts
- [ ] Revalidation works for deleted posts

**Verification:**
```bash
# Trigger webhook manually
curl -X POST https://app.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <webhook-secret>" \
  -d '{"slug": "test-post"}'

# Verify page updates
curl https://app.com/blog/test-post
# Should show updated content
```

**Expected:** Webhook triggers revalidation, page updates correctly

### Caching Strategy

**Checks:**
- [ ] Public pages cached correctly
- [ ] User-specific pages NOT cached
- [ ] API routes cache headers set correctly
- [ ] WordPress API responses cached (1 hour)

**Verification:**
- Check response headers for cache directives
- Verify user-specific pages don't show cached content
- Verify public pages show cached content

**Expected:** Public content cached, user content not cached

## Upload Checks

### File Upload Functionality

**Checks:**
- [ ] User can upload avatar image
- [ ] User can upload post images (multiple)
- [ ] File size limits enforced (client + server)
- [ ] File type validation works (images only)
- [ ] Upload progress displays correctly
- [ ] Upload errors handled gracefully

**Verification:**
- Upload files of different sizes (should reject > limit)
- Upload non-image files (should reject)
- Check upload succeeds for valid files

**Expected:** Valid uploads succeed, invalid uploads rejected

### Privacy Toggles

**Checks:**
- [ ] User can set post privacy (public/private)
- [ ] Public posts visible to all authenticated users
- [ ] Private posts only visible to owner
- [ ] Public images use public URLs
- [ ] Private images use signed URLs
- [ ] Signed URLs expire correctly (1 hour)
- [ ] Privacy setting persists after update

**Verification:**
```sql
-- Create private post
INSERT INTO community_posts (author_id, title, content, is_public, status)
VALUES ('<user-id>', 'Private Post', 'Content', false, 'published');

-- Test as other user
SET ROLE authenticated;
SET request.jwt.claim.sub = '<other-user-id>';

-- Should return 0 rows (private post blocked)
SELECT COUNT(*) FROM community_posts 
WHERE author_id = '<user-id>' 
AND is_public = false;
```

**Expected:** Privacy settings enforced, private content not accessible to others

### Storage Access

**Checks:**
- [ ] User can only upload to own folder (`{userId}/...`)
- [ ] User cannot access other users' private files
- [ ] Storage RLS policies enforced
- [ ] File paths match policy expectations

**Verification:**
- Attempt upload to wrong folder (should fail)
- Attempt to access other user's private file (should fail)
- Verify storage policies match path structure

**Expected:** Users can only access own files, storage RLS enforced

## Billing Checks

### Trial Period

**Checks:**
- [ ] Trial starts on signup (7 days)
- [ ] Trial countdown displays correctly
- [ ] User has full access during trial
- [ ] Trial expiration date stored correctly
- [ ] Trial status displays correctly

**Verification:**
```sql
-- Check trial status
SELECT 
  id,
  user_id,
  status,
  trial_end,
  CASE 
    WHEN trial_end > NOW() THEN 'active'
    ELSE 'expired'
  END as trial_status
FROM subscriptions
WHERE user_id = '<user-id>';
```

**Expected:** Trial active for 7 days, full access during trial

### Trial Read Limit (After Expiration)

**Checks:**
- [ ] After trial expires, user limited to 3 posts/day
- [ ] Read limit counter increments correctly
- [ ] Read limit resets daily
- [ ] User sees message when limit reached
- [ ] User prompted to subscribe when limit reached

**Verification:**
- Expire trial manually (set `trial_end` to past date)
- Attempt to read 4th post (should be blocked)
- Verify limit counter increments
- Check daily reset logic

**Expected:** Limit enforced after trial expires, counter works correctly

### Subscribe Flow

**Checks:**
- [ ] User can navigate to subscription page
- [ ] Stripe checkout opens correctly
- [ ] User can enter payment details
- [ ] Payment processes successfully
- [ ] Webhook received and processed
- [ ] Subscription status updated to 'active'
- [ ] User has full access after subscription
- [ ] Subscription appears in Stripe dashboard

**Verification:**
```sql
-- Check subscription after payment
SELECT 
  id,
  user_id,
  status,
  stripe_subscription_id,
  current_period_end
FROM subscriptions
WHERE user_id = '<user-id>'
AND status = 'active';

-- Verify webhook ledger
SELECT 
  event_id,
  event_type,
  processed,
  processed_at
FROM stripe_webhook_ledger
WHERE event_type = 'customer.subscription.created'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:** Subscription active, webhook processed, full access granted

### Subscription Revocation

**Checks:**
- [ ] User can cancel subscription
- [ ] Cancellation webhook received
- [ ] Subscription status updated to 'canceled'
- [ ] User loses premium access after period end
- [ ] User can reactivate subscription
- [ ] Reactivation webhook received
- [ ] Subscription status updated to 'active'

**Verification:**
```sql
-- Cancel subscription
UPDATE subscriptions
SET status = 'canceled'
WHERE user_id = '<user-id>';

-- Verify access blocked
-- Attempt to access premium feature (should fail)

-- Reactivate
UPDATE subscriptions
SET status = 'active'
WHERE user_id = '<user-id>';

-- Verify access restored
```

**Expected:** Cancellation works, access revoked, reactivation works

### Webhook Idempotency

**Checks:**
- [ ] Duplicate webhook events are ignored
- [ ] Webhook ledger prevents duplicate processing
- [ ] In-flight webhooks handled correctly
- [ ] Webhook errors logged correctly

**Verification:**
- Send same webhook event twice
- Verify processed only once
- Check ledger for duplicate entries
- Verify idempotency logic

**Expected:** Duplicate events ignored, ledger prevents reprocessing

## Checklist Summary

### Phase 1 Core Flows
- [ ] Flow 1: Signup → Profile → Dashboard
- [ ] Flow 2: Login → Access Protected Routes
- [ ] Flow 3: WordPress Blog Read (Anonymous)
- [ ] Flow 4: Community Post Creation
- [ ] Flow 5: Saved Posts (WordPress)

### Security Checks
- [ ] RLS Enforcement
- [ ] Anonymous Access Boundaries
- [ ] Service Role Key Security
- [ ] Explicit Selects

### Performance Checks
- [ ] ISR (Incremental Static Regeneration)
- [ ] Webhook Revalidation
- [ ] Caching Strategy

### Upload Checks
- [ ] File Upload Functionality
- [ ] Privacy Toggles
- [ ] Storage Access

### Billing Checks
- [ ] Trial Period
- [ ] Trial Read Limit (After Expiration)
- [ ] Subscribe Flow
- [ ] Subscription Revocation
- [ ] Webhook Idempotency

---

**Related Documents:**
- [E2E_SMOKE_PATHS.md](./E2E_SMOKE_PATHS.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [BILLING_STRIPE_CONTRACT.md](./../contracts/BILLING_STRIPE_CONTRACT.md)
- [UPLOADS_STORAGE_CONTRACT.md](./../contracts/UPLOADS_STORAGE_CONTRACT.md)
