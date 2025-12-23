# Migration Procedure

**Purpose:** Step-by-step database migration workflow for Supabase schema changes in SoloSheThings. Follow these steps in order.

## Non-Negotiables

1. **Never Edit Existing Migrations** - Always create new migration files. Never modify existing ones.
2. **Update Documentation First** - Update `database_schema_audit.md` BEFORE writing migration SQL.
3. **Test Locally First** - All migrations must be tested locally before production.
4. **RLS Policies Required** - All new tables must have RLS enabled with policies.
5. **Regenerate Types** - Always regenerate TypeScript types after schema changes.

## Migration Workflow (Step-by-Step)

### Step 1: Update database_schema_audit.md First

**MUST:** Update `docs/database_schema_audit.md` BEFORE writing migration SQL.

**Why:** This document is the source of truth. Updating it first ensures you've thought through the schema change completely.

**What to Update:**
- Add new tables with complete schema (columns, types, constraints, defaults)
- Add new enums with all values
- Add new indexes
- Add new RLS policies (with policy names and conditions)
- Update schema version number
- Update "Last Updated" date

**Example:**
```markdown
## Schema Version: v1

**Last Updated:** 2025-01-27  
**Migration Base:** v0  
**Status:** Ready for implementation

### New Table: events

```sql
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  -- ... rest of schema
);
```
```

### Step 2: Write Migration SQL

**Create Migration File:**
```bash
supabase migration new <short_description>
```

**Naming Convention:**
- Format: `YYYYMMDDHHMMSS_<description>.sql`
- Use snake_case for description
- Be descriptive: `add_events_table`, `add_bio_to_profiles`, `add_index_to_posts_author`
- Examples:
  - ✅ `20250127120000_add_events_table.sql`
  - ✅ `20250127130000_add_bio_to_profiles.sql`
  - ✅ `20250127140000_add_index_posts_author_status.sql`
  - ❌ `20250127120000_update.sql` (too vague)
  - ❌ `20250127120000_fix.sql` (not descriptive)

**Write Migration SQL:**
```sql
-- Migration: Add events table
-- Date: 2025-01-27
-- Description: Create events table for future events feature with RLS policies

-- 1. Create table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) <= 200),
  description text CHECK (char_length(description) <= 2000),
  event_date timestamptz NOT NULL,
  location text,
  max_attendees integer CHECK (max_attendees > 0),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status event_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX events_created_by_idx ON events(created_by);
CREATE INDEX events_status_idx ON events(status);
CREATE INDEX events_event_date_idx ON events(event_date DESC);

-- 3. Enable RLS (MANDATORY)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies (MANDATORY)
CREATE POLICY "Users can view published events"
  ON events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = created_by);

-- 5. Create trigger for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

**Migration Structure (Always Follow):**
1. Create tables/enums/functions
2. Create indexes
3. Enable RLS
4. Create RLS policies
5. Create triggers
6. Data migrations (if needed)

### Step 3: Apply to Local/Dev

**Reset Local Database:**
```bash
# Reset and apply all migrations from scratch
supabase db reset
```

**Or Apply Specific Migration:**
```bash
# Apply pending migrations
supabase migration up
```

**Verify Migration:**
- ✅ Migration applies without errors
- ✅ Tables created correctly
- ✅ Indexes created
- ✅ RLS enabled
- ✅ Policies created
- ✅ Test queries work

**Test RLS Policies:**
```sql
-- Test as authenticated user
SET ROLE authenticated;
SET request.jwt.claim.sub = 'test-user-id';

-- Should only return user's own events
SELECT * FROM events WHERE created_by = 'test-user-id';

-- Should return published events
SELECT * FROM events WHERE status = 'published';
```

### Step 4: Regenerate Types

**MUST:** Regenerate TypeScript types after schema changes.

**Command:**
```bash
# Generate types from local database
supabase gen types typescript --local > types/database.ts
```

**Verify:**
- ✅ Types file updated
- ✅ New tables/types included
- ✅ No TypeScript errors in codebase

**If Types Don't Match:**
- Check migration applied correctly: `supabase db diff`
- Verify schema matches `database_schema_audit.md`
- Regenerate types again

### Step 5: Schema Verify

**Verify Schema Matches Documentation:**
```bash
# Check for unexpected schema changes
supabase db diff --schema public
```

**Expected Output:**
- No output = schema matches (good)
- Output = unexpected changes detected (investigate)

**If Diff Shows Changes:**
- Verify changes are intentional
- Update `database_schema_audit.md` if needed
- Create new migration if changes are missing

**Verify Migration Applied:**
```bash
# List applied migrations
supabase migration list

# Check migration status
supabase db diff
```

### Step 6: Update DATABASE_REPORT.md (If Needed)

**When to Update:**
- New table added → Add to "Product Mapping" section
- RLS design changed → Update "RLS Design" section
- Access patterns changed → Update "Access Patterns Per Role" section
- Index strategy changed → Update "Index Strategy" section
- Storage strategy changed → Update "Storage Strategy" section

**What to Update:**
```markdown
## Migration History

### 2025-01-27: Add events table
- **Migration:** `20250127120000_add_events_table.sql`
- **Changes:** Created events table for future events feature
- **RLS:** Public read for published events, private write for creators
- **Indexes:** Added indexes on created_by, status, event_date
- **Impact:** Enables events feature (Phase 2)
```

## Rollback Guidance

### When to Rollback

**Rollback if:**
- Migration fails in production
- Migration causes data loss
- Migration breaks application functionality
- Migration introduces security issues

**DO NOT Rollback if:**
- Migration succeeded but application has bugs (fix in code)
- Migration succeeded but needs refinement (create new migration)

### Rollback Procedure

#### Option 1: Create Reverse Migration (Recommended)

**Create new migration to reverse changes:**
```bash
supabase migration new rollback_add_events_table
```

**Write reverse migration:**
```sql
-- Rollback: Remove events table
-- Date: 2025-01-27
-- Description: Rollback events table creation

-- Drop triggers first
DROP TRIGGER IF EXISTS update_events_updated_at ON events;

-- Drop policies
DROP POLICY IF EXISTS "Users can view published events" ON events;
DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Users can create own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;
DROP POLICY IF EXISTS "Users can delete own events" ON events;

-- Drop indexes
DROP INDEX IF EXISTS events_created_by_idx;
DROP INDEX IF EXISTS events_status_idx;
DROP INDEX IF EXISTS events_event_date_idx;

-- Drop table (cascades to foreign keys)
DROP TABLE IF EXISTS events;
```

**Apply rollback:**
```bash
# Test locally first
supabase db reset

# Apply to production (if needed)
supabase db push
```

#### Option 2: Manual SQL Rollback (Emergency Only)

**Only use if reverse migration isn't possible:**

```sql
-- Connect to production database (via Supabase dashboard SQL editor)
-- Execute rollback SQL manually

-- WARNING: This bypasses migration tracking
-- Only use in emergencies
DROP TABLE IF EXISTS events CASCADE;
```

**After manual rollback:**
- Document what was rolled back
- Create migration file to record rollback
- Update `database_schema_audit.md`
- Regenerate types

### Rollback Checklist

Before rolling back:
- [ ] Identify what needs to be rolled back
- [ ] Check for dependent tables/data
- [ ] Backup database (if in production)
- [ ] Create reverse migration file
- [ ] Test rollback locally
- [ ] Document rollback reason

After rolling back:
- [ ] Verify rollback succeeded
- [ ] Test application functionality
- [ ] Update documentation
- [ ] Regenerate types
- [ ] Notify team

## Naming Conventions

### Migration File Names

**Format:** `YYYYMMDDHHMMSS_<description>.sql`

**Rules:**
- Use UTC timestamp (generated automatically by Supabase CLI)
- Description in snake_case
- Be descriptive but concise
- Use action verb: `add_`, `remove_`, `update_`, `create_`, `drop_`

**Good Examples:**
- ✅ `20250127120000_add_events_table.sql`
- ✅ `20250127130000_add_bio_column_to_profiles.sql`
- ✅ `20250127140000_add_index_posts_author_status.sql`
- ✅ `20250127150000_update_subscriptions_add_trial_end.sql`
- ✅ `20250127160000_create_stripe_webhook_ledger_table.sql`

**Bad Examples:**
- ❌ `20250127120000_update.sql` (too vague)
- ❌ `20250127120000_fix.sql` (not descriptive)
- ❌ `20250127120000_changes.sql` (doesn't describe what)
- ❌ `20250127120000_add-table.sql` (use snake_case, not kebab-case)

### Migration Comments

**Always include header comments:**
```sql
-- Migration: <description>
-- Date: YYYY-MM-DD
-- Description: <detailed description of what and why>
```

**Example:**
```sql
-- Migration: Add events table
-- Date: 2025-01-27
-- Description: Create events table for future events feature. Includes RLS policies for public read (published events) and private write (creators only). Enables Phase 2 events feature.
```

## Common Migration Patterns

### Add Table

```sql
-- Create table
CREATE TABLE new_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns
);

-- Create indexes
CREATE INDEX new_table_user_id_idx ON new_table(user_id);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own rows" ON new_table FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own rows" ON new_table FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rows" ON new_table FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rows" ON new_table FOR DELETE USING (auth.uid() = user_id);
```

### Add Column

```sql
-- Add nullable column
ALTER TABLE profiles ADD COLUMN bio text;

-- Add column with default (for existing rows)
ALTER TABLE profiles ADD COLUMN bio text NOT NULL DEFAULT '';

-- Add column with constraint
ALTER TABLE profiles ADD COLUMN bio text CHECK (char_length(bio) <= 500);
```

### Add Index

```sql
-- Single column index
CREATE INDEX posts_author_id_idx ON community_posts(author_id);

-- Composite index
CREATE INDEX posts_author_status_idx ON community_posts(author_id, status);

-- Partial index
CREATE INDEX posts_published_idx ON community_posts(created_at DESC) WHERE status = 'published';
```

### Modify Column

```sql
-- Change column type (be careful with existing data)
ALTER TABLE profiles ALTER COLUMN username TYPE varchar(50);

-- Add constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_username_length CHECK (char_length(username) >= 3);
```

### Add Foreign Key

```sql
-- Add foreign key constraint
ALTER TABLE post_images
ADD CONSTRAINT fk_post_images_post_id
FOREIGN KEY (post_id)
REFERENCES community_posts(id)
ON DELETE CASCADE;
```

### Data Migration

```sql
-- Data migration with transaction
BEGIN;

-- Update existing data
UPDATE profiles
SET role = 'talent'
WHERE role IS NULL;

-- Verify changes
DO $$
DECLARE
  null_count integer;
BEGIN
  SELECT COUNT(*) INTO null_count FROM profiles WHERE role IS NULL;
  IF null_count > 0 THEN
    RAISE EXCEPTION 'Migration failed: % rows still have NULL role', null_count;
  END IF;
END $$;

COMMIT;
```

## Migration Checklist

### Before Creating Migration

- [ ] Schema change is necessary
- [ ] `database_schema_audit.md` updated first
- [ ] RLS policies designed
- [ ] Indexes planned
- [ ] Foreign keys identified
- [ ] Data migration plan (if needed)

### Before Applying Migration

- [ ] Migration SQL written and reviewed
- [ ] Migration tested locally (`supabase db reset`)
- [ ] RLS policies tested with different users
- [ ] Types regenerated (`supabase gen types typescript --local`)
- [ ] Schema verified (`supabase db diff`)
- [ ] `DATABASE_REPORT.md` updated (if needed)
- [ ] Backup created (production only)

### After Applying Migration

- [ ] Migration applied successfully
- [ ] Application tested
- [ ] RLS policies verified
- [ ] Performance checked (indexes working)
- [ ] Types regenerated and verified
- [ ] Documentation updated
- [ ] Team notified (if breaking change)

## Troubleshooting

### Migration Fails to Apply

**Check:**
1. SQL syntax errors
2. Dependencies (tables/functions that don't exist)
3. Constraint violations
4. RLS policy conflicts

**Fix:**
1. Review error message
2. Fix SQL in migration file
3. Test locally again
4. If migration already applied, create new migration to fix

### Types Don't Match Schema

**Check:**
1. Migration applied correctly
2. Schema matches `database_schema_audit.md`
3. Types regenerated from correct database

**Fix:**
1. Verify migration: `supabase db diff`
2. Regenerate types: `supabase gen types typescript --local`
3. Update `database_schema_audit.md` if schema differs

### RLS Policies Not Working

**Check:**
1. RLS enabled on table
2. Policies created correctly
3. `auth.uid()` usage correct
4. User authenticated

**Fix:**
1. Test policies with different users
2. Check policy conditions
3. Verify `auth.uid()` matches user ID
4. Create new migration to fix policies

### Migration Conflicts

**If migrations conflict:**
1. Pull latest migrations from main branch
2. Resolve conflicts in SQL (merge changes)
3. Test locally
4. Create new migration if needed to reconcile

## Quick Reference

### Common Commands

```bash
# Create migration
supabase migration new <description>

# Apply migrations locally
supabase db reset

# Check schema diff
supabase db diff --schema public

# Regenerate types
supabase gen types typescript --local > types/database.ts

# List migrations
supabase migration list

# Apply to remote (dev/staging)
supabase link --project-ref <project-ref>
supabase db push

# Backup database
supabase db dump -f backup_$(date +%Y%m%d).sql
```

### Migration Workflow Summary

1. ✅ Update `database_schema_audit.md` first
2. ✅ Create migration: `supabase migration new <description>`
3. ✅ Write migration SQL (with RLS policies)
4. ✅ Apply locally: `supabase db reset`
5. ✅ Regenerate types: `supabase gen types typescript --local`
6. ✅ Verify schema: `supabase db diff`
7. ✅ Update `DATABASE_REPORT.md` (if needed)
8. ✅ Test application
9. ✅ Apply to production (with backup)

---

**Related Documents:**
- [database_schema_audit.md](./../database_schema_audit.md)
- [DATABASE_REPORT.md](./../DATABASE_REPORT.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [PRE_PUSH_CHECKLIST.md](./PRE_PUSH_CHECKLIST.md)
