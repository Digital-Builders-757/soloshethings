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
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] py-24 md:py-32">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="mx-auto max-w-[800px] text-center">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                Solo SHEntries
              </span>
              <h1 className="mt-4 font-serif text-5xl font-bold leading-[0.95] text-brand-blue md:text-6xl lg:text-7xl">
                Browse by{" "}
                <span className="italic font-normal text-brand-orange">Collection</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#555]">
                Curated destination guides organized by what matters most to you -- safety, budget,
                wellness, adventure, and more. Every entry is reviewed and recommended by real solo
                female travelers.
              </p>
            </div>
          </div>
        </section>

        {/* Collection Grid */}
        <section className="bg-[#FFF8F3] py-24">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border-2 border-[#eee] bg-white transition-all hover:-translate-y-2 hover:border-brand-gold"
                >
                  {/* Image */}
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Icon Badge */}
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
                      <collection.icon className="h-5 w-5 text-brand-orange" />
                    </div>
                    {collection.featured && (
                      <span className="absolute right-4 top-4 rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold text-white shadow-md" style={{ transform: "rotate(4deg)" }}>
                        Featured
                      </span>
                    )}
                    {/* Bottom overlay info */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <h3 className="font-serif text-xl font-bold text-white">
                        {collection.title}
                      </h3>
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-blue">
                        {collection.count} places
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex-1 text-sm leading-relaxed text-[#555]">
                      {collection.description}
                    </p>

                    {/* Destination preview */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {collection.destinations.slice(0, 3).map((dest) => (
                        <span
                          key={dest}
                          className="inline-flex items-center gap-1 rounded-full bg-[#FFF8F3] px-3 py-1 text-xs font-medium text-brand-blue"
                        >
                          <MapPin className="h-3 w-3 text-brand-orange" />
                          {dest}
                        </span>
                      ))}
                      {collection.destinations.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-brand-peach/40 px-3 py-1 text-xs font-bold text-brand-orange">
                          +{collection.destinations.length - 3} more
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/collections/${collection.id}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-blue"
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
        <section className="py-24">
          <div className="mx-auto max-w-[1240px] px-8">
            <div className="mb-16 text-center">
              <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
                Popular Reads
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-brand-blue md:text-4xl">
                Trending SHEntries
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {featuredEntries.map((entry) => (
                <article
                  key={entry.title}
                  className="group overflow-hidden rounded-3xl border-2 border-[#eee] bg-white transition-all hover:-translate-y-2 hover:border-brand-gold"
                >
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={entry.image}
                      alt={entry.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold uppercase text-brand-orange">
                        {entry.location}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold leading-tight text-brand-blue">
                      {entry.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-4 text-xs text-[#666]">
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

            <div className="mt-16 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-orange px-8 py-3 text-sm font-bold uppercase tracking-wider text-brand-orange transition-all hover:bg-brand-orange hover:text-white"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-28 text-center text-white">
          <div className="relative z-10 mx-auto max-w-[1240px] px-8">
            <h2 className="font-serif text-4xl font-bold italic md:text-5xl lg:text-6xl">
              Have a Destination to Share?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Our collections grow through the voices of real travelers. Submit your own SHEntry and
              help fellow solo female travelers discover their next adventure.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-bold text-brand-orange transition-all hover:shadow-lg"
              >
                Submit a SHEntry
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
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
