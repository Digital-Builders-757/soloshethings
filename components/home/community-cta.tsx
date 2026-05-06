import Image from "next/image"
import Link from "next/link"

const communityPillars = [
  "Practical safety notes from women who have actually been there",
  "Story-driven inspiration that feels personal, not generic",
  "A softer kind of travel confidence built through shared experience",
]

/** Single editorial image — avoids mosaic grid fragments on the right */
const COMMUNITY_IMAGE = {
  src: "/images/about-mission.jpg",
  alt: "Women laughing together on a mountain overlook",
} as const

export function CommunityCTA() {
  return (
    <section className="relative overflow-hidden bg-[#e34b16] py-16 md:py-24">
      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#f7e8be]/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#fab642]/20 blur-3xl" aria-hidden="true" />

      <div className="container relative z-10 mx-auto shell-inline">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-16">
          {/* Left: copy + pillars + CTAs */}
          <div className="max-w-xl lg:max-w-none lg:pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7e8be]">
              A community built for solo SHEs
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#fff5df] md:text-5xl">
              Supportive, stylish, and rooted in real women doing brave things.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#fff8f0] md:text-lg md:leading-8">
              Solo SHE Things is more than a blog. It is a place to swap stories, gather courage, and move
              through the world with more clarity and less second-guessing.
            </p>

            <div className="mt-8 space-y-3">
              {communityPillars.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-[1.5rem] border border-white/20 bg-white/10 px-5 py-3.5 text-sm leading-6 text-[#fff5df] backdrop-blur-sm md:py-4"
                >
                  {pillar}
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/signup"
                className="inline-flex h-14 shrink-0 items-center justify-center rounded-full bg-[#fab642] px-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#7a331b] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f5b137]"
              >
                Create Your Free Profile
              </Link>
              <Link
                href="/collections"
                className="inline-flex h-14 shrink-0 items-center justify-center rounded-full border border-white/70 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#e34b16]"
              >
                Discover Solo Stories
              </Link>
            </div>
          </div>

          {/* Right: full-width of column — stacked image + card (no narrow cap on desktop) */}
          <div className="mx-auto flex w-full max-w-md flex-col gap-5 lg:mx-0 lg:max-w-none">
            <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/20 bg-[#7a331b]/40 shadow-[0_28px_60px_rgba(74,28,14,0.35)] sm:aspect-[3/4] lg:aspect-[5/6]">
              <Image
                src={COMMUNITY_IMAGE.src}
                alt={COMMUNITY_IMAGE.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </figure>

            <aside className="rounded-[2rem] border border-white/25 bg-[#7a331b]/90 p-6 text-[#fff5df] shadow-[0_20px_45px_rgba(74,28,14,0.25)] md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fab642]">
                Why it matters
              </p>
              <p className="mt-3 font-serif text-lg leading-7 md:text-xl md:leading-8">
                The right travel story does more than inspire. It helps another woman trust herself enough to
                book the trip.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
