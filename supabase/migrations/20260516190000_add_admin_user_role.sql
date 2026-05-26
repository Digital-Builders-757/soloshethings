-- Add platform admin role enum value in its own migration.
-- Postgres forbids using a newly added enum label in the same transaction as ALTER TYPE ADD VALUE,
-- which breaks moderation policies/RPCs in 20260516203000 if 'admin' is added there.

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
