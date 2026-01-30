"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { communityStories } from "@/lib/data"
import { Users, Quote } from "lucide-react"

export function CommunityStories() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const relativeScroll = window.scrollY - sectionTop + window.innerHeight
      setScrollY(relativeScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden home-community-bg py-24">
      {/* Parallax Background Pattern */}
      <div
        className="absolute inset-0 home-community-radials"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div className="absolute inset-0 home-community-grid" />

      <div className="container relative mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-blue1/30 to-brand-yellow1/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            <Users className="h-3 w-3" />
            Community
          </span>
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">Community Stories</h2>
          <p className="mt-4 text-lg text-white/70">Real stories from real solo female travelers</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {communityStories.map((story, index) => (
            <Link
              key={story.id}
              href={`/community/stories/${story.id}`}
              className="group gradient-border overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.005) * 5}px)`,
              }}
            >
              <div className="h-full overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl">
                {/* Image with overlay */}
                <div className="relative h-[280px] overflow-hidden md:h-[320px]">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Quote icon */}
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue1 to-brand-orange text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Quote className="h-5 w-5" />
                  </div>

                  {/* Title overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-serif text-xl font-semibold text-white drop-shadow">
                      {story.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="border-t border-white/10 p-5">
                  <p className="line-clamp-3 text-sm leading-relaxed text-white/75">
                    {story.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-blue1 to-brand-yellow1" />
                    <p className="text-sm font-medium text-white">
                      {story.author.name}
                      <span className="block text-xs text-white/60">{story.author.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/community"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-all hover:border-transparent hover:bg-gradient-to-r hover:from-brand-blue1 hover:to-brand-yellow1"
          >
            Read More Stories
          </Link>
        </div>
      </div>
    </section>
  )
}