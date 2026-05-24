--
-- Repair: add reports.reviewed_at and reports.reviewed_by
--
-- Root cause:
--   20260516203000_moderation_admin_rls_reports.sql introduced these two columns
--   but was not applied to the production database.
--   The query in lib/queries/reports.ts explicitly selects reviewed_at, causing
--   a Sentry runtime error: code 42703 "column reports.reviewed_at does not exist".
--
-- This migration is a targeted, idempotent repair.
-- It adds only the two missing columns and their associated indexes.
-- RPCs, enum extensions, and RLS policies from the original migration are
-- handled by 20260516203000 and must be applied separately if also missing.
--

ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_at  timestamptz;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_by  uuid REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS reports_review_pending_idx
  ON reports (created_at DESC)
  WHERE status = 'pending'::report_status;

CREATE INDEX IF NOT EXISTS reports_reviewed_by_idx
  ON reports (reviewed_by)
  WHERE reviewed_by IS NOT NULL;

COMMENT ON COLUMN reports.reviewed_at IS 'UTC timestamp when a moderator last updated status/notes.';
COMMENT ON COLUMN reports.reviewed_by IS 'Profile id (moderator) who last progressed this report.';
