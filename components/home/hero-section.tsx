"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { heroImages } from "@/lib/data"

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const currentImage = heroImages[activeSlide]

  return (
    <section className="bg-gradient-to-b from-white to-[#FAFAFA] py-24">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 px-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Hero Content */}
        <div>
          <h1 className="font-serif text-[5rem] font-bold leading-[0.95] text-brand-blue">
            <span className="italic font-normal text-brand-orange">Solo</span>{" "}
            SHE{" "}
            <span className="italic font-normal text-brand-orange">Things</span>
          </h1>
          <p className="mt-8 max-w-[450px] text-xl leading-relaxed text-[#555]">
            Join the global collective of fearless women exploring the world on
            their own terms. Curated destinations, safety guides, and a
            sisterhood that travels with you.
          </p>
          <div className="mt-8 inline-block -rotate-3">
            <Link
              href="/signup"
              className="inline-block rounded-full border-2 border-brand-orange bg-brand-orange px-8 py-4 text-base font-bold uppercase tracking-[0.5px] text-white transition-all duration-200 hover:bg-white hover:text-brand-orange"
            >
              Start Your Journey
            </Link>
          </div>
        </div>

        {/* Right: Carousel Card */}
        <div className="relative p-4">
          {/* Sticker Badge */}
          <div className="absolute -right-5 top-[30px] z-10 rotate-12 rounded-full bg-brand-orange px-6 py-2 text-[0.9rem] font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
            Trending Now!
          </div>

          {/* Card with peach shadow */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-peach-offset transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[24px_24px_0px_var(--brand-peach)]">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {currentImage.caption}
                </h3>
                <span className="text-[0.9rem] text-white/90">
                  {"Europe's safest solo gem"}
                </span>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
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
