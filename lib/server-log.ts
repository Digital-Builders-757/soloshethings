/**
 * Server-only structured failure logging.
 * See docs/proof/MONITORING_SENTRY_POSTURE.md — never log secrets or full PII.
 */
import 'server-only'

import * as Sentry from '@sentry/nextjs'

/** Aligns with monitoring taxonomy */
export type LogCategory =
  | 'auth'
  | 'rls'
  | 'storage'
  | 'mutation'
  | 'query'
  | 'webhook'
  | 'wp_fetch'
  | 'sanitize'
  | 'unknown'

/** Safe, JSON-serializable extras for logs and Sentry `extra` */
export type LogContext = Record<string, string | number | boolean | undefined | null>

function hasSentryDsn(): boolean {
  return Boolean(process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim())
}

function toError(cause: unknown): Error {
  if (cause instanceof Error) return cause
  if (typeof cause === 'string') return new Error(cause)
  try {
    return new Error(JSON.stringify(cause))
  } catch {
    return new Error('Unknown error')
  }
}

/**
 * Log a server-side failure for developers (console + optional Sentry).
 * Does not throw.
 */
export function logServerFailure(params: {
  category: LogCategory
  operation: string
  cause: unknown
  context?: LogContext
  /** Optional Sentry fingerprint hint (e.g. same duplicate row noise) */
  fingerprint?: string[]
}): void {
  const { category, operation, cause, context, fingerprint } = params
  const err = toError(cause)

  const payload = {
    category,
    operation,
    message: err.message,
    ...(context && Object.keys(context).length ? { context } : {}),
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[server-failure]', JSON.stringify(payload), err)
  } else {
    console.error('[server-failure]', JSON.stringify(payload))
  }

  if (!hasSentryDsn()) return

  Sentry.captureException(err, {
    tags: { category, operation },
    extra: context ?? undefined,
    ...(fingerprint?.length ? { fingerprint } : {}),
  })
}
