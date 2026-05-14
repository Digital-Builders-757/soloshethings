'use client'

import { archiveCommunityPost, permanentlyRemoveCommunityPost, updateCommunityPost } from '@/app/actions/community-posts'
import { CommunityDiscoveryFields } from '@/components/community/community-discovery-fields'
import { RestoreCommunityPostButton } from '@/components/submit/restore-community-post-button'
import { PERMANENT_REMOVE_CONFIRM_PHRASE } from '@/lib/community-owner-lifecycle'
import { appendQueryParam } from '@/lib/community-navigation'
import { useRouter } from 'next/navigation'
import type { post_status } from '@/types/database'
import { useEffect, useMemo, useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'

type OwnerCommunityPostManagerProps = {
  postId: string
  path: string
  title: string
  content: string
  isPublic: boolean
  postStatus: post_status
  placeLabel?: string | null
  storyTopics?: readonly string[] | null
  submitReturnTo?: string | null
}

function SaveChangesButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-full bg-[#e34b16] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(227,75,22,0.3)] transition hover:bg-[#c74010] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Saving changes…' : 'Save changes'}
    </button>
  )
}

function ArchiveButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-full border border-[#d9c4a8] px-5 py-3 text-sm font-semibold text-[#7a331b] transition hover:border-[#cfa882] hover:text-[#e34b16] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Archiving…' : 'Archive story'}
    </button>
  )
}

function PermanentRemoveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-900 transition hover:bg-red-100 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Removing…' : 'Permanently remove story'}
    </button>
  )
}

export function OwnerCommunityPostManager({
  postId,
  path,
  title,
  content,
  isPublic,
  postStatus,
  placeLabel,
  storyTopics,
  submitReturnTo,
}: OwnerCommunityPostManagerProps) {
  const router = useRouter()
  const [updateState, updateAction] = useActionState(updateCommunityPost, null)
  const [archiveState, archiveAction] = useActionState(archiveCommunityPost, null)
  const [removeState, removeAction] = useActionState(permanentlyRemoveCommunityPost, null)

  const [draftTitle, setDraftTitle] = useState(title)
  const [draftContent, setDraftContent] = useState(content)
  const [draftIsPublic, setDraftIsPublic] = useState(isPublic)

  const isArchived = postStatus === 'archived'
  const isPublished = postStatus === 'published'
  const canLifecycleRemove = isPublished || isArchived

  useEffect(() => {
    if (updateState?.success) {
      router.refresh()
    }
  }, [router, updateState?.success])

  const archiveRedirectPath = useMemo(() => {
    return submitReturnTo ? appendQueryParam(submitReturnTo, 'storyArchived', '1') : '/submit?storyArchived=1'
  }, [submitReturnTo])

  const removeRedirectPath = useMemo(() => {
    return submitReturnTo ? appendQueryParam(submitReturnTo, 'storyRemoved', '1') : '/submit?storyRemoved=1'
  }, [submitReturnTo])

  useEffect(() => {
    if (archiveState?.archived) {
      router.push(archiveRedirectPath)
      router.refresh()
    }
  }, [archiveRedirectPath, archiveState?.archived, router])

  useEffect(() => {
    if (removeState?.removed) {
      router.push(removeRedirectPath)
      router.refresh()
    }
  }, [removeRedirectPath, removeState?.removed, router])

  const helperText = useMemo(() => {
    if (draftIsPublic) {
      return 'Public stories stay visible to signed-in members in the community feed.'
    }

    return 'Private stories stay visible only to you.'
  }, [draftIsPublic])

  if (postStatus === 'removed') {
    return (
      <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
        <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Story removed</p>
        <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">This story stays off member surfaces</h2>
        <p className="mt-3 text-sm leading-6 text-[#6d5849]">
          Permanent removal stays tied to your account for history purposes, but the story itself no longer behaves like archive + restore flow.
          Contact support only if something looks wrong—it cannot be restored from this page.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
      <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Manage your story</p>
      <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">Edit title, story text, or visibility</h2>
      <p className="mt-3 text-sm leading-6 text-[#6d5849]">
        {isArchived ? (
          <>
            This archive is intact for you and can be restored to member surfaces anytime. Updating copy here still saves so you can clean up drafts
            while the story stays off feeds.
          </>
        ) : (
          <>
            This owner-controls pass updates your saved story details, lets you archive when you want a reversible pause, or permanently removes the
            story when you deliberately type the confirmation phrase shown below.
          </>
        )}
      </p>

      {updateState?.message ? (
        <div className="mt-4 rounded-2xl border border-green-200/80 bg-green-50/90 p-3 text-sm text-green-800" role="status">
          {updateState.message}
        </div>
      ) : null}

      {updateState?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 p-3 text-sm text-red-800" role="alert">
          {updateState.error}
        </div>
      ) : null}

      {archiveState?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 p-3 text-sm text-red-800" role="alert">
          {archiveState.error}
        </div>
      ) : null}

      {removeState?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 p-3 text-sm text-red-800" role="alert">
          {removeState.error}
        </div>
      ) : null}

      <form action={updateAction} className="mt-5 space-y-4">
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="path" value={path} />

        <div>
          <label htmlFor="owner-title" className="mb-2 block text-sm font-semibold text-[#7a331b]">
            Title
          </label>
          <input
            id="owner-title"
            name="title"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            maxLength={200}
            className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
            required
          />
        </div>

        <div>
          <label htmlFor="owner-content" className="mb-2 block text-sm font-semibold text-[#7a331b]">
            Story
          </label>
          <textarea
            id="owner-content"
            name="content"
            rows={6}
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
            maxLength={5000}
            className="editorial-input warm-focus-ring min-w-0 resize-y px-4 py-3"
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">{draftContent.length} / 5000 characters</p>
        </div>

        <CommunityDiscoveryFields idPrefix="owner" defaultPlaceLabel={placeLabel ?? ''} defaultTopicSlugs={storyTopics ?? []} />

        <div>
          <label htmlFor="owner-privacy" className="mb-2 block text-sm font-semibold text-[#7a331b]">
            Visibility
          </label>
          <select
            id="owner-privacy"
            name="privacy"
            value={draftIsPublic ? 'public' : 'private'}
            onChange={(event) => setDraftIsPublic(event.target.value === 'public')}
            className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
          >
            <option value="public">Public, visible to authenticated members in the community feed</option>
            <option value="private">Private, visible only to you</option>
          </select>
          <p className="mt-1 text-xs text-muted-foreground">{helperText}</p>
        </div>

        <SaveChangesButton />
      </form>

      {isArchived ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4">
          <p className="text-sm font-semibold text-[#7a331b]">Restore this archived story?</p>
          <p className="mt-2 text-sm leading-6 text-[#6d5849]">
            Restoring publishes the story again (subject to visibility and membership gates) so feeds, saves, and owner controls reopen.
          </p>
          <div className="mt-4">
            <RestoreCommunityPostButton postId={postId} path={submitReturnTo ?? path} />
          </div>
        </div>
      ) : (
        <form action={archiveAction} className="mt-6 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4">
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="path" value={path} />
          <p className="text-sm font-semibold text-[#7a331b]">Need a reversible pause?</p>
          <p className="mt-2 text-sm leading-6 text-[#6d5849]">
            Archiving removes the story from feed, detail, and saved surfaces without pretending it is deleted forever. You can restore it from your
            submission history on /submit.
          </p>
          <div className="mt-4">
            <ArchiveButton />
          </div>
        </form>
      )}

      {canLifecycleRemove ? (
        <form action={removeAction} className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/40 p-4">
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="path" value={path} />
          <p className="text-sm font-semibold text-red-900">Permanent removal (no self-serve restore)</p>
          <p className="mt-2 text-sm leading-6 text-[#6d5849]">
            This keeps the ownership record for auditing and your submission timeline, but the story disappears from authenticated community feeds and
            no longer restores like an archive. Stripe-gated workflows still apply.
          </p>
          <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]" htmlFor="confirm-removal">
            Type {PERMANENT_REMOVE_CONFIRM_PHRASE}
          </label>
          <input
            id="confirm-removal"
            name="confirmPhrase"
            type="text"
            autoComplete="off"
            className="editorial-input warm-focus-ring mt-2 w-full px-4 py-3 text-sm"
            placeholder={PERMANENT_REMOVE_CONFIRM_PHRASE}
          />
          <div className="mt-4">
            <PermanentRemoveButton />
          </div>
        </form>
      ) : null}
    </div>
  )
}
