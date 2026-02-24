/**
 * Profile Form Component
 * 
 * Client component for editing profile
 */

'use client';

import { updateProfile } from '@/app/actions/profile';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useFormState(updateProfile, null);

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-brand-orange hover:text-brand-orange/80 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="surface-card rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-brand-pink">Edit Profile</h1>

          {state?.success && (
            <div className="mb-4 p-4 bg-green-50/80 border border-green-200/60 rounded-xl text-green-700 text-sm backdrop-blur-sm">
              Profile updated successfully!
            </div>
          )}

          {state?.error && (
            <div className="mb-4 p-4 bg-red-50/80 border border-red-200/60 rounded-xl text-red-700 text-sm backdrop-blur-sm">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-neutral-700">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={profile.username}
                className="w-full px-4 py-3 border border-neutral-300/60 rounded-xl focus-ring bg-white/80 backdrop-blur-sm transition-all"
                placeholder="choose a username"
                pattern="[a-zA-Z0-9_]+"
                title="Username can only contain letters, numbers, and underscores"
                required
              />
              <p className="mt-1 text-xs text-neutral-500">
                Username can only contain letters, numbers, and underscores
              </p>
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-2 text-neutral-700">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name || ''}
                className="w-full px-4 py-3 border border-neutral-300/60 rounded-xl focus-ring bg-white/80 backdrop-blur-sm transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2 text-neutral-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ''}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-neutral-300/60 rounded-xl focus-ring bg-white/80 backdrop-blur-sm transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="mt-1 text-xs text-neutral-500">
                {profile.bio?.length || 0} / 500 characters
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-brand-orange text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-orange/90 transition-all active:scale-[0.98]"
              >
                Save Changes
              </button>
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-neutral-100 text-neutral-900 px-8 py-3 rounded-full font-semibold hover:bg-neutral-200 transition-all active:scale-[0.98]"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

