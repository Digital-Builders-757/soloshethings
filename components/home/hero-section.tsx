"use client"

import Image from "next/image"
import { heroImages } from "@/lib/data"

export function HeroSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-brand-navy md:text-5xl lg:text-6xl text-balance">
            Solo <span className="text-brand-coral">SHE</span> Things
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A travel blog and community for adventurous solo female travelers.
            Discover destinations, safety tips, and stories from fearless women around the world.
          </p>
        </div>

        {/* 4-Image Strip */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {heroImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl"
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
              <div className="absolute inset-x-0 bottom-0 bg-brand-navy/60 px-4 py-3 backdrop-blur-sm">
                <p className="text-center text-sm font-semibold tracking-wide text-white">
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
