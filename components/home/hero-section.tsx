import Image from "next/image"
import Link from "next/link"

const heroHighlights = [
  { label: "Stories shared", value: "120+" },
  { label: "Countries explored", value: "30" },
  { label: "Women connected", value: "1 global circle" },
]

export function HeroSection() {
  return (
    <section className="relative border-b border-[#efdac1] bg-white">
      <div className="grid min-h-[calc(100dvh-var(--shell-chrome-height)-env(safe-area-inset-bottom,0px))] lg:grid-cols-[1.03fr_0.97fr]">
        <div className="relative isolate overflow-hidden bg-[#d85a23] py-10 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:py-14 sm:pl-8 sm:pr-8 md:px-10 lg:px-14 lg:py-20 xl:px-20">
          {/* Soft glow only — no wavy band here; welcome section owns the pattern below the fold */}
          <div className="pointer-events-none absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-[#f7e8be]/10 blur-3xl" aria-hidden="true" />

          <div className="relative z-10 flex h-full max-w-xl flex-col justify-center pb-10 lg:pb-14">
            <p className="eyebrow-light text-sm tracking-[0.22em]">
              Stories, safety, and sisterhood
            </p>

            <h1 className="wordmark mt-4 break-words text-[clamp(1.95rem,6vw,4.65rem)] leading-[0.95] tracking-[0.03em] sm:mt-5 lg:mt-5">
              SOLO <span className="wordmark-accent">SHE</span> THINGS
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#fff6e8] sm:mt-6 sm:text-lg sm:leading-8">
              Join a global community of women sharing their stories, inspiring one another,
              and discovering what they are capable of doing on their own.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="cta-secondary h-14 border-[#f7e8be]/70 bg-[#fab642] px-8 text-sm uppercase tracking-[0.16em] text-[#7a331b] shadow-[0_12px_30px_rgba(122,51,27,0.18)] hover:-translate-y-0.5 hover:bg-[#f5b137] hover:text-[#7a331b]"
              >
                Start Your Journey
              </Link>
              <Link
                href="/collections"
                className="cta-secondary-inverse h-14 px-8 text-sm uppercase tracking-[0.16em]"
              >
                Explore Stories
              </Link>
            </div>

            <div className="editorial-card-strong mt-12 p-5 text-[#7a331b] sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div key={item.label} className="rounded-[1.25rem] bg-[#f7e8be]/65 px-4 py-4">
                    <p className="text-2xl font-bold text-[#a14b24]">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a331b]/85">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
          <Image
            src="/images/hero-safari.jpg"
            alt="A solo woman traveler resting on a boat at sunset in Botswana"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/28" aria-hidden="true" />

          <div className="absolute left-6 top-6 rounded-full border border-white/35 bg-white/16 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            Featured destination • Botswana
          </div>

          <div className="absolute bottom-5 right-5 rounded-full bg-[#2d1b14]/78 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
            Botswana, Africa
          </div>
        </div>
      </div>
    </section>
  )
}
