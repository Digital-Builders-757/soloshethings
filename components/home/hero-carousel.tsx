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
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-2xl md:h-[500px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}>
      {heroImages.map((image, index) => (
        <div key={image.id} className={cn("absolute inset-0 transition-opacity duration-500", index === currentSlide ? "opacity-100" : "opacity-0")}>
          <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" priority={index === 0} />
        </div>
      ))}

      <button type="button" onClick={() => { prevSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000) }}
        className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-lg transition-all hover:bg-background hover:scale-105"
        aria-label="Previous slide">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button type="button" onClick={() => { nextSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000) }}
        className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-primary shadow-lg transition-all hover:bg-background hover:scale-105"
        aria-label="Next slide">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button key={`dot-${heroImages[index].id}`} type="button" onClick={() => goToSlide(index)}
            className={cn("h-3 rounded-full transition-all", index === currentSlide ? "w-8 bg-background" : "w-3 bg-background/50 hover:bg-background/75")}
            aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </div>
  )
}