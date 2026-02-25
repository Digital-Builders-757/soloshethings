/**
 * Banner Component
 *
 * Orange top announcement bar + centered brand header (matches reference design)
 */

export function Banner() {
  return (
    <div>
      {/* Top Announcement Banner - Orange per reference */}
      <div className="bg-brand-orange px-4 py-2.5 text-center md:py-3">
        <p className="text-[0.75rem] font-bold uppercase tracking-[1px] text-white md:text-[0.85rem] md:tracking-[1.5px]">
          Discover your Solo SHE Adventure!
        </p>
      </div>

      {/* Brand Header - Centered logo + est. */}
      <header className="bg-white py-5 text-center md:py-8">
        <h1 className="font-serif text-2xl font-bold uppercase tracking-tight text-brand-orange sm:text-3xl md:text-4xl">
          Solo SHE Things
        </h1>
        <p className="mt-1 text-[0.65rem] font-normal uppercase tracking-[2px] text-brand-orange/80 md:text-xs">
          Est. 2025
        </p>
      </header>
    </div>
  )
}
