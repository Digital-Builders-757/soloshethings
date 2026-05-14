--
-- Prompt 4: moderation RLS + platform admin role + report audit columns
-- Adds profiles.role enum value 'admin', report_status 'withdrawn', audited review fields,
-- RPCs for safe reporter withdraw + moderated status updates, and admin read policies where needed for the queue.
--

-- 1) Role + report-status enum extensions (idempotent guard for Postgres/Supabase)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'admin'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'admin';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'report_status' AND e.enumlabel = 'withdrawn'
  ) THEN
    ALTER TYPE report_status ADD VALUE 'withdrawn';
  END IF;
END $$;

-- 2) Report audit traceability (who/when moderation last progressed the row)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS reports_review_pending_idx ON reports (created_at DESC) WHERE status = 'pending'::report_status;
CREATE INDEX IF NOT EXISTS reports_reviewed_by_idx ON reports (reviewed_by) WHERE reviewed_by IS NOT NULL;

COMMENT ON COLUMN reports.reviewed_at IS 'UTC timestamp when a moderator last updated status/notes.';
COMMENT ON COLUMN reports.reviewed_by IS 'Profile id (moderator) who last progressed this report.';
COMMENT ON COLUMN reports.admin_notes IS 'Member-visible moderation summary shown to the reporter on /reports when present.';

-- 3) Reporters withdraw only via SECURITY DEFINER RPC (immutable column guarantee)
CREATE OR REPLACE FUNCTION public.withdraw_post_report(p_report_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int := 0;
BEGIN
  UPDATE reports
  SET
    status = 'withdrawn'::report_status,
    updated_at = now()
  WHERE id = p_report_id
    AND reporter_id = auth.uid()
    AND status = 'pending'::report_status;

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n = 0 THEN
    RAISE EXCEPTION 'withdraw_not_allowed' USING ERRCODE = '42501';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.withdraw_post_report(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.withdraw_post_report(uuid) TO authenticated;

COMMENT ON FUNCTION public.withdraw_post_report IS 'Lets a reporter close a pending community post report without affecting other rows.';

-- 4) Moderators update queue rows (auth.uid must be profiles.role = admin)
CREATE OR REPLACE FUNCTION public.moderator_update_report(
  p_report_id uuid,
  p_status report_status,
  p_admin_notes text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'::user_role
  ) THEN
    RAISE EXCEPTION 'moderation_forbidden' USING ERRCODE = '42501';
  END IF;

  IF p_status = 'withdrawn'::report_status THEN
    RAISE EXCEPTION 'moderators_must_not_set_withdrawn' USING ERRCODE = '23514';
  END IF;

  IF p_admin_notes IS NOT NULL AND char_length(trim(p_admin_notes)) > 2000 THEN
    RAISE EXCEPTION 'admin_notes_too_long' USING ERRCODE = '23514';
  END IF;

  UPDATE reports
  SET
    status = p_status,
    admin_notes = CASE WHEN p_admin_notes IS NULL THEN admin_notes ELSE nullif(trim(p_admin_notes), '') END,
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    updated_at = now()
  WHERE id = p_report_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'report_not_found' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.moderator_update_report(uuid, report_status, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.moderator_update_report(uuid, report_status, text) TO authenticated;

COMMENT ON FUNCTION public.moderator_update_report IS 'Allows platform admins (profiles.role admin) to set report status + member-visible moderation note.';

-- 5) RLS — admins can read report queue across reporters (writes go through moderator_update_report RPC)
CREATE POLICY "Admins select all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.role = 'admin'::user_role)
  );

-- 6) RLS — moderation needs contextual reads across private/reported posts
CREATE POLICY "Admins select all community_posts"
  ON community_posts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.role = 'admin'::user_role)
  );

CREATE POLICY "Admins select all post_images"
  ON post_images FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.role = 'admin'::user_role)
  );

CREATE POLICY "Admins select profiles for moderation"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles pr WHERE pr.id = auth.uid() AND pr.role = 'admin'::user_role)
  );
