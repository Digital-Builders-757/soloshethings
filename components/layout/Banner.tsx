/**
 * Banner Component
 *
 * 1. Orange announcement bar
 * 2. White brand header with centered "Solo SHE Things Est. 2025"
 */

export function Banner() {
  return (
    <div>
      {/* Top Announcement Banner - Orange */}
      <div className="bg-brand-orange py-2.5 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white">
          Discover your Solo SHE Adventure!
        </p>
      </div>
      {/* Brand Header - White */}
      <div className="border-b border-border bg-white py-4 text-center">
        <p className="font-serif text-xl font-bold uppercase tracking-[0.15em] text-brand-orange md:text-2xl">
          Solo SHE Things <span className="font-sans text-sm font-medium tracking-[0.2em] text-muted-foreground">Est. 2025</span>
        </p>
      </div>
    </div>
  )
}
