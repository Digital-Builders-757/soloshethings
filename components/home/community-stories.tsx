/**
 * A Global Community of Solo SHEs
 * 
 * Two-column: 25% image left, 75% text right
 * Earth globe image on left
 */

import Image from "next/image"

export function CommunityStories() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[1fr_3fr] items-center gap-4 px-5 md:gap-10 md:px-8">
        {/* Left: Earth globe image */}
        <div className="flex justify-center">
          <div className="relative h-[100px] w-[100px] md:h-[200px] md:w-[200px] lg:h-[250px] lg:w-[250px]">
            <Image
              src="/images/earth-globe.png"
              alt="Global community"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100px, 250px"
            />
          </div>
        </div>

        {/* Right: Text content */}
        <div className="text-left">
          <h2 className="text-lg font-bold text-[#df4915] md:text-2xl lg:text-[2rem]">
            A Global Community of Solo SHEs
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5563] md:mt-4 md:text-base">
            From Tokyo to Lisbon, from Cape Town to Reykjavik—Solo SHEs are exploring every corner of the globe. Join thousands of women who have discovered the transformative power of traveling alone.
          </p>
        </div>
      </div>
    </section>
  )
}
