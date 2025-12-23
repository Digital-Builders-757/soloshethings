# Database Report

**Purpose:** Schema evolution history, product mapping, RLS design, access patterns, and database strategy for SoloSheThings.

## Current Schema Version

**Version:** v0  
**Last Migration:** Initial schema  
**Last Updated:** 2025-01-27  
**Status:** Ready for implementation

## Product Mapping: Why Each Table Exists

### profiles

**Product Purpose:** User identity and profile management for solo female travelers.

**Why It Exists:**
- Links Supabase Auth users to application data
- Stores user profile information (username, bio, avatar)
- Manages user roles ('talent' for travelers, 'client' for future brand accounts)
- Enables privacy controls (public/limited/private)
- Required for all user-generated content and community features

**Product Features Enabled:**
- User profiles and avatars
- Privacy settings
- Role-based access control
- Community participation

### subscriptions

**Product Purpose:** Stripe subscription and trial management.

**Why It Exists:**
- Tracks Stripe subscription state (active, trialing, canceled, etc.)
- Manages 1-week free trial period
- Enables subscription-gated features ($3.99/month after trial)
- Links Stripe customer/subscription IDs to user profiles
- Required for access control (trial vs subscribed users)

**Product Features Enabled:**
- Free trial (1 week)
- Subscription billing ($3.99/month)
- Access control for premium features
- Subscription management

### community_posts

**Product Purpose:** User-generated community content (travel posts, stories, tips).

**Why It Exists:**
- Enables users to create and share travel content
- Supports privacy controls (public/limited/private)
- Allows content moderation (status: draft, published, archived, removed)
- Enables featured posts (admin-curated)
- Core community feature for solo female travelers

**Product Features Enabled:**
- Create and share travel posts
- Privacy controls on posts
- Content moderation
- Community feed

### post_images

**Product Purpose:** Image attachments for community posts.

**Why It Exists:**
- Allows users to attach multiple images to posts
- Links images to posts with ordering
- Stores Supabase storage URLs and paths
- Supports alt text for accessibility
- Required for rich media posts

**Product Features Enabled:**
- Multiple images per post
- Image ordering
- Accessibility (alt text)
- Image management

### saved_posts

**Product Purpose:** User bookmarks for both WordPress editorial content and community posts.

**Why It Exists:**
- Allows users to save WordPress blog posts (by slug)
- Allows users to save community posts (by ID)
- Enables "read later" functionality
- Supports both editorial and community content in one table
- No WordPress authentication needed (public content)

**Product Features Enabled:**
- Save WordPress blog posts
- Save community posts
- Personal bookmark collection
- Cross-content type saving

### reports

**Product Purpose:** Content moderation and safety reporting.

**Why It Exists:**
- Enables users to report inappropriate content
- Supports reporting both posts and profiles
- Tracks report status (pending, reviewed, resolved, dismissed)
- Stores admin notes for moderation workflow
- Required for community safety

**Product Features Enabled:**
- Report inappropriate content
- Report users
- Moderation workflow
- Community safety

### events (Stub)

**Product Purpose:** Future feature for events and workshops.

**Why It Exists:**
- Schema defined for future implementation
- Will enable event creation and management
- Will support event registration
- Not implemented in v0

### messages (Stub)

**Product Purpose:** Future feature for direct messaging.

**Why It Exists:**
- Schema defined for future implementation
- Will enable direct messaging between users
- Will support read receipts
- Not implemented in v0

## RLS Design: Public Read vs Private Write

### Design Philosophy

**Default Deny:** All tables have RLS enabled with default deny (no access unless policy allows).

**Public Read Pattern:**
- Public content can be read by authenticated users
- Examples: public profiles, public posts
- RLS policies use `privacy_level = 'public'` or `is_public = true`

**Private Write Pattern:**
- Users can only write (INSERT/UPDATE/DELETE) their own data
- RLS policies use `auth.uid() = user_id` or `auth.uid() = author_id`
- Prevents users from modifying other users' data

### RLS Policy Patterns

#### Profiles Table

**Public Read:**
```sql
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (privacy_level = 'public');
```

**Private Write:**
```sql
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Community Posts Table

**Public Read:**
```sql
CREATE POLICY "Users can view public published posts"
  ON community_posts FOR SELECT
  USING (is_public = true AND status = 'published');
```

**Private Write:**
```sql
CREATE POLICY "Users can create own posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);
```

#### Subscriptions Table

**Private Read/Write:**
```sql
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

**Note:** Subscriptions are managed via Stripe webhooks (service role), not user writes.

## Access Patterns Per Role

### Anonymous Users

**Database Access:**
- ❌ No direct Supabase access
- ✅ WordPress content via REST API (read-only, no auth)
- ✅ Public previews (if implemented)

**Tables Accessed:**
- None (WordPress content only)

**Storage Access:**
- ❌ No storage access

### Authenticated Users (Logged In)

**Database Access:**
- ✅ Own profile (full access)
- ✅ Public profiles (read-only, limited fields)
- ✅ Public community posts (read-only)
- ✅ Own posts (full access)
- ✅ Own saved posts (full access)
- ✅ Own reports (read-only)
- ❌ Other users' private content
- ❌ Subscriptions (own only, read-only)

**Tables Accessed:**
- `profiles` - Own (full), public (read)
- `community_posts` - Public (read), own (full)
- `post_images` - Accessible posts only
- `saved_posts` - Own only
- `reports` - Own only (create, read)
- `subscriptions` - Own only (read)

**Storage Access:**
- ✅ Own files (upload, view, delete)
- ✅ Public post images (view)

### Trial Users (Authenticated + Active Trial)

**Database Access:**
- Same as authenticated users
- ✅ Trial status in `subscriptions` table (read)

**Tables Accessed:**
- Same as authenticated users
- `subscriptions` - Own (read, trial status)

**Storage Access:**
- Same as authenticated users

### Subscribed Users (Authenticated + Active Subscription)

**Database Access:**
- Same as authenticated users
- ✅ Active subscription status (read)
- ✅ Premium content (when available)

**Tables Accessed:**
- Same as authenticated users
- `subscriptions` - Own (read, active status)
- `events` - When implemented (read, create)

**Storage Access:**
- Same as authenticated users

### Admin Users

**Database Access:**
- ✅ All user data (via service role for admin operations)
- ✅ All posts (including removed/archived)
- ✅ All reports (full access)
- ✅ Can update report status
- ✅ Can feature posts

**Tables Accessed:**
- All tables (via service role)
- Admin operations bypass RLS

**Storage Access:**
- ✅ All files (via service role)

## Index Strategy (Hot Queries)

### Query Patterns Analysis

**Most Frequent Queries:**
1. Get user profile by ID (every page load)
2. List public posts (community feed)
3. Get user's own posts (profile page)
4. Check subscription status (access control)
5. List saved posts (bookmarks page)
6. Search posts by author (profile view)

### Indexes by Table

#### profiles

**Hot Queries:**
- `SELECT * FROM profiles WHERE id = $1` (user lookup)
- `SELECT * FROM profiles WHERE username = $1` (username lookup)
- `SELECT * FROM profiles WHERE privacy_level = 'public'` (public profiles)

**Indexes:**
- `profiles_username_idx` (UNIQUE) - Username lookups
- `profiles_role_idx` - Role filtering
- `profiles_privacy_level_idx` - Public profile queries

**Primary Key:** `id` (indexed automatically)

#### subscriptions

**Hot Queries:**
- `SELECT * FROM subscriptions WHERE user_id = $1` (subscription check)
- `SELECT * FROM subscriptions WHERE status = 'trialing' AND trial_end < NOW()` (trial reminders)

**Indexes:**
- `subscriptions_user_id_idx` (UNIQUE) - User subscription lookup
- `subscriptions_stripe_subscription_id_idx` (UNIQUE) - Webhook lookups
- `subscriptions_status_idx` - Status filtering
- `subscriptions_trial_end_idx` (partial) - Trial expiration queries

#### community_posts

**Hot Queries:**
- `SELECT * FROM community_posts WHERE is_public = true AND status = 'published' ORDER BY created_at DESC` (feed)
- `SELECT * FROM community_posts WHERE author_id = $1` (user's posts)
- `SELECT * FROM community_posts WHERE id = $1` (single post)

**Indexes:**
- `community_posts_author_id_idx` - User's posts queries
- `community_posts_status_idx` - Status filtering
- `community_posts_created_at_idx` (DESC) - Feed ordering
- `community_posts_is_public_idx` - Public post filtering
- `community_posts_public_published_idx` (composite, partial) - Feed queries (hot path)

**Hot Path Index:**
```sql
CREATE INDEX community_posts_public_published_idx 
ON community_posts(is_public, status) 
WHERE is_public = true AND status = 'published';
```

#### post_images

**Hot Queries:**
- `SELECT * FROM post_images WHERE post_id = $1 ORDER BY "order"` (post images)

**Indexes:**
- `post_images_post_id_idx` - Post image lookups
- `post_images_order_idx` (composite) - Image ordering

#### saved_posts

**Hot Queries:**
- `SELECT * FROM saved_posts WHERE user_id = $1` (user's bookmarks)
- `SELECT * FROM saved_posts WHERE user_id = $1 AND wp_post_slug = $2` (check if saved)

**Indexes:**
- `saved_posts_user_id_idx` - User's bookmarks
- `saved_posts_wp_post_slug_idx` (partial) - WordPress post lookups
- `saved_posts_user_wp_unique_idx` (composite, partial) - Prevent duplicate saves

#### reports

**Hot Queries:**
- `SELECT * FROM reports WHERE status = 'pending' ORDER BY created_at DESC` (moderation queue)
- `SELECT * FROM reports WHERE reporter_id = $1` (user's reports)

**Indexes:**
- `reports_reporter_id_idx` - User's reports
- `reports_status_idx` - Moderation queue filtering
- `reports_created_at_idx` (DESC) - Queue ordering

## Storage Strategy for Images

### Bucket Configuration

**Bucket Name:** `user-uploads`

**Configuration:**
- **Public:** No (access via signed URLs or RLS)
- **File Size Limit:** 5MB per file
- **Allowed Types:** `image/jpeg`, `image/png`, `image/webp`
- **Auto-optimize:** Yes (via Next.js Image component)

### Folder Structure

```
user-uploads/
  {user_id}/
    avatars/
      {timestamp}-{random}.{ext}
    posts/
      {post_id}/
        {timestamp}-{index}.{ext}
```

**Path Examples:**
- Avatar: `a1b2c3d4-.../avatars/1706356800000-abc123.jpg`
- Post Image: `a1b2c3d4-.../posts/e5f6g7h8-.../1706356800000-0.jpg`

### Metadata Storage

**In Database (`post_images` table):**
- `image_url` - Full Supabase storage URL
- `storage_path` - Relative path in bucket (`{user_id}/posts/{post_id}/{filename}`)
- `alt_text` - Accessibility text (nullable)
- `order` - Display order (0, 1, 2, ...)

**Not Stored in Database:**
- File size (validated on upload, not stored)
- MIME type (validated on upload, not stored)
- Upload timestamp (use `created_at` from table)

### Access Patterns

**Public Images:**
- Public post images use public URLs
- No signed URL needed
- RLS policy allows access for public posts

**Private Images:**
- Private post images use signed URLs
- 1-hour expiry
- RLS policy restricts access

**Avatar Images:**
- Use public URLs (if profile is public)
- Use signed URLs (if profile is private)
- RLS policy enforces profile privacy

### Storage RLS Policies

**Upload (INSERT):**
```sql
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**View (SELECT):**
```sql
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Delete (DELETE):**
```sql
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## WordPress Editorial Content Relationship

### No WordPress Authentication

**Key Point:** WordPress content is public and requires no authentication.

**Why:**
- WordPress is read-only from Next.js
- All WordPress content is public (editorial/blog posts)
- No user accounts in WordPress
- No WordPress authentication needed

### saved_posts and WordPress

**How It Works:**
- Users can save WordPress posts by `wp_post_slug`
- `saved_posts.post_type = 'wordpress'` indicates WordPress post
- `saved_posts.wp_post_slug` stores the WordPress post slug
- No foreign key to WordPress (WordPress is external)

**Example:**
```sql
-- User saves WordPress post
INSERT INTO saved_posts (user_id, post_type, wp_post_slug)
VALUES ('user-id', 'wordpress', 'my-travel-tips');

-- User saves community post
INSERT INTO saved_posts (user_id, post_type, community_post_id)
VALUES ('user-id', 'community', 'post-uuid');
```

**Query Pattern:**
```typescript
// Get user's saved WordPress posts
const { data } = await supabase
  .from('saved_posts')
  .select('wp_post_slug')
  .eq('user_id', userId)
  .eq('post_type', 'wordpress');

// Fetch WordPress content by slug (external API)
const posts = await Promise.all(
  data.map(slug => fetchWordPressPost(slug.wp_post_slug))
);
```

### WordPress Content Flow

1. **WordPress publishes post** → WordPress REST API
2. **Next.js fetches via ISR** → Server Component, no auth
3. **User saves post** → `saved_posts` table with `wp_post_slug`
4. **User views saved posts** → Query `saved_posts`, fetch WordPress content by slug

**No Database Relationship:**
- WordPress posts are not stored in Supabase
- Only slugs are stored in `saved_posts`
- WordPress content fetched on-demand via REST API

## Migration History

### v0 - Initial Schema (2025-01-27)

**Status:** ✅ Defined (not yet applied)

**Tables Created:**
- `profiles` - User profile information
- `subscriptions` - Stripe subscription tracking
- `community_posts` - User-generated posts
- `post_images` - Post image associations
- `saved_posts` - User bookmarks (WordPress + community)
- `reports` - Content moderation
- `events` - Event management (stub)
- `messages` - Direct messaging (stub)

**Storage Buckets:**
- `user-uploads` - User file uploads

**Functions:**
- `update_updated_at()` - Timestamp update trigger

**RLS Policies:**
- All tables have RLS enabled with appropriate policies
- Storage bucket policies defined

**Migration File:** `supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql` (to be created)

## Schema Changes Log

### Pending Changes

None currently.

### Applied Changes

None yet (initial schema not yet applied).

## Migration Procedure

See [MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md) for detailed migration workflow.

## Database Statistics

### Table Sizes

*To be populated after schema is applied and data exists.*

### Index Usage

*To be monitored after deployment.*

### RLS Policy Performance

*To be monitored after deployment.*

## Known Issues

None currently.

## Future Schema Changes

### Planned (Not Yet Implemented)

1. **Events Table** - Full implementation with attendees, bookings
2. **Messages Table** - Full implementation with read receipts, typing indicators
3. **Connections/Followers** - User relationship table
4. **Notifications** - In-app notification system
5. **Analytics** - User engagement tracking

### Under Consideration

- Full-text search indexes on posts
- Materialized views for popular content
- Archive tables for deleted content (soft deletes)

## Backup & Recovery

### Backup Strategy

- Supabase automatic daily backups
- Point-in-time recovery available
- Manual backup before major migrations

### Recovery Procedures

1. Identify point-in-time for recovery
2. Contact Supabase support if needed
3. Restore from backup
4. Replay migrations if necessary

## Performance Monitoring

### Key Metrics

- Query performance (to be monitored)
- RLS policy execution time
- Index usage statistics
- Connection pool usage

### Optimization Opportunities

*To be identified after production deployment and monitoring.*

## Security Audit

### RLS Coverage

- ✅ All tables have RLS enabled
- ✅ All storage buckets have policies
- ✅ Service role usage is minimal and documented

### Access Control

- ✅ User data isolated by `auth.uid()`
- ✅ Public content properly gated
- ✅ Admin operations require service role

## Migration Checklist

Before applying a migration:

- [ ] Migration file created with timestamp
- [ ] Migration tested locally
- [ ] RLS policies reviewed
- [ ] Indexes reviewed for performance
- [ ] Foreign key constraints reviewed
- [ ] Backup created (production only)
- [ ] Migration applied to staging first
- [ ] Migration applied to production
- [ ] Post-migration verification completed

---

**Related Documents:**
- [database_schema_audit.md](./database_schema_audit.md)
- [procedures/MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md)
- [contracts/DATA_ACCESS_QUERY_CONTRACT.md](./contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- [contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
