/**
 * Initials fallback for Avatar when no image is available.
 * Shared by profile edit and public member profile views.
 */
export function getAvatarFallback(fullName: string | null | undefined, username: string): string {
  const source = fullName?.trim() || username
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'ST'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}
