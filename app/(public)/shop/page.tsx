import Link from "next/link"
import { Footer } from "@/components/footer"
import { ShoppingBag, ArrowRight } from "lucide-react"

export default function ShopPage() {
  return (
    <>
      <main>
        {/* Coming Soon Hero */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-brand-blue py-20 md:min-h-[80vh] md:py-32">
          <div className="relative z-10 mx-auto max-w-[1240px] px-5 text-center md:px-8">
            <div className="badge-tilt mx-auto mb-6 inline-block rounded-full bg-brand-gold px-5 py-2 text-xs font-bold uppercase tracking-wider text-white md:mb-8 md:px-6 md:py-2.5 md:text-sm">
              Coming Soon
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              The{" "}
              <span className="italic font-normal text-brand-orange">SHE</span>{" "}
              Shop
            </h1>

            <p className="mx-auto mt-5 max-w-[550px] text-base leading-relaxed text-white/80 md:mt-8 md:text-lg">
              We are curating a collection of travel essentials designed for the solo female
              traveler. Every purchase will support our mission to empower women to explore
              the world.
            </p>

            <div className="mx-auto mt-8 flex max-w-md items-center gap-3 md:mt-10">
              <input
                type="email"
                placeholder="Enter your email for early access"
                className="flex-1 rounded-full border-2 border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-brand-orange md:px-6 md:py-3.5 md:text-base"
              />
              <button
                type="button"
                className="rounded-full bg-brand-orange px-5 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg md:px-6 md:py-3.5 md:text-base"
              >
                Notify Me
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-white/60 md:mt-14 md:gap-12">
              <div className="text-center">
                <ShoppingBag className="mx-auto mb-2 h-6 w-6 md:h-7 md:w-7" />
                <p className="text-xs font-bold uppercase tracking-wider md:text-sm">Curated Gear</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <p className="text-xs font-bold uppercase tracking-wider md:text-sm">Mission-Driven</p>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <p className="text-xs font-bold uppercase tracking-wider md:text-sm">Global Reach</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-14 text-center text-white md:py-24">
          <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-8">
            <h2 className="font-serif text-2xl font-bold italic sm:text-3xl md:text-4xl lg:text-5xl">
              Stay Connected While You Wait
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/90 md:mt-6 md:text-lg">
              Follow our journey and be the first to shop when we launch.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10 md:gap-6">
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-orange transition-all hover:shadow-lg sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Learn About Our Mission
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white hover:text-brand-orange sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
