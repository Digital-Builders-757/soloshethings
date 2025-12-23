# Billing & Stripe Contract

**Purpose:** Subscription flow, trial management, webhook ledger approach, access control, and failure recovery for SoloSheThings Stripe integration.

## Non-Negotiables

1. **Webhook Signature Verification** - All Stripe webhooks MUST verify request signatures.
2. **Idempotency** - Webhook handlers MUST be idempotent using event ledger.
3. **Database as Source of Truth** - Access gates MUST check DB subscription state, NOT Stripe API.
4. **Trial Rules** - 1 week trial with "up to 3 posts" limitation after trial expires.
5. **Server-Only Secrets** - Stripe secret keys MUST only exist in server-side code.
6. **Webhook Ledger** - All webhook events MUST be recorded in ledger for idempotency.

## Subscription Model

### Pricing

- **Trial Period:** 1 week (7 days)
- **Subscription Price:** $3.99/month
- **Billing Cycle:** Monthly (recurring)
- **Currency:** USD

### Trial Rules

**During Trial (7 days):**
- ✅ Unlimited post reading
- ✅ Unlimited post creation
- ✅ Unlimited messaging
- ✅ Full access to all features

**After Trial Expires (if not subscribed):**
- ⚠️ Limited to 3 posts per day (reading)
- ❌ Cannot create new posts
- ❌ Cannot send messages
- ❌ Limited access to premium features

**Trial Calculation:**
```typescript
// ✅ CORRECT: Trial validation
function isTrialValid(trialEnd: string | null): boolean {
  if (!trialEnd) return false;
  return new Date(trialEnd) > new Date();
}
```

### Subscription Statuses

- `trialing` - User is in trial period (full access)
- `active` - User has active paid subscription (full access)
- `past_due` - Payment failed, retrying (limited access)
- `canceled` - Subscription canceled (no access)
- `incomplete` - Payment setup incomplete (no access)

## Webhook Ledger Approach

### Ledger Table Design

**Purpose:** Track all webhook events for idempotency, duplicate detection, and in-flight handling.

```sql
CREATE TABLE stripe_webhook_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE, -- Stripe event ID
  event_type text NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  processing boolean NOT NULL DEFAULT false,
  processed_at timestamptz,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  event_data jsonb NOT NULL, -- Full event payload
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX stripe_webhook_ledger_event_id_idx ON stripe_webhook_ledger(event_id);
CREATE INDEX stripe_webhook_ledger_processed_idx ON stripe_webhook_ledger(processed, processing);
CREATE INDEX stripe_webhook_ledger_event_type_idx ON stripe_webhook_ledger(event_type);
```

### Idempotency Pattern

**MUST:**
- Check ledger before processing any event
- Mark event as "processing" to prevent concurrent processing
- Mark event as "processed" after successful handling
- Record errors for retry logic

```typescript
// ✅ CORRECT: Idempotent webhook handler with ledger
async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  // 1. Check if event already processed
  const { data: existing } = await supabase
    .from('stripe_webhook_ledger')
    .select('id, processed, processing, error_message')
    .eq('event_id', event.id)
    .single();

  if (existing?.processed) {
    console.log(`Event ${event.id} already processed, skipping`);
    return; // Idempotent: already processed
  }

  // 2. Check if event is currently being processed (in-flight)
  if (existing?.processing) {
    console.log(`Event ${event.id} is being processed, skipping`);
    return; // Prevent duplicate processing
  }

  // 3. Insert or update ledger entry (mark as processing)
  const ledgerEntry = {
    event_id: event.id,
    event_type: event.type,
    processed: false,
    processing: true,
    event_data: event,
    retry_count: existing?.retry_count || 0,
  };

  const { error: ledgerError } = await supabase
    .from('stripe_webhook_ledger')
    .upsert(ledgerEntry, {
      onConflict: 'event_id',
    });

  if (ledgerError) {
    console.error('Failed to update ledger:', ledgerError);
    throw new Error('Ledger update failed');
  }

  // 4. Process event
  try {
    await processEvent(event);
    
    // 5. Mark as processed
    await supabase
      .from('stripe_webhook_ledger')
      .update({
        processed: true,
        processing: false,
        processed_at: new Date().toISOString(),
      })
      .eq('event_id', event.id);
  } catch (error) {
    // 6. Record error for retry
    await supabase
      .from('stripe_webhook_ledger')
      .update({
        processing: false,
        error_message: error.message,
        retry_count: (existing?.retry_count || 0) + 1,
      })
      .eq('event_id', event.id);
    
    throw error; // Re-throw for Stripe retry
  }
}
```

### Duplicate Detection

**MUST:**
- Use `event.id` as unique identifier
- Check ledger before processing
- Skip if already processed
- Log duplicate attempts

```typescript
// ✅ CORRECT: Duplicate detection
async function isDuplicateEvent(eventId: string): Promise<boolean> {
  const { data } = await supabase
    .from('stripe_webhook_ledger')
    .select('processed')
    .eq('event_id', eventId)
    .single();

  return data?.processed === true;
}
```

### In-Flight Handling

**MUST:**
- Mark event as "processing" before handling
- Check "processing" flag to prevent concurrent processing
- Clear "processing" flag after completion (success or error)
- Handle timeouts (clear processing flag after timeout)

```typescript
// ✅ CORRECT: In-flight handling with timeout
async function processEventWithTimeout(event: Stripe.Event): Promise<void> {
  const PROCESSING_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  // Check for stale processing entries
  const { data: stale } = await supabase
    .from('stripe_webhook_ledger')
    .select('id, updated_at')
    .eq('event_id', event.id)
    .eq('processing', true)
    .single();

  if (stale) {
    const staleAge = Date.now() - new Date(stale.updated_at).getTime();
    if (staleAge > PROCESSING_TIMEOUT) {
      // Clear stale processing flag
      await supabase
        .from('stripe_webhook_ledger')
        .update({ processing: false })
        .eq('event_id', event.id);
    } else {
      // Still processing, skip
      return;
    }
  }

  // Proceed with processing
  await handleStripeEvent(event);
}
```

## Access Gates (Database State, Not Stripe API)

### Principle

**MUST:**
- Check `subscriptions` table for access decisions
- NEVER call Stripe API for access checks
- Use database state as source of truth
- Update database via webhooks only

**MUST NOT:**
- Call `stripe.subscriptions.retrieve()` for access checks
- Make live API calls for gating decisions
- Trust client-side subscription state

### Access Gate Implementation

```typescript
// ✅ CORRECT: Check database state (not Stripe API)
export async function requireSubscription(userId: string): Promise<Subscription> {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('id, user_id, status, trial_end, current_period_end, cancel_at_period_end')
    .eq('user_id', userId)
    .single();

  if (error || !subscription) {
    throw new Error('No subscription found');
  }

  const now = new Date();
  const isTrialValid = subscription.trial_end && 
    new Date(subscription.trial_end) > now;
  const isActive = subscription.status === 'active' || 
    subscription.status === 'trialing';
  const isPeriodValid = subscription.current_period_end &&
    new Date(subscription.current_period_end) > now;

  // Access granted if:
  // - Active/trialing status AND period valid, OR
  // - Trial still valid
  if ((isActive && isPeriodValid) || isTrialValid) {
    return subscription;
  }

  throw new Error('Subscription required');
}

// ❌ WRONG: Calling Stripe API for access check
export async function badRequireSubscription(userId: string) {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', userId)
    .single();

  // ❌ WRONG: Live API call for access check
  const stripeSub = await stripe.subscriptions.retrieve(
    subscription.stripe_subscription_id
  );
  
  if (stripeSub.status !== 'active') {
    throw new Error('Subscription required');
  }
}
```

### Post Creation Gate (3 Posts/Day Limit)

```typescript
// ✅ CORRECT: Check subscription + daily post limit
export async function canCreatePost(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  // 1. Check subscription
  try {
    const subscription = await requireSubscription(userId);
    
    // 2. If trial valid, allow unlimited
    if (subscription.trial_end && new Date(subscription.trial_end) > new Date()) {
      return { allowed: true };
    }

    // 3. If active subscription, allow unlimited
    if (subscription.status === 'active') {
      return { allowed: true };
    }
  } catch (error) {
    // No subscription or expired
  }

  // 4. After trial: Check daily limit (3 posts/day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('community_posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId)
    .gte('created_at', today.toISOString());

  if (error) {
    return { allowed: false, reason: 'Failed to check post limit' };
  }

  if ((count || 0) >= 3) {
    return { allowed: false, reason: 'Daily post limit reached (3 posts/day)' };
  }

  return { allowed: true };
}
```

## Failure Modes + Recovery

### Failure Modes

1. **Webhook Processing Failure**
   - Event processing throws error
   - Ledger records error
   - Stripe retries automatically

2. **Database Update Failure**
   - Subscription update fails
   - Ledger marks as failed
   - Manual recovery needed

3. **Duplicate Event**
   - Same event received twice
   - Ledger prevents duplicate processing
   - Second attempt skipped

4. **In-Flight Timeout**
   - Processing takes too long
   - Processing flag cleared after timeout
   - Event can be retried

5. **Stale Subscription State**
   - Webhook missed or failed
   - Database state out of sync
   - Manual sync needed

### Recovery Procedures

#### Manual Webhook Replay

```typescript
// ✅ CORRECT: Manual webhook replay for failed events
export async function replayFailedWebhook(eventId: string): Promise<void> {
  // Get event from ledger
  const { data: ledgerEntry } = await supabase
    .from('stripe_webhook_ledger')
    .select('event_data, retry_count')
    .eq('event_id', eventId)
    .single();

  if (!ledgerEntry) {
    throw new Error('Event not found in ledger');
  }

  // Reset processing state
  await supabase
    .from('stripe_webhook_ledger')
    .update({
      processed: false,
      processing: false,
      error_message: null,
    })
    .eq('event_id', eventId);

  // Replay event
  await handleStripeEvent(ledgerEntry.event_data as Stripe.Event);
}
```

#### Subscription State Sync

```typescript
// ✅ CORRECT: Sync subscription state from Stripe (admin only)
export async function syncSubscriptionFromStripe(
  subscriptionId: string
): Promise<void> {
  // Admin operation: Fetch from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Update database
  const { data: dbSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (!dbSub) {
    throw new Error('Subscription not found in database');
  }

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
}
```

#### Failed Event Retry

```typescript
// ✅ CORRECT: Retry failed events (cron job)
export async function retryFailedWebhooks(): Promise<void> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5 * 60 * 1000; // 5 minutes

  // Get failed events (not processed, error exists, retry count < max)
  const { data: failedEvents } = await supabase
    .from('stripe_webhook_ledger')
    .select('event_id, event_data, retry_count, updated_at')
    .eq('processed', false)
    .not('error_message', 'is', null)
    .lt('retry_count', MAX_RETRIES);

  if (!failedEvents) return;

  for (const event of failedEvents) {
    // Check if enough time has passed since last attempt
    const lastAttempt = new Date(event.updated_at).getTime();
    const timeSinceLastAttempt = Date.now() - lastAttempt;

    if (timeSinceLastAttempt < RETRY_DELAY) {
      continue; // Too soon to retry
    }

    try {
      await replayFailedWebhook(event.event_id);
    } catch (error) {
      console.error(`Failed to retry event ${event.event_id}:`, error);
    }
  }
}
```

## Stripe Event List

### Events to Handle (Processed)

**MUST Process:**

1. **`customer.subscription.created`**
   - **Action:** Create subscription record in database
   - **Idempotent:** Yes (check ledger)

2. **`customer.subscription.updated`**
   - **Action:** Update subscription status, dates, cancel flag
   - **Idempotent:** Yes (upsert by subscription ID)

3. **`customer.subscription.deleted`**
   - **Action:** Mark subscription as canceled
   - **Idempotent:** Yes (update status only)

4. **`invoice.payment_succeeded`**
   - **Action:** Update subscription status to active
   - **Idempotent:** Yes (fetch subscription and update)

5. **`invoice.payment_failed`**
   - **Action:** Update subscription status to past_due
   - **Idempotent:** Yes (update status only)

6. **`customer.subscription.trial_will_end`**
   - **Action:** Send trial ending notification (future)
   - **Idempotent:** Yes (check if notification sent)

### Events to Ignore (Recorded but Not Processed)

**MUST Record in Ledger but Skip Processing:**

1. **`customer.created`** - Customer created (no action needed)
2. **`customer.updated`** - Customer updated (no action needed)
3. **`invoice.created`** - Invoice created (handled by payment events)
4. **`invoice.finalized`** - Invoice finalized (handled by payment events)
5. **`payment_intent.created`** - Payment intent created (no action needed)
6. **`payment_intent.succeeded`** - Payment succeeded (handled by invoice events)
7. **`payment_intent.payment_failed`** - Payment failed (handled by invoice events)
8. **`charge.succeeded`** - Charge succeeded (handled by invoice events)
9. **`charge.failed`** - Charge failed (handled by invoice events)

**Recording Pattern:**
```typescript
// ✅ CORRECT: Record but ignore certain events
async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  const IGNORED_EVENTS = [
    'customer.created',
    'customer.updated',
    'invoice.created',
    'invoice.finalized',
    'payment_intent.created',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.succeeded',
    'charge.failed',
  ];

  // Record all events in ledger
  await recordEventInLedger(event);

  // Skip processing for ignored events
  if (IGNORED_EVENTS.includes(event.type)) {
    console.log(`Event ${event.type} recorded but not processed`);
    return;
  }

  // Process handled events
  await processEvent(event);
}
```

## Webhook Handler Implementation

### Complete Webhook Handler

```typescript
// ✅ CORRECT: Complete webhook handler with ledger
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Stripe } from 'stripe';

const IGNORED_EVENTS = [
  'customer.created',
  'customer.updated',
  'invoice.created',
  'invoice.finalized',
  'payment_intent.created',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'charge.succeeded',
  'charge.failed',
];

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle event with ledger
  try {
    await handleStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    // Return 200 to prevent Stripe retries for non-retryable errors
    // Return 500 for retryable errors
    return NextResponse.json(
      { error: 'Webhook handling failed' },
      { status: 500 }
    );
  }
}

async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  // 1. Check ledger for duplicates
  const { data: existing } = await supabase
    .from('stripe_webhook_ledger')
    .select('id, processed, processing')
    .eq('event_id', event.id)
    .single();

  if (existing?.processed) {
    console.log(`Event ${event.id} already processed, skipping`);
    return;
  }

  if (existing?.processing) {
    console.log(`Event ${event.id} is being processed, skipping`);
    return;
  }

  // 2. Record in ledger (mark as processing)
  await supabase
    .from('stripe_webhook_ledger')
    .upsert({
      event_id: event.id,
      event_type: event.type,
      processed: false,
      processing: true,
      event_data: event,
      retry_count: existing?.retry_count || 0,
    }, {
      onConflict: 'event_id',
    });

  // 3. Skip ignored events
  if (IGNORED_EVENTS.includes(event.type)) {
    await supabase
      .from('stripe_webhook_ledger')
      .update({
        processed: true,
        processing: false,
        processed_at: new Date().toISOString(),
      })
      .eq('event_id', event.id);
    return;
  }

  // 4. Process event
  try {
    await processEvent(event);

    // 5. Mark as processed
    await supabase
      .from('stripe_webhook_ledger')
      .update({
        processed: true,
        processing: false,
        processed_at: new Date().toISOString(),
      })
      .eq('event_id', event.id);
  } catch (error) {
    // 6. Record error
    await supabase
      .from('stripe_webhook_ledger')
      .update({
        processing: false,
        error_message: error.message,
        retry_count: (existing?.retry_count || 0) + 1,
      })
      .eq('event_id', event.id);
    throw error;
  }
}

async function processEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    case 'customer.subscription.trial_will_end':
      // Future: Send notification
      console.log('Trial ending soon:', event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;

  const { data: dbSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!dbSub) {
    console.error('Subscription not found for customer:', customerId);
    return;
  }

  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdate(subscription);
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  await supabase
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
}
```

## Security Checklist

Before deploying Stripe integration:

- [ ] Webhook signature verification implemented
- [ ] Stripe secret key in server-only environment variable
- [ ] Webhook endpoint secured
- [ ] Idempotent event handlers with ledger
- [ ] Duplicate detection implemented
- [ ] In-flight handling with timeout
- [ ] Access gates check database (not Stripe API)
- [ ] Trial rules enforced (3 posts/day after trial)
- [ ] Failure recovery procedures documented
- [ ] Event list defined (handled vs ignored)
- [ ] Error handling implemented
- [ ] Test webhooks configured

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
- [AUTH_CONTRACT.md](./AUTH_CONTRACT.md)
- [database_schema_audit.md](./../database_schema_audit.md)
