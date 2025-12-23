# Project Context Prompt

**Purpose:** Read-first directive for any agent/dev before changing code in SoloSheThings.

## Read First (In This Order)

1. **`docs/DOCUMENTATION_INDEX.md`** - Master navigation map
2. **`docs/ARCHITECTURE_CONSTITUTION.md`** - Foundational principles and non-negotiables
3. **Key Contracts:**
   - `docs/contracts/AUTH_CONTRACT.md` - Authentication behavior
   - `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md` - Query patterns
   - `docs/contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md` - Access control
   - `docs/contracts/BILLING_STRIPE_CONTRACT.md` - Subscription behavior (if touching billing)
   - `docs/contracts/WORDPRESS_CONTENT_CONTRACT.md` - WordPress integration (if touching blog)

## Red-Zone Files

These files require senior review before merging:

- `lib/supabase-client.ts` / `lib/supabase-server.ts` (if present) - Supabase client initialization patterns
- `middleware.ts` - Route protection and auth checks
- `app/api/webhooks/stripe/route.ts` - Stripe webhook handler (if present)
- `components/auth/auth-provider.tsx` (if present) - Auth context/provider
- `lib/wp-rest.ts` - WordPress REST fetching (server-only)
- `lib/wp-graphql.ts` (if present) - WordPress GraphQL fetching (server-only)
- `app/api/preview/route.ts` - Preview mode entrypoint
- `app/api/revalidate/route.ts` - Revalidation webhook endpoint
- `lib/supabase-admin-client.ts` (if present) - Service role client (server-only)
- `lib/stripe.ts` - Stripe client initialization
- `.cursorrules` - Agent rules

**If touching any red-zone file:** Use `/redzone` command protocol.

## Required Invariants (Never Violate)

1. **RLS Always On** - Every Supabase table MUST have RLS enabled
2. **Explicit Selects** - NEVER use `select('*')`. Always specify columns
3. **getUser, Not getSession** - Use `getUser()` for auth decisions, not `getSession()`
4. **Server-Only Secrets** - Service role keys, Stripe secrets MUST only exist server-side
4b. **WordPress Fetching is Server-Only** - Never fetch WP from client components; enforce with `import "server-only"` in WP lib files
5. **No Silent Failures** - All errors MUST be logged. Operations MUST throw or return explicit error states
6. **WordPress = Read-Only** - WordPress is read-only from Next.js (no writes)
6b. **No WP Credentials in Browser** - Any WP auth (preview/drafts) must be server-only env vars
7. **Supabase = User Data** - All user data goes in Supabase, not WordPress

## Required Pre-Push Checks

Before pushing code:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] No secrets in code
- [ ] RLS policies reviewed (if schema changed)
- [ ] Explicit selects in all queries
- [ ] Documentation updated (see below)

## How to Propose Changes

### 1. Update Truth Docs First

**Schema Changes:**
- Update `docs/database_schema_audit.md` BEFORE writing migration
- Update `docs/DATABASE_REPORT.md` with migration entry

**Behavior Changes:**
- Update relevant contract doc in `docs/contracts/` BEFORE changing code
- Update `docs/USER_GUIDE.md` if user-facing
- Update `docs/diagrams/core-flows.md` if flow changes

**Feature Status:**
- Update `docs/MVP_STATUS_NOTION.md` with progress

### 2. Then Write Code

- Follow the updated documentation
- Respect architectural boundaries
- Use explicit selects, RLS, getUser()

### 3. Update Documentation Index

- If new docs created, add to `docs/DOCUMENTATION_INDEX.md`

## How to Handle Uncertainty

**If documentation is unclear or missing:**

1. **STOP** - Do not proceed with code changes
2. **Reconcile docs** - Update documentation first to clarify the intended behavior
3. **Verify alignment** - Ensure all related docs are consistent
4. **Then proceed** - Write code that matches the clarified documentation

**If code and docs conflict:**

1. **STOP** - Do not assume code is correct
2. **Check truth sources:**
   - Schema: `docs/database_schema_audit.md` is truth
   - Behavior: Contract docs in `docs/contracts/` are truth
3. **Reconcile** - Update code OR docs to match truth source
4. **Document decision** - Note why code or docs were changed

**Emergency exception (production down):**
- Apply the smallest safe fix to restore service
- Immediately document the behavior change in the relevant contract and MVP status

## UX Reference: Accidentally Wes Anderson (Structure Only)

**Reference Site:** https://accidentallywesanderson.com/

**What We Borrow:**
- Information architecture patterns (feed, collections, map, submit, bulletin)
- Browsing rhythm and content structure
- Large visual cards with story snippets

**What We Do NOT Copy:**
- Colors, fonts, or branding (use SoloSheThings brand only)
- Visual styling or aesthetic
- Typography choices

**Documentation:**
- `docs/UX_REFERENCE_AWA.md` - Detailed AWA inspiration and adaptations
- `docs/BRAND_STYLE_GUIDE.md` - SoloSheThings brand colors (NOT AWA colors)

**Key Adaptation:**
- AWA: Aesthetic focus, visual storytelling
- SoloSheThings: Safety + community focus, practical travel information, privacy-first UGC

## Environment Variables

### WordPress (Phase 1)
- `WP_URL` - WordPress REST API base URL (required)
- `WP_GRAPHQL_URL` - WordPress GraphQL endpoint (optional)
- `REVALIDATE_SECRET` - Secret for webhook revalidation (required)
- `PREVIEW_SECRET` - Secret for preview mode (required)
- `NEXT_PUBLIC_SITE_URL` - Public site URL (required)

### Supabase (Phase 2+)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-only service role key

**See:** `.env.example` for template

## WordPress Preview & Revalidation

### Preview Mode (MVP posture)
- Entry: `/api/preview?secret=...&slug=/blog/post-slug`
- Enables Draft Mode cookies via Next.js
- Preview routes use `noStore()` and must never be cached
- **MVP limitation:** preview may show published content only unless WordPress draft auth is configured (Phase 1.5)

### Revalidation (canonical contract)
- Webhook endpoint: `POST /api/revalidate`
- Body: `{ secret: string, paths?: string[], tags?: string[] }`
- Validates `secret === process.env.REVALIDATE_SECRET`
- Calls `revalidatePath()` and `revalidateTag()`
- Must rate-limit and validate input sizes (max 25 items per array)

**Reference:** `docs/WORDPRESS_SUPABASE_BLUEPRINT.md`

## Quick Reference

- **Schema Truth:** `docs/database_schema_audit.md`
- **Behavior Truth:** `docs/contracts/*.md`
- **Architecture:** `docs/ARCHITECTURE_CONSTITUTION.md`
- **Security:** `docs/SECURITY_INVARIANTS.md`
- **Procedures:** `docs/procedures/*.md`
- **Diagrams:** `docs/diagrams/*.md`
- **Brand Colors:** `docs/BRAND_STYLE_GUIDE.md`
- **UX Reference:** `docs/UX_REFERENCE_AWA.md`
- **WordPress Blueprint:** `docs/WORDPRESS_SUPABASE_BLUEPRINT.md`

---

**Remember:** Documentation is the source of truth. Code must match docs, not the other way around.
