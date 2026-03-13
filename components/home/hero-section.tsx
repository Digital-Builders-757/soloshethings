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
        {/* Left: Orange solid background with content + African pattern overlay */}
        <div className="relative flex items-center justify-center overflow-hidden bg-[#df4915] px-4 py-8 md:px-8 md:py-16 lg:px-12 lg:py-24">
          {/* Animated Kente-inspired pattern overlay */}
          <div className="pointer-events-none absolute inset-0 animate-pattern-drift pattern-kente opacity-60" />
          <div className="relative z-10 max-w-md text-left">
            <h1 className="animate-slide-in-left text-xl font-bold md:text-3xl lg:text-4xl">
              <span className="text-white">Solo </span>
              <span className="animate-pulse-glow italic text-[#ffd0a9]">SHE </span>
              <span className="text-white">Things</span>
            </h1>
            <p className="animate-slide-in-left delay-200 mt-2 text-xs leading-relaxed text-white/90 opacity-0 md:mt-4 md:text-base lg:text-lg">
              Join a global community of women sharing their stories, inspiring one another, and discovering what they are capable of doing on their own.
            </p>
            <Link
              href="/signup"
              className="animate-slide-in-left delay-400 mt-4 inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#df4915] opacity-0 transition-all hover:scale-105 hover:bg-white/90 md:mt-6 md:px-6 md:py-3 md:text-base lg:mt-8"
            >
              START YOUR JOURNEY
            </Link>
          </div>
        </div>

        {/* Right: Image carousel with smooth transitions */}
        <div className="relative min-h-[200px] overflow-hidden md:min-h-0">
          <Image
            key={currentSlide.src}
            src={currentSlide.src}
            alt={currentSlide.location}
            fill
            className="animate-fade-in object-cover transition-transform duration-700"
            sizes="50vw"
            priority
          />
          {/* Location label with slide animation */}
          <div className="absolute bottom-3 left-3 md:bottom-8 md:left-8">
            <span 
              key={currentSlide.location}
              className="animate-slide-in-up inline-block text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] md:text-xl lg:text-2xl"
            >
              {currentSlide.location}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
