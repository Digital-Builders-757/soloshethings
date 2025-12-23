# Debug Auth Runbook

**Purpose:** Step-by-step debugging guide for authentication issues in SoloSheThings.

## Common Symptoms

1. **User can't log in**
   - Login form shows error
   - Redirects back to login page
   - No error message shown

2. **User can't access protected routes**
   - Redirected to login even when logged in
   - 401/403 errors
   - "Unauthorized" errors

3. **Profile missing after signup**
   - User created but profile doesn't exist
   - Dashboard shows "Profile not found"
   - Redirect loops

4. **Wrong redirect after login**
   - User redirected to wrong dashboard
   - Role-based redirect not working
   - Stuck on loading page

5. **Session expires unexpectedly**
   - User logged out suddenly
   - "Session expired" errors
   - Token refresh failures

## Likely Causes

### 1. Profile Missing After Signup

**Causes:**
- Profile bootstrap failed silently
- Transaction rollback didn't happen
- Race condition in signup flow
- RLS policy blocking profile creation

**Check:**
```sql
-- Check if auth user exists but profile missing
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at as auth_created,
  p.id as profile_id,
  p.username
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC
LIMIT 10;
```

**Fix:**
```sql
-- Manual profile repair (admin only, use service role)
INSERT INTO profiles (id, username, role, privacy_level)
SELECT 
  au.id,
  SPLIT_PART(au.email, '@', 1) || '_' || SUBSTRING(au.id::text, 1, 8),
  'talent',
  'public'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
)
RETURNING id, username;
```

### 2. getUser() Returns Null

**Causes:**
- JWT token expired
- Invalid token signature
- Cookie not set correctly
- Middleware not reading cookies

**Check:**
```typescript
// Add debug logging in getUser()
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value;
          console.log(`Cookie ${name}:`, value ? 'exists' : 'missing');
          return value;
        },
      },
    }
  );
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('getUser error:', error.message, error.status);
  }
  
  return user;
}
```

**Fix:**
- Check cookie settings in Supabase client
- Verify `NEXT_PUBLIC_SUPABASE_URL` matches Supabase project
- Check token expiration settings
- Verify middleware is not blocking cookies

### 3. Redirect Loops

**Causes:**
- Missing profile causes redirect → login → redirect loop
- Middleware redirecting authenticated users
- Profile check failing repeatedly

**Check:**
```typescript
// Check for redirect loop in middleware
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  console.log('Middleware:', { pathname, hasUser: !!user });
  
  // Prevent redirect loops
  if (pathname.startsWith('/login') && user) {
    // User is logged in, redirect to dashboard (not login)
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // ... rest of middleware
}
```

**Fix:**
- Add loop detection in middleware
- Check profile existence before redirecting
- Use error page instead of redirect for missing profile

### 4. Role-Based Redirect Not Working

**Causes:**
- Profile role not set correctly
- Profile not fetched before redirect
- Wrong redirect path logic

**Check:**
```sql
-- Check user roles
SELECT 
  p.id,
  p.username,
  p.role,
  au.email,
  au.created_at
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE au.email = 'user@example.com';
```

**Fix:**
```typescript
// Verify role-based redirect
export async function getRedirectPath(userId: string): Promise<string> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  const redirectMap: Record<string, string> = {
    'talent': '/talent/dashboard',
    'client': '/client/dashboard',
    'admin': '/admin/dashboard',
  };
  
  return redirectMap[profile.role] || '/dashboard';
}
```

## Step-by-Step Checks

### Check 1: Verify Auth User Exists

```sql
-- Check auth user
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'user@example.com';
```

**Expected:** User exists with confirmed email

**If Missing:**
- Signup didn't complete
- Check signup flow logs
- Verify Supabase Auth configuration

### Check 2: Verify Profile Exists

```sql
-- Check profile
SELECT 
  id,
  username,
  role,
  privacy_level,
  created_at
FROM profiles
WHERE id = '<user-id>';
```

**Expected:** Profile exists with role set

**If Missing:**
- Profile bootstrap failed
- Run profile repair (see Fix above)
- Check signup flow for errors

### Check 3: Verify getUser() Works

```typescript
// Test getUser() in Server Component
export default async function TestAuthPage() {
  const user = await getUser();
  
  console.log('getUser result:', {
    hasUser: !!user,
    userId: user?.id,
    email: user?.email,
  });
  
  return <div>User: {user?.email || 'Not authenticated'}</div>;
}
```

**Expected:** Returns user object when authenticated

**If Null:**
- Check cookies are set
- Verify Supabase client configuration
- Check token expiration

### Check 4: Verify Middleware Auth Check

```typescript
// Add logging to middleware
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  console.log('Middleware check:', {
    pathname,
    hasUser: !!user,
    error: error?.message,
  });
  
  // ... rest of middleware logic
}
```

**Expected:** Middleware correctly identifies authenticated users

**If Fails:**
- Check cookie reading in middleware
- Verify Supabase client setup
- Check for cookie domain/path issues

### Check 5: Verify RLS Allows Profile Access

```sql
-- Test RLS policy (as authenticated user)
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-id>';

-- Should return user's own profile
SELECT id, username, role FROM profiles WHERE id = '<user-id>';

-- Should return empty (other user's profile if private)
SELECT id, username, role FROM profiles WHERE id != '<user-id>' AND privacy_level = 'private';
```

**Expected:** User can read own profile, cannot read private profiles of others

**If Fails:**
- Check RLS policies on profiles table
- Verify `auth.uid()` matches user ID
- Check policy conditions

## SQL Snippets

### Find Users Without Profiles

```sql
-- Find auth users without profiles
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'OK' END as profile_status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC;
```

### Check Profile Bootstrap Success Rate

```sql
-- Profile bootstrap success rate
SELECT 
  COUNT(*) as total_users,
  COUNT(p.id) as users_with_profiles,
  COUNT(*) - COUNT(p.id) as missing_profiles,
  ROUND(100.0 * COUNT(p.id) / COUNT(*), 2) as success_rate_percent
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id;
```

### Find Redirect Loop Candidates

```sql
-- Users who might be in redirect loops
SELECT 
  au.id,
  au.email,
  au.last_sign_in_at,
  p.id as profile_id,
  p.role
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.last_sign_in_at > NOW() - INTERVAL '1 hour'
  AND p.id IS NULL;
```

### Check Role Distribution

```sql
-- Verify role distribution
SELECT 
  role,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM profiles
GROUP BY role
ORDER BY count DESC;
```

## Proof It's Fixed

### Test 1: Signup Flow

**Steps:**
1. Sign up with new email
2. Check auth user created
3. Check profile created
4. Verify redirect works

**SQL Verification:**
```sql
-- After signup, verify both exist
SELECT 
  au.id,
  au.email,
  p.username,
  p.role
FROM auth.users au
JOIN profiles p ON p.id = au.id
WHERE au.email = '<new-user-email>';
```

**Expected:** Both auth user and profile exist, role is 'talent'

### Test 2: Login Flow

**Steps:**
1. Log in with existing account
2. Verify getUser() returns user
3. Verify profile is accessible
4. Verify redirect to correct dashboard

**Code Verification:**
```typescript
// Test in Server Component
export default async function TestLoginPage() {
  const user = await getUser();
  if (!user) return <div>Not authenticated</div>;
  
  const profile = await getProfile(user.id);
  if (!profile) return <div>Profile missing</div>;
  
  return <div>Logged in as {profile.username} ({profile.role})</div>;
}
```

**Expected:** User authenticated, profile found, correct role

### Test 3: Protected Route Access

**Steps:**
1. Log in
2. Navigate to protected route
3. Verify access granted
4. Log out
5. Navigate to protected route
6. Verify redirect to login

**Expected:** Authenticated users access routes, unauthenticated users redirected

### Test 4: Role-Based Redirect

**Steps:**
1. Log in as talent user
2. Verify redirect to `/talent/dashboard`
3. Log in as client user
4. Verify redirect to `/client/dashboard`

**Expected:** Correct redirect based on role

### Test 5: Profile Repair

**Steps:**
1. Create auth user without profile (admin only)
2. Attempt login
3. Verify profile repair triggers
4. Verify login succeeds after repair

**SQL Verification:**
```sql
-- Before repair
SELECT COUNT(*) FROM profiles WHERE id = '<user-id>'; -- Should be 0

-- After repair attempt
SELECT COUNT(*) FROM profiles WHERE id = '<user-id>'; -- Should be 1
```

**Expected:** Profile created automatically on login if missing

## Common Fixes

### Fix 1: Missing Profile After Signup

```typescript
// Ensure profile bootstrap in signup
export async function signup(formData: FormData) {
  // ... create auth user ...
  
  // Profile bootstrap with error handling
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      username: generateUsername(email),
      role: 'talent',
      privacy_level: 'public',
    })
    .select('id')
    .single();
    
  if (profileError) {
    // Rollback auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error('Profile creation failed: ' + profileError.message);
  }
  
  // Continue with signup...
}
```

### Fix 2: Redirect Loop Prevention

```typescript
// Prevent redirect loops
export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  const profile = await getProfile(user.id);
  
  if (!profile) {
    // Attempt repair (bounded)
    try {
      await repairProfile(user.id, user.email);
    } catch (error) {
      // Show error page instead of redirecting (prevents loop)
      return <ProfileErrorPage error={error} />;
    }
  }
  
  return <Dashboard profile={profile} />;
}
```

### Fix 3: Cookie Issues

```typescript
// Verify cookie configuration
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: any) {
        cookieStore.delete(name);
      },
    },
  }
);
```

---

**Related Documents:**
- [AUTH_CONTRACT.md](./../contracts/AUTH_CONTRACT.md)
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [MIGRATION_PROCEDURE.md](./../procedures/MIGRATION_PROCEDURE.md)

