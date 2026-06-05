'use client'

import Link from 'next/link'

import { createCommunityPost } from '@/app/actions/community-posts'
import { CommunityDiscoveryFields } from '@/components/community/community-discovery-fields'
import { buildStoryDetailHref } from '@/lib/community-navigation'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import type { ChangeEvent, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

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
      className="cta-primary min-h-12 w-full px-8 py-3 text-sm disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Saving your post…' : 'Publish my post'}
    </button>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="profile-form-section-label mb-3 text-[0.62rem]">{children}</p>
}

export function SubmitForm({ recentPostCount }: SubmitFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const previewsRef = useRef<LocalImagePreview[]>([])
  const [state, formAction] = useActionState(createCommunityPost, null)
  const [contentLength, setContentLength] = useState(0)
  const [previews, setPreviews] = useState<LocalImagePreview[]>([])

  const uploadSummary = useMemo(() => {
    if (previews.length === 0) return 'No photos selected yet.'
    if (previews.length === 1) return '1 photo queued for upload.'
    return `${previews.length} photos queued for upload.`
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
    <div id="submit-compose" className="editorial-card-strong overflow-hidden shadow-[0_20px_52px_rgba(122,51,27,0.09)]">
      <div className="border-b border-brand-pinkDark/10 bg-gradient-to-br from-brand-cream/45 via-white to-white px-6 py-6 sm:px-8 sm:py-7">
        <p className="eyebrow text-[0.62rem] tracking-[0.2em]">Compose</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-brand-pinkDark sm:text-3xl">Draft a new spot or story</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-blue/85 sm:text-base">
          Title, narrative, optional photos, place label, and tags save together when you publish. Your privacy choice applies
          immediately — you can edit or archive later from the story detail page.
        </p>
      </div>

      <div className="space-y-8 px-6 py-8 sm:space-y-10 sm:px-8 sm:py-10">
        {state?.success ? (
          <div
            className="rounded-[1.25rem] border border-emerald-300/70 bg-emerald-50/95 p-4 text-sm text-emerald-950 sm:p-5"
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold text-emerald-950">Post saved</p>
            <p className="mt-2 leading-relaxed">
              {state.uploadedCount ?? 0} image{state.uploadedCount === 1 ? '' : 's'} uploaded.
              {recentPostCount === 0 ? ' Your first submission is on file.' : ' It appears in your shelf on the right.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {state.postId ? (
                <Link
                  href={buildStoryDetailHref(state.postId, '/submit')}
                  className="cta-primary inline-flex min-h-10 items-center justify-center px-5 text-sm"
                >
                  Open story workspace
                </Link>
              ) : null}
              <Link href="/places" className="cta-secondary inline-flex min-h-10 items-center justify-center px-5 text-sm">
                View community feed
              </Link>
            </div>
          </div>
        ) : null}

        {state?.error ? (
          <div
            className="rounded-[1.25rem] border border-red-200/90 bg-red-50/95 p-4 text-sm text-red-900 sm:p-5"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-semibold">We could not publish this story</p>
            <p className="mt-2 leading-relaxed">{state.error}</p>
            <p className="mt-3 text-xs leading-relaxed text-red-900/85">
              Check required fields, photo limits (5 files, 5MB each), and try again. Nothing uploads until validation passes.
            </p>
          </div>
        ) : null}

        <form ref={formRef} action={formAction} className="space-y-10">
          <section className="space-y-4">
            <SectionLabel>Story</SectionLabel>
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
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
              <label htmlFor="content" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
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
              <p className="mt-1.5 text-xs text-brand-blue/70">{contentLength} / 5000 characters</p>
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Place & angles</SectionLabel>
            <CommunityDiscoveryFields idPrefix="submit" />
          </section>

          <section className="space-y-4">
            <SectionLabel>Photos (optional)</SectionLabel>
            <div
              className={cn(
                'rounded-[1.35rem] border-2 border-dashed border-brand-orange/28 bg-gradient-to-b from-brand-cream/35 via-white to-white px-4 py-6 sm:px-6 sm:py-7',
                previews.length > 0 && 'border-brand-orange/40'
              )}
            >
              <p className="text-sm font-semibold text-brand-pinkDark">Bring the scene to life</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-blue/80">
                JPG, PNG, or WebP · up to 5 files · 5MB each · validated server-side before storage
              </p>

              <input
                id="images"
                name="images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
                className={cn(
                  'warm-focus-ring mt-4 block w-full cursor-pointer rounded-xl border border-brand-pinkDark/14 bg-white px-4 py-3 text-sm text-brand-blue',
                  'file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-brand-cream file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-pinkDark',
                  'hover:file:bg-brand-gold/35'
                )}
              />

              <p className="mt-3 text-sm font-medium text-brand-pinkDark">{uploadSummary}</p>
              <div className="community-context-banner mt-3 px-4 py-3 text-sm leading-relaxed text-brand-blue/85">
                <p>
                  When you publish, photos upload server-side after validation.{' '}
                  <span className="font-semibold text-brand-pinkDark">Public</span> stories can appear in the member feed;{' '}
                  <span className="font-semibold text-brand-pinkDark">private</span> stories keep images visible only to you.
                  We do not use face recognition on member uploads.
                </p>
              </div>

              {previews.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {previews.map((preview) => (
                    <figure
                      key={preview.id}
                      className="story-detail-photo-frame overflow-hidden rounded-xl border border-brand-gold/25 bg-white shadow-[0_10px_28px_rgba(122,51,27,0.07)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview.url} alt={preview.name} className="aspect-[4/3] w-full object-cover" />
                      <figcaption className="truncate px-3 py-2 text-xs font-medium text-brand-blue/85">{preview.name}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Who can see this</SectionLabel>
            <div>
              <label htmlFor="privacy" className="mb-2 block text-sm font-semibold text-brand-pinkDark">
                Privacy setting
              </label>
              <select id="privacy" name="privacy" defaultValue="public" className="editorial-input warm-focus-ring min-w-0 px-4 py-3">
                <option value="public">Public — visible to authenticated members in the community feed</option>
                <option value="private">Private — visible only to you</option>
              </select>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-brand-blue/80">
                <li>
                  <span className="font-semibold text-brand-pinkDark">Public:</span> Signed-in members can browse your story in the feed,
                  open the detail page, save it, and report it if something feels unsafe.
                </li>
                <li>
                  <span className="font-semibold text-brand-pinkDark">Private:</span> Only you see it in your shelf and detail view — it
                  stays out of the community feed and other members cannot open it.
                </li>
              </ul>
            </div>

            <div className="rounded-[1.15rem] border border-brand-pinkDark/12 bg-brand-cream/30 px-4 py-3 sm:px-5 sm:py-4">
              <p className="text-sm leading-relaxed text-brand-blue/90">
                <span className="font-semibold text-brand-pinkDark">Moderation note:</span> Public stories can be reported by members.
                Moderators review reports separately — you are not notified in real time, but you can track your own report history from
                the workspace nav.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-blue/90">
                <span className="font-semibold text-brand-pinkDark">Privacy note:</span> Your photos stay yours. Read our{' '}
                <a href="/privacy" className="font-semibold text-brand-orange underline-offset-2 hover:text-brand-coral hover:underline">
                  Privacy Policy
                </a>{' '}
                for how we handle uploads.
              </p>
            </div>
          </section>

          <div className="border-t border-brand-pinkDark/10 pt-8">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  )
}
