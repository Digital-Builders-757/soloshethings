/**
 * Profile Form Component
 *
 * Client component for editing profile
 */

'use client'

import { updateProfile } from '@/app/actions/profile'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

type Profile = Database['public']['Tables']['profiles']['Row']

type ProfileFormProps = {
  profile: Profile
}

function SaveProfileButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 flex-1 rounded-full bg-[#e34b16] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(227,75,22,0.3)] transition hover:bg-[#c74010] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [state, formAction] = useFormState(updateProfile, null)
  const [bioLength, setBioLength] = useState(profile.bio?.length ?? 0)

  useEffect(() => {
    if (state?.success) {
      router.refresh()
    }
  }, [state?.success, router])

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

        <div className="surface-card rounded-[1.25rem] p-6 sm:p-8">
          <h1 className="font-serif text-2xl font-bold text-[#7a331b] sm:text-3xl">Your profile</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Username and visibility apply across the site. Saving updates your dashboard snapshot right
            away.
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
                className="w-full min-w-0 rounded-xl border border-[#ead8c2] bg-white px-4 py-3 text-[#3a3a3a] shadow-sm outline-none transition focus:ring-2 focus:ring-[#e34b16]/25"
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
                className="w-full min-w-0 rounded-xl border border-[#ead8c2] bg-white px-4 py-3 text-[#3a3a3a] shadow-sm outline-none transition focus:ring-2 focus:ring-[#e34b16]/25"
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
                className="w-full min-w-0 rounded-xl border border-[#ead8c2] bg-white px-4 py-3 text-[#3a3a3a] shadow-sm outline-none transition focus:ring-2 focus:ring-[#e34b16]/25"
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
                className="w-full min-w-0 resize-none rounded-xl border border-[#ead8c2] bg-white px-4 py-3 text-[#3a3a3a] shadow-sm outline-none transition focus:ring-2 focus:ring-[#e34b16]/25"
                placeholder="Tell us about yourself..."
              />
              <p className="mt-1 text-xs text-muted-foreground">{bioLength} / 500 characters</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <SaveProfileButton />
              <Link
                href="/dashboard"
                className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-8 py-3 text-center text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/35 hover:text-[#e34b16] active:scale-[0.98]"
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
