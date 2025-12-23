# Environment Procedure

**Purpose:** Development vs production discipline, separate Supabase projects, Stripe key management, Vercel env var rules, branch-aware type generation, and secrets handling for SoloSheThings.

## Non-Negotiables

1. **Separate Supabase Projects** - Dev and production MUST use completely separate Supabase projects.
2. **Separate Stripe Keys** - Test keys in dev, live keys ONLY in production.
3. **No Production Data in Dev** - Never use production data in development.
4. **Secrets in Environment Variables** - All secrets MUST be in environment variables, never in code.
5. **Branch-Aware Types** - Type generation MUST match the environment being used.
6. **Never Mix Environments** - See "Never Mix These" table below.

## Dev vs Prod Discipline

### Development Environment

**Purpose:** Local development and testing.

**Characteristics:**
- Separate Supabase project (`soloshethings-dev`)
- Stripe test mode keys (`sk_test_...`)
- Test data only
- Debug logging enabled
- Local WordPress instance (optional)

**MUST:**
- Use test Stripe keys
- Use dev Supabase project
- Use test webhook endpoints
- Use test email service (Resend test mode)

**MUST NOT:**
- Use production Supabase project
- Use live Stripe keys
- Use production webhook secrets
- Access production data

### Production Environment

**Purpose:** Live application serving real users.

**Characteristics:**
- Separate Supabase project (`soloshethings-prod`)
- Stripe live mode keys (`sk_live_...`)
- Real user data
- Error monitoring enabled (Sentry)
- Production WordPress instance

**MUST:**
- Use live Stripe keys
- Use production Supabase project
- Use production webhook secrets
- Monitor errors and performance

**MUST NOT:**
- Use test Stripe keys
- Use dev Supabase project
- Use test webhook secrets
- Expose service role keys

## Separate Supabase Projects

### Development Project

**Project Name:** `soloshethings-dev`

**Setup:**
```bash
# Link to dev project
supabase link --project-ref <dev-project-ref>

# Apply migrations
supabase db push

# Generate types from dev
supabase gen types typescript --local > types/database.ts
```

**Characteristics:**
- Test data only
- Can be reset without consequences
- Shared by all developers
- No production data

**Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<dev-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dev-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<dev-service-role-key>
```

### Production Project

**Project Name:** `soloshethings-prod`

**Setup:**
```bash
# Link to production project (ONLY when deploying)
supabase link --project-ref <prod-project-ref>

# Apply migrations (with backup first)
supabase db push
```

**Characteristics:**
- Real user data
- Never reset
- Backups enabled
- Monitoring enabled

**Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<prod-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<prod-service-role-key>
```

**Access Control:**
- Only senior developers can access
- Requires approval for migrations
- All changes logged and audited

## Separate Stripe Test vs Live Keys

### Stripe Test Mode (Development)

**Keys:**
- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_WEBHOOK_SECRET=whsec_test_...`
- `STRIPE_PRICE_ID=price_test_...`

**Usage:**
- Development environment
- Local testing
- Staging environment (if using test mode)

**Characteristics:**
- No real charges
- Test cards work
- Webhook testing enabled
- Can be reset

### Stripe Live Mode (Production)

**Keys:**
- `STRIPE_SECRET_KEY=sk_live_...`
- `STRIPE_WEBHOOK_SECRET=whsec_live_...`
- `STRIPE_PRICE_ID=price_live_...`

**Usage:**
- Production environment ONLY
- Real charges
- Real customers

**Characteristics:**
- Real charges processed
- Real webhooks
- Cannot be reset
- Requires careful handling

### Stripe Key Validation

```typescript
// ✅ CORRECT: Validate Stripe key matches environment
function validateStripeKey() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!stripeKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  
  if (isProduction && stripeKey.startsWith('sk_test_')) {
    throw new Error('Using test Stripe key in production!');
  }
  
  if (!isProduction && stripeKey.startsWith('sk_live_')) {
    throw new Error('Using live Stripe key in development!');
  }
}
```

## Vercel Env Var Rules

### Environment Variable Types

**Production:**
- Set in Vercel Dashboard → Settings → Environment Variables
- Mark as "Production" only
- Use production values (live Stripe, prod Supabase)

**Preview (Branch Deploys):**
- Inherits from Production by default
- Can override with Preview-specific values
- Use dev/test values for feature branches

**Development:**
- Set in Vercel Dashboard → Settings → Environment Variables
- Mark as "Development" only
- Use dev/test values

### Vercel Configuration

**Setting Environment Variables:**

1. Go to Vercel Dashboard
2. Select Project: `soloshethings`
3. Settings → Environment Variables
4. Add variable with:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_live_...` (production) or `sk_test_...` (preview/dev)
   - **Environment:** Select Production, Preview, Development
   - **Sensitive:** Mark as sensitive (hides value)

**Environment-Specific Values:**

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | `sk_test_...` | `sk_test_...` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<prod>.supabase.co` | `https://<dev>.supabase.co` | `https://<dev>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `<prod-key>` | `<dev-key>` | `<dev-key>` |

### Vercel Env Var Best Practices

**MUST:**
- Set different values for Production vs Preview/Development
- Mark sensitive variables (hides values in UI)
- Use Production values ONLY for Production environment
- Document all env vars in `.env.example`

**MUST NOT:**
- Use same values for Production and Development
- Commit `.env.local` files
- Expose env vars in build logs
- Use Production keys in Preview deployments

## Branch-Aware Type Generation Strategy

### Problem

TypeScript types must match the database schema being used. Different branches may have different migrations applied.

### Strategy

**Rule:** Always generate types from the environment you're working with.

### Local Development

**Generate from Local Database:**
```bash
# After applying migrations locally
supabase gen types typescript --local > types/database.ts
```

**When to Regenerate:**
- After applying new migrations
- After pulling migrations from main
- When types don't match schema

### Feature Branches

**Strategy:**
1. Apply migrations from main branch first
2. Apply feature branch migrations
3. Regenerate types from local database
4. Commit types with feature branch

**Workflow:**
```bash
# 1. Pull latest migrations from main
git pull origin main

# 2. Apply all migrations locally
supabase db reset

# 3. Apply feature branch migrations (if any)
supabase migration up

# 4. Regenerate types
supabase gen types typescript --local > types/database.ts

# 5. Commit types with feature
git add types/database.ts
git commit -m "feat(schema): regenerate types for feature branch"
```

### Main Branch

**Strategy:**
- Types in main branch MUST match production schema
- Regenerate types after merging migrations
- Verify types match production before merging

**Workflow:**
```bash
# After merging migration PR
# 1. Pull latest
git pull origin main

# 2. Link to production (read-only, for verification)
supabase link --project-ref <prod-project-ref>

# 3. Generate types from production (verify)
supabase gen types typescript --project-id <prod-project-ref> > types/database.prod.ts

# 4. Compare with local types
diff types/database.ts types/database.prod.ts

# 5. If different, regenerate from local (after applying migrations)
supabase db reset
supabase gen types typescript --local > types/database.ts
```

### Type Generation Rules

**MUST:**
- Generate types after every migration
- Commit types with migration PR
- Verify types match environment
- Regenerate when pulling migrations

**MUST NOT:**
- Manually edit generated types
- Skip type regeneration
- Use types from different environment
- Commit types that don't match schema

## Secrets Handling

### Secret Classification

**Public (Safe for Client):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

**Server-Only (Never Expose):**
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `WORDPRESS_WEBHOOK_SECRET`
- `WORDPRESS_PREVIEW_SECRET`

### Local Development Secrets

**File:** `.env.local` (NOT committed)

```bash
# Supabase (Dev)
NEXT_PUBLIC_SUPABASE_URL=https://<dev-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<dev-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<dev-service-role-key>

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_PRICE_ID=price_test_...

# WordPress (Dev)
WORDPRESS_API_URL=https://dev-wordpress.example.com/wp-json
WORDPRESS_WEBHOOK_SECRET=<dev-webhook-secret>
WORDPRESS_PREVIEW_SECRET=<dev-preview-secret>

# Resend (Test Mode)
RESEND_API_KEY=re_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Git Ignore:**
```gitignore
# .gitignore
.env.local
.env*.local
.env
```

### Production Secrets

**Location:** Vercel Dashboard → Settings → Environment Variables

**Set for Production Only:**
```bash
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://<prod-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<prod-service-role-key>

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
STRIPE_PRICE_ID=price_live_...

# WordPress (Production)
WORDPRESS_API_URL=https://wordpress.example.com/wp-json
WORDPRESS_WEBHOOK_SECRET=<prod-webhook-secret>
WORDPRESS_PREVIEW_SECRET=<prod-preview-secret>

# Resend (Production)
RESEND_API_KEY=re_...

# Monitoring
SENTRY_DSN=<sentry-dsn>
```

### Secret Validation

```typescript
// ✅ CORRECT: Validate secrets at startup
// lib/env-validation.ts
export function validateEnvironment() {
  const required = {
    // Public (can be in client)
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    
    // Server-only (never in client)
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  };

  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  // Validate Stripe key matches environment
  const isProduction = process.env.NODE_ENV === 'production';
  const stripeKey = process.env.STRIPE_SECRET_KEY!;
  
  if (isProduction && stripeKey.startsWith('sk_test_')) {
    throw new Error('Using test Stripe key in production!');
  }
  
  if (!isProduction && stripeKey.startsWith('sk_live_')) {
    throw new Error('Using live Stripe key in development!');
  }
}
```

## Never Mix These

| Item | Development | Production | Never Mix |
|------|-------------|------------|-----------|
| **Supabase Project** | `soloshethings-dev` | `soloshethings-prod` | ❌ Never use prod project in dev |
| **Supabase URL** | `https://<dev>.supabase.co` | `https://<prod>.supabase.co` | ❌ Never use prod URL in dev |
| **Supabase Service Role** | Dev service role key | Prod service role key | ❌ Never use prod service role in dev |
| **Stripe Secret Key** | `sk_test_...` | `sk_live_...` | ❌ Never use live key in dev, never use test key in prod |
| **Stripe Webhook Secret** | `whsec_test_...` | `whsec_live_...` | ❌ Never mix test/live webhook secrets |
| **Stripe Price ID** | `price_test_...` | `price_live_...` | ❌ Never use live price in dev |
| **WordPress URL** | Dev/staging WordPress | Production WordPress | ❌ Never use prod WordPress in dev |
| **WordPress Webhook Secret** | Dev webhook secret | Prod webhook secret | ❌ Never mix webhook secrets |
| **Resend API Key** | Test API key | Production API key | ❌ Never use prod key in dev |
| **Database Data** | Test data only | Real user data | ❌ Never use prod data in dev |
| **Error Monitoring** | Console logs | Sentry (production) | ❌ Never send dev errors to prod Sentry |
| **Type Generation** | From dev database | From prod database | ❌ Never generate types from wrong env |

### Critical Rules

**MUST NEVER:**
- ❌ Use production Supabase project in development
- ❌ Use live Stripe keys in development
- ❌ Use test Stripe keys in production
- ❌ Access production data from development
- ❌ Generate types from production when working on dev
- ❌ Use production webhook secrets in development
- ❌ Mix environment variables between environments

**MUST ALWAYS:**
- ✅ Use separate Supabase projects
- ✅ Use test Stripe keys in dev, live in prod
- ✅ Generate types from the environment you're using
- ✅ Verify environment variables match environment
- ✅ Keep secrets separate per environment

## Environment Setup Checklist

### Development Setup

- [ ] Create `.env.local` file (not committed)
- [ ] Set dev Supabase project URL and keys
- [ ] Set Stripe test mode keys
- [ ] Set dev WordPress URL and secrets
- [ ] Set Resend test API key
- [ ] Link to dev Supabase project: `supabase link --project-ref <dev-ref>`
- [ ] Apply migrations: `supabase db push`
- [ ] Generate types: `supabase gen types typescript --local > types/database.ts`
- [ ] Verify `.env.local` is in `.gitignore`

### Production Setup

- [ ] Create production Supabase project
- [ ] Set production env vars in Vercel
- [ ] Use live Stripe keys (production only)
- [ ] Set production WordPress URL and secrets
- [ ] Set production Resend API key
- [ ] Configure Sentry for error monitoring
- [ ] Set up database backups
- [ ] Verify all env vars are set correctly
- [ ] Test production deployment

## Quick Reference

### Environment Detection

```typescript
// ✅ CORRECT: Detect environment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview';

// Stripe key validation
const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');
const isLiveMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_');
```

### Common Commands

```bash
# Link to dev project
supabase link --project-ref <dev-project-ref>

# Link to prod project (careful!)
supabase link --project-ref <prod-project-ref>

# Generate types from local
supabase gen types typescript --local > types/database.ts

# Generate types from remote (read-only verification)
supabase gen types typescript --project-id <project-ref> > types/database.remote.ts

# Check which project is linked
supabase status
```

## Troubleshooting

### Wrong Supabase Project

**Symptom:** Data doesn't match expectations, wrong schema.

**Check:**
```bash
# Check linked project
supabase status

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

**Fix:**
```bash
# Unlink current project
supabase unlink

# Link to correct project
supabase link --project-ref <correct-project-ref>
```

### Wrong Stripe Keys

**Symptom:** Stripe API errors, test charges in production.

**Check:**
```typescript
// Validate Stripe key
const key = process.env.STRIPE_SECRET_KEY;
const isProd = process.env.NODE_ENV === 'production';
if (isProd && key?.startsWith('sk_test_')) {
  throw new Error('Test key in production!');
}
```

**Fix:**
- Update Vercel environment variables
- Use correct key for environment
- Redeploy application

### Types Don't Match Schema

**Symptom:** TypeScript errors, missing types.

**Check:**
```bash
# Verify schema matches
supabase db diff --schema public

# Regenerate types
supabase gen types typescript --local > types/database.ts
```

**Fix:**
- Apply missing migrations
- Regenerate types from correct environment
- Verify types match `database_schema_audit.md`

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [RELEASE_PROCEDURE.md](./RELEASE_PROCEDURE.md)
- [MIGRATION_PROCEDURE.md](./MIGRATION_PROCEDURE.md)
- [PRE_PUSH_CHECKLIST.md](./PRE_PUSH_CHECKLIST.md)
