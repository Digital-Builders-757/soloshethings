# Data Access Query Contract

**Purpose:** Query patterns, RLS enforcement, explicit selects, and consistent return shapes for all Supabase data access in SoloSheThings.

## Non-Negotiables

1. **No select('*')** - MUST always specify columns explicitly. Never use `select('*')`.
2. **Explicit Fields Only** - MUST list every column needed in the select statement.
3. **Prefer .maybeSingle()** - Use `.maybeSingle()` when 0 rows is a valid result. Use `.single()` only when exactly 1 row is required.
4. **Server-Only Client for Privileged Reads** - Use server-only Supabase client for admin/privileged operations.
5. **Consistent Return Shapes** - All query functions MUST return consistent shapes with typed errors.
6. **RLS Always On** - All queries are subject to RLS policies. No exceptions.
7. **Error Handling** - All queries MUST handle errors appropriately with consistent error objects.

## Query Patterns

### List Queries

**Pattern:** Fetch multiple rows with explicit columns, ordering, and limits.

```typescript
// ✅ CORRECT: List query with explicit columns
async function getCommunityPosts(limit = 20): Promise<{
  data: CommunityPost[] | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('id, title, content, author_id, status, created_at, updated_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch community posts:', error);
    return { data: null, error: new Error('Failed to fetch posts') };
  }

  return { data, error: null };
}
```

**Return Shape:**
```typescript
interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}
```

### Detail Queries (Use .maybeSingle())

**Pattern:** Fetch single row when 0 rows is valid (e.g., optional profile, optional saved post).

```typescript
// ✅ CORRECT: Use .maybeSingle() when 0 rows is valid
async function getProfile(userId: string): Promise<{
  data: Profile | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, bio, avatar_url, role, privacy_level, created_at')
    .eq('id', userId)
    .maybeSingle(); // Returns null if not found, doesn't throw

  if (error) {
    console.error('Failed to fetch profile:', error);
    return { data: null, error: new Error('Failed to fetch profile') };
  }

  return { data, error: null };
}
```

**When to Use .maybeSingle():**
- Optional resources (profile might not exist)
- User preferences (might not be set)
- Saved posts (might not be saved)
- Any query where "not found" is a valid state

### Detail Queries (Use .single())

**Pattern:** Fetch single row when exactly 1 row is required (e.g., own profile, own subscription).

```typescript
// ✅ CORRECT: Use .single() when exactly 1 row is required
async function getOwnProfile(userId: string): Promise<{
  data: Profile;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, bio, avatar_url, role, privacy_level, created_at')
    .eq('id', userId)
    .single(); // Throws if 0 or >1 rows

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found - this shouldn't happen for own profile
      console.error('Profile not found for user:', userId);
      return { data: null as any, error: new Error('Profile not found') };
    }
    console.error('Failed to fetch profile:', error);
    return { data: null as any, error: new Error('Failed to fetch profile') };
  }

  return { data, error: null };
}
```

**When to Use .single():**
- Own profile (should always exist)
- Own subscription (should always exist after signup)
- Resources that MUST exist for the operation to succeed

### Insert Queries

**Pattern:** Insert with minimal returning (only what's needed).

```typescript
// ✅ CORRECT: Insert with explicit returning columns
async function createPost(
  authorId: string,
  title: string,
  content: string
): Promise<{
  data: { id: string; created_at: string } | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: authorId,
      title: title.trim(),
      content: content.trim(),
      status: 'published',
    })
    .select('id, created_at') // Minimal returning
    .single();

  if (error) {
    if (error.code === '23505') {
      // Unique constraint violation
      return { data: null, error: new Error('Duplicate entry') };
    }
    if (error.code === '23502') {
      // Not null constraint violation
      return { data: null, error: new Error('Required field missing') };
    }
    console.error('Failed to create post:', error);
    return { data: null, error: new Error('Failed to create post') };
  }

  return { data, error: null };
}
```

**Return Shape:**
```typescript
interface InsertResult<T> {
  data: T | null;
  error: Error | null;
}
```

### Update Queries

**Pattern:** Update with explicit returning columns.

```typescript
// ✅ CORRECT: Update with explicit returning columns
async function updateProfile(
  userId: string,
  updates: {
    username?: string;
    full_name?: string;
    bio?: string;
  }
): Promise<{
  data: Profile | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: updates.username?.trim(),
      full_name: updates.full_name?.trim(),
      bio: updates.bio?.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, username, full_name, bio, avatar_url, role, privacy_level, updated_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      // Unique constraint violation (e.g., username taken)
      return { data: null, error: new Error('Username already taken') };
    }
    console.error('Failed to update profile:', error);
    return { data: null, error: new Error('Failed to update profile') };
  }

  return { data, error: null };
}
```

**Return Shape:**
```typescript
interface UpdateResult<T> {
  data: T | null;
  error: Error | null;
}
```

### Delete Queries

**Pattern:** Delete with error handling (no returning needed for simple deletes).

```typescript
// ✅ CORRECT: Delete with error handling
async function deleteSavedPost(
  userId: string,
  savedPostId: string
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  const { error } = await supabase
    .from('saved_posts')
    .delete()
    .eq('id', savedPostId)
    .eq('user_id', userId); // RLS enforces this, but explicit for clarity

  if (error) {
    console.error('Failed to delete saved post:', error);
    return { success: false, error: new Error('Failed to delete saved post') };
  }

  return { success: true, error: null };
}
```

**Return Shape:**
```typescript
interface DeleteResult {
  success: boolean;
  error: Error | null;
}
```

**Delete with Returning (when needed):**
```typescript
// ✅ CORRECT: Delete with returning when data is needed
async function deletePost(
  userId: string,
  postId: string
): Promise<{
  data: { id: string } | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', userId)
    .select('id')
    .single();

  if (error) {
    console.error('Failed to delete post:', error);
    return { data: null, error: new Error('Failed to delete post') };
  }

  return { data, error: null };
}
```

## Server-Only Supabase Client for Privileged Reads

### When to Use Server-Only Client

**MUST Use Server-Only Client For:**
- Admin operations (reading all users, all posts)
- Moderation operations (reading reports, resolving content)
- System operations (analytics, bulk operations)
- Operations that bypass RLS (when necessary, with caution)

**MUST NOT Use Server-Only Client For:**
- Regular user queries (use anon key with RLS)
- Client-side operations
- Public data access

### Server-Only Client Pattern

```typescript
// ✅ CORRECT: Server-only client for admin operations
// lib/supabase-admin.ts (server-only)
import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient> | null = null;

export function getAdminClient() {
  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    
    adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  
  return adminClient;
}
```

### Admin Query Example

```typescript
// ✅ CORRECT: Admin query using server-only client
async function getAllReports(): Promise<{
  data: Report[] | null;
  error: Error | null;
}> {
  const adminClient = getAdminClient();
  
  const { data, error } = await adminClient
    .from('reports')
    .select('id, reporter_id, reported_post_id, reason, status, created_at, resolved_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Failed to fetch reports:', error);
    return { data: null, error: new Error('Failed to fetch reports') };
  }

  return { data, error: null };
}
```

**Security Rules:**
- Server-only client MUST never be exported to client code
- Service role key MUST only exist in server-side code
- Admin operations MUST be in Server Actions or API routes only
- Always prefer RLS with anon key when possible

## Consistent Return Shapes

### Standard Return Shape

**All query functions MUST return:**
```typescript
interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}
```

**For operations that don't return data:**
```typescript
interface OperationResult {
  success: boolean;
  error: Error | null;
}
```

### Error Object Consistency

**MUST:**
- Always return `Error | null` (not raw Supabase errors)
- Create user-safe error messages
- Log detailed errors server-side
- Use consistent error codes/messages

```typescript
// ✅ CORRECT: Consistent error handling
function handleSupabaseError(error: any): Error {
  // Log detailed error server-side
  console.error('Supabase error:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  // Return user-safe error
  if (error.code === 'PGRST116') {
    return new Error('Resource not found');
  }
  if (error.code === '42501') {
    return new Error('Access denied');
  }
  if (error.code === '23505') {
    return new Error('Duplicate entry');
  }
  if (error.code === '23502') {
    return new Error('Required field missing');
  }

  return new Error('Operation failed');
}
```

## Complete Examples

### Example 1: List Community Posts

```typescript
// ✅ CORRECT: Complete list query
async function getCommunityPosts(options?: {
  limit?: number;
  offset?: number;
  status?: 'published' | 'draft';
}): Promise<{
  data: CommunityPost[] | null;
  error: Error | null;
}> {
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;
  const status = options?.status ?? 'published';

  const { data, error } = await supabase
    .from('community_posts')
    .select('id, title, content, author_id, status, created_at, updated_at')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Failed to fetch community posts:', error);
    return { data: null, error: handleSupabaseError(error) };
  }

  return { data, error: null };
}
```

### Example 2: Get Saved Post (Optional)

```typescript
// ✅ CORRECT: Optional resource with .maybeSingle()
async function getSavedPost(
  userId: string,
  postType: 'wordpress' | 'community',
  postId: string
): Promise<{
  data: SavedPost | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('saved_posts')
    .select('id, user_id, post_type, wp_post_slug, community_post_id, created_at')
    .eq('user_id', userId)
    .eq('post_type', postType)
    .eq(
      postType === 'wordpress' ? 'wp_post_slug' : 'community_post_id',
      postId
    )
    .maybeSingle(); // 0 rows is valid (not saved)

  if (error) {
    console.error('Failed to fetch saved post:', error);
    return { data: null, error: handleSupabaseError(error) };
  }

  return { data, error: null };
}
```

### Example 3: Create Post with Images

```typescript
// ✅ CORRECT: Transaction-like pattern for related inserts
async function createPostWithImages(
  authorId: string,
  postData: {
    title: string;
    content: string;
  },
  images: Array<{ url: string; storagePath: string; altText?: string }>
): Promise<{
  data: { post: CommunityPost; images: PostImage[] } | null;
  error: Error | null;
}> {
  // 1. Create post
  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .insert({
      author_id: authorId,
      title: postData.title.trim(),
      content: postData.content.trim(),
      status: 'published',
    })
    .select('id, title, content, author_id, status, created_at')
    .single();

  if (postError) {
    console.error('Failed to create post:', postError);
    return { data: null, error: handleSupabaseError(postError) };
  }

  // 2. Create images (if any)
  if (images.length > 0) {
    const { data: postImages, error: imagesError } = await supabase
      .from('post_images')
      .insert(
        images.map((img, index) => ({
          post_id: post.id,
          image_url: img.url,
          storage_path: img.storagePath,
          alt_text: img.altText ?? null,
          order: index,
        }))
      )
      .select('id, post_id, image_url, storage_path, alt_text, order');

    if (imagesError) {
      // Rollback: Delete post if images fail
      await supabase.from('community_posts').delete().eq('id', post.id);
      console.error('Failed to create images:', imagesError);
      return { data: null, error: handleSupabaseError(imagesError) };
    }

    return { data: { post, images: postImages }, error: null };
  }

  return { data: { post, images: [] }, error: null };
}
```

### Example 4: Update Profile

```typescript
// ✅ CORRECT: Update with validation
async function updateProfile(
  userId: string,
  updates: {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
  }
): Promise<{
  data: Profile | null;
  error: Error | null;
}> {
  // Validate bio length
  if (updates.bio && updates.bio.length > 500) {
    return { data: null, error: new Error('Bio must be 500 characters or less') };
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: updates.username?.trim(),
      full_name: updates.full_name?.trim(),
      bio: updates.bio?.trim(),
      avatar_url: updates.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, username, full_name, bio, avatar_url, role, privacy_level, created_at, updated_at')
    .single();

  if (error) {
    console.error('Failed to update profile:', error);
    return { data: null, error: handleSupabaseError(error) };
  }

  return { data, error: null };
}
```

### Example 5: Delete with Cascade Check

```typescript
// ✅ CORRECT: Delete with related data check
async function deletePost(
  userId: string,
  postId: string
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  // Verify ownership
  const { data: post, error: checkError } = await supabase
    .from('community_posts')
    .select('id, author_id')
    .eq('id', postId)
    .single();

  if (checkError) {
    console.error('Failed to verify post ownership:', checkError);
    return { success: false, error: handleSupabaseError(checkError) };
  }

  if (post.author_id !== userId) {
    return { success: false, error: new Error('Access denied') };
  }

  // Delete post (images cascade via FK)
  const { error: deleteError } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId);

  if (deleteError) {
    console.error('Failed to delete post:', deleteError);
    return { success: false, error: handleSupabaseError(deleteError) };
  }

  return { success: true, error: null };
}
```

## Relationship Queries

### Join Queries

```typescript
// ✅ CORRECT: Join with explicit columns
async function getPostWithAuthor(postId: string): Promise<{
  data: (CommunityPost & { author: Profile }) | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      id,
      title,
      content,
      author_id,
      status,
      created_at,
      profiles!community_posts_author_id_fkey (
        id,
        username,
        avatar_url
      )
    `)
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Failed to fetch post with author:', error);
    return { data: null, error: handleSupabaseError(error) };
  }

  return { data, error: null };
}
```

## Error Handling Patterns

### Standard Error Handler

```typescript
// ✅ CORRECT: Standard error handler
function handleSupabaseError(error: any): Error {
  // Log detailed error
  console.error('Supabase error:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  // Map to user-safe errors
  const errorMap: Record<string, string> = {
    'PGRST116': 'Resource not found',
    '42501': 'Access denied',
    '23505': 'Duplicate entry',
    '23502': 'Required field missing',
    '23503': 'Foreign key violation',
    '23514': 'Check constraint violation',
  };

  const userMessage = errorMap[error.code] || 'Operation failed';
  return new Error(userMessage);
}
```

## Query Security Checklist

Before writing a query:

- [ ] Explicit column selection (no `select('*')`)
- [ ] Used `.maybeSingle()` when 0 rows is valid
- [ ] Used `.single()` only when exactly 1 row is required
- [ ] RLS policies are defined for the table
- [ ] User authentication checked (if needed)
- [ ] Error handling implemented with consistent return shape
- [ ] Results limited (if applicable)
- [ ] Indexes used for filtering
- [ ] No service role key used (unless admin operation)
- [ ] Input validation before query
- [ ] Consistent return shape (`{ data, error }`)

## Common Anti-Patterns

### ❌ WRONG: Select All

```typescript
// ❌ WRONG
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### ❌ WRONG: Wrong Single Method

```typescript
// ❌ WRONG: Using .single() when 0 rows is valid
const { data } = await supabase
  .from('saved_posts')
  .select('id, user_id')
  .eq('user_id', userId)
  .eq('post_type', 'wordpress')
  .eq('wp_post_slug', slug)
  .single(); // Will throw if not saved - should use .maybeSingle()
```

### ❌ WRONG: Inconsistent Return Shape

```typescript
// ❌ WRONG: Inconsistent return shape
async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', userId)
    .single();
  
  return data; // Should return { data, error }
}
```

### ❌ WRONG: Service Role for User Queries

```typescript
// ❌ WRONG: Using service role for regular user query
const adminClient = getAdminClient();
const { data } = await adminClient
  .from('profiles')
  .select('id, username')
  .eq('id', userId)
  .single();
// Should use anon key with RLS
```

### ❌ WRONG: No Error Handling

```typescript
// ❌ WRONG: No error handling
const { data } = await supabase
  .from('profiles')
  .select('id, username')
  .eq('id', userId)
  .single();
// No error check
```

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [database_schema_audit.md](./../database_schema_audit.md)
- [CODING_STANDARDS.md](./../CODING_STANDARDS.md)
- [AUTH_CONTRACT.md](./AUTH_CONTRACT.md)
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
