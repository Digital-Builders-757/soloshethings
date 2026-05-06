/**
 * Submit a Spot/Story Page
 *
 * Authenticated route — middleware + server `getUser()` per AUTH_CONTRACT.
 */

import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SubmitPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login?redirectTo=/submit')
  }

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-3xl flex-1 overflow-x-clip">
      <h1 className="mb-6 font-serif text-3xl font-bold text-[#7a331b] sm:mb-8 sm:text-4xl">Submit a Safe Spot</h1>

      <div className="surface-card mb-8 p-5 text-foreground sm:p-6">
        <p className="text-sm font-semibold leading-relaxed sm:text-base">
          This route is signed-in only. The full submission flow ships in a later release—form fields below
          are a layout preview.
        </p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full min-w-0 rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#e34b16]"
            placeholder="Name of the safe spot or story title"
            disabled
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            className="w-full min-w-0 rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#e34b16]"
            placeholder="Tell us about this safe spot or share your travel story..."
            disabled
          />
        </div>

        <div>
          <label htmlFor="images" className="mb-2 block text-sm font-medium">
            Photos
          </label>
          <div className="rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center sm:p-8">
            <p className="text-neutral-600">Image upload will be implemented in a future release.</p>
            <p className="mt-2 text-sm text-neutral-500">
              Privacy: We do not use face recognition on your photos.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="privacy" className="mb-2 block text-sm font-medium">
            Privacy Setting
          </label>
          <select
            id="privacy"
            name="privacy"
            className="w-full min-w-0 rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#e34b16]"
            disabled
          >
            <option value="public">Public — authenticated members can see</option>
            <option value="private">Private — only you can see</option>
          </select>
        </div>

        <div className="rounded-lg bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700">
            <strong>Privacy note:</strong> Your photos are yours. We do not use face recognition on
            user-uploaded content. See our{" "}
            <a href="/privacy" className="font-medium text-[#e34b16] hover:text-[#c74010]">
              Privacy Policy
            </a>{" "}
            for more information.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#e34b16] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#c74010] disabled:cursor-not-allowed disabled:opacity-50"
          disabled
        >
          Submit (coming soon)
        </button>
      </form>
    </main>
  )
}
