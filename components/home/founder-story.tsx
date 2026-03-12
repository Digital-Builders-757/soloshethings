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
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-5 md:px-8 lg:grid-cols-[1fr_3fr]">
        {/* Left: Founder silhouette image */}
        <div className="flex justify-center">
          <div className="relative h-[250px] w-[200px] md:h-[300px] md:w-[240px]">
            <Image
              src="/images/founder-silhouette.png"
              alt="Founder silhouette"
              fill
              className="object-contain"
              sizes="240px"
            />
          </div>
        </div>

        {/* Right: Text content */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl font-bold text-[#df4915] md:text-[2rem]">
            The Story Behind Solo SHE Things
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4b5563]">
            Solo SHE Things started with a simple question: Why does solo travel feel so different for women? Our founder set out to create a space where women could share their experiences, find resources, and connect with like-minded travelers.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block rounded-full bg-[#df4915] px-6 py-3 text-base font-semibold text-white transition-all hover:bg-[#c4400f]"
          >
            Read the Founder Journal
          </Link>
        </div>
      </div>
    </section>
  )
}
