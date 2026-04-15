import Link from "next/link"

/**
 * Banner Component
 *
 * Site-wide top banner with orange background and centered logo
 * Matches Figma design for Solo SHE Things
 */

export function Banner() {
  return (
    <div className="bg-[#e34b16] py-4 text-center">
      <Link href="/" className="inline-block">
        <h1 className="font-serif text-2xl font-bold tracking-wide text-white md:text-3xl">
          SOLO<span className="font-normal">SHE</span>THINGS
        </h1>
        <p className="mt-1 text-xs tracking-[0.2em] text-white/90">
          Est. 2025
        </p>
      </Link>
    </div>
  )
}
