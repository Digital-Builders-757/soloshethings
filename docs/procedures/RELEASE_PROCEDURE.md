# Release Procedure

**Purpose:** Deployment workflow, Vercel configuration, and rollback steps for SoloSheThings.

## Non-Negotiables

1. **Test Before Production** - All changes must be tested in staging/dev before production.
2. **Database Migrations First** - Applied automatically on branch pushes via GitHub Actions (see Database section below); the app deployment must never depend on schema that is not yet migrated.
3. **Environment Variables Verified** - Verify all environment variables are set correctly.
4. **Rollback Plan Ready** - Always have a rollback plan before deploying.
5. **Monitor After Deploy** - Monitor application after deployment for errors.

## Pre-Deployment Checklist

### Code Review

- [ ] Code reviewed and approved
- [ ] All tests pass
- [ ] TypeScript compiles
- [ ] Linting passes
- [ ] No secrets in code

### Database

- [ ] Migrations created (if needed)
- [ ] Migrations tested locally
- [ ] GitHub Actions **Supabase migrations (staging)** workflow succeeded on `develop` (staging Supabase stays in sync on each push)
- [ ] GitHub Actions **Supabase migrations (production)** workflow succeeded on `main` before or together with verifying the production deployment (migration job must finish successfully)
- [ ] Backup created (production)

### Configuration

- [ ] Environment variables set in Vercel
- [ ] Stripe webhooks configured (when subscription billing is enabled—not required for current MVP)
- [ ] WordPress webhook / revalidation secret configured when using headless blog (`POST /api/revalidate`)
- [ ] Error monitoring configured

### Documentation

- [ ] Documentation updated
- [ ] Changelog updated (if applicable)
- [ ] Team notified of changes

## Deployment Workflow

### 1. Pre-Deployment

```bash
# 1. Pull latest changes
git pull origin main

# 2. Run checks
pnpm install
pnpm run build
pnpm run lint
pnpm run test # When tests are implemented

# 3. Verify environment variables
# Check Vercel dashboard for all required variables
```

### 2. Database Migration (automatic + exceptions)

**Default (automated CI):**

- **`develop` pushes** trigger [`.github/workflows/supabase-migrations-develop.yml`](../../.github/workflows/supabase-migrations-develop.yml)—committed SQL in `supabase/migrations/` is applied to **staging** (Supabase CLI: `supabase link` + `supabase db push`).
- **`main` pushes** trigger [`.github/workflows/supabase-migrations-main.yml`](../../.github/workflows/supabase-migrations-main.yml)—same for **production**.

See [MIGRATION_PROCEDURE.md](./MIGRATION_PROCEDURE.md) (CI/CD section) for the exact GitHub secret names. Do not commit tokens or database passwords.

**Manual Supabase CLI (break-glass):** If Actions are unavailable or you must apply migrations outside CI:

```bash
supabase link --project-ref <project-ref>
supabase db push --yes

# Optional: inspect drift after changes
supabase db diff --linked --schema public
```

**Important:** Deploy application code only after migrations that block the release are confirmed applied (`db push` / migration history succeeds). **Storage** bucket and dashboard-only SQL (**e.g. [`docs/supabase/storage_setup_dashboard.sql`](../supabase/storage_setup_dashboard.sql)**) remain a **manual per-environment step** when needed—they are not run by migration workflows.

### 3. Deploy to Vercel

#### Automatic Deployment (Main Branch)

```bash
# Push to main branch
git push origin main

# Vercel automatically deploys
# Monitor deployment in Vercel dashboard
```

#### Manual Deployment

```bash
# Deploy via Vercel CLI
vercel --prod

# Or use Vercel dashboard
# Deployments → Deploy
```

### 4. Post-Deployment Verification

**Immediate Checks:**

- [ ] Deployment successful (no build errors)
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Database queries work (dashboard / profile)
- [ ] Stripe webhooks receive events (when billing is enabled)
- [ ] WordPress / blog routes behave as expected (`/blog`, `/blog/[slug]` when `WP_URL` is set; graceful fallback when not)

**Functional Tests (current MVP):**

- [ ] User can sign up
- [ ] User can log in
- [ ] User can open dashboard and profile; profile edits persist
- [ ] Anonymous visitor is redirected from protected routes (e.g. `/dashboard` → `/login?redirectTo=...`)
- [ ] Blog list and post pages load when WordPress is configured; no crash when it is not

**Functional Tests (full product — when those features ship):**

- [ ] User can create community post (not in current MVP)
- [ ] Subscription / checkout flow works (not in current MVP)

**Monitoring:**

- [ ] Check Vercel logs for errors
- [ ] Check Sentry for errors (if configured)
- [ ] Monitor Stripe webhook logs
- [ ] Check Supabase logs

## Vercel Configuration

### Build Settings

**Framework Preset:** Next.js  
**Build Command:** `pnpm run build`  
**Output Directory:** `.next`  
**Install Command:** leave default or **`pnpm install`** (Vercel detects [`pnpm-lock.yaml`](../../pnpm-lock.yaml) and uses **pnpm**; avoid mixing with npm lockfiles—this repo relies on **`pnpm-lock.yaml`** only.)

### Environment Variables

Set in Vercel dashboard:
- Production environment
- Preview environment
- Development environment

### Domain Configuration

1. **Add Custom Domain**
   - Go to Vercel project settings
   - Add domain: `soloshethings.com`
   - Configure DNS records

2. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Verify certificate is active

### Webhook Configuration

#### Stripe Webhooks

1. **Get Vercel Deployment URL**
   ```
   https://your-app.vercel.app/api/webhooks/stripe
   ```

2. **Configure in Stripe Dashboard**
   - Webhooks → Add endpoint
   - URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Events: Select required events
   - Secret: Copy webhook secret
   - Add to Vercel environment variables

#### WordPress Webhooks

1. **Get Revalidation URL**
   ```
   https://your-app.vercel.app/api/revalidate
   ```
   The app implements a single `POST` handler in `app/api/revalidate/route.ts` (JSON body includes `secret`; see `docs/contracts/WORDPRESS_CONTENT_CONTRACT.md`).

2. **Configure in WordPress**
   - `POST` to that URL with the shared secret in the JSON body (not a separate `/api/revalidate/wordpress` path)
   - Set `REVALIDATE_SECRET` / env per `docs/procedures/ENVIRONMENT_PROCEDURE.md`

## Rollback Procedure

### Quick Rollback (Vercel)

1. **Go to Vercel Dashboard**
2. **Deployments → Select Previous Deployment**
3. **Click "Promote to Production"**
4. **Verify Application**

### Code Rollback

```bash
# 1. Revert commit
git revert <commit-hash>

# 2. Push to main
git push origin main

# 3. Vercel automatically redeploys
```

### Database Rollback

```sql
-- If migration needs to be rolled back
-- Create new migration to reverse changes

-- Example: Remove column
ALTER TABLE profiles DROP COLUMN IF EXISTS new_column;
```

**Warning:** Be careful with data loss. Always backup before rollback.

## Deployment Environments

### Preview Deployments

**Automatic:** Every push to feature branch creates preview deployment.

**Purpose:**
- Test changes before merging
- Share with team for review
- Test in production-like environment

### Production Deployment

**Trigger:** Push to `main` branch.

**Process:**
1. Vercel builds application
2. Runs tests (if configured)
3. Deploys to production
4. Updates custom domain

## Monitoring

### Vercel Analytics

- Monitor deployment status
- Check build logs
- View function logs
- Monitor performance

### Error Monitoring

**Sentry (if configured):**
- Real-time error tracking
- Error notifications
- Performance monitoring

### Application Health

**Health Check Endpoint:**
```typescript
// app/api/health/route.ts
export async function GET() {
  // Check database connection
  // Check external services
  return Response.json({ status: 'ok' });
}
```

## Release Notes

### Template

```markdown
## Release v1.0.0 - 2025-01-27

### Added
- User authentication
- Profile management
- Community posts

### Changed
- Updated UI components

### Fixed
- Fixed login redirect issue

### Security
- Updated dependencies
```

## Emergency Procedures

### If Deployment Fails

1. **Check Build Logs**
   - Identify error
   - Fix issue
   - Redeploy

2. **Rollback if Needed**
   - Promote previous deployment
   - Fix issue
   - Redeploy

### If Application Breaks

1. **Immediate Rollback**
   - Promote previous deployment
   - Verify application works

2. **Investigate Issue**
   - Check error logs
   - Identify root cause
   - Fix issue

3. **Redeploy**
   - Test fix locally
   - Deploy to production
   - Monitor closely

## Post-Deployment

### Communication

- Notify team of deployment
- Share release notes
- Monitor user feedback

### Documentation

- Update [MVP_STATUS_NOTION.md](./../MVP_STATUS_NOTION.md)
- Update changelog
- Document any issues

---

**Related Documents:**
- [ENVIRONMENT_PROCEDURE.md](./ENVIRONMENT_PROCEDURE.md)
- [MIGRATION_PROCEDURE.md](./MIGRATION_PROCEDURE.md)
- [INCIDENT_TRIAGE_PROCEDURE.md](./INCIDENT_TRIAGE_PROCEDURE.md)

