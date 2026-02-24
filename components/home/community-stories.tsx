import Image from "next/image"
import Link from "next/link"
import { communityStories } from "@/lib/data"

export function CommunityStories() {
  return (
    <section className="bg-brand-blue py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-peach/30 bg-brand-peach/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-peach">
            Community
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-brand-peach md:text-4xl lg:text-5xl text-balance">
            Community Solo Stories
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-peach/70">
            Real stories from real solo female travelers
          </p>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand-peach" />
        </div>

        {/* Story Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {communityStories.map((story) => (
            <Link
              key={story.id}
              href={`/community/stories/${story.id}`}
              className="group overflow-hidden rounded-xl border border-brand-peach/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-lg"
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

        <div className="mt-12 text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-orange/90 hover:shadow-lg"
          >
            Read More Stories
          </Link>
        </div>
      </div>
    </section>
  )
}
