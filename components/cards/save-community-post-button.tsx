'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { toggleSavedCommunityPost } from '@/app/actions/saved-posts'
import { cn } from '@/lib/utils'

type SaveCommunityPostButtonProps = {
  postId: string
  path: string
  initialSaved: boolean
  variant?: 'pill' | 'card'
  /** Copy + emphasis tuned for /saved (remove = cleanup). */
  savedListContext?: boolean
  className?: string
}

function SaveButtonLabel({
  saved,
  variant,
  savedListContext,
}: {
  saved: boolean
  variant: 'pill' | 'card'
  savedListContext?: boolean
}) {
  const { pending } = useFormStatus()

  if (pending) {
    if (savedListContext && variant === 'card') {
      return <>{saved ? 'Removing…' : 'Saving…'}</>
    }
    return <>{saved ? 'Updating…' : 'Saving…'}</>
  }

  if (variant === 'card') {
    if (savedListContext) {
      return <>{saved ? 'Remove from library' : 'Save to library again'}</>
    }
    return <>{saved ? 'Saved to your list' : 'Save this story'}</>
  }

  return <>{saved ? 'Saved' : 'Save story'}</>
}

export function SaveCommunityPostButton({
  postId,
  path,
  initialSaved,
  variant = 'pill',
  savedListContext = false,
  className,
}: SaveCommunityPostButtonProps) {
  const [state, formAction] = useActionState(toggleSavedCommunityPost, null)
  const saved =
    typeof state?.saved === 'boolean' ? state.saved : initialSaved

  return (
    <form action={formAction} className={cn('space-y-2', className)}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="path" value={path} />

      <button
        type="submit"
        aria-pressed={saved}
        className={cn(
          'inline-flex items-center justify-center rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-60',
          variant === 'card' ? 'min-h-12 w-full px-5 sm:min-h-11' : 'min-h-11 px-4',
          variant === 'card'
            ? saved
              ? savedListContext
                ? 'community-save-card-saved-library'
                : 'community-save-card-saved'
              : 'community-save-card-idle'
            : saved
              ? 'border border-brand-orange/30 bg-brand-orange/10 text-brand-pinkDark hover:bg-brand-orange/15'
              : 'border border-brand-pinkDark/20 bg-white text-brand-pinkDark hover:border-brand-orange/40 hover:text-brand-orange'
        )}
      >
        <SaveButtonLabel saved={saved} variant={variant} savedListContext={savedListContext} />
      </button>

      {state?.error ? (
        <p className="text-xs leading-5 text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}

      {variant === 'card' ? (
        <p className="text-xs leading-5 text-brand-blue/85" role={state?.success ? 'status' : undefined}>
          {state?.message ??
            (savedListContext
              ? saved
                ? 'Only you see this list — removing sends the card back to the feed without deleting the story.'
                : 'Add this story back to your private shelf anytime.'
              : saved
                ? 'This story stays on your private saved list until you remove it.'
                : 'Save this story so it is easy to find again from your private list.')}
        </p>
      ) : null}
    </form>
  )
}
