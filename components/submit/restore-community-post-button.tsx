'use client'

import { restoreCommunityPost } from '@/app/actions/community-posts'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

type RestoreCommunityPostButtonProps = {
  postId: string
  path: string
}

function RestoreButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-pinkDark px-5 text-sm font-semibold text-white transition hover:bg-brand-pinkDark/90 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Restoring…' : 'Restore story'}
    </button>
  )
}

export function RestoreCommunityPostButton({ postId, path }: RestoreCommunityPostButtonProps) {
  const router = useRouter()
  const [state, action] = useActionState(restoreCommunityPost, null)

  useEffect(() => {
    if (state?.success) {
      const separator = path.includes('?') ? '&' : '?'
      router.push(`${path}${separator}storyRestored=1`)
      router.refresh()
    }
  }, [path, router, state?.success])

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="path" value={path} />

      {state?.error ? (
        <div className="rounded-2xl border border-red-200/80 bg-red-50/90 p-3 text-sm text-red-800" role="alert">
          {state.error}
        </div>
      ) : null}

      <RestoreButton />
    </form>
  )
}
