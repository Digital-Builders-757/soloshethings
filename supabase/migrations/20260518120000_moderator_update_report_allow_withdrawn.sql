-- Allow admins to set report status to `withdrawn` via moderator_update_report.
-- Previously blocked so only reporters could withdraw via withdraw_post_report; the admin
-- queue still needs to record operator-initiated withdrawn closure without fake client payloads.
-- Reporter RPC remains the path for self-service withdraw from pending only.

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

COMMENT ON FUNCTION public.moderator_update_report IS 'Allows platform admins (profiles.role admin) to set report status + member-visible moderation note, including withdrawn.';
