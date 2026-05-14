-- Ledger for Stripe webhook idempotency (BILLING_STRIPE_CONTRACT.md).
CREATE TABLE stripe_webhook_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  processing boolean NOT NULL DEFAULT false,
  processed_at timestamptz,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  event_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX stripe_webhook_ledger_processed_idx ON stripe_webhook_ledger(processed, processing);
CREATE INDEX stripe_webhook_ledger_event_type_idx ON stripe_webhook_ledger(event_type);

ALTER TABLE stripe_webhook_ledger ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_stripe_webhook_ledger_updated_at
  BEFORE UPDATE ON stripe_webhook_ledger
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Tracks distinct community story reads per member per UTC day for free-tier limits (PUBLIC_PRIVATE_SURFACE_CONTRACT.md).
CREATE TABLE community_post_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  read_day date NOT NULL DEFAULT ((timezone('utc', now())))::date,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, community_post_id, read_day)
);

CREATE INDEX community_post_reads_user_day_idx ON community_post_reads(user_id, read_day);

ALTER TABLE community_post_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own story read counts"
  ON community_post_reads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Members can insert own story reads"
  ON community_post_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);
