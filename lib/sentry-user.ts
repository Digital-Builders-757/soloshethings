import * as Sentry from '@sentry/nextjs'

/**
 * Correlate Sentry events with the signed-in Supabase user using **id only**.
 * Do not add email, username, profile fields, or travel/community payload by default.
 */
export function setSentryUser(user: { id: string } | null): void {
  const enabled =
    Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN?.trim()) || Boolean(process.env.SENTRY_DSN?.trim())

  if (!enabled) {
    return
  }

  if (!user) {
    Sentry.setUser(null)
    return
  }

  Sentry.setUser({ id: user.id })
}
