/**
 * Banner Component
 * 
 * Site-wide banner with animated gradient, marquee text, and sparkles
 * Presentational component - no interactivity or data fetching
 * Server Component by default
 */

import Image from "next/image";
import { Sparkles } from "lucide-react";

const marqueeText =
  "EXPLORE THE WORLD  ·  TRAVEL FEARLESSLY  ·  DISCOVER NEW HORIZONS  ·  EMBRACE ADVENTURE  ·  ";

export function Banner() {
  return (
    <section className="section-ocean relative h-[200px] w-full overflow-hidden">
      {/* Background Image - Original colors, high opacity */}
      <Image
        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=200&fit=crop"
        alt="Travel banner"
        fill
        className="image-clean object-cover"
        priority
      />
      {/* Neutral vignette for depth (no color casting) */}
      <div className="overlay-neutral-vignette" />

      {/* Animated Marquee Text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-[color:var(--color-bg-dark)]/90 py-2">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-4 inline-block font-mono text-sm font-medium tracking-widest text-white">
            {marqueeText}
            {marqueeText}
            {marqueeText}
            {marqueeText}
          </span>
        </div>
      </div>

      {/* Floating Sparkle Elements */}
      <div className="absolute left-[10%] top-[20%] animate-float">
        <Sparkles className="h-6 w-6 text-white/80" />
      </div>
      <div className="absolute right-[15%] top-[30%] animate-float" style={{ animationDelay: "1s" }}>
        <Sparkles className="h-4 w-4 text-white/60" />
      </div>
      <div className="absolute left-[30%] top-[40%] animate-float" style={{ animationDelay: "2s" }}>
        <Sparkles className="h-5 w-5 text-white/70" />
      </div>
    </section>
  );
}
