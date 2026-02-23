"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const heroImages = [
  { src: "/images/hero/portugal.png", caption: "Portugal" },
  { src: "/images/hero/berlin.png", caption: "Berlin" },
  { src: "/images/hero/zambezi.png", caption: "Zambezi River" },
  { src: "/images/hero/pamplona.png", caption: "Pamplona, Spain" },
] as const;

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroImages.length);
  }, []);

  const goTo = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Column - Solo SHE Things */}
          <div className="flex flex-col gap-5" style={{ marginTop: "-40px" }}>
            <h1 className="font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              <span className="text-[#2044E0]">Solo </span>
              <span className="text-[#FB5315]">SHE</span>
              <span className="text-[#2044E0]"> Things</span>
            </h1>
            <p className="text-lg leading-relaxed text-neutral-700 md:text-xl">
              Discover incredible destinations, safety tips, and stories from fearless solo
              female travelers around the world
            </p>
          </div>

          {/* Carousel Column - SHE entries with captions */}
          <div
            className="relative h-[70vh] max-h-[600px] w-full overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Slides */}
            {heroImages.map((image, index) => (
              <div
                key={image.caption}
                className={cn(
                  "absolute inset-0 transition-all duration-700",
                  index === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              >
                <Image
                  src={image.src}
                  alt={image.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
                {/* Caption - where I went */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-5 pt-12">
                  <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    {image.caption}
                  </p>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={heroImages[index].caption}
                  type="button"
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === current
                      ? "w-6 bg-[#FB5315]"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
