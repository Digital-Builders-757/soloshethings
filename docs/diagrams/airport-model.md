# Airport Model Architecture

**Purpose:** Layered architecture model adapted for SoloSheThings platform.

## Architecture Layers

### Layer 1: Public Terminal (Public Routes)

**Purpose:** Public-facing content accessible without authentication.

**Components:**
- Marketing/landing pages
- WordPress blog content
- Public community previews (if applicable)
- Signup/login pages

**Access:**
- ✅ Anonymous users
- ✅ Authenticated users
- ✅ All roles

**Technology:**
- Next.js App Router
- WordPress REST API (read-only)
- ISR for performance

### Layer 2: Security Checkpoint (Authentication)

**Purpose:** Authentication and authorization layer.

**Components:**
- Supabase Auth
- Middleware (route protection)
- Session management
- Role-based access control

**Access:**
- ✅ Authenticated users only
- ❌ Anonymous users blocked

**Technology:**
- Supabase Auth
- Next.js Middleware
- JWT tokens
- RLS policies

### Layer 3: Departure Lounge (User Dashboard)

**Purpose:** Authenticated user area with community features.

**Components:**
- User dashboard
- Profile management
- Community posts
- Image uploads
- Saved posts

**Access:**
- ✅ Authenticated users (trial or subscribed)
- ❌ Anonymous users

**Technology:**
- Next.js Server Components
- Supabase (with RLS)
- Supabase Storage

### Layer 4: Premium Lounge (Subscription Features)

**Purpose:** Premium features requiring active subscription.

**Components:**
- Events and workshops (future)
- Advanced features (future)
- Priority support (future)

**Access:**
- ✅ Subscribed users only
- ❌ Trial users (after trial expires)
- ❌ Unauthenticated users

**Technology:**
- Stripe subscription checks
- Supabase subscription status
- Access control middleware

### Layer 5: Control Tower (Admin)

**Purpose:** Administrative functions and moderation.

**Components:**
- Admin dashboard
- Content moderation
- User management
- Analytics (future)

**Access:**
- ✅ Admin users only
- ❌ All other users

**Technology:**
- Service role key (server-only)
- Admin-specific RLS policies
- Moderation tools

## Data Flow

### Public Content Flow

```
User Request
  ↓
Next.js (Public Route)
  ↓
WordPress API / Static Content
  ↓
Response (HTML/JSON)
```

### Authenticated Content Flow

```
User Request
  ↓
Next.js Middleware (Auth Check)
  ↓
Supabase Auth (Verify Session)
  ↓
Next.js Server Component
  ↓
Supabase (with RLS)
  ↓
Response (User Data)
```

### Premium Content Flow

```
User Request
  ↓
Next.js Middleware (Auth Check)
  ↓
Subscription Check (Stripe/Supabase)
  ↓
Next.js Server Component
  ↓
Supabase (with RLS)
  ↓
Response (Premium Content)
```

## Security Boundaries

### Public Zone
- No authentication required
- Read-only access
- Cached content (ISR)

### Authenticated Zone
- Authentication required
- RLS enforced
- User-scoped data

### Premium Zone
- Subscription required
- Trial period support
- Access-controlled features

### Admin Zone
- Admin role required
- Service role access (when needed)
- Full system access

## Component Interaction

### Frontend Components

```
Public Pages
  ├── Landing Page
  ├── Blog Posts (WordPress)
  └── Signup/Login

Authenticated Pages
  ├── Dashboard
  ├── Profile
  ├── Community Posts
  └── Settings

Premium Pages
  ├── Events (future)
  └── Workshops (future)

Admin Pages
  ├── Admin Dashboard
  ├── Moderation
  └── Analytics
```

### Backend Services

```
Next.js App
  ├── Server Components
  ├── API Routes
  └── Middleware

Supabase
  ├── Auth
  ├── Database (PostgreSQL)
  ├── Storage
  └── Realtime (future)

External Services
  ├── Stripe (Billing)
  ├── WordPress (Content)
  └── Resend (Email)
```

## Access Control Matrix

| Layer | Anonymous | Authenticated | Trial | Subscribed | Admin |
|-------|-----------|---------------|-------|------------|-------|
| Public Terminal | ✅ | ✅ | ✅ | ✅ | ✅ |
| Security Checkpoint | ❌ | ✅ | ✅ | ✅ | ✅ |
| Departure Lounge | ❌ | ✅ | ✅ | ✅ | ✅ |
| Premium Lounge | ❌ | ❌ | ⏳ | ✅ | ✅ |
| Control Tower | ❌ | ❌ | ❌ | ❌ | ✅ |

## Migration Path

### User Journey Through Layers

1. **Landing (Public Terminal)**
   - User visits homepage
   - Views blog content
   - Decides to sign up

2. **Signup (Security Checkpoint)**
   - User creates account
   - Profile created
   - Trial starts

3. **Dashboard (Departure Lounge)**
   - User accesses dashboard
   - Creates posts
   - Views community

4. **Subscription (Premium Lounge)**
   - Trial expires
   - User subscribes
   - Access to premium features

5. **Admin (Control Tower)**
   - Admin users access
   - Moderation tools
   - System management

## Benefits of Airport Model

1. **Clear Boundaries** - Each layer has defined access rules
2. **Security by Layer** - Security enforced at each boundary
3. **Scalability** - Easy to add new layers/features
4. **Maintainability** - Clear separation of concerns
5. **User Experience** - Smooth progression through layers

---

**Related Documents:**
- [high-level-architecture.md](./high-level-architecture.md)
- [core-flows.md](./core-flows.md)
- [ARCHITECTURE_CONSTITUTION.md](./../ARCHITECTURE_CONSTITUTION.md)

