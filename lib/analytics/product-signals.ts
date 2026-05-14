/**
 * Lightweight product-learning signals routed through Sentry as **info-level events**.
 * Requires `NEXT_PUBLIC_SENTRY_DSN` or `SENTRY_DSN` — otherwise no-ops (no local noise).
 *
 * NEVER attach email addresses, passwords, Stripe ids, titles, report bodies, or full paths with slugs
 * containing PII. Keep keys snake_case ≤40 chars and values coarse (enums, small counts).
 *
 * Canonical doc: docs/proof/MONITORING_SENTRY_POSTURE.md (Product signals subsection).
 */

import * as Sentry from '@sentry/nextjs'

const ALLOWED_KEY_REGEX = /^[a-z][a-z0-9_]{0,39}$/

function signalsEnabled(): boolean {
  if (process.env.DISABLE_PRODUCT_SIGNALS === '1') return false
  return Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || process.env.SENTRY_DSN?.trim())
}

function sanitizeData(data?: Record<string, string | number | boolean>): Record<string, string | number | boolean> {
  if (!data) return {}
  const out: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(data)) {
    if (!ALLOWED_KEY_REGEX.test(k)) continue
    if (typeof v === 'boolean') {
      out[k] = v
      continue
    }
    if (typeof v === 'number') {
      if (!Number.isFinite(v) || v > 9_999_999 || v < -9_999_999) continue
      out[k] = Math.trunc(v)
      continue
    }
    if (typeof v === 'string') {
      const s = v.trim()
      if (s.length > 64 || s.includes('@')) continue
      out[k] = s
      continue
    }
  }
  return out
}

/** First URL path segment only, e.g. `/places/foo` → `/places`; guards against leaking full slugs. */
export function sanitizePathPrefix(path: string): string {
  const raw = path.trim().split('?')[0] ?? '/'
  if (!raw.startsWith('/')) return '/'
  const segments = raw.split('/').filter(Boolean)
  const first = segments[0]
  if (!first) return '/'
  const allowedRoots = ['places', 'saved', 'reports', 'submit', 'dashboard', 'profile', 'subscribe', 'pricing']
  return allowedRoots.includes(first) ? `/${first}` : '/'
}

/**
 * Emits `product_signal.<name>` info event with tag `product_signal` for Sentry Metrics / issue search.
 */
export function captureProductSignal(
  name: string,
  data?: Record<string, string | number | boolean>
): void {
  if (!signalsEnabled()) return
  const safeName = /^[a-z][a-z0-9_.]{1,63}$/.test(name) ? name : 'unknown_signal'
  Sentry.captureEvent({
    level: 'info',
    message: `product_signal.${safeName}`,
    tags: { product_signal: safeName },
    extra: sanitizeData(data),
  })
}
