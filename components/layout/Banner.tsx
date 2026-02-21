import Image from "next/image"

/**
 * Banner Component
 *
 * Site-wide top banner + establishment divider + picture strip with marquee
 */

export function Banner() {
  return (
    <div>
      {/* Top Announcement Banner */}
      <div className="bg-brand-blue py-2.5 text-center">
        <p className="text-sm font-medium tracking-wide text-white">
          Discover your Solo SHE Adventure!
        </p>
      </div>
      {/* Establishment Divider */}
      <div className="border-b border-border bg-background py-1.5 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Solo SHE Things &middot; Est. 2025
        </p>
      </div>
      {/* Picture Banner */}
      <div className="relative h-[160px] w-full overflow-hidden md:h-[200px]">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=200&fit=crop"
          alt="Travel landscape banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand-blue/40" />
      </div>
    </div>
  )
}
