-- Prompt 5: honest marketing/newsletter interest capture (no outbound automation implied)
-- Rows are appended or touched by server actions using the Supabase service role only.
-- See docs/contracts/EMAIL_NOTIFICATIONS_CONTRACT.md (marketing interest list).

CREATE TABLE public.marketing_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (length(trim(email)) >= 5 AND length(trim(email)) <= 254),
  source text NOT NULL DEFAULT 'homepage_newsletter' CHECK (length(source) BETWEEN 1 AND 120),
  email_normalized text GENERATED ALWAYS AS (lower(trim(email))) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_submitted_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marketing_interest_email_normalized_unique UNIQUE (email_normalized)
);

CREATE INDEX marketing_interest_last_submitted_idx
  ON public.marketing_interest (last_submitted_at DESC);

COMMENT ON TABLE public.marketing_interest IS 'Public-interest email addresses for SoloSheThings updates (manual / future ESP export; no outbound sends from app until configured).';
COMMENT ON COLUMN public.marketing_interest.email IS 'Address as typed by the subscriber (trimmed columns enforce bounds).';
COMMENT ON COLUMN public.marketing_interest.source IS 'Slug identifying which surface captured the submission (homepage, footer, ...).';

ALTER TABLE public.marketing_interest ENABLE ROW LEVEL SECURITY;

-- Default deny — reads/writes from anon/authenticated session context are unused; ops use service role.
CREATE POLICY "Admins select marketing interest rows"
  ON public.marketing_interest FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles pr
      WHERE pr.id = auth.uid()
        AND pr.role = 'admin'::public.user_role
    )
  );
