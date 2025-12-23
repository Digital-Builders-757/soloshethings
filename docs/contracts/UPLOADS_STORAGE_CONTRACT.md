# Uploads & Storage Contract

**Purpose:** File upload rules, storage buckets, path conventions, privacy toggles, signed URLs, and moderation hooks for SoloSheThings.

## Non-Negotiables

1. **RLS on Storage** - All storage buckets MUST have RLS policies enabled.
2. **File Type Validation** - Only allowed file types can be uploaded (client + server validation).
3. **Size Limits** - File size limits MUST be enforced (client + server).
4. **User Ownership** - Users can only upload to their own folders.
5. **Privacy Enforcement** - Storage access respects content privacy settings.
6. **Signed URLs for Private Content** - Private content MUST use signed URLs with expiration.
7. **Metadata Tracking** - All uploaded files MUST have corresponding database records.

## Storage Buckets

### avatars

**Purpose:** User profile avatars.

**Configuration:**
- **Public:** No (access via signed URLs or RLS)
- **File Size Limit:** 2MB per file
- **Allowed Types:** `image/jpeg`, `image/png`, `image/webp`
- **Auto-optimize:** Yes (via Next.js Image component)
- **RLS:** Enabled

**Path Convention:**
```
avatars/
  {userId}/
    {timestamp}-{uuid}.{ext}
```

**Example:**
```
avatars/
  550e8400-e29b-41d4-a716-446655440000/
    1706284800000-a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
```

### post-images

**Purpose:** Images attached to community posts.

**Configuration:**
- **Public:** No (access via signed URLs or RLS based on post privacy)
- **File Size Limit:** 5MB per file
- **Allowed Types:** `image/jpeg`, `image/png`, `image/webp`
- **Max Files per Post:** 10
- **Auto-optimize:** Yes (via Next.js Image component)
- **RLS:** Enabled

**Path Convention:**
```
post-images/
  {userId}/
    {date}/
      {postId}/
        {order}-{uuid}.{ext}
```

**Date Format:** `YYYY-MM-DD` (e.g., `2024-01-27`)

**Example:**
```
post-images/
  550e8400-e29b-41d4-a716-446655440000/
    2024-01-27/
      a1b2c3d4-e5f6-7890-abcd-ef1234567890/
        0-a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
        1-b2c3d4e5-f6a7-8901-bcde-f23456789012.png
```

### creator-media (Private)

**Purpose:** Private creator content (future: workshops, exclusive content).

**Configuration:**
- **Public:** No (always private, signed URLs only)
- **File Size Limit:** 10MB per file
- **Allowed Types:** `image/jpeg`, `image/png`, `image/webp`, `video/mp4` (future)
- **RLS:** Enabled (strict)
- **Access:** Creator + subscribers only

**Path Convention:**
```
creator-media/
  {userId}/
    {date}/
      {contentType}/
        {uuid}.{ext}
```

**Content Types:** `workshops`, `exclusive`, `tutorials`

**Example:**
```
creator-media/
  550e8400-e29b-41d4-a716-446655440000/
    2024-01-27/
      workshops/
        a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg
```

## Path Conventions

### Standard Path Structure

**Format:**
```
{bucket}/
  {userId}/
    {date}/
      {resourceId}/
        {order}-{uuid}.{ext}
```

**Components:**
- `{bucket}` - Bucket name (avatars, post-images, creator-media)
- `{userId}` - UUID of the user (from `auth.users.id`)
- `{date}` - Date in `YYYY-MM-DD` format (optional for avatars)
- `{resourceId}` - UUID of related resource (post_id, etc.)
- `{order}` - Integer for ordering (0-based, optional)
- `{uuid}` - Unique identifier for the file
- `{ext}` - File extension (jpg, png, webp)

### Path Generation Helper

```typescript
// ✅ CORRECT: Generate consistent paths
function generateStoragePath(
  bucket: 'avatars' | 'post-images' | 'creator-media',
  userId: string,
  options: {
    date?: string; // YYYY-MM-DD
    resourceId?: string; // post_id, etc.
    order?: number;
    uuid?: string;
    ext: string;
  }
): string {
  const date = options.date || new Date().toISOString().split('T')[0];
  const uuid = options.uuid || crypto.randomUUID();
  const order = options.order !== undefined ? `${options.order}-` : '';
  
  if (bucket === 'avatars') {
    return `${userId}/${Date.now()}-${uuid}.${options.ext}`;
  }
  
  if (bucket === 'post-images' && options.resourceId) {
    return `${userId}/${date}/${options.resourceId}/${order}${uuid}.${options.ext}`;
  }
  
  if (bucket === 'creator-media' && options.resourceId) {
    return `${userId}/${date}/${options.resourceId}/${uuid}.${options.ext}`;
  }
  
  throw new Error('Invalid path generation parameters');
}
```

## Privacy Toggle Model

### Privacy Levels

**Three Levels:**
1. **Public** - Accessible to all authenticated users
2. **Limited** - Accessible to connections/followers (future feature)
3. **Private** - Accessible only to owner

### Privacy Inheritance

**Images inherit privacy from their parent resource:**
- Post images inherit from `community_posts.is_public`
- Creator media uses `profiles.privacy_level` or explicit setting

### Privacy-Aware Access Pattern

```typescript
// ✅ CORRECT: Privacy-aware image access
async function getImageUrl(
  imageId: string,
  requestingUserId: string | null
): Promise<{
  url: string;
  isPublic: boolean;
  expiresAt?: string;
}> {
  // Fetch image with post privacy
  const { data: image, error } = await supabase
    .from('post_images')
    .select(`
      id,
      storage_path,
      image_url,
      post_id,
      community_posts!inner (
        id,
        is_public,
        author_id,
        status
      )
    `)
    .eq('id', imageId)
    .single();

  if (error || !image) {
    throw new Error('Image not found');
  }

  const post = image.community_posts;
  const isOwner = requestingUserId === post.author_id;
  const isPublic = post.is_public && post.status === 'published';

  // Owner always has access
  if (isOwner) {
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(image.storage_path);
    return { url: urlData.publicUrl, isPublic: true };
  }

  // Public posts: use public URL
  if (isPublic) {
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(image.storage_path);
    return { url: urlData.publicUrl, isPublic: true };
  }

  // Private posts: use signed URL
  const expiresIn = 3600; // 1 hour
  const { data: signedUrl, error: signedError } = await supabase.storage
    .from('post-images')
    .createSignedUrl(image.storage_path, expiresIn);

  if (signedError) {
    throw new Error('Failed to generate signed URL');
  }

  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  return {
    url: signedUrl.signedUrl,
    isPublic: false,
    expiresAt,
  };
}
```

## Metadata Table Design

### post_images Table

**Schema:**
```sql
CREATE TABLE post_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  image_url text NOT NULL, -- Public URL or signed URL
  storage_path text NOT NULL, -- Bucket path
  alt_text text CHECK (char_length(alt_text) <= 200),
  "order" integer NOT NULL DEFAULT 0,
  privacy_level privacy_level NOT NULL DEFAULT 'public', -- Inherited from post
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Indexes:**
```sql
CREATE INDEX post_images_post_id_idx ON post_images(post_id);
CREATE INDEX post_images_order_idx ON post_images(post_id, "order");
CREATE INDEX post_images_privacy_level_idx ON post_images(privacy_level);
```

**RLS Policies:**
```sql
-- Users can view images for accessible posts
CREATE POLICY "Users can view images for accessible posts"
  ON post_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND (
        (cp.is_public = true AND cp.status = 'published')
        OR cp.author_id = auth.uid()
      )
    )
  );

-- Users can create images for own posts
CREATE POLICY "Users can create images for own posts"
  ON post_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND cp.author_id = auth.uid()
    )
  );

-- Users can delete images for own posts
CREATE POLICY "Users can delete images for own posts"
  ON post_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM community_posts cp
      WHERE cp.id = post_images.post_id
      AND cp.author_id = auth.uid()
    )
  );
```

## Signed URL Rules + Expiration

### Signed URL Rules

**MUST Use Signed URLs For:**
- Private post images (when `is_public = false`)
- Creator media (always private)
- Any content with `privacy_level = 'private'`
- Any content with `privacy_level = 'limited'` (future)

**MUST NOT Use Signed URLs For:**
- Public post images (when `is_public = true`)
- Public avatars (if public profile)

### Expiration Rules

**Default Expiration:**
- **Post Images:** 1 hour (3600 seconds)
- **Creator Media:** 1 hour (3600 seconds)
- **Avatars:** 24 hours (86400 seconds) if private

**Regeneration:**
- Signed URLs MUST be regenerated when expired
- Client SHOULD request new signed URL before expiration
- Server SHOULD cache signed URLs for request duration

### Signed URL Generation

```typescript
// ✅ CORRECT: Generate signed URL with expiration
async function generateSignedUrl(
  bucket: 'post-images' | 'creator-media' | 'avatars',
  storagePath: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{
  url: string;
  expiresAt: string;
}> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    console.error('Failed to generate signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }

  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  
  return {
    url: data.signedUrl,
    expiresAt,
  };
}
```

### Signed URL Caching

```typescript
// ✅ CORRECT: Cache signed URLs (server-side only)
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();

async function getCachedSignedUrl(
  bucket: string,
  storagePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const cacheKey = `${bucket}:${storagePath}`;
  const cached = signedUrlCache.get(cacheKey);

  // Return cached URL if not expired (with 5 minute buffer)
  if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cached.url;
  }

  // Generate new signed URL
  const { url, expiresAt } = await generateSignedUrl(
    bucket as any,
    storagePath,
    expiresIn
  );

  // Cache it
  signedUrlCache.set(cacheKey, {
    url,
    expiresAt: new Date(expiresAt).getTime(),
  });

  return url;
}
```

## Upload Patterns

### Avatar Upload

```typescript
// ✅ CORRECT: Avatar upload with validation
'use server';

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{
  data: { url: string; storagePath: string } | null;
  error: Error | null;
}> {
  // Validate file type
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { data: null, error: new Error('Invalid file type') };
  }

  // Validate file size (2MB)
  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { data: null, error: new Error('File too large (max 2MB)') };
  }

  // Generate path
  const ext = file.name.split('.').pop() || 'jpg';
  const storagePath = generateStoragePath('avatars', userId, { ext });

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: true, // Allow overwriting existing avatar
    });

  if (uploadError) {
    console.error('Avatar upload failed:', uploadError);
    return { data: null, error: new Error('Upload failed') };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(storagePath);

  return {
    data: {
      url: urlData.publicUrl,
      storagePath,
    },
    error: null,
  };
}
```

### Post Image Upload

```typescript
// ✅ CORRECT: Post image upload with metadata
'use server';

export async function uploadPostImages(
  files: File[],
  userId: string,
  postId: string
): Promise<{
  data: PostImage[] | null;
  error: Error | null;
}> {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 10;

  if (files.length > MAX_FILES) {
    return { data: null, error: new Error(`Maximum ${MAX_FILES} images allowed`) };
  }

  // Verify post ownership
  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('id, author_id, is_public')
    .eq('id', postId)
    .single();

  if (postError || !post || post.author_id !== userId) {
    return { data: null, error: new Error('Unauthorized') };
  }

  // Upload all files
  const uploads = await Promise.all(
    files.map(async (file, index) => {
      // Validate
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`File ${index + 1}: Invalid file type`);
      }
      if (file.size > MAX_SIZE) {
        throw new Error(`File ${index + 1}: File too large`);
      }

      // Generate path
      const ext = file.name.split('.').pop() || 'jpg';
      const date = new Date().toISOString().split('T')[0];
      const storagePath = generateStoragePath('post-images', userId, {
        date,
        resourceId: postId,
        order: index,
        ext,
      });

      // Upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`File ${index + 1}: Upload failed`);
      }

      // Get URL (public or signed based on post privacy)
      let imageUrl: string;
      if (post.is_public) {
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(storagePath);
        imageUrl = urlData.publicUrl;
      } else {
        const { data: signedData } = await supabase.storage
          .from('post-images')
          .createSignedUrl(storagePath, 3600);
        imageUrl = signedData.signedUrl;
      }

      return {
        storage_path: storagePath,
        image_url: imageUrl,
        order: index,
        privacy_level: post.is_public ? 'public' : 'private',
      };
    })
  );

  // Save to database
  const { data: images, error: dbError } = await supabase
    .from('post_images')
    .insert(
      uploads.map((upload) => ({
        post_id: postId,
        image_url: upload.image_url,
        storage_path: upload.storage_path,
        order: upload.order,
        privacy_level: upload.privacy_level,
      }))
    )
    .select('id, post_id, image_url, storage_path, alt_text, order, created_at');

  if (dbError) {
    // Rollback: Delete uploaded files
    const paths = uploads.map((u) => u.storage_path);
    await supabase.storage.from('post-images').remove(paths);
    return { data: null, error: new Error('Failed to save image metadata') };
  }

  return { data: images, error: null };
}
```

## Moderation Hooks

### Report Hook

**When a post/image is reported:**
1. Create report record in `reports` table
2. Flag associated images for review
3. Optionally hide content pending review

```typescript
// ✅ CORRECT: Report hook for images
'use server';

export async function reportImage(
  imageId: string,
  reporterId: string,
  reason: 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'other'
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  // Get image with post info
  const { data: image, error: imageError } = await supabase
    .from('post_images')
    .select('id, post_id, community_posts!inner(id, author_id)')
    .eq('id', imageId)
    .single();

  if (imageError || !image) {
    return { success: false, error: new Error('Image not found') };
  }

  // Create report
  const { error: reportError } = await supabase
    .from('reports')
    .insert({
      reporter_id: reporterId,
      reported_post_id: image.post_id,
      reported_image_id: imageId,
      reason,
      status: 'pending',
    })
    .select('id')
    .single();

  if (reportError) {
    console.error('Failed to create report:', reportError);
    return { success: false, error: new Error('Failed to create report') };
  }

  return { success: true, error: null };
}
```

### Takedown Hook

**When content is taken down:**
1. Update post/image status to 'removed'
2. Optionally delete files from storage
3. Notify content owner

```typescript
// ✅ CORRECT: Takedown hook for images
'use server';

export async function takedownImage(
  imageId: string,
  adminId: string,
  reason: string
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  // Verify admin
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminId)
    .single();

  if (adminProfile?.role !== 'admin') {
    return { success: false, error: new Error('Unauthorized') };
  }

  // Get image
  const { data: image, error: imageError } = await supabase
    .from('post_images')
    .select('id, storage_path, post_id')
    .eq('id', imageId)
    .single();

  if (imageError || !image) {
    return { success: false, error: new Error('Image not found') };
  }

  // Option 1: Soft delete (mark as removed, keep files)
  const { error: updateError } = await supabase
    .from('post_images')
    .update({ status: 'removed' }) // Add status column if needed
    .eq('id', imageId);

  if (updateError) {
    return { success: false, error: new Error('Failed to remove image') };
  }

  // Option 2: Hard delete (remove files and records)
  // Uncomment if hard delete is required:
  // await supabase.storage.from('post-images').remove([image.storage_path]);
  // await supabase.from('post_images').delete().eq('id', imageId);

  // Log takedown
  console.log('Image takedown:', {
    imageId,
    adminId,
    reason,
    timestamp: new Date().toISOString(),
  });

  return { success: true, error: null };
}
```

### Auto-Moderation (Future)

**Potential hooks:**
- Image content analysis (NSFW detection)
- Duplicate detection
- Spam pattern detection
- Automatic flagging for review

## Storage RLS Policies

### Bucket Policies

```sql
-- Avatars: Users can upload/view own avatars
CREATE POLICY "Users can upload own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own avatars"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Post Images: Users can upload to own posts
CREATE POLICY "Users can upload to own posts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Post Images: Users can view public post images
CREATE POLICY "Users can view public post images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'post-images' AND
    EXISTS (
      SELECT 1 FROM post_images pi
      JOIN community_posts cp ON pi.post_id = cp.id
      WHERE pi.storage_path = storage.objects.name
      AND (
        (cp.is_public = true AND cp.status = 'published')
        OR cp.author_id = auth.uid()
      )
    )
  );

-- Creator Media: Users can upload own media
CREATE POLICY "Users can upload own creator media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'creator-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Creator Media: Users can view own media (subscribers via separate check)
CREATE POLICY "Users can view own creator media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'creator-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## File Deletion & Cleanup

### Delete Post Image

```typescript
// ✅ CORRECT: Delete image with cleanup
'use server';

export async function deletePostImage(
  imageId: string,
  userId: string
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  // Get image with ownership check
  const { data: image, error: imageError } = await supabase
    .from('post_images')
    .select('id, storage_path, post_id, community_posts!inner(author_id)')
    .eq('id', imageId)
    .single();

  if (imageError || !image) {
    return { success: false, error: new Error('Image not found') };
  }

  // Verify ownership
  if (image.community_posts.author_id !== userId) {
    return { success: false, error: new Error('Unauthorized') };
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('post-images')
    .remove([image.storage_path]);

  if (storageError) {
    console.error('Failed to delete from storage:', storageError);
    // Continue with DB deletion even if storage fails
  }

  // Delete database record
  const { error: dbError } = await supabase
    .from('post_images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    return { success: false, error: new Error('Failed to delete image') };
  }

  return { success: true, error: null };
}
```

### Cleanup Orphaned Files

```typescript
// ✅ CORRECT: Cleanup orphaned files (admin operation)
'use server';

export async function cleanupOrphanedFiles(): Promise<{
  cleaned: number;
  error: Error | null;
}> {
  // Get all storage files
  const { data: files, error: listError } = await supabase.storage
    .from('post-images')
    .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'asc' } });

  if (listError) {
    return { cleaned: 0, error: new Error('Failed to list files') };
  }

  // Get all database records
  const { data: dbImages } = await supabase
    .from('post_images')
    .select('storage_path');

  const dbPaths = new Set(dbImages?.map((img) => img.storage_path) || []);
  const orphanedPaths = files
    ?.filter((file) => !dbPaths.has(file.name))
    .map((file) => file.name) || [];

  if (orphanedPaths.length === 0) {
    return { cleaned: 0, error: null };
  }

  // Delete orphaned files
  const { error: deleteError } = await supabase.storage
    .from('post-images')
    .remove(orphanedPaths);

  if (deleteError) {
    return { cleaned: 0, error: new Error('Failed to delete orphaned files') };
  }

  return { cleaned: orphanedPaths.length, error: null };
}
```

## Security Checklist

Before implementing uploads:

- [ ] File type validation (client + server)
- [ ] File size limits enforced (client + server)
- [ ] RLS policies on all storage buckets
- [ ] User ownership verified
- [ ] Privacy settings respected
- [ ] Signed URLs for private content
- [ ] Signed URL expiration configured
- [ ] Metadata records created for all uploads
- [ ] Error handling implemented
- [ ] Image optimization configured
- [ ] Cleanup on deletion
- [ ] Moderation hooks implemented
- [ ] Takedown procedures documented

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [database_schema_audit.md](./../database_schema_audit.md)
- [DATABASE_REPORT.md](./../DATABASE_REPORT.md)
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- [DATA_ACCESS_QUERY_CONTRACT.md](./DATA_ACCESS_QUERY_CONTRACT.md)
