# Pre-Push Checklist

**Purpose:** Fast, mandatory checks before pushing code to SoloSheThings repository. Execute in order, stop on first failure.

## Quick Execution (Copy-Paste)

```bash
# Run all mandatory checks (stop on first failure)
npm run type-check && \
npm run lint && \
npm run build && \
supabase db diff --schema public && \
echo "✅ All checks passed"
```

## Mandatory Commands

### 1. Type Check

**Command:**
```bash
npm run type-check
```

**Must Pass:**
- ✅ No TypeScript errors
- ✅ No type warnings (fix or document exceptions)

**If Fails:**
- Fix type errors
- Add type assertions only if necessary (document why)

### 2. Lint

**Command:**
```bash
npm run lint
```

**Must Pass:**
- ✅ No linting errors
- ✅ No critical warnings

**If Fails:**
- Fix linting errors
- Use `eslint-disable` only with justification

### 3. Build

**Command:**
```bash
npm run build
```

**Must Pass:**
- ✅ Build completes without errors
- ✅ No runtime errors in build output

**If Fails:**
- Fix build errors
- Check for missing dependencies
- Verify environment variables are set

### 4. Schema Verify

**Command:**
```bash
supabase db diff --schema public
```

**Must Pass:**
- ✅ No unexpected schema changes
- ✅ Migration files exist for all schema changes

**If Fails:**
- Create migration file: `supabase migration new <description>`
- Update `docs/database_schema_audit.md`
- Test migration locally: `supabase db reset`

## Known Traps

### 1. Environment Variable Mismatch

**Symptom:**
- Build works locally but fails in CI/production
- API calls fail with authentication errors
- Database connection errors

**Check:**
```bash
# Verify required env vars are documented
grep -r "process.env\." --include="*.ts" --include="*.tsx" | grep -v "NEXT_PUBLIC" | sort -u

# Check .env.example exists and is up to date
cat .env.example
```

**Prevention:**
- Document all env vars in `.env.example`
- Use `NEXT_PUBLIC_` prefix only for client-safe vars
- Never commit `.env` files
- Verify Vercel env vars match local

**Red Flags:**
- ❌ Missing env var in `.env.example`
- ❌ Server-only secret with `NEXT_PUBLIC_` prefix
- ❌ Hardcoded API keys/URLs

### 2. RLS Policy Break

**Symptom:**
- Users can't access their own data
- Users can access other users' data
- Queries return empty results unexpectedly

**Check:**
```bash
# Verify RLS is enabled on new tables
grep -r "ENABLE ROW LEVEL SECURITY" supabase/migrations/

# Check for RLS policies on new tables
grep -r "CREATE POLICY" supabase/migrations/ | grep -i "new_table_name"
```

**Prevention:**
- Every new table MUST have RLS enabled
- Every new table MUST have policies for SELECT, INSERT, UPDATE, DELETE
- Test queries with different user roles
- Verify `auth.uid()` is used correctly

**Red Flags:**
- ❌ New table without RLS enabled
- ❌ New table without policies
- ❌ Policies using `auth.uid()` incorrectly
- ❌ Policies allowing public access to private data

**Quick Test:**
```sql
-- Test RLS policy (run in Supabase SQL editor)
SET ROLE authenticated;
SET request.jwt.claim.sub = 'test-user-id';
SELECT * FROM your_new_table; -- Should only return user's own data
```

### 3. Storage Policy Regression

**Symptom:**
- Users can't upload files
- Users can't view their own images
- Users can view other users' private files

**Check:**
```bash
# Verify storage policies exist
grep -r "CREATE POLICY.*storage" supabase/migrations/

# Check bucket names match code
grep -r "from('" --include="*.ts" --include="*.tsx" | grep -i "storage"
```

**Prevention:**
- Every storage bucket MUST have RLS policies
- Policies MUST check `auth.uid()` matches folder path
- Policies MUST respect privacy settings
- Test upload/view/delete with different users

**Red Flags:**
- ❌ New bucket without policies
- ❌ Policies allowing public access to private files
- ❌ Policies not checking user ownership
- ❌ Bucket name mismatch between code and policies

**Quick Test:**
```typescript
// Test storage access (in Server Action)
const user = await getUser();
const { data, error } = await supabase.storage
  .from('post-images')
  .list(`${user.id}/`); // Should only list user's own files
```

### 4. Webhook Duplication

**Symptom:**
- Stripe webhooks processed multiple times
- Database records duplicated
- Subscription status updated incorrectly

**Check:**
```bash
# Verify webhook ledger table exists
grep -r "stripe_webhook_ledger" supabase/migrations/

# Check idempotency logic in webhook handler
grep -r "event_id" app/api/webhooks/stripe/
```

**Prevention:**
- Webhook handlers MUST check ledger before processing
- Webhook handlers MUST be idempotent
- Use `event.id` as unique identifier
- Mark events as "processing" to prevent concurrent execution

**Red Flags:**
- ❌ Webhook handler without idempotency check
- ❌ Webhook handler without ledger table
- ❌ Webhook handler that processes same event twice
- ❌ Missing "processing" flag check

**Quick Test:**
```typescript
// Test idempotency (send same webhook twice)
// Should only process once
```

## PR Template Snippet

Copy this into your PR description:

```markdown
## Summary
<!-- Brief description of changes -->

## Changes Made
- [ ] Feature/change 1
- [ ] Feature/change 2
- [ ] Bug fix description

## Pre-Push Checks
- [x] `npm run type-check` passed
- [x] `npm run lint` passed
- [x] `npm run build` passed
- [x] `supabase db diff` shows expected changes (or no changes)

## Database Changes
- [ ] Migration file created (if schema changed)
- [ ] `docs/database_schema_audit.md` updated
- [ ] RLS policies added/tested
- [ ] Migration tested locally (`supabase db reset`)

## Security Checks
- [ ] No secrets in code
- [ ] RLS policies reviewed
- [ ] Storage policies reviewed (if storage changed)
- [ ] Webhook idempotency verified (if webhook changed)

## Testing
- [ ] Manual testing completed
- [ ] Edge cases considered
- [ ] Error handling tested

## Documentation
- [ ] Code comments added (if complex logic)
- [ ] `docs/DOCUMENTATION_INDEX.md` updated (if new docs)
- [ ] Related contracts updated (if behavior changed)

## Known Traps Checked
- [ ] Environment variables verified
- [ ] RLS policies tested
- [ ] Storage policies tested (if applicable)
- [ ] Webhook idempotency verified (if applicable)

## Red-Zone Files Changed
<!-- List any red-zone files changed -->
- [ ] `lib/supabase.ts`
- [ ] `middleware.ts`
- [ ] `app/api/webhooks/stripe/route.ts`
- [ ] `lib/wordpress.ts`
- [ ] Other: ___________

## Screenshots/Examples
<!-- If UI changes, add screenshots -->
```

## Fast Checklist (Copy-Paste)

```bash
# 1. Type check
npm run type-check || exit 1

# 2. Lint
npm run lint || exit 1

# 3. Build
npm run build || exit 1

# 4. Schema verify (if database changed)
supabase db diff --schema public || echo "⚠️  Schema changes detected - verify migrations"

# 5. Quick secret check
grep -r "api_key\|secret_key\|password.*=" --exclude-dir=node_modules --exclude="*.md" . | grep -v "process.env" && echo "❌ Potential secret found" || echo "✅ No secrets found"

# 6. RLS check (if database changed)
grep -r "CREATE TABLE" supabase/migrations/ | while read line; do
  table=$(echo "$line" | grep -oP "CREATE TABLE \K\w+")
  grep -q "ENABLE ROW LEVEL SECURITY" supabase/migrations/*.sql || echo "⚠️  Table $table may be missing RLS"
done

echo "✅ All checks passed - ready to push"
```

## One-Liner (Fastest)

```bash
npm run type-check && npm run lint && npm run build && echo "✅ Ready to push"
```

## When to Stop

**STOP and fix if:**
- ❌ Type check fails
- ❌ Lint fails
- ❌ Build fails
- ❌ Schema changes without migration
- ❌ Secrets found in code
- ❌ New table without RLS

**Can proceed if:**
- ✅ All mandatory checks pass
- ✅ Known traps checked
- ✅ Documentation updated

## Exceptions

**If you must push with known issues:**

1. **Document in PR:**
   - What's broken
   - Why it's acceptable
   - When it will be fixed

2. **Create issue:**
   - Link issue in PR
   - Set priority (P0/P1/P2)

3. **Get approval:**
   - Tag team lead
   - Explain urgency

4. **Fix immediately:**
   - Follow-up PR within 24 hours
   - Don't let technical debt accumulate

## Related Commands

```bash
# Full verification (use /verify command)
npm run build && npm run lint && npm run type-check

# Schema verification
supabase db diff --schema public

# Test migration locally
supabase db reset

# Check for secrets
grep -r "api_key\|secret_key\|password" --exclude-dir=node_modules .

# Check RLS on new tables
grep -r "ENABLE ROW LEVEL SECURITY" supabase/migrations/
```

---

**Related Documents:**
- [CODING_STANDARDS.md](./../CODING_STANDARDS.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [MIGRATION_PROCEDURE.md](./MIGRATION_PROCEDURE.md)
- [ARCHITECTURE_CONSTITUTION.md](./../ARCHITECTURE_CONSTITUTION.md)
