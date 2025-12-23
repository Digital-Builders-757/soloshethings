--
-- SoloSHEThings Initial Database Schema (v0)
-- Generated from: docs/database_schema_audit.md
-- Date: 2025-01-27
--
-- This migration creates the complete initial database schema including:
-- - Enums for type safety
-- - Core tables (profiles, subscriptions, community_posts, etc.)
-- - Row Level Security (RLS) policies
-- - Indexes for performance
-- - Triggers for automatic timestamp updates
-- - Storage bucket policies
--

-- ============================================================================
-- ENUMS
-- ============================================================================

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

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles
-- User profile information linked to Supabase Auth users
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- subscriptions
-- Stripe subscription tracking linked to user profiles
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- community_posts
-- User-generated community posts with privacy controls
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- post_images
-- Images associated with community posts
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- saved_posts
-- User-saved posts (bookmarks for WordPress posts or community posts)
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- reports
-- Content moderation reports
-- ----------------------------------------------------------------------------

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

-- ----------------------------------------------------------------------------
-- events (Stub - Future Feature)
-- Event/workshop management (schema defined but not implemented in v0)
-- ----------------------------------------------------------------------------

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

-- Note: Indexes, RLS, and triggers to be created when feature is implemented

-- ----------------------------------------------------------------------------
-- messages (Stub - Future Feature)
-- Direct messaging between users (schema defined but not implemented in v0)
-- ----------------------------------------------------------------------------

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(content) <= 2000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Note: Indexes and RLS to be created when feature is implemented

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create user-uploads bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', false);

-- Enable RLS on storage.objects
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

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Schema v0 implementation complete
-- Next step: Generate TypeScript types
-- Command: supabase gen types typescript --local > types/database.ts
