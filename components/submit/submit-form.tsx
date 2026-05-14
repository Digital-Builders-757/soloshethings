'use client'

import Link from 'next/link'

import { createCommunityPost } from '@/app/actions/community-posts'
import { buildStoryDetailHref } from '@/lib/community-navigation'
import { useRouter } from 'next/navigation'
import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

type SubmitFormProps = {
  recentPostCount: number
}

type LocalImagePreview = {
  id: string
  name: string
  url: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="cta-primary min-h-12 w-full px-8 py-3 text-sm shadow-[0_10px_24px_rgba(227,75,22,0.3)] hover:bg-[#c74010] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Saving your post…' : 'Publish my post'}
    </button>
  )
}

export function SubmitForm({ recentPostCount }: SubmitFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const previewsRef = useRef<LocalImagePreview[]>([])
  const [state, formAction] = useFormState(createCommunityPost, null)
  const [contentLength, setContentLength] = useState(0)
  const [previews, setPreviews] = useState<LocalImagePreview[]>([])

  const uploadSummary = useMemo(() => {
    if (previews.length === 0) return 'No photos selected yet.'
    if (previews.length === 1) return '1 photo ready to upload.'
    return `${previews.length} photos ready to upload.`
  }, [previews.length])

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      router.refresh()
    }
  }, [router, state?.success])

  useEffect(() => {
    return () => {
      for (const preview of previewsRef.current) {
        URL.revokeObjectURL(preview.url)
      }
    }
  }, [])

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    setPreviews((current) => {
      for (const preview of current) {
        URL.revokeObjectURL(preview.url)
      }

      const nextPreviews = Array.from(event.target.files ?? []).map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }))

      previewsRef.current = nextPreviews
      return nextPreviews
    })
  }

  return (
    <div className="editorial-card-strong p-6 sm:p-8">
      <h1 className="font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl">Submit a safe spot or story</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5849] sm:text-base">
        This is now a real save flow. Posts publish into your community record right away, private posts stay
        scoped to you, and the member feed now shows public stories plus your own submissions.
      </p>

      {state?.success ? (
        <div
          className="mt-6 rounded-2xl border border-green-200/80 bg-green-50/90 p-4 text-sm text-green-800"
          role="status"
          aria-live="polite"
        >
          <p>
            Post saved. {state.uploadedCount ?? 0} image{state.uploadedCount === 1 ? '' : 's'} uploaded.
            {recentPostCount === 0 ? ' Your first submission is now on file.' : ' Your latest submission appears below.'}
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            {state.postId ? (
              <Link
                href={buildStoryDetailHref(state.postId, '/submit')}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-green-900 px-4 text-sm font-semibold text-white transition hover:bg-green-950"
              >
                Open story controls
              </Link>
            ) : null}
            <Link
              href="/places"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-green-300 bg-white px-4 text-sm font-semibold text-green-900 transition hover:border-green-400 hover:text-green-950"
            >
              Browse community feed
            </Link>
          </div>
        </div>
      ) : null}

      {state?.error ? (
        <div
          className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/90 p-4 text-sm text-red-800"
          role="alert"
          aria-live="assertive"
        >
          {state.error}
        </div>
      ) : null}

      <form ref={formRef} action={formAction} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#7a331b]">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
            placeholder="Name of the safe spot or story title"
            maxLength={200}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-semibold text-[#7a331b]">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            maxLength={5000}
            onChange={(event) => setContentLength(event.target.value.length)}
            className="editorial-input warm-focus-ring min-w-0 resize-y px-4 py-3"
            placeholder="Tell us why this place felt safe, useful, or memorable. Include the practical context another member would want to know."
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">{contentLength} / 5000 characters</p>
        </div>

        <div>
          <label htmlFor="images" className="mb-2 block text-sm font-semibold text-[#7a331b]">
            Photos
          </label>
          <div className="rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4 sm:p-5">
            <input
              id="images"
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImagesChange}
              className="warm-focus-ring block w-full rounded-2xl border border-[#ead8c2] bg-white px-4 py-3 text-sm text-[#6d5849] file:mr-3 file:rounded-full file:border-0 file:bg-[#f7e8be] file:px-3 file:py-2 file:font-semibold file:text-[#7a331b] hover:file:bg-[#f3ddb3]"
            />
            <p className="mt-3 text-sm text-[#6d5849]">{uploadSummary}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Up to 5 JPG, PNG, or WebP images, 5MB each. We do not use face recognition on user-uploaded
              content.
            </p>

            {previews.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {previews.map((preview) => (
                  <div key={preview.id} className="overflow-hidden rounded-2xl border border-[#ead8c2] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview.url} alt={preview.name} className="h-40 w-full object-cover" />
                    <p className="truncate px-3 py-2 text-xs text-[#6d5849]">{preview.name}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="privacy" className="mb-2 block text-sm font-semibold text-[#7a331b]">
            Privacy setting
          </label>
          <select
            id="privacy"
            name="privacy"
            defaultValue="public"
            className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
          >
            <option value="public">Public, visible to authenticated members in the community feed</option>
            <option value="private">Private, visible only to you</option>
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Your latest posts stay visible here after save, and public stories now appear in the member feed.
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700">
            <strong>Privacy note:</strong> Your photos are yours. We do not use face recognition on
            user-uploaded content. See our{' '}
            <a href="/privacy" className="font-medium text-[#e34b16] hover:text-[#c74010]">
              Privacy Policy
            </a>{' '}
            for more information.
          </p>
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}
