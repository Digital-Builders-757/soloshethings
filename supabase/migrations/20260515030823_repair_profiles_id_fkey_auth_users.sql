-- Repair schema drift: ensure public.profiles.id references auth.users(id), not public.users or other tables.
-- Safe to re-run: no-op when the FK already targets auth.users.

DO $$
DECLARE
  con_confrelid oid;
  target_oid CONSTANT oid := 'auth.users'::regclass::oid;
BEGIN
  SELECT c.confrelid
  INTO con_confrelid
  FROM pg_constraint c
  INNER JOIN pg_class rel ON rel.oid = c.conrelid
  INNER JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
  WHERE nsp.nspname = 'public'
    AND rel.relname = 'profiles'
    AND c.contype = 'f'
    AND c.conname = 'profiles_id_fkey';

  IF con_confrelid IS NULL THEN
    RAISE NOTICE 'profiles_id_fkey not found; skipping.';
    RETURN;
  END IF;

  IF con_confrelid = target_oid THEN
    RAISE NOTICE 'profiles_id_fkey already references auth.users; skipping.';
    RETURN;
  END IF;

  ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;

  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;
END
$$;

COMMENT ON CONSTRAINT profiles_id_fkey ON public.profiles IS
  'Profiles row id must match auth.users.id (Supabase Auth).';
