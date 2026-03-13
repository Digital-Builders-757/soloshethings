/**
 * The Story Behind Solo SHE Things
 * 
 * Two-column: 25% image left, 75% text right
 * Founder silhouette image
 */

import Image from "next/image"
import Link from "next/link"

export function FounderStory() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[1fr_3fr] items-center gap-4 px-5 md:gap-10 md:px-8">
        {/* Left: Founder silhouette image with float animation */}
        <div className="flex justify-center">
          <div className="animate-float relative h-[150px] w-[120px] md:h-[250px] md:w-[200px] lg:h-[300px] lg:w-[240px]">
            <Image
              src="/images/founder-silhouette.png"
              alt="Founder silhouette"
              fill
              className="object-contain drop-shadow-lg"
              sizes="(max-width: 768px) 120px, 240px"
            />
          </div>
        </div>

        {/* Right: Text content */}
        <div className="text-left">
          <h2 className="text-lg font-bold text-[#df4915] md:text-2xl lg:text-[2rem]">
            The Story Behind Solo SHE Things
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5563] md:mt-4 md:text-base">
            Solo SHE Things started with a simple question: Why does solo travel feel so different for women? Our founder set out to create a space where women could share their experiences, find resources, and connect with like-minded travelers.
          </p>
          <Link
            href="/about"
            className="mt-4 inline-block rounded-full bg-[#df4915] px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#c4400f] md:mt-6 md:px-6 md:py-3 md:text-base"
          >
            Read the Founder Journal
          </Link>
        </div>
      </div>
    </section>
  )
}
