"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const heroSlides = [
  { src: "/images/hero-lisbon.jpg", location: "Lisbon, Portugal" },
  { src: "/images/hero-berlin.jpg", location: "Berlin, Germany" },
  { src: "/images/hero-safari.jpg", location: "Botswana, Africa" },
  { src: "/images/hero-sculpture.jpg", location: "London, England" },
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
    <section className="min-h-[50vh] md:min-h-[calc(100vh-170px)]">
      <div className="grid min-h-[50vh] grid-cols-2 md:min-h-[calc(100vh-170px)]">
        {/* Left: Orange solid background with content */}
        <div className="flex items-center justify-center bg-[#df4915] px-4 py-8 md:px-8 md:py-16 lg:px-12 lg:py-24">
          <div className="max-w-md text-left">
            <h1 className="text-xl font-bold text-white md:text-3xl lg:text-4xl">
              Solo SHE Things
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-white/90 md:mt-4 md:text-base lg:text-lg">
              Join a global community of women sharing their stories, inspiring one another, and discovering what they are capable of doing on their own.
            </p>
            <Link
              href="/signup"
              className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#df4915] transition-all hover:bg-white/90 md:mt-6 md:px-6 md:py-3 md:text-base lg:mt-8"
            >
              START YOUR JOURNEY
            </Link>
          </div>
        </div>

        {/* Right: Image carousel */}
        <div className="relative min-h-[200px] md:min-h-0">
          <Image
            src={currentSlide.src}
            alt={currentSlide.location}
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          {/* Location label */}
          <div className="absolute bottom-3 left-3 md:bottom-8 md:left-8">
            <span className="text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] md:text-xl lg:text-2xl">
              {currentSlide.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
