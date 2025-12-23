# Security Invariants

**Purpose:** Security rules that MUST never be violated in SoloSheThings codebase.

## Non-Negotiables

1. **RLS Always On** - Every Supabase table MUST have Row Level Security enabled. No exceptions.
2. **No Service Role in Client** - The Supabase service role key MUST never be exposed to browser code.
3. **Explicit Selects** - Never use `select('*')`. Always specify columns explicitly to prevent data leakage.
4. **Server-Only Secrets** - API keys, Stripe secrets, and service role keys MUST only exist in server-side code.
5. **Use getUser, Not getSession** - For auth decisions, use `getUser()` from `@supabase/auth-helpers-nextjs`, not `getSession()`.
6. **Webhook Signature Verification** - All webhook endpoints MUST verify request signatures before processing.
7. **Input Validation** - All user inputs MUST be validated and sanitized before database operations.
8. **HTTPS Only** - All external requests MUST use HTTPS. No HTTP in production.

## Authentication & Authorization

### Auth Checks (Security-Critical Gating)

**MUST:**
- Use `getUser()` for ALL security-critical auth decisions
- `getUser()` verifies JWT signature and expiration
- Use `getUser()` in middleware, Server Components, Server Actions, and API routes

**MUST NOT:**
- Use `getSession()` for security-critical decisions (session may be stale)
- Trust client-side auth state alone (always verify server-side)
- Skip auth checks in protected routes

```typescript
// ✅ CORRECT: Use getUser() for security-critical gating
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const user = await getUser(); // Verifies JWT signature
  if (!user) {
    redirect('/login'); // Security-critical: block access
  }
  // User is authenticated and verified
}

// ✅ CORRECT: getUser() in Server Action
'use server';

export async function updateProfile(formData: FormData) {
  const user = await getUser(); // Security-critical: verify auth
  if (!user) {
    throw new Error('Unauthorized'); // Block unauthorized access
  }
  // Proceed with update
}

// ❌ WRONG: Using getSession() for security-critical decision
import { getSession } from '@/lib/auth';
const session = await getSession(); // Session may be stale, not verified
if (!session) {
  // This is NOT secure for critical operations
}
```

### Role-Based Access

```typescript
// ✅ CORRECT: Check role from profile, not JWT claims
const user = await getUser();
if (!user) throw new Error('Unauthorized');

const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile?.role !== 'admin') {
  throw new Error('Forbidden');
}
```

## Database Security

### RLS Always On (Default Deny)

**MUST:**
- Every Supabase table MUST have RLS enabled
- RLS defaults to DENY ALL (no access unless policy allows)
- Explicit policies MUST be created for each operation (SELECT, INSERT, UPDATE, DELETE)
- Policies MUST use `auth.uid()` for user-scoped access

**MUST NOT:**
- Create tables without RLS enabled
- Use permissive policies that allow broad access
- Bypass RLS using service role key for user operations

```sql
-- ✅ CORRECT: RLS enabled with explicit policies (default deny)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Explicit SELECT policy (default deny without this)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Explicit SELECT policy for public profiles
CREATE POLICY "Users can view public profiles"
  ON profiles FOR SELECT
  USING (privacy_level = 'public');

-- Explicit UPDATE policy (default deny without this)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ❌ WRONG: No RLS enabled (allows all access)
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; -- Missing!
```

### RLS Policy Pattern (Default Deny)

```sql
-- ✅ CORRECT: Default deny pattern
-- Step 1: Enable RLS (defaults to deny all)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Step 2: Create explicit allow policies
CREATE POLICY "Users can view public posts"
  ON community_posts FOR SELECT
  USING (is_public = true AND status = 'published');

CREATE POLICY "Users can view own posts"
  ON community_posts FOR SELECT
  USING (auth.uid() = author_id);

-- Without these policies, NO ONE can SELECT (default deny)
```

### Explicit Selects Only (Prevent Column Leakage)

**MUST:**
- Always use explicit column selection (never `select('*')`)
- Only select columns needed for the operation
- Avoid selecting sensitive columns (email, internal IDs, etc.) unless necessary
- Use explicit selects to prevent accidental data leakage

**MUST NOT:**
- Use `select('*')` in any query
- Select sensitive columns when not needed
- Expose internal database columns to client

```typescript
// ✅ CORRECT: Explicit select, only needed columns
const { data } = await supabase
  .from('profiles')
  .select('id, username, avatar_url, role') // Explicit columns only
  .eq('id', userId) // RLS will enforce access
  .single();

// ✅ CORRECT: Minimal select for public profile
const { data } = await supabase
  .from('profiles')
  .select('id, username, avatar_url') // No email, no internal fields
  .eq('id', userId)
  .single();

// ❌ WRONG: Select all (may leak sensitive columns)
const { data } = await supabase
  .from('profiles')
  .select('*') // Never do this - may include email, internal IDs, etc.
  .eq('id', userId)
  .single();

// ❌ WRONG: Selecting sensitive columns unnecessarily
const { data } = await supabase
  .from('profiles')
  .select('id, username, email, stripe_customer_id') // Email and Stripe ID not needed
  .eq('id', userId)
  .single();
```

### Service Role Key (Server-Only Usage Policy)

**MUST:**
- Service role key MUST only exist in server-side code
- Use service role key ONLY for admin operations (migrations, seed data, admin actions)
- Store service role key in server-only environment variable (`SUPABASE_SERVICE_ROLE_KEY`)
- Never import service role client in Client Components

**MUST NOT:**
- Expose service role key to client code (browser bundle)
- Use service role key for user operations (use anon key with RLS)
- Commit service role key to git
- Log service role key in error messages

```typescript
// ✅ CORRECT: Service role only in server-side admin operations
// File: lib/supabase-admin.ts (server-only, never imported in Client Components)
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-only env var
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ✅ CORRECT: Use only for admin operations
export async function adminDeleteUser(userId: string) {
  // Admin operation only - bypasses RLS
  const { error } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId);
    
  if (error) throw error;
}

// ❌ WRONG: Service role in client code
'use client';
import { supabaseAdmin } from '@/lib/supabase-admin'; // NEVER DO THIS

// ❌ WRONG: Using service role for user operations
const { data } = await supabaseAdmin
  .from('profiles')
  .select('*')
  .eq('id', userId); // Use anon key with RLS instead
```

## Rate Limiting

### Webhook Endpoints

**MUST:**
- Implement rate limiting for webhook endpoints
- Verify webhook signatures before processing
- Handle duplicate webhook events (idempotency)
- Log webhook attempts for monitoring

**Expectations:**
- Stripe webhooks: Handle burst traffic (multiple events at once)
- WordPress webhooks: Rate limit to prevent abuse
- Idempotent processing: Same event processed once

```typescript
// ✅ CORRECT: Webhook with signature verification and rate limiting
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Process event (idempotent)
    await handleStripeEvent(event);
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Invalid signature', { status: 400 });
  }
}
```

### Public Endpoints

**MUST:**
- Rate limit public API endpoints
- Use Vercel Edge Config or middleware for rate limiting
- Limit by IP address or API key
- Return appropriate error responses (429 Too Many Requests)

**Expectations:**
- Public endpoints: 100 requests/minute per IP
- WordPress API: Respect WordPress rate limits
- Authentication endpoints: 10 attempts/minute per IP

```typescript
// ✅ CORRECT: Rate limiting in middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple rate limiting (use proper solution in production)
const rateLimit = new Map<string, number[]>();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;
  
  const requests = rateLimit.get(ip) || [];
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  
  return NextResponse.next();
}
```

## API Security

### Webhook Signature Verification

```typescript
// ✅ CORRECT: Verify Stripe webhook signature
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');
  
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Process event
  } catch (error) {
    return new Response('Invalid signature', { status: 400 });
  }
}
```

### Input Validation

```typescript
// ✅ CORRECT: Validate and sanitize inputs
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(5000).trim(),
  is_public: z.boolean(),
});

export async function createPost(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    is_public: formData.get('is_public') === 'true',
  };
  
  const validated = createPostSchema.parse(rawData); // Throws if invalid
  
  // Use validated data
}
```

## Storage Security Rules

### Bucket Access by Owner

**MUST:**
- All storage buckets MUST have RLS policies enabled
- Users can ONLY access files in their own folders
- Folder structure: `{user_id}/avatars/` or `{user_id}/posts/{post_id}/`
- RLS policies enforce ownership at database level

```sql
-- ✅ CORRECT: RLS policies on storage buckets (default deny)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Users can upload to own folder only
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view own files only
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### Signed URLs for Private Content

**MUST:**
- Use signed URLs for private content (not public URLs)
- Signed URLs expire after set time (1 hour default)
- Public URLs only for truly public content
- Respect privacy toggle model

```typescript
// ✅ CORRECT: Signed URL for private content
export async function getPrivateImageUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from('user-uploads')
    .createSignedUrl(storagePath, 3600); // 1 hour expiry
    
  if (error) throw error;
  return data.signedUrl; // Time-limited, secure URL
}

// ✅ CORRECT: Public URL only for public content
export async function getPublicImageUrl(storagePath: string) {
  // Only use for content marked as public
  const { data } = supabase.storage
    .from('user-uploads')
    .getPublicUrl(storagePath);
    
  return data.publicUrl; // Permanent URL (only for public content)
}
```

### Privacy Toggle Model

**MUST:**
- Privacy settings enforced at database level (RLS)
- Storage access respects post/profile privacy settings
- Private content uses signed URLs
- Public content can use public URLs

```typescript
// ✅ CORRECT: Privacy-aware image access
export async function getImageUrl(imageId: string, userId: string) {
  const { data: image } = await supabase
    .from('post_images')
    .select('storage_path, post_id, community_posts!inner(is_public, author_id)')
    .eq('id', imageId)
    .single();
    
  if (!image) throw new Error('Image not found');
  
  const post = image.community_posts;
  const isPublic = post.is_public;
  const isOwner = post.author_id === userId;
  
  if (isPublic || isOwner) {
    // Public or owner: use public URL
    const { data: urlData } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(image.storage_path);
    return urlData.publicUrl;
  }
  
  // Private content: use signed URL
  const { data } = await supabase.storage
    .from('user-uploads')
    .createSignedUrl(image.storage_path, 3600);
    
  return data.signedUrl;
}
```

## Environment Variables

### Client-Side (NEXT_PUBLIC_*)

```typescript
// ✅ CORRECT: Only public variables in client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
```

### Server-Side Only

```typescript
// ✅ CORRECT: Secrets only in server code
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Server-only
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!; // Server-only
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Server-only
```

### Never Expose

- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Never in client
- ❌ `STRIPE_SECRET_KEY` - Never in client
- ❌ `STRIPE_WEBHOOK_SECRET` - Never in client
- ❌ `RESEND_API_KEY` - Never in client
- ❌ Any database passwords or connection strings

## Threat Model Summary

### Enumeration Attacks

**Threat:** Attackers enumerate user IDs, email addresses, or other identifiers.

**Mitigation:**
- RLS policies prevent unauthorized access
- Explicit selects prevent column enumeration
- Error messages don't reveal existence of records
- Rate limiting prevents brute force enumeration

```typescript
// ✅ CORRECT: Don't reveal record existence
const { data, error } = await supabase
  .from('profiles')
  .select('id, username')
  .eq('id', userId)
  .maybeSingle();

if (!data) {
  // Generic error - doesn't reveal if user exists
  throw new Error('Access denied');
}
```

### Overexposure

**Threat:** Exposing sensitive data through queries or API responses.

**Mitigation:**
- Explicit selects (only needed columns)
- RLS policies restrict access
- No `select('*')` anywhere
- Sanitize error messages

```typescript
// ✅ CORRECT: Minimal data exposure
const { data } = await supabase
  .from('profiles')
  .select('id, username, avatar_url') // No email, no internal IDs
  .eq('id', userId)
  .single();
```

### Injection Attacks

**Threat:** SQL injection, NoSQL injection, command injection.

**Mitigation:**
- Supabase uses parameterized queries (automatic)
- Input validation with Zod
- Never construct SQL strings manually
- Sanitize all user inputs

```typescript
// ✅ CORRECT: Parameterized queries (Supabase default)
const { data } = await supabase
  .from('posts')
  .select('id, title, content')
  .eq('id', userId); // Parameterized, safe

// ✅ CORRECT: Input validation
const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
});

const validated = schema.parse(userInput); // Throws if invalid
```

### XSS via WordPress Content

**Threat:** Malicious HTML/JavaScript in WordPress content.

**Mitigation:**
- Sanitize all WordPress HTML before display
- Use DOMPurify for HTML sanitization
- Restrict allowed tags and attributes
- Server-only fetch (no client-side WordPress API calls)

```typescript
// ✅ CORRECT: Sanitize WordPress content
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeWordPressContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}
```

## WordPress-Specific Security

### Server-Only Fetch

**MUST:**
- WordPress API calls MUST be server-side only
- Never fetch WordPress content from Client Components
- Use Server Components or API routes for WordPress content
- Cache WordPress responses (ISR)

**MUST NOT:**
- Make WordPress API calls from client code
- Expose WordPress API credentials to client
- Trust WordPress content without sanitization

```typescript
// ✅ CORRECT: Server-only WordPress fetch
// app/blog/page.tsx (Server Component)
import { fetchWordPressPosts } from '@/lib/wordpress';

export default async function BlogPage() {
  const posts = await fetchWordPressPosts(); // Server-side only
  return <div>{/* Render posts */}</div>;
}

// ❌ WRONG: Client-side WordPress fetch
'use client';
const posts = await fetch('https://wordpress.com/wp-json/wp/v2/posts'); // NEVER
```

### Sanitize HTML

**MUST:**
- Sanitize ALL WordPress HTML before rendering
- Use DOMPurify or similar library
- Restrict allowed tags and attributes
- Remove script tags and event handlers

```typescript
// ✅ CORRECT: Sanitize before rendering
import DOMPurify from 'isomorphic-dompurify';

export function WordPressContent({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### Preview Secrets

**MUST:**
- WordPress preview secrets MUST be server-only
- Never expose preview secrets to client code
- Use preview secrets only in server-side API routes
- Verify preview secret before serving preview content

```typescript
// ✅ CORRECT: Preview secret server-only
// app/api/wordpress/preview/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const postId = searchParams.get('id');
  
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Fetch preview content (server-side)
  const post = await fetchWordPressPostPreview(postId);
  return Response.json(post);
}

// ❌ WRONG: Preview secret in client code
'use client';
const secret = process.env.WORDPRESS_PREVIEW_SECRET; // NEVER
```

## Privacy & Data Protection

### Privacy Toggles

```typescript
// ✅ CORRECT: Enforce privacy at database level
const { data } = await supabase
  .from('community_posts')
  .select('id, title, content, author_id')
  .or(`is_public.eq.true,author_id.eq.${user.id}`) // RLS will further restrict
  .order('created_at', { ascending: false });
```

### Data Deletion

```typescript
// ✅ CORRECT: Cascade delete user data
// In migration:
ALTER TABLE community_posts
  ADD CONSTRAINT fk_author
  FOREIGN KEY (author_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;
```

## Monitoring & Incident Response

### Error Logging

```typescript
// ✅ CORRECT: Log errors without exposing secrets
import * as Sentry from '@sentry/nextjs';

try {
  // Operation
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'profile-update' },
    extra: { userId: user.id }, // No secrets
  });
  throw error;
}
```

### Security Incidents

- See [INCIDENT_TRIAGE_PROCEDURE.md](./procedures/INCIDENT_TRIAGE_PROCEDURE.md)
- Report security issues immediately
- Never commit secrets to git
- Rotate keys if exposed

## Red-Zone Files

These files require extra security scrutiny:

1. **`lib/supabase.ts`** - Client initialization
2. **`middleware.ts`** - Route protection
3. **`app/api/webhooks/stripe/route.ts`** - Webhook handler
4. **`lib/supabase-admin.ts`** - Service role client (if exists)
5. **`lib/stripe.ts`** - Stripe client initialization

## Security Checklist

Before deploying:

- [ ] All tables have RLS enabled
- [ ] No service role key in client code
- [ ] All webhooks verify signatures
- [ ] Input validation on all forms
- [ ] File uploads validate type and size
- [ ] No secrets in environment variables exposed to client
- [ ] HTTPS enforced in production
- [ ] Error messages don't leak sensitive information

---

**Related Documents:**
- [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)
- [contracts/AUTH_CONTRACT.md](./contracts/AUTH_CONTRACT.md)
- [contracts/DATA_ACCESS_QUERY_CONTRACT.md](./contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- [procedures/INCIDENT_TRIAGE_PROCEDURE.md](./procedures/INCIDENT_TRIAGE_PROCEDURE.md)

