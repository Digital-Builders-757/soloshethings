"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const heroSlides = [
  { src: "/images/hero-1.jpg", location: "Lisbon, Portugal" },
  { src: "/images/hero-2.jpg", location: "Kyoto, Japan" },
  { src: "/images/hero-3.jpg", location: "Barcelona, Spain" },
  { src: "/images/hero-4.jpg", location: "Berlin, Germany" },
]

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const currentSlide = heroSlides[activeSlide]

  return (
    <section className="min-h-[calc(100vh-170px)]">
      <div className="grid min-h-[calc(100vh-170px)] grid-cols-1 lg:grid-cols-2">
        {/* Left: Orange solid background with content */}
        <div className="flex items-center justify-center bg-[#df4915] px-8 py-16 lg:px-12 lg:py-24">
          <div className="max-w-md text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-[2rem]">
              Solo SHE Things
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
              Join a global community of women sharing their stories, inspiring one another, and discovering what they are capable of doing on their own.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-base font-semibold text-[#df4915] transition-all hover:bg-white/90 md:mt-8"
            >
              START YOUR JOURNEY
            </Link>
          </div>
        </div>

        {/* Right: Image carousel */}
        <div className="relative min-h-[300px] lg:min-h-0">
          <Image
            src={currentSlide.src}
            alt={currentSlide.location}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {/* Location label */}
          <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
            <span className="text-xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] md:text-2xl">
              {currentSlide.location}
            </span>
          </div>
          {/* Slide dots */}
          <div className="absolute bottom-5 right-5 flex gap-2 md:bottom-8 md:right-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeSlide ? "bg-white" : "bg-white/50"
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
