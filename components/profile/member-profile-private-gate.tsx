import { MemberProfilePageShell } from '@/components/profile/member-profile-page-shell'
import Link from 'next/link'

interface MemberProfilePrivateGateProps {
  username: string
}

export function MemberProfilePrivateGate({ username }: MemberProfilePrivateGateProps) {
  return (
    <MemberProfilePageShell username={username}>
      <header className="mb-7 sm:mb-9">
        <p className="eyebrow text-[0.65rem] tracking-[0.26em]">Member profile</p>
        <h1 className="display-headline mt-3 text-[1.85rem] text-[#713522] sm:text-[2.25rem] lg:text-[2.6rem]">
          @{username}
        </h1>
      </header>

      <div className="editorial-rule mb-6 sm:mb-7" />

      <section className="rounded-2xl border border-[#c8a882]/22 bg-gradient-to-b from-[#fffdf8] to-[#f7efe0]/95 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[#713522]">A quiet footprint</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#7a331b]/62">
          This member keeps a private presence — name and portrait only, shared with those they
          interact with.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-[#e34b16] transition hover:text-[#c74010]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </MemberProfilePageShell>
  )
}
