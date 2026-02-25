import Link from "next/link"

export function CommunityCTA() {
  return (
    <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-[120px]">
      <div className="relative z-10 mx-auto max-w-[1240px] px-8 text-center">
        <h2 className="font-serif text-[4.5rem] font-bold italic text-white">
          Go Solo, Together.
        </h2>
        <div className="mt-8 flex items-center justify-center gap-8">
          <Link
            href="/signup"
            className="rounded-full bg-white px-10 py-4 text-lg font-bold text-brand-orange transition-all duration-200 hover:bg-brand-peach"
          >
            Join the Community
          </Link>
          <Link
            href="/blog"
            className="rounded-full border-2 border-white px-10 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-white/10"
          >
            Read Manifestos
          </Link>
        </div>
      </div>
    </section>
  )
}
