# Release Procedure

**Purpose:** Deployment workflow, Vercel configuration, and rollback steps for SoloSheThings.

## Non-Negotiables

1. **Test Before Production** - All changes must be tested in staging/dev before production.
2. **Database Migrations First** - Apply database migrations before deploying code.
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
- [ ] Migrations applied to staging (if available)
- [ ] Backup created (production)

### Configuration

- [ ] Environment variables set in Vercel
- [ ] Stripe webhooks configured
- [ ] WordPress webhooks configured
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
npm run build
npm run lint
npm run test # When tests are implemented

# 3. Verify environment variables
# Check Vercel dashboard for all required variables
```

### 2. Database Migration (If Needed)

```bash
# Apply migrations to production
supabase link --project-ref <production-project-ref>
supabase db push

# Verify migration
supabase db diff
```

**Important:** Apply migrations BEFORE deploying code that depends on them.

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
- [ ] Database queries work
- [ ] Stripe webhooks receive events
- [ ] WordPress content loads

**Functional Tests:**

- [ ] User can sign up
- [ ] User can log in
- [ ] User can create profile
- [ ] User can create post
- [ ] Subscription flow works
- [ ] Blog posts load

**Monitoring:**

- [ ] Check Vercel logs for errors
- [ ] Check Sentry for errors (if configured)
- [ ] Monitor Stripe webhook logs
- [ ] Check Supabase logs

## Vercel Configuration

### Build Settings

**Framework Preset:** Next.js  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`

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
   https://your-app.vercel.app/api/revalidate/wordpress
   ```

2. **Configure in WordPress**
   - Set webhook URL
   - Set webhook secret
   - Add to Vercel environment variables

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

