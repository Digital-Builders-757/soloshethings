import Image from "next/image"
import Link from "next/link"
import { PatternSection } from "@/components/ui/pattern-section"

const storyCards = [
  {
    title: "A first solo sunrise in the Atlas Mountains",
    location: "Marrakech, Morocco",
    image: "/images/collection-adventure.jpg",
    href: "/collections",
    accent: "xl:mt-10",
  },
  {
    title: "What I learned slowing down in a spice market",
    location: "Fez, Morocco",
    image: "/images/collection-culture.jpg",
    href: "/blog",
    accent: "",
  },
  {
    title: "The rituals that made my trip feel safe and soft",
    location: "Lisbon, Portugal",
    image: "/images/collection-safety.jpg",
    href: "/collections",
    accent: "xl:mt-16",
  },
  {
    title: "How women travelers are building community worldwide",
    location: "Community journal",
    image: "/client-travel/garden-tiled-staircase.JPG",
    href: "/blog",
    accent: "xl:mt-6",
  },
]

export function WelcomeSection() {
  return (
    <PatternSection tone="cream" patternTop className="py-16 md:py-24" id="stories">
      <div className="container mx-auto px-6 pt-10 md:pt-16">
        <div className="flex flex-col gap-5 md:max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a14b24]">
            Real stories from solo SHEs
          </p>
          <h2 className="font-serif text-4xl font-bold leading-tight text-[#7a331b] md:text-5xl">
            Editorial travel stories with warmth, honesty, and hard-won confidence.
          </h2>
          <p className="max-w-xl text-base leading-7 text-[#6d5849] md:text-lg">
            Browse destinations, journal-style reflections, and practical guidance shaped by women who have already taken the leap.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {storyCards.map((story, index) => (
            <Link
              key={story.title}
              href={story.href}
              className={`group relative isolate flex min-h-[24rem] overflow-hidden rounded-[2rem] border border-[#ebd7bf] bg-[#e5d8c6] shadow-[0_24px_50px_rgba(122,51,27,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(122,51,27,0.14)] ${story.accent}`}
            >
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b14]/86 via-[#2d1b14]/22 to-transparent" aria-hidden="true" />

              <div className="relative mt-auto flex w-full flex-col gap-3 p-6 text-white md:p-7">
                <div className="flex items-center justify-between gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#f7e8be]">
                  <span>{story.location}</span>
                  <span>0{index + 1}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold leading-tight text-[#fff7e6]">
                  {story.title}
                </h3>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#fab642]">
                  Read story
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PatternSection>
  )
}
