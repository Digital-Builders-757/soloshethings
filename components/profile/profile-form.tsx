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
 * Phase 5:   travel style tags — curated chip grid below bio; max 8 selections.
 * Phase 6:   avatar crop modal — square crop before profile save; server upload unchanged.
 */

'use client'

import { updateProfile } from '@/app/actions/profile'
import { AvatarCropModal } from '@/components/profile/avatar-crop-modal'
import { Avatar } from '@/components/ui/avatar'
import { TRAVEL_STYLE_OPTIONS, TRAVEL_STYLES_MAX } from '@/lib/profile-travel-styles'
import {
  AVATAR_ACCEPT,
  validateAvatarFile,
  type AvatarMimeType,
} from '@/lib/storage/avatar-client'
import type { Database } from '@/types/database'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ChangeEvent, FormEvent } from 'react'
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from 'react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cropImageSrcRef = useRef<string | null>(null)
  const [state, formAction] = useActionState(updateProfile, null)
  const [bioLength, setBioLength] = useState(profile.bio?.length ?? 0)
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null)
  const [avatarName, setAvatarName] = useState<string | null>(null)
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
  const [avatarPickError, setAvatarPickError] = useState<string | null>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [cropSourceFileName, setCropSourceFileName] = useState('')
  const [cropMimeType, setCropMimeType] = useState<AvatarMimeType>('image/jpeg')
  const [privacyLevel, setPrivacyLevel] = useState<Profile['privacy_level']>(
    profile.privacy_level,
  )
  const [travelStyles, setTravelStyles] = useState<string[]>(profile.travel_styles ?? [])

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
      if (cropImageSrcRef.current) {
        URL.revokeObjectURL(cropImageSrcRef.current)
      }
    }
  }, [localAvatarPreview])

  function clearCropSource() {
    if (cropImageSrcRef.current) {
      URL.revokeObjectURL(cropImageSrcRef.current)
      cropImageSrcRef.current = null
    }
    setCropImageSrc(null)
  }

  function handleAvatarPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ''

    setAvatarPickError(null)

    if (!file) {
      return
    }

    const validationError = validateAvatarFile(file)
    if (validationError) {
      setAvatarPickError(validationError)
      return
    }

    clearCropSource()
    const nextCropSrc = URL.createObjectURL(file)
    cropImageSrcRef.current = nextCropSrc
    setCropImageSrc(nextCropSrc)
    setCropSourceFileName(file.name)
    setCropMimeType(file.type as AvatarMimeType)
    setCropModalOpen(true)
  }

  function handleCropConfirm(croppedFile: File) {
    const validationError = validateAvatarFile(croppedFile)
    if (validationError) {
      setAvatarPickError(validationError)
      setCropModalOpen(false)
      clearCropSource()
      return
    }

    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview)
    }

    setPendingAvatarFile(croppedFile)
    setLocalAvatarPreview(URL.createObjectURL(croppedFile))
    setAvatarName('Portrait ready to save')
    setAvatarPickError(null)
    setCropModalOpen(false)
    clearCropSource()
  }

  function handleCropCancel() {
    setCropModalOpen(false)
    clearCropSource()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!pendingAvatarFile) {
      return
    }

    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set('avatar', pendingAvatarFile)

    startTransition(() => {
      formAction(formData)
    })
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
        <form action={formAction} onSubmit={handleSubmit} className="min-w-0">
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
                    profile.avatar_url || avatarName || pendingAvatarFile
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
                <input
                  ref={fileInputRef}
                  id="avatar"
                  type="file"
                  accept={AVATAR_ACCEPT}
                  onChange={handleAvatarPick}
                  className="sr-only"
                />
                <label
                  htmlFor="avatar"
                  className="mb-2.5 block text-sm font-medium text-[#713522]/75 md:sr-only"
                >
                  Replace portrait
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="warm-focus-ring min-h-11 w-full rounded-2xl border border-[#7a331b]/12 bg-white/70 px-4 py-3 text-sm font-medium text-[#713522] transition hover:border-[#c8a882]/45 hover:bg-[#fffdf8]"
                >
                  {pendingAvatarFile || profile.avatar_url ? 'Replace portrait' : 'Choose portrait'}
                </button>
                {avatarPickError ? (
                  <p className="mt-2 text-xs font-medium text-red-900" role="alert">
                    {avatarPickError}
                  </p>
                ) : null}
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

              {/* Travel style tags — curated chip grid.
                  Chips are sr-only checkboxes inside labels (mirrors visibility radio-card pattern).
                  Selections capped at TRAVEL_STYLES_MAX; unselectable chips fade when limit is reached.
                  Server action whitelists and slices the submitted values as the authoritative guard. */}
              <div className="border-t border-[#c8a882]/12 pt-6 sm:pt-7">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p id="travel-style-label" className="text-sm font-medium text-[#713522]/82">
                    How you travel
                  </p>
                  <span
                    className={cn(
                      'text-xs transition-colors duration-200',
                      travelStyles.length >= TRAVEL_STYLES_MAX
                        ? 'font-semibold text-[#e34b16]/75'
                        : 'text-[#7a331b]/38',
                    )}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {travelStyles.length >= TRAVEL_STYLES_MAX
                      ? `${TRAVEL_STYLES_MAX} of ${TRAVEL_STYLES_MAX} selected`
                      : `Choose up to ${TRAVEL_STYLES_MAX} styles`}
                  </span>
                </div>

                <div
                  role="group"
                  aria-labelledby="travel-style-label"
                  className="flex flex-wrap gap-2"
                >
                  {TRAVEL_STYLE_OPTIONS.map((style) => {
                    const isSelected = travelStyles.includes(style.value)
                    const isDisabled = !isSelected && travelStyles.length >= TRAVEL_STYLES_MAX

                    return (
                      <label
                        key={style.value}
                        className={cn(
                          'relative cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-medium transition-colors duration-150',
                          isSelected
                            ? 'border-[#fab642]/55 bg-[#fef6e4] text-[#713522]'
                            : isDisabled
                              ? 'cursor-not-allowed border-[#c8a882]/18 bg-transparent text-[#7a331b]/28'
                              : 'border-[#c8a882]/30 bg-transparent text-[#7a331b]/60 hover:border-[#c8a882]/50 hover:text-[#7a331b]/80',
                        )}
                      >
                        <input
                          type="checkbox"
                          name="travel_styles"
                          value={style.value}
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => {
                            if (isDisabled) return
                            setTravelStyles((prev) =>
                              prev.includes(style.value)
                                ? prev.filter((v) => v !== style.value)
                                : [...prev, style.value],
                            )
                          }}
                          className="sr-only"
                          aria-label={style.label}
                        />
                        {style.label}
                      </label>
                    )
                  })}
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

        <AvatarCropModal
          open={cropModalOpen}
          imageSrc={cropImageSrc}
          sourceFileName={cropSourceFileName}
          mimeType={cropMimeType}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      </div>
    </div>
  )
}
