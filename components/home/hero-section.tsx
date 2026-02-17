"use client"

import { useEffect, useRef } from "react"
import { HeroCarousel } from "./hero-carousel"
import { Sparkles, ArrowDown } from "lucide-react"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !textRef.current) return

      const scrolled = window.scrollY
      const rate = scrolled * 0.3

      textRef.current.style.transform = `translateY(${rate}px)`
      textRef.current.style.opacity = `${1 - scrolled / 600}`
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="heroSection"
      className="relative min-h-[80vh] overflow-hidden bg-white py-16 md:py-24"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 home-hero-grid" />

      {/* Floating Orbs */}
      <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-[#F2E205]/15 blur-3xl animate-float" />
      <div
        className="absolute right-[15%] bottom-[20%] h-48 w-48 rounded-full bg-[#0439D9]/15 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute left-[50%] top-[50%] h-32 w-32 rounded-full bg-[#F28705]/10 blur-2xl animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content with Parallax */}
          <div ref={textRef} className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#0439D9]/15 border border-[#0439D9]/20 px-4 py-2 text-sm font-medium text-neutral-900">
              <Sparkles className="h-4 w-4 text-[#0439D9]" />
              Welcome to Your Next Adventure
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
              <span className="inline-block text-[#0439D9]">
                Travel Blog
              </span>{" "}
              for Adventurous Solo Female Travelers
            </h1>

            <p className="text-lg leading-relaxed text-neutral-700 md:text-xl">
              Discover incredible destinations, safety tips, and stories from fearless solo female travelers around the
              world
            </p>

            {/* Scroll indicator */}
            <div className="mt-8 flex items-center gap-2 text-sm text-neutral-600">
              <ArrowDown className="h-4 w-4 animate-bounce" />
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
