import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import {
  Shield,
  Wallet,
  Heart,
  Compass,
  Mountain,
  Palette,
  ArrowRight,
  MapPin,
  Star,
  Clock,
} from "lucide-react"

const collections = [
  {
    id: "safest-destinations",
    title: "Safest Destinations",
    description:
      "Hand-picked destinations with the highest safety ratings for solo female travelers. Each location has been personally visited and vetted by our community.",
    image: "/images/collection-safety.jpg",
    icon: Shield,
    count: 24,
    featured: true,
    destinations: ["Tokyo", "Reykjavik", "Copenhagen", "Singapore", "Lisbon"],
  },
  {
    id: "budget-friendly",
    title: "Budget-Friendly Getaways",
    description:
      "Incredible solo travel experiences that will not break the bank. Hostels, street food, free attractions, and tips from travelers who have done it on a shoestring.",
    image: "/images/collection-budget.jpg",
    icon: Wallet,
    count: 18,
    featured: false,
    destinations: ["Bangkok", "Medellín", "Budapest", "Hanoi", "Marrakech"],
  },
  {
    id: "wellness-retreats",
    title: "Wellness & Retreats",
    description:
      "Yoga retreats, spa escapes, meditation centers, and healing journeys. Destinations where you can nourish your body, mind, and spirit.",
    image: "/images/collection-wellness.jpg",
    icon: Heart,
    count: 15,
    featured: false,
    destinations: ["Ubud, Bali", "Rishikesh", "Sedona", "Tulum", "Koh Samui"],
  },
  {
    id: "first-time-solo",
    title: "First-Time Solo Traveler",
    description:
      "New to solo travel? Start here. These destinations are welcoming, easy to navigate, English-friendly, and perfect for building your confidence.",
    image: "/images/collection-first-time.jpg",
    icon: Compass,
    count: 20,
    featured: true,
    destinations: ["London", "Amsterdam", "Melbourne", "Vancouver", "Dublin"],
  },
  {
    id: "adventure-seekers",
    title: "Adventure & Outdoors",
    description:
      "For the thrill-seekers and nature lovers. Hiking, diving, surfing, and wildlife encounters in some of the most stunning landscapes on Earth.",
    image: "/images/collection-adventure.jpg",
    icon: Mountain,
    count: 22,
    featured: false,
    destinations: ["Queenstown", "Patagonia", "Costa Rica", "Norway", "Nepal"],
  },
  {
    id: "cultural-immersion",
    title: "Cultural Immersion",
    description:
      "Go beyond the tourist trail. Cooking classes, homestays, local festivals, and authentic cultural experiences that create lasting memories.",
    image: "/images/collection-culture.jpg",
    icon: Palette,
    count: 16,
    featured: false,
    destinations: ["Kyoto", "Fez", "Oaxaca", "Jaipur", "Havana"],
  },
]

const featuredEntries = [
  {
    title: "3 Days in Lisbon: A Solo Safety Guide",
    location: "Lisbon, Portugal",
    rating: 4.9,
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=400&fit=crop",
  },
  {
    title: "Budget Bangkok: Under $30 a Day",
    location: "Bangkok, Thailand",
    rating: 4.8,
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",
  },
  {
    title: "Finding Peace in Bali Solo",
    location: "Ubud, Indonesia",
    rating: 4.9,
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
  },
]

export default function CollectionsPage() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] py-14 md:py-24 lg:py-32">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="mx-auto max-w-[800px] text-center">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                Solo SHEntries
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[0.95] text-brand-blue sm:text-5xl md:text-6xl lg:text-7xl">
                Browse by{" "}
                <span className="italic font-normal text-brand-orange">Collection</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#555] md:mt-6 md:text-lg">
                Curated destination guides organized by what matters most to you -- safety, budget,
                wellness, adventure, and more. Every entry is reviewed and recommended by real solo
                female travelers.
              </p>
            </div>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="bg-[#FFF8F3] py-14 md:py-24">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="grid gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border-2 border-[#eee] bg-white transition-all hover:-translate-y-2 hover:border-brand-gold md:rounded-3xl"
                >
                  {/* Image */}
                  <div className="relative h-[180px] overflow-hidden sm:h-[200px] md:h-[240px]">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Icon Badge */}
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 md:left-4 md:top-4 md:h-10 md:w-10">
                      <collection.icon className="h-4 w-4 text-brand-orange md:h-5 md:w-5" />
                    </div>
                    {collection.featured && (
                      <span className="absolute right-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-[0.65rem] font-bold text-white shadow-md md:right-4 md:top-4 md:px-4 md:py-1.5 md:text-xs" style={{ transform: "rotate(4deg)" }}>
                        Featured
                      </span>
                    )}
                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between md:bottom-4 md:left-4 md:right-4">
                      <h3 className="font-serif text-base font-bold text-white md:text-xl">
                        {collection.title}
                      </h3>
                      <span className="shrink-0 rounded-full bg-white/90 px-2.5 py-0.5 text-[0.65rem] font-bold text-brand-blue md:px-3 md:py-1 md:text-xs">
                        {collection.count} places
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4 md:p-6">
                    <p className="flex-1 text-sm leading-relaxed text-[#555]">
                      {collection.description}
                    </p>

                    {/* Destination preview */}
                    <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
                      {collection.destinations.slice(0, 3).map((dest) => (
                        <span
                          key={dest}
                          className="inline-flex items-center gap-1 rounded-full bg-[#FFF8F3] px-2.5 py-0.5 text-[0.65rem] font-medium text-brand-blue md:px-3 md:py-1 md:text-xs"
                        >
                          <MapPin className="h-2.5 w-2.5 text-brand-orange md:h-3 md:w-3" />
                          {dest}
                        </span>
                      ))}
                      {collection.destinations.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-brand-peach/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-brand-orange md:px-3 md:py-1 md:text-xs">
                          +{collection.destinations.length - 3} more
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/collections/${collection.id}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-blue md:mt-4"
                    >
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Entries */}
        <section className="py-14 md:py-24">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            <div className="mb-10 text-center md:mb-16">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                Popular Reads
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-brand-blue sm:text-3xl md:text-4xl">
                Trending SHEntries
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
              {featuredEntries.map((entry) => (
                <article
                  key={entry.title}
                  className="group overflow-hidden rounded-2xl border-2 border-[#eee] bg-white transition-all hover:-translate-y-2 hover:border-brand-gold md:rounded-3xl"
                >
                  <div className="relative h-[180px] overflow-hidden md:h-[240px]">
                    <Image
                      src={entry.image}
                      alt={entry.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold uppercase text-brand-orange">
                        {entry.location}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-bold leading-tight text-brand-blue md:text-xl">
                      {entry.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-4 text-xs text-[#666] md:mt-3">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                        {entry.rating}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entry.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center md:mt-16">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-orange px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-orange transition-all hover:bg-brand-orange hover:text-white md:px-8"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-16 text-center text-white md:py-28">
          <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-8">
            <h2 className="font-serif text-3xl font-bold italic sm:text-4xl md:text-5xl lg:text-6xl">
              Have a Destination to Share?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 md:mt-6 md:text-lg">
              Our collections grow through the voices of real travelers. Submit your own SHEntry and
              help fellow solo female travelers discover their next adventure.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10 md:gap-6">
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-orange transition-all hover:shadow-lg sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Submit a SHEntry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white/10 sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
