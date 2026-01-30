"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Heart } from "lucide-react"

export function CommunityCTA() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      container.style.setProperty("--mouse-x", `${x}px`)
      container.style.setProperty("--mouse-y", `${y}px`)
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="section-ocean-warm relative overflow-hidden py-24">
      <div className="container mx-auto px-6 relative z-10">
        <div
          ref={containerRef}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-1"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15), transparent 40%)`,
          }}
        >
          <div className="relative rounded-[calc(1.5rem-4px)] surface-glass-ocean px-8 py-16 text-center md:px-16">
            {/* Floating elements with warm accents */}
            <div className="absolute left-8 top-8 animate-float z-10">
              <Heart className="h-6 w-6 text-brand-yellow1/60 drop-shadow-[0_0_8px_rgba(242,226,5,0.4)]" />
            </div>
            <div className="absolute right-12 top-12 animate-float z-10" style={{ animationDelay: "1s" }}>
              <Sparkles className="h-5 w-5 text-brand-orange/50 drop-shadow-[0_0_8px_rgba(242,135,5,0.4)]" />
            </div>
            <div className="absolute bottom-12 left-16 animate-float z-10" style={{ animationDelay: "2s" }}>
              <Sparkles className="h-4 w-4 text-brand-yellow2/50 drop-shadow-[0_0_6px_rgba(242,203,5,0.3)]" />
            </div>
            <div className="absolute top-1/2 right-8 animate-float z-10" style={{ animationDelay: "0.5s" }}>
              <Heart className="h-5 w-5 text-brand-orange/40 drop-shadow-[0_0_6px_rgba(242,135,5,0.3)]" />
            </div>

            <span className="mb-6 inline-flex items-center gap-2 rounded-full surface-glass-ocean px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
              <Sparkles className="h-3 w-3" />
              Join 10,000+ Travelers
            </span>

            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-white via-brand-yellow1/90 to-brand-orange/80 bg-clip-text text-transparent">
                Join Our
              </span>{" "}
              <span className="bg-gradient-to-r from-brand-yellow1 via-brand-orange to-white bg-clip-text text-transparent">
                Community
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              Connect with thousands of solo female travelers from around the world. Share your stories, get travel
              tips, and find your next adventure with a supportive community that understands the joy and challenges of
              solo travel.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group gap-2 rounded-full bg-gradient-to-r from-brand-yellow1 via-brand-orange to-brand-yellow2 px-8 text-black transition-all hover:shadow-lg"
                >
                  Join the Community
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/community">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-white/30 bg-transparent px-8 text-white transition-all hover:border-brand-yellow1 hover:bg-brand-yellow1/10 hover:shadow-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}