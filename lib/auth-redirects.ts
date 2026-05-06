/**
 * Post-auth redirect helpers — aligned with docs/contracts/AUTH_CONTRACT.md
 *
 * Dedicated /talent/dashboard and /client/dashboard routes are not in this repo yet;
 * both roles land on /dashboard until those paths exist.
 */

import type { user_role } from '@/types/database'

export function getPostAuthRedirectPath(role: user_role | null | undefined): string {
  switch (role) {
    case 'client':
    case 'talent':
    default:
      return '/dashboard'
  }
}

/** Paths that must never be post-login redirects (avoid loops back to auth). */
const AUTH_PATH_PREFIXES = ['/login', '/signup'] as const

/**
 * Only allow same-origin relative paths (prevents open redirects).
 * Rejects login/signup so `redirectTo` query cannot bounce users after sign-in.
 */
export function getSafeInternalRedirectPath(
  path: string | null | undefined,
  fallback: string
): string {
  if (!path || typeof path !== 'string') return fallback
  const trimmed = path.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback
  if (trimmed.includes('://')) return fallback
  const lower = trimmed.split('?')[0]?.split('#')[0]?.toLowerCase() ?? trimmed
  for (const prefix of AUTH_PATH_PREFIXES) {
    if (lower === prefix || lower.startsWith(`${prefix}/`)) {
      return fallback
    }
  }
  return trimmed
}
