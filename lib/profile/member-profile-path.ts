/**
 * Member profile URL helpers for /members/[username] links.
 */

export function getMemberProfilePath(username: string | null | undefined): string | null {
  const trimmed = username?.trim()
  if (!trimmed) {
    return null
  }

  return `/members/${encodeURIComponent(trimmed)}`
}

export function getAuthorDisplayName(
  fullName: string | null | undefined,
  username: string | null | undefined
): string {
  return fullName?.trim() || username?.trim() || 'Solo SHE member'
}
