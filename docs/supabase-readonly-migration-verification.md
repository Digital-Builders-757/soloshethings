# Read-only production checks (repair migrations)

Run these against **production** only in **read-only** contexts (e.g. Supabase Studio SQL editor with a read replica, or explicit `BEGIN READ ONLY` transaction if supported). Use the results before **removing** idempotent repair migrations such as:

- [`20260519120000_repair_community_posts_place_label_story_tags.sql`](../supabase/migrations/20260519120000_repair_community_posts_place_label_story_tags.sql)
- [`20260524000000_repair_reports_reviewed_columns.sql`](../supabase/migrations/20260524000000_repair_reports_reviewed_columns.sql)

If remote migration history says an earlier migration was applied but reality diverges (columns or indexes missing), **keep** these repairs unless you ship a deliberate umbrella reconciliation migration.

## `community_posts` / `post_images` (repair `20260519120000`)

Confirm columns:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'community_posts'
  AND column_name IN ('place_label', 'story_tags');
```

Confirm constraints:

```sql
SELECT conname
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
  AND t.relname = 'community_posts'
  AND conname IN (
    'community_posts_place_label_len',
    'community_posts_story_tags_cardinality'
  );
```

Confirm indexes:

```sql
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'community_posts'
  AND indexname IN (
    'community_posts_place_label_present_idx',
    'community_posts_story_tags_gin'
  );
```

Confirm `post_images` owner update policy (name + presence):

```sql
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'post_images'
  AND policyname = 'Users can update images for own posts';
```

## `reports` reviewed columns (repair `20260524000000` vs [`20260516203000_moderation_admin_rls_reports.sql`](../supabase/migrations/20260516203000_moderation_admin_rls_reports.sql))

Columns and FK behavior:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reports'
  AND column_name IN ('reviewed_at', 'reviewed_by');
```

Indexes:

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'reports'
  AND indexname IN ('reports_review_pending_idx', 'reports_reviewed_by_idx');
```

Comments:

```sql
SELECT attname,
       pg_catalog.col_description(attrelid, attnum) AS col_comment
FROM pg_catalog.pg_attribute
WHERE attrelid = 'public.reports'::regclass
  AND attname IN ('reviewed_at', 'reviewed_by')
  AND NOT attisdropped;
```
