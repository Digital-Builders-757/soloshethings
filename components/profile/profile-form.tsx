/**
 * Profile Form Component
 *
 * Client component for editing profile.
 * Phase 1:   structural correction — open surface zones, editorial typography,
 *            atmospheric depth, no checklist widget, no outer card container.
 * Phase 1.5: quiet presence signals — editorial warmth cues, never gamified.
 * Phase 2:   editorial cadence — compositional pacing, portrait narrative, bio as writing surface.
 * Phase 3:   controlled compositional imperfection — micro-asymmetry, authored drift.
 * Lock pass: responsive fixes, dead CSS removal, input color unification, button cleanup.
 * Phase 4:   profile visibility redesign — editorial radio-card system replaces <select>.
 */

'use client'

import { updateProfile } from '@/app/actions/profile'
import { Avatar } from '@/components/ui/avatar'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'

type Profile = Database['public']['Tables']['profiles']['Row']

// Visibility options ordered from most to least open.
// Descriptions are editorial observations, not instructions.
const VISIBILITY_OPTIONS: ReadonlyArray<{
  value: Profile['privacy_level']
  label: string
  description: string
}> = [
  {
    value: 'public',
    label: 'Public',
    description: 'Your full presence is visible and findable across the community.',
  },
  {
    value: 'limited',
    label: 'Limited',
    description: 'Essentials visible; personal details and bio held back from casual views.',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'A quiet footprint — name and avatar only, to those you interact with.',
  },
] as const

type ProfileFormProps = {
  profile: Profile
  avatarUrl?: string | null
}

function getAvatarFallback(profile: Profile) {
  const source = profile.full_name?.trim() || profile.username
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'ST'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function SaveProfileButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="cta-primary disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}

export function ProfileForm({ profile, avatarUrl }: ProfileFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(updateProfile, null)
  const [bioLength, setBioLength] = useState(profile.bio?.length ?? 0)
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null)
  const [avatarName, setAvatarName] = useState<string | null>(null)
  const [privacyLevel, setPrivacyLevel] = useState<Profile['privacy_level']>(
    profile.privacy_level,
  )

  const avatarFallback = useMemo(() => getAvatarFallback(profile), [profile])
  const currentAvatarSrc = localAvatarPreview ?? avatarUrl ?? null

  // Presence note — a quiet editorial observation about identity depth.
  // Returns null when the profile is warm (nothing to observe).
  // Never a task list. Never a score. Just an honest, intimate aside.
  const presenceNote = useMemo(() => {
    const gaps = [
      !profile.avatar_url,
      !profile.bio?.trim(),
      !profile.full_name?.trim(),
    ].filter(Boolean).length
    if (gaps === 0) return null
    if (gaps >= 2) return 'Your presence is still taking shape.'
    return 'A small detail still unfolding.'
  }, [profile.avatar_url, profile.bio, profile.full_name])

  useEffect(() => {
    if (state?.success) {
      router.refresh()
    }
  }, [state?.success, router])

  useEffect(() => {
    return () => {
      if (localAvatarPreview) {
        URL.revokeObjectURL(localAvatarPreview)
      }
    }
  }, [localAvatarPreview])

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview)
    }

    if (!file) {
      setLocalAvatarPreview(null)
      setAvatarName(null)
      return
    }

    setLocalAvatarPreview(URL.createObjectURL(file))
    setAvatarName(file.name)
  }

  return (
    <div className="profile-page-stage shell-inline shell-pb-safe pb-20 pt-8 sm:pb-28 sm:pt-12">
      {/* Mid-page atmospheric warmth — felt, not seen */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-6%] top-[18rem] h-[32rem] w-[32rem] rounded-full bg-[#fab642]/[0.058] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-4%] top-[34rem] h-[26rem] w-[26rem] rounded-full bg-[#e34b16]/[0.038] blur-3xl"
      />

      <div className="profile-page-inner mx-auto min-w-0 max-w-3xl overflow-x-clip">
        {/* Breadcrumb — clean, no styled card */}
        <nav aria-label="Breadcrumb" className="mb-9 flex items-center gap-2 text-xs sm:mb-11">
          <Link
            href="/dashboard"
            className="font-semibold text-[#e34b16] transition hover:text-[#c74010]"
          >
            My dashboard
          </Link>
          <span className="text-[#c8a882]/65" aria-hidden>
            /
          </span>
          <span className="font-medium text-[#7a331b]/55">My profile</span>
        </nav>

        {/* Hero — open surface, no card wrapper */}
        <header className="mb-7 sm:mb-9">
          <p className="eyebrow text-[0.65rem] tracking-[0.26em]">Your space</p>
          <h1 className="display-headline mt-3 text-[1.85rem] text-[#713522] sm:text-[2.25rem] lg:text-[2.6rem]">
            Your presence in the community
          </h1>
          <p className="mt-4 max-w-[29rem] text-sm leading-relaxed text-[#7a331b]/62 sm:text-[0.9375rem]">
            Everything here travels with you — across stories, replies, and community spaces.
          </p>

          {/* Presence note — true marginalia. Further from the main column than a typical aside.
              Disappears entirely when the profile is warm. */}
          {presenceNote && (
            <p className="mt-7 ml-3 border-l border-[#c8a882]/24 pl-3.5 text-[0.76rem] italic text-[#7a331b]/38 sm:ml-5">
              {presenceNote}
            </p>
          )}
        </header>

        {/* Compositional anchor rule — passage into the identity document.
            More air above (breathing room after hero) than below (pulls toward portrait). */}
        <div className="editorial-rule mb-6 sm:mb-7" />

        {/* State notices — above the form surface */}
        {state?.success ? (
          <div
            className="mb-9 rounded-2xl border border-green-200/80 bg-green-50/95 p-4 text-sm font-medium leading-snug text-green-900"
            role="status"
            aria-live="polite"
          >
            Profile saved — your presence across the community updates immediately.
          </div>
        ) : null}

        {state?.error ? (
          <div
            className="mb-9 rounded-2xl border border-red-200/80 bg-red-50/95 p-4 text-sm font-medium leading-snug text-red-900"
            role="alert"
            aria-live="assertive"
          >
            {state.error}
          </div>
        ) : null}

        {/* Form — zones on the page surface, no outer card */}
        <form action={formAction} className="min-w-0">
          {/* Portrait zone.
              Mobile/sm: two-row grid — [avatar | meta] then [upload spans full width].
              md+: single horizontal strip — avatar | meta | upload, vertically centered.
              No stacked-form spacing on desktop. */}
          <section
            className="profile-portrait-zone relative mb-10 overflow-hidden px-5 pb-6 pt-5 sm:mb-12 sm:px-7 sm:pb-7 sm:pt-5"
            aria-labelledby="portrait-section-label"
          >
            {/* Paper warmth pool — light settling into the surface corner, subliminal */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-[0.032]"
              style={{
                background:
                  'radial-gradient(circle at 22% 28%, rgba(250,182,66,0.6), transparent 62%)',
              }}
            />

            <p id="portrait-section-label" className="profile-form-section-label relative mb-4 sm:mb-5">
              Portrait
            </p>

            {/*
              Grid template:
                Mobile/sm : [auto | 1fr]        — avatar + meta in row 1, upload in row 2
                md+       : [auto | 1fr | 14rem] — all three in a single horizontal strip
            */}
            <div className="relative grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-5 sm:gap-x-5 md:grid-cols-[auto_1fr_14rem] md:items-center md:gap-x-6 md:gap-y-0">
              {/* Col 1 — avatar ring */}
              <div className="profile-avatar-ring shrink-0">
                <div className="rounded-full bg-white p-1">
                  <Avatar
                    src={currentAvatarSrc}
                    fallback={avatarFallback}
                    alt={`${profile.username} avatar`}
                    size="xl"
                  />
                </div>
              </div>

              {/* Col 2 — portrait status + whisper */}
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-sm font-medium',
                    profile.avatar_url || avatarName
                      ? 'text-[#713522]'
                      : 'text-[#713522]/72',
                  )}
                >
                  {avatarName ??
                    (profile.avatar_url ? 'Current portrait on file' : 'No portrait yet')}
                </p>
                <p className="mt-1.5 text-xs text-[#7a331b]/44">
                  JPG, PNG, or WebP · up to 2MB
                </p>
                {/* Portrait whisper — an intimate aside, not an instruction */}
                {!profile.avatar_url && !localAvatarPreview && !avatarName && (
                  <p className="mt-2.5 text-[0.75rem] italic text-[#7a331b]/36">
                    A face helps people place you.
                  </p>
                )}
              </div>

              {/* Col 3 — upload action.
                  Mobile: spans both columns (full-width row).
                  md+: right column, label hidden (sr-only), input only. */}
              <div className="col-span-2 md:col-span-1">
                <label
                  htmlFor="avatar"
                  className="mb-2.5 block text-sm font-medium text-[#713522]/75 md:sr-only"
                >
                  Replace portrait
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="warm-focus-ring block min-h-[3.25rem] w-full rounded-2xl border border-[#7a331b]/10 bg-white/70 px-4 py-3.5 text-base text-[#7a331b]/72 file:mr-3 file:min-h-10 file:rounded-full file:border-0 file:bg-brand-cream file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#713522] hover:file:bg-[#fab642]/45 sm:min-h-0 sm:text-sm"
                />
              </div>
            </div>
          </section>

          {/* Identity fields — username and full name.
              Mobile/sm: stacked with gap cadence and subtle drift on full name.
              md+: side-by-side 40/60 grid — username column is compact (handle),
              full name column is wider (identity anchor). Gap replaces top-margin. */}
          <section className="mb-10 sm:mb-12">
            <div className="grid grid-cols-1 gap-y-9 sm:gap-y-11 md:grid-cols-[2fr_3fr] md:items-start md:gap-x-6 md:gap-y-0">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#713522]">
                  Username <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  defaultValue={profile.username}
                  autoComplete="username"
                  className="editorial-input warm-focus-ring min-h-12 min-w-0 max-w-[20rem] px-4 py-3.5 text-base sm:min-h-0 sm:py-3 sm:text-sm md:max-w-none"
                  placeholder="choose a username"
                  pattern="[a-zA-Z0-9_]+"
                  title="Username can only contain letters, numbers, and underscores"
                  required
                />
                <p className="mt-1.5 text-xs text-[#7a331b]/42">
                  Letters, numbers, and underscores only.
                </p>
              </div>

              <div className="ml-1 sm:ml-2 md:ml-0">
                <label htmlFor="full_name" className="mb-3 block text-sm font-semibold text-[#713522]">
                  Full name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  defaultValue={profile.full_name || ''}
                  autoComplete="name"
                  className="editorial-input warm-focus-ring min-h-12 min-w-0 px-4 py-3.5 text-base sm:min-h-0 sm:py-3 sm:text-sm"
                  placeholder="How you're known"
                />
                {!profile.full_name?.trim() ? (
                  <p className="mt-2 text-xs text-[#7a331b]/48">
                    Appears next to your portrait across the community.
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {/* Voice and presence — visibility, bio.
              Warm tint with whisper-border only — no elevation, no card shadow. */}
          <section
            className="mb-12 rounded-2xl border border-[#fab642]/15 bg-gradient-to-b from-[#f7e8be]/20 to-[#fffdf8]/52 p-5 sm:mb-14 sm:p-7"
            aria-labelledby="voice-section-label"
          >
            <div className="mb-7 sm:mb-9">
              <p id="voice-section-label" className="profile-form-section-label mb-1">
                Voice &amp; presence
              </p>
              <p className="text-sm text-[#7a331b]/55">
                Choose who can find you, then say a few words about how you travel.
              </p>
            </div>

            <div className="space-y-7 sm:space-y-8">
              {/* Visibility — editorial radio-card grid.
                  Three choices feel like authorial decisions, not settings options.
                  Selected card: warm amber surface + barely-visible dot mark.
                  Unselected: transparent, hint border on hover. */}
              <div>
                <p
                  id="visibility-label"
                  className="mb-3 text-sm font-semibold text-[#713522]"
                >
                  Profile visibility
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="visibility-label"
                  className="flex flex-col gap-2 sm:flex-row sm:gap-2.5"
                >
                  {VISIBILITY_OPTIONS.map((opt) => {
                    const isSelected = privacyLevel === opt.value
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          'relative flex-1 cursor-pointer rounded-xl border px-4 py-3.5 transition-colors duration-200',
                          isSelected
                            ? 'border-[#fab642]/45 bg-gradient-to-br from-[#fef6e4]/55 to-[#fffdf8]/70'
                            : 'border-[#c8a882]/22 bg-transparent hover:border-[#c8a882]/42 hover:bg-[#fffdf8]/35',
                        )}
                      >
                        <input
                          type="radio"
                          name="privacy_level"
                          value={opt.value}
                          checked={isSelected}
                          onChange={() => setPrivacyLevel(opt.value)}
                          className="sr-only"
                        />
                        {/* Warm selection mark — subtle dot, not a checkbox */}
                        {isSelected && (
                          <span
                            aria-hidden
                            className="absolute right-3 top-3 h-[0.35rem] w-[0.35rem] rounded-full bg-[#e34b16]/50"
                          />
                        )}
                        <span className="block text-sm font-semibold text-[#713522]">
                          {opt.label}
                        </span>
                        <span className="mt-1 block text-[0.71rem] leading-relaxed text-[#7a331b]/50">
                          {opt.description}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Soft compositional pause before bio — separates "who sees you" from "who you are".
                  space-y-7 above provides the margin before the rule line;
                  pt-6/7 provides breathing room after it. */}
              <div className="border-t border-[#c8a882]/12 pt-6 sm:pt-7">
                <label
                  htmlFor="bio"
                  className="mb-2.5 block text-sm font-medium text-[#713522]/82"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={profile.bio || ''}
                  rows={7}
                  maxLength={500}
                  onChange={(e) => setBioLength(e.target.value.length)}
                  className="editorial-input warm-focus-ring min-h-[12rem] min-w-0 resize-none px-5 py-5 text-base leading-[1.72] sm:min-h-[10rem] sm:text-sm"
                  placeholder="A few words about how you travel…"
                  style={{ background: '#fffdf8' }}
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {bioLength > 380 ? (
                    <p className="text-xs text-[#7a331b]/50">
                      <span className={cn(bioLength > 450 && 'font-semibold text-[#e34b16]')}>
                        {bioLength} / 500
                      </span>
                    </p>
                  ) : (
                    <span />
                  )}
                  {!profile.bio?.trim() ? (
                    <span className="text-xs italic text-[#7a331b]/46">
                      A few lines goes a long way.
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion — long approach into the final authoring act, quiet exit below */}
          <div className="flex flex-col items-end gap-3 pt-8 pb-4 sm:pt-12 sm:pb-6">
            <SaveProfileButton />
            <Link
              href="/dashboard"
              className="text-[0.69rem] text-[#7a331b]/38 transition hover:text-[#7a331b]/60"
            >
              Back to dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
