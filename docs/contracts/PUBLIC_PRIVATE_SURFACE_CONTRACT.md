# Public/Private Surface Contract

**Purpose:** Defines exactly what anonymous, authenticated, and subscribed users can access in SoloSheThings, with explicit subscription gates, non-enumerating behavior, safe error messages, and caching constraints.

## Non-Negotiables

1. **WordPress Content is Public** - All WordPress blog posts are accessible without authentication.
2. **User Content Requires Auth** - All user-generated content requires authentication.
3. **Subscription Gates Premium** - Premium features require active subscription or valid trial.
4. **RLS Enforces Access** - Database-level access control via RLS policies.
5. **Privacy Toggles Work** - User privacy settings are enforced at database level.
6. **Non-Enumerating Behavior** - Error messages MUST NOT reveal existence of resources.
7. **Safe Error Messages** - Error messages MUST NOT leak sensitive information.

## Anonymous User Access (Not Authenticated)

### Marketing Pages

**MUST Allow:**
- `/` - Landing page
- `/about` - About page
- `/pricing` - Pricing page
- `/contact` - Contact page
- `/terms` - Terms of service
- `/privacy` - Privacy policy

**Access Pattern:**
```typescript
// ✅ CORRECT: Public marketing pages
export default async function LandingPage() {
  // No auth check needed
  return <LandingPageContent />;
}
```

**Caching:**
- Static pages: ISR with 1-hour revalidation
- Dynamic content: ISR with webhook revalidation
- No user-specific data

### WordPress Blog Content

**MUST Allow:**
- `/blog` - Blog list page (all posts)
- `/blog/[slug]` - Individual blog post detail
- WordPress REST API endpoints (read-only)

**Access Pattern:**
```typescript
// ✅ CORRECT: Public WordPress content
export default async function BlogPage() {
  // No auth check needed
  const posts = await fetchWordPressPosts();
  return <BlogList posts={posts} />;
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // No auth check needed
  const post = await fetchWordPressPost(params.slug);
  if (!post) {
    // Non-enumerating: generic 404, don't reveal if post exists
    notFound();
  }
  return <BlogPost post={post} />;
}
```

**Caching Constraints:**
- Blog list: ISR with 1-hour revalidation
- Blog detail: ISR with webhook revalidation on WordPress update
- WordPress API responses: Cache for 1 hour
- No user-specific caching needed

**Non-Enumerating Behavior:**
```typescript
// ✅ CORRECT: Non-enumerating 404
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchWordPressPost(params.slug);
  
  if (!post) {
    // Generic 404 - doesn't reveal if post exists or not
    notFound();
  }
  
  return <BlogPost post={post} />;
}

// ❌ WRONG: Enumerating error
if (!post) {
  throw new Error('Post not found'); // Reveals post doesn't exist
}
```

### What Anonymous Users CANNOT Access

**MUST Block:**
- `/dashboard` - User dashboard
- `/profile` - Profile pages
- `/posts/*` - Community posts
- `/saved` - Saved posts
- `/settings` - Profile settings
- `/messages` - Messaging
- `/upload` - Image uploads
- `/community` - Community features
- `/admin/*` - Admin features

**Access Control:**
```typescript
// ✅ CORRECT: Block anonymous access
export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  // Continue with authenticated user
}
```

## Authenticated User Access (Logged In)

### Requires Authentication

**MUST Require Auth:**
- Saved posts (`/saved`)
- Profile settings (`/settings`)
- Messaging (`/messages`)
- Image uploads (`/upload`)
- Community posts (`/posts/*`)
- User dashboard (`/dashboard`)

**Access Pattern:**
```typescript
// ✅ CORRECT: Require authentication
export default async function SavedPostsPage() {
  const user = await getUser(); // Security-critical check
  if (!user) {
    redirect('/login');
  }
  
  const savedPosts = await getSavedPosts(user.id);
  return <SavedPostsList posts={savedPosts} />;
}
```

### Saved Posts

**Access Rules:**
- User can view own saved posts only
- RLS enforces user_id match
- No access to other users' saved posts

```typescript
// ✅ CORRECT: Own saved posts only
async function getSavedPosts(userId: string) {
  const { data, error } = await supabase
    .from('saved_posts')
    .select('id, post_type, wp_post_slug, community_post_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}
```

**Caching:**
- User-specific data: No caching (always fresh)
- Server Component: Revalidate on demand

### Profile Settings

**Access Rules:**
- User can view and edit own profile only
- RLS enforces user_id match
- Privacy settings affect visibility

```typescript
// ✅ CORRECT: Own profile only
export default async function SettingsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  const profile = await getProfile(user.id);
  return <SettingsForm profile={profile} />;
}
```

**Caching:**
- User-specific data: No caching
- Always fetch fresh profile data

### Messaging

**Access Rules:**
- User can view own messages only
- RLS enforces user_id match in messages table
- No access to other users' messages

```typescript
// ✅ CORRECT: Own messages only
async function getMessages(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, receiver_id, content, created_at')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}
```

**Caching:**
- Real-time data: No caching
- Use Supabase Realtime for live updates (future)

### Image Uploads

**Access Rules:**
- User can upload to own storage folder only
- RLS enforces bucket access by owner
- Privacy settings affect image visibility

```typescript
// ✅ CORRECT: Own uploads only
async function uploadImage(userId: string, file: File) {
  const filePath = `${userId}/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  return data;
}
```

**Caching:**
- Uploaded images: CDN cache with signed URLs
- Signed URLs expire after 1 hour
- Regenerate signed URLs on access

## Subscription-Gated Access (Active Subscription Required)

### Subscription Status Check

**MUST Check:**
- Active subscription (`status = 'active'`)
- Valid trial period (`status = 'trialing'` AND `trial_end > now()`)
- Trial expired but subscription active

```typescript
// ✅ CORRECT: Subscription check
async function requireSubscription(userId: string) {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('status, trial_end, current_period_end')
    .eq('user_id', userId)
    .single();
    
  if (error || !subscription) {
    throw new Error('Subscription required');
  }
  
  const isTrialValid = subscription.trial_end && 
    new Date(subscription.trial_end) > new Date();
  const isActive = subscription.status === 'active' || 
    subscription.status === 'trialing';
    
  if (!isActive && !isTrialValid) {
    throw new Error('Subscription expired');
  }
  
  return subscription;
}
```

### Subscription Gates

**MUST Require Active Subscription (After Trial):**

1. **Reading More Than 3 Community Posts**
   - Trial users: Can read unlimited posts during trial
   - After trial: Limited to 3 posts per day
   - Subscribed users: Unlimited access

2. **Creating Community Posts**
   - Trial users: Can create posts during trial
   - After trial: Requires active subscription
   - Subscribed users: Unlimited posting

3. **Messaging**
   - Trial users: Can message during trial
   - After trial: Requires active subscription
   - Subscribed users: Unlimited messaging

4. **Saving Posts**
   - Trial users: Can save posts during trial
   - After trial: Requires active subscription
   - Subscribed users: Unlimited saves

5. **Viewing Full Community Feed**
   - Trial users: Full access during trial
   - After trial: Limited preview (3 posts)
   - Subscribed users: Full access

### Reading Community Posts (Subscription Gate)

**Access Rules:**
- Trial users: Unlimited during trial period
- After trial: Limited to 3 posts per day
- Subscribed users: Unlimited

```typescript
// ✅ CORRECT: Subscription-gated post reading
export default async function CommunityPostsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  const subscription = await getSubscription(user.id);
  const isTrialValid = subscription?.trial_end && 
    new Date(subscription.trial_end) > new Date();
  const isSubscribed = subscription?.status === 'active';
  
  // Check daily read limit for non-trial, non-subscribed users
  if (!isTrialValid && !isSubscribed) {
    const readCount = await getDailyReadCount(user.id);
    if (readCount >= 3) {
      redirect('/subscribe?reason=limit');
    }
  }
  
  const posts = await getCommunityPosts(user.id);
  return <CommunityPostsList posts={posts} />;
}

async function getDailyReadCount(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('post_views') // Hypothetical table for tracking
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('viewed_at', today.toISOString());
    
  if (error) throw error;
  return count || 0;
}
```

**Caching:**
- User-specific limits: No caching
- Post content: Cache for 5 minutes (stale-while-revalidate)

### Creating Community Posts (Subscription Gate)

**Access Rules:**
- Trial users: Can create posts during trial
- After trial: Requires active subscription
- Subscribed users: Unlimited posting

```typescript
// ✅ CORRECT: Subscription-gated post creation
'use server';

export async function createPost(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Check subscription
  const subscription = await requireSubscription(user.id);
  
  const title = formData.get('title');
  const content = formData.get('content');
  
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: user.id,
      title,
      content,
      status: 'published',
    })
    .select('id, title, created_at')
    .single();
    
  if (error) throw error;
  return data;
}
```

**Error Handling:**
```typescript
// ✅ CORRECT: Safe error message
try {
  await createPost(formData);
} catch (error) {
  if (error.message.includes('Subscription')) {
    // Safe error - doesn't reveal subscription details
    return { error: 'Active subscription required to create posts' };
  }
  // Generic error for other failures
  return { error: 'Failed to create post. Please try again.' };
}
```

### Messaging (Subscription Gate)

**Access Rules:**
- Trial users: Can message during trial
- After trial: Requires active subscription
- Subscribed users: Unlimited messaging

```typescript
// ✅ CORRECT: Subscription-gated messaging
export default async function MessagesPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  // Check subscription
  try {
    await requireSubscription(user.id);
  } catch (error) {
    redirect('/subscribe?reason=messaging');
  }
  
  const messages = await getMessages(user.id);
  return <MessagesList messages={messages} />;
}
```

**Caching:**
- Real-time data: No caching
- Use Supabase Realtime for live updates

## Non-Enumerating Behavior

### Principle

**MUST:**
- Return generic 404 for missing resources
- Use same error message for missing vs unauthorized
- Don't reveal resource existence

**MUST NOT:**
- Return different errors for "not found" vs "unauthorized"
- Reveal if a resource exists
- Leak information about resource structure

### Examples

```typescript
// ✅ CORRECT: Non-enumerating 404
export default async function PostPage({ params }: { params: { id: string } }) {
  const user = await getUser();
  if (!user) redirect('/login');
  
  const post = await getPost(params.id);
  
  if (!post) {
    // Generic 404 - doesn't reveal if post exists
    notFound();
  }
  
  // Check access (RLS should handle this, but double-check)
  if (post.author_id !== user.id && post.privacy_level === 'private') {
    // Same 404 - doesn't reveal if post exists or is private
    notFound();
  }
  
  return <PostContent post={post} />;
}

// ❌ WRONG: Enumerating errors
if (!post) {
  throw new Error('Post not found'); // Reveals post doesn't exist
}

if (post.privacy_level === 'private' && post.author_id !== user.id) {
  throw new Error('Post is private'); // Reveals post exists and is private
}
```

### Profile Enumeration Prevention

```typescript
// ✅ CORRECT: Non-enumerating profile access
export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await getUser();
  if (!user) redirect('/login');
  
  const profile = await getProfileByUsername(params.username);
  
  if (!profile) {
    // Generic 404 - doesn't reveal if profile exists
    notFound();
  }
  
  // Check privacy
  if (profile.privacy_level === 'private' && profile.id !== user.id) {
    // Same 404 - doesn't reveal if profile exists or is private
    notFound();
  }
  
  return <ProfileContent profile={profile} />;
}
```

## Safe Error Messages

### Principle

**MUST:**
- Use generic error messages
- Don't leak sensitive information
- Don't reveal system internals
- Log detailed errors server-side only

**MUST NOT:**
- Expose database errors to users
- Reveal user IDs or internal IDs
- Show stack traces in production
- Leak subscription details

### Examples

```typescript
// ✅ CORRECT: Safe error messages
try {
  const subscription = await requireSubscription(user.id);
} catch (error) {
  // Log detailed error server-side
  console.error('Subscription check failed:', error);
  Sentry.captureException(error);
  
  // Return safe error to user
  return { error: 'Subscription required to access this feature' };
}

// ❌ WRONG: Unsafe error messages
catch (error) {
  // Leaks internal error details
  return { error: `Database error: ${error.message}` };
  
  // Reveals user ID
  return { error: `User ${user.id} has no subscription` };
  
  // Shows stack trace
  return { error: error.stack };
}
```

### Error Message Guidelines

**For Authentication:**
- ✅ "Please sign in to continue"
- ❌ "User not authenticated" (too technical)

**For Authorization:**
- ✅ "You don't have access to this resource"
- ❌ "User 123 cannot access post 456" (leaks IDs)

**For Subscription:**
- ✅ "Active subscription required"
- ❌ "Your trial expired on 2024-01-01" (reveals dates)

**For Not Found:**
- ✅ "Resource not found" (generic)
- ❌ "Post with ID abc123 does not exist" (reveals ID format)

## Caching Constraints

### Public Content Caching

**WordPress Blog:**
- Blog list: ISR with 1-hour revalidation
- Blog detail: ISR with webhook revalidation
- WordPress API: Cache for 1 hour
- No user-specific caching

```typescript
// ✅ CORRECT: Public content caching
export const revalidate = 3600; // 1 hour

export default async function BlogPage() {
  const posts = await fetchWordPressPosts();
  return <BlogList posts={posts} />;
}
```

### Authenticated Content Caching

**User-Specific Data:**
- No caching for user profiles
- No caching for saved posts
- No caching for messages
- Always fetch fresh data

```typescript
// ✅ CORRECT: No caching for user data
export const dynamic = 'force-dynamic'; // Disable caching

export default async function SavedPostsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  const savedPosts = await getSavedPosts(user.id);
  return <SavedPostsList posts={savedPosts} />;
}
```

### Community Content Caching

**Public Community Posts:**
- Cache for 5 minutes (stale-while-revalidate)
- Revalidate on new post creation
- User-specific views: No caching

```typescript
// ✅ CORRECT: Community content caching
export const revalidate = 300; // 5 minutes

export default async function CommunityPage() {
  const posts = await getCommunityPosts();
  return <CommunityList posts={posts} />;
}
```

### Image Caching

**Uploaded Images:**
- CDN cache with signed URLs
- Signed URLs expire after 1 hour
- Regenerate signed URLs on access
- Privacy-aware caching

```typescript
// ✅ CORRECT: Image caching with signed URLs
async function getImageUrl(imagePath: string, userId: string) {
  const { data, error } = await supabase.storage
    .from('post-images')
    .createSignedUrl(imagePath, 3600); // 1 hour expiry
    
  if (error) throw error;
  return data.signedUrl;
}
```

## Access Control Matrix

| Feature | Anonymous | Authenticated | Trial | Subscribed | Admin |
|---------|-----------|---------------|-------|------------|-------|
| Marketing pages | ✅ | ✅ | ✅ | ✅ | ✅ |
| WordPress blog | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ✅ | ✅ | ✅ |
| Profile settings | ❌ | ✅ | ✅ | ✅ | ✅ |
| Saved posts | ❌ | ✅ | ✅ | ✅ | ✅ |
| Read 3 posts/day | ❌ | ❌ | ❌ | ✅ | ✅ |
| Read unlimited posts | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create posts | ❌ | ❌ | ✅ | ✅ | ✅ |
| Messaging | ❌ | ❌ | ✅ | ✅ | ✅ |
| Image uploads | ❌ | ✅ | ✅ | ✅ | ✅ |
| Admin dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |

## Route Protection Examples

### Middleware Protection

```typescript
// ✅ CORRECT: Middleware route protection
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Public routes
  const publicRoutes = ['/', '/blog', '/about', '/pricing', '/login', '/signup'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Protected routes - require auth
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Subscription-gated routes
  const subscriptionRoutes = ['/posts/create', '/messages'];
  if (subscriptionRoutes.some(route => pathname.startsWith(route))) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, trial_end')
      .eq('user_id', user.id)
      .single();
      
    const isTrialValid = subscription?.trial_end && 
      new Date(subscription.trial_end) > new Date();
    const isSubscribed = subscription?.status === 'active';
    
    if (!isTrialValid && !isSubscribed) {
      return NextResponse.redirect(new URL('/subscribe', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### Server Component Protection

```typescript
// ✅ CORRECT: Server Component protection
export default async function ProtectedPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  // Check subscription for premium features
  try {
    await requireSubscription(user.id);
  } catch (error) {
    redirect('/subscribe');
  }
  
  return <PremiumContent />;
}
```

## Summary

### Anonymous Access
- ✅ Marketing pages
- ✅ WordPress blog (list + detail)
- ❌ All user-generated content
- ❌ All authenticated features

### Authenticated Access
- ✅ Saved posts
- ✅ Profile settings
- ✅ Image uploads
- ❌ Messaging (requires subscription)
- ❌ Post creation (requires subscription after trial)

### Subscription-Gated Access
- ✅ Unlimited post reading (after trial: 3/day limit)
- ✅ Post creation (after trial: requires subscription)
- ✅ Messaging (after trial: requires subscription)
- ✅ Unlimited saved posts (after trial: requires subscription)

### Security Constraints
- ✅ Non-enumerating behavior (generic 404s)
- ✅ Safe error messages (no sensitive info)
- ✅ Appropriate caching (public vs private)

---

**Related Documents:**
- [AUTH_CONTRACT.md](./AUTH_CONTRACT.md)
- [DATA_ACCESS_QUERY_CONTRACT.md](./DATA_ACCESS_QUERY_CONTRACT.md)
- [BILLING_STRIPE_CONTRACT.md](./BILLING_STRIPE_CONTRACT.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [ARCHITECTURE_CONSTITUTION.md](./../ARCHITECTURE_CONSTITUTION.md)
