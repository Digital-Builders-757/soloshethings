import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CommunityCTA() {
  return (
    <section className="bg-brand-orange py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-peach">
            Join 10,000+ Travelers
          </p>

          {/* Title */}
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl text-balance">
            Go Solo, Together
          </h2>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-peach" />

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-brand-peach">
            Connect with thousands of solo female travelers from around the world. Share your stories,
            get travel tips, and find your next adventure with a supportive community.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-orange transition-all hover:bg-brand-peach hover:shadow-lg"
            >
              Join the SHEsisterhood
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-blue/90 hover:shadow-lg"
            >
              See How SHE Did It
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
