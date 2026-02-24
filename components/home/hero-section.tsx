"use client"

import { HeroCarousel } from "./hero-carousel"

export function HeroSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-12">
          {/* Left column -- Text */}
          <div className="flex flex-col lg:w-1/2">
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl text-balance">
              <span className="text-brand-blue">Solo</span>{" "}
              <span className="text-brand-orange">SHE</span>{" "}
              <span className="text-brand-blue">Things</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Discover incredible destinations, safety tips, and stories from
              fearless solo female travelers around the world.
            </p>
          </div>

          {/* Right column -- Carousel */}
          <div className="w-full lg:w-1/2">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
