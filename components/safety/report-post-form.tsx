'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useState } from 'react'

import { createPostReport } from '@/app/actions/reports'

type ReportPostFormProps = {
  postId: string
  path: string
  postTitle: string
}

function ReportSubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a331b] px-5 text-sm font-semibold text-white transition hover:bg-[#5f2715] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? 'Sending report…' : 'Send report'}
    </button>
  )
}

export function ReportPostForm({ postId, path, postTitle }: ReportPostFormProps) {
  const [state, formAction] = useFormState(createPostReport, null)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-[1.75rem] border border-[#ead8c2] bg-[#fffaf4] p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Safety</p>
          <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">Report this story</h2>
          <p className="mt-2 text-sm leading-6 text-[#6d5849]">
            If <span className="font-medium text-[#7a331b]">{postTitle}</span> feels unsafe, misleading, or inappropriate,
            you can send a private report for review.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#d9c4a8] bg-white px-4 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
          aria-expanded={isOpen}
        >
          {isOpen ? 'Close form' : 'Open report form'}
        </button>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Reports go to moderation. They do not instantly remove a post, and the other member does not see your notes.
      </p>

      {state?.success ? (
        <div className="mt-4 rounded-2xl border border-green-200/80 bg-green-50/90 p-4 text-sm text-green-800" role="status">
          {state.message}
        </div>
      ) : null}

      {state?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/90 p-4 text-sm text-red-800" role="alert">
          {state.error}
        </div>
      ) : null}

      {isOpen && !state?.success ? (
        <form action={formAction} className="mt-5 space-y-4 border-t border-[#ead8c2] pt-5">
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="path" value={path} />

          <div>
            <label htmlFor="reason" className="mb-2 block text-sm font-semibold text-[#7a331b]">
              Reason
            </label>
            <select
              id="reason"
              name="reason"
              defaultValue="inappropriate"
              className="editorial-input warm-focus-ring min-w-0 px-4 py-3"
            >
              <option value="spam">Spam or scammy promotion</option>
              <option value="harassment">Harassment or bullying</option>
              <option value="inappropriate">Unsafe, explicit, or inappropriate content</option>
              <option value="copyright">Copyright issue</option>
              <option value="other">Something else</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-[#7a331b]">
              Extra context (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={1000}
              className="editorial-input warm-focus-ring min-w-0 resize-y px-4 py-3"
              placeholder="A short note helps moderation review faster, especially if the concern is context-specific."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ReportSubmitButton />
            <p className="text-xs text-muted-foreground">Only one open report per story per account.</p>
          </div>
        </form>
      ) : null}
    </div>
  )
}
