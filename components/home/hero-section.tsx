"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { heroImages } from "@/lib/data"

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const currentImage = heroImages[activeSlide]

  return (
    <section className="bg-gradient-to-b from-white to-[#FAFAFA] py-12 md:py-24">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-5 md:gap-16 md:px-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Hero Content */}
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-4xl font-bold leading-[0.95] text-brand-blue sm:text-5xl md:text-6xl lg:text-[5rem]">
            <span className="italic font-normal text-brand-orange">Solo</span>{" "}
            SHE{" "}
            <span className="italic font-normal text-brand-orange">Things</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[450px] text-base leading-relaxed text-[#555] md:mt-8 md:text-xl lg:mx-0">
            Join the global collective of fearless women exploring the world on
            their own terms. Curated destinations, safety guides, and a
            sisterhood that travels with you.
          </p>
          <div className="mt-6 inline-block -rotate-3 md:mt-8">
            <Link
              href="/signup"
              className="inline-block rounded-full border-2 border-brand-orange bg-brand-orange px-6 py-3 text-sm font-bold uppercase tracking-[0.5px] text-white transition-all duration-200 hover:bg-white hover:text-brand-orange md:px-8 md:py-4 md:text-base"
            >
              Start Your Journey
            </Link>
          </div>
        </div>

        {/* Right: Carousel Card */}
        <div className="relative px-2 md:p-4">
          {/* Card with peach shadow - reduced on mobile */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[8px_8px_0px_var(--brand-peach)] transition-transform duration-300 md:rounded-3xl md:shadow-peach-offset md:hover:-translate-x-1 md:hover:-translate-y-1 md:hover:shadow-[24px_24px_0px_var(--brand-peach)]">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 md:p-8">
              <div>
                <h3 className="font-serif text-base font-bold text-white md:text-xl">
                  {currentImage.caption}
                </h3>
                <span className="text-xs text-white/90 md:text-[0.9rem]">
                  {"Europe's safest solo gem"}
                </span>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2 md:mt-8">
            {heroImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === activeSlide ? "bg-brand-orange" : "bg-[#ddd]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
