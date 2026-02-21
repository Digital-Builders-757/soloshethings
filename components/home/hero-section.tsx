"use client"

import Image from "next/image"
import { heroImages } from "@/lib/data"

export function HeroSection() {
  return (
    <section className="bg-brand-peach py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:gap-12">
          {/* Left column -- Text */}
          <div className="flex flex-col justify-center lg:w-1/2">
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-brand-orange md:text-5xl lg:text-6xl text-balance">
              Solo SHE Things
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-foreground/70">
              A travel blog and community for adventurous solo female travelers.
              Discover destinations, safety tips, and stories from fearless women
              around the world.
            </p>
          </div>

          {/* Right column -- 4-Image Grid */}
          <div className="grid w-full grid-cols-2 gap-3 lg:w-1/2">
            {heroImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-md"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  priority={index < 2}
                  loading={index >= 2 ? "lazy" : undefined}
                />
                {/* Caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-brand-orange/80 px-4 py-3">
                  <p className="text-center text-sm font-semibold tracking-wide text-white">
                    {image.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
