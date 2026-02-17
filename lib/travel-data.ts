/**
 * Travel Data Model
 *
 * Static travel entries mapping Sharon's visited locations to blog post slugs.
 * Each entry provides geocoordinates for 3D globe markers and metadata for
 * the trip list sidebar.
 *
 * Future: migrate to a Supabase `travel_locations` table with lat/lng columns
 * or WordPress custom fields via ACF plugin.
 */

export interface TravelEntry {
  /** Unique identifier */
  id: string
  /** Blog post / trip title */
  title: string
  /** Human-readable location label (city, country) */
  location: string
  /** Latitude for globe marker placement */
  latitude: number
  /** Longitude for globe marker placement */
  longitude: number
  /** Cover image URL */
  image: string
  /** WordPress blog post slug — links to /blog/[slug] */
  slug: string
  /** ISO date string of the trip */
  date: string
  /** Short excerpt for preview cards */
  excerpt: string
  /** Continent grouping for optional filtering */
  continent: "Africa" | "Asia" | "Europe" | "North America" | "South America" | "Oceania"
}

/**
 * Sharon's travel entries.
 * Add new trips here — they automatically appear on the globe and trip list.
 */
export const travelEntries: TravelEntry[] = [
  {
    id: "trip-iceland",
    title: "Iceland's Northern Lights Adventure",
    location: "Reykjavik, Iceland",
    latitude: 64.1466,
    longitude: -21.9426,
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop",
    slug: "iceland-northern-lights-adventure",
    date: "2025-06-15",
    excerpt: "Chasing the aurora borealis across Iceland's volcanic landscapes as a solo female traveler.",
    continent: "Europe",
  },
  {
    id: "trip-bangkok",
    title: "Bangkok's Hidden Gems",
    location: "Bangkok, Thailand",
    latitude: 13.7563,
    longitude: 100.5018,
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop",
    slug: "bangkok-hidden-gems",
    date: "2025-05-20",
    excerpt: "Vibrant street markets, serene temples, and authentic Thai cuisine off the beaten path.",
    continent: "Asia",
  },
  {
    id: "trip-bali",
    title: "Bali's Spiritual Retreats",
    location: "Ubud, Bali",
    latitude: -8.5069,
    longitude: 115.2625,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    slug: "bali-spiritual-retreats",
    date: "2025-04-10",
    excerpt: "Finding peace in Bali's rice terraces, ancient temples, and wellness retreats.",
    continent: "Asia",
  },
  {
    id: "trip-cape-town",
    title: "Cape Town: Where Two Oceans Meet",
    location: "Cape Town, South Africa",
    latitude: -33.9249,
    longitude: 18.4241,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop",
    slug: "cape-town-two-oceans",
    date: "2025-03-05",
    excerpt: "Table Mountain, the Cape of Good Hope, and vibrant Bo-Kaap — a solo traveler's paradise.",
    continent: "Africa",
  },
  {
    id: "trip-lisbon",
    title: "Lisbon on a Shoestring",
    location: "Lisbon, Portugal",
    latitude: 38.7223,
    longitude: -9.1393,
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop",
    slug: "lisbon-on-a-shoestring",
    date: "2025-02-14",
    excerpt: "Pastel-colored tiles, tram 28, and affordable pastel de nata around every corner.",
    continent: "Europe",
  },
  {
    id: "trip-tokyo",
    title: "Solo in Tokyo: A First-Timer's Guide",
    location: "Tokyo, Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
    slug: "solo-in-tokyo",
    date: "2025-01-20",
    excerpt: "Navigating the neon-lit streets, quiet shrines, and world-class ramen shops of Tokyo.",
    continent: "Asia",
  },
  {
    id: "trip-medellin",
    title: "Medellín: The City of Eternal Spring",
    location: "Medellín, Colombia",
    latitude: 6.2442,
    longitude: -75.5812,
    image: "https://images.unsplash.com/photo-1599413987323-b2b8db740f88?w=800&h=600&fit=crop",
    slug: "medellin-eternal-spring",
    date: "2024-12-01",
    excerpt: "From Comuna 13 to botanical gardens — Medellín's transformation is inspiring.",
    continent: "South America",
  },
  {
    id: "trip-marrakech",
    title: "Getting Lost in Marrakech's Medina",
    location: "Marrakech, Morocco",
    latitude: 31.6295,
    longitude: -7.9811,
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop",
    slug: "lost-in-marrakech-medina",
    date: "2024-11-10",
    excerpt: "Spice-scented souks, riad rooftops, and the magic of Jemaa el-Fnaa square at dusk.",
    continent: "Africa",
  },
  {
    id: "trip-sydney",
    title: "Sydney Beyond the Opera House",
    location: "Sydney, Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
    slug: "sydney-beyond-opera-house",
    date: "2024-10-05",
    excerpt: "Bondi to Coogee coastal walk, hidden beaches, and the best flat whites in the southern hemisphere.",
    continent: "Oceania",
  },
  {
    id: "trip-new-york",
    title: "New York: Solo in the City That Never Sleeps",
    location: "New York, USA",
    latitude: 40.7128,
    longitude: -74.006,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
    slug: "solo-new-york-city",
    date: "2024-09-15",
    excerpt: "Central Park mornings, Brooklyn bridge sunsets, and finding solitude in the world's busiest city.",
    continent: "North America",
  },
]
