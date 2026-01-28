import Image from "next/image"
import Link from "next/link"
import { communityStories } from "@/lib/data"

export function CommunityStories() {
  return (
    <section className="bg-muted/50 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">Community Stories</h2>
          <p className="mt-4 text-lg text-muted-foreground">Real stories from real solo female travelers</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {communityStories.map((story) => (
            <Link key={story.id} href={`/community/stories/${story.id}`} className="group overflow-hidden rounded-lg bg-background shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-[300px] overflow-hidden md:h-[400px]">
                <Image src={story.image || "/placeholder.svg"} alt={story.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">{story.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{story.excerpt}</p>
                <p className="mt-4 text-sm italic text-muted-foreground">&mdash; {story.author.name}, {story.author.location}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/community" className="inline-block border border-foreground px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background">Read More Stories</Link>
        </div>
      </div>
    </section>
  )
}