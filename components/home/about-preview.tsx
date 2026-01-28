"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { founder } from "@/lib/data"
import { ArrowRight, Globe, Users, Heart, Sparkles } from "lucide-react"

const stats = [
  { icon: Globe, label: "Countries Visited", value: "45+", color: "from-[#db7093] to-[#9370db]" },
  { icon: Users, label: "Community Members", value: "10K+", color: "from-[#40e0d0] to-[#9370db]" },
  { icon: Heart, label: "Stories Shared", value: "500+", color: "from-[#9370db] to-[#db7093]" },
]

export function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)))
      setScrollProgress(progress)

      imageRef.current.style.transform = `translateY(${(progress - 0.5) * 50}px)`
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background py-24">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#db7093]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#40e0d0]/5 blur-3xl" />

      <div className="container relative mx-auto px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image with gradient border and parallax */}
          <div ref={imageRef} className="gradient-border relative h-[400px] overflow-hidden rounded-2xl lg:h-[500px]">
            <div className="absolute inset-[3px] overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&h=1000&fit=crop"
                alt="Founder traveling solo"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/40 via-transparent to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-4">
                <p className="text-sm font-medium text-foreground">
                  <Sparkles className="mb-1 inline h-4 w-4 text-primary" /> Traveled to 45+ countries solo
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#db7093]/20 to-[#40e0d0]/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Meet the Founder
            </span>

            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Hey, I&apos;m{" "}
              <span className="bg-gradient-to-r from-[#9370db] to-[#db7093] bg-clip-text text-transparent">
                {founder.name.split(" ")[0]}
              </span>
              !
            </h2>

            <p className="text-lg leading-relaxed text-muted-foreground">{founder.bio}</p>

            {/* Stats with gradient icons */}
            <div className="mt-4 grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="gradient-border-static gradient-border group rounded-xl p-4 text-center transition-all hover:-translate-y-1"
                  style={{
                    opacity: Math.min(1, scrollProgress * 2 - index * 0.2),
                    transform: `translateY(${Math.max(0, 20 - scrollProgress * 40)}px)`,
                  }}
                >
                  <div className="rounded-lg bg-card p-3">
                    <div
                      className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${stat.color}`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="mt-3 font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="mt-4">
              <Button className="group gap-2 rounded-full bg-gradient-to-r from-[#db7093] to-[#9370db] px-6 text-white transition-all hover:shadow-lg hover:shadow-[#db7093]/40">
                Read My Story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}