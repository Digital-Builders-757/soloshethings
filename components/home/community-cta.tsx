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
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(219,112,147,0.08),transparent_70%)]" />

      <div className="container mx-auto px-6">
        <div
          ref={containerRef}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl p-1"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(219,112,147,0.15), transparent 40%), linear-gradient(135deg, rgba(219,112,147,0.1), transparent, rgba(64,224,208,0.1))`,
          }}
        >
          <div className="relative rounded-[calc(1.5rem-4px)] bg-background/80 backdrop-blur-sm px-8 py-16 text-center md:px-16">
            {/* Floating elements */}
            <div className="absolute left-8 top-8 animate-float">
              <Heart className="h-6 w-6 text-[#db7093]/40" />
            </div>
            <div className="absolute right-12 top-12 animate-float" style={{ animationDelay: "1s" }}>
              <Sparkles className="h-5 w-5 text-[#40e0d0]/40" />
            </div>
            <div className="absolute bottom-12 left-16 animate-float" style={{ animationDelay: "2s" }}>
              <Sparkles className="h-4 w-4 text-[#9370db]/40" />
            </div>

            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#db7093]/20 to-[#40e0d0]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground">
              <Sparkles className="h-3 w-3" />
              Join 10,000+ Travelers
            </span>

            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-[#9370db] via-[#db7093] to-[#40e0d0] bg-clip-text text-transparent">
                Join Our
              </span>{" "}
              Community
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Connect with thousands of solo female travelers from around the world. Share your stories, get travel
              tips, and find your next adventure with a supportive community that understands the joy and challenges of
              solo travel.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group gap-2 rounded-full bg-gradient-to-r from-[#db7093] to-[#9370db] px-8 text-white transition-all hover:shadow-lg hover:shadow-[#db7093]/40"
                >
                  Join the Community
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/community">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-primary/30 bg-transparent px-8 text-foreground transition-all hover:border-primary hover:bg-primary/10"
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