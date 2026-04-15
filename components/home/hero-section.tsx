"use client"

import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative">
      <div className="grid lg:grid-cols-2">
        {/* Left Panel - Orange with text */}
        <div className="flex flex-col justify-center bg-[#e34b16] px-8 py-16 md:px-12 lg:px-16 lg:py-24">
          <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl text-balance">
            SOLO<span className="font-normal">SHE</span>THINGS
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/90">
            Join a global community of women sharing their stories, inspiring one another, and discovering what they are capable of doing on their own.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-[#fab642] px-8 py-3 text-sm font-semibold text-[#3a3a3a] transition-all hover:bg-[#f5a830] hover:shadow-lg"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Right Panel - Image */}
        <div className="relative h-[400px] lg:h-auto lg:min-h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=800&fit=crop"
            alt="Woman traveler in Botswana, Africa"
            fill
            className="object-cover"
            priority
          />
          {/* Location caption */}
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-sm">
            <p className="text-sm font-medium text-white">Botswana, Africa</p>
          </div>
        </div>
      </div>
    </section>
  )
}
