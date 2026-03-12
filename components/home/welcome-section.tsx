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
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-5 md:px-8 lg:grid-cols-[3fr_1fr]">
        {/* Left: Text content - right aligned */}
        <div className="text-center lg:text-right">
          <h2 className="text-2xl font-bold text-[#df4915] md:text-[2rem]">
            A Community Built for Solo SHEs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#4b5563] lg:ml-auto lg:mr-0">
            Connect with women who understand the joys and challenges of solo travel. Share your experiences, find travel buddies, and get inspired by stories from around the world.
          </p>
          <div className="mt-6 flex justify-center lg:justify-end">
            <Link
              href="/collections"
              className="inline-block rounded-full bg-[#df4915] px-6 py-3 text-base font-semibold text-white transition-all hover:bg-[#c4400f]"
            >
              Discover Solo Stories
            </Link>
          </div>
        </div>

        {/* Right: Woman silhouette image */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative h-[250px] w-[200px] md:h-[300px] md:w-[240px]">
            <Image
              src="/images/woman-silhouette.png"
              alt="Solo SHE silhouette"
              fill
              className="object-contain"
              sizes="240px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
