import Link from "next/link"

export function CommunityCTA() {
  return (
    <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-16 md:py-[120px]">
      <div className="relative z-10 mx-auto max-w-[1240px] px-5 text-center md:px-8">
        <h2 className="font-serif text-3xl font-bold italic text-white sm:text-4xl md:text-5xl lg:text-[4.5rem]">
          Go Solo, Together.
        </h2>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-8 md:gap-8">
          <Link
            href="/signup"
            className="w-full rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-orange transition-all duration-200 hover:bg-brand-peach sm:w-auto md:px-10 md:py-4 md:text-lg"
          >
            Join the Community
          </Link>
          <Link
            href="/blog"
            className="w-full rounded-full border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-all duration-200 hover:bg-white/10 sm:w-auto md:px-10 md:py-4 md:text-lg"
          >
            Read Manifestos
          </Link>
        </div>
      </div>
    </section>
  )
}
