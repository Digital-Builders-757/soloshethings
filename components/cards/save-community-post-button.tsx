'use client'

import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { toggleSavedCommunityPost } from '@/app/actions/saved-posts'
import { cn } from '@/lib/utils'

type SaveCommunityPostButtonProps = {
  postId: string
  path: string
  initialSaved: boolean
  variant?: 'pill' | 'card'
  className?: string
}

function SaveButtonLabel({ saved, variant }: { saved: boolean; variant: 'pill' | 'card' }) {
  const { pending } = useFormStatus()

  if (pending) {
    return <>{saved ? 'Updating…' : 'Saving…'}</>
  }

  if (variant === 'card') {
    return <>{saved ? 'Saved to your list' : 'Save this story'}</>
  }

  return <>{saved ? 'Saved' : 'Save story'}</>
}

export function SaveCommunityPostButton({
  postId,
  path,
  initialSaved,
  variant = 'pill',
  className,
}: SaveCommunityPostButtonProps) {
  const [state, formAction] = useFormState(toggleSavedCommunityPost, null)
  const [saved, setSaved] = useState(initialSaved)

  useEffect(() => {
    setSaved(initialSaved)
  }, [initialSaved])

  useEffect(() => {
    if (typeof state?.saved === 'boolean') {
      setSaved(state.saved)
    }
  }, [state?.saved])

  return (
    <form action={formAction} className={cn('space-y-2', className)}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="path" value={path} />

      <button
        type="submit"
        aria-pressed={saved}
        className={cn(
          'inline-flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-60',
          variant === 'card'
            ? saved
              ? 'w-full border border-[#e34b16]/30 bg-[#fff3ec] px-5 text-[#7a331b] hover:bg-[#ffe8db]'
              : 'w-full border border-[#d9c4a8] bg-white px-5 text-[#7a331b] hover:border-[#e34b16]/40 hover:text-[#e34b16]'
            : saved
              ? 'border border-[#e34b16]/30 bg-[#fff3ec] px-4 text-[#7a331b] hover:bg-[#ffe8db]'
              : 'border border-[#d9c4a8] bg-white px-4 text-[#7a331b] hover:border-[#e34b16]/40 hover:text-[#e34b16]'
        )}
      >
        <SaveButtonLabel saved={saved} variant={variant} />
      </button>

      {state?.error ? (
        <p className="text-xs leading-5 text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      {variant === 'card' ? (
        <p className="text-xs leading-5 text-[#6d5849]" role={state?.success ? 'status' : undefined}>
          {state?.message ?? (saved ? 'This story stays on your private saved list until you remove it.' : 'Save this story so it is easy to find again from your private list.')}
        </p>
      ) : null}
    </form>
  )
}
