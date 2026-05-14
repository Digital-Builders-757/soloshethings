import Link from "next/link"

const newsletterBenefits = [
  "New editorial stories and destination notes",
  "Safety-minded travel reflections and rituals",
  "A warm nudge to keep planning your next brave thing",
]

export function NewsletterSection() {
  return (
    <section className="bg-[#f7e8be] py-16 md:py-24">
      <div className="container mx-auto shell-inline">
        <div className="editorial-card-strong overflow-hidden rounded-[2.5rem]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[#7a331b] px-8 py-10 text-[#fff5df] md:px-10 md:py-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fab642]">
                Stay in the loop
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
                Quietly inspiring notes for your next chapter of travel.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#fff5df]/82">
                Get stories, destination inspiration, and confidence-building reflections as Solo SHE Things grows.
              </p>

              <div className="mt-8 space-y-3">
                {newsletterBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-[1.25rem] bg-white/8 px-4 py-3 text-sm leading-6">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#fab642]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fffaf0] px-8 py-10 md:px-10 md:py-12">
              <div className="mx-auto max-w-xl">
                <p className="eyebrow text-sm tracking-[0.2em]">
                  Current access
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] md:text-4xl">
                  The honest version: account signup is live, standalone newsletter delivery is next.
                </h3>
                <p className="mt-4 text-base leading-7 text-[#6d5849]">
                  Right now, the cleanest way to stay close is to create your profile. That gets you into the member flow today while the dedicated newsletter pipeline is being finalized.
                </p>

                <div className="editorial-card mt-8 rounded-[2rem] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a14b24]">
                    What you can do now
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href="/signup"
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#e34b16] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#c74010]"
                    >
                      Create your profile
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#7a331b] transition hover:border-[#e34b16]/45 hover:text-[#e34b16]"
                    >
                      Contact the team
                    </Link>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#6d5849]">
                  This section will switch to direct inbox delivery once the full newsletter system is live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
