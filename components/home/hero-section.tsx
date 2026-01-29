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
      className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-16 md:py-24"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(219,112,147,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(219,112,147,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Floating Orbs */}
      <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-[#db7093]/15 blur-3xl animate-float" />
      <div
        className="absolute right-[15%] bottom-[20%] h-48 w-48 rounded-full bg-[#40e0d0]/15 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute left-[50%] top-[50%] h-32 w-32 rounded-full bg-[#9370db]/10 blur-2xl animate-float"
        style={{ animationDelay: "4s" }}
      />

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content with Parallax */}
          <div ref={textRef} className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#db7093]/20 to-[#40e0d0]/20 px-4 py-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Welcome to Your Next Adventure
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="inline-block bg-gradient-to-r from-[#9370db] via-[#db7093] to-[#40e0d0] bg-clip-text text-transparent">
                Travel Blog
              </span>{" "}
              for Adventurous Solo Female Travelers
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              Discover incredible destinations, safety tips, and stories from fearless solo female travelers around the
              world
            </p>

            {/* Scroll indicator */}
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDown className="h-4 w-4 animate-bounce" />
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* Carousel with glow effect */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-[#db7093]/30 via-[#40e0d0]/20 to-[#9370db]/30 blur-xl opacity-60" />
            <div className="relative">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}