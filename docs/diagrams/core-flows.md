# Core User Flows

**Purpose:** Key user journeys: signup→profile→trial→subscribe; blog read; create post w/ images; report/moderate.

## Flow 1: Signup → Profile → Trial → Subscribe

### Step-by-Step Flow

```
1. User visits landing page
   ↓
2. Clicks "Sign Up"
   ↓
3. Fills signup form (email, password)
   ↓
4. Submits form
   ↓
5. Supabase Auth creates user account
   ↓
6. Server Action creates profile in database
   ├── id = auth.users.id
   ├── username = generated/provided
   ├── role = 'talent' (default)
   └── privacy_level = 'public' (default)
   ↓
7. Stripe subscription created with 7-day trial
   ├── trial_period_days = 7
   └── status = 'trialing'
   ↓
8. Subscription saved to database
   ↓
9. Redirect based on role
   ├── 'talent' → /talent/dashboard
   ├── 'client' → /client/dashboard
   └── default → /dashboard
   ↓
10. Welcome email sent (Resend)
   ↓
11. User sees dashboard with trial countdown
```

### Database Changes

```sql
-- Profiles table
INSERT INTO profiles (id, username, role, privacy_level)
VALUES (auth.uid(), 'username', 'talent', 'public');

-- Subscriptions table
INSERT INTO subscriptions (user_id, stripe_subscription_id, status, trial_start, trial_end)
VALUES (user_id, 'sub_...', 'trialing', NOW(), NOW() + INTERVAL '7 days');
```

### Components Involved

- `app/(auth)/signup/page.tsx` - Signup form
- `app/api/auth/signup/route.ts` - Signup handler (or Server Action)
- `lib/supabase.ts` - Supabase client
- `lib/stripe.ts` - Stripe client
- `lib/resend.ts` - Email client

## Flow 2: Blog Read (WordPress Content)

### Step-by-Step Flow

```
1. User visits /blog (anonymous OK)
   ↓
2. Next.js Server Component
   ↓
3. Check ISR cache
   ├── If cached and fresh → Return cached HTML
   └── If stale/missing → Continue
   ↓
4. Fetch from WordPress REST API
   ├── GET /wp-json/wp/v2/posts
   ├── _embed=true (include featured images, author)
   └── per_page=10
   ↓
5. Sanitize HTML content
   ├── DOMPurify sanitization
   └── Allowed tags/attributes
   ↓
6. Cache response (ISR, 1 hour)
   ↓
7. Render HTML with Next.js Image optimization
   ↓
8. Return to user
```

### Single Post Flow

```
1. User clicks blog post
   ↓
2. Navigate to /blog/[slug]
   ↓
3. Next.js Server Component
   ↓
4. Check ISR cache
   ↓
5. Fetch from WordPress
   ├── GET /wp-json/wp/v2/posts?slug={slug}&_embed=true
   ↓
6. If not found → 404
   ↓
7. Sanitize and render
   ↓
8. Return to user
```

### Revalidation Flow

```
1. Admin publishes post in WordPress
   ↓
2. WordPress webhook triggers
   ├── POST /api/revalidate/wordpress
   ├── Headers: x-wordpress-secret
   └── Body: { post_id, post_type, action, post: { slug } }
   ↓
3. Verify webhook secret
   ↓
4. Revalidate ISR cache
   ├── revalidatePath('/blog')
   └── revalidatePath(`/blog/${slug}`)
   ↓
5. Next request fetches fresh content
```

### Components Involved

- `app/blog/page.tsx` - Blog listing
- `app/blog/[slug]/page.tsx` - Single post
- `lib/wordpress.ts` - WordPress client
- `app/api/revalidate/wordpress/route.ts` - Revalidation webhook

## Flow 3: Create Post with Images

### Step-by-Step Flow

```
1. User navigates to /posts/create
   ↓
2. User fills post form
   ├── Title (required, max 200 chars)
   ├── Content (required, max 5000 chars)
   ├── Privacy toggle (public/limited/private)
   └── Images (optional, multiple, max 10)
   ↓
3. User submits form
   ↓
4. Client-side validation
   ├── Check file types (JPEG, PNG, WebP)
   ├── Check file sizes (max 5MB each)
   └── Check total file count (max 10)
   ↓
5. Server Action: createPost()
   ↓
6. Verify authentication (getUser)
   ↓
7. Server-side validation
   ├── Validate title, content
   └── Validate images
   ↓
8. Insert post to database
   ├── INSERT INTO community_posts
   └── Return post ID
   ↓
9. Upload images to Supabase Storage
   ├── For each image:
   │   ├── Generate filename: {user_id}/posts/{post_id}/{timestamp}-{index}.{ext}
   │   ├── Upload to 'user-uploads' bucket
   │   └── Get public URL
   ↓
10. Insert image records to database
    ├── INSERT INTO post_images
    └── Link to post_id
    ↓
11. Return success response
    ↓
12. Redirect to post detail page
    ↓
13. Display new post
```

### Database Changes

```sql
-- Insert post
INSERT INTO community_posts (author_id, title, content, is_public, status)
VALUES (auth.uid(), 'Title', 'Content', true, 'published')
RETURNING id;

-- Insert images
INSERT INTO post_images (post_id, image_url, storage_path, order)
VALUES 
  (post_id, 'https://...', 'user_id/posts/post_id/image1.jpg', 0),
  (post_id, 'https://...', 'user_id/posts/post_id/image2.jpg', 1);
```

### Components Involved

- `app/posts/create/page.tsx` - Create post form
- `app/actions/posts.ts` - Server Actions
- `lib/supabase.ts` - Supabase client (storage)
- `components/ui/image-upload.tsx` - Image upload component

## Flow 4: Report & Moderate Content

### User Report Flow

```
1. User views post/profile
   ↓
2. Clicks "Report" button
   ↓
3. Report modal opens
   ↓
4. User selects reason
   ├── Spam
   ├── Harassment
   ├── Inappropriate
   ├── Copyright
   └── Other
   ↓
5. User optionally adds description
   ↓
6. User submits report
   ↓
7. Server Action: createReport()
   ↓
8. Verify authentication
   ↓
9. Insert report to database
   ├── INSERT INTO reports
   ├── reporter_id = auth.uid()
   ├── post_id = post.id (or profile_id)
   ├── reason = selected reason
   └── status = 'pending'
   ↓
10. Return success response
    ↓
11. Show confirmation message
    ↓
12. Close modal
```

### Admin Moderation Flow

```
1. Admin navigates to /admin/moderation
   ↓
2. Server Component fetches reports
   ├── SELECT * FROM reports WHERE status = 'pending'
   └── ORDER BY created_at DESC
   ↓
3. Display reports list
   ├── Post/profile info
   ├── Reporter info
   ├── Reason
   └── Description
   ↓
4. Admin reviews report
   ↓
5. Admin takes action
   ├── Resolve (no action needed)
   ├── Remove content
   ├── Warn user
   └── Ban user (future)
   ↓
6. Update report status
   ├── UPDATE reports SET status = 'resolved'
   └── Add admin_notes
   ↓
7. If content removed:
   ├── UPDATE community_posts SET status = 'removed'
   └── Notify content owner (future)
   ↓
8. Refresh reports list
```

### Database Changes

```sql
-- Create report
INSERT INTO reports (reporter_id, post_id, reason, description, status)
VALUES (auth.uid(), post_id, 'spam', 'Description', 'pending');

-- Resolve report (admin)
UPDATE reports
SET status = 'resolved', admin_notes = 'Notes'
WHERE id = report_id;

-- Remove content (admin)
UPDATE community_posts
SET status = 'removed'
WHERE id = post_id;
```

### Components Involved

- `components/report-button.tsx` - Report button
- `app/actions/reports.ts` - Report Server Actions
- `app/admin/moderation/page.tsx` - Admin moderation page
- `components/admin/report-list.tsx` - Reports list component

## Flow Diagrams Summary

### Authentication Flow
```
Signup → Auth → Profile → Trial → Dashboard
```

### Content Flow
```
WordPress → ISR Cache → Next.js → User
Publish → Webhook → Revalidate → Fresh Content
```

### Post Creation Flow
```
Form → Validation → Database → Storage → Success
```

### Moderation Flow
```
Report → Database → Admin Review → Action → Resolution
```

---

**Related Documents:**
- [airport-model.md](./airport-model.md)
- [high-level-architecture.md](./high-level-architecture.md)
- [USER_GUIDE.md](./../USER_GUIDE.md)
- [E2E_SMOKE_PATHS.md](./../proof/E2E_SMOKE_PATHS.md)

