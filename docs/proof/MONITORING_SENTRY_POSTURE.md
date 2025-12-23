# Monitoring & Sentry Posture

**Purpose:** Error tracking, logging rules, error taxonomy, alert thresholds, and "no silent failure" enforcement for SoloSheThings.

## Non-Negotiables

1. **No Silent Failures** - All errors MUST be logged. Operations MUST throw or return explicit error states.
2. **Never Log Sensitive Data** - Passwords, tokens, API keys, service role keys MUST never be logged.
3. **Error Taxonomy Required** - All errors MUST be categorized (auth, RLS, webhook, WP fetch, sanitize).
4. **Alert Thresholds Enforced** - Critical errors trigger alerts based on defined thresholds.
5. **Production Logging Only** - Sentry in production, console logs acceptable in development.

## What Gets Logged

### ✅ Safe to Log

**User Context:**
- User ID (UUID, not email)
- Username (if public)
- User role (talent/client/admin)
- Session ID (hashed or truncated)

**Request Context:**
- Request path (e.g., `/api/posts`)
- HTTP method (GET, POST, etc.)
- Request timestamp
- User agent (sanitized)
- IP address (last octet masked: `192.168.1.xxx`)

**Error Context:**
- Error message (sanitized, no sensitive data)
- Error type/category
- Stack trace (server-side only, filtered)
- Component/function name
- Operation type (query, mutation, webhook)

**Application Context:**
- Feature name (e.g., "post-creation", "subscription-activation")
- Environment (production, staging, development)
- Deployment version/commit SHA
- Database query (without parameters, if needed for debugging)

**Example:**
```typescript
// ✅ CORRECT: Safe logging
Sentry.captureException(error, {
  tags: {
    category: 'authentication',
    error_type: 'login_failure',
    user_id: user.id, // UUID, safe
    component: 'signup-form',
  },
  extra: {
    request_path: '/api/auth/signup',
    method: 'POST',
    username_provided: username, // Public username, safe
    // No password, no tokens, no API keys
  },
});
```

### ❌ Must Never Be Logged

**Authentication Secrets:**
- ❌ Passwords (plaintext or hashed)
- ❌ Password reset tokens
- ❌ Session tokens/JWT tokens
- ❌ Refresh tokens
- ❌ API keys (Stripe, Resend, Supabase)
- ❌ Service role keys
- ❌ Webhook secrets

**Payment Data:**
- ❌ Credit card numbers
- ❌ CVV codes
- ❌ Stripe payment intents (full details)
- ❌ Billing addresses (full)

**Personal Data:**
- ❌ Email addresses (unless necessary for debugging, then mask: `u***@example.com`)
- ❌ Full names
- ❌ Phone numbers
- ❌ Physical addresses

**Database Secrets:**
- ❌ Database connection strings
- ❌ Database passwords
- ❌ Query parameters containing sensitive data

**Example:**
```typescript
// ❌ WRONG: Logging sensitive data
Sentry.captureException(error, {
  extra: {
    password: formData.get('password'), // NEVER
    stripe_key: process.env.STRIPE_SECRET_KEY, // NEVER
    email: user.email, // Avoid if possible
  },
});

// ✅ CORRECT: Sanitized logging
Sentry.captureException(error, {
  extra: {
    // Password field exists but value not logged
    password_provided: '***', // Just indicate field was present
    // No API keys
    // Email masked if necessary
    email_masked: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
  },
});
```

## Error Taxonomy

All errors MUST be categorized using Sentry tags. Categories:

### 1. Authentication Errors

**Category:** `authentication`

**Error Types:**
- `login_failure` - User login failed
- `signup_failure` - User signup failed
- `profile_missing` - Profile not found after signup
- `session_expired` - Session expired
- `token_invalid` - Invalid JWT token
- `redirect_loop` - Auth redirect loop detected
- `profile_bootstrap_failed` - Profile creation failed during signup

**Logging Pattern:**
```typescript
// ✅ CORRECT: Auth error logging
try {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      category: 'authentication',
      error_type: 'session_expired',
      component: 'protected-route',
    },
    extra: {
      request_path: pathname,
      user_id: user?.id || 'unknown',
    },
    level: 'warning', // Not critical, user can re-login
  });
  throw error;
}
```

**Alert Threshold:** 
- `login_failure`: Alert if > 50 failures in 5 minutes (potential brute force)
- `redirect_loop`: Alert immediately (user-blocking)
- `profile_missing`: Alert if > 10 occurrences in 5 minutes

### 2. RLS (Row Level Security) Errors

**Category:** `rls`

**Error Types:**
- `policy_violation` - RLS policy blocked access
- `unauthorized_access` - User attempted unauthorized access
- `missing_policy` - RLS policy missing (critical)
- `policy_misconfiguration` - Policy incorrectly configured

**Logging Pattern:**
```typescript
// ✅ CORRECT: RLS error logging
try {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email')
    .eq('id', userId)
    .single();
    
  if (error?.code === '42501') {
    // RLS policy violation
    Sentry.captureException(error, {
      tags: {
        category: 'rls',
        error_type: 'policy_violation',
        table: 'profiles',
        operation: 'select',
      },
      extra: {
        user_id: userId,
        requested_user_id: userId,
        policy_expected: 'Users can view own profile',
      },
      level: 'warning', // Expected for unauthorized access attempts
    });
  }
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      category: 'rls',
      error_type: 'policy_violation',
    },
  });
  throw error;
}
```

**Alert Threshold:**
- `missing_policy`: Alert immediately (security critical)
- `policy_misconfiguration`: Alert if > 5 occurrences in 15 minutes
- `policy_violation`: Log but don't alert (expected for unauthorized attempts)

### 3. Webhook Errors

**Category:** `webhook`

**Error Types:**
- `signature_invalid` - Webhook signature verification failed
- `event_duplicate` - Duplicate webhook event received
- `event_unhandled` - Webhook event type not handled
- `processing_failed` - Webhook event processing failed
- `idempotency_violation` - Idempotency check failed
- `stripe_webhook_failed` - Stripe webhook processing failed
- `wordpress_webhook_failed` - WordPress webhook processing failed

**Logging Pattern:**
```typescript
// ✅ CORRECT: Webhook error logging
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();
  
  try {
    // Verify signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Check idempotency
    const { data: existing } = await supabase
      .from('stripe_webhook_ledger')
      .select('id, processed')
      .eq('event_id', event.id)
      .single();
      
    if (existing?.processed) {
      Sentry.captureMessage('Duplicate webhook event', {
        tags: {
          category: 'webhook',
          error_type: 'event_duplicate',
          webhook_source: 'stripe',
        },
        extra: {
          event_id: event.id,
          event_type: event.type,
        },
        level: 'info', // Expected, not an error
      });
      return Response.json({ received: true });
    }
    
    // Process event...
  } catch (error) {
    if (error instanceof stripe.errors.SignatureVerificationError) {
      Sentry.captureException(error, {
        tags: {
          category: 'webhook',
          error_type: 'signature_invalid',
          webhook_source: 'stripe',
        },
        level: 'error', // Security critical
      });
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    Sentry.captureException(error, {
      tags: {
        category: 'webhook',
        error_type: 'processing_failed',
        webhook_source: 'stripe',
      },
      extra: {
        event_type: event?.type || 'unknown',
        event_id: event?.id || 'unknown',
      },
      level: 'error',
    });
    throw error;
  }
}
```

**Alert Threshold:**
- `signature_invalid`: Alert immediately (security critical)
- `processing_failed`: Alert if > 5 failures in 15 minutes
- `event_unhandled`: Alert if > 3 occurrences (new event type needs handling)

### 4. WordPress Fetch Errors

**Category:** `wordpress_fetch`

**Error Types:**
- `fetch_failed` - WordPress API request failed
- `timeout` - WordPress API request timed out
- `invalid_response` - WordPress API returned invalid response
- `network_error` - Network error connecting to WordPress
- `rate_limited` - WordPress API rate limit exceeded

**Logging Pattern:**
```typescript
// ✅ CORRECT: WordPress fetch error logging
async function fetchWordPressPost(slug: string) {
  try {
    const response = await fetch(
      `${process.env.WORDPRESS_API_URL}/wp/v2/posts?slug=${slug}`,
      {
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts[0];
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        category: 'wordpress_fetch',
        error_type: error instanceof Error && error.message.includes('timeout')
          ? 'timeout'
          : 'fetch_failed',
        operation: 'fetch_post',
      },
      extra: {
        post_slug: slug,
        wordpress_url: process.env.WORDPRESS_API_URL,
        // No admin tokens or secrets
      },
      level: 'error',
    });
    throw error;
  }
}
```

**Alert Threshold:**
- `fetch_failed`: Alert if > 10 failures in 5 minutes (WordPress may be down)
- `timeout`: Alert if > 5 timeouts in 15 minutes
- `rate_limited`: Alert immediately (need to adjust rate limiting)

### 5. Sanitization Errors

**Category:** `sanitization`

**Error Types:**
- `sanitize_failed` - HTML sanitization failed
- `xss_detected` - Potential XSS attack detected
- `invalid_html` - Invalid HTML structure
- `dompurify_error` - DOMPurify sanitization error

**Logging Pattern:**
```typescript
// ✅ CORRECT: Sanitization error logging
import DOMPurify from 'isomorphic-dompurify';

function sanitizeWordPressContent(html: string): string {
  try {
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'h1', 'h2', 'h3'],
      ALLOWED_ATTR: ['href', 'title'],
      ALLOW_DATA_ATTR: false,
    });
    
    // Check if content was heavily sanitized (potential XSS)
    if (sanitized.length < html.length * 0.5) {
      Sentry.captureMessage('Heavy HTML sanitization applied', {
        tags: {
          category: 'sanitization',
          error_type: 'xss_detected',
        },
        extra: {
          original_length: html.length,
          sanitized_length: sanitized.length,
          // Don't log actual HTML content (could contain sensitive data)
        },
        level: 'warning',
      });
    }
    
    return sanitized;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        category: 'sanitization',
        error_type: 'sanitize_failed',
      },
      extra: {
        html_length: html.length,
        // Don't log HTML content
      },
      level: 'error',
    });
    throw error;
  }
}
```

**Alert Threshold:**
- `xss_detected`: Alert immediately (security critical)
- `sanitize_failed`: Alert if > 3 failures in 15 minutes

## Alert Thresholds

### Critical Alerts (Immediate Response)

**Trigger Conditions:**
- Authentication redirect loops detected
- RLS policy missing (security critical)
- Webhook signature invalid (security critical)
- XSS detected in sanitization
- Service role key exposed in logs

**Notification:**
- Slack alert to `#alerts-critical`
- Email to on-call engineer
- PagerDuty escalation (if configured)
- Incident created automatically

**Example:**
```typescript
// Alert on redirect loop
if (redirectCount > 3) {
  Sentry.captureMessage('Redirect loop detected', {
    tags: {
      category: 'authentication',
      error_type: 'redirect_loop',
      severity: 'critical',
    },
    level: 'error',
  });
  
  // Also send immediate alert
  await sendSlackAlert({
    channel: '#alerts-critical',
    message: `🚨 Redirect loop detected for user ${userId}`,
  });
}
```

### High Priority Alerts (Response < 15 minutes)

**Trigger Conditions:**
- Webhook processing failures > 5 in 15 minutes
- WordPress fetch failures > 10 in 5 minutes
- Login failures > 50 in 5 minutes (potential brute force)
- Profile bootstrap failures > 10 in 5 minutes

**Notification:**
- Slack alert to `#alerts`
- Email notification
- Review during business hours

**Example:**
```typescript
// Alert on webhook failures
const failureCount = await getWebhookFailureCount('15 minutes');
if (failureCount > 5) {
  Sentry.captureMessage('High webhook failure rate', {
    tags: {
      category: 'webhook',
      error_type: 'processing_failed',
      severity: 'high',
    },
    extra: {
      failure_count: failureCount,
      time_window: '15 minutes',
    },
    level: 'error',
  });
}
```

### Warning Alerts (Review During Business Hours)

**Trigger Conditions:**
- Error rate > 5% in 15 minutes
- Slow response times (> 2s P95)
- RLS policy violations (expected, but monitor patterns)
- WordPress timeout > 3 in 15 minutes

**Notification:**
- Slack notification to `#monitoring`
- Review during next business day

## No Silent Failures Rules

### Rule 1: All Errors Must Be Logged

**MUST:**
- Log all errors before handling/swallowing
- Use Sentry in production
- Include error context (category, type, component)
- Never use empty catch blocks

**MUST NOT:**
- Swallow errors silently
- Use empty catch blocks
- Ignore error responses

**Examples:**
```typescript
// ❌ WRONG: Silent failure
try {
  await createPost(data);
} catch (error) {
  // Silent failure - error not logged
}

// ✅ CORRECT: Error logged
try {
  await createPost(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      category: 'database',
      error_type: 'insert_failed',
      component: 'create-post',
    },
  });
  throw error; // Re-throw or return error state
}

// ✅ CORRECT: Error logged and handled gracefully
try {
  await sendEmail(email);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      category: 'email',
      error_type: 'send_failed',
    },
    level: 'warning', // Non-critical, don't block user
  });
  // Continue without email (graceful degradation)
}
```

### Rule 2: Operations Must Return Explicit Error States

**MUST:**
- Return `{ success: boolean, error?: string }` or throw
- Never return `null` or `undefined` on error without indication
- Use Result types or explicit error handling

**Examples:**
```typescript
// ✅ CORRECT: Explicit error state
async function createPost(data: PostData): Promise<Result<Post, Error>> {
  try {
    const post = await supabase.from('posts').insert(data).select('id').single();
    return { success: true, data: post };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { category: 'database', error_type: 'insert_failed' },
    });
    return { success: false, error: error as Error };
  }
}

// ❌ WRONG: Implicit failure (returns null)
async function createPost(data: PostData): Promise<Post | null> {
  try {
    return await supabase.from('posts').insert(data).select('id').single();
  } catch (error) {
    return null; // Silent failure, no logging
  }
}
```

### Rule 3: Async Operations Must Handle Errors

**MUST:**
- Wrap all async operations in try/catch
- Log errors before re-throwing or handling
- Never let unhandled promise rejections occur

**Examples:**
```typescript
// ❌ WRONG: Unhandled promise rejection
async function fetchPosts() {
  const posts = await supabase.from('posts').select('id, title');
  return posts.data; // Error not handled
}

// ✅ CORRECT: Error handled and logged
async function fetchPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        category: 'database',
        error_type: 'query_failed',
        component: 'fetch-posts',
      },
    });
    throw error;
  }
}
```

### Rule 4: Server Actions Must Log Errors

**MUST:**
- Log errors in Server Actions before throwing
- Include user context (user ID, not email)
- Include operation context (form data, action type)

**Examples:**
```typescript
// ✅ CORRECT: Server Action error logging
'use server';

export async function createPost(formData: FormData) {
  const user = await getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        author_id: user.id,
        title,
        content,
        status: 'published',
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    return { success: true, postId: data.id };
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        category: 'database',
        error_type: 'insert_failed',
        component: 'create-post-action',
      },
      extra: {
        user_id: user.id,
        title_provided: formData.get('title'), // Safe to log
        // No password, no tokens
      },
    });
    throw error;
  }
}
```

### Rule 5: API Routes Must Log Errors

**MUST:**
- Log errors in API routes with request context
- Include route path, method, user ID
- Never expose sensitive data in error responses

**Examples:**
```typescript
// ✅ CORRECT: API route error logging
export async function POST(request: Request) {
  const user = await getUser();
  
  try {
    const body = await request.json();
    // Process request...
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        category: 'api',
        error_type: 'request_failed',
        route: '/api/posts',
        method: 'POST',
      },
      extra: {
        user_id: user?.id || 'anonymous',
        request_path: new URL(request.url).pathname,
        // No request body if it contains sensitive data
      },
    });
    
    return Response.json(
      { error: 'Internal server error' }, // Generic error message
      { status: 500 }
    );
  }
}
```

## Sentry Configuration

### Production Setup

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      // Remove sensitive headers
      delete event.request.headers?.authorization;
      delete event.request.headers?.cookie;
      
      // Remove sensitive query params
      if (event.request.query_string) {
        const params = new URLSearchParams(event.request.query_string);
        params.delete('token');
        params.delete('key');
        params.delete('password');
        event.request.query_string = params.toString();
      }
      
      // Remove sensitive body data
      if (event.request.data) {
        if (typeof event.request.data === 'object') {
          delete event.request.data.password;
          delete event.request.data.token;
          delete event.request.data.api_key;
        }
      }
    }
    
    // Remove sensitive user data
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address; // Use masked IP instead
    }
    
    return event;
  },
});
```

### Server Configuration

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Same filtering as client config
    // Additional server-side filtering if needed
    return event;
  },
});
```

## Monitoring Dashboard

### Key Metrics to Track

**Error Rates:**
- Errors per 1000 requests (by category)
- Error rate trends (hourly/daily)
- Error rate by endpoint

**Error Types:**
- Top error types (by frequency)
- Error types by category
- New error types (first occurrence)

**Performance:**
- Response time P50, P95, P99
- Slow queries (> 500ms)
- Timeout occurrences

**Alerts:**
- Alert frequency
- Alert resolution time
- False positive rate

## Regular Reviews

### Daily
- Review critical alerts
- Check error trends
- Monitor alert thresholds

### Weekly
- Review error patterns
- Identify recurring issues
- Update alert thresholds if needed
- Review logged data for sensitive information leaks

### Monthly
- Performance analysis
- Error trend analysis
- Alert tuning
- Security audit of logged data

---

**Related Documents:**
- [ARCHITECTURE_CONSTITUTION.md](./../ARCHITECTURE_CONSTITUTION.md) - No silent failures rule
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md) - Security logging requirements
- [INCIDENT_TRIAGE_PROCEDURE.md](./../procedures/INCIDENT_TRIAGE_PROCEDURE.md) - Incident response
- [RELEASE_PROCEDURE.md](./../procedures/RELEASE_PROCEDURE.md) - Pre-release checks
