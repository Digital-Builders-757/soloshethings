"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CommunityCTA() {
  return (
    <section className="bg-[#FB5315] py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Go Solo, Together
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#FFD0A9]/90">
            Connect with thousands of solo female travelers from around the world. Share your
            stories, get travel tips, and find your next adventure with a supportive community
            that understands the joy and challenges of solo travel.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="group gap-2 rounded-full bg-white px-8 text-[#FB5315] transition-all hover:bg-[#FFD0A9] hover:shadow-lg"
              >
                Join the SHEsisterhood
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/community">
              <Button
                size="lg"
                className="rounded-full border-2 border-[#2044E0] !bg-[#2044E0] px-8 text-white transition-all hover:shadow-lg"
              >
                See How SHE Did It
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
