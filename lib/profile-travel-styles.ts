/**
 * Travel style options for member profiles.
 *
 * These are editorial phrases that describe how a member travels.
 * They appear as a chip grid on the profile page and travel alongside
 * profile identity across community surfaces.
 *
 * Max selection: TRAVEL_STYLES_MAX (8), enforced in UI, server action, and DB constraint.
 *
 * Importable by both server (actions) and client (form) code — not server-only.
 */

export const TRAVEL_STYLES_MAX = 8

export const TRAVEL_STYLE_OPTIONS = [
  { value: 'solo-by-choice', label: 'solo by choice' },
  { value: 'budget-first', label: 'budget-first' },
  { value: 'luxury-when-it-counts', label: 'luxury when it counts' },
  { value: 'slow-travel', label: 'slow travel' },
  { value: 'adventure-over-comfort', label: 'adventure over comfort' },
  { value: 'culture-and-art', label: 'culture & art' },
  { value: 'food-and-flavour', label: 'food & flavour' },
  { value: 'nature-and-outdoors', label: 'nature & outdoors' },
  { value: 'city-explorer', label: 'city explorer' },
  { value: 'off-the-beaten-path', label: 'off the beaten path' },
  { value: 'wellness-and-reflection', label: 'wellness & reflection' },
  { value: 'pack-light', label: 'pack light' },
] as const satisfies ReadonlyArray<{ value: string; label: string }>

/** Flat string array for server-side whitelist checks (`TRAVEL_STYLE_VALUES.includes(v)`). */
export const TRAVEL_STYLE_VALUES: readonly string[] = TRAVEL_STYLE_OPTIONS.map((o) => o.value)
