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

/**
 * Only allow same-origin relative paths (prevents open redirects).
 */
export function getSafeInternalRedirectPath(
  path: string | null | undefined,
  fallback: string
): string {
  if (!path || typeof path !== 'string') return fallback
  const trimmed = path.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback
  if (trimmed.includes('://')) return fallback
  return trimmed
}
