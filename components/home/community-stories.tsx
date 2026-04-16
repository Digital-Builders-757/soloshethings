import Image from "next/image"
import Link from "next/link"
import { communityStories } from "@/lib/data"

export function CommunityStories() {
  return (
    <section className="bg-brand-blue py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD0A9]">
            Real Travelers, Real Stories
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#FFD0A9] md:text-4xl lg:text-5xl text-balance">
            Community Solo Stories
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#FFD0A9]" />
        </div>

        {/* Story Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {communityStories.map((story) => (
            <Link
              key={story.id}
              href={`/community/stories/${story.id}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              {/* Image */}
              <div className="relative h-[260px] overflow-hidden">
                <Image
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-brand-blue/70 px-4 py-3 backdrop-blur-sm">
                  <h3 className="font-serif text-lg font-semibold text-[#FFD0A9]">
                    {story.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="line-clamp-3 text-sm leading-relaxed text-[#FFD0A9]/80">
                  {story.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-coral/30" />
                  <p className="text-sm font-medium text-white">
                    {story.author.name}
                    <span className="block text-xs text-white/60">{story.author.location}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right: Text content */}
        <div className="text-left">
          <h2 className="text-lg font-bold text-[#df4915] md:text-2xl lg:text-[2rem]">
            A Global Community of Solo SHEs
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5563] md:mt-4 md:text-base">
            From Tokyo to Lisbon, from Cape Town to Reykjavik—Solo SHEs are exploring every corner of the globe. Join thousands of women who have discovered the transformative power of traveling alone.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            Join the Community
          </Link>
        </div>
      </div>
    </section>
  )
}
