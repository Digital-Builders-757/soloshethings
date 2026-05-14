-- ============================================================================
-- SoloSHEThings — Storage bucket + RLS policies (hosted Supabase)
-- ============================================================================
-- Run in: Supabase Dashboard → SQL Editor (per environment: dev / preview / prod)
--
-- When: After `supabase db push` succeeds (public schema + app tables exist).
-- Why: `supabase db push` uses a role that cannot ALTER `storage.objects` or
--      reliably manage some storage policies on hosted projects. Dashboard SQL
--      runs with privileges that can create bucket rows and policies.
--
-- Optional: Re-run safely — bucket uses ON CONFLICT; policies are dropped before create.
-- ============================================================================

-- Private bucket; access controlled by RLS (signed URLs where applicable)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Do not run ALTER TABLE storage.objects — RLS is already enabled on Supabase;
-- the migration/CLI role is not the table owner (see PGRST / 42501 if attempted via CLI).

DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view public post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

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
