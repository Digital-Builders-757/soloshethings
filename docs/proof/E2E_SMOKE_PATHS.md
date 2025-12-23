# E2E Smoke Test Paths

**Purpose:** Scripted end-to-end smoke test paths for SoloSheThings Phase 1, designed for automation with Playwright. These paths verify critical user journeys before production deployments.

## Non-Negotiables

1. **All Paths Must Pass** - Deployment blocked if any smoke test fails.
2. **Automation Ready** - Paths written for Playwright automation.
3. **Quick Execution** - All paths should complete in < 5 minutes.
4. **Critical Paths Only** - Focus on user-blocking issues.
5. **Production-Like Data** - Use realistic test data.

## Smoke Test Paths

### Path 1: Anonymous User Reads Blog Post

**Purpose:** Verify WordPress blog content is accessible without authentication and ISR works correctly.

**Scripted Steps:**

```typescript
// Playwright script structure
test('Path 1: Anonymous user reads blog post', async ({ page }) => {
  // Step 1: Navigate to blog list (no auth)
  await page.goto('/blog');
  await expect(page).toHaveTitle(/Blog/);
  
  // Step 2: Verify blog posts load
  const postLinks = page.locator('a[href^="/blog/"]');
  await expect(postLinks.first()).toBeVisible();
  const firstPostSlug = await postLinks.first().getAttribute('href');
  
  // Step 3: Click on first blog post
  await postLinks.first().click();
  await page.waitForURL(/\/blog\/.+/);
  
  // Step 4: Verify post content loads
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  
  // Step 5: Verify images load
  const images = page.locator('article img');
  const imageCount = await images.count();
  if (imageCount > 0) {
    await expect(images.first()).toBeVisible();
  }
  
  // Step 6: Verify ISR headers (check response)
  const response = await page.request.get(page.url());
  const cacheHeader = response.headers()['x-vercel-cache'] || 
                       response.headers()['cache-control'];
  expect(cacheHeader).toBeTruthy();
});
```

**Expected Results:**
- ✅ Blog list page loads without authentication
- ✅ Blog posts displayed
- ✅ Blog post detail page loads
- ✅ Post content displays correctly
- ✅ Images load
- ✅ ISR caching headers present

**Failure Criteria:**
- ❌ Blog page requires authentication
- ❌ Posts don't load
- ❌ Post content broken
- ❌ Images don't display
- ❌ No ISR headers

**Verification SQL:**
```sql
-- Not needed (anonymous access, no DB query)
```

---

### Path 2: Signup → Profile → Trial Read Limit

**Purpose:** Verify new user signup, profile creation, trial activation, and trial read limit enforcement.

**Scripted Steps:**

```typescript
// Playwright script structure
test('Path 2: Signup → Profile → Trial Read Limit', async ({ page }) => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  // Step 1: Navigate to signup
  await page.goto('/signup');
  await expect(page.locator('form')).toBeVisible();
  
  // Step 2: Fill signup form
  await page.fill('input[name="email"]', testEmail);
  await page.fill('input[name="password"]', testPassword);
  await page.fill('input[name="username"]', `testuser${Date.now()}`);
  await page.click('button[type="submit"]');
  
  // Step 3: Wait for redirect to dashboard
  await page.waitForURL(/\/dashboard/);
  await expect(page).toHaveURL(/\/dashboard/);
  
  // Step 4: Verify profile created (check dashboard shows username)
  await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
  
  // Step 5: Verify trial countdown displays
  await expect(page.locator('[data-testid="trial-countdown"]')).toBeVisible();
  
  // Step 6: Verify full access during trial (read multiple posts)
  await page.goto('/blog');
  const postLinks = page.locator('a[href^="/blog/"]');
  const postCount = await postLinks.count();
  
  // Read first 3 posts (should work)
  for (let i = 0; i < Math.min(3, postCount); i++) {
    await postLinks.nth(i).click();
    await expect(page.locator('article')).toBeVisible();
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }
  
  // Step 7: Simulate trial expiration (admin action or wait)
  // For testing: Manually expire trial in DB, then continue
  
  // Step 8: Verify read limit enforced (after expiration)
  // Attempt to read 4th post (should show limit message)
  if (postCount >= 4) {
    await postLinks.nth(3).click();
    // Should show "Trial expired" or "Subscribe to continue" message
    await expect(
      page.locator('text=/trial expired|subscribe to continue/i')
    ).toBeVisible();
  }
});
```

**Expected Results:**
- ✅ Signup succeeds
- ✅ Profile created automatically
- ✅ Redirect to dashboard
- ✅ Trial countdown displays
- ✅ Full access during trial (can read unlimited posts)
- ✅ Read limit enforced after trial expires

**Failure Criteria:**
- ❌ Signup fails
- ❌ Profile not created
- ❌ No redirect to dashboard
- ❌ Trial not activated
- ❌ Read limit not enforced

**Verification SQL:**
```sql
-- Verify profile created
SELECT id, username, role FROM profiles 
WHERE email = '<test-email>';

-- Verify subscription created
SELECT id, user_id, status, trial_end FROM subscriptions 
WHERE user_id = '<user-id>';

-- Verify trial status
SELECT 
  CASE 
    WHEN trial_end > NOW() THEN 'active'
    ELSE 'expired'
  END as trial_status
FROM subscriptions
WHERE user_id = '<user-id>';
```

---

### Path 3: Subscribe → Unlock Full Access

**Purpose:** Verify subscription flow, payment processing, webhook handling, and premium access activation.

**Scripted Steps:**

```typescript
// Playwright script structure
test('Path 3: Subscribe → Unlock Full Access', async ({ page, context }) => {
  // Prerequisites: User logged in with expired trial
  await page.goto('/login');
  await page.fill('input[name="email"]', 'expired-trial@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
  
  // Step 1: Navigate to subscription page
  await page.goto('/subscribe');
  await expect(page.locator('text=/subscribe|upgrade/i')).toBeVisible();
  
  // Step 2: Click subscribe button
  await page.click('button:has-text("Subscribe")');
  
  // Step 3: Wait for Stripe checkout (opens in new window or iframe)
  // Handle Stripe checkout window
  const [checkoutPage] = await Promise.all([
    context.waitForEvent('page'), // Wait for Stripe checkout
    page.click('button:has-text("Subscribe")')
  ]);
  
  await checkoutPage.waitForLoadState();
  
  // Step 4: Fill Stripe test card
  // Stripe test card: 4242 4242 4242 4242
  await checkoutPage.fill('input[name="cardNumber"]', '4242424242424242');
  await checkoutPage.fill('input[name="cardExpiry"]', '12/25');
  await checkoutPage.fill('input[name="cardCvc"]', '123');
  await checkoutPage.fill('input[name="billingName"]', 'Test User');
  
  // Step 5: Submit payment
  await checkoutPage.click('button:has-text("Pay")');
  
  // Step 6: Wait for redirect back to app
  await page.waitForURL(/\/dashboard|\/subscribe\/success/);
  
  // Step 7: Verify subscription activated
  await expect(page.locator('text=/subscription active|premium/i')).toBeVisible();
  
  // Step 8: Verify full access restored
  await page.goto('/blog');
  const postLinks = page.locator('a[href^="/blog/"]');
  
  // Read multiple posts (should work without limit)
  for (let i = 0; i < Math.min(5, await postLinks.count()); i++) {
    await postLinks.nth(i).click();
    await expect(page.locator('article')).toBeVisible();
    await page.goBack();
    await page.waitForLoadState('networkidle');
  }
  
  // Step 9: Verify premium features accessible
  await page.goto('/posts/create');
  await expect(page.locator('form')).toBeVisible(); // Should be accessible
});
```

**Expected Results:**
- ✅ Subscription page loads
- ✅ Stripe checkout opens
- ✅ Payment processes successfully
- ✅ Redirect back to app
- ✅ Subscription status updated to 'active'
- ✅ Full access restored (unlimited reads)
- ✅ Premium features accessible

**Failure Criteria:**
- ❌ Checkout doesn't open
- ❌ Payment fails
- ❌ Webhook not received
- ❌ Subscription not activated
- ❌ Access not restored

**Verification SQL:**
```sql
-- Verify subscription active
SELECT id, user_id, status, stripe_subscription_id 
FROM subscriptions 
WHERE user_id = '<user-id>' 
AND status = 'active';

-- Verify webhook processed
SELECT event_id, event_type, processed, processed_at 
FROM stripe_webhook_ledger 
WHERE event_type = 'customer.subscription.created' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

### Path 4: Upload Photo to Post (or Avatar) with Privacy

**Purpose:** Verify file upload functionality, privacy toggle enforcement, and storage access control.

**Scripted Steps:**

```typescript
// Playwright script structure
test('Path 4: Upload Photo to Post with Privacy', async ({ page }) => {
  // Prerequisites: User logged in
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
  
  // Step 1: Navigate to create post
  await page.goto('/posts/create');
  await expect(page.locator('form')).toBeVisible();
  
  // Step 2: Fill post form
  await page.fill('input[name="title"]', 'Test Post with Privacy');
  await page.fill('textarea[name="content"]', 'This is a test post with images.');
  
  // Step 3: Upload image(s)
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-fixtures/test-image.jpg');
  
  // Wait for upload to complete
  await expect(page.locator('text=/upload.*complete|image.*uploaded/i')).toBeVisible();
  
  // Step 4: Set privacy to private
  await page.selectOption('select[name="privacy"]', 'private');
  
  // Step 5: Submit post
  await page.click('button[type="submit"]');
  
  // Step 6: Wait for redirect to post detail
  await page.waitForURL(/\/posts\/.+/);
  
  // Step 7: Verify post created and images display
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('img')).toBeVisible();
  
  // Step 8: Verify privacy setting (as owner, should see post)
  await expect(page.locator('text=/private|only you can see/i')).toBeVisible();
  
  // Step 9: Logout and verify privacy enforcement
  await page.click('button:has-text("Logout")');
  await page.waitForURL(/\/login/);
  
  // Step 10: Login as different user
  await page.goto('/login');
  await page.fill('input[name="email"]', 'other@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
  
  // Step 11: Attempt to access private post (should fail or not appear)
  await page.goto('/posts'); // Community feed
  const privatePostLink = page.locator(`a[href*="/posts/${postId}"]`);
  await expect(privatePostLink).not.toBeVisible(); // Should not appear in feed
  
  // Step 12: Direct URL access (should be blocked)
  await page.goto(`/posts/${postId}`);
  // Should show 404 or "not found" message
  await expect(
    page.locator('text=/not found|access denied|private/i')
  ).toBeVisible();
});
```

**Expected Results:**
- ✅ Post form loads
- ✅ Image upload succeeds
- ✅ Privacy toggle works
- ✅ Post created successfully
- ✅ Images display correctly
- ✅ Private post not visible to other users
- ✅ Direct access to private post blocked

**Failure Criteria:**
- ❌ Upload fails
- ❌ Privacy toggle doesn't work
- ❌ Post not created
- ❌ Images don't display
- ❌ Private post visible to others

**Verification SQL:**
```sql
-- Verify post created with privacy setting
SELECT id, author_id, title, is_public, status 
FROM community_posts 
WHERE author_id = '<user-id>' 
ORDER BY created_at DESC 
LIMIT 1;

-- Verify images uploaded
SELECT id, post_id, storage_path, order_index 
FROM post_images 
WHERE post_id = '<post-id>' 
ORDER BY order_index;

-- Verify privacy enforcement (as other user)
SET ROLE authenticated;
SET request.jwt.claim.sub = '<other-user-id>';

-- Should return 0 rows (private post blocked)
SELECT COUNT(*) FROM community_posts 
WHERE id = '<post-id>' 
AND is_public = false;
```

---

### Path 5: Save WordPress Post → View Saved List

**Purpose:** Verify WordPress post saving functionality and saved posts list display.

**Scripted Steps:**

```typescript
// Playwright script structure
test('Path 5: Save WP Post → View Saved List', async ({ page }) => {
  // Prerequisites: User logged in
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
  
  // Step 1: Navigate to blog
  await page.goto('/blog');
  await expect(page.locator('article')).toBeVisible();
  
  // Step 2: Click on a blog post
  const postLinks = page.locator('a[href^="/blog/"]');
  await postLinks.first().click();
  await page.waitForURL(/\/blog\/.+/);
  
  // Step 3: Get post slug for verification
  const postSlug = page.url().split('/blog/')[1];
  
  // Step 4: Click "Save Post" button
  await page.click('button:has-text("Save")');
  
  // Step 5: Verify save button changes to "Saved"
  await expect(page.locator('button:has-text("Saved")')).toBeVisible();
  
  // Step 6: Navigate to saved posts page
  await page.goto('/saved');
  await expect(page).toHaveURL(/\/saved/);
  
  // Step 7: Verify saved post appears in list
  await expect(page.locator(`a[href*="/blog/${postSlug}"]`)).toBeVisible();
  
  // Step 8: Click saved post to view
  await page.click(`a[href*="/blog/${postSlug}"]`);
  await page.waitForURL(/\/blog\/.+/);
  await expect(page.locator('article')).toBeVisible();
  
  // Step 9: Return to saved list
  await page.goBack();
  await page.waitForURL(/\/saved/);
  
  // Step 10: Unsave post
  await page.click(`button[data-post-slug="${postSlug}"]:has-text("Unsave")`);
  
  // Step 11: Verify post removed from list
  await expect(page.locator(`a[href*="/blog/${postSlug}"]`)).not.toBeVisible();
  
  // Step 12: Verify unsave persists (reload page)
  await page.reload();
  await expect(page.locator(`a[href*="/blog/${postSlug}"]`)).not.toBeVisible();
});
```

**Expected Results:**
- ✅ Blog post loads
- ✅ Save button works
- ✅ Post saved to database
- ✅ Saved posts list loads
- ✅ Saved post appears in list
- ✅ Clicking saved post navigates correctly
- ✅ Unsave works
- ✅ Post removed from list

**Failure Criteria:**
- ❌ Save button doesn't work
- ❌ Post not saved
- ❌ Saved list doesn't load
- ❌ Post doesn't appear in list
- ❌ Unsave doesn't work

**Verification SQL:**
```sql
-- Verify saved post
SELECT id, user_id, wp_post_slug, post_type, created_at 
FROM saved_posts 
WHERE user_id = '<user-id>' 
AND wp_post_slug = '<post-slug>';

-- Verify unsave (should return 0 rows after unsave)
SELECT COUNT(*) FROM saved_posts 
WHERE user_id = '<user-id>' 
AND wp_post_slug = '<post-slug>';
```

---

## Smoke Test Execution

### Manual Execution

**Before Each Deployment:**
1. Run all 5 smoke test paths manually
2. Document results (pass/fail for each step)
3. Fix any failures before deploying
4. Re-test after fixes

### Automated Execution (Playwright)

**Setup:**
```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Run smoke tests
npx playwright test tests/smoke/
```

**CI/CD Integration:**
```yaml
# Example GitHub Actions workflow
- name: Run Smoke Tests
  run: |
    npx playwright test tests/smoke/ --reporter=html
```

**Block Deployment on Failure:**
- Configure CI/CD to fail build if smoke tests fail
- Require all paths to pass before merge

## Test Data Requirements

### Test Users

- **New User:** For Path 2 (signup testing)
- **Expired Trial User:** For Path 2 (trial limit testing)
- **Subscribed User:** For Path 3 (subscription testing)
- **Regular User:** For Path 4 (upload testing)
- **Other User:** For Path 4 (privacy testing)

### Test Content

- **WordPress Posts:** At least 5 blog posts for reading tests
- **Test Images:** Sample images for upload testing (`test-fixtures/test-image.jpg`)
- **Stripe Test Cards:** Use Stripe test mode cards

## Environment Requirements

### Staging/Production-Like

- Separate Supabase project (staging)
- Stripe test mode configured
- WordPress test instance
- Realistic test data

### Test Credentials

Store in `.env.test`:
```
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
TEST_USER_EXPIRED_TRIAL=expired-trial@example.com
TEST_USER_SUBSCRIBED=subscribed@example.com
TEST_USER_OTHER=other@example.com
```

## Smoke Test Checklist

Before deployment:

- [ ] Path 1: Anonymous user reads blog post - ✅ Pass
- [ ] Path 2: Signup → Profile → Trial Read Limit - ✅ Pass
- [ ] Path 3: Subscribe → Unlock Full Access - ✅ Pass
- [ ] Path 4: Upload Photo to Post with Privacy - ✅ Pass
- [ ] Path 5: Save WP Post → View Saved List - ✅ Pass

## Failure Response

### If Smoke Test Fails

1. **Stop Deployment**
   - Do not deploy if any smoke test fails
   - Investigate failure immediately
   - Fix issue
   - Re-run failed test path

2. **Document Failure**
   - Record which path failed
   - Record which step failed
   - Document error message
   - Take screenshots (if automated)

3. **Fix and Verify**
   - Fix the issue
   - Re-run failed path
   - Verify all paths pass before deploying

---

**Related Documents:**
- [QA_CHECKLIST.md](./QA_CHECKLIST.md)
- [RELEASE_PROCEDURE.md](./../procedures/RELEASE_PROCEDURE.md)
- [BILLING_STRIPE_CONTRACT.md](./../contracts/BILLING_STRIPE_CONTRACT.md)
- [UPLOADS_STORAGE_CONTRACT.md](./../contracts/UPLOADS_STORAGE_CONTRACT.md)
