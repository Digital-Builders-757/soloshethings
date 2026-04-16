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
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-brand-orange">Browse Collections</h1>
        
        {/* Filter UI Stub */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filter by Theme</h2>
          <div className="flex flex-wrap gap-3">
            {/* Tag filters - will be implemented with real data */}
            <button className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors">
              Safety Level
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Budget
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Wellness
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              First-Time Solo
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Destination Type
            </button>
            <button className="px-4 py-2 bg-neutral-200 text-neutral-900 rounded-lg hover:bg-neutral-300 transition-colors">
              Region
            </button>
          </div>
        </section>

        {/* Collection Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder collection cards */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-neutral-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Collection Name</h3>
              <p className="text-neutral-600 mb-4">
                Description of this collection theme...
              </p>
              <a
                href="/collections/safety-level"
                className="text-brand-orange hover:text-brand-orange/80 font-medium"
              >
                View Collection →
              </a>
            </div>
          </div>
          {/* Repeat placeholder cards */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-neutral-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Collection Name</h3>
              <p className="text-neutral-600 mb-4">
                Description of this collection theme...
              </p>
              <a
                href="/collections/budget"
                className="text-brand-orange hover:text-brand-orange/80 font-medium"
              >
                View All Posts
              </Link>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-video bg-neutral-200"></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Collection Name</h3>
              <p className="text-neutral-600 mb-4">
                Description of this collection theme...
              </p>
              <a
                href="/collections/wellness"
                className="text-brand-orange hover:text-brand-orange/80 font-medium"
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
