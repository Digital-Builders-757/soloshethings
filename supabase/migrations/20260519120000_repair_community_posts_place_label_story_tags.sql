-- Idempotent repair: ensure community_posts has place_label + story_tags and related objects.
-- Use when production returns PGRST/Postgres 42703 ("column ... place_label does not exist") because
-- migration 20260515194500_community_place_label_story_tags.sql was not applied to the linked project.
-- Safe on databases where 20260515194500 already ran fully (all steps no-op or skip via IF NOT EXISTS).

ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS place_label text;

ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS story_tags text[] NOT NULL DEFAULT '{}';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'community_posts_place_label_len'
      AND n.nspname = 'public'
      AND t.relname = 'community_posts'
  ) THEN
    ALTER TABLE public.community_posts
      ADD CONSTRAINT community_posts_place_label_len CHECK (
        place_label IS NULL
        OR (char_length(trim(place_label)) >= 1 AND char_length(trim(place_label)) <= 140)
      );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'community_posts_story_tags_cardinality'
      AND n.nspname = 'public'
      AND t.relname = 'community_posts'
  ) THEN
    ALTER TABLE public.community_posts
      ADD CONSTRAINT community_posts_story_tags_cardinality CHECK (cardinality(story_tags) <= 5);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS community_posts_place_label_present_idx ON public.community_posts (lower(trim(place_label)))
WHERE place_label IS NOT NULL AND trim(place_label) <> '';

CREATE INDEX IF NOT EXISTS community_posts_story_tags_gin ON public.community_posts USING GIN (story_tags);

DROP POLICY IF EXISTS "Users can update images for own posts" ON public.post_images;

CREATE POLICY "Users can update images for own posts"
  ON public.post_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.community_posts cp
      WHERE cp.id = post_images.post_id
        AND cp.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_posts cp
      WHERE cp.id = post_images.post_id
        AND cp.author_id = auth.uid()
    )
  );
