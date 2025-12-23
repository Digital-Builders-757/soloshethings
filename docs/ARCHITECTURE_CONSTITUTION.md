# Architecture Constitution

**Purpose:** Foundational principles and non-negotiable architectural decisions for SoloSheThings.

## Mission

**SoloSheThings** is a mobile-first platform empowering solo female travelers with community connection, photo sharing, and travel resources. We are building a secure, privacy-respecting platform where users own their content, creators are protected (no face recognition), and community features are subscription-gated after a 1-week free trial.

## Non-Negotiables

1. **RLS Always On** - Every Supabase table MUST have Row Level Security enabled. No exceptions.
2. **Explicit Selects** - MUST never use `select('*')`. MUST always specify columns explicitly.
3. **Server-Only Secrets** - Service role keys, Stripe secrets, and API keys MUST only exist in server-side code.
4. **No Service Role in Client** - The Supabase service role key MUST never be exposed to the browser.
5. **Use getUser, Not getSession** - For auth decisions, MUST use `getUser()` from `@supabase/auth-helpers-nextjs`, not `getSession()`.
6. **No Silent Failures** - All errors MUST be logged. Operations MUST throw or return explicit error states.
7. **Red-Zone Files** - Critical files require extra scrutiny and MUST be reviewed by senior developers.

## Hybrid Architecture Stance

### WordPress = Public Editorial + SEO Only

**MUST:**
- WordPress is read-only from Next.js (no writes)
- WordPress content is public (no authentication required)
- WordPress is used ONLY for editorial/blog content
- WordPress content MUST use ISR with webhook revalidation
- WordPress content MUST be sanitized before display

**MUST NOT:**
- Store user-generated content in WordPress
- Require authentication for WordPress content
- Use WordPress for user profiles, subscriptions, or community features

### Supabase = Identity + Profiles + Subscription State + UGC/Community + Moderation + Storage

**MUST:**
- Supabase handles all user identity and authentication
- Supabase stores all user profiles and subscription state
- Supabase stores all user-generated content (posts, images, saved items)
- Supabase handles content moderation (reports, admin actions)
- Supabase Storage handles all file uploads (avatars, post images)
- All Supabase tables MUST have RLS enabled
- All Supabase queries MUST use explicit column selection

**MUST NOT:**
- Use Supabase for public editorial content (use WordPress)
- Expose service role key to client code
- Use `select('*')` in any query

## Server/Client Boundaries

**MUST:**
- Default to Server Components (React Server Components)
- Use Client Components ONLY for interactivity (forms, modals, real-time updates)
- All database queries MUST be server-side
- All API calls with secrets MUST be server-side
- All file uploads MUST go through server-side validation

**MUST NOT:**
- Use Client Components for data fetching (use Server Components)
- Expose secrets in Client Components
- Perform database writes from Client Components (use Server Actions)
- Trust client-side validation alone (MUST validate server-side)

## Directory Structure

```
app/
  (auth)/          # Login, signup, password reset
  talent/          # Talent dashboard routes
  client/          # Client dashboard routes (if applicable)
  api/             # Route handlers (webhooks, external APIs)
  layout.tsx       # Root layout
  page.tsx         # Homepage

components/
  ui/              # shadcn/ui components
  shared/          # Reusable business components

lib/
  supabase.ts      # Supabase client (server + client variants)
  stripe.ts        # Stripe client (server-only)
  wordpress.ts     # WordPress fetch utilities
  resend.ts        # Email client (server-only)
  utils.ts         # Shared utilities

docs/              # All documentation
supabase/
  migrations/      # Database migration files
```

## Red-Zone Files

These files MUST be reviewed by senior developers before merging:

1. **`lib/supabase.ts`** - Supabase client initialization (server vs client boundaries)
2. **`middleware.ts`** - Route protection and auth checks
3. **`app/api/webhooks/stripe/route.ts`** - Stripe webhook handler (signature verification)
4. **`lib/auth-provider.tsx`** - Auth context/provider (if using client-side auth)
5. **`lib/wordpress.ts`** - WordPress content fetching and sanitization
6. **`lib/supabase-admin.ts`** - Service role client (if exists, server-only)
7. **`lib/stripe.ts`** - Stripe client initialization

**Red-Zone Review Checklist:**
- [ ] No secrets exposed to client
- [ ] Proper error handling
- [ ] Input validation
- [ ] Security boundaries respected

## No Silent Failures Rule

**MUST:**
- All async operations MUST handle errors explicitly
- All errors MUST be logged (use Sentry in production)
- Operations MUST throw errors or return explicit error states
- Never swallow errors silently

**MUST NOT:**
- Use empty catch blocks
- Ignore error responses
- Fail silently without logging

**Logging Posture:**
- Production: Use Sentry for error tracking
- Development: Console logs acceptable
- Server Actions: Log errors before throwing
- API Routes: Log errors with context
- Client Components: Log to Sentry, show user-friendly message

## Public Surface vs Private Surface

### Public Surface

**Definition:** Content accessible without authentication.

**MUST Include:**
- Marketing/landing pages (`/`, `/about`, `/pricing`)
- WordPress blog posts (`/blog/*`)
- Signup/login pages
- Password reset flow

**MUST NOT Include:**
- User profiles (except public previews)
- User-generated content
- Subscription information
- Any Supabase data (except public previews)

### Private Surface

**Definition:** Content requiring authentication and/or subscription.

**MUST Include:**
- User dashboard
- Profile management
- Community posts (create, view)
- Image uploads
- Subscription management
- Premium features (events, workshops - future)

**Access Control:**
- Authentication: Required for all private surface
- Subscription: Required for premium features
- RLS: Enforces access at database level

## Performance Posture

**MUST:**
- Use ISR for WordPress content (revalidate: 3600 seconds)
- Use Next.js Image component for all images
- Cache API responses when appropriate
- Use Server Components by default (smaller bundles)
- Lazy load heavy Client Components

**ISR Strategy:**
- WordPress blog posts: ISR with 1-hour revalidation
- Webhook revalidation: WordPress publish triggers cache invalidation
- Stale-while-revalidate: Serve stale content while revalidating

**Caching Rules:**
- Public content: Aggressive caching (ISR)
- User content: No caching (always fresh)
- API responses: Cache when safe, respect cache headers

## Truth Sources Policy

**MUST:**
- `database_schema_audit.md` is the single source of truth for database schema
- Contract docs (`docs/contracts/*.md`) are the source of truth for behavior
- Keep truth sources updated when making changes

**Schema Truth:**
- `docs/database_schema_audit.md` MUST reflect actual database schema
- All tables, columns, indexes, RLS policies MUST be documented
- Schema changes MUST be documented immediately

**Behavior Truth:**
- `docs/contracts/AUTH_CONTRACT.md` - Authentication behavior
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md` - Query patterns
- `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md` - Access control
- `docs/contracts/BILLING_STRIPE_CONTRACT.md` - Subscription behavior
- `docs/contracts/UPLOADS_STORAGE_CONTRACT.md` - File upload behavior
- `docs/contracts/WORDPRESS_CONTENT_CONTRACT.md` - WordPress integration

**MUST NOT:**
- Document schema in multiple places (use `database_schema_audit.md`)
- Document behavior in code comments only (use contract docs)

## Checklist: Adding Table/Endpoint/Flow

When adding a new table, endpoint, or flow, you MUST:

### Adding a Table

- [ ] Create migration file (`supabase migration new <description>`)
- [ ] Define table schema with all columns
- [ ] Enable RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] Create RLS policies for SELECT, INSERT, UPDATE, DELETE
- [ ] Create indexes for frequently queried columns
- [ ] Update `docs/database_schema_audit.md` with table definition
- [ ] Update `docs/DATABASE_REPORT.md` with migration entry
- [ ] Test RLS policies with different user roles
- [ ] Verify explicit selects work correctly

### Adding an Endpoint

- [ ] Create route handler in `app/api/`
- [ ] Verify authentication (if needed) using `getUser()`
- [ ] Validate all inputs
- [ ] Handle errors explicitly (no silent failures)
- [ ] Log errors to Sentry (production)
- [ ] Verify webhook signatures (if applicable)
- [ ] Update relevant contract doc (if behavior changes)
- [ ] Add to red-zone list if security-critical

### Adding a Flow

- [ ] Document flow in `docs/diagrams/core-flows.md`
- [ ] Update `docs/USER_GUIDE.md` if user-facing
- [ ] Update relevant contract docs if behavior changes
- [ ] Add to smoke test paths (`docs/proof/E2E_SMOKE_PATHS.md`) if critical
- [ ] Verify all security boundaries respected
- [ ] Test with different user roles
- [ ] Verify error handling

### General Requirements

- [ ] No secrets in code
- [ ] Explicit column selection in queries
- [ ] RLS policies tested
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Code reviewed (red-zone files require senior review)

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md)
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [database_schema_audit.md](./database_schema_audit.md)
- [contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- [contracts/DATA_ACCESS_QUERY_CONTRACT.md](./contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- [contracts/AUTH_CONTRACT.md](./contracts/AUTH_CONTRACT.md)

