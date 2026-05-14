/**
 * Profile Form Component
 *
 * Client component for editing profile
 */

'use client'

import { updateProfile } from '@/app/actions/profile'
import { Avatar } from '@/components/ui/avatar'
import type { Database } from '@/types/database'
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
      className="cta-primary min-h-12 flex-1 px-8 py-3 text-sm shadow-[0_10px_24px_rgba(227,75,22,0.3)] hover:bg-[#c74010] disabled:pointer-events-none disabled:opacity-60"
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
    <div className="shell-inline py-8 sm:py-10">
      <div className="mx-auto min-w-0 max-w-2xl overflow-x-clip">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#6d5849]">
          <Link
            href="/dashboard"
            className="font-semibold text-[#e34b16] transition hover:text-[#c74010]"
          >
            My dashboard
          </Link>
          <span className="mx-2 text-[#d9c4a8]" aria-hidden>
            /
          </span>
          <span className="font-medium text-[#7a331b]">My profile</span>
        </nav>

        <div className="editorial-card-strong p-6 sm:p-8">
          <h1 className="font-serif text-2xl font-bold text-[#7a331b] sm:text-3xl">Your profile</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Username, photo, and visibility apply across the site. Saving refreshes your dashboard snapshot
            right away.
          </p>

          {state?.success ? (
            <div
              className="mt-6 rounded-xl border border-green-200/70 bg-green-50/90 p-4 text-sm text-green-800 backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              Profile saved.
            </div>
          ) : null}

          {state?.error ? (
            <div
              className="mt-6 rounded-xl border border-red-200/70 bg-red-50/90 p-4 text-sm text-red-800 backdrop-blur-sm"
              role="alert"
              aria-live="assertive"
            >
              {state.error}
            </div>
          ) : null}

          <form action={formAction} className="mt-8 min-w-0 space-y-6">
            <section className="editorial-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-4">
                <Avatar src={currentAvatarSrc} fallback={avatarFallback} alt={`${profile.username} avatar`} size="xl" />
                <div className="min-w-0">
                  <p className="eyebrow text-[0.65rem] tracking-[0.2em]">Profile photo</p>
                  <p className="mt-1 text-sm font-semibold text-[#7a331b]">
                    {avatarName ?? (profile.avatar_url ? 'Current avatar on file' : 'No avatar uploaded yet')}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#6d5849]">
                    JPG, PNG, or WebP up to 2MB. Stored privately and refreshed after save.
                  </p>
                </div>
              </div>

              <div className="sm:w-[19rem]">
                <label htmlFor="avatar" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                  Upload a new avatar
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="warm-focus-ring block w-full rounded-2xl border border-[#ead8c2] bg-white px-4 py-3 text-sm text-[#6d5849] file:mr-3 file:rounded-full file:border-0 file:bg-[#f7e8be] file:px-3 file:py-2 file:font-semibold file:text-[#7a331b] hover:file:bg-[#f3ddb3]"
                />
              </div>
            </section>

            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                Username <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={profile.username}
                autoComplete="username"
                className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
                placeholder="choose a username"
                pattern="[a-zA-Z0-9_]+"
                title="Username can only contain letters, numbers, and underscores"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">Letters, numbers, and underscores only.</p>
            </div>

            <div>
              <label htmlFor="full_name" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                Full name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name || ''}
                autoComplete="name"
                className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="privacy_level" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                Profile visibility
              </label>
              <select
                id="privacy_level"
                name="privacy_level"
                defaultValue={profile.privacy_level}
                className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
              >
                <option value="public">Public — shareable across the community</option>
                <option value="limited">Limited — basics visible; details restrained</option>
                <option value="private">Private — minimal public footprint</option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Visibility is enforced in the database (RLS). This is your default for how your profile
                appears.
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-[#7a331b]">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ''}
                rows={4}
                maxLength={500}
                onChange={(e) => setBioLength(e.target.value.length)}
                className="editorial-input warm-focus-ring min-w-0 resize-none px-4 py-3"
                placeholder="Tell us about yourself..."
              />
              <p className="mt-1 text-xs text-muted-foreground">{bioLength} / 500 characters</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <SaveProfileButton />
              <Link href="/dashboard" className="cta-secondary min-h-12 flex-1 px-8 py-3 text-center text-sm">
                Back to my dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
