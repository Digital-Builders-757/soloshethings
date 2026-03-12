/**
 * Banner Component
 *
 * New design: Orange top banner + centered Logo text + nav row
 * Fixed height: 170px total
 */

export function Banner() {
  return (
    <div className="border-b border-[#e5e7eb]">
      {/* Top Announcement Banner - #fb5315 with subtle pattern */}
      <div className="relative bg-[#fb5315] px-4 py-2 text-center">
        <div className="pointer-events-none absolute inset-0 pattern-kente opacity-40" />
        <p className="relative z-10 text-sm text-white">
          Discover your <span className="font-bold text-[#ffd0a9]">Solo SHE</span> Adventure!
        </p>
      </div>

      {/* Logo Row - Centered */}
      <div className="bg-white py-4 text-center md:py-6">
        <h1 className="text-2xl font-bold tracking-wide text-[#fb5315] md:text-3xl">
          Solo SHE Things
        </h1>
        <p className="mt-0.5 text-xs tracking-widest text-[#4b5563] md:text-sm">
          Est. 2025
        </p>
      </div>
    </div>
  )
}
