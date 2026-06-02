import { MemberProfilePageShell } from '@/components/profile/member-profile-page-shell'
import Link from 'next/link'

interface MemberProfileAuthGateProps {
  username: string
}

export function MemberProfileAuthGate({ username }: MemberProfileAuthGateProps) {
  const loginHref = `/login?redirectTo=${encodeURIComponent(`/members/${username}`)}`

  return (
    <MemberProfilePageShell username={username}>
      <header className="mb-7 sm:mb-9">
        <p className="eyebrow text-[0.65rem] tracking-[0.26em]">Member profile</p>
        <h1 className="display-headline mt-3 text-[1.85rem] text-[#713522] sm:text-[2.25rem] lg:text-[2.6rem]">
          @{username}
        </h1>
      </header>

      <div className="editorial-rule mb-6 sm:mb-7" />

      <section className="rounded-2xl border border-[#fab642]/15 bg-gradient-to-b from-[#f7e8be]/20 to-[#fffdf8]/52 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[#713522]">Sign in to view this profile</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#7a331b]/62">
          This member shares their presence with signed-in community members. Sign in to continue.
        </p>
        <div className="mt-6">
          <Link href={loginHref} className="cta-primary inline-flex min-h-11 items-center px-6 py-2.5 text-sm">
            Sign in
          </Link>
        </div>
      </section>
    </MemberProfilePageShell>
  )
}
