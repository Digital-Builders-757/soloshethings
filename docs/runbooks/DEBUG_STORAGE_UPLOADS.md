# Debug Storage Uploads Runbook

**Purpose:** Step-by-step debugging guide for file upload and storage access issues in SoloSheThings.

## Common Symptoms

1. **Upload Fails**
   - File upload returns error
   - "Permission denied" errors
   - "Bucket not found" errors
   - Upload progress stops

2. **Can't View Uploaded Files**
   - Images don't load
   - "Access denied" errors
   - 403 Forbidden errors
   - Broken image URLs

3. **Wrong File Access**
   - User can see other users' private files
   - Private files accessible without auth
   - Signed URLs not working

4. **File Deletion Fails**
   - Can't delete own files
   - "Permission denied" on delete
   - Files remain after deletion attempt

5. **Storage Policy Errors**
   - RLS policy violations
   - Bucket access denied
   - Path validation errors

## Likely Causes

### 1. Storage RLS Not Enabled

**Causes:**
- Bucket created without RLS
- RLS policies not created
- Storage policies missing

**Check:**
```sql
-- Check storage bucket RLS status
SELECT 
  name as bucket_name,
  public as is_public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name IN ('avatars', 'post-images', 'creator-media');
```

**Fix:**
```sql
-- Enable RLS on bucket (via Supabase dashboard or SQL)
-- Note: Storage RLS is enabled by default, but verify policies exist

-- Check storage policies
SELECT 
  name as policy_name,
  bucket_id,
  definition
FROM storage.policies
WHERE bucket_id IN ('avatars', 'post-images', 'creator-media');
```

### 2. Missing Storage Policies

**Causes:**
- Storage policies not created
- Policies dropped accidentally
- Wrong policy conditions

**Check:**
```sql
-- List storage policies
SELECT 
  name,
  bucket_id,
  definition,
  check_expression
FROM storage.policies
WHERE bucket_id = 'post-images';
```

**Fix:**
```sql
-- Create storage policies (via Supabase dashboard SQL editor)
CREATE POLICY "Users can upload to own posts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

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
```

### 3. Incorrect Path Structure

**Causes:**
- Path doesn't match user ID
- Path format incorrect
- Folder structure wrong

**Check:**
```typescript
// Verify path generation
function generateStoragePath(
  bucket: string,
  userId: string,
  options: { date?: string; resourceId?: string; ext: string }
): string {
  // Check path format matches policy expectations
  const path = `${userId}/${options.date}/${options.resourceId}/file.${options.ext}`;
  console.log('Generated path:', path);
  return path;
}
```

**Fix:**
```typescript
// Ensure path matches policy expectations
// Policy expects: bucket_id = 'post-images' AND auth.uid() = (storage.foldername(name))[1]
// So path must be: {userId}/{date}/{postId}/file.ext
const storagePath = `${userId}/${date}/${postId}/${filename}`;
```

### 4. Signed URL Generation Fails

**Causes:**
- Service role key not used
- URL expiration too short
- Path doesn't exist
- Bucket access denied

**Check:**
```typescript
// Test signed URL generation
async function testSignedUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from('post-images')
    .createSignedUrl(storagePath, 3600);
  
  if (error) {
    console.error('Signed URL error:', error.message, error.statusCode);
    return null;
  }
  
  return data.signedUrl;
}
```

**Fix:**
- Verify service role key is set
- Check file exists at path
- Verify bucket name is correct
- Check storage policies allow access

### 5. Privacy Settings Not Respected

**Causes:**
- Public URL used for private content
- Signed URL not generated
- Privacy check missing

**Check:**
```typescript
// Verify privacy-aware URL generation
async function getImageUrl(imageId: string, userId: string) {
  const { data: image } = await supabase
    .from('post_images')
    .select('storage_path, post_id, community_posts!inner(is_public, author_id)')
    .eq('id', imageId)
    .single();
  
  const post = image.community_posts;
  const isPublic = post.is_public;
  const isOwner = post.author_id === userId;
  
  if (isPublic || isOwner) {
    // Should use public URL
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(image.storage_path);
    return urlData.publicUrl;
  } else {
    // Should use signed URL
    const { data: signedData } = await supabase.storage
      .from('post-images')
      .createSignedUrl(image.storage_path, 3600);
    return signedData.signedUrl;
  }
}
```

**Fix:**
- Always check privacy before generating URL
- Use signed URLs for private content
- Verify privacy check logic

## Step-by-Step Checks

### Check 1: Verify Bucket Exists

```sql
-- Check bucket configuration
SELECT 
  name,
  id,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE name IN ('avatars', 'post-images', 'creator-media');
```

**Expected:** All buckets exist with correct configuration

**If Missing:**
- Create bucket via Supabase dashboard
- Or create via migration:
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('avatars', 'avatars', false, 2097152); -- 2MB
```

### Check 2: Verify Storage Policies Exist

```sql
-- Check storage policies
SELECT 
  name,
  bucket_id,
  definition,
  check_expression
FROM storage.policies
WHERE bucket_id IN ('avatars', 'post-images', 'creator-media')
ORDER BY bucket_id, name;
```

**Expected:** Each bucket has policies for INSERT, SELECT, DELETE

**If Missing:**
- Create policies (see Fix section above)
- Verify policies match path structure

### Check 3: Test Upload Permission

```typescript
// Test upload as authenticated user
async function testUpload(userId: string) {
  const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const storagePath = `${userId}/${Date.now()}-test.jpg`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(storagePath, testFile);
  
  if (error) {
    console.error('Upload error:', error.message, error.statusCode);
    return null;
  }
  
  return data;
}
```

**Expected:** Upload succeeds for own folder

**If Fails:**
- Check storage policies
- Verify path matches policy expectations
- Check file size/type limits

### Check 4: Test File Access

```typescript
// Test file access
async function testFileAccess(storagePath: string, userId: string) {
  // Test public URL
  const { data: publicUrl } = supabase.storage
    .from('post-images')
    .getPublicUrl(storagePath);
  
  // Test signed URL
  const { data: signedData, error } = await supabase.storage
    .from('post-images')
    .createSignedUrl(storagePath, 3600);
  
  if (error) {
    console.error('Signed URL error:', error.message);
    return null;
  }
  
  return { publicUrl: publicUrl.publicUrl, signedUrl: signedData.signedUrl };
}
```

**Expected:** URLs generated successfully

**If Fails:**
- Check file exists at path
- Verify storage policies
- Check bucket configuration

### Check 5: Verify Path Structure

```sql
-- Check file paths in storage
SELECT 
  name as file_path,
  bucket_id,
  owner,
  created_at
FROM storage.objects
WHERE bucket_id = 'post-images'
ORDER BY created_at DESC
LIMIT 10;
```

**Expected:** Paths follow convention: `{userId}/{date}/{postId}/{filename}`

**If Incorrect:**
- Fix path generation logic
- Update storage policies to match paths
- Migrate existing files if needed

## SQL Snippets

### Find Files Without Database Records

```sql
-- Orphaned files (exist in storage but not in database)
SELECT 
  so.name as storage_path,
  so.bucket_id,
  so.created_at as file_created
FROM storage.objects so
LEFT JOIN post_images pi ON pi.storage_path = so.name
WHERE so.bucket_id = 'post-images'
  AND pi.id IS NULL
ORDER BY so.created_at DESC;
```

### Find Database Records Without Files

```sql
-- Missing files (exist in database but not in storage)
SELECT 
  pi.id,
  pi.storage_path,
  pi.post_id,
  pi.created_at
FROM post_images pi
WHERE NOT EXISTS (
  SELECT 1 FROM storage.objects so
  WHERE so.name = pi.storage_path
    AND so.bucket_id = 'post-images'
);
```

### Check Storage Policy Coverage

```sql
-- Check which operations have policies per bucket
SELECT 
  bucket_id,
  COUNT(*) FILTER (WHERE definition LIKE '%INSERT%') as insert_policies,
  COUNT(*) FILTER (WHERE definition LIKE '%SELECT%') as select_policies,
  COUNT(*) FILTER (WHERE definition LIKE '%DELETE%') as delete_policies
FROM storage.policies
WHERE bucket_id IN ('avatars', 'post-images', 'creator-media')
GROUP BY bucket_id;
```

### Test Storage Policy as User

```sql
-- Test storage policy (requires Supabase admin function)
-- Note: This is conceptual - actual testing done via API

-- Simulate user upload
-- Policy should check: auth.uid() = (storage.foldername(name))[1]
-- Path format: {userId}/filename.ext
-- So foldername(name)[1] should equal userId
```

### Find Files by User

```sql
-- List files for specific user
SELECT 
  name as file_path,
  bucket_id,
  created_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'post-images'
  AND name LIKE '<user-id>/%'
ORDER BY created_at DESC;
```

## Proof It's Fixed

### Test 1: Upload Works

**Steps:**
1. Log in as user
2. Upload avatar image
3. Verify upload succeeds
4. Verify file appears in storage

**Code Verification:**
```typescript
// Test upload
const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });
const { data, error } = await uploadAvatar(file, userId);

if (error) {
  console.error('Upload failed:', error);
} else {
  console.log('Upload succeeded:', data.path);
}
```

**Expected:** Upload succeeds, file path returned

### Test 2: File Access Works

**Steps:**
1. Upload file
2. Generate URL (public or signed)
3. Access URL in browser
4. Verify file loads

**Code Verification:**
```typescript
// Test file access
const url = await getImageUrl(imageId, userId);
const response = await fetch(url);

if (response.ok) {
  console.log('File accessible');
} else {
  console.error('File access failed:', response.status);
}
```

**Expected:** File accessible, returns 200 OK

### Test 3: Privacy Enforcement Works

**Steps:**
1. Upload file to private post
2. Generate URL as owner
3. Verify URL works
4. Generate URL as other user
5. Verify URL blocked or requires auth

**Code Verification:**
```typescript
// Test privacy
const ownerUrl = await getImageUrl(imageId, ownerId); // Should work
const otherUrl = await getImageUrl(imageId, otherUserId); // Should fail or require signed URL

console.log('Owner URL:', ownerUrl);
console.log('Other URL:', otherUrl);
```

**Expected:** Owner can access, others blocked or require signed URL

### Test 4: File Deletion Works

**Steps:**
1. Upload file
2. Delete file as owner
3. Verify file removed from storage
4. Verify database record deleted

**Code Verification:**
```typescript
// Test deletion
const { error } = await deletePostImage(imageId, userId);

if (error) {
  console.error('Deletion failed:', error);
} else {
  // Verify file removed
  const { data: files } = await supabase.storage
    .from('post-images')
    .list(userId);
  
  console.log('Files remaining:', files?.length);
}
```

**Expected:** File deleted, database record removed

### Test 5: Storage Policies Enforced

**Steps:**
1. Attempt upload to wrong folder
2. Verify upload fails
3. Attempt to access other user's file
4. Verify access denied

**SQL Verification:**
```sql
-- Test policy enforcement (conceptual)
-- Upload to wrong folder should fail
-- Access to other user's private file should fail
```

**Expected:** Policies block unauthorized access

## Common Fixes

### Fix 1: Create Missing Storage Policies

```sql
-- Create policies for avatars bucket
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

CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Fix 2: Fix Path Generation

```typescript
// Ensure path matches policy expectations
function generateStoragePath(
  bucket: 'avatars' | 'post-images' | 'creator-media',
  userId: string,
  options: {
    date?: string;
    resourceId?: string;
    order?: number;
    ext: string;
  }
): string {
  // Policy expects: auth.uid() = (storage.foldername(name))[1]
  // So first folder must be userId
  if (bucket === 'avatars') {
    return `${userId}/${Date.now()}-${crypto.randomUUID()}.${options.ext}`;
  }
  
  if (bucket === 'post-images' && options.resourceId) {
    const date = options.date || new Date().toISOString().split('T')[0];
    return `${userId}/${date}/${options.resourceId}/${options.order || 0}-${crypto.randomUUID()}.${options.ext}`;
  }
  
  throw new Error('Invalid path generation parameters');
}
```

### Fix 3: Fix Privacy-Aware URL Generation

```typescript
// Always check privacy before generating URL
async function getImageUrl(imageId: string, requestingUserId: string | null) {
  const { data: image } = await supabase
    .from('post_images')
    .select('storage_path, post_id, community_posts!inner(is_public, author_id)')
    .eq('id', imageId)
    .single();
  
  if (!image) throw new Error('Image not found');
  
  const post = image.community_posts;
  const isOwner = requestingUserId === post.author_id;
  const isPublic = post.is_public && post.status === 'published';
  
  // Owner always gets public URL
  if (isOwner) {
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(image.storage_path);
    return urlData.publicUrl;
  }
  
  // Public posts: public URL
  if (isPublic) {
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(image.storage_path);
    return urlData.publicUrl;
  }
  
  // Private posts: signed URL (requires auth)
  if (!requestingUserId) {
    throw new Error('Authentication required for private content');
  }
  
  const { data: signedData, error } = await supabase.storage
    .from('post-images')
    .createSignedUrl(image.storage_path, 3600);
  
  if (error) throw error;
  return signedData.signedUrl;
}
```

### Fix 4: Clean Up Orphaned Files

```typescript
// Clean up files without database records
async function cleanupOrphanedFiles() {
  // Get all files in storage
  const { data: files } = await supabase.storage
    .from('post-images')
    .list('', { limit: 1000 });
  
  if (!files) return;
  
  // Get all database records
  const { data: dbImages } = await supabase
    .from('post_images')
    .select('storage_path');
  
  const dbPaths = new Set(dbImages?.map(img => img.storage_path) || []);
  const orphanedPaths = files
    .filter(file => !dbPaths.has(file.name))
    .map(file => file.name);
  
  if (orphanedPaths.length > 0) {
    await supabase.storage
      .from('post-images')
      .remove(orphanedPaths);
  }
  
  return orphanedPaths.length;
}
```

---

**Related Documents:**
- [UPLOADS_STORAGE_CONTRACT.md](./../contracts/UPLOADS_STORAGE_CONTRACT.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [DATA_ACCESS_QUERY_CONTRACT.md](./../contracts/DATA_ACCESS_QUERY_CONTRACT.md)

