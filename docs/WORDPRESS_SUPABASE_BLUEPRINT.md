# Headless WordPress + Supabase Blueprint (SoloSheThings)

**Date:** December 22, 2025  
**Status:** 📋 PLANNED (Phase 1 implementation target)  
**Purpose:** Define the production-grade hybrid stack: WordPress for editorial content, Supabase for identity/community later, Next.js App Router for delivery (ISR, preview, webhooks).

---

## 1) One-Sentence Architecture

**WordPress is editorial truth (public content), Supabase is identity + community truth (private surfaces), and Next.js orchestrates delivery with ISR + secure server-only data access.**

---

## 2) Non-Negotiables (Constitution Alignment)

### 2.1 WordPress Access Rules (Server-Only)
- All WordPress requests MUST happen in:
  - Server Components
  - Route handlers (`app/api/*`)
  - Server-only libraries (`lib/wp-*`)
- Never fetch WordPress content from Client Components.
- Never expose WordPress admin credentials in browser code.
- Public WordPress content stays public. Auth is not required to read it.

### 2.2 Caching & Freshness
- Default editorial pages use **ISR** with `next: { revalidate, tags }`.
- WordPress publish/update triggers **webhook revalidation** (`/api/revalidate`) to update instantly.
- Preview mode bypasses ISR and caching.

### 2.3 Sanitization
- WordPress HTML is treated as untrusted.
- All WP HTML rendering must use a single canonical sanitizer helper (`lib/sanitize.ts`) and a single renderer component (`components/prose.tsx`).

---

## 3) Responsibilities by System

### WordPress (CMS)
**Owns:**
- Posts/pages/media/taxonomies (categories/tags)
- Editorial fields (excerpt/subtitle/hero image alt/reading time)

**Exposes via:**
- REST API for lists and archives
- WPGraphQL for detail pages and ACF/custom shapes (optional in MVP)

### Next.js (Vercel)
**Owns:**
- Routing, SEO metadata
- Rendering + caching posture (ISR + revalidate)
- Preview mode
- Public marketing pages + editorial blog UI
- Data layer boundaries (server-only WP fetch)

### Supabase (Later: Phase 2+)
**Owns:**
- Auth/profiles
- Saved posts/settings
- Community posts/images/moderation
- RLS and access control truth

---

## 4) Route Map (Current Repo Zones)

### Public Terminal (No Auth Required)
- `/` (marketing/home)
- `/blog` (WP list)
- `/blog/[slug]` (WP detail)
- `/collections` (public browsing)
- `/map` (public stub)

### Security Checkpoint (Auth Routes - Later)
- `/login`, `/signup`

### Departure Lounge (Authenticated - Later)
- `/submit`, `/places/[slug]`

---

## 5) Data Access Contract (WordPress)

### 5.1 REST for Lists (Default)
Use REST for index pages because it's simple and cacheable:
- `/wp-json/wp/v2/posts?_embed&per_page=10&page=1`

### 5.2 GraphQL for Detail (Optional, recommended when fields get complex)
Use GraphQL for:
- exact post shapes
- custom fields (ACF)
- relationship fields (related posts, modules)

### 5.3 Canonical "Server-Only" Libraries
- `lib/wp-rest.ts` — list + archive queries
- `lib/wp-graphql.ts` — detail queries (optional for MVP)
- `lib/wp-types.ts` — shared types
- `lib/sanitize.ts` — canonical sanitize helper

---

## 6) Preview & Revalidate (Contracts)

### 6.1 Revalidate API (Webhook Target)
- Route: `POST /api/revalidate`
- Body: `{ secret: string, paths?: string[], tags?: string[] }`
- Validates `secret === process.env.REVALIDATE_SECRET`
- Calls `revalidatePath()` and/or `revalidateTag()`
- Must validate input (arrays of strings, max 25 items per array)
- **Phase 1.2 Hardening:** Body size limit (max 10KB) to prevent DoS
- Must be rate-limited (lightweight) to prevent abuse

**Tag Standards:**
- Lists always tag: `posts` (plus `posts:page:${page}` for pagination)
- Details always tag: `posts` + `post:${slug}` (both tags ensure comprehensive invalidation)

**WordPress Webhook Payload:**
```json
{
  "secret": "REVALIDATE_SECRET",
  "paths": ["/blog", "/blog/my-post-slug"],
  "tags": ["posts", "post:my-post-slug"]
}
```

### 6.2 Preview Mode (MVP posture)
- Route: `GET /api/preview?secret=...&slug=/blog/my-post`
- Requires `PREVIEW_SECRET`
- Enables Draft Mode cookies and redirects to a preview route
- Preview route must be `noStore()` and must never be ISR cached
- **MVP limitation:** WordPress REST API won't return drafts unless authenticated. Preview may show published content only. True draft preview requires WP Application Password auth (Phase 1.5)

---

## 7) Environment Variables (Required)

### WordPress
- `WP_URL` (example: https://cms.soloshethings.com)
- `WP_GRAPHQL_URL` (example: https://cms.soloshethings.com/graphql) — optional if using GraphQL

### Next.js
- `REVALIDATE_SECRET` (long random secret)
- `PREVIEW_SECRET` (long random secret)
- `NEXT_PUBLIC_SITE_URL` (example: https://soloshethings.com)

### Supabase (Phase 2+)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (server-only if needed) `SUPABASE_SERVICE_ROLE_KEY`

---

## 8) MVP Definition (Phase 1: Editorial Only)

### Must Ship
- `/blog` list page (server fetch; ISR enabled)
- `/blog/[slug]` detail page (server fetch; ISR enabled)
- `Prose` renderer + sanitization (single canonical path)
- `/api/revalidate` (secret-protected)
- `/api/preview` + `/preview/...` (draft mode)

### Explicitly Out of Scope (Phase 1)
- Supabase Auth integration
- Saved posts
- Community UGC posts
- Comments/reactions/moderation

---

## 9) Acceptance Criteria (Definition of Done)

- ✅ WordPress content loads on `/blog` and `/blog/[slug]`
- ✅ No WordPress fetches occur in client components
- ✅ Preview mode shows draft content without caching
- ✅ Publishing triggers `/api/revalidate` and updates pages without redeploy
- ✅ WP HTML is sanitized through one canonical path

---

## 10) Operational Notes
- Treat preview/revalidate routes as a security-sensitive surface.
- Do not introduce multiple competing sanitizers or HTML renderers.
- If GraphQL is not available initially, ship REST-only and add GraphQL later without breaking contracts.

---

## Related Documentation

- **[WORDPRESS_CONTENT_CONTRACT.md](./contracts/WORDPRESS_CONTENT_CONTRACT.md)** - Detailed WordPress integration contract
- **[ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)** - Foundational architecture principles
- **[PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md)** - Access control boundaries
- **[MVP_STATUS_NOTION.md](./MVP_STATUS_NOTION.md)** - Phase 1 implementation status

