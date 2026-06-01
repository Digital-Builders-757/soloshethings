--
-- Repair: add profiles.travel_styles column and cardinality constraint
--
-- Root cause:
--   20260601000000_profiles_travel_styles.sql introduced the travel_styles column
--   but was recorded in supabase_migrations.schema_migrations without the DDL
--   being executed against the production database (same schema drift mechanism
--   as the reports.reviewed_at incident fixed by 20260524000000).
--   ERROR 42703 "column travel_styles does not exist" surfaces at login because
--   lib/queries/profiles.ts explicitly selects travel_styles in profileSelect.
--
-- What this migration adds:
--   - profiles.travel_styles text[] NOT NULL DEFAULT '{}'
--   - CHECK constraint capping cardinality at 8 (guarded against duplicate)
--
-- What is intentionally omitted vs the original migration:
--   - GIN index on travel_styles — no query in the current codebase uses array
--     containment (@>) or overlap (&&) operators on this column; the index has
--     no current read benefit and adds write overhead. It can be added in a
--     separate migration when a travel-style discovery query is built.
--
-- This migration is idempotent. Every statement is safe to re-run.
--

-- 1. Column — IF NOT EXISTS guards against re-run
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS travel_styles text[] NOT NULL DEFAULT '{}';

-- 2. Cardinality constraint — ALTER TABLE ADD CONSTRAINT has no IF NOT EXISTS
--    in PostgreSQL; guarded via pg_constraint lookup.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname   = 'profiles_travel_styles_cardinality'
      AND conrelid  = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_travel_styles_cardinality
      CHECK (cardinality(travel_styles) <= 8);
  END IF;
END $$;
