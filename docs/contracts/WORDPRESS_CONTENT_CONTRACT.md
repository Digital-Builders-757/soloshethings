# WordPress Content Contract

**Purpose:** Headless WordPress integration, data access patterns, sanitization rules, ISR revalidation, preview mode, and security boundaries for SoloSheThings.

**Phase 1 Status:** WordPress integration is **OPTIONAL** in Phase 1 (UI/UX focus). The application will build and deploy successfully without `WP_URL` configured. Blog routes show "Coming Soon" when WordPress is not configured.

## Optional Configuration (Phase 1)

### WordPress Not Required for Build/Deploy

**Behavior When WP_URL Not Configured:**
- `/blog` shows "Coming Soon" message with friendly UI
- `/blog/[slug]` returns 404 (notFound())
- `/preview/[...slug]` returns 404 (notFound())
- Build completes successfully without errors
- No runtime crashes or exceptions

**Required Environment Variables (When WP Enabled):**
- `WORDPRESS_URL` - WordPress site URL (preferred, e.g., `https://cms.soloshethings.com`)
- `WP_URL` - Legacy fallback (supported; ignored if `WORDPRESS_URL` is set)
- `WORDPRESS_REVALIDATE_SECRET` - Webhook secret (preferred)
- `REVALIDATE_SECRET` - Legacy fallback for revalidation (supported; ignored if preferred is set)
- `PREVIEW_SECRET` - Secret for preview mode (unchanged)

**Implementation:**
- `isWordPressConfigured()` helper checks if `WORDPRESS_URL` or `WP_URL` is set
- WordPress fetch functions return safe fallbacks (empty array or null)
- Errors are logged server-side only, never thrown
- UI gracefully handles missing WordPress configuration

## Non-Negotiables

1. **WordPress is Public Editorial Only** - WordPress is used ONLY for public editorial/blog content. No user authentication in WordPress.
2. **Read-Only from Next.js** - Next.js only reads from WordPress, never writes.
3. **No User Auth in WP** - WordPress does NOT handle user authentication. All user data is in Supabase.
4. **Server-Only Fetch** - All WordPress API calls MUST be server-side only.
5. **Content Sanitization** - All WordPress HTML MUST be sanitized before display.
6. **ISR for Performance** - Blog content uses Incremental Static Regeneration.
7. **No Admin Tokens in Browser** - WordPress admin tokens MUST never be exposed to client code.

## WordPress Role: Public Editorial Only

### What WordPress Handles

**MUST:**
- Public editorial/blog posts
- SEO-optimized content
- Content management for admins
- Media library for blog images

**MUST NOT:**
- User authentication (use Supabase)
- User profiles (use Supabase)
- User-generated content (use Supabase)
- Subscriptions (use Stripe + Supabase)
- Community posts (use Supabase)

### No User Authentication in WordPress

**Principle:**
- WordPress is completely decoupled from user authentication
- No WordPress user accounts for SoloSheThings users
- WordPress admin accounts are for content editors only
- No WordPress authentication required to view content

**Implementation:**
```typescript
// ✅ CORRECT: WordPress content is always public
// No authentication needed
export async function fetchWordPressPosts() {
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
    {
      // No auth headers needed
      next: { revalidate: 3600 },
    }
  );
  return response.json();
}
```

## Content Model

### Post Types

**Standard Post Types:**
- `post` - Standard blog posts (primary content type)
- `page` - Static pages (about, terms, privacy)

**Custom Post Types (Future):**
- `travel-guide` - Detailed travel guides
- `destination` - Destination spotlights
- `story` - Community travel stories

### Taxonomies

**Standard Taxonomies:**
- `category` - Post categories (e.g., "Destinations", "Tips", "Stories")
- `tag` - Post tags (e.g., "solo-travel", "safety", "budget")

**Custom Taxonomies (Future):**
- `destination` - Travel destinations (hierarchical)
- `travel-type` - Type of travel (solo, group, adventure, etc.)

### ACF Fields (Optional)

**If Advanced Custom Fields (ACF) is used:**

**Standard Fields:**
- `featured_image` - Featured image URL (alternative to WP featured media)
- `excerpt` - Custom excerpt override
- `author_bio` - Author bio override

**Custom Fields (Future):**
- `location` - Travel location (coordinates, city, country)
- `travel_dates` - Date range for travel
- `difficulty_level` - Travel difficulty (beginner, intermediate, advanced)
- `budget_range` - Budget range for trip
- `safety_notes` - Safety-specific notes

**ACF Access Pattern:**
```typescript
// ✅ CORRECT: Fetch ACF fields via REST API
export async function fetchWordPressPostWithACF(slug: string) {
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed=true&acf_format=standard`,
    {
      next: { revalidate: 3600 },
    }
  );
  
  const posts = await response.json();
  const post = posts[0];
  
  // ACF fields are in post.acf object
  return {
    ...post,
    acf: post.acf || {},
  };
}
```

## Data Access Approach

### REST API (Primary Method)

**Decision:** Use WordPress REST API for both lists and detail views.

**Rationale:**
- Simpler implementation
- Standard WordPress API
- Good performance with ISR
- No additional dependencies (GraphQL requires plugin)

### REST API Endpoints

**List Endpoints:**
- `/wp-json/wp/v2/posts` - List blog posts
- `/wp-json/wp/v2/posts?categories={id}` - Posts by category
- `/wp-json/wp/v2/posts?tags={id}` - Posts by tag
- `/wp-json/wp/v2/categories` - List categories
- `/wp-json/wp/v2/tags` - List tags

**Detail Endpoints:**
- `/wp-json/wp/v2/posts?slug={slug}` - Single post by slug
- `/wp-json/wp/v2/posts/{id}` - Single post by ID

**Embedded Resources:**
- Use `_embed=true` to include featured media, author, categories, tags

### REST API Implementation

```typescript
// ✅ CORRECT: REST API for lists
// lib/wordpress.ts
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL!;

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  acf?: Record<string, any>; // ACF fields if enabled
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
      };
    }>;
    author?: Array<{
      name: string;
      slug: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

export async function fetchWordPressPosts(params?: {
  perPage?: number;
  page?: number;
  category?: number;
  tag?: number;
  search?: string;
}): Promise<WordPressPost[]> {
  const searchParams = new URLSearchParams({
    _embed: 'true',
    per_page: String(params?.perPage || 10),
    page: String(params?.page || 1),
  });

  if (params?.category) {
    searchParams.append('categories', String(params.category));
  }

  if (params?.tag) {
    searchParams.append('tags', String(params.tag));
  }

  if (params?.search) {
    searchParams.append('search', params.search);
  }

  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${searchParams}`,
    {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    }
  );

  if (!response.ok) {
    console.error('WordPress API error:', response.statusText);
    return [];
  }

  return response.json();
}

// ✅ CORRECT: REST API for detail
export async function fetchWordPressPost(slug: string): Promise<WordPressPost | null> {
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    return null;
  }

  const posts = await response.json();
  return posts[0] || null;
}
```

## Sanitization Rules for WP HTML Rendering

### Sanitization Requirements

**MUST:**
- Sanitize ALL WordPress HTML before rendering
- Use DOMPurify or similar library
- Restrict allowed tags and attributes
- Remove script tags and event handlers
- Remove data attributes (unless explicitly allowed)

**MUST NOT:**
- Render WordPress HTML without sanitization
- Allow script tags
- Allow event handlers (onclick, onerror, etc.)
- Trust WordPress content

### Sanitization Implementation

```typescript
// ✅ CORRECT: Comprehensive HTML sanitization
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeWordPressContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Text formatting
      'p', 'br', 'strong', 'em', 'u', 's', 'sub', 'sup',
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Lists
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      // Links and quotes
      'a', 'blockquote', 'cite',
      // Code
      'code', 'pre', 'kbd', 'samp',
      // Images and media
      'img', 'figure', 'figcaption',
      // Tables
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      // Divs and spans (limited)
      'div', 'span',
    ],
    ALLOWED_ATTR: [
      // Links
      'href', 'title', 'target', 'rel',
      // Images
      'src', 'alt', 'width', 'height', 'loading',
      // Basic attributes
      'class', 'id',
      // Tables
      'colspan', 'rowspan', 'scope',
    ],
    ALLOW_DATA_ATTR: false, // No data-* attributes
    ALLOW_ARIA_ATTR: true, // Allow ARIA attributes for accessibility
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
    // Sanitize URLs
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}
```

### Safe Content Rendering Component

```typescript
// ✅ CORRECT: Safe WordPress content component
import { sanitizeWordPressContent } from '@/lib/wordpress';

export function WordPressContent({ content }: { content: string }) {
  const sanitized = sanitizeWordPressContent(content);

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

// ❌ WRONG: Unsanitized content
export function BadWordPressContent({ content }: { content: string }) {
  // ❌ WRONG: No sanitization
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
```

## ISR Revalidate Strategy

### Revalidation Rules

**Default Revalidation:**
- Blog list: 3600 seconds (1 hour)
- Blog detail: 3600 seconds (1 hour)
- Categories/Tags: 3600 seconds (1 hour)

**On-Demand Revalidation:**
- Via webhook when post is published/updated
- Via webhook when post is deleted
- Manual revalidation via API route

**Stale-While-Revalidate:**
- Serve stale content while revalidating
- Background revalidation doesn't block requests

### Route → Tags → Revalidate Trigger Mapping

**Canonical Tag Standards (MUST be followed):**

| Route | ISR Tags | Revalidate Trigger |
|-------|----------|-------------------|
| `/blog` | `posts`, `posts:page:${page}` | Publish/update any post |
| `/blog/[slug]` | `posts`, `post:${slug}` | Publish/update that specific post |

**Tag Enforcement Rules:**
- **Lists MUST always tag:** `posts` (required) + `posts:page:${page}` (optional, for granular pagination invalidation)
- **Details MUST always tag:** `posts` (required) + `post:${slug}` (required, for specific post invalidation)
- Both tags ensure comprehensive invalidation (broad + specific)

**WordPress Webhook Payload Example (Canonical Format):**
```json
{
  "secret": "REVALIDATE_SECRET",
  "paths": ["/blog", "/blog/my-post-slug"],
  "tags": ["posts", "post:my-post-slug"]
}
```

**Why Both Tags?**
- `posts` tag: Invalidates all blog-related pages (broad invalidation)
- `post:${slug}` tag: Invalidates specific post page (granular invalidation)
- This dual-tag approach ensures cache consistency whether WordPress sends paths, tags, or both

### ISR Configuration

```typescript
// ✅ CORRECT: Blog list with ISR
// app/blog/page.tsx
import { fetchWordPressPosts } from '@/lib/wordpress';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await fetchWordPressPosts({ perPage: 10 });

  return (
    <div>
      <h1>Travel Blog</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title.rendered}</h2>
          <WordPressContent content={post.excerpt.rendered} />
        </article>
      ))}
    </div>
  );
}

// ✅ CORRECT: Blog detail with ISR
// app/blog/[slug]/page.tsx
import { fetchWordPressPost } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchWordPressPost(params.slug);

  if (!post) {
    notFound(); // Non-enumerating 404
  }

  return (
    <article>
      <h1>{post.title.rendered}</h1>
      <WordPressContent content={post.content.rendered} />
    </article>
  );
}
```

## Webhook Endpoint Contract

### Webhook Endpoint

**Endpoint:** `/api/revalidate`

**Canonical Contract:**
- Method: `POST`
- Body: `{ secret: string, paths?: string[], tags?: string[] }`
- Validates `secret === process.env.REVALIDATE_SECRET` (from request body, not header)
- Input validation: max 25 items per array (prevents abuse)
- Body size limit: max 10KB (prevents DoS attacks)

**Method:** POST

**Authentication:** 
- Secret must be provided in request body: `{ secret: "REVALIDATE_SECRET", ... }`
- Secret validated against `process.env.REVALIDATE_SECRET`

**Request Body (Canonical Format):**
```typescript
interface RevalidateWebhookPayload {
  secret: string;           // Required: REVALIDATE_SECRET
  paths?: string[];         // Optional: Array of paths to revalidate (max 25)
  tags?: string[];         // Optional: Array of cache tags to revalidate (max 25)
}
```

**Example Payload:**
```json
{
  "secret": "your-revalidate-secret-here",
  "paths": ["/blog", "/blog/my-post-slug"],
  "tags": ["posts", "post:my-post-slug"]
}
```

**Validation Rules:**
- `secret`: Required, must match `REVALIDATE_SECRET` env var
- `paths`: Optional array of strings, max 25 items, each path max 200 chars, must start with `/` (no URLs)
- `tags`: Optional array of strings, max 25 items, each tag max 200 chars, must match namespace (`posts`, `post:*`, `posts:page:*`)
- Body size: Max 10KB total (byte-accurate enforcement)
- Content-length: Validated safely (guards against NaN/Infinity)

**Security Hardening:**
- Byte-accurate body size checking (not character count)
- Path validation: rejects URLs, enforces relative paths only
- Tag namespace validation: only allows expected WordPress cache tags
- Individual string length limits: prevents payload-in-disguise attacks
- TODO: Add rate limiting (Upstash Redis or Vercel Edge Config) for production

### Webhook Implementation

```typescript
// ✅ CORRECT: Webhook revalidation endpoint (canonical implementation with security hardening)
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const MAX_BODY_SIZE = 10 * 1024; // 10KB in bytes
const MAX_ITEMS = 25; // Max items per array
const MAX_STRING_LENGTH = 200; // Max length per path/tag string

export async function POST(request: NextRequest) {
  try {
    const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
    if (!REVALIDATE_SECRET) {
      throw new Error('REVALIDATE_SECRET environment variable is not set');
    }

    // 1. Enforce body size limit (byte-accurate, not character count)
    const contentLength = request.headers.get('content-length');
    
    if (contentLength) {
      // Safe number parsing (guards against NaN, Infinity, or maliciously large values)
      const contentLengthNum = Number(contentLength);
      if (!Number.isFinite(contentLengthNum) || contentLengthNum < 0) {
        return NextResponse.json(
          { error: 'Invalid content-length header' },
          { status: 400 }
        );
      }
      
      if (contentLengthNum > MAX_BODY_SIZE) {
        return NextResponse.json(
          { error: `Request body exceeds maximum size of ${MAX_BODY_SIZE} bytes` },
          { status: 413 }
        );
      }
    }

    // Read body as arrayBuffer for byte-accurate size checking
    const arrayBuffer = await request.arrayBuffer();
    
    if (arrayBuffer.byteLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: `Request body exceeds maximum size of ${MAX_BODY_SIZE} bytes` },
        { status: 413 }
      );
    }

    // Decode buffer to text and parse JSON
    const bodyText = new TextDecoder().decode(arrayBuffer);
    let body: { secret?: string; paths?: unknown; tags?: unknown };
    
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { secret, paths, tags } = body;

    // 2. Validate secret (from body, not header)
    if (!secret || typeof secret !== 'string' || secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // 3. Validate paths array (if provided)
    if (paths !== undefined) {
      if (!Array.isArray(paths) || paths.length > MAX_ITEMS) {
        return NextResponse.json(
          { error: `paths must be an array with max ${MAX_ITEMS} items` },
          { status: 400 }
        );
      }

      // Validate each path: must be string, start with /, reasonable length, no URLs
      for (const path of paths) {
        if (typeof path !== 'string' || path.length > MAX_STRING_LENGTH) {
          return NextResponse.json(
            { error: 'All paths must be strings under 200 characters' },
            { status: 400 }
          );
        }

        // Path must start with / and not be a full URL
        if (!path.startsWith('/') || path.includes('://') || path.includes('http')) {
          return NextResponse.json(
            { error: 'Paths must be relative paths starting with /' },
            { status: 400 }
          );
        }
      }
    }

    // 4. Validate tags array (if provided)
    if (tags !== undefined) {
      if (!Array.isArray(tags) || tags.length > MAX_ITEMS) {
        return NextResponse.json(
          { error: `tags must be an array with max ${MAX_ITEMS} items` },
          { status: 400 }
        );
      }

      // Validate each tag: must be string, reasonable length, valid namespace
      const VALID_TAG_PREFIXES = ['posts', 'post:', 'posts:page:'];
      
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > MAX_STRING_LENGTH) {
          return NextResponse.json(
            { error: 'All tags must be strings under 200 characters' },
            { status: 400 }
          );
        }

        // Tag must match expected namespace (posts, post:*, posts:page:*)
        const isValidTag = VALID_TAG_PREFIXES.some(
          prefix => tag === prefix || tag.startsWith(prefix)
        );
        if (!isValidTag) {
          return NextResponse.json(
            { error: 'Tag must match expected namespace: posts, post:*, or posts:page:*' },
            { status: 400 }
          );
        }
      }
    }

    // 5. Revalidate paths (all validation passed)
    if (paths && Array.isArray(paths) && paths.length > 0) {
      for (const path of paths) {
        if (typeof path === 'string') {
          revalidatePath(path);
        }
      }
    }

    // 6. Revalidate tags (all validation passed)
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        if (typeof tag === 'string') {
          revalidateTag(tag);
        }
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: paths || [],
      tags: tags || [],
      now: Date.now(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Revalidation failed' },
      { status: 500 }
    );
  }
}
```

### WordPress Webhook Configuration

**In WordPress, configure webhook (via plugin or custom code):**

```php
// WordPress hook example
add_action('save_post', 'trigger_nextjs_revalidation', 10, 3);

function trigger_nextjs_revalidation($post_id, $post, $update) {
  // Only for published posts
  if ($post->post_status !== 'publish' && $post->post_status !== 'trash') {
    return;
  }

  $webhook_url = 'https://your-domain.com/api/revalidate/wordpress';
  $secret = 'your-webhook-secret';

  wp_remote_post($webhook_url, [
    'headers' => [
      'Content-Type' => 'application/json',
      'x-wordpress-secret' => $secret,
    ],
    'body' => json_encode([
      'post_id' => $post_id,
      'post_type' => $post->post_type,
      'action' => $post->post_status === 'trash' ? 'delete' : ($update ? 'update' : 'publish'),
      'post' => [
        'slug' => $post->post_name,
        'status' => $post->post_status,
      ],
    ]),
  ]);
}
```

## Preview Mode Contract

### Preview Mode Requirements

**Purpose:** Allow content editors to preview draft posts before publishing.

**MUST:**
- Use Next.js Preview Mode (cookies)
- Require preview secret (server-only)
- Bypass ISR for preview requests
- Show draft/pending posts only in preview mode

**MUST NOT:**
- Expose preview secret to client
- Allow preview without secret
- Cache preview content

### Preview Mode Implementation

```typescript
// ✅ CORRECT: Preview mode entry point
// app/api/preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Verify preview secret
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }

  // Enable preview mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to post preview
  if (slug) {
    redirect(`/blog/${slug}`);
  } else {
    redirect('/blog');
  }
}

// ✅ CORRECT: Preview mode exit
// app/api/exit-preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const draft = await draftMode();
  draft.disable();

  redirect('/blog');
}
```

### Preview-Aware Post Fetching

```typescript
// ✅ CORRECT: Preview-aware post fetching
import { draftMode } from 'next/headers';

export async function fetchWordPressPost(
  slug: string,
  options?: { preview?: boolean }
): Promise<WordPressPost | null> {
  const draft = await draftMode();
  const isPreview = draft.isEnabled || options?.preview;

  // In preview mode, fetch draft posts
  const status = isPreview ? 'draft,pending,publish' : 'publish';

  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${slug}&status=${status}&_embed=true`,
    {
      // No caching in preview mode
      cache: isPreview ? 'no-store' : 'default',
      next: isPreview ? undefined : { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    return null;
  }

  const posts = await response.json();
  return posts[0] || null;
}
```

### Preview Mode Usage

**WordPress Preview Link:**
```
https://your-domain.com/api/preview?secret=YOUR_PREVIEW_SECRET&slug=post-slug
```

**Preview Component:**
```typescript
// ✅ CORRECT: Preview mode indicator
import { draftMode } from 'next/headers';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const draft = await draftMode();
  const isPreview = draft.isEnabled;

  const post = await fetchWordPressPost(params.slug, { preview: isPreview });

  if (!post) {
    notFound();
  }

  return (
    <>
      {isPreview && (
        <div className="bg-yellow-500 text-black p-2 text-center">
          Preview Mode Active - <a href="/api/exit-preview">Exit Preview</a>
        </div>
      )}
      <article>
        <h1>{post.title.rendered}</h1>
        <WordPressContent content={post.content.rendered} />
      </article>
    </>
  );
}
```

## Security: Server-Only Fetch

### Server-Only Principle

**MUST:**
- All WordPress API calls MUST be server-side only
- Use Server Components for WordPress content
- Use API routes for WordPress webhooks
- Never expose WordPress API URLs to client

**MUST NOT:**
- Make WordPress API calls from Client Components
- Expose WordPress API credentials to client
- Fetch WordPress content in middleware (use Server Components)

### Server-Only Implementation

```typescript
// ✅ CORRECT: Server-only WordPress fetch
// lib/wordpress.ts (server-only)
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL!;

export async function fetchWordPressPosts() {
  // Server-side only - this file should never be imported in client code
  const response = await fetch(
    `${WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
    {
      next: { revalidate: 3600 },
    }
  );
  return response.json();
}

// ✅ CORRECT: Server Component usage
// app/blog/page.tsx (Server Component - no 'use client')
import { fetchWordPressPosts } from '@/lib/wordpress';

export default async function BlogPage() {
  const posts = await fetchWordPressPosts(); // Server-side only
  return <div>{/* Render posts */}</div>;
}

// ❌ WRONG: Client-side WordPress fetch
'use client';
import { fetchWordPressPosts } from '@/lib/wordpress'; // NEVER DO THIS

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    // ❌ WRONG: Client-side fetch
    fetchWordPressPosts().then(setPosts);
  }, []);
}
```

### No Admin Tokens in Browser

**MUST:**
- Keep WordPress admin tokens server-only
- Use preview secrets (not admin tokens) for preview mode
- Never expose WordPress authentication to client

**MUST NOT:**
- Store WordPress admin tokens in cookies accessible to client
- Pass WordPress admin tokens to Client Components
- Use WordPress admin tokens for public content access

```typescript
// ✅ CORRECT: Preview secret (not admin token)
// app/api/preview/route.ts
export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-preview-secret');
  
  // Use preview secret, not WordPress admin token
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  // Enable preview mode
  const draft = await draftMode();
  draft.enable();
}

// ❌ WRONG: Using WordPress admin token
export async function GET(request: NextRequest) {
  // ❌ WRONG: Never use WordPress admin token
  const token = request.headers.get('authorization');
  // This would expose WordPress admin credentials
}
```

## Error Handling

### Graceful Degradation

```typescript
// ✅ CORRECT: Graceful error handling
export async function fetchWordPressPosts() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/posts`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error('WordPress API error:', {
        status: response.status,
        statusText: response.statusText,
      });
      return []; // Return empty array, don't break page
    }

    return response.json();
  } catch (error) {
    console.error('WordPress fetch error:', error);
    return []; // Graceful degradation
  }
}
```

## Security Testing Checklist

**Manual Security Tests (Run before production):**

1. **Invalid secret** → Should return `401`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"wrong-secret","paths":["/blog"]}'
   ```

2. **Missing secret** → Should return `401`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"paths":["/blog"]}'
   ```

3. **>10KB body (no content-length header)** → Should return `413`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d "{\"secret\":\"$REVALIDATE_SECRET\",\"paths\":[\"$(python3 -c 'print(\"/blog\" + \"x\" * 10000)')\"]}"
   ```

4. **>10KB content-length** → Should return `413`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -H "Content-Length: 999999" \
     -d '{"secret":"test"}'
   ```

5. **Invalid tag format** → Should return `400`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"$REVALIDATE_SECRET","tags":["invalid-tag"]}'
   ```

6. **Path not starting with /** → Should return `400`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"$REVALIDATE_SECRET","paths":["https://evil.com"]}'
   ```

7. **Tag exceeds max length** → Should return `400`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d "{\"secret\":\"$REVALIDATE_SECRET\",\"tags\":[\"posts\" + \"x\".repeat(201)]}"
   ```

8. **Invalid content-length (NaN/Infinity)** → Should return `400`
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -H "Content-Length: abc" \
     -d '{"secret":"test"}'
   ```

**All tests should pass before deploying to production.**

## Security Checklist

Before deploying WordPress integration:

**WordPress Integration:**
- [ ] WordPress API URL in server-only environment variable
- [ ] Webhook secret configured and verified
- [ ] Preview secret configured (different from webhook secret)
- [ ] All WordPress fetches are server-side only (`import "server-only"`)
- [ ] Content sanitization implemented (DOMPurify)
- [ ] ISR revalidation configured
- [ ] Preview mode uses cookies (not tokens)
- [ ] No admin tokens exposed to client
- [ ] CORS configured on WordPress (if needed)
- [ ] Error handling implemented (graceful degradation)

**Revalidation Endpoint Security (RED ZONE):**
- [ ] Webhook endpoint secured with secret (body-based, not header)
- [ ] Body size limit enforced (10KB byte-accurate)
- [ ] Content-length header validated safely (guards against NaN/Infinity)
- [ ] Path validation: rejects URLs, enforces relative paths only
- [ ] Tag namespace validation: only allows expected WordPress cache tags
- [ ] Individual string length limits enforced (200 chars max)
- [ ] Array limits enforced (25 items max per array)
- [ ] All security tests pass (see Security Testing Checklist above)
- [ ] Rate limiting added (Upstash Redis or Vercel Edge Config) - TODO for production

---

**Related Documents:**
- [ARCHITECTURE_CONSTITUTION.md](./../ARCHITECTURE_CONSTITUTION.md)
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [procedures/RELEASE_PROCEDURE.md](./../procedures/RELEASE_PROCEDURE.md)
