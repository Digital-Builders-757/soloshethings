/**
 * Banner Component
 * 
 * Site-wide top banner + establishment divider
 * Clean, editorial aesthetic
 */

export function Banner() {
  return (
    <div>
      {/* Top Announcement Banner */}
      <div className="bg-brand-navy py-2.5 text-center">
        <p className="text-sm font-medium tracking-wide text-white">
          Discover your Solo SHE Adventure!
        </p>
      </div>
      {/* Establishment Divider */}
      <div className="border-b border-border bg-white py-1.5 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Solo SHE Things &middot; Est. 2025
        </p>
      </div>
    </div>
  )
}
