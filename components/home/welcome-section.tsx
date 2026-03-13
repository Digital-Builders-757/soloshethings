/**
 * A Community Built for Solo SHEs
 * 
 * Two-column: 75% text left, 25% image right
 * Text right-aligned, CTA pill button
 */

import Image from "next/image"
import Link from "next/link"

export function WelcomeSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[3fr_1fr] items-center gap-4 px-5 md:gap-10 md:px-8">
        {/* Left: Text content - right aligned */}
        <div className="text-right">
          <h2 className="text-lg font-bold text-[#df4915] md:text-2xl lg:text-[2rem]">
            A Community Built for Solo SHEs
          </h2>
          <p className="ml-auto mt-2 max-w-xl text-sm leading-relaxed text-[#4b5563] md:mt-4 md:text-base">
            Connect with women who understand the joys and challenges of solo travel. Share your experiences, find travel buddies, and get inspired by stories from around the world.
          </p>
          <div className="mt-4 flex justify-end md:mt-6">
            <Link
              href="/collections"
              className="inline-block rounded-full bg-[#df4915] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#c4400f] md:px-6 md:py-3 md:text-base"
            >
              Discover Solo Stories
            </Link>
          </div>
        </div>

        {/* Right: Woman silhouette image */}
        <div className="flex justify-start">
          <div className="relative h-[150px] w-[120px] md:h-[250px] md:w-[200px] lg:h-[300px] lg:w-[240px]">
            <Image
              src="/images/woman-silhouette.png"
              alt="Solo SHE silhouette"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 120px, 240px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
