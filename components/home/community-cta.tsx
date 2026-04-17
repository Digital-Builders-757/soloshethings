import Image from "next/image"
import Link from "next/link"

const communityPillars = [
  "Practical safety notes from women who have actually been there",
  "Story-driven inspiration that feels personal, not generic",
  "A softer kind of travel confidence built through shared experience",
]

const communityImages = [
  {
    src: "/images/about-mission.jpg",
    alt: "Women laughing together on a mountain overlook",
    className: "lg:col-span-5 lg:row-span-2",
  },
  {
    src: "/client-travel/desert-camel-caravan.JPG",
    alt: "A solo traveler on a camel ride in the desert",
    className: "lg:col-span-3 lg:row-span-1",
  },
  {
    src: "/client-travel/paris-eiffel-tower.JPG",
    alt: "A woman traveler in Paris near the Eiffel Tower",
    className: "lg:col-span-3 lg:row-span-1",
  },
]

export function CommunityCTA() {
  return (
    <section className="relative overflow-hidden bg-[#e34b16] py-16 md:py-24">
      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#f7e8be]/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#fab642]/20 blur-3xl" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f7e8be]/75">
              A community built for solo SHEs
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#fff5df] md:text-5xl">
              Supportive, stylish, and rooted in real women doing brave things.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/88 md:text-lg">
              Solo SHE Things is more than a blog. It is a place to swap stories, gather courage, and move through the world with more clarity and less second-guessing.
            </p>

            <div className="mt-8 space-y-3">
              {communityPillars.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-[1.5rem] border border-white/16 bg-white/10 px-5 py-4 text-sm leading-6 text-[#fff5df] backdrop-blur-sm"
                >
                  {pillar}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#fab642] px-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#7a331b] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f5b137]"
              >
                Create Your Free Profile
              </Link>
              <Link
                href="/collections"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/60 px-8 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#e34b16]"
              >
                Discover Solo Stories
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-8 lg:grid-rows-2">
            {communityImages.map((image) => (
              <div
                key={image.src}
                className={`relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_24px_50px_rgba(74,28,14,0.22)] ${image.className}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ))}

            <div className="rounded-[2rem] border border-white/18 bg-[#7a331b]/85 p-6 text-[#fff5df] shadow-[0_20px_40px_rgba(74,28,14,0.18)] lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#fab642]">
                Why it matters
              </p>
              <p className="mt-3 text-lg leading-7">
                The right travel story does more than inspire. It helps another woman trust herself enough to book the trip.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
