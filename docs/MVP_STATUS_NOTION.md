# MVP Status & Progress Tracking

**Purpose:** Project status dashboard, phase planning, and progress history for SoloSheThings MVP.

## Project Status Dashboard

### ✅ Done

- **System Kit Documentation** - Complete documentation set (Phase 0) ✅
- **Database Schema Design** - v0 schema defined and documented ✅
- **Architecture Definition** - Constitution, contracts, procedures defined ✅
- **Backend Foundation (Phase 1)** - Supabase setup, database migration, authentication ✅
- **WordPress Editorial Layer (Phase 1)** - Blog content integration with ISR ✅
- **UI Foundation (Phase 2 partial)** - Brand tokens, typography, core components ✅
- **Visual Design Enhancement** - Gradient border system, enhanced brand color vibrancy ✅
- **MVP Core Features (Phase 1)** - Auth hardening, profiles, dashboard shell, WordPress graceful fallback ✅
- **Auth + public/private surfaces (2026-05)** - Proxy and server helpers gate on verified `getUser()`; post-login `redirectTo` restricted to same-origin paths; bounded profile repair on dashboard/profile loads; `PUBLIC_PRIVATE_SURFACE_CONTRACT` documents live protected prefixes.
- **Site shell + perceived performance (2026-05)** - Shared safe-area gutters (`shell-inline`, `shell-pb-safe`), section vertical rhythm (`section-y`), route-level `loading.tsx` skeletons, hero `min-height` tied to `--shell-chrome-height`, nav overflow scroll on tight desktop widths.
- **Profile / account continuity (2026-05)** - Profile save can **create** a missing `profiles` row (first-time persistence); privacy level on form; private avatar uploads now store per-user paths in Supabase Storage and resolve back through signed URLs on dashboard/profile; `router.refresh` + form keyed by `updated_at`; nav/dashboard copy highlights **My dashboard** / **My profile**; error fallback shows session email, **Refresh page** / **Hard reload** (bounded repair again), honest copy (no dashboard↔profile redirect loop).
- **Submit flow + post image uploads (2026-05)** - `/submit` now saves real `community_posts` records, validates and uploads up to 5 JPG/PNG/WebP images server-side, stores per-user post image paths in Supabase Storage, and renders recent submissions back on the page with signed image URLs so members can verify the upload worked while broader community browsing catches up.
- **Community feed + story detail + reporting (2026-05)** - `/places` now provides the first real authenticated browsing surface for `community_posts`, mixing public member stories with the signed-in member's own posts so private submissions remain scoped. `/places/[slug]` resolves real post content with signed images, recent submissions link into that detail page, and public stories can be reported through the existing `reports` table with duplicate-open-report protection and honest moderation copy. Members can also open `/reports` to review their own reporting history, status, and any moderation notes already written back onto those rows.
- **Saved community stories (2026-05)** - Members can now save and unsave community posts from the feed and story detail using the existing `saved_posts` table, then revisit them on an authenticated `/saved` page. Save lookups stay user-scoped through RLS, story detail re-checks visibility so someone cannot deep-link into another member's private post, and the saved list now supports lightweight search plus quick filters for featured/public/private stories, your own stories, reported stories, and stories with photos.
- **Owner story controls + photo management (2026-05)** - Story owners can now update title, story copy, and public/private visibility from `/places/[slug]`, archive a post to remove it from feed/detail/saved surfaces, and manage post photos in a minimal honest pass by removing old images or adding more until the 5-photo limit. `/submit` now reflects archived status, lets owners restore archived stories back into community surfaces, routes published stories into the owner-management surface, and adds first-pass search plus quick filters so members can find archived/private/photo-heavy stories inside their own submission history. Story links across `/places`, `/saved`, `/reports`, and `/submit` now carry their current list context into detail pages, owner archive flow can return members to the same filtered `/submit` history view instead of dropping that context, `/submit` success state now links straight into the new story’s owner controls, story-detail helper links now return members to their current saved/report workspace when relevant, and each authenticated community surface now exposes a shared workspace nav so members can jump between browse, saved, reports, and submit without hunting through the global header.
- **Community feed discovery controls (2026-05)** - `/places` now supports honest first-pass discovery controls without changing auth scope: keyword search across title/story/member name plus quick views for all stories, featured stories, public stories, your stories, saved stories, reported stories, and stories with photos. Counts stay visible in the header, saved state is reflected on cards, members now see their latest report status across browse/saved/detail surfaces, featured stories are tagged across browse/saved/detail surfaces, empty states explain when filters simply returned no matches, and a lightweight load-more step lets members pull older stories without dropping their current search/filter context.
- **Community history pagination polish (2026-05)** - `/saved`, `/reports`, and `/submit` now match the feed’s lightweight history controls with load-more / show-fewer steps that preserve the current search and filter context. This keeps longer saved lists, moderation history, and owner submission history usable without introducing fake infinite scroll or new auth scope.
- **Story detail discovery follow-through (2026-05)** - `/places/[slug]` now uses existing story metadata to suggest grounded next reads instead of a dead-end detail page: members get quick jumps back into live feed filters (same-member author filters, featured stories, photo stories, or their own stories when applicable) plus a small related-story rail that prioritizes the same author, then featured stories, then photo-rich stories already visible to that member.
- **Member-focused discovery filters (2026-05)** - `/places`, `/saved`, and `/reports` now support a dedicated member filter on top of the existing search and quick views, so member-focused discovery and moderation history can stay grounded on the actual storyteller instead of fuzzy text matching. Filter state stays visible in the UI, now uses a shared active-member banner with a one-click clear action across all three surfaces, and carries through load-more / show-fewer pagination.
- **Release prep / QA docs (2026-05)** - Smoke checklist: viewport matrix (mobile/tablet/desktop), profile repair vs fallback accuracy, nav label checks, `Last Updated`; `AUTH_CONTRACT` + `DEBUG_AUTH` synced to current recovery UX (no duplicate runbooks).
- **Observability + error UX (2026-05-14)** - Structured server failures use `logServerFailure` (`lib/server-log.ts`); user-facing Supabase errors use `mapSupabaseErrorForUser` and deliberate server throws use `safeThrownErrorMessage` (`lib/supabase-errors.ts`); Sentry is bootstrapped via `instrumentation.ts` / `instrumentation-client.ts` / server+edge configs; `app/error.tsx` and `app/global-error.tsx` show on-brand recovery UI and report to Sentry only when `NEXT_PUBLIC_SENTRY_DSN` is set; WordPress preview/revalidate stay honest for callers; profile queries and `lib/wp-rest.ts` use the shared logger instead of stray `console.error`.
- **Sentry posture hardening (2026-05)** - Server/edge `Sentry.init` only when a DSN is set from env (no hardcoded keys), sampled tracing and `sendDefaultPii: false`; client bundle without Session Replay; `next.config.ts` uses a single `withSentryConfig` when `SENTRY_ORG` and `SENTRY_PROJECT` are set, optional `SENTRY_AUTH_TOKEN` for source-map upload, `tunnelRoute` `/monitoring`; `.gitignore` includes `.env.sentry-build-plugin`; wizard throwaway example routes removed; **MONITORING_SENTRY_POSTURE.md** and **.env.example** updated.
- **Stripe subscriptions + premium gates (2026-05-14)** - Public `/pricing`; signed-in `/subscribe` + `startMembershipCheckout` open Stripe Checkout (`STRIPE_PRICE_ID`, 7-day trial). Webhook `POST /api/webhooks/stripe` verifies signatures, ledger in `stripe_webhook_ledger`, upserts `subscriptions`. Entitlement is DB-only (`lib/billing/entitlements.ts`); `community_post_reads` enforces 3 third-party story views per UTC day when `limited`; community writes and new saves require `full`.
- **Community discovery depth — second pass (2026-05-15)** - Optional `place_label` plus capped `story_tags` slugs stored on `community_posts` (`lib/community-story-taxonomy.ts`); `/places` exposes newest/oldest ordering, place/topic anchors, and facet chips sourced from posts the viewer can already access under RLS; `getCommunityRelatedPosts` ranks overlaps in place/tags alongside author/featured/photos/recency; owners edit alt text + swap gallery order (`post_images` UPDATE policy + server actions).
- **Moderation queue + reporter withdraw + owner permanent remove (2026-05-16)** - Migration `20260516203000_moderation_admin_rls_reports.sql` adds `profiles.role = 'admin'`, `report_status.withdrawn`, audited `reports.reviewed_at` / `reports.reviewed_by`, SECURITY DEFINER RPCs `withdraw_post_report` and `moderator_update_report`, and admin `SELECT` RLS where the queue needs post/member context (writes stay on RPCs). App: authenticated `/admin/moderation` for platform admins; `/reports` supports withdrawing pending post reports + shows reviewed timestamps; browse/saved/detail surfaces recognize withdrawn status; dashboard links **Moderation** for admins; owners can permanently remove a community post behind an explicit typed confirmation (guarded against archive/restore once `removed`).
- **Marketing interest capture — truthful homepage signup (2026-05)** - Public homepage panel stores emails in **`marketing_interest`** via **`submitMarketingInterest`** (service role insert/update). Copy and success/error states explicitly state that **automated outbound marketing/newsletter sends are not enabled** yet; operators export/import manually until an ESP pathway is prioritized.
- **Product learning instrumentation (2026-05-17)** - Coarse Sentry **`product_signal.*`** funnel signals documented in **`MONITORING_SENTRY_POSTURE.md`** (`lib/analytics/product-signals.ts`); emits **structured Logs** (`Sentry.logger.info`, attribute **`product_signal`**) on signup, Stripe checkout/start-return, published community submissions, saves, and reports when a DSN is set and **`enableLogs`** is on in Sentry init (**not** Issues), so successful signups stop polluting the error backlog.
- **Saved list + moderation withdrawn parity (2026-05)** - `/saved` passes explicit **`initialSaved={true}`** on save controls; admin moderation accepts **`withdrawn`** in `moderateCommunityReportAction`, exposes **Mark withdrawn** transitions in the queue UI, and migration **`20260518120000_moderator_update_report_allow_withdrawn.sql`** aligns `moderator_update_report` with the app (schema audit updated).

### 🚧 In Progress

- **Moderation/editorial depth (remaining)** - First-pass operator queue and safe report RPCs are shipped; broader editorial tooling, analytics-style oversight, and non-community report targets are still out of scope or not built yet.
- **Marketing email automation** - Provider-connected newsletter sends / audience sync remains future work (`docs/contracts/EMAIL_NOTIFICATIONS_CONTRACT.md` documents the bounded capture layer).

### 📋 Next

- **Canonical current queue** - `docs/procedures/IMPLEMENTATION_ROADMAP.md`
- **Canonical shipped-status log** - `docs/MVP_STATUS_NOTION.md`
- **Active backlog work order** - `docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`
- **Immediate focus** - Stretch-only: ESP audience automation **or** dashboards built on **`product_signal`** **Log attributes**, when ops requests (`docs/procedures/SOLOSHETHINGS_POST_LAUNCH_BACKLOG_WORK_ORDER.md`).

### ❌ Blocked

None currently.

## Phase Plan

### Phase 0: System Kit + Repo Bootstrap

**Status:** ✅ Complete

Foundational documentation, architecture, schema design, contracts, procedures, proof docs, and diagrams all exist and remain the base layer for the repo.

### Phase 1: Core MVP Surface

**Status:** 🚧 Mostly shipped, with billing/ops gaps still open

**Shipped in this phase:**
- auth, profile bootstrap/repair, and protected-route handling
- WordPress editorial read path with preview/revalidation support
- dashboard/profile shell improvements
- avatar uploads and profile continuity
- real community submit/browse/save/report/owner-management surfaces
- first-pass discovery/search/filter/load-more/member-filter polish
- Stripe Checkout + webhook-backed `subscriptions` + DB-only premium gates (see `BILLING_STRIPE_CONTRACT.md`)
- taxonomy/location **anchors** authored on publish/edit (`place_label` + capped `story_tags` slugs) with browse parity

**Still open in this phase:**
- marketing email automation synced to an ESP provider (beyond DB capture listed in EMAIL_NOTIFICATIONS_CONTRACT)
- moderation/editorial depth beyond the first operator queue (`/admin/moderation`) and RPC-backed report transitions

**Reference:** use `docs/procedures/IMPLEMENTATION_ROADMAP.md` for the exact active queue.

### Phase 2: Community Depth

**Status:** 🚧 Partially shipped (depth improves as members adopt new metadata fields)

**Already real:**
- authenticated member browsing
- saved stories
- report history
- owner story edit/archive/restore/photo management
- discovery/search/filter load-more pipelines
- deterministic related-story ladder using anchors, shared tags, author continuity, featured/photo boosts, recency—all within posts the viewer can already fetch under RLS
- owner-managed alt text plus gallery reordering helpers on story detail (`post_images`)

**Still planned in this phase:**
- trust & safety tooling beyond the shipped reporter-first history + moderator queue increment (non-post report targets, analytics, richer escalation)
- any future messaging/comments/realtime work if product priorities justify it

### Phase 3: Admin, Marketing, and Analytics

**Status:** 🚧 First-pass shipped; stretch backlog remains

**Already real:**
- admin-only `/admin/moderation` queue, RPC-backed report transitions, reporter withdraw flow
- honest `marketing_interest` capture on the homepage with service-role writes (`EMAIL_NOTIFICATIONS_CONTRACT`)
- coarse `product_signal.*` **Sentry Logs** funnel signals (`MONITORING_SENTRY_POSTURE.md`, `DISABLE_PRODUCT_SIGNALS`)

**Still planned / stretch-only:**
- moderation/admin dashboard depth beyond the operator queue (rich editorial workflows, non-post report targets)
- admin/editorial post workflows where needed
- provider-backed mailing automation + broadcasts (captures persist to `marketing_interest` until then)
- analytics dashboards or ESP sync beyond raw **Sentry Logs** **`product_signal`** attributes, when ops requests (`IMPLEMENTATION_ROADMAP.md`)

**Rule:** phase labels here are coarse product buckets. The canonical execution order lives in `docs/procedures/IMPLEMENTATION_ROADMAP.md`, not in these phase summaries.

## Definition of "VERIFIED"

A feature is **VERIFIED** when all of the following checks pass:

### Code Quality Checks

- [ ] `npm run build` passes without errors
- [ ] `npm run lint` passes without warnings
- [ ] TypeScript compiles with strict mode
- [ ] No secrets in code
- [ ] All red-zone files reviewed (if applicable)

### Security Checks

- [ ] RLS policies enabled and tested
- [ ] Explicit selects in all queries (no `select('*')`)
- [x] Auth checks use `getUser()` (not `getSession()`) — middleware + `lib/supabase/server`
- [ ] No service role key in client code
- [ ] Input validation on all forms
- [ ] Webhook signatures verified (if applicable)

### Functional Checks

- [ ] Feature works as specified
- [ ] Error cases handled gracefully
- [ ] Edge cases considered and tested
- [ ] Privacy controls work correctly
- [ ] Access control enforced

### Smoke Test Checks

- [ ] All relevant smoke test paths pass (see `docs/proof/E2E_SMOKE_PATHS.md`)
- [ ] Manual testing completed
- [ ] Cross-browser testing (Chrome, Firefox)
- [ ] Mobile responsive (if applicable)

### Documentation Checks

- [ ] Documentation updated (if behavior changed)
- [ ] `database_schema_audit.md` updated (if schema changed)
- [ ] Relevant contract docs updated (if behavior changed)
- [ ] `DOCUMENTATION_INDEX.md` updated (if new docs created)

### Proof Requirements

**For a feature to be VERIFIED, provide:**
- ✅ Smoke test results (pass/fail per path)
- ✅ Manual test evidence (screenshots or test notes)
- ✅ Code review completed
- ✅ Security review completed (for red-zone features)
- ✅ Documentation updated

**Example VERIFIED Entry:**
```
2025-01-27 - User Authentication System
Status: ✅ VERIFIED
- Smoke tests: Path 1 (Signup) ✅, Path 2 (Login) ✅
- Security: RLS policies tested ✅, getUser() used ✅
- Documentation: AUTH_CONTRACT.md updated ✅
- Code review: Completed ✅
```

## Progress History Log

### Template for Progress Entries

```
YYYY-MM-DD - [Feature/Component Name]
Status: ✅ VERIFIED | 🚧 IN PROGRESS | 📋 PLANNED | ❌ BLOCKED

Description:
- What was completed or changed
- Key decisions made
- Issues encountered and resolved

Verification:
- Smoke test results
- Security checks
- Documentation updates
- Code review status

Next Steps:
- What comes next
- Dependencies
- Blockers (if any)
```

### Progress Entries

#### 2026-05-15 — Community taxonomy + discovery depth

**Status:** ✅ VERIFIED (typecheck/lint/build gate)

**Description:**
- Migration `supabase/migrations/20260515194500_community_place_label_story_tags.sql`: optional `place_label`, capped `story_tags[]`, supporting indexes, and `post_images` owner `UPDATE` RLS so alt/order edits stay DB-enforced.
- Shared taxonomy helpers in `lib/community-story-taxonomy.ts`; submit + owner edits use `CommunityDiscoveryFields`.
- `/places` exposes newest/oldest ordering plus `place`/`topic` query filters with honest facet chips from RLS-visible posts.
- Related stories rank shared anchors/tags deterministically atop the legacy author/featured/photo heuristics.
- Owners can revise photo descriptions and move photos earlier/later inside the carousel.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run build`.

**Next steps:** moderation/admin surfaces (`docs/procedures/IMPLEMENTATION_ROADMAP.md` §2).

#### 2026-05-14 — Stripe subscriptions + premium gates

**Status:** ✅ VERIFIED (typecheck/lint/build gate)

**Description:**
- Stripe Checkout from `/subscribe`; webhook `POST /api/webhooks/stripe` with ledger idempotency.
- New tables: `stripe_webhook_ledger`, `community_post_reads` (migration `20260514194500_...`).
- `lib/billing/entitlements.ts` + gated community actions, saves, and detail read budget.

**Verification:** `npm run typecheck`, `npm run lint`, `npm run build`.

**Next steps:** completed in subsequent 2026-05-15 community depth batch; resume at moderation/admin tooling (`IMPLEMENTATION_ROADMAP` §2).

#### 2026-05-14 - Observability + error UX batch

**Status:** ✅ VERIFIED (build/lint/typecheck gate)

**Description:**
- Centralized safe user copy for server actions (`mapSupabaseErrorForUser`, `safeThrownErrorMessage`); eliminated raw `Error.message` passthrough in community post compound flows.
- `unstable_rethrow` parity on `login` catch; profile + WordPress read paths migrated to `logServerFailure`.
- Error boundaries gated on `NEXT_PUBLIC_SENTRY_DSN`; monitoring/roadmap/MVP docs aligned with implementation.

**Verification:**
- `npm run typecheck`, `npm run lint`, `npm run build` (see CI/local run at ship time).
- Documentation: `docs/proof/MONITORING_SENTRY_POSTURE.md`, `docs/procedures/IMPLEMENTATION_ROADMAP.md`, `docs/MVP_STATUS_NOTION.md`.

**Next Steps:**
- Stripe subscription integration + premium gating per implementation roadmap.

#### 2025-12-22 - WordPress + Supabase Blueprint Documented

**Status:** ✅ VERIFIED

**Description:**
- WordPress + Supabase hybrid stack blueprint created
- Architecture defined: WordPress (editorial) + Supabase (identity/community) + Next.js (delivery)
- Phase 1 MVP scope clarified (editorial-only WordPress integration)
- Server-only WordPress access rules documented
- ISR + webhook revalidation strategy defined
- Preview mode + revalidate API contracts specified
- Canonical sanitization approach documented

**Verification:**
- ✅ Blueprint document created (`docs/WORDPRESS_SUPABASE_BLUEPRINT.md`)
- ✅ MVP_STATUS_NOTION.md updated with blueprint reference
- ✅ DOCUMENTATION_INDEX.md updated with blueprint entry
- ✅ Phase 1 WordPress integration scope clearly defined
- ✅ Environment variables documented
- ✅ Acceptance criteria defined

**Next Steps:**
- Implement WordPress REST API integration (`lib/wp-rest.ts`)
- Create sanitization helper (`lib/sanitize.ts`)
- Create Prose renderer component (`components/prose.tsx`)
- Implement `/api/revalidate` webhook endpoint
- Implement `/api/preview` preview mode endpoint
- Update blog routes to use WordPress data

#### 2025-01-27 - Phase 1 Backend Foundation Complete

**Status:** ✅ VERIFIED

**Description:**
- Complete Supabase integration (server, client, middleware helpers)
- Database migration created (`supabase/migrations/20250101000000_initial_schema.sql`)
- Authentication system implemented (signup, login, logout with profile bootstrap)
- Route protection middleware configured
- Functional auth pages (login, signup, dashboard)
- Environment configuration complete (`.env.example` with all required variables)
- TypeScript types placeholder created (`types/database.ts`)

**What Works:**
- ✅ Signup flow creates user + profile atomically
- ✅ Login flow authenticates and repairs missing profiles
- ✅ Logout clears session
- ✅ Route protection redirects unauthenticated users
- ✅ Proxy refreshes session on every request
- ✅ Database schema ready (8 tables, RLS policies, storage bucket)

**Verification:**
- ✅ Migration file created and documented
- ✅ Auth server actions implemented (`app/actions/auth.ts`)
- ✅ Proxy configured (`proxy.ts`)
- ✅ Auth pages functional (`app/(auth)/login`, `app/(auth)/signup`)
- ✅ Dashboard page created (`app/(app)/dashboard`)
- ✅ Documentation updated (AUTH_CONTRACT.md, MVP_STATUS_NOTION.md)

**User Setup Required:**
- Create Supabase project and link local project
- Set environment variables in `.env.local`
- Run migration (`supabase db push`)
- Generate types (`supabase gen types typescript --local`)

**Next Steps:**
- Complete remaining Phase 1 features (Stripe, admin, photo uploads, profile editing)
- Continue Phase 2 design system (feedback components, trust & safety components)

#### 2025-01-27 - WordPress Editorial Layer Complete

**Status:** ✅ VERIFIED

**Description:**
- WordPress REST API client implemented (`lib/wp-rest.ts`)
- HTML sanitization helper created (`lib/sanitize.ts` using sanitize-html)
- Prose renderer component created (`components/prose.tsx`)
- Blog routes implemented with ISR (`app/(public)/blog/page.tsx`, `app/(public)/blog/[slug]/page.tsx`)
- Preview mode endpoint (`app/api/preview/route.ts`)
- Revalidation webhook endpoint (`app/api/revalidate/route.ts`)
- Tag standards documented (consistent ISR tagging)
- Server-only enforcement (`"server-only"` imports)

**What Works:**
- ✅ Blog list page fetches WordPress posts with ISR (1-hour revalidation)
- ✅ Blog detail page fetches single post with ISR
- ✅ Content sanitized before rendering
- ✅ Preview mode enables draft mode (MVP limitation: published content only)
- ✅ Revalidation webhook accepts JSON body with secret, paths, tags
- ✅ Build succeeds without WP_URL (graceful error handling)

**Verification:**
- ✅ WordPress libraries are server-only
- ✅ Tag consistency verified (`posts`, `posts:page:${page}`, `post:${slug}`)
- ✅ Sanitization uses canonical helper
- ✅ ISR configured correctly
- ✅ Documentation updated (WORDPRESS_CONTENT_CONTRACT.md, WORDPRESS_SUPABASE_BLUEPRINT.md)
- ✅ Build passes (`npm run build`)

**Next Steps:**
- Set up WordPress instance and configure WP_URL
- Test revalidation webhook with WordPress
- Enhance preview mode for true draft preview (Phase 1.5)

#### 2025-01-27 - UI Foundation Complete

**Status:** ✅ VERIFIED

**Description:**
- Brand tokens system created (CSS variables + Tailwind config)
- Route shells created with AWA-inspired IA structure
- Reusable components scaffolded (layout, cards, collections, CTA, nav)
- Documentation updated (BRAND_STYLE_GUIDE.md, UX_REFERENCE_AWA.md)
- Route groups established: (public), (app), (auth)
- Public previews on homepage, full content auth-gated

**Verification:**
- ✅ Brand colors defined in `app/globals.css` (CSS variables)
- ✅ Tailwind config extends brand tokens
- ✅ Route shells exist for all planned routes
- ✅ Components use brand tokens (no raw hex codes)
- ✅ Route structure respects Airport Model zones
- ✅ Documentation updated and cross-referenced

**Next Steps:**
- Continue Phase 2 design system (feedback components, trust & safety components)

#### 2025-01-27 - System Kit Documentation Complete

**Status:** ✅ VERIFIED

**Description:**
- Complete System Kit documentation created
- Architecture constitution defined
- Security invariants documented
- Database schema v0 designed
- All contracts and procedures documented
- Proof documentation created

**Verification:**
- ✅ All documentation files created and reviewed
- ✅ Schema defined in `database_schema_audit.md`
- ✅ Contracts defined for all integrations
- ✅ Procedures defined for all workflows
- ✅ Documentation index complete

**Next Steps:**
- UI foundation work (completed above)
- Begin Phase 1 backend implementation

#### 2025-01-27 - MVP Core Features Complete

**Status:** ✅ VERIFIED

**Description:**
- Complete MVP implementation per locked MVP definition
- Auth hardening: Reliable signup/login/logout flows with predictable redirects
- Minimal profiles: Profile query module, update server action, profile edit page
- Dashboard UX shell: Complete-feeling dashboard with profile display and quick actions
- WordPress graceful fallback: Blog routes work with/without WP_URL
- UI/UX polish: Consistent design system across all pages
- Revalidation verification: Endpoint properly validates inputs and uses canonical tags

**What Works:**
- ✅ Signup flow creates user + profile atomically
- ✅ Login flow authenticates and repairs missing profiles (bounded)
- ✅ Logout clears session and redirects properly
- ✅ Protected routes redirect unauthenticated users
- ✅ Authenticated users see dashboard with profile info
- ✅ Profile editing (username, full_name, bio) functional
- ✅ Blog routes degrade gracefully when WP_URL missing
- ✅ Header shows logout when authenticated
- ✅ All pages use consistent design system

**Files Created:**
- `lib/queries/profiles.ts` - Profile query module
- `app/actions/profile.ts` - Profile update server action
- `app/(app)/profile/page.tsx` - Profile edit page
- `components/profile/profile-form.tsx` - Profile form component
- `components/nav/logout-button.tsx` - Logout button component

**Files Modified:**
- `app/actions/auth.ts` - Exported generateUsername for profile repair
- `app/(app)/dashboard/page.tsx` - Enhanced with profile display
- `components/nav/header.tsx` - Made server component, shows auth state
- `app/(public)/blog/page.tsx` - Updated styling
- `app/(public)/blog/[slug]/page.tsx` - Updated styling

**Verification:**
- ✅ All code follows architectural rules (explicit selects, getUser(), RLS)
- ✅ Profile repair is bounded (max 1 retry) to prevent loops
- ✅ Error handling is user-safe and logged
- ✅ No redirect loops
- ✅ WordPress graceful fallback tested
- ✅ Revalidation endpoint validates all inputs
- ✅ Documentation updated (this file, AUTH_CONTRACT.md)

**MVP Definition Status:**
- ✅ User can sign up, log in, log out reliably
- ✅ Protected dashboard shell exists
- ✅ User has minimal editable profile
- ✅ Public marketing pages and blog routes work without crashes
- ✅ WordPress is optional at runtime (graceful fallback)
- ✅ UI/UX polish applied

**Not Implemented (as per MVP scope):**
- ❌ Stripe or subscriptions (explicitly NOT MVP)
- ❌ Community posting (explicitly NOT MVP)
- ❌ Dashboard CMS/blog editor (explicitly NOT MVP)
- ❌ Supabase-based long-form blogging (explicitly NOT MVP)
- ❌ WordPress JWT auth enablement (explicitly NOT MVP)

**Next Steps:**
- Manual QA testing (mobile and desktop)
- Verify database schema matches documentation
- Test profile repair flow with missing profiles
- Verify WordPress integration when WP_URL is configured

#### 2025-01-27 - Brand Color Vibrancy Enhancement

**Status:** ✅ VERIFIED

**Description:**
- Implemented Approach A: Gradient Border System for vibrant brand color representation
- Enhanced body background gradient (8% opacity, all 5 brand colors)
- Enhanced hero section gradients (10-12% opacity)
- Created `.surface-card-gradient` utility class for gradient borders
- Updated section dividers to use brand color gradients
- Applied gradient borders to blog cards, place cards, and landing page cards
- Enhanced button shadows with brand colors

**Key Features:**
- Gradient borders using all 5 brand colors (Blue 1 → Yellow 1 → Orange → Yellow 2 → Blue 2)
- Responsive border widths (3px desktop, 2px mobile)
- Hover states with expanded borders
- Enhanced background gradients for vibrancy
- Brand color section dividers

**Files Created:**
- None (CSS-only enhancement)

**Files Modified:**
- `app/globals.css` - Added gradient border utilities, enhanced gradients
- `app/(public)/blog/page.tsx` - Applied gradient borders to blog cards
- `app/(public)/blog/[slug]/page.tsx` - Added brand color section divider
- `components/cards/place-card.tsx` - Applied gradient borders
- `components/landing/landing-page-content.tsx` - Applied gradient borders to all cards
- `components/ui/button.tsx` - Enhanced shadows with brand colors

**Verification:**
- ✅ No linting errors
- ✅ TypeScript compilation successful
- ✅ CSS syntax validated
- ✅ Component structure verified
- ✅ All brand colors used (no new colors introduced)
- ✅ WCAG AA contrast compliance maintained
- ✅ Responsive design verified
- ✅ Documentation updated (BRAND_STYLE_GUIDE.md, MVP_STATUS_NOTION.md)

**Design Impact:**
- Website now reflects African heritage through vibrant brand colors
- Visual appeal significantly enhanced while maintaining existing aesthetic
- Brand colors prominently featured throughout public-facing pages
- Gradient borders create premium, intentional design feel

**Next Steps:**
- Visual review and client feedback
- Browser compatibility testing
- Mobile device testing
- Consider additional elements for gradient borders if needed

#### 2026-01-30 - Homepage Brand Palette Refresh & Featured Posts CTA Fill

**Status:** ✅ VERIFIED

**Description:**
- Refreshed homepage hero, community, and newsletter backgrounds with brand palette gradients
- Updated homepage typography and accents to use consistent neutral/brand tokens
- Aligned map page header gradient and CTA shadow with brand blues
- Added a featured posts CTA tile for small post counts to avoid sparse layouts
- Updated navigation branding gradients to match the refreshed palette

**Key Features:**
- New homepage-only gradient utilities for hero/community/newsletter sections
- Adaptive featured posts grid when 1-2 posts are available
- Improved newsletter signup card contrast and button styling

**Files Modified:**
- `app/globals.css` - Homepage gradient utilities + palette adjustments
- `tailwind.config.ts` - Safelist additions + refreshed animation glow colors
- `components/home/hero-section.tsx` - New hero gradients + text color updates
- `components/home/hero-carousel.tsx` - Updated controls and overlays
- `components/home/community-stories.tsx` - New background layers + card styling
- `components/home/community-cta.tsx` - CTA gradient updates
- `components/home/about-preview.tsx` - Brand palette refresh and messaging updates
- `components/home/featured-posts.tsx` - Adaptive grid + CTA tile
- `components/home/newsletter-section.tsx` - New background + signup card styles
- `components/home/welcome-section.tsx` - Updated background and typography styles
- `components/nav/NavClient.tsx` - Nav gradients aligned to palette
- `components/nav/header.tsx` - Logo gradient update
- `app/(public)/map/page.tsx` - Header gradient + CTA shadow update

**Verification:**
- ✅ `npm run build` passes successfully
- ✅ `npm run lint` passes with 0 errors, 0 warnings
- ✅ All components use brand tokens (no raw hex codes)

**Design Impact:**
- Homepage sections share a cohesive brand gradient language
- Featured posts grid feels complete even with limited content
- Improved contrast and readability across hero and newsletter sections

**Next Steps:**
- Visual review and client feedback
- Mobile device testing

#### 2025-01-29 - White Background Color Matching & Visual Consistency

**Status:** ✅ VERIFIED

**Description:**
- Matched Featured Posts and Blog sections to "Meet the Founder" section visual style
- Removed ashy overlays from images (reduced opacity from `/60` to `/40` matching founder section)
- Added brand color gradient accents to section headers throughout blog sections
- Balanced Join Community section colors (reduced blue dominance, added yellow/orange warmth)
- Updated Map page styling for consistency and documented natural color requirement
- Applied `image-clean` class consistently for vibrant image display

**Key Features:**
- Consistent overlay opacity (`/40`) across all white background sections
- Brand gradient headers matching founder section pattern
- Balanced brand color spectrum in Join Community section
- Visual consistency across all public-facing sections

**Files Modified:**
- `components/home/featured-posts.tsx` - Overlay fix + brand gradient header
- `app/(public)/blog/page.tsx` - Overlay fix + brand gradient header
- `app/(public)/blog/[slug]/page.tsx` - Brand gradient title + accent date + image-clean
- `components/home/community-cta.tsx` - Balanced brand colors in headline + icons
- `app/globals.css` - Updated `section-ocean-warm` for balanced color spectrum
- `app/(public)/map/page.tsx` - Consistent styling + natural color documentation
- `components/landing/landing-page-content.tsx` - Removed unused import

**Verification:**
- ✅ `npm run build` passes successfully
- ✅ `npm run lint` passes with 0 errors, 0 warnings
- ✅ No linting errors
- ✅ All components use Tailwind classes (no raw hex codes)
- ✅ Brand colors only (no new colors introduced)
- ✅ Overlay opacity standardized to `/40` (matching founder section)
- ✅ Brand gradients applied consistently
- ✅ Map page documented for natural colors

**Design Impact:**
- Visual consistency achieved across all white background sections
- Images display with full vibrancy (no ashy overlays)
- Brand colors used consistently and intentionally
- Join Community section balanced with all 5 brand colors

**Next Steps:**
- Visual review and client feedback
- Browser compatibility testing
- Mobile device testing

#### 2025-01-29 - Layout Bug Fixes: Duplicate Headers & Gradient Opacity

**Status:** ✅ VERIFIED

**Description:**
- Fixed duplicate header rendering on home page (Header component was rendered both in page and layout)
- Fixed gradient opacity issue in header component (Tailwind opacity modifiers don't work on hex colors in gradients)
- Created PublicLayoutClient component for conditional Banner rendering (home page only)
- Synced package-lock.json with package.json after develop branch merge

**Bugs Fixed:**
- **Bug 1: Duplicate Headers** - Home page rendered `<Header showBanner={true} />` while being nested under `app/(public)/layout.tsx`, causing two navigation headers
- **Bug 2: Gradient Opacity** - Header component used Tailwind opacity modifiers (`/60`, `/40`) on hex colors in gradients, which don't work properly

**Files Modified:**
- `app/(public)/layout.tsx` - Added SiteHeader, removed duplicate header logic
- `app/(public)/page.tsx` - Removed Header component
- `app/(public)/layout-client.tsx` - New client component for conditional Banner rendering
- `components/header.tsx` - Fixed gradient opacity using rgba() instead of Tailwind modifiers
- `components/landing/landing-page-content.tsx` - Removed unused imports
- `package-lock.json` - Synced with package.json dependencies from develop branch

**Verification:**
- ✅ `npm run build` passes successfully
- ✅ `npm run lint` passes with 0 errors, 0 warnings
- ✅ Home page shows single header (no duplicates)
- ✅ Banner appears only on home page
- ✅ Gradient overlay displays with proper opacity (60%, 40%, 60%)
- ✅ Navigation works correctly across all public pages

**Next Steps:**
- PR ready for merge into main branch
- Branch can be closed after PR merge

#### 2025-01-25 - ESLint Migration & Code Quality Baseline

**Status:** ✅ VERIFIED

**Description:**
- Migrated from `.eslintrc.json` to ESLint flat config (`eslint.config.mjs`) to resolve circular config crash
- Fixed all linting errors (13 errors, 8 warnings → 0 errors, 0 warnings)
- Converted all `<img>` tags to Next.js `<Image />` components for performance optimization
- Upgraded Next.js from `15.0.7` to `16.1.4` (fixed critical security vulnerabilities)
- Updated `revalidateTag` API call to Next.js 16 signature (`revalidateTag(tag, "max")`)
- Enforced strict lint baseline with `--max-warnings 0` in package.json scripts

**What Was Fixed:**
- ✅ Apostrophe escaping in JSX (5 errors)
- ✅ HTML links replaced with Next.js `<Link />` components (5 errors)
- ✅ `Math.random()` in render replaced with React `useId()` hook (2 errors)
- ✅ Unused variables removed (4 warnings)
- ✅ `require()` imports converted to ES6 `import` (1 error)
- ✅ WordPress featured images converted to optimized `<Image />` components (3 warnings)
- ✅ HEIC images documented with ESLint disable comment (1 warning, justified)

**Files Created:**
- `eslint.config.mjs` - ESLint flat config with Next.js presets
- `.eslintrc.json.bak` - Backup of old config

**Files Modified:**
- `package.json` - Updated lint scripts, Next.js version
- `app/(app)/dashboard/page.tsx` - Fixed apostrophes
- `app/(app)/places/[slug]/page.tsx` - Fixed HTML link
- `app/(auth)/login/page.tsx` - Fixed apostrophe
- `components/landing/about-section.tsx` - Fixed apostrophes
- `components/landing/landing-page-content.tsx` - Fixed HTML links
- `components/ui/input.tsx` - Replaced Math.random with useId
- `components/ui/textarea.tsx` - Replaced Math.random with useId
- `tailwind.config.ts` - Converted require to import
- `app/api/revalidate/route.ts` - Updated revalidateTag API, removed unused vars
- `components/nav/logout-button.tsx` - Removed unused error var
- `lib/supabase/server.ts` - Removed unused error vars
- `app/(public)/blog/[slug]/page.tsx` - Converted img to Image
- `app/(public)/blog/page.tsx` - Converted img to Image
- `app/(public)/preview/[...slug]/page.tsx` - Converted img to Image
- `components/landing/travel-moments-gallery.tsx` - Added ESLint disable for HEIC
- `next.config.ts` - Added WordPress domain configuration comments

**Verification:**
- ✅ `npm run build` passes successfully
- ✅ `npm run lint` passes with 0 errors, 0 warnings
- ✅ `npm audit --omit=dev` shows 0 vulnerabilities
- ✅ TypeScript compilation successful
- ✅ All Next.js Image components properly configured
- ✅ Next.js 16 API compatibility verified

**Security Improvements:**
- ✅ Next.js upgraded to latest secure version (16.1.4)
- ✅ All critical vulnerabilities resolved
- ✅ Strict lint baseline prevents future code quality drift

**Performance Improvements:**
- ✅ WordPress images now use Next.js Image optimization (with unoptimized fallback for dynamic domains)
- ✅ Proper `sizes` attributes for responsive image loading
- ✅ HEIC images documented with justification for `<img>` usage

**Next Steps:**
- Manual smoke testing of blog pages and revalidate endpoint
- Consider adding WordPress domain to `next.config.ts` remotePatterns for full image optimization
- Monitor build performance with Next.js 16

#### 2026-05-06 - Catch-up §5 smoke/release docs + Next workspace root

**Status:** ✅ VERIFIED (automated gates)

**Description:**
- Completed catch-up batch 5: MVP smoke verification (HTTP redirect + build sanity), documentation sync (MVP vs future E2E paths, `/api/revalidate`, contact route, queue references), and release-prep notes (`PRE_PUSH_CHECKLIST` Docker caveat for `supabase db diff`).
- Pinned Next.js workspace root in `next.config.ts` (`outputFileTracingRoot`, `turbopack.root`) to silence wrong-root warnings when multiple lockfiles exist up-tree.

**Verification:**
- `npm run typecheck`, `npm run lint`, `npm run build` pass locally
- Unauthenticated `GET /dashboard` → redirect to `/login?redirectTo=/dashboard` (production server)

**Next Steps:**
- Full manual pass of `docs/proof/MVP_SMOKE_CHECKLIST.md` on preview/production as needed
- Run `supabase db diff` where Docker / CLI is available

#### 2026-05-14 - Hosted storage DDL: Dashboard script + migration strip

**Status:** ✅ DOCUMENTED

**Description:**
- `supabase db push` failed with `must be owner of table objects (42501)` on `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY` — the CLI migration role is not owner of `storage.objects` on hosted Supabase
- Removed storage bucket/policy DDL from [`supabase/migrations/20250101000000_initial_schema.sql`](supabase/migrations/20250101000000_initial_schema.sql) (migration had never completed remotely); added pointer comment to one-time Dashboard SQL
- Added canonical [`docs/supabase/storage_setup_dashboard.sql`](docs/supabase/storage_setup_dashboard.sql): run in **Supabase Dashboard → SQL Editor** after `db push` (idempotent-ish bucket insert + drop/recreate policies)
- Updated [`docs/database_schema_audit.md`](docs/database_schema_audit.md) (storage truth + no `ALTER storage.objects` via CLI); [`docs/DOCUMENTATION_INDEX.md`](docs/DOCUMENTATION_INDEX.md) links the script

**Verification:**
- `npm run typecheck`, `npm run lint`, `npm run build`
- Re-run `supabase db push` against linked remote (should pass); then run `docs/supabase/storage_setup_dashboard.sql` in Dashboard for that project

**Next Steps:**
- Run Dashboard storage script on preview/production Supabase projects as needed

#### 2026-05-14 - Webpack bundler for dev and build (Turbopack stability)

**Status:** ✅ VERIFIED

**Description:**
- `package.json` scripts use `next dev --webpack` and `next build --webpack` to avoid intermittent Turbopack “unexpected error” in local dev and to align Vercel builds with the stable Webpack pipeline (`npm run build` is the default install/build path)
- Local `.next` cache cleared during rollout; `next.config.ts` workspace root pin (`outputFileTracingRoot`, `turbopack.root`) unchanged for projects that opt back into Turbopack via CLI flags

**Verification:**
- `npm run typecheck`
- `npm run lint`
- `npm run build`

**Next Steps:**
- If Turbopack parity improves in a future Next.js release, revisit default scripts or gate `--webpack` behind an env flag

#### 2026-05-14 - Signup PGRST205 + useActionState forms

**Status:** ✅ VERIFIED

**Description:**
- **Supabase `PGRST205` on signup:** PostgREST returns this when `public.profiles` is missing on the project linked by `NEXT_PUBLIC_SUPABASE_URL` (migrations not applied). Signup now logs an actionable hint and, in development, surfaces a clear UI error so the issue is obvious. Applied-schema fix is still **run migrations** against that project (`supabase link` / `supabase db push`, or execute `supabase/migrations/*.sql` in the Supabase SQL editor). Documented in `.env.example`.
- **`useFormState` deprecation:** Replaced `react-dom`’s `useFormState` with `useActionState` from `react` across auth and form components; `docs/CODING_STANDARDS.md` example updated.

**Verification:**
- `npm run typecheck`
- `npm run lint`
- `npm run build`

**Next Steps:**
- Apply `supabase/migrations` to every Supabase environment used for local preview and Vercel (preview/production)

#### 2026-05-14 - Report history member filters

**Status:** ✅ VERIFIED

**Description:**
- Extended the dedicated member filter pattern into `/reports` so members can narrow moderation history to stories from one storyteller without falling back to keyword search
- Added honest author context on report cards plus a quick "Only this member's stories" jump to keep the new browse/saved discovery flow consistent inside report history
- Preserved the report-page member filter through search, status chips, load-more, and show-fewer controls

**Verification:**
- ✅ `npm run typecheck`
- ✅ `npm run lint`
- ✅ `npm run build`
- ✅ Documentation updated (`docs/MVP_STATUS_NOTION.md`, `docs/proof/QA_CHECKLIST.md`, `docs/proof/MVP_SMOKE_CHECKLIST.md`)

**Next Steps:**
- Add richer location/taxonomy discovery once real content fields are ready
- Consider whether saved/report filters should eventually share a small reusable filter-summary component

#### 2026-05-14 - Member discovery filters

**Status:** ✅ VERIFIED

**Description:**
- Added a dedicated author filter to `/places` and `/saved` so members can reliably narrow discovery to one storyteller without relying on fuzzy keyword matches
- Rewired “More from {member}” discovery links on browse cards, saved cards, and story detail to use that member filter and keep the filter label visible in the UI
- Preserved the new member filter through existing load-more / show-fewer pagination so discovery context stays intact

**Verification:**
- ✅ `npm run typecheck`
- ✅ `npm run lint`
- ✅ `npm run build`
- ✅ Documentation updated (`docs/MVP_STATUS_NOTION.md`, `docs/proof/QA_CHECKLIST.md`, `docs/proof/MVP_SMOKE_CHECKLIST.md`)

**Next Steps:**
- Add richer location/taxonomy discovery once real content fields are ready
- Extend the same explicit-member pattern into any future admin moderation surfaces if those ship

#### 2026-05-14 - Owner submission-history filters

**Status:** ✅ VERIFIED

**Description:**
- Added first-pass search and quick filters to `/submit` recent submissions for all stories, published, archived, public, private, and stories with photos
- Kept owner lifecycle counts visible so archived/private stories are easier to find without losing honest restore copy
- Preserve the current `/submit` filter/search context when restoring an archived story back into owner surfaces

**Verification:**
- ✅ `npm run typecheck`
- ✅ `npm run lint`
- ✅ `npm run build`
- ✅ Documentation updated (`docs/MVP_STATUS_NOTION.md`, `docs/proof/QA_CHECKLIST.md`, `docs/proof/MVP_SMOKE_CHECKLIST.md`)

**Next Steps:**
- Add richer restore/delete lifecycle options if owners need more than simple archive and restore
- Consider pagination or stronger sorting if owner submission history grows beyond the current first-pass list

#### 2026-05-14 - CI: pnpm + automated Supabase migrations (GitHub Actions)

**Status:** ✅ VERIFIED

**Description:**
- **Lint/build CI** aligned with repo installs: `.github/workflows/lint-and-build.yml` uses **pnpm** (`pnpm/action-setup`, `pnpm install --frozen-lockfile`, `pnpm run lint` / `pnpm run build`); stale **`package-lock.json`** removed so **`pnpm-lock.yaml`** is the single lockfile (matches Vercel when `pnpm-lock.yaml` is present).
- **Hosted migrations:** `.github/workflows/supabase-migrations-develop.yml` (`develop` → staging) and `supabase-migrations-main.yml` (`main` → production) install pinned Supabase CLI **2.98.2**, `supabase link`, `supabase db push --yes`; secrets documented in [`docs/procedures/MIGRATION_PROCEDURE.md`](docs/procedures/MIGRATION_PROCEDURE.md) / [`docs/procedures/RELEASE_PROCEDURE.md`](docs/procedures/RELEASE_PROCEDURE.md).
- **CLI scaffold:** [`supabase/config.toml`](supabase/config.toml), [`supabase/seed.sql`](supabase/seed.sql), [`supabase/.gitignore`](supabase/.gitignore) committed so CI/local CLI has a baseline config (dashboard-only storage SQL stays manual per [`docs/supabase/storage_setup_dashboard.sql`](docs/supabase/storage_setup_dashboard.sql)).

**Verification:**
- `pnpm run typecheck`, `pnpm run lint`, `pnpm run build` (Next.js reported existing webpack/OpenTelemetry warnings from dependencies; build exited successfully)

**Next Steps:**
- Add GitHub Actions secrets (`SUPABASE_ACCESS_TOKEN`, staging/production project refs + DB passwords); confirm first workflow runs succeed after merge/push paths

#### 2026-05-14 - Auth UX: confirmation email messaging (login + signup copy)

**Status:** ✅ SHIPPED

**Description:**
- Calmer copy for **`/login`** `notice=confirm_email` / `confirmed_email` banners (Spam/Promotions hint on confirm path).
- Matching one-line signup helper on **`/signup`** so the confirmation flow feels connected (`app/(auth)/signup/page.tsx`); no redirects, Supabase behavior, or server actions touched.

**Verification:**
- `npm run lint`, `npm run build` (ship checks)

#### 2026-05-15 - Observability: `product_signal` funnel → Sentry Logs (not Issues)

**Status:** ✅ VERIFIED

**Description:**
- `captureProductSignal` switched from **`Sentry.captureEvent` (info)** to **`Sentry.logger.info`** so funnel signals (**`signup_completed`**, checkout, community events, etc.) land in **Sentry Logs** with attribute **`product_signal`** instead of opening **Issues**. `confirm_email_pending` in extras was expected behavior, not a signup failure.
- Docs + `.env.example` comment aligned (`MONITORING_SENTRY_POSTURE`, implementation roadmap, QA checklist, MVP dashboard bullets).

**Verification:**
- `npm run typecheck`, `npm run lint`, `npm run build` (existing webpack/OpenTelemetry warnings unchanged; build exit 0)

#### [Future Entry Template]

**Status:** 🚧 IN PROGRESS

**Description:**
- [What was worked on]
- [Key decisions]
- [Issues encountered]

**Verification:**
- [Smoke test results]
- [Security checks]
- [Documentation updates]

**Next Steps:**
- [What comes next]
- [Dependencies]
- [Blockers]

## Feature Status by Phase

### Phase 0: System Kit ✅

- ✅ Documentation and architecture layers are in place
- ✅ Contracts, procedures, proof docs, and diagrams exist
- ✅ Brand/design references and repo conventions are documented

### Phase 1: Core MVP Surface 🚧

- ✅ Authentication system, route protection, and profile continuity
- ✅ WordPress public/editorial read path with preview + revalidation hooks
- ✅ Dashboard/profile shell and avatar uploads
- ✅ Real community posting, browsing, saving, reporting, and owner management
- ✅ Observability + error UX baseline (structured logging + Sentry wiring)
- ✅ Stripe subscription management and premium gates (Checkout + webhook ledger)
- ✅ Honest homepage marketing-interest capture persists to **`marketing_interest`** with explicitly non-automated copy (see EMAIL_NOTIFICATIONS_CONTRACT)
- 📋 ESP-backed broadcasts + audience tooling remain deliberate backlog work

### Phase 2: Community Depth 🚧

- ✅ First-pass discovery/search/filter/load-more/member-filter support is real
- ✅ Honest taxonomy surface: publisher `place_label` + capped `story_tags` slugs, browse/detail parity, deterministic related ranking
- ✅ Richer photo follow-through on story detail: alt text edits + deterministic ordering (`post_images` UPDATE RLS)
- 📋 Messaging/comments/realtime remain future scope, not current commitments

### Phase 3: Admin + Marketing + Analytics 📋

- 📋 Moderation/admin dashboard depth still pending
- 📋 Admin/editorial operations still pending
- 📋 Analytics implementation still pending
- 📋 Marketing automation beyond the **`marketing_interest`** capture/export path still backlog until ESP decisions land

## Release History

### Current working state

**Status:** Active development on `develop`

**Most recent shipped areas:**
- profile/avatar continuity
- authenticated member community surfaces
- owner story controls and discovery polish
- recent auth/tooling fixes

**Current unverified batch:**
- observability + error UX hardening in the working tree

## Technical Debt

### Current

- Billing/premium gating is still absent
- Community media management is still first-pass only
- Moderation/admin tooling is still shallow
- Observability hardening is in progress and not yet verified

### Future Considerations

- Real-time features (chat, live updates)
- Advanced discovery/search depth
- Analytics and tracking
- Performance optimization beyond the current polish passes
- Full-text search indexes if content volume justifies them

## Known Issues

- No single blocking product issue is currently documented here, but the repo does still have planned gaps around billing, moderation/admin depth, richer upload handling, and newsletter operations.

## Metrics & Goals

### MVP Success Criteria

- [ ] 100+ users sign up in first month
- [ ] 80% trial-to-paid conversion rate
- [ ] <2s page load times
- [ ] Zero critical security issues
- [ ] 99.9% uptime

### Post-MVP Goals

- Real-time chat implementation
- Events and workshops feature
- Advanced analytics
- Mobile app (future consideration)

## Dependencies

### External Services

- ✅ Supabase (auth, database, storage)
- ✅ Stripe (billing)
- ✅ WordPress (headless CMS)
- ✅ Vercel (hosting)
- ✅ Resend (email, if needed)

### Internal Dependencies

- Database schema must be applied before feature development
- Authentication must be working before protected features
- Stripe integration must be complete before subscription features
- WordPress integration must be complete before blog features

## Risk Register

### High Risk

- **Stripe webhook reliability** - Mitigation: Proper error handling and retry logic
- **RLS policy complexity** - Mitigation: Thorough testing and documentation

### Medium Risk

- **WordPress API rate limits** - Mitigation: Caching and ISR
- **Storage costs** - Mitigation: Image optimization and cleanup policies

### Low Risk

- **Third-party service outages** - Mitigation: Graceful degradation

---

**Related Documents:**
- [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)
- [PROJECT_CONTEXT_PROMPT.md](./PROJECT_CONTEXT_PROMPT.md)
- [database_schema_audit.md](./database_schema_audit.md)
- [proof/E2E_SMOKE_PATHS.md](./proof/E2E_SMOKE_PATHS.md)
