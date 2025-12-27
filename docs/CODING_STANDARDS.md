# Coding Standards

**Purpose:** Next.js 15 App Router + strict TypeScript conventions for SoloSheThings codebase.

## Non-Negotiables

1. **TypeScript Strict Mode** - All code must pass strict type checking
2. **Explicit Types** - Avoid `any`, use proper types or `unknown`
3. **Server Components First** - Default to Server Components, use Client Components only when needed
4. **Explicit Selects** - Never use `select('*')` in Supabase queries
5. **Error Handling** - All async operations must have error handling (never swallow errors)
6. **No Console Logs in Production** - Use proper logging (Sentry, Vercel logs)
7. **Thin UI, Thick Contracts** - UI components are thin; business logic lives in contracts/Server Actions

## TypeScript Standards

### Type Definitions

```typescript
// ✅ CORRECT: Explicit interface (prefer interface over type for extensibility)
interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  role: 'talent' | 'client';
  created_at: string;
}

// ✅ CORRECT: Extending interfaces
interface AdminProfile extends Profile {
  permissions: string[];
}

// ✅ CORRECT: Using utility types
type ProfileUpdate = Partial<Pick<Profile, 'username' | 'avatar_url'>>;
type ProfilePublic = Omit<Profile, 'role'>;

// ✅ CORRECT: Mapped types for variations
type ProfileKeys = keyof Profile;
type ProfileOptional = {
  [K in ProfileKeys]?: Profile[K];
};

// ❌ WRONG: Using any
function processProfile(profile: any) { }

// ✅ CORRECT: Use unknown with type guards instead
function processProfile(profile: unknown) {
  if (isProfile(profile)) {
    // profile is typed as Profile here
    return profile.username;
  }
  throw new Error('Invalid profile');
}

function isProfile(value: unknown): value is Profile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'username' in value
  );
}
```

### Null Safety

```typescript
// ✅ CORRECT: Handle null explicitly
const avatar = profile.avatar_url ?? '/default-avatar.png';

// ✅ CORRECT: Type guard
if (profile.avatar_url) {
  // profile.avatar_url is string here
}

// ❌ WRONG: Non-null assertion without check
const avatar = profile.avatar_url!;
```

### Async/Await

```typescript
// ✅ CORRECT: Proper error handling
async function fetchProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
}

// ❌ WRONG: No error handling
async function fetchProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}
```

## Server vs Client Component Rules

### Server Components (Default)

**MUST:**
- Default to Server Components for all pages and data fetching
- Use Server Components for static content, data fetching, and SEO
- Fetch data directly in Server Components (no API routes needed)
- Use async/await for data fetching

**MUST NOT:**
- Use hooks (`useState`, `useEffect`, etc.) in Server Components
- Use browser-only APIs in Server Components
- Perform client-side interactions in Server Components

```typescript
// ✅ CORRECT: Server Component with data fetching
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');
  
  const { data } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, role')
    .eq('id', user.id)
    .single();
    
  if (!data) {
    return <div>Profile not found</div>;
  }
    
  return <div>{data.username}</div>;
}
```

### Client Components (When Needed Only)

**MUST:**
- Use Client Components ONLY for interactivity (forms, modals, real-time updates)
- Add `'use client'` directive at the top
- Keep Client Components thin (delegate to Server Actions for mutations)

**MUST NOT:**
- Use Client Components for data fetching (use Server Components)
- Perform database writes in Client Components (use Server Actions)
- Expose secrets or service role keys in Client Components

```typescript
// ✅ CORRECT: Client Component for interactivity only
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/app/actions/profile';

export function ProfileEditor({ initialUsername }: { initialUsername: string }) {
  const [username, setUsername] = useState(initialUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({ username });
    } catch (error) {
      // Error handling (thin UI)
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button type="submit" disabled={isSubmitting}>Save</Button>
    </form>
  );
}
```

### Component Props

```typescript
// ✅ CORRECT: Explicit interface for props
interface ProfileCardProps {
  profile: Profile;
  showActions?: boolean;
  onEdit?: (id: string) => void;
}

export function ProfileCard({ profile, showActions = false, onEdit }: ProfileCardProps) {
  return (
    <div>
      <h2>{profile.username}</h2>
      {showActions && onEdit && (
        <Button onClick={() => onEdit(profile.id)}>Edit</Button>
      )}
    </div>
  );
}

// ❌ WRONG: Inline types or any
export function ProfileCard(props: any) { }
```

### Hooks

```typescript
// ✅ CORRECT: Custom hook with proper typing and cleanup
export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    fetchProfile(userId)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    
    // Cleanup: prevent state updates if component unmounts
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  return { profile, loading, error };
}
```

### Component Composition

```typescript
// ✅ CORRECT: Extract reusable logic into custom hooks
function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = useCallback((data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [schema]);
  
  return { errors, validate };
}

// ✅ CORRECT: Use React.memo() strategically for expensive components
export const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});
```

## Next.js Standards

### Route Handlers

```typescript
// ✅ CORRECT: Route handler with proper typing
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId } = body;
    
    // Validation
    if (!subscriptionId || typeof subscriptionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400 }
      );
    }
    
    // Business logic
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Server Actions

```typescript
// ✅ CORRECT: Server Action with validation
'use server';

import { getUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const updateProfileSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(500).optional(),
});

export async function updateProfile(formData: FormData) {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  const rawData = {
    username: formData.get('username'),
    bio: formData.get('bio'),
  };
  
  const validated = updateProfileSchema.parse(rawData);
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: validated.username,
      bio: validated.bio,
    })
    .eq('id', user.id)
    .select('id, username, bio')
    .single();
    
  if (error) throw error;
  return data;
}
```

### Middleware

```typescript
// ✅ CORRECT: Middleware with proper auth checks
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function middleware(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Public routes
  if (request.nextUrl.pathname.startsWith('/blog')) {
    return NextResponse.next();
  }
  
  // Protected routes
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Role-based redirects
  if (request.nextUrl.pathname === '/') {
    // Redirect based on role (check profile)
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Data Access Patterns

### Server-Only Query Modules

**MUST:**
- Create dedicated query modules in `lib/queries/` for data access
- Keep queries server-only (never import in Client Components)
- Return typed shapes from query functions
- Use explicit column selection

```typescript
// ✅ CORRECT: Server-only query module
// lib/queries/profiles.ts
import { supabase } from '@/lib/supabase';

export interface ProfileResult {
  id: string;
  username: string;
  avatar_url: string | null;
  role: 'talent' | 'client';
  created_at: string;
}

export async function getProfile(userId: string): Promise<ProfileResult | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, role, created_at')
    .eq('id', userId)
    .maybeSingle();
    
  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
  
  return data;
}
```

### Explicit Selects with maybeSingle

**MUST:**
- Always use explicit column selection (never `select('*')`)
- Use `.maybeSingle()` when result may not exist (returns `null` instead of error)
- Use `.single()` when result must exist (throws if not found)

```typescript
// ✅ CORRECT: Explicit selects with maybeSingle
const { data } = await supabase
  .from('profiles')
  .select('id, username, avatar_url, role')
  .eq('id', userId)
  .maybeSingle(); // Returns null if not found, no error

// ✅ CORRECT: Use single when result must exist
const { data, error } = await supabase
  .from('profiles')
  .select('id, username, avatar_url')
  .eq('id', userId)
  .single(); // Throws error if not found

// ❌ WRONG: Select all
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### Insert with Returning

```typescript
// ✅ CORRECT: Minimal returning for inserts
const { data, error } = await supabase
  .from('community_posts')
  .insert({
    author_id: user.id,
    title: formData.get('title'),
    content: formData.get('content'),
  })
  .select('id')
  .single();

// ✅ CORRECT: No returning if not needed
const { error } = await supabase
  .from('reports')
  .insert({
    post_id: postId,
    reporter_id: user.id,
    reason: 'spam',
  })
  .select('id', { count: 'exact' });
```

### Error Handling Conventions

**MUST:**
- Never swallow errors silently
- Log all errors (use Sentry in production)
- Return user-safe error messages (no technical details)
- Throw errors for unexpected failures
- Return explicit error states for expected failures
- Always handle error parameters in callbacks (never ignore error params)
- Use error boundaries to catch errors in React component trees
- Design user-friendly fallback UIs when errors occur

**MUST NOT:**
- Use empty catch blocks
- Ignore error responses
- Expose technical error details to users
- Fail silently without logging
- Ignore error parameters in callbacks

```typescript
// ✅ CORRECT: Proper error handling with logging
import * as Sentry from '@sentry/nextjs';

export async function getProfile(userId: string): Promise<ProfileResult | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      // Log error with context
      Sentry.captureException(error, {
        tags: { component: 'getProfile' },
        extra: { userId },
      });
      throw new Error('Failed to fetch profile');
    }
    
    return data;
  } catch (error) {
    // Re-throw after logging (never swallow)
    console.error('Profile fetch error:', error);
    throw error;
  }
}

// ✅ CORRECT: User-safe error messages in Server Actions
'use server';

export async function updateProfile(formData: FormData) {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error('Unauthorized'); // User-safe message
    }
    
    // ... update logic
  } catch (error) {
    // Log technical details
    console.error('Update profile error:', error);
    Sentry.captureException(error);
    
    // Return user-safe message
    throw new Error('Failed to update profile. Please try again.');
  }
}

// ❌ WRONG: Swallowing errors
async function badExample() {
  try {
    await someOperation();
  } catch (error) {
    // Empty catch - NEVER DO THIS
  }
}

// ✅ CORRECT: Error boundaries for React components
'use client';

import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { component: 'ErrorBoundary' },
      extra: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-neutral-600">Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Naming Conventions

### Files

- **Components:** PascalCase (`ProfileCard.tsx`, `LikeButton.tsx`)
- **Server Actions:** camelCase in `app/actions/` (`updateProfile.ts`, `createPost.ts`)
- **Query Modules:** camelCase in `lib/queries/` (`getProfile.ts`, `listPosts.ts`)
- **Utilities:** camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Types:** PascalCase (`Profile.ts`, `Post.ts`)
- **Hooks:** camelCase with `use` prefix (`useProfile.ts`, `useAuth.ts`)
- **Files:** kebab-case (`user-profile.tsx`, `auth-utils.ts`)
- **Directories:** kebab-case (`components/auth-wizard`, `lib/queries`)

### Variables and Functions

- **Variables/Functions:** camelCase (`getUser`, `isLoading`, `handleSubmit`)
- **Constants:** UPPERCASE (`MAX_FILE_SIZE`, `API_ENDPOINT`)
- **Type/Interface:** PascalCase (`Profile`, `PostResult`)

### Specific Naming Patterns

- **Event handlers:** Prefix with `handle` (`handleClick`, `handleSubmit`)
- **Boolean variables:** Prefix with verb (`isLoading`, `hasError`, `canSubmit`)
- **Custom hooks:** Prefix with `use` (`useAuth`, `useProfile`)
- **Use complete words** over abbreviations (except: `err`, `req`, `res`, `props`, `ref`)

### Routes (Next.js App Router)

- **Pages:** `page.tsx` (required)
- **Layouts:** `layout.tsx` (optional)
- **Route Handlers:** `route.ts` (for API routes)
- **Loading:** `loading.tsx` (optional)
- **Error:** `error.tsx` (optional)
- **Not Found:** `not-found.tsx` (optional)

### Components

- **Server Components:** No `'use client'` directive, PascalCase
- **Client Components:** Must have `'use client'` directive, PascalCase
- **UI Components:** In `components/ui/`, follow shadcn/ui conventions
- **Shared Components:** In `components/shared/`, reusable business components

## Import Organization

```typescript
// 1. React/Next.js imports
import { useState, useEffect } from 'react'
import { NextRequest, NextResponse } from 'next/server'

// 2. Third-party imports
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// 3. Internal imports (absolute paths)
import { supabase } from '@/lib/supabase'
import { getUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'

// 4. Type imports (use 'import type' for types-only)
import type { Profile } from '@/types/profile'
```

## Code Formatting

- Use Prettier with project configuration
- 2 spaces for indentation (consistent with existing codebase)
- Single quotes for strings (except to avoid escaping)
- Semicolons required (consistent with existing codebase)
- Trailing commas in multiline object/array literals
- Limit line length to 100 characters (reasonable for modern screens)
- Space after keywords (`if`, `for`, `while`)
- Space before function declaration parentheses
- Space infix operators (`+`, `-`, `*`, `=`)
- Space after commas
- Keep else statements on same line as closing curly brace: `} else {`
- Use curly braces for multi-line if statements
- Always use strict equality (`===` instead of `==`)
- Eliminate unused variables - remove or use them

## State + Form Patterns

### State Management

**MUST:**
- Use React `useState` for local component state
- Use Server Components for server state (no client-side fetching)
- Keep state as local as possible (avoid global state unless necessary)

**Form Handling:**
- Use Server Actions for form submissions (not API routes)
- Use native HTML forms with Server Actions
- Validate on both client (UX) and server (security)
- Use Zod for schema validation

```typescript
// ✅ CORRECT: Form with Server Action
'use client';

import { useFormState } from 'react-dom';
import { updateProfile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';

export function ProfileForm({ initialData }: { initialData: Profile }) {
  const [state, formAction] = useFormState(updateProfile, null);
  
  return (
    <form action={formAction}>
      <input name="username" defaultValue={initialData.username} />
      {state?.error && <div className="error">{state.error}</div>}
      <Button type="submit">Save</Button>
    </form>
  );
}

// ✅ CORRECT: Server Action with validation
'use server';

import { z } from 'zod';
import { getUser } from '@/lib/auth';

const profileSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(500).optional(),
});

export async function updateProfile(
  prevState: any,
  formData: FormData
): Promise<{ error?: string }> {
  const user = await getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  const result = profileSchema.safeParse({
    username: formData.get('username'),
    bio: formData.get('bio'),
  });
  
  if (!result.success) {
    return { error: 'Invalid input' };
  }
  
  // Update logic...
  return {};
}
```

### Preferred Libraries

- **Validation:** Zod (required for Server Actions)
- **Forms:** Native HTML forms + Server Actions (no form libraries needed)
- **UI Components:** shadcn/ui (already in use)
- **State:** React built-in hooks (useState, useFormState)

### React Performance Optimization

**MUST:**
- Use `useCallback` for memoizing callback functions passed to children
- Use `useMemo` for expensive computations (not for simple values)
- Avoid inline function definitions in JSX (extract to useCallback or component methods)
- Implement code splitting using dynamic imports (`next/dynamic`)
- Use proper key props in lists (never use index as key unless list is static)
- Use `React.memo()` for expensive components that re-render frequently

```typescript
// ✅ CORRECT: useCallback for stable function references
'use client';

import { useCallback, useState } from 'react';

export function PostList({ posts }: { posts: Post[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Memoize callback to prevent child re-renders
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);
  
  return (
    <ul>
      {posts.map((post) => (
        <PostItem
          key={post.id} // ✅ Stable key, never use index
          post={post}
          isSelected={post.id === selectedId}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}

// ✅ CORRECT: useMemo for expensive computations
function ExpensiveComponent({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    // Expensive sorting operation
    return [...items].sort((a, b) => a.date.localeCompare(b.date));
  }, [items]);
  
  return <div>{/* render sorted items */}</div>;
}

// ✅ CORRECT: Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable SSR if component uses browser-only APIs
});

export function Dashboard() {
  return (
    <div>
      <HeavyChart />
    </div>
  );
}
```

## Testing Conventions

### Unit Tests

**MUST:**
- Test utilities and pure functions
- Test custom hooks
- Test Server Actions in isolation
- Keep unit tests fast and isolated

**Boundaries:**
- Test business logic, not implementation details
- Mock external dependencies (Supabase, Stripe, etc.)
- Test error cases and edge cases

```typescript
// ✅ CORRECT: Unit test for utility
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-27');
    expect(formatDate(date)).toBe('Jan 27, 2025');
  });
});
```

### Playwright Smoke Tests

**MUST:**
- Run smoke tests for critical user flows (see `docs/proof/E2E_SMOKE_PATHS.md`)
- Test signup → profile → trial → subscribe flow
- Test login → dashboard access
- Test post creation and viewing
- Test subscription flow

**When to Run:**
- Before every deployment
- After red-zone file changes
- After authentication/routing changes

```typescript
// ✅ CORRECT: Playwright smoke test structure
// tests/e2e/signup-flow.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up and access dashboard', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

### Test Boundaries

- **Unit:** Utilities, hooks, Server Actions (mocked dependencies)
- **Integration:** API routes, database queries (test database)
- **E2E:** Full user flows (Playwright, real services)
- **Smoke:** Critical paths only (fast, must pass before deploy)

## Thin UI, Thick Contracts Principle

**MUST:**
- Keep UI components thin (presentation only)
- Put business logic in Server Actions or query modules
- Define contracts (types, schemas) before implementing UI
- UI components receive data, display it, and call actions

**MUST NOT:**
- Put business logic in UI components
- Fetch data in Client Components (use Server Components)
- Mix data fetching with presentation logic

```typescript
// ✅ CORRECT: Thin UI component
'use client';

import { Profile } from '@/types/profile';
import { updateProfile } from '@/app/actions/profile';

interface ProfileEditorProps {
  profile: Profile; // Data passed from Server Component
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  // Thin: Only handles UI state and calls Server Action
  const handleSubmit = async (formData: FormData) => {
    await updateProfile(formData); // Thick contract (Server Action)
  };
  
  return (
    <form action={handleSubmit}>
      <input name="username" defaultValue={profile.username} />
      <button type="submit">Save</button>
    </form>
  );
}

// ✅ CORRECT: Thick contract (Server Action with business logic)
'use server';

import { z } from 'zod';
import { getUser } from '@/lib/auth';
import { getProfile, updateProfile } from '@/lib/queries/profiles';

const profileSchema = z.object({
  username: z.string().min(3).max(30),
  bio: z.string().max(500).optional(),
});

export async function updateProfile(formData: FormData) {
  // Thick: Validation, auth, business logic
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');
  
  const validated = profileSchema.parse({
    username: formData.get('username'),
    bio: formData.get('bio'),
  });
  
  return await updateProfile(user.id, validated);
}
```

## Accessibility (a11y)

**MUST:**
- Use semantic HTML for meaningful structure
- Apply accurate ARIA attributes where needed
- Ensure full keyboard navigation support
- Manage focus order and visibility effectively
- Maintain accessible color contrast ratios (WCAG AA minimum)
- Follow logical heading hierarchy (h1 → h2 → h3)
- Make all interactive elements accessible
- Provide clear and accessible error feedback

```typescript
// ✅ CORRECT: Accessible form with proper labels and error messages
'use client';

export function AccessibleForm() {
  const [error, setError] = useState<string | null>(null);
  
  return (
    <form>
      <div>
        <label htmlFor="username" className="block mb-1">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          aria-describedby={error ? 'username-error' : undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={error ? 'border-red-500' : ''}
        />
        {error && (
          <div
            id="username-error"
            role="alert"
            className="text-red-600 text-sm mt-1"
          >
            {error}
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="focus:outline-none focus:ring-2 focus:ring-brand-blue1"
      >
        Submit
      </button>
    </form>
  );
}

// ✅ CORRECT: Keyboard navigation support
'use client';

export function AccessibleButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);
  
  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="focus:outline-none focus:ring-2 focus:ring-brand-blue1"
    >
      {children}
    </button>
  );
}
```

## Code Quality Guidelines

**MUST:**
- Keep functions focused - Single responsibility principle
- Extract complex logic - Don't inline complex operations in JSX
- Use trailing commas in multiline object/array literals
- Always use strict equality (`===` instead of `==`)
- Eliminate unused variables - Remove or use them

```typescript
// ✅ CORRECT: Focused function with extracted logic
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function OrderSummary({ items }: { items: Item[] }) {
  const total = calculateTotal(items); // Extracted logic
  
  return (
    <div>
      <h2>Order Summary</h2>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}

// ❌ WRONG: Complex logic inlined in JSX
function OrderSummary({ items }: { items: Item[] }) {
  return (
    <div>
      <h2>Order Summary</h2>
      <p>
        Total: ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
      </p>
    </div>
  );
}
```

## Documentation

- Complex functions must have JSDoc comments
- Components should have prop type documentation
- Query modules should document return types
- Server Actions should document expected inputs
- Update [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) when adding new docs

```typescript
/**
 * Fetches a user profile by ID from Supabase.
 * 
 * @param userId - The unique identifier of the user
 * @returns The profile data or null if not found
 * @throws {Error} If the database query fails
 * 
 * @example
 * ```typescript
 * const profile = await getProfile('user-123');
 * if (profile) {
 *   console.log(profile.username);
 * }
 * ```
 */
export async function getProfile(userId: string): Promise<ProfileResult | null> {
  // Implementation...
}
```

---

**Related Documents:**
- [ARCHITECTURE_CONSTITUTION.md](./ARCHITECTURE_CONSTITUTION.md)
- [SECURITY_INVARIANTS.md](./SECURITY_INVARIANTS.md)
- [contracts/DATA_ACCESS_QUERY_CONTRACT.md](./contracts/DATA_ACCESS_QUERY_CONTRACT.md)
- [proof/E2E_SMOKE_PATHS.md](./proof/E2E_SMOKE_PATHS.md)

