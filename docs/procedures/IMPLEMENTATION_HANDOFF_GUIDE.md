# SoloSHEThings Implementation Handoff Guide

**Purpose:** fast onboarding for any engineer helping implement, maintain, or ship SoloSHEThings.

## 1) Product in one paragraph

SoloSHEThings is a women-focused travel platform started by **Sharon** for women who want to travel the world with more confidence, safety, and shared wisdom. The product combines a **public editorial/travel publication** with a **private member layer** for profiles, saved stories, submissions, reporting, and future community depth. The tone should feel trustworthy, calm, mobile-first, and safety-aware — not generic lifestyle SaaS.

## 2) Actual stack in this repo

- **Frontend / app:** Next.js 16 App Router, React 18, TypeScript, Tailwind
- **Auth / DB / storage:** Supabase
- **Billing:** Stripe
- **Editorial CMS:** Headless WordPress
- **Hosting / deploys:** Vercel
- **Monitoring:** Sentry
- **Email:** Resend (not the active focus right now)

Canonical refs:
- `docs/PROJECT_OVERVIEW.md`
- `docs/WORDPRESS_SUPABASE_BLUEPRINT.md`
- `docs/contracts/`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- `docs/MVP_STATUS_NOTION.md`

## 3) Read this first

For any new contributor, the minimum read order is:

1. `docs/PROJECT_OVERVIEW.md`
2. `docs/procedures/IMPLEMENTATION_ROADMAP.md`
3. `docs/MVP_STATUS_NOTION.md`
4. The contract docs for the lane being touched
5. `docs/proof/` docs before calling work done

If the task is WordPress/CMS related, also read:
- `docs/WORDPRESS_SUPABASE_BLUEPRINT.md`
- `docs/contracts/WORDPRESS_CONTENT_CONTRACT.md`

If the task is auth / billing / data related, also read:
- `docs/contracts/AUTH_CONTRACT.md`
- `docs/contracts/DATA_ACCESS_QUERY_CONTRACT.md`
- `docs/contracts/BILLING_STRIPE_CONTRACT.md`
- `docs/contracts/UPLOADS_STORAGE_CONTRACT.md`

## 4) Branch and release workflow

- **`develop`** = active integration branch
- **`main`** = release / production branch
- Open work against **`develop`** first
- Promote tested work from **`develop`** to **`main`** after verification
- Supabase migration workflows are branch-aware (`develop` -> staging, `main` -> production)

Do not treat `main` as the daily scratch branch.

## 5) Current implementation reality

As of the latest docs sync, the repo already includes:
- public marketing + editorial surfaces
- authentication and profile flows
- community submit / browse / save / report flows
- owner story management
- moderation queue first pass
- Stripe checkout + entitlement gating
- honest newsletter-interest capture
- Sentry + product-signal instrumentation

The canonical active queue is:
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`

## 6) Access guide — what a contractor likely needs

Give the **minimum level that lets them do the job**.

### Required minimum

| System | Recommended access | Why |
|---|---|---|
| GitHub repo | **Write** (not org admin) | Pull, branch, push, open PRs, review repo docs/code |
| WordPress admin | **Admin** initially | Configure plugins, content model, menus, permalinks, webhooks, media/editorial settings for the headless setup |
| Vercel project | **Developer** | See deployments, logs, preview URLs, and environment config status |

### Usually needed for implementation work

| System | Recommended access | Why |
|---|---|---|
| Supabase **dev/staging** project | **Developer / SQL access** | Verify schema, RLS, storage, logs, and migration behavior in non-production |
| Sentry | **Read-only / Member** | Debug runtime issues without needing prod infrastructure control |

### Only if the work specifically requires it

| System | Recommended access | Why |
|---|---|---|
| Stripe **test mode** | **Developer** | Checkout/webhook debugging, product/price verification |
| Resend | **Developer / read-only** | Only if transactional email work is active |
| Production Supabase | **Limited / trusted-only** | Only if they are actively handling production migration or incident work |
| Stripe live mode | **Trusted-only** | Only if they are shipping or debugging real billing flows |
| DNS / registrar / domain admin | **Usually no** | Not needed for normal feature implementation |

## 7) Important note about WordPress access

If he is helping with the **headless WordPress implementation**, then yes — **WordPress admin access is the right default** at the start.

Why:
- plugin install/config (`ACF`, `WPGraphQL`, `WPGraphQL ACF`, webhook tooling)
- custom fields / post-type setup
- permalink and preview settings
- webhook/revalidation configuration
- media/editorial troubleshooting

Once the CMS setup is stable, you can downgrade that account later if you want tighter permissions.

## 8) Important note about env vars

If he already has the environment variables, that helps — but it does **not** replace platform access.

Env vars alone do **not** let him:
- install or configure WordPress plugins
- inspect Vercel deploy logs
- inspect Supabase schema/logs/storage policies
- manage Stripe webhook/product settings

So the real starter bundle is usually:
- repo access
- WordPress admin
- Vercel developer access
- Supabase dev/staging access
- env vars

## 9) Best handoff package to send him

Send him this exact bundle:

1. **GitHub repo URL**
2. **Branch rule:** work from `develop`, not `main`
3. **Docs to read first:**
   - `docs/PROJECT_OVERVIEW.md`
   - `docs/procedures/IMPLEMENTATION_ROADMAP.md`
   - `docs/MVP_STATUS_NOTION.md`
   - this file
4. **WordPress admin URL + login**
5. **Vercel project access**
6. **Supabase dev/staging access**
7. **Environment variables**
8. **Current immediate task list**
9. **Any production-access boundaries** (what he should not touch yet)

## 10) Suggested immediate task framing for him

Ask him to:
- read the docs above first
- confirm current branch state before changing code
- work against `develop`
- keep docs in sync with behavior changes
- avoid changing auth, billing, schema, or RLS casually
- call out anything blocked by WordPress, Vercel, or Supabase access

## 11) Verification before merge/push

Before calling a batch done:

```bash
pnpm install
pnpm run typecheck
pnpm run lint
pnpm run build
```

And if behavior changed, update:
- `docs/MVP_STATUS_NOTION.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md` (if the active queue changed)
- `docs/DOCUMENTATION_INDEX.md` (if new docs were added)

---

**Related docs:**
- `docs/PROJECT_OVERVIEW.md`
- `docs/WORDPRESS_SUPABASE_BLUEPRINT.md`
- `docs/procedures/ENVIRONMENT_PROCEDURE.md`
- `docs/procedures/RELEASE_PROCEDURE.md`
- `docs/procedures/IMPLEMENTATION_ROADMAP.md`
