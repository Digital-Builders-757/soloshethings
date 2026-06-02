import type { privacy_level } from '@/types/database'

/** Public member profile fields returned by resolve_member_profile (visible state only). */
export interface PublicMemberProfile {
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  travel_styles: string[]
  privacy_level: privacy_level
}

export type MemberProfileResolveResult =
  | { status: 'visible'; profile: PublicMemberProfile }
  | { status: 'auth_required'; username: string }
  | { status: 'private'; username: string }
  | { status: 'not_found' }
  | { status: 'error' }

const PRIVACY_LEVELS: readonly privacy_level[] = ['public', 'limited', 'private']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPrivacyLevel(value: unknown): value is privacy_level {
  return typeof value === 'string' && PRIVACY_LEVELS.includes(value as privacy_level)
}

function parsePublicMemberProfile(value: unknown): PublicMemberProfile | null {
  if (!isRecord(value)) {
    return null
  }

  const { username, full_name, bio, avatar_url, travel_styles, privacy_level } = value

  if (typeof username !== 'string' || !isPrivacyLevel(privacy_level)) {
    return null
  }

  if (full_name !== null && typeof full_name !== 'string') {
    return null
  }

  if (bio !== null && typeof bio !== 'string') {
    return null
  }

  if (avatar_url !== null && typeof avatar_url !== 'string') {
    return null
  }

  if (!Array.isArray(travel_styles) || !travel_styles.every((v) => typeof v === 'string')) {
    return null
  }

  return {
    username,
    full_name,
    bio,
    avatar_url,
    travel_styles,
    privacy_level,
  }
}

export function parseMemberProfileResolveResult(data: unknown): MemberProfileResolveResult | null {
  if (!isRecord(data) || typeof data.status !== 'string') {
    return null
  }

  switch (data.status) {
    case 'not_found':
      return { status: 'not_found' }

    case 'auth_required':
      return typeof data.username === 'string'
        ? { status: 'auth_required', username: data.username }
        : null

    case 'private':
      return typeof data.username === 'string'
        ? { status: 'private', username: data.username }
        : null

    case 'visible': {
      const profile = parsePublicMemberProfile(data.profile)
      return profile ? { status: 'visible', profile } : null
    }

    default:
      return null
  }
}
