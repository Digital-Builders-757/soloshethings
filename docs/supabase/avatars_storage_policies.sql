-- ============================================================================
-- SoloSHEThings — avatars bucket + visibility-aware storage RLS (hosted Supabase)
-- ============================================================================
-- Run in: Supabase Dashboard → SQL Editor (per environment: dev / preview / prod)
--
-- When: After `supabase db push` and profiles table exists with `privacy_level`.
-- Why: CLI migration role cannot reliably manage `storage.objects` policies on
--      hosted projects. Dashboard SQL runs with privileges to create policies.
--
-- Privacy model (matches resolve_member_profile for portrait bytes):
--   public  → avatar readable by anyone (including anonymous signed URLs)
--   limited → avatar readable by authenticated users only
--   private → avatar readable by owner only (folder match; no admin bypass)
--
-- Re-run safely: bucket uses ON CONFLICT; policies are dropped before create.
-- Does NOT alter upload/delete behavior.
-- ============================================================================

-- Private bucket; access via RLS + signed URLs (never public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Do not run ALTER TABLE storage.objects — RLS is already enabled on Supabase.

DROP POLICY IF EXISTS "Users can upload own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view avatars for visible profiles" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;

-- Users can upload to own folder only
CREATE POLICY "Users can upload own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Owner can always read own avatars (includes private profiles)
CREATE POLICY "Users can view own avatars"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Cross-user read when profiles.avatar_url matches and privacy allows portrait
CREATE POLICY "Users can view avatars for visible profiles"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars' AND
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.avatar_url = storage.objects.name
      AND (
        p.privacy_level = 'public'::public.privacy_level
        OR (
          p.privacy_level = 'limited'::public.privacy_level
          AND auth.uid() IS NOT NULL
        )
      )
    )
  );

-- Users can delete own avatars only
CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
