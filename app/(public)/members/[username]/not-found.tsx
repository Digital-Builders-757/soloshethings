import Link from 'next/link'

export default function MemberProfileNotFound() {
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
          <span className="font-medium text-[#7a331b]/55">Profile unavailable</span>
        </nav>

        <header className="mb-7 sm:mb-9">
          <p className="eyebrow text-[0.65rem] tracking-[0.26em]">Member profile</p>
          <h1 className="display-headline mt-3 text-[1.85rem] text-[#713522] sm:text-[2.25rem] lg:text-[2.6rem]">
            Profile unavailable
          </h1>
        </header>

        <div className="editorial-rule mb-6 sm:mb-7" />

        <section className="rounded-2xl border border-[#c8a882]/22 bg-gradient-to-b from-[#fffdf8] to-[#f7efe0]/95 p-6 sm:p-8">
          <p className="max-w-md text-sm leading-relaxed text-[#7a331b]/62">
            This member profile is not available. It may not exist, or it may not be visible to
            you right now.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/" className="text-sm font-medium text-[#e34b16] transition hover:text-[#c74010]">
              Back to home
            </Link>
            <Link
              href="/places"
              className="text-sm font-medium text-[#e34b16] transition hover:text-[#c74010]"
            >
              Browse stories
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
