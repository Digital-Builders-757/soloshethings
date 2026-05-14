'use client'

import { withdrawPendingPostReport } from '@/app/actions/reports'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

function WithdrawButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#cfa882] bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a331b] transition hover:border-[#e34b16]/50 hover:text-[#e34b16] disabled:opacity-50"
    >
      {pending ? 'Withdrawing…' : 'Withdraw report'}
    </button>
  )
}

export function PendingReportWithdrawal({ reportId, returnPath }: { reportId: string; returnPath: string }) {
  const router = useRouter()
  const [state, action] = useActionState(withdrawPendingPostReport, null)

  useEffect(() => {
    if (state?.success) {
      router.refresh()
    }
  }, [router, state?.success])

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4">
      {state?.error ? (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : state?.success ? (
        <p className="text-sm text-green-800" role="status">
          This report was withdrawn. You can submit a fresh report later if needed.
        </p>
      ) : (
        <>
          <p className="text-sm leading-6 text-[#6d5849]">
            Sent this by mistake before moderators acted? Withdrawing clears your open pending report for this story. This action is logged
            and only works while status is pending.
          </p>
          <form action={action} className="mt-4">
            <input type="hidden" name="reportId" value={reportId} />
            <input type="hidden" name="path" value={returnPath} />
            <WithdrawButton />
          </form>
        </>
      )}
    </div>
  )
}
