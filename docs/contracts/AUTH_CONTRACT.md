# Authentication Contract

**Purpose:** Authentication flow, session management, profile bootstrap, and user identity rules for SoloSheThings.

**Implementation Status:** ✅ Implemented (Phase 1 MVP)
- ✅ Signup with profile bootstrap (`app/actions/auth.ts`)
- ✅ Login with profile check (`app/actions/auth.ts`)
- ✅ Logout (`app/actions/auth.ts`)
- ✅ Route protection middleware (`middleware.ts`)
- ✅ Functional auth pages (`app/(auth)/login`, `app/(auth)/signup`)
- ✅ Profile query module (`lib/queries/profiles.ts`)
- ✅ Profile update server action (`app/actions/profile.ts`)
- ✅ Profile edit page (`app/(app)/profile/page.tsx`)
- ✅ Dashboard with profile display (`app/(app)/dashboard/page.tsx`)
- ✅ Header with auth state (`components/nav/header.tsx`)
- ⏳ Stripe subscription creation (TODO: Phase 4)
- ⏳ Welcome email (TODO: Phase 4)

## Non-Negotiables

1. **Use getUser, Not getSession** - For ALL auth decisions, MUST use `getUser()` from `@supabase/auth-helpers-nextjs`, not `getSession()`.
2. **Server-Side Auth Checks** - All protected routes MUST verify authentication server-side.
3. **Profile Bootstrap on Signup** - Every authenticated user MUST have a corresponding `profiles` row created immediately after signup.
4. **Role-Based Redirects** - After login/signup, redirect based on `profiles.role` field.
5. **No Client-Side Auth Bypass** - Client-side auth checks are for UX only, not security.
6. **Bounded Profile Repair** - Missing profile repair MUST be bounded (max 1 retry) to prevent loops.

## Signup Flow

### Flow Diagram (Text)

```
1. User submits signup form (email, password)
   ↓
2. Client-side validation (UX only)
   ↓
3. Server Action: signup()
   ↓
4. Supabase Auth creates user account
   ├── auth.users row created
   └── Returns user object with id
   ↓
5. Profile bootstrap (atomic with signup)
   ├── Check if profile exists (should not)
   ├── Create profiles row:
   │   ├── id = auth.users.id
   │   ├── username = generated or provided
   │   ├── role = 'talent' (default)
   │   └── privacy_level = 'public' (default)
   └── If creation fails → rollback signup
   ↓
6. Stripe subscription creation (with trial)
   ├── Create Stripe customer
   ├── Create subscription with 7-day trial
   └── Save to subscriptions table
   ↓
7. Role-based redirect
   ├── Fetch profile to get role
   ├── 'talent' → /talent/dashboard
   ├── 'client' → /client/dashboard
   └── default → /dashboard
   ↓
8. Welcome email sent (non-blocking)
   ↓
9. User sees dashboard
```

### Pseudo-Code

```typescript
// ✅ CORRECT: Signup with profile bootstrap
'use server';

export async function signup(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const username = formData.get('username');
  
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) throw authError;
  if (!authData.user) throw new Error('User creation failed');
  
  // 2. Bootstrap profile (atomic)
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      username: username || generateUsername(email),
      role: 'talent',
      privacy_level: 'public',
    })
    .select('id')
    .single();
    
  if (profileError) {
    // Rollback: Delete auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error('Profile creation failed');
  }
  
  // 3. Create Stripe subscription with trial
  const subscription = await createSubscriptionWithTrial(authData.user.id, email);
  
  // 4. Send welcome email (non-blocking)
  sendWelcomeEmail(email, username).catch(console.error);
  
  // 5. Return for redirect (client handles redirect based on role)
  return { userId: authData.user.id, redirect: '/dashboard' };
}
```

## Login Flow

### Flow Diagram (Text)

```
1. User submits login form (email, password)
   ↓
2. Client-side validation (UX only)
   ↓
3. Server Action: login()
   ↓
4. Supabase Auth authenticates user
   ├── Verifies credentials
   └── Returns user object with id
   ↓
5. Profile check (repair if missing)
   ├── Fetch profile by user.id
   ├── If missing → repair (bounded, max 1 retry)
   └── If repair fails → error (don't allow login)
   ↓
6. Role-based redirect
   ├── Fetch profile to get role
   ├── 'talent' → /talent/dashboard
   ├── 'client' → /client/dashboard
   └── default → /dashboard
   ↓
7. User sees dashboard
```

### Pseudo-Code

```typescript
// ✅ CORRECT: Login with profile check
'use server';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  
  // 1. Authenticate
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (authError) throw authError;
  if (!authData.user) throw new Error('Authentication failed');
  
  // 2. Check profile (repair if missing)
  let profile = await getProfile(authData.user.id);
  
  if (!profile) {
    // Bounded repair (max 1 attempt)
    profile = await repairProfile(authData.user.id, email);
    if (!profile) {
      throw new Error('Profile not found and repair failed');
    }
  }
  
  // 3. Return for redirect
  return { 
    userId: authData.user.id, 
    role: profile.role,
    redirect: getRedirectPath(profile.role)
  };
}

async function repairProfile(userId: string, email: string) {
  // Bounded repair: only attempt once
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username: generateUsername(email),
      role: 'talent',
      privacy_level: 'public',
    })
    .select('id, username, role')
    .single();
    
  if (error) {
    console.error('Profile repair failed:', error);
    return null;
  }
  
  return data;
}
```

## Logout Flow

### Flow Diagram (Text)

```
1. User clicks logout button
   ↓
2. Client-side: Show loading state
   ↓
3. Server Action: logout()
   ↓
4. Supabase Auth signs out user
   ├── Invalidates session
   └── Clears cookies
   ↓
5. Clear client-side state
   ↓
6. Redirect to /login
   ↓
7. Show login page
```

### Pseudo-Code

```typescript
// ✅ CORRECT: Logout
'use server';

export async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
    throw error;
  }
  
  // Redirect handled by client
  return { success: true };
}

// Client-side
'use client';

async function handleLogout() {
  await logout();
  router.push('/login');
}
```

## Profile Bootstrap Rules

### When Profile is Created

**MUST:**
- Profile created immediately after signup (atomic operation)
- Profile created in same transaction/flow as auth user creation
- If profile creation fails, rollback auth user creation

**MUST NOT:**
- Allow auth user without profile
- Delay profile creation
- Create profile in separate async process

### Required Fields

**Minimum Required:**
- `id` - Must match `auth.users.id`
- `username` - Generated if not provided (from email or random)
- `role` - Default to 'talent'
- `privacy_level` - Default to 'public'

**Optional Fields (can be set later):**
- `full_name`
- `bio`
- `avatar_url`

### Repair Behavior

**When Profile is Missing:**
- Detect missing profile on login
- Attempt bounded repair (max 1 retry)
- If repair fails, block login and show error
- Log repair attempts for monitoring

**Bounded Repair Rules:**
- Only attempt repair once per login attempt
- Don't retry repair in same session
- If repair fails, require manual intervention
- Log all repair attempts

```typescript
// ✅ CORRECT: Bounded profile repair
async function ensureProfile(userId: string, email: string): Promise<Profile> {
  // 1. Try to fetch existing profile
  let profile = await getProfile(userId);
  
  if (profile) {
    return profile;
  }
  
  // 2. Bounded repair (only once)
  console.warn(`Missing profile for user ${userId}, attempting repair`);
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username: generateUsername(email),
      role: 'talent',
      privacy_level: 'public',
    })
    .select('id, username, role, privacy_level')
    .single();
    
  if (error) {
    // Repair failed - don't retry, require manual intervention
    console.error('Profile repair failed:', error);
    throw new Error('Profile not found. Please contact support.');
  }
  
  return data;
}
```

### Safe UX (No Loops)

**MUST:**
- Prevent redirect loops
- Show clear error messages
- Provide escape hatch (contact support)
- Log all repair attempts

**MUST NOT:**
- Retry repair indefinitely
- Create redirect loops
- Hide errors from users
- Allow access without profile

```typescript
// ✅ CORRECT: Safe UX with no loops
export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  // Check profile (with bounded repair)
  let profile = await getProfile(user.id);
  
  if (!profile) {
    try {
      profile = await repairProfile(user.id, user.email);
    } catch (error) {
      // Repair failed - show error page, don't redirect
      return <ProfileErrorPage />;
    }
  }
  
  // Profile exists, proceed
  return <Dashboard profile={profile} />;
}
```

## Role Gates

### Anonymous Users

**Access:**
- Public routes only (`/`, `/blog/*`, `/login`, `/signup`)
- No database access
- WordPress content only

**Gating:**
- Middleware allows public routes
- No auth check needed

```typescript
// ✅ CORRECT: Anonymous access
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public routes - no auth check
  if (pathname.startsWith('/blog') || 
      pathname.startsWith('/login') ||
      pathname.startsWith('/signup') ||
      pathname === '/') {
    return NextResponse.next();
  }
  
  // All other routes require auth
  const user = await getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

### Authenticated Users

**Access:**
- All public routes
- Dashboard, profile, community features
- Own data (full access)
- Public data (read-only)

**Gating:**
- Middleware checks `getUser()`
- Server Components verify auth
- RLS enforces data access

```typescript
// ✅ CORRECT: Authenticated gate
export default async function DashboardPage() {
  const user = await getUser(); // Security-critical check
  if (!user) {
    redirect('/login');
  }
  
  // User is authenticated
  const profile = await getProfile(user.id);
  return <Dashboard profile={profile} />;
}
```

### Subscribed Users

**Access:**
- All authenticated user access
- Premium features
- Events and workshops (when available)

**Gating:**
- Check subscription status in addition to auth
- Verify trial period or active subscription

```typescript
// ✅ CORRECT: Subscription gate
export default async function PremiumPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  // Check subscription
  const subscription = await getSubscription(user.id);
  const hasAccess = subscription && (
    subscription.status === 'active' ||
    subscription.status === 'trialing' ||
    (subscription.trial_end && new Date(subscription.trial_end) > new Date())
  );
  
  if (!hasAccess) {
    redirect('/subscribe');
  }
  
  return <PremiumContent />;
}
```

### Admin Users

**Access:**
- All subscribed user access
- Admin dashboard
- Moderation tools
- User management

**Gating:**
- Check role from profile (not JWT)
- Use service role for admin operations (when needed)

```typescript
// ✅ CORRECT: Admin gate
export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  // Check role from profile (not JWT)
  const profile = await getProfile(user.id);
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }
  
  return <AdminDashboard />;
}
```

## Redirect Rules

### Middleware Redirects

**MUST:**
- Check auth status using `getUser()`
- Redirect unauthenticated users to `/login`
- Allow public routes without redirect
- Prevent redirect loops

**MUST NOT:**
- Redirect authenticated users from login page (handle in page component)
- Create redirect loops
- Use `getSession()` for redirect decisions

```typescript
// ✅ CORRECT: Middleware redirect rules
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Public routes - always allow
  const publicRoutes = ['/', '/blog', '/login', '/signup', '/reset-password'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Protected routes - require auth
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Admin routes - require admin role
  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Prevent authenticated users from accessing auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}
```

### Server Component Redirects

**MUST:**
- Use `getUser()` for auth checks
- Redirect before rendering
- Check profile existence
- Handle missing profile gracefully

```typescript
// ✅ CORRECT: Server Component redirect
export default async function ProtectedPage() {
  const user = await getUser(); // Security-critical
  if (!user) {
    redirect('/login');
  }
  
  // Check profile
  const profile = await getProfile(user.id);
  if (!profile) {
    // Attempt repair (bounded)
    try {
      await repairProfile(user.id, user.email);
    } catch (error) {
      // Repair failed - show error, don't redirect (prevent loop)
      return <ProfileErrorPage />;
    }
  }
  
  return <PageContent />;
}
```

## Missing Profile Handling

### Bounded Repair

**Rules:**
- Only attempt repair once per request
- Don't retry in same session
- Log all repair attempts
- Show clear error if repair fails

**Implementation:**
```typescript
// ✅ CORRECT: Bounded repair with loop prevention
async function getProfileWithRepair(userId: string, email: string): Promise<Profile | null> {
  // 1. Try to fetch
  const profile = await getProfile(userId);
  if (profile) return profile;
  
  // 2. Bounded repair (only once)
  console.warn(`Profile missing for ${userId}, attempting repair`);
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: generateUsername(email),
        role: 'talent',
        privacy_level: 'public',
      })
      .select('id, username, role')
      .single();
      
    if (error) {
      console.error('Profile repair failed:', error);
      return null; // Don't retry
    }
    
    return data;
  } catch (error) {
    console.error('Profile repair exception:', error);
    return null; // Don't retry
  }
}
```

### Safe UX (No Loops)

**Prevent Redirect Loops:**
- Don't redirect on profile error (show error page)
- Provide escape hatch (contact support link)
- Clear error messages
- Don't retry indefinitely

```typescript
// ✅ CORRECT: Safe UX with no loops
export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  let profile = await getProfile(user.id);
  
  if (!profile) {
    // Attempt repair (bounded)
    profile = await repairProfile(user.id, user.email);
    
    if (!profile) {
      // Repair failed - show error page, don't redirect
      return (
        <div>
          <h1>Profile Error</h1>
          <p>Your profile could not be loaded. Please contact support.</p>
          <a href="/support">Contact Support</a>
        </div>
      );
    }
  }
  
  // Profile exists, proceed normally
  return <Dashboard profile={profile} />;
}
```

## "getUser Not getSession" Invariant

### Why getUser() is Required

**Security Reasons:**
- `getUser()` verifies JWT signature and expiration
- `getSession()` may return stale session data
- `getUser()` always fetches fresh user data
- `getUser()` is required for security-critical decisions

**MUST:**
- Use `getUser()` for ALL auth decisions
- Use `getUser()` in middleware, Server Components, Server Actions
- Use `getUser()` for security-critical operations

**MUST NOT:**
- Use `getSession()` for security-critical decisions
- Trust client-side auth state alone
- Skip auth verification

```typescript
// ✅ CORRECT: Use getUser() for security-critical decisions
import { getUser } from '@/lib/auth';

export default async function ProtectedPage() {
  const user = await getUser(); // Verifies JWT signature
  if (!user) {
    redirect('/login'); // Security-critical: block access
  }
  // Proceed with authenticated user
}

// ❌ WRONG: Using getSession() for security-critical decision
import { getSession } from '@/lib/auth';

export default async function BadPage() {
  const session = await getSession(); // May be stale, not verified
  if (!session) {
    // This is NOT secure for critical operations
  }
}
```

### Implementation

```typescript
// lib/auth.ts
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
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  // getUser() verifies JWT signature and expiration
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user; // Verified user
}

// ❌ WRONG: Don't create getSession() helper
// export async function getSession() {
//   // Don't use this for security-critical decisions
// }
```

## Flow Diagrams

### Complete Signup → Profile → Dashboard Flow

```
User Action: Submit Signup Form
  ↓
Client: Validate Form (UX only)
  ↓
Server Action: signup()
  ↓
Supabase Auth: Create User
  ├── Success → Continue
  └── Error → Return error, stop
  ↓
Profile Bootstrap: Create Profile
  ├── id = auth.users.id
  ├── username = generated/provided
  ├── role = 'talent'
  └── privacy_level = 'public'
  ├── Success → Continue
  └── Error → Rollback auth user, return error
  ↓
Stripe: Create Subscription with Trial
  ├── Create customer
  ├── Create subscription (7-day trial)
  └── Save to database
  ├── Success → Continue
  └── Error → Log error, continue (non-blocking)
  ↓
Email: Send Welcome Email (non-blocking)
  ↓
Redirect: Based on Role
  ├── Fetch profile to get role
  ├── 'talent' → /talent/dashboard
  ├── 'client' → /client/dashboard
  └── default → /dashboard
  ↓
Dashboard: Load User Data
  ├── Verify auth (getUser())
  ├── Fetch profile
  └── Render dashboard
```

### Login → Profile Check → Dashboard Flow

```
User Action: Submit Login Form
  ↓
Client: Validate Form (UX only)
  ↓
Server Action: login()
  ↓
Supabase Auth: Authenticate
  ├── Success → Continue
  └── Error → Return error, stop
  ↓
Profile Check: Fetch Profile
  ├── Found → Continue
  └── Missing → Repair (bounded, max 1 retry)
      ├── Success → Continue
      └── Failure → Return error, stop (no loop)
  ↓
Redirect: Based on Role
  ├── Fetch profile to get role
  ├── 'talent' → /talent/dashboard
  ├── 'client' → /client/dashboard
  └── default → /dashboard
  ↓
Dashboard: Load User Data
  ├── Verify auth (getUser())
  ├── Fetch profile (should exist)
  └── Render dashboard
```

### Missing Profile Repair Flow

```
Request: Protected Route
  ↓
Middleware: Check Auth (getUser())
  ├── No user → Redirect to /login
  └── User exists → Continue
  ↓
Server Component: Check Profile
  ├── Profile exists → Continue normally
  └── Profile missing → Attempt Repair
      ↓
      Repair: Create Profile
      ├── Success → Continue normally
      └── Failure → Show Error Page (no redirect)
          ├── User sees error message
          ├── Contact support link
          └── No redirect loop
```

## Error Handling

### Auth Errors

```typescript
// ✅ CORRECT: Handle auth errors gracefully
try {
  const user = await getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
} catch (error) {
  console.error('Auth error:', error);
  Sentry.captureException(error);
  return { error: 'Authentication failed' };
}
```

### Profile Errors

```typescript
// ✅ CORRECT: Handle profile errors with bounded repair
async function getProfileSafe(userId: string, email: string): Promise<Profile> {
  let profile = await getProfile(userId);
  
  if (!profile) {
    // Bounded repair (only once)
    profile = await repairProfile(userId, email);
    
    if (!profile) {
      throw new Error('Profile not found and repair failed');
    }
  }
  
  return profile;
}
```

## Security Considerations

1. **Never Trust Client-Side Auth** - Always verify server-side with `getUser()`
2. **Use RLS Policies** - Database-level access control
3. **Validate User ID** - Always use `auth.uid()` in RLS policies
4. **Secure Cookies** - Supabase handles secure cookie management
5. **Token Refresh** - Supabase handles automatic token refresh
6. **Bounded Repair** - Prevent infinite loops with max 1 retry

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [ARCHITECTURE_CONSTITUTION.md](./../ARCHITECTURE_CONSTITUTION.md)
- [contracts/PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- [diagrams/core-flows.md](./../diagrams/core-flows.md)
