# Email Notifications Contract

**Purpose:** Email sending rules, Resend integration boundaries, public-safe responses, throttling, retry guidance, triggers, and audit/logging requirements for SoloSheThings.

## Non-Negotiables

1. **Server-Only API Key** - Resend API key MUST only exist in server-side code.
2. **Transactional Only** - Use Resend for transactional emails, not marketing.
3. **Public-Safe Responses** - Email endpoints MUST return non-enumerating responses.
4. **Throttle + Retry** - All email sends MUST respect rate limits and implement retry logic.
5. **Audit Logging** - All email sends MUST be logged for audit trail.
6. **Error Handling** - Email failures MUST NOT break user flows.

## Email Triggers

### Phase 1 Triggers (Current)

**MUST Send:**

1. **Welcome Email**
   - **Trigger:** After successful signup and profile creation
   - **Timing:** Immediately after signup (non-blocking)
   - **Template:** Welcome email with trial information

2. **Subscription Receipt**
   - **Trigger:** After successful subscription payment (`invoice.payment_succeeded`)
   - **Timing:** Via Stripe webhook handler
   - **Template:** Receipt with subscription details

3. **Password Reset**
   - **Trigger:** Handled by Supabase Auth (not Resend)
   - **Timing:** When user requests password reset
   - **Note:** Supabase handles this, no Resend integration needed

### Future Triggers (Phase 2+)

4. **Trial Ending Reminder**
   - **Trigger:** 3 days before trial ends
   - **Timing:** Cron job (daily check)
   - **Template:** Trial ending reminder with subscription CTA

5. **Payment Failed Notification**
   - **Trigger:** `invoice.payment_failed` webhook
   - **Timing:** Immediately after payment failure
   - **Template:** Payment failed notification with update CTA

6. **Event Reminders** (Phase 2+)
   - **Trigger:** 24 hours before event start
   - **Timing:** Cron job (daily check)
   - **Template:** Event reminder with RSVP link

## Public-Safe Responses (Non-Enumerating)

### Principle

**MUST:**
- Return generic success/error messages
- Never reveal if email exists in system
- Use same response for valid/invalid emails
- Log detailed errors server-side only

**MUST NOT:**
- Return different errors for "email not found" vs "email sent"
- Reveal email existence
- Leak user information in responses

### Implementation

```typescript
// ✅ CORRECT: Public-safe email endpoint
'use server';

export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  // Always return same response (non-enumerating)
  const genericResponse = {
    success: true,
    message: 'If an account exists, a password reset link has been sent.',
  };

  try {
    // Validate email format
    if (!isValidEmail(email)) {
      // Still return generic response
      return genericResponse;
    }

    // Check if user exists (server-side only)
    const { data: user } = await supabase.auth.admin.getUserByEmail(email);
    
    if (!user) {
      // Log server-side, but return generic response
      console.log(`Password reset requested for non-existent email: ${email}`);
      return genericResponse;
    }

    // Send password reset (Supabase handles this)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      // Log error server-side
      console.error('Password reset error:', error);
      // Still return generic response
      return genericResponse;
    }

    // Log successful send (audit)
    await logEmailEvent({
      type: 'password_reset',
      recipient: email,
      status: 'sent',
    });

    return genericResponse;
  } catch (error) {
    // Log error but return generic response
    console.error('Password reset exception:', error);
    return genericResponse;
  }
}

// ❌ WRONG: Enumerating response
export async function badRequestPasswordReset(email: string) {
  const { data: user } = await supabase.auth.admin.getUserByEmail(email);
  
  if (!user) {
    // ❌ WRONG: Reveals email doesn't exist
    return { success: false, message: 'Email not found' };
  }
  
  // ❌ WRONG: Different response reveals email exists
  return { success: true, message: 'Password reset sent' };
}
```

### Email Validation Endpoint

```typescript
// ✅ CORRECT: Non-enumerating email validation
'use server';

export async function checkEmailAvailability(email: string): Promise<{
  available: boolean;
}> {
  // Always return same structure (non-enumerating)
  // In production, this might not be needed if signup handles it
  // But if implemented, must be non-enumerating
  
  try {
    const { data: user } = await supabase.auth.admin.getUserByEmail(email);
    
    // Return same structure regardless of existence
    return { available: !user };
  } catch (error) {
    // On error, assume available (safer default)
    return { available: true };
  }
}
```

## Throttle + Retry Guidance

### Rate Limiting

**Resend Limits:**
- Free tier: 3,000 emails/month
- Pro tier: 50,000 emails/month
- Rate limit: 10 emails/second
- Burst limit: 100 emails/minute

### Throttling Implementation

```typescript
// ✅ CORRECT: Email throttling with queue
class EmailThrottler {
  private queue: Array<{ email: string; template: string; data: any }> = [];
  private processing = false;
  private lastSent = 0;
  private readonly MIN_INTERVAL = 100; // 100ms between sends (10/second max)

  async queueEmail(
    email: string,
    template: string,
    data: any
  ): Promise<void> {
    this.queue.push({ email, template, data });
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      // Throttle: Wait if needed
      const now = Date.now();
      const timeSinceLastSend = now - this.lastSent;
      if (timeSinceLastSend < this.MIN_INTERVAL) {
        await new Promise(resolve =>
          setTimeout(resolve, this.MIN_INTERVAL - timeSinceLastSend)
        );
      }

      try {
        await this.sendEmail(item.email, item.template, item.data);
        this.lastSent = Date.now();
      } catch (error) {
        // Retry logic (see below)
        await this.retryEmail(item, error);
      }
    }

    this.processing = false;
  }

  private async sendEmail(
    email: string,
    template: string,
    data: any
  ): Promise<void> {
    // Implementation
  }

  private async retryEmail(
    item: { email: string; template: string; data: any },
    error: any
  ): Promise<void> {
    // Retry logic (see Retry section)
  }
}
```

### Retry Strategy

**MUST:**
- Retry transient failures (network, rate limits)
- Use exponential backoff
- Limit retry attempts (max 3 retries)
- Log all retry attempts

**MUST NOT:**
- Retry permanent failures (invalid email, auth errors)
- Retry indefinitely
- Block user flows waiting for retries

```typescript
// ✅ CORRECT: Retry with exponential backoff
async function sendEmailWithRetry(
  email: string,
  template: string,
  data: any,
  maxRetries = 3
): Promise<{
  success: boolean;
  error?: Error;
}> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendEmail(email, template, data);
      
      // Log success
      await logEmailEvent({
        type: template,
        recipient: email,
        status: 'sent',
        attempt: attempt + 1,
      });

      return { success: true };
    } catch (error: any) {
      lastError = error;

      // Don't retry permanent failures
      if (isPermanentFailure(error)) {
        await logEmailEvent({
          type: template,
          recipient: email,
          status: 'failed',
          error: error.message,
          permanent: true,
        });
        break;
      }

      // Log retry attempt
      await logEmailEvent({
        type: template,
        recipient: email,
        status: 'retry',
        attempt: attempt + 1,
        error: error.message,
      });

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  await logEmailEvent({
    type: template,
    recipient: email,
    status: 'failed',
    error: lastError?.message,
    attempts: maxRetries + 1,
  });

  return { success: false, error: lastError || new Error('Unknown error') };
}

function isPermanentFailure(error: any): boolean {
  // Permanent failures: invalid email, auth errors, etc.
  const permanentCodes = [400, 401, 403, 422];
  return permanentCodes.includes(error?.statusCode);
}
```

## Resend Integration Boundaries

### Server-Only Client

```typescript
// ✅ CORRECT: Server-only Resend client
// lib/resend.ts
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// ❌ WRONG: Client-side Resend
'use client';
import { resend } from '@/lib/resend'; // NEVER DO THIS
```

### Integration Boundaries

**MUST:**
- Use Resend only in Server Actions
- Use Resend only in API routes
- Use Resend only in Server Components (for cron jobs)
- Keep API key in server-only environment variables

**MUST NOT:**
- Use Resend in Client Components
- Expose Resend API key to client
- Use Resend for marketing emails (use dedicated service)
- Make Resend calls from middleware

### Email Sending Functions

```typescript
// ✅ CORRECT: Server Action for email sending
'use server';

import { resend } from '@/lib/resend';
import { logEmailEvent } from '@/lib/email-audit';

export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  // Validate email
  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email' };
  }

  // Send with retry
  const result = await sendEmailWithRetry(
    email,
    'welcome',
    { username },
    3 // max retries
  );

  return result;
}

async function sendEmail(
  email: string,
  template: string,
  data: any
): Promise<void> {
  const templates = {
    welcome: {
      from: 'SoloSheThings <welcome@soloshethings.com>',
      subject: 'Welcome to SoloSheThings!',
      html: generateWelcomeTemplate(data.username),
    },
    receipt: {
      from: 'SoloSheThings <billing@soloshethings.com>',
      subject: 'Subscription Confirmation',
      html: generateReceiptTemplate(data),
    },
    // ... other templates
  };

  const templateConfig = templates[template as keyof typeof templates];
  if (!templateConfig) {
    throw new Error(`Unknown template: ${template}`);
  }

  const { data: result, error } = await resend.emails.send({
    from: templateConfig.from,
    to: email,
    subject: templateConfig.subject,
    html: templateConfig.html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return result;
}
```

## Audit/Logging Requirements

### Email Event Logging

**MUST Log:**
- All email send attempts (success and failure)
- Recipient email (hashed for privacy)
- Template type
- Send status (sent, failed, retry)
- Timestamp
- Error messages (if any)
- Retry attempts

### Audit Table Design

```sql
CREATE TABLE email_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email_hash text NOT NULL, -- SHA256 hash of email
  template_type text NOT NULL,
  status text NOT NULL, -- 'sent', 'failed', 'retry', 'skipped'
  attempt integer NOT NULL DEFAULT 1,
  error_message text,
  is_permanent_failure boolean DEFAULT false,
  resend_email_id text, -- Resend email ID if successful
  metadata jsonb, -- Additional context
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX email_audit_log_recipient_hash_idx ON email_audit_log(recipient_email_hash);
CREATE INDEX email_audit_log_template_type_idx ON email_audit_log(template_type);
CREATE INDEX email_audit_log_status_idx ON email_audit_log(status);
CREATE INDEX email_audit_log_created_at_idx ON email_audit_log(created_at DESC);
```

### Logging Implementation

```typescript
// ✅ CORRECT: Email audit logging
import { createHash } from 'crypto';
import { supabase } from '@/lib/supabase';

export async function logEmailEvent(event: {
  type: string;
  recipient: string;
  status: 'sent' | 'failed' | 'retry' | 'skipped';
  attempt?: number;
  error?: string;
  permanent?: boolean;
  resendEmailId?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  // Hash email for privacy
  const emailHash = createHash('sha256')
    .update(event.recipient.toLowerCase().trim())
    .digest('hex');

  const { error } = await supabase
    .from('email_audit_log')
    .insert({
      recipient_email_hash: emailHash,
      template_type: event.type,
      status: event.status,
      attempt: event.attempt || 1,
      error_message: event.error || null,
      is_permanent_failure: event.permanent || false,
      resend_email_id: event.resendEmailId || null,
      metadata: event.metadata || null,
    });

  if (error) {
    // Log to console as fallback (never fail silently)
    console.error('Failed to log email event:', error);
  }
}
```

### Audit Query Examples

```typescript
// ✅ CORRECT: Query email audit logs
export async function getEmailAuditLog(
  emailHash: string,
  limit = 50
): Promise<EmailAuditLog[]> {
  const { data, error } = await supabase
    .from('email_audit_log')
    .select('id, template_type, status, attempt, error_message, created_at')
    .eq('recipient_email_hash', emailHash)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Admin: Get failed emails
export async function getFailedEmails(
  since: Date
): Promise<EmailAuditLog[]> {
  const { data, error } = await supabase
    .from('email_audit_log')
    .select('id, recipient_email_hash, template_type, status, error_message, created_at')
    .eq('status', 'failed')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

## Email Templates

### Welcome Email

```typescript
// ✅ CORRECT: Welcome email template
export function generateWelcomeTemplate(username: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Welcome to SoloSheThings, ${username}!</h1>
          <p>We're excited to have you join our community of solo female travelers.</p>
          <p>Your 1-week free trial has started. Explore our community features and connect with fellow travelers.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
            Go to Dashboard
          </a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
      </body>
    </html>
  `;
}
```

### Subscription Receipt

```typescript
// ✅ CORRECT: Subscription receipt template
export function generateReceiptTemplate(data: {
  username: string;
  amount: string;
  periodStart: string;
  periodEnd: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1;">Thank you for subscribing, ${data.username}!</h1>
          <p>Your subscription is now active. You have full access to all SoloSheThings features.</p>
          <p><strong>Subscription Details:</strong></p>
          <ul>
            <li>Plan: SoloSheThings Premium</li>
            <li>Amount: ${data.amount}</li>
            <li>Billing Period: ${data.periodStart} to ${data.periodEnd}</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
            Go to Dashboard
          </a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Manage your subscription in your account settings.
          </p>
        </div>
      </body>
    </html>
  `;
}
```

## Password Reset (Supabase Handled)

**Note:** Password reset emails are handled by Supabase Auth, not Resend.

**MUST:**
- Use Supabase's built-in password reset flow
- Configure Supabase email templates
- Redirect to custom reset page after email click

**MUST NOT:**
- Implement custom password reset email via Resend
- Bypass Supabase Auth for password reset

```typescript
// ✅ CORRECT: Password reset via Supabase (not Resend)
'use server';

export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  // Supabase handles email sending
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  // Return generic response (non-enumerating)
  return {
    success: true,
    message: 'If an account exists, a password reset link has been sent.',
  };
}
```

## Security Checklist

Before deploying email functionality:

- [ ] Resend API key in server-only environment variable
- [ ] Public-safe responses (non-enumerating)
- [ ] Throttling implemented (respect rate limits)
- [ ] Retry logic with exponential backoff
- [ ] Audit logging for all email sends
- [ ] Email validation before sending
- [ ] Error handling (don't break user flows)
- [ ] Password reset via Supabase (not Resend)
- [ ] Email templates tested
- [ ] Rate limit monitoring

---

**Related Documents:**
- [SECURITY_INVARIANTS.md](./../SECURITY_INVARIANTS.md)
- [BILLING_STRIPE_CONTRACT.md](./BILLING_STRIPE_CONTRACT.md)
- [AUTH_CONTRACT.md](./AUTH_CONTRACT.md)
- [PUBLIC_PRIVATE_SURFACE_CONTRACT.md](./PUBLIC_PRIVATE_SURFACE_CONTRACT.md)
