# Debug RLS Runbook

**Purpose:** Step-by-step debugging guide for Row Level Security (RLS) issues in SoloSheThings.

## Common Symptoms

1. **Query Returns Empty Results**
   - User can't see their own data
   - Public data not accessible
   - Queries return `[]` unexpectedly

2. **Permission Denied Errors**
   - `42501` error code (permission denied)
   - "new row violates row-level security policy"
   - "policy violation" errors

3. **Users Can Access Other Users' Data**
   - User sees data they shouldn't
   - Privacy settings ignored
   - RLS policies not enforced

4. **Insert/Update/Delete Fails**
   - Can't create new records
   - Can't update own records
   - Can't delete own records

5. **Admin Operations Fail**
   - Admin can't access all data
   - Service role queries fail
   - Moderation operations blocked

## Likely Causes

### 1. RLS Not Enabled

**Causes:**
- Table created without RLS
- Migration didn't enable RLS
- RLS disabled accidentally

**Check:**
```sql
-- Check if RLS is enabled on table
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'profiles';
```

**Fix:**
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 2. Missing RLS Policies

**Causes:**
- Policies not created
- Policies dropped accidentally
- Migration didn't include policies

**Check:**
```sql
-- List all policies on table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
ORDER BY policyname;
```

**Fix:**
```sql
-- Create missing policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 3. Incorrect auth.uid() Usage

**Causes:**
- Policy uses wrong column
- auth.uid() returns null
- User not authenticated

**Check:**
```sql
-- Test auth.uid() in policy context
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-id>';

-- Check what auth.uid() returns
SELECT auth.uid() as current_user_id;

-- Test policy condition
SELECT 
  id,
  username,
  auth.uid() = id as policy_match
FROM profiles
WHERE id = '<user-id>';
```

**Fix:**
```sql
-- Verify policy uses correct column
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id); -- id must match auth.users.id
```

### 4. Policy Condition Too Restrictive

**Causes:**
- Policy condition excludes valid access
- Multiple conditions with AND instead of OR
- Missing public access policy

**Check:**
```sql
-- Test policy conditions
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-id>';

-- Test SELECT policy
EXPLAIN ANALYZE
SELECT * FROM profiles WHERE id = '<user-id>';

-- Check if policy is applied
SELECT * FROM pg_policies 
WHERE tablename = 'profiles' 
  AND cmd = 'SELECT';
```

**Fix:**
```sql
-- Add public access policy if needed
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (privacy_level = 'public');
```

### 5. Service Role Bypass Not Working

**Causes:**
- Service role client not configured correctly
- Using anon key instead of service role
- RLS still enforced with service role

**Check:**
```typescript
// Verify service role client
import { createClient } from '@supabase/supabase-js';

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Must be service role key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Test query (should bypass RLS)
const { data, error } = await adminClient
  .from('profiles')
  .select('id, username, email')
  .limit(10);
```

**Fix:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Use service role client only for admin operations
- Never use service role in client code

## Step-by-Step Checks

### Check 1: Verify RLS is Enabled

```sql
-- Check RLS status for all tables
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** All tables show `rls_enabled = true`

**If False:**
- Enable RLS: `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
- Create migration to enable RLS

### Check 2: Verify Policies Exist

```sql
-- Count policies per table
SELECT 
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Expected:** Each table has policies for SELECT, INSERT, UPDATE, DELETE (as needed)

**If Missing:**
- Create missing policies
- Check migration files for policy creation

### Check 3: Test Policy as Authenticated User

```sql
-- Test as specific user
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-id>';

-- Test SELECT policy
SELECT * FROM profiles WHERE id = '<user-id>'; -- Should return 1 row

-- Test SELECT policy for other user's public profile
SELECT * FROM profiles 
WHERE id != '<user-id>' 
  AND privacy_level = 'public'
LIMIT 1; -- Should return public profiles

-- Test INSERT policy
INSERT INTO profiles (id, username, role)
VALUES ('<user-id>', 'testuser', 'talent')
ON CONFLICT (id) DO NOTHING; -- Should succeed

-- Test UPDATE policy
UPDATE profiles 
SET username = 'updated'
WHERE id = '<user-id>'; -- Should succeed

-- Test UPDATE policy for other user
UPDATE profiles 
SET username = 'hacked'
WHERE id != '<user-id>'; -- Should fail (0 rows updated)
```

**Expected:** User can access own data, public data, but not private data of others

**If Fails:**
- Check policy conditions
- Verify `auth.uid()` matches user ID
- Check policy permissions

### Check 4: Test Policy as Anonymous User

```sql
-- Test as anonymous user
SET ROLE anon;

-- Test SELECT (should fail for private data)
SELECT * FROM profiles WHERE privacy_level = 'private'; -- Should return 0 rows

-- Test SELECT (should succeed for public data)
SELECT * FROM profiles WHERE privacy_level = 'public' LIMIT 1; -- Should return public profiles

-- Test INSERT (should fail)
INSERT INTO profiles (id, username, role)
VALUES (gen_random_uuid(), 'test', 'talent'); -- Should fail
```

**Expected:** Anonymous users can only read public data, cannot write

**If Fails:**
- Check public read policies
- Verify anonymous access is restricted

### Check 5: Verify Policy Logic

```sql
-- Check policy expressions
SELECT 
  tablename,
  policyname,
  cmd as command,
  qual as using_clause,
  with_check as with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';
```

**Expected:** Policies have correct USING and WITH CHECK clauses

**If Incorrect:**
- Review policy logic
- Test policy conditions manually
- Update policies if needed

## SQL Snippets

### Find Tables Without RLS

```sql
-- Tables without RLS enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;
```

### Find Tables Without Policies

```sql
-- Tables with RLS but no policies
SELECT 
  t.tablename,
  COUNT(p.policyname) as policy_count
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = 'public'
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
GROUP BY t.tablename
HAVING COUNT(p.policyname) = 0
ORDER BY t.tablename;
```

### Test RLS Policy for Specific User

```sql
-- Test policy as specific user
DO $$
DECLARE
  test_user_id uuid := '<user-id>';
  result_count integer;
BEGIN
  -- Set user context
  PERFORM set_config('request.jwt.claim.sub', test_user_id::text, true);
  
  -- Test SELECT
  SELECT COUNT(*) INTO result_count
  FROM profiles
  WHERE id = test_user_id;
  
  RAISE NOTICE 'User can see % rows of own profile', result_count;
  
  -- Test SELECT for other users
  SELECT COUNT(*) INTO result_count
  FROM profiles
  WHERE id != test_user_id AND privacy_level = 'public';
  
  RAISE NOTICE 'User can see % public profiles of others', result_count;
END $$;
```

### Check Policy Coverage

```sql
-- Check which operations have policies
SELECT 
  tablename,
  cmd as operation,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename, cmd
ORDER BY tablename, cmd;
```

### Find Overly Permissive Policies

```sql
-- Policies that might be too permissive
SELECT 
  tablename,
  policyname,
  cmd,
  qual as condition
FROM pg_policies
WHERE schemaname = 'public'
  AND (
    qual IS NULL -- No condition (allows all)
    OR qual LIKE '%true%' -- Always true condition
  )
ORDER BY tablename;
```

## Proof It's Fixed

### Test 1: User Can Access Own Data

**Steps:**
1. Log in as user
2. Query own profile
3. Verify data returned

**SQL Verification:**
```sql
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-id>';

SELECT id, username, role FROM profiles WHERE id = '<user-id>';
```

**Expected:** Returns 1 row with user's own data

### Test 2: User Cannot Access Other Users' Private Data

**Steps:**
1. Log in as user A
2. Query user B's private profile
3. Verify no data returned

**SQL Verification:**
```sql
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-a-id>';

SELECT id, username FROM profiles 
WHERE id = '<user-b-id>' 
  AND privacy_level = 'private';
```

**Expected:** Returns 0 rows (RLS blocks access)

### Test 3: User Can Access Public Data

**Steps:**
1. Log in as user
2. Query public profiles
3. Verify public profiles returned

**SQL Verification:**
```sql
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-id>';

SELECT id, username FROM profiles WHERE privacy_level = 'public';
```

**Expected:** Returns all public profiles

### Test 4: User Can Create Own Records

**Steps:**
1. Log in as user
2. Create new post
3. Verify post created

**SQL Verification:**
```sql
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-id>';

INSERT INTO community_posts (author_id, title, content, status)
VALUES ('<user-id>', 'Test Post', 'Content', 'published')
RETURNING id, title;
```

**Expected:** Insert succeeds, returns new post

### Test 5: User Cannot Modify Other Users' Data

**Steps:**
1. Log in as user A
2. Attempt to update user B's post
3. Verify update fails

**SQL Verification:**
```sql
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-a-id>';

UPDATE community_posts
SET title = 'Hacked'
WHERE author_id = '<user-b-id>';
```

**Expected:** 0 rows updated (RLS blocks update)

### Test 6: Anonymous User Access

**Steps:**
1. Access without authentication
2. Query public data
3. Verify public data accessible
4. Attempt to query private data
5. Verify private data blocked

**SQL Verification:**
```sql
SET ROLE anon;

-- Should succeed (public data)
SELECT COUNT(*) FROM profiles WHERE privacy_level = 'public';

-- Should return 0 (private data blocked)
SELECT COUNT(*) FROM profiles WHERE privacy_level = 'private';
```

**Expected:** Public data accessible, private data blocked

## Common Fixes

### Fix 1: Enable RLS on Table

```sql
-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own rows"
  ON your_table FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rows"
  ON your_table FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rows"
  ON your_table FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rows"
  ON your_table FOR DELETE
  USING (auth.uid() = user_id);
```

### Fix 2: Fix Incorrect Policy Condition

```sql
-- Drop incorrect policy
DROP POLICY IF EXISTS "incorrect_policy_name" ON your_table;

-- Create correct policy
CREATE POLICY "Users can view own rows"
  ON your_table FOR SELECT
  USING (auth.uid() = user_id); -- Correct column reference
```

### Fix 3: Add Missing Public Access Policy

```sql
-- Add public read policy
CREATE POLICY "Users can view public rows"
  ON your_table FOR SELECT
  USING (is_public = true AND status = 'published');
```

### Fix 4: Fix Policy for Related Tables

```sql
-- Policy that checks related table
CREATE POLICY "Users can view images for accessible posts"
  ON post_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND (
        (cp.is_public = true AND cp.status = 'published')
        OR cp.author_id = auth.uid()
      )
    )
  );
```

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [database_schema_audit.md](./../database_schema_audit.md)
- [DATA_ACCESS_QUERY_CONTRACT.md](./../contracts/DATA_ACCESS_QUERY_CONTRACT.md)

