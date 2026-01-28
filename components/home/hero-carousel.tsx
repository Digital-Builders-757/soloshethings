"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { heroImages } from "@/lib/data"

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  return (
    <div
      className="gradient-border relative h-[400px] w-full overflow-hidden rounded-2xl md:h-[500px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-[3px] overflow-hidden rounded-xl">
        {/* Slides */}
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "absolute inset-0 transition-all duration-700",
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/40 via-transparent to-transparent" />
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={() => {
            prevSlide()
            setIsAutoPlaying(false)
            setTimeout(() => setIsAutoPlaying(true), 10000)
          }}
          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#db7093] to-[#9370db] text-white shadow-lg shadow-[#db7093]/30 transition-all hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => {
            nextSlide()
            setIsAutoPlaying(false)
            setTimeout(() => setIsAutoPlaying(true), 10000)
          }}
          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#40e0d0] to-[#9370db] text-white shadow-lg shadow-[#40e0d0]/30 transition-all hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Progress Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-[#1a1a2e]/20 px-4 py-2 backdrop-blur-sm">
          {heroImages.map((_, index) => (
            <button
              key={`dot-${heroImages[index].id}`}
              type="button"
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-8 bg-gradient-to-r from-[#db7093] to-[#40e0d0]"
                  : "w-2 bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}