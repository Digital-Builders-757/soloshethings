import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { PatternSection } from "@/components/ui/pattern-section"
import { ArrowRight, Globe, Heart, Sparkles } from "lucide-react"

const launchHighlights = [
  {
    title: "Travel-tested picks",
    body: "Gear and goods chosen with solo journeys, carry-on limits, and real-world comfort in mind.",
  },
  {
    title: "Mission-aligned makers",
    body: "We are prioritizing partners who care about women’s safety, dignity, and joy on the road.",
  },
  {
    title: "Members first",
    body: "Early access and notes for the community that has been here from the beginning.",
  },
]

export default function ShopPage() {
  return (
    <>
      <main className="overflow-hidden">
        {/* Hero — homepage sibling: warm orange editorial + image */}
        <section className="relative border-b border-[#efdac1] bg-white">
          <div className="grid lg:grid-cols-[1.06fr_0.94fr]">
            <div className="relative isolate overflow-hidden bg-[#d85a23] px-6 py-14 sm:px-10 md:px-12 lg:px-14 lg:py-20">
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-90"
                style={{
                  backgroundImage: "url('/images/wavy-pattern.png')",
                  backgroundPosition: "center top",
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "cover",
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-16 top-1/4 h-48 w-48 rounded-full bg-[#f7e8be]/15 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10 mx-auto max-w-xl lg:mx-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fff0d2]">
                  The shop • Opening soon
                </p>
                <h1 className="mt-5 font-serif text-4xl font-bold uppercase leading-[0.95] tracking-[0.03em] text-[#fff4df] sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]">
                  The{" "}
                  <span className="italic font-normal normal-case tracking-normal text-[#fab642]">
                    SHE
                  </span>{" "}
                  shop
                </h1>
                <p className="mt-6 max-w-lg text-base leading-7 text-[#fff6e8] sm:text-lg sm:leading-8">
                  A calmer, kinder place to stock up for the road—curated for women who travel solo and
                  want gear that feels as intentional as the trip itself.
                </p>

                <div className="mt-8 rounded-[2rem] border border-[#efd4b2]/80 bg-[#fff6e8]/12 p-2 backdrop-blur-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                    <input
                      type="email"
                      placeholder="Email for early access"
                      className="min-h-12 flex-1 rounded-[1.35rem] border border-white/20 bg-white/95 px-5 py-3 text-sm text-[#3a3a3a] placeholder:text-[#b28b6f] outline-none transition-shadow focus:ring-2 focus:ring-[#fab642]/50 md:min-h-14 md:text-base"
                      aria-label="Email for shop early access"
                    />
                    <button
                      type="button"
                      className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[1.35rem] bg-[#fab642] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#7a331b] shadow-[0_10px_28px_rgba(122,51,27,0.2)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f5b137] md:min-h-14 md:px-8"
                    >
                      Notify me
                    </button>
                  </div>
                  <p className="mt-3 px-2 text-xs text-[#fff6e8]/75">
                    No spam—just launch notes and first access when the shelves open.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/15 pt-8 sm:gap-6">
                  <div className="text-center">
                    <Sparkles className="mx-auto mb-2 h-6 w-6 text-[#fab642]" strokeWidth={1.75} />
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#fff5df]/90 sm:text-xs">
                      Curated
                    </p>
                  </div>
                  <div className="text-center">
                    <Heart className="mx-auto mb-2 h-6 w-6 text-[#fab642]" strokeWidth={1.75} />
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#fff5df]/90 sm:text-xs">
                      Mission-led
                    </p>
                  </div>
                  <div className="text-center">
                    <Globe className="mx-auto mb-2 h-6 w-6 text-[#fab642]" strokeWidth={1.75} />
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#fff5df]/90 sm:text-xs">
                      Global heart
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[300px] lg:min-h-full">
              <Image
                src="/images/hero-safari.jpg"
                alt="Solo traveler on a boat at sunset, evoking the spirit of adventure"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b14]/50 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute left-5 top-5 rounded-full border border-white/35 bg-white/18 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:text-[0.7rem]">
                Every purchase supports the community
              </div>
              <div className="absolute bottom-5 right-5 max-w-[220px] rounded-[1.25rem] border border-white/25 bg-[#2d1b14]/75 px-4 py-3 text-sm font-medium leading-snug text-[#fff5df] shadow-lg backdrop-blur-md">
                Designed with the same warmth you feel on the homepage—never generic retail.
              </div>
            </div>
          </div>
        </section>

        {/* What’s landing first */}
        <PatternSection tone="cream" patternTop className="py-14 md:py-24">
          <div className="container mx-auto px-6">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#a14b24]">
              While we build
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-center font-serif text-3xl font-bold text-[#7a331b] md:text-4xl">
              A small shop with a loud point of view
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-[#6d5849]">
              We are not racing to fill carts. We are assembling pieces that honor how women actually move
              through the world alone—practical, beautiful, and honest.
            </p>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {launchHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-[#efdac1] bg-[#fffaf0] p-6 shadow-[0_20px_50px_rgba(122,51,27,0.08)] md:p-8"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5f4a3b] md:text-base">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </PatternSection>

        {/* Editorial CTA band */}
        <section className="relative overflow-hidden bg-[#7a331b] py-14 text-[#fff5df] md:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "url('/images/wavy-pattern.png')",
              backgroundSize: "420px",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
              Stay close while the shelves come together
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#fff5df]/85 md:text-lg">
              Read the journal, explore stories, and keep traveling—the shop will meet you when it is ready.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#fab642] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#7a331b] shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5 sm:w-auto md:px-10 md:py-4"
              >
                Our mission
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#f7e8be]/50 bg-transparent px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#fff5df] transition-colors hover:border-[#f7e8be] hover:bg-white/10 sm:w-auto md:px-10 md:py-4"
              >
                Travel + SHE Things
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
