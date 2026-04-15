import Image from "next/image"
import Link from "next/link"
import { PatternSection } from "@/components/ui/pattern-section"

export function AboutPreview() {
  return (
    <PatternSection tone="white" patternTop className="py-16 md:py-24">
      <div className="container mx-auto px-6 pt-12 md:pt-16">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#d9d9d9]">
            <Image
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&h=750&fit=crop"
              alt="Founder of Solo SHE Things"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-4xl font-bold text-[#e34b16] md:text-5xl">
              Our Story
            </h2>

            <p className="text-lg leading-relaxed text-[#3a3a3a]">
              Solo SHE Things started with a simple question: Why does solo travel feel so different for women? Our founder set out to create a space where women could share their experiences, find resources, and connect with like-minded travelers.
            </p>

            <Link
              href="/about"
              className="mt-4 inline-flex w-fit items-center justify-center rounded-full bg-[#fab642] px-8 py-4 text-sm font-bold text-[#7a331b] transition-all hover:bg-[#fab642]/90"
            >
              Read the Founder Journal
            </Link>
          </div>
        </div>
      </div>
    </PatternSection>
  )
}
