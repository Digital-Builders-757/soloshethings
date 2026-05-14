'use client'

import {
  COMMUNITY_STORY_TOPIC_LABELS,
  COMMUNITY_STORY_TOPIC_SLUGS,
} from '@/lib/community-story-taxonomy'

type CommunityDiscoveryFieldsProps = {
  idPrefix: string
  defaultPlaceLabel?: string | null
  defaultTopicSlugs?: readonly string[] | null
}

/**
 * Optional place label + capped topic checklist for submit and owner-edit forms.
 */
export function CommunityDiscoveryFields({
  idPrefix,
  defaultPlaceLabel = '',
  defaultTopicSlugs = [],
}: CommunityDiscoveryFieldsProps) {
  const selected = new Set(defaultTopicSlugs ?? [])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor={`${idPrefix}-place_label`} className="mb-2 block text-sm font-semibold text-[#7a331b]">
          Place / location (optional)
        </label>
        <input
          type="text"
          id={`${idPrefix}-place_label`}
          name="place_label"
          maxLength={140}
          defaultValue={defaultPlaceLabel ?? ''}
          placeholder="City, venue, airport, neighborhood—whatever anchors the story"
          className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Honest discovery filters use whatever you enter here—not GPS or AI guesses.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-[#7a331b]">Story angles (pick up to five)</legend>
        <p className="text-xs leading-6 text-muted-foreground">
          These simple tags appear in browse filters help other members skim without changing who can see the story itself.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {COMMUNITY_STORY_TOPIC_SLUGS.map((slug) => (
            <label
              key={slug}
              className="flex cursor-pointer items-start gap-2 rounded-2xl border border-[#ead8c2] bg-[#fffaf5] px-3 py-2 text-sm leading-snug text-[#4f4034] transition hover:border-[#e34b16]/30"
            >
              <input
                type="checkbox"
                name="topics"
                value={slug}
                defaultChecked={selected.has(slug)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d9c4a8]"
              />
              <span>{COMMUNITY_STORY_TOPIC_LABELS[slug]}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
