/**
 * Ready to Find Your Solo SHE Thing?
 * 
 * Full-width blue section with centered content
 * Transparent outline CTA button
 */

import Link from "next/link"

export function CommunityCTA() {
  return (
    <section className="relative bg-[#2044e0] py-16 md:py-24">
      {/* Adinkra-inspired pattern overlay */}
      <div className="pointer-events-none absolute inset-0 pattern-adinkra opacity-50" />
      <div className="relative z-10 mx-auto max-w-[800px] px-5 text-center md:px-8">
        <h2 className="text-2xl font-bold text-white md:text-[2rem]">
          Ready to Find Your Solo SHE Thing?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
          Join a global community of women sharing their stories, inspiring one another, and discovering what they are capable of doing on their own.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-full border-2 border-white bg-transparent px-6 py-3 text-base font-semibold text-white transition-all hover:bg-white hover:text-[#2044e0] md:mt-8"
        >
          Create Your Free Profile
        </Link>
      </div>
    </section>
  )
}
