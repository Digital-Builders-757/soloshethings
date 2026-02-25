/**
 * Banner Component
 *
 * Orange top announcement bar + centered brand header (matches reference design)
 */

export function Banner() {
  return (
    <div>
      {/* Top Announcement Banner - Orange per reference */}
      <div className="bg-brand-orange py-3 text-center">
        <p className="text-[0.85rem] font-bold uppercase tracking-[1.5px] text-white">
          Discover your Solo SHE Adventure!
        </p>
      </div>

      {/* Brand Header - Centered logo + est. */}
      <header className="bg-white py-8 text-center">
        <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-brand-orange">
          Solo SHE Things
        </h1>
        <p className="mt-1 text-xs font-normal uppercase tracking-[2px] text-brand-orange/80">
          Est. 2025
        </p>
      </header>
    </div>
  )
}
