# Database Schema Audit

**Purpose:** Single source of truth for Supabase database schema (v0). This document defines the exact schema that must be implemented.

## Schema Version: v0

**Last Updated:** 2025-01-27
**Migration Base:** Initial schema
**Migration File:** `supabase/migrations/20250101000000_initial_schema.sql`
**Status:** ✅ Implemented - Migration ready to run

## Important Rules

### Generated Types Come From This

**MUST:**
- TypeScript types MUST be generated from the actual database schema
- After any schema change, regenerate types: `supabase gen types typescript --local > types/database.ts`
- Never manually edit generated types
- This document is the source of truth for what types should be generated

**MUST NOT:**
- Manually write database types
- Edit generated type files
- Use types that don't match this schema

### Migration Workflow

**MUST:**
- Create new migration file: `supabase migration new <description>`
- Never edit existing migrations
- Test migrations locally: `supabase db reset`
- Update this document when schema changes
- See [MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md) for full workflow

## Complete Schema Definition

### Enums

```sql
-- User roles
CREATE TYPE user_role AS ENUM ('talent', 'client');

-- Privacy levels
CREATE TYPE privacy_level AS ENUM ('public', 'limited', 'private');

-- Subscription statuses
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete');

-- Post statuses
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived', 'removed');

-- Report reasons
CREATE TYPE report_reason AS ENUM ('spam', 'harassment', 'inappropriate', 'copyright', 'other');

-- Report statuses
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- Event statuses
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

-- Saved post types
CREATE TYPE saved_post_type AS ENUM ('wordpress', 'community');
```

### Functions

```sql
-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Tables

### profiles

User profile information linked to Supabase Auth users.

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  full_name text,
  bio text CHECK (char_length(bio) <= 500),
  avatar_url text,
  role user_role NOT NULL DEFAULT 'talent',
  privacy_level privacy_level NOT NULL DEFAULT 'public',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_privacy_level_idx ON profiles(privacy_level);

-- RLS (Default deny - no access unless policy allows)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (privacy_level = 'public');

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, REFERENCES auth.users(id), ON DELETE CASCADE
- `username` - text, NOT NULL, UNIQUE
- `full_name` - text, NULLABLE
- `bio` - text, NULLABLE, CHECK (char_length <= 500)
- `avatar_url` - text, NULLABLE
- `role` - user_role enum, NOT NULL, DEFAULT 'talent'
- `privacy_level` - privacy_level enum, NOT NULL, DEFAULT 'public'
- `created_at` - timestamptz, NOT NULL, DEFAULT now()
- `updated_at` - timestamptz, NOT NULL, DEFAULT now()

### subscriptions

Stripe subscription tracking linked to user profiles.

```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  status subscription_status NOT NULL,
  trial_start timestamptz,
  trial_end timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE UNIQUE INDEX subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);
CREATE INDEX subscriptions_trial_end_idx ON subscriptions(trial_end) WHERE trial_end IS NOT NULL;

-- RLS (Default deny)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage subscriptions (via webhook)
-- Note: Service role bypasses RLS, so no policy needed for webhook operations

-- Trigger
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, DEFAULT gen_random_uuid()
- `user_id` - uuid, NOT NULL, UNIQUE, REFERENCES profiles(id), ON DELETE CASCADE
- `stripe_subscription_id` - text, NOT NULL, UNIQUE
- `stripe_customer_id` - text, NOT NULL
- `status` - subscription_status enum, NOT NULL
- `trial_start` - timestamptz, NULLABLE
- `trial_end` - timestamptz, NULLABLE
- `current_period_start` - timestamptz, NULLABLE
- `current_period_end` - timestamptz, NULLABLE
- `cancel_at_period_end` - boolean, NOT NULL, DEFAULT false
- `created_at` - timestamptz, NOT NULL, DEFAULT now()
- `updated_at` - timestamptz, NOT NULL, DEFAULT now()

### community_posts

User-generated community posts with privacy controls.

```sql
CREATE TABLE community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) <= 200),
  content text NOT NULL CHECK (char_length(content) <= 5000),
  is_public boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  status post_status NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX community_posts_author_id_idx ON community_posts(author_id);
CREATE INDEX community_posts_status_idx ON community_posts(status);
CREATE INDEX community_posts_created_at_idx ON community_posts(created_at DESC);
CREATE INDEX community_posts_is_public_idx ON community_posts(is_public);
CREATE INDEX community_posts_public_published_idx ON community_posts(is_public, status) WHERE is_public = true AND status = 'published';

-- RLS (Default deny)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public published posts"
  ON community_posts FOR SELECT
  USING (is_public = true AND status = 'published');

CREATE POLICY "Users can view own posts"
  ON community_posts FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Users can create own posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  USING (auth.uid() = author_id AND status != 'removed');

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Trigger
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, DEFAULT gen_random_uuid()
- `author_id` - uuid, NOT NULL, REFERENCES profiles(id), ON DELETE CASCADE
- `title` - text, NOT NULL, CHECK (char_length <= 200)
- `content` - text, NOT NULL, CHECK (char_length <= 5000)
- `is_public` - boolean, NOT NULL, DEFAULT true
- `is_featured` - boolean, NOT NULL, DEFAULT false (admin-only flag)
- `status` - post_status enum, NOT NULL, DEFAULT 'published'
- `created_at` - timestamptz, NOT NULL, DEFAULT now()
- `updated_at` - timestamptz, NOT NULL, DEFAULT now()

### post_images

Images associated with community posts.

```sql
CREATE TABLE post_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text NOT NULL,
  alt_text text CHECK (char_length(alt_text) <= 200),
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX post_images_post_id_idx ON post_images(post_id);
CREATE INDEX post_images_order_idx ON post_images(post_id, "order");

-- RLS (Default deny)
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view images for accessible posts"
  ON post_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND (
        (cp.is_public = true AND cp.status = 'published')
        OR cp.author_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create images for own posts"
  ON post_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND cp.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images for own posts"
  ON post_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND cp.author_id = auth.uid()
    )
  );
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, DEFAULT gen_random_uuid()
- `post_id` - uuid, NOT NULL, REFERENCES community_posts(id), ON DELETE CASCADE
- `image_url` - text, NOT NULL (Supabase storage URL)
- `storage_path` - text, NOT NULL (Storage bucket path)
- `alt_text` - text, NULLABLE, CHECK (char_length <= 200)
- `order` - integer, NOT NULL, DEFAULT 0
- `created_at` - timestamptz, NOT NULL, DEFAULT now()

### saved_posts

User-saved posts (bookmarks for WordPress posts or community posts).

```sql
CREATE TABLE saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type saved_post_type NOT NULL,
  wp_post_slug text,
  community_post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT saved_posts_type_check CHECK (
    (post_type = 'wordpress' AND wp_post_slug IS NOT NULL AND community_post_id IS NULL) OR
    (post_type = 'community' AND community_post_id IS NOT NULL AND wp_post_slug IS NULL)
  )
);

-- Indexes
CREATE INDEX saved_posts_user_id_idx ON saved_posts(user_id);
CREATE INDEX saved_posts_post_type_idx ON saved_posts(post_type);
CREATE INDEX saved_posts_wp_post_slug_idx ON saved_posts(wp_post_slug) WHERE wp_post_slug IS NOT NULL;
CREATE INDEX saved_posts_community_post_id_idx ON saved_posts(community_post_id) WHERE community_post_id IS NOT NULL;
CREATE UNIQUE INDEX saved_posts_user_wp_unique_idx ON saved_posts(user_id, wp_post_slug) WHERE wp_post_slug IS NOT NULL;
CREATE UNIQUE INDEX saved_posts_user_community_unique_idx ON saved_posts(user_id, community_post_id) WHERE community_post_id IS NOT NULL;

-- RLS (Default deny)
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved posts"
  ON saved_posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saved posts"
  ON saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved posts"
  ON saved_posts FOR DELETE
  USING (auth.uid() = user_id);
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, DEFAULT gen_random_uuid()
- `user_id` - uuid, NOT NULL, REFERENCES profiles(id), ON DELETE CASCADE
- `post_type` - saved_post_type enum, NOT NULL ('wordpress' | 'community')
- `wp_post_slug` - text, NULLABLE (required if post_type = 'wordpress')
- `community_post_id` - uuid, NULLABLE, REFERENCES community_posts(id), ON DELETE CASCADE (required if post_type = 'community')
- `created_at` - timestamptz, NOT NULL, DEFAULT now()

**Constraint:** Exactly one of `wp_post_slug` or `community_post_id` must be set based on `post_type`.

### reports

Content moderation reports.

```sql
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason report_reason NOT NULL,
  description text CHECK (char_length(description) <= 1000),
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reports_target_check CHECK (
    (post_id IS NOT NULL AND profile_id IS NULL) OR
    (post_id IS NULL AND profile_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX reports_reporter_id_idx ON reports(reporter_id);
CREATE INDEX reports_post_id_idx ON reports(post_id) WHERE post_id IS NOT NULL;
CREATE INDEX reports_profile_id_idx ON reports(profile_id) WHERE profile_id IS NOT NULL;
CREATE INDEX reports_status_idx ON reports(status);
CREATE INDEX reports_created_at_idx ON reports(created_at DESC);

-- RLS (Default deny)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Admin access handled via service role (application layer checks role)
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, DEFAULT gen_random_uuid()
- `reporter_id` - uuid, NOT NULL, REFERENCES profiles(id), ON DELETE CASCADE
- `post_id` - uuid, NULLABLE, REFERENCES community_posts(id), ON DELETE CASCADE
- `profile_id` - uuid, NULLABLE, REFERENCES profiles(id), ON DELETE CASCADE
- `reason` - report_reason enum, NOT NULL
- `description` - text, NULLABLE, CHECK (char_length <= 1000)
- `status` - report_status enum, NOT NULL, DEFAULT 'pending'
- `admin_notes` - text, NULLABLE (admin-only field)
- `created_at` - timestamptz, NOT NULL, DEFAULT now()
- `updated_at` - timestamptz, NOT NULL, DEFAULT now()

**Constraint:** Exactly one of `post_id` or `profile_id` must be set.

### events (Stub - Future Feature)

Event/workshop management (schema defined but not implemented in v0).

```sql
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  location text,
  max_attendees integer CHECK (max_attendees > 0),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status event_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes (to be created when feature is implemented)
-- CREATE INDEX events_created_by_idx ON events(created_by);
-- CREATE INDEX events_status_idx ON events(status);
-- CREATE INDEX events_event_date_idx ON events(event_date);

-- RLS (to be enabled when feature is implemented)
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- Policies to be defined when feature is implemented

-- Trigger (to be created when feature is implemented)
-- CREATE TRIGGER update_events_updated_at
--   BEFORE UPDATE ON events
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at();
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, DEFAULT gen_random_uuid()
- `title` - text, NOT NULL
- `description` - text, NULLABLE
- `event_date` - timestamptz, NOT NULL
- `location` - text, NULLABLE
- `max_attendees` - integer, NULLABLE, CHECK (> 0)
- `created_by` - uuid, NOT NULL, REFERENCES profiles(id), ON DELETE CASCADE
- `status` - event_status enum, NOT NULL, DEFAULT 'draft'
- `created_at` - timestamptz, NOT NULL, DEFAULT now()
- `updated_at` - timestamptz, NOT NULL, DEFAULT now()

**Note:** RLS policies and indexes to be defined when feature is implemented.

### messages (Stub - Future Feature)

Direct messaging between users (schema defined but not implemented in v0).

```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(content) <= 2000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes (to be created when feature is implemented)
-- CREATE INDEX messages_sender_id_idx ON messages(sender_id);
-- CREATE INDEX messages_receiver_id_idx ON messages(receiver_id);
-- CREATE INDEX messages_read_at_idx ON messages(read_at) WHERE read_at IS NULL;

-- RLS (to be enabled when feature is implemented)
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- Policies to be defined when feature is implemented
```

**Column Details:**
- `id` - uuid, PRIMARY KEY, DEFAULT gen_random_uuid()
- `sender_id` - uuid, NOT NULL, REFERENCES profiles(id), ON DELETE CASCADE
- `receiver_id` - uuid, NOT NULL, REFERENCES profiles(id), ON DELETE CASCADE
- `content` - text, NOT NULL, CHECK (char_length <= 2000)
- `read_at` - timestamptz, NULLABLE
- `created_at` - timestamptz, NOT NULL, DEFAULT now()

**Note:** RLS policies and indexes to be defined when feature is implemented.

## Storage Buckets

### user-uploads

User-uploaded images (profile avatars, post images).

**Configuration:**
- **Public:** No (access via signed URLs or RLS)
- **File Size Limit:** 5MB per file
- **Allowed Types:** `image/jpeg`, `image/png`, `image/webp`

**Folder Structure:**
```
user-uploads/
  {user_id}/
    avatars/
      {filename}
    posts/
      {post_id}/
        {filename}
```

**RLS Policies:**
```sql
-- Enable RLS on storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Users can upload to own folder only
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view own files
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view public post images
CREATE POLICY "Users can view public post images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads' AND
    EXISTS (
      SELECT 1 FROM post_images pi
      JOIN community_posts cp ON pi.post_id = cp.id
      WHERE pi.storage_path = storage.objects.name
      AND cp.is_public = true
      AND cp.status = 'published'
    )
  );

-- Users can delete own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Relationship Diagram (Text Description)

```
auth.users (Supabase Auth)
  └─> profiles (1:1, ON DELETE CASCADE)
      ├─> subscriptions (1:1, ON DELETE CASCADE)
      ├─> community_posts (1:many, ON DELETE CASCADE)
      │   └─> post_images (1:many, ON DELETE CASCADE)
      ├─> saved_posts (1:many, ON DELETE CASCADE)
      │   └─> community_posts (many:1, optional, ON DELETE CASCADE)
      ├─> reports (1:many as reporter, ON DELETE CASCADE)
      │   ├─> community_posts (many:1, optional, ON DELETE CASCADE)
      │   └─> profiles (many:1 as reported profile, optional, ON DELETE CASCADE)
      ├─> events (1:many as creator, ON DELETE CASCADE) [stub]
      ├─> messages (1:many as sender, ON DELETE CASCADE) [stub]
      └─> messages (1:many as receiver, ON DELETE CASCADE) [stub]
```

**Key Relationships:**
- `profiles.id` = `auth.users.id` (1:1, managed by Supabase Auth)
- Each user has exactly one profile and one subscription
- Users can create many community posts
- Each post can have many images
- Users can save both WordPress posts (by slug) and community posts (by ID)
- Users can report posts or other profiles
- Events and messages are future features (stubs)

## Constraints Summary

### Foreign Keys
- All foreign keys use `ON DELETE CASCADE` to maintain referential integrity
- `profiles.id` → `auth.users.id` (managed by Supabase Auth)

### Check Constraints
- `profiles.bio` - max 500 characters
- `community_posts.title` - max 200 characters
- `community_posts.content` - max 5000 characters
- `post_images.alt_text` - max 200 characters
- `reports.description` - max 1000 characters
- `messages.content` - max 2000 characters
- `events.max_attendees` - must be > 0
- `saved_posts` - exactly one of `wp_post_slug` or `community_post_id` must be set
- `reports` - exactly one of `post_id` or `profile_id` must be set

### Unique Constraints
- `profiles.username` - unique
- `profiles.id` - unique (primary key)
- `subscriptions.user_id` - unique (one subscription per user)
- `subscriptions.stripe_subscription_id` - unique
- `saved_posts(user_id, wp_post_slug)` - unique (can't save same WP post twice)
- `saved_posts(user_id, community_post_id)` - unique (can't save same community post twice)

## Implementation Checklist

When implementing this schema:

- [ ] Create all enums first
- [ ] Create `update_updated_at()` function
- [ ] Create tables in dependency order (profiles first, then dependent tables)
- [ ] Create all indexes
- [ ] Enable RLS on all tables
- [ ] Create RLS policies (default deny, explicit allow)
- [ ] Create triggers for `updated_at` columns
- [ ] Create storage bucket `user-uploads`
- [ ] Create storage bucket RLS policies
- [ ] Test RLS policies with different user roles
- [ ] Generate TypeScript types from schema
- [ ] Verify all foreign keys and constraints

## Migration Workflow

See [MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md) for complete migration workflow.

**Quick Reference:**
1. Create migration: `supabase migration new initial_schema`
2. Write SQL in migration file
3. Test locally: `supabase db reset`
4. Generate types: `supabase gen types typescript --local > types/database.ts`
5. Update this document if schema changes

---

**Related Documents:**
- [DATABASE_REPORT.md](./DATABASE_REPORT.md)
- [procedures/MIGRATION_PROCEDURE.md](./procedures/MIGRATION_PROCEDURE.md)
- [contracts/DATA_ACCESS_QUERY_CONTRACT.md](./contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md)
