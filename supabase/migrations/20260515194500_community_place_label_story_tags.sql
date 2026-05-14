-- Optional place label + member-chosen topic tags for honest discovery filters and related-story ranking.
-- post_images lacked UPDATE policy; alt text + reorder updates require owner UPDATE.

ALTER TABLE community_posts
  ADD COLUMN IF NOT EXISTS place_label text;

ALTER TABLE community_posts
  ADD CONSTRAINT community_posts_place_label_len
  CHECK (
    place_label IS NULL
    OR (char_length(trim(place_label)) >= 1 AND char_length(trim(place_label)) <= 140)
  );

ALTER TABLE community_posts
  ADD COLUMN IF NOT EXISTS story_tags text[] NOT NULL DEFAULT '{}';

ALTER TABLE community_posts
  ADD CONSTRAINT community_posts_story_tags_cardinality CHECK (cardinality(story_tags) <= 5);

CREATE INDEX IF NOT EXISTS community_posts_place_label_present_idx ON community_posts (lower(trim(place_label)))
WHERE place_label IS NOT NULL AND trim(place_label) <> '';

CREATE INDEX IF NOT EXISTS community_posts_story_tags_gin ON community_posts USING GIN (story_tags);

CREATE POLICY "Users can update images for own posts"
  ON post_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND cp.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND cp.author_id = auth.uid()
    )
  );
