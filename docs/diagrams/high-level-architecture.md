# High-Level Architecture

**Purpose:** System overview showing Next.js, Supabase, Stripe, and WordPress integration for SoloSheThings.

## System Components

### Frontend Layer

**Next.js 15+ Application**
- App Router with React Server Components
- TypeScript (strict mode)
- TailwindCSS + shadcn/ui
- Hosted on Vercel

**Responsibilities:**
- User interface
- Server-side rendering
- API routes
- Middleware (auth, routing)

### Backend Services

#### Supabase

**Components:**
- **Auth:** User authentication and sessions
- **Database:** PostgreSQL with RLS
- **Storage:** File uploads (images)
- **Realtime:** Live updates (future)

**Responsibilities:**
- User management
- Data storage and retrieval
- File storage
- Real-time features (future)

#### Stripe

**Components:**
- Subscription management
- Payment processing
- Webhook handling

**Responsibilities:**
- Trial management
- Subscription billing
- Payment processing
- Webhook events

#### WordPress (Headless)

**Components:**
- REST API
- Content management
- ISR integration

**Responsibilities:**
- Public blog content
- Editorial content
- SEO optimization

#### Resend (Optional)

**Components:**
- Email API
- Transactional emails

**Responsibilities:**
- Welcome emails
- Trial reminders
- Subscription confirmations

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Next.js App)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  API Routes  │  │  Middleware   │     │
│  │ (App Router) │  │ (Webhooks)   │  │  (Auth)      │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼─────────────────┼────────────┘
          │                  │                 │
          │                  │                 │
          ▼                  ▼                 ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase      │  │    Stripe    │  │  WordPress    │
│                 │  │              │  │              │
│  ┌───────────┐ │  │  ┌────────┐ │  │  ┌────────┐ │
│  │   Auth    │ │  │  │Billing  │ │  │  │  REST  │ │
│  └───────────┘ │  │  │Webhooks│ │  │  │  API   │ │
│  ┌───────────┐ │  │  └────────┘ │  │  └────────┘ │
│  │ Database │ │  │              │  │              │
│  │ (Postgres)│ │  │              │  │              │
│  │   + RLS   │ │  │              │  │              │
│  └───────────┘ │  │              │  │              │
│  ┌───────────┐ │  │              │  │              │
│  │  Storage  │ │  │              │  │              │
│  │  (Files)  │ │  │              │  │              │
│  └───────────┘ │  │              │  │              │
└─────────────────┘  └──────────────┘  └──────────────┘
```

## Data Flow

### User Authentication Flow

```
1. User submits login form
   ↓
2. Next.js API route / Server Action
   ↓
3. Supabase Auth (verify credentials)
   ↓
4. Create session (JWT token)
   ↓
5. Return session to client
   ↓
6. Middleware checks session on protected routes
```

### Content Creation Flow

```
1. User creates post (form submission)
   ↓
2. Next.js Server Action
   ↓
3. Verify authentication (getUser)
   ↓
4. Validate input
   ↓
5. Supabase insert (with RLS)
   ↓
6. Upload images to Supabase Storage
   ↓
7. Return success response
```

### Subscription Flow

```
1. User clicks "Subscribe"
   ↓
2. Next.js creates Stripe checkout session
   ↓
3. Redirect to Stripe checkout
   ↓
4. User completes payment
   ↓
5. Stripe webhook → Next.js API route
   ↓
6. Verify webhook signature
   ↓
7. Update Supabase subscriptions table
   ↓
8. Grant premium access
```

### Blog Content Flow

```
1. User requests blog page
   ↓
2. Next.js Server Component
   ↓
3. Check ISR cache
   ↓
4. If stale/missing: Fetch from WordPress API
   ↓
5. Cache response (ISR)
   ↓
6. Return HTML to user
   ↓
7. WordPress publish → Webhook → Revalidate cache
```

## Integration Points

### Next.js ↔ Supabase

**Authentication:**
- Supabase Auth for user management
- JWT tokens for sessions
- RLS for data access

**Database:**
- PostgreSQL queries via Supabase client
- RLS policies enforce access
- Real-time subscriptions (future)

**Storage:**
- File uploads to Supabase Storage
- RLS policies on storage buckets
- Signed URLs for private content

### Next.js ↔ Stripe

**Subscription Management:**
- Create subscriptions with trial
- Handle payment processing
- Webhook events for status updates

**Webhook Integration:**
- Stripe webhooks → Next.js API route
- Signature verification
- Idempotent event handling

### Next.js ↔ WordPress

**Content Fetching:**
- WordPress REST API
- ISR for performance
- Webhook revalidation

**Content Display:**
- Server Components fetch content
- ISR caching
- Sanitized HTML rendering

### Next.js ↔ Resend (Optional)

**Email Sending:**
- Welcome emails
- Trial reminders
- Subscription confirmations
- Transactional emails only

## Security Boundaries

### Client-Side
- Public routes: No auth required
- Protected routes: Auth required
- Premium routes: Subscription required

### Server-Side
- RLS policies enforce data access
- Service role key (server-only)
- Webhook signature verification
- Input validation and sanitization

### External Services
- Stripe: Webhook signature verification
- WordPress: CORS configuration
- Supabase: RLS + Auth

## Deployment Architecture

### Vercel Deployment

```
GitHub Repository
  ↓
Vercel (Auto-deploy on push)
  ↓
Build Next.js Application
  ↓
Deploy to Vercel Edge Network
  ↓
Environment Variables Configured
  ↓
Webhooks Configured (Stripe, WordPress)
```

### Supabase Setup

```
Supabase Cloud Project
  ├── Database (PostgreSQL)
  ├── Auth (JWT)
  ├── Storage (Files)
  └── Realtime (Future)

Separate Projects:
  ├── Development
  └── Production
```

## Scalability Considerations

### Horizontal Scaling
- Vercel auto-scales
- Supabase auto-scales
- Stateless application design

### Caching Strategy
- ISR for WordPress content
- Next.js caching
- Supabase query caching

### Database Optimization
- Indexes on frequently queried columns
- RLS policy optimization
- Connection pooling

## Monitoring & Observability

### Error Tracking
- Sentry for error monitoring
- Vercel logs
- Supabase logs

### Performance Monitoring
- Vercel Analytics
- Sentry Performance
- Database query performance

### Alerting
- Critical errors → Slack/Email
- Performance degradation alerts
- Payment failure alerts

---

**Related Documents:**
- [airport-model.md](./airport-model.md)
- [core-flows.md](./core-flows.md)
- [ARCHITECTURE_CONSTITUTION.md](./../ARCHITECTURE_CONSTITUTION.md)

