--
-- Member profile visibility for /members/[username]
--
-- 1) RLS: authenticated users can SELECT limited profiles (public policy unchanged).
-- 2) RPC: resolve_member_profile(text) returns gate states without leaking private
--    profiles to anonymous viewers.
--
-- Resolver outcomes:
--   Anonymous:  public -> visible | limited -> auth_required | private -> not_found
--   Authenticated: public/limited -> visible | private (other) -> private | owner/admin -> visible
--

-- 1) RLS — limited profiles readable by authenticated session only
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Authenticated users can view limited profiles'
  ) THEN
    CREATE POLICY "Authenticated users can view limited profiles"
      ON public.profiles FOR SELECT
      TO authenticated
      USING (privacy_level = 'limited');
  END IF;
END $$;

-- 2) SECURITY DEFINER resolver — status-first JSON for public member route
CREATE OR REPLACE FUNCTION public.resolve_member_profile(p_username text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
  v_viewer_id uuid;
  v_is_admin boolean := false;
  v_profile public.profiles%ROWTYPE;
BEGIN
  v_username := lower(trim(p_username));

  IF v_username IS NULL OR v_username = '' OR v_username !~ '^[a-z0-9_]+$' THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;

  v_viewer_id := auth.uid();

  SELECT *
  INTO v_profile
  FROM public.profiles
  WHERE username = v_username;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'not_found');
  END IF;

  IF v_viewer_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.profiles pr
      WHERE pr.id = v_viewer_id
        AND pr.role = 'admin'::public.user_role
    )
    INTO v_is_admin;
  END IF;

  -- Owner or admin: always visible with full public field set
  IF v_viewer_id = v_profile.id OR v_is_admin THEN
    RETURN jsonb_build_object(
      'status', 'visible',
      'profile', jsonb_build_object(
        'username', v_profile.username,
        'full_name', v_profile.full_name,
        'bio', v_profile.bio,
        'avatar_url', v_profile.avatar_url,
        'travel_styles', to_jsonb(v_profile.travel_styles),
        'privacy_level', v_profile.privacy_level
      )
    );
  END IF;

  IF v_profile.privacy_level = 'public'::public.privacy_level THEN
    RETURN jsonb_build_object(
      'status', 'visible',
      'profile', jsonb_build_object(
        'username', v_profile.username,
        'full_name', v_profile.full_name,
        'bio', v_profile.bio,
        'avatar_url', v_profile.avatar_url,
        'travel_styles', to_jsonb(v_profile.travel_styles),
        'privacy_level', v_profile.privacy_level
      )
    );
  END IF;

  IF v_profile.privacy_level = 'limited'::public.privacy_level THEN
    IF v_viewer_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'status', 'visible',
        'profile', jsonb_build_object(
          'username', v_profile.username,
          'full_name', v_profile.full_name,
          'bio', v_profile.bio,
          'avatar_url', v_profile.avatar_url,
          'travel_styles', to_jsonb(v_profile.travel_styles),
          'privacy_level', v_profile.privacy_level
        )
      );
    END IF;

    RETURN jsonb_build_object(
      'status', 'auth_required',
      'username', v_profile.username
    );
  END IF;

  -- private: authenticated non-owner sees private gate; anonymous sees not_found
  IF v_profile.privacy_level = 'private'::public.privacy_level THEN
    IF v_viewer_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'status', 'private',
        'username', v_profile.username
      );
    END IF;

    RETURN jsonb_build_object('status', 'not_found');
  END IF;

  RETURN jsonb_build_object('status', 'not_found');
END;
$$;

REVOKE ALL ON FUNCTION public.resolve_member_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_member_profile(text) TO anon;
GRANT EXECUTE ON FUNCTION public.resolve_member_profile(text) TO authenticated;

COMMENT ON FUNCTION public.resolve_member_profile IS
  'Resolves /members/[username] visibility. Returns status: visible | auth_required | private | not_found. Anonymous private profiles return not_found to prevent username enumeration.';
