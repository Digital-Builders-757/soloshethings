import Link from 'next/link'
import type { ReactNode } from 'react'

interface MemberProfilePageShellProps {
  username: string
  children: ReactNode
}

export function MemberProfilePageShell({ username, children }: MemberProfilePageShellProps) {
  return (
    <div className="profile-page-stage shell-inline shell-pb-safe pb-20 pt-8 sm:pb-28 sm:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-6%] top-[18rem] h-[32rem] w-[32rem] rounded-full bg-[#fab642]/[0.058] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-4%] top-[34rem] h-[26rem] w-[26rem] rounded-full bg-[#e34b16]/[0.038] blur-3xl"
      />

      <div className="profile-page-inner mx-auto min-w-0 max-w-3xl overflow-x-clip">
        <nav aria-label="Breadcrumb" className="mb-9 flex items-center gap-2 text-xs sm:mb-11">
          <Link
            href="/"
            className="font-semibold text-[#e34b16] transition hover:text-[#c74010]"
          >
            Home
          </Link>
          <span className="text-[#c8a882]/65" aria-hidden>
            /
          </span>
          <span className="font-medium text-[#7a331b]/55">Members</span>
          <span className="text-[#c8a882]/65" aria-hidden>
            /
          </span>
          <span className="font-medium text-[#7a331b]/55">@{username}</span>
        </nav>

        {children}
      </div>
    </div>
  )
}
