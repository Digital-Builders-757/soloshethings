/**
 * Profile Form Component
 *
 * Client component for editing profile
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
      className="cta-primary min-h-12 w-full px-8 py-3.5 text-base shadow-[0_10px_24px_rgba(227,75,22,0.3)] hover:bg-[#c74010] disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:flex-1 sm:py-3 sm:text-sm"
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

  const avatarFallback = useMemo(() => getAvatarFallback(profile), [profile])
  const currentAvatarSrc = localAvatarPreview ?? avatarUrl ?? null

  const checklistItems = useMemo(
    () => [
      { label: 'Avatar added', done: Boolean(profile.avatar_url) },
      { label: 'Display name added', done: Boolean(profile.full_name?.trim()) },
      { label: 'Bio written', done: Boolean(profile.bio?.trim()) },
      { label: 'Visibility reviewed', done: Boolean(profile.privacy_level) },
    ],
    [profile.avatar_url, profile.full_name, profile.bio, profile.privacy_level]
  )

  const completedCount = checklistItems.filter((item) => item.done).length
  const checklistTotal = checklistItems.length
  const completionPercent =
    checklistTotal === 0 ? 0 : Math.min(100, Math.round((completedCount / checklistTotal) * 100))

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
    <div className="profile-page-stage shell-inline shell-pb-safe pb-12 pt-6 sm:pb-16 sm:pt-10">
      <div className="profile-page-inner mx-auto min-w-0 max-w-2xl overflow-x-clip">
        <div className="story-detail-breadcrumb-strip mb-5 sm:mb-6">
          <nav aria-label="Breadcrumb" className="text-sm text-brand-blue/85">
            <Link href="/dashboard" className="font-semibold text-brand-orange transition hover:text-brand-coral">
              My dashboard
            </Link>
            <span className="mx-2 text-brand-gold/90" aria-hidden>
              /
            </span>
            <span className="font-medium text-brand-pinkDark">My profile</span>
          </nav>
          <p className="story-detail-return-hint">
            This is your member card across Solo SHE Things — warm it up with a photo and a few honest lines.
          </p>
        </div>

        <header className="places-hero-shell mb-6 overflow-hidden p-5 sm:mb-8 sm:p-8">
          <div className="places-hero-inner">
            <p className="eyebrow text-[0.65rem] tracking-[0.24em]">Your space</p>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-pinkDark sm:text-4xl">
              Shape how you show up in the community
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-blue/85 sm:text-base">
              Username, photo, visibility, and bio travel with you on the dashboard, stories, and anywhere your profile
              appears. Save anytime — we refresh your snapshot right away.
            </p>

            <div className="community-context-banner mt-5 px-4 py-4 sm:mt-6 sm:px-5 sm:py-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="profile-form-section-label text-[0.65rem]">Profile glow-up</p>
                  <p className="mt-1 font-serif text-xl font-bold text-brand-pinkDark sm:text-2xl">
                    {completedCount === checklistTotal ? (
                      <>You&apos;re all set — profile feels complete.</>
                    ) : (
                      <>
                        {completedCount} of {checklistTotal} touches done
                      </>
                    )}
                  </p>
                </div>
                <span
                  className={cn(
                    'community-summary-chip shrink-0 text-xs font-bold tabular-nums',
                    completedCount === checklistTotal ? 'community-summary-chip-gold' : 'community-summary-chip-ember'
                  )}
                  aria-hidden
                >
                  {completionPercent}%
                </span>
              </div>
              <div
                className="profile-completion-track mt-4"
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={0}
                aria-valuemax={checklistTotal}
                aria-label={`Profile checklist: ${completedCount} of ${checklistTotal} complete`}
              >
                <div className="profile-completion-fill" style={{ width: `${completionPercent}%` }} />
              </div>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5" aria-label="Profile completion checklist">
                {checklistItems.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      'profile-checklist-row text-sm',
                      item.done ? 'profile-checklist-row-done font-medium text-brand-pinkDark' : 'profile-checklist-row-open text-brand-blue/85'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2.5 w-2.5 shrink-0 rounded-full',
                        item.done ? 'bg-brand-orange' : 'bg-brand-blue/35'
                      )}
                      aria-hidden
                    />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <div className="editorial-card-strong overflow-hidden p-5 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-brand-pinkDark/10 pb-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4 sm:pb-6">
            <div>
              <p className="profile-form-section-label">Edit details</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-brand-pinkDark">Your profile</h2>
            </div>
            <span className="community-summary-chip community-summary-chip-gold text-xs font-semibold capitalize">
              @{profile.username}
            </span>
          </div>

          {state?.success ? (
            <div
              className="mt-5 rounded-2xl border border-green-200/80 bg-green-50/95 p-4 text-sm font-medium leading-snug text-green-900 backdrop-blur-sm sm:mt-6"
              role="status"
              aria-live="polite"
            >
              Profile saved — nice work. Your dashboard and member surfaces will pick this up immediately.
            </div>
          ) : null}

          {state?.error ? (
            <div
              className="mt-5 rounded-2xl border border-red-200/80 bg-red-50/95 p-4 text-sm font-medium leading-snug text-red-900 backdrop-blur-sm sm:mt-6"
              role="alert"
              aria-live="assertive"
            >
              {state.error}
            </div>
          ) : null}

          <form action={formAction} className="mt-6 min-w-0 space-y-6 sm:mt-8 sm:space-y-8">
            <section className="profile-avatar-panel p-4 sm:p-6">
              <p className="profile-form-section-label mb-1">Photo &amp; presence</p>
              <p className="text-sm text-brand-blue/85">A friendly face makes saves, stories, and replies feel more human.</p>

              <div className="mt-5 flex flex-col gap-6 sm:mt-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
                  <div className="profile-avatar-ring">
                    <div className="rounded-full bg-white p-1">
                      <Avatar
                        src={currentAvatarSrc}
                        fallback={avatarFallback}
                        alt={`${profile.username} avatar`}
                        size="xl"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-pinkDark">
                      {avatarName ??
                        (profile.avatar_url ? 'Current avatar on file' : 'No avatar yet — add one when you’re ready')}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-brand-blue/85">
                      JPG, PNG, or WebP up to 2MB. Stored privately; we refresh signed URLs after save.
                    </p>
                    {!profile.avatar_url && !localAvatarPreview ? (
                      <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-pinkDark/25 bg-white/80 px-3 py-2 text-xs font-semibold text-brand-pinkDark">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden />
                        Incomplete — upload optional but recommended
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="min-w-0 lg:w-[min(100%,19rem)] lg:shrink-0">
                  <label htmlFor="avatar" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
                    Upload a new avatar
                  </label>
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="warm-focus-ring block min-h-[3.25rem] w-full rounded-2xl border border-brand-pinkDark/15 bg-white px-4 py-3.5 text-base text-brand-blue/90 file:mr-3 file:min-h-10 file:rounded-full file:border-0 file:bg-brand-cream file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-brand-pinkDark hover:file:bg-brand-gold/55 sm:min-h-0 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            <section className="profile-form-well space-y-5 p-4 sm:space-y-6 sm:p-6">
              <div>
                <p className="profile-form-section-label mb-4">Account basics</p>
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="username" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
                      Username <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      defaultValue={profile.username}
                      autoComplete="username"
                      className="editorial-input warm-focus-ring min-h-12 min-w-0 px-4 py-3.5 text-base sm:min-h-0 sm:py-3 sm:text-sm"
                      placeholder="choose a username"
                      pattern="[a-zA-Z0-9_]+"
                      title="Username can only contain letters, numbers, and underscores"
                      required
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Letters, numbers, and underscores only.</p>
                  </div>

                  <div>
                    <label htmlFor="full_name" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
                      Full name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      defaultValue={profile.full_name || ''}
                      autoComplete="name"
                      className="editorial-input warm-focus-ring min-h-12 min-w-0 px-4 py-3.5 text-base sm:min-h-0 sm:py-3 sm:text-sm"
                      placeholder="Your full name"
                    />
                    {!profile.full_name?.trim() ? (
                      <p className="mt-2 text-xs font-medium text-brand-orange">Adds warmth next to your avatar everywhere.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="editorial-card-sun space-y-5 p-4 sm:space-y-6 sm:p-6">
              <div>
                <p className="profile-form-section-label mb-1">How you show up</p>
                <p className="text-sm text-brand-blue/85">Visibility is enforced with RLS — pick what feels right for how you travel.</p>
              </div>

              <div>
                <label htmlFor="privacy_level" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
                  Profile visibility
                </label>
                <select
                  id="privacy_level"
                  name="privacy_level"
                  defaultValue={profile.privacy_level}
                  className="editorial-input warm-focus-ring min-h-12 min-w-0 px-4 py-3.5 text-base sm:min-h-0 sm:py-3 sm:text-sm"
                >
                  <option value="public">Public — shareable across the community</option>
                  <option value="limited">Limited — basics visible; details restrained</option>
                  <option value="private">Private — minimal public footprint</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">
                  Visibility is enforced in the database (RLS). This is your default for how your profile appears.
                </p>
              </div>

              <div>
                <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  defaultValue={profile.bio || ''}
                  rows={5}
                  maxLength={500}
                  onChange={(e) => setBioLength(e.target.value.length)}
                  className="editorial-input warm-focus-ring min-h-[10rem] min-w-0 resize-none px-4 py-3.5 text-base leading-relaxed sm:min-h-[9rem] sm:text-sm"
                  placeholder="Tell us about yourself..."
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    <span className={cn(bioLength > 0 && 'font-semibold text-brand-pinkDark')}>
                      {bioLength} / 500 characters
                    </span>
                  </p>
                  {!profile.bio?.trim() ? (
                    <span className="text-xs font-medium text-brand-pinkDark/70">A few lines goes a long way.</span>
                  ) : null}
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:gap-4">
              <SaveProfileButton />
              <Link
                href="/dashboard"
                className="cta-secondary flex min-h-12 flex-1 items-center justify-center px-8 py-3 text-center text-sm"
              >
                Back to my dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
