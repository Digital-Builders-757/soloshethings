import Image from "next/image"
import Link from "next/link"
import { PatternSection } from "@/components/ui/pattern-section"

export function AboutPreview() {
  return (
    <PatternSection tone="white" patternTop className="py-16 md:py-24">
      <div className="container mx-auto px-6 pt-10 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#efdac1] bg-[#f2dfc3] shadow-[0_30px_70px_rgba(122,51,27,0.1)]">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/about-hero.jpg"
                alt="Founder of Solo SHE Things sitting in a cafe while journaling"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div className="border-t border-[#efdac1] bg-[#fffaf0] px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a14b24]">
                Founder note
              </p>
              <p className="mt-2 text-base leading-7 text-[#6d5849]">
                Born from the belief that solo travel can be expansive, beautiful, and deeply grounding for women.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a14b24]">
              Our story
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#7a331b] md:text-5xl">
              We are building the kind of travel space many women wish existed before their first trip.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5f4a3b] md:text-lg">
              Solo SHE Things started with one clear instinct: women deserve a more intimate, stylish, and trustworthy kind of travel platform. One that celebrates independence without pretending the fears are not real.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5f4a3b] md:text-lg">
              Our journal blends practical insight with emotional honesty, so every story leaves you feeling a little more resourced and a little more ready.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[#efdac1] bg-[#fffaf0] p-6 shadow-[0_20px_50px_rgba(122,51,27,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                What you will find here
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-[#f7e8be]/70 px-4 py-4 text-sm leading-6 text-[#6d5849]">
                  Thoughtful destination stories and cultural notes
                </div>
                <div className="rounded-[1.5rem] bg-[#f7e8be]/70 px-4 py-4 text-sm leading-6 text-[#6d5849]">
                  Grounded safety reflections without fear-mongering
                </div>
                <div className="rounded-[1.5rem] bg-[#f7e8be]/70 px-4 py-4 text-sm leading-6 text-[#6d5849]">
                  Encouragement for the women becoming braver in public
                </div>
                <div className="rounded-[1.5rem] bg-[#f7e8be]/70 px-4 py-4 text-sm leading-6 text-[#6d5849]">
                  A community that sees solo travel as self-trust in motion
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-[#fab642] px-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#7a331b] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f5b137]"
            >
              Read the Founder Journal
            </Link>
          </div>
        </div>
      </div>
    </PatternSection>
  )
}
