/**
 * Fixed topic slugs stored on community_posts.story_tags (max 5 per post).
 * Labels are presentation-only; slugs are the persisted contract with the DB.
 */

export const COMMUNITY_STORY_TOPIC_SLUGS = [
  'travel_moment',
  'food_drink',
  'lodging_rest',
  'local_tip',
  'safety_navigation',
  'culture_arts',
  'self_care',
] as const

export type CommunityStoryTopicSlug = (typeof COMMUNITY_STORY_TOPIC_SLUGS)[number]

const TOPIC_ORDER = new Map(COMMUNITY_STORY_TOPIC_SLUGS.map((slug, index) => [slug, index]))

export const COMMUNITY_STORY_TOPIC_LABELS: Record<CommunityStoryTopicSlug, string> = {
  travel_moment: 'Travel moment',
  food_drink: 'Food & drink',
  lodging_rest: 'Lodging & rest',
  local_tip: 'Local tip',
  safety_navigation: 'Safety / getting around',
  culture_arts: 'Culture & arts',
  self_care: 'Self-care & wellness',
}

function isStoryTopicSlug(value: string): value is CommunityStoryTopicSlug {
  return (COMMUNITY_STORY_TOPIC_SLUGS as readonly string[]).includes(value)
}

/** Normalize checkbox / multi-value input into DB-ready tags (≤5 unique slugs). */
export function parseStoryTagsFromForm(values: unknown[]): CommunityStoryTopicSlug[] {
  const seen = new Set<CommunityStoryTopicSlug>()
  for (const entry of values) {
    const raw = typeof entry === 'string' ? entry.trim() : ''
    if (!raw || seen.size >= 5) continue
    if (isStoryTopicSlug(raw)) {
      seen.add(raw)
    }
  }
  return Array.from(seen).sort((a, b) => (TOPIC_ORDER.get(a)! - TOPIC_ORDER.get(b)!))
}

/** Collapse whitespace; empty → null. Caller validates length via `validatePlaceLabelInput`. */
export function normalizePlaceLabel(raw: string | undefined | null): string | null {
  const trimmed = `${raw ?? ''}`.trim()
  if (!trimmed) return null
  return trimmed
}

export function validatePlaceLabelInput(raw: string | undefined | null): string | null {
  const trimmed = `${raw ?? ''}`.trim()
  if (!trimmed) return null
  if (trimmed.length > 140) {
    return 'Place / location lines must be 140 characters or fewer.'
  }
  return null
}

/** Case-insensitive key for comparing place labels across posts */
export function placeLabelMatchKey(placeLabel: string | null | undefined): string | null {
  if (!placeLabel) return null
  const trimmed = placeLabel.trim()
  if (!trimmed) return null
  return trimmed.toLocaleLowerCase('en-US')
}
