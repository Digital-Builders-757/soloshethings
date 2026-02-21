export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    location: string
    country: string
    continent: string
    image: string
    author: Author
    publishedAt: string
    readTime: number
    featured: boolean
    category: string
    tags: string[]
    visitedByOwner: boolean
  }
  
  export interface Author {
    id: string
    name: string
    avatar: string
    bio: string
    isFounder: boolean
  }
  
  export interface CommunityStory {
    id: string
    title: string
    excerpt: string
    content: string
    image: string
    author: {
      name: string
      location: string
      avatar?: string
    }
    publishedAt: string
  }
  
  export interface Destination {
    id: string
    name: string
    country: string
    continent: string
    image: string
    postCount: number
    safetyRating: number
  }
  
  export const founder: Author = {
    id: "founder-1",
    name: "Alexandra Rivers",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Hey! I'm Alexandra, the founder of SoloSheThings. After leaving my corporate job in 2019, I've traveled to 45+ countries solo and discovered that the world is much more welcoming than we're led to believe. My mission is to empower women to explore the world confidently and safely.",
    isFounder: true
  }
  
  export const blogPosts: BlogPost[] = [
    {
      id: "post-1",
      title: "Iceland's Northern Lights Adventure",
      slug: "iceland-northern-lights-adventure",
      excerpt: "Experience the magic of the aurora borealis while exploring Iceland's stunning landscapes as a solo female traveler.",
      content: "Full content here...",
      location: "Reykjavik",
      country: "Iceland",
      continent: "Europe",
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=1000&fit=crop",
      author: founder,
      publishedAt: "2025-01-15",
      readTime: 8,
      featured: true,
      category: "Adventure",
      tags: ["northern lights", "iceland", "winter travel", "nature"],
      visitedByOwner: true
    },
    {
      id: "post-2",
      title: "Bangkok's Hidden Gems",
      slug: "bangkok-hidden-gems",
      excerpt: "Discover the vibrant street markets, serene temples, and authentic experiences that make Bangkok perfect for solo exploration.",
      content: "Full content here...",
      location: "Bangkok",
      country: "Thailand",
      continent: "Asia",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=1000&fit=crop",
      author: founder,
      publishedAt: "2025-01-10",
      readTime: 12,
      featured: true,
      category: "City Guide",
      tags: ["thailand", "bangkok", "street food", "temples"],
      visitedByOwner: true
    },
    {
      id: "post-3",
      title: "Bali's Spiritual Retreats",
      slug: "bali-spiritual-retreats",
      excerpt: "Find peace and empowerment in Bali's lush rice terraces, ancient temples, and wellness retreats designed for solo travelers.",
      content: "Full content here...",
      location: "Ubud",
      country: "Indonesia",
      continent: "Asia",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=1000&fit=crop",
      author: founder,
      publishedAt: "2025-01-05",
      readTime: 10,
      featured: true,
      category: "Wellness",
      tags: ["bali", "wellness", "yoga", "spiritual"],
      visitedByOwner: true
    }
  ]
  
  export const communityStories: CommunityStory[] = [
    {
      id: "story-1",
      title: "My First Solo Trip to Iceland",
      excerpt: "I was nervous about traveling alone, but Iceland turned out to be the perfect destination for my first solo adventure.",
      content: "Full story content...",
      image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&h=400&fit=crop",
      author: { name: "Sarah M.", location: "New York" },
      publishedAt: "2025-01-12"
    },
    {
      id: "story-2",
      title: "Finding Confidence in Thailand",
      excerpt: "Thailand taught me that I'm stronger than I thought. From navigating Bangkok's markets to exploring ancient temples.",
      content: "Full story content...",
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop",
      author: { name: "Emma L.", location: "London" },
      publishedAt: "2025-01-08"
    },
    {
      id: "story-3",
      title: "A Month in Bali Changed Everything",
      excerpt: "Spending a month in Bali solo was transformative. I found peace, made lifelong friends, and discovered a version of myself.",
      content: "Full story content...",
      image: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&h=400&fit=crop",
      author: { name: "Jessica K.", location: "Sydney" },
      publishedAt: "2025-01-03"
    }
  ]
  
  export const heroImages = [
    { id: 1, src: "/images/hero-1.jpg", alt: "Solo traveler in front of Belem Tower in Lisbon, Portugal", caption: "Lisbon, Portugal" },
    { id: 2, src: "/images/hero-2.jpeg", alt: "Solo traveler at the Reichstag building in Berlin, Germany", caption: "Berlin, Germany" },
    { id: 3, src: "/images/hero-3.jpeg", alt: "Solo traveler watching elephants at sunset from a boat in Botswana", caption: "Okavango Delta, Botswana" },
    { id: 4, src: "/images/hero-4.jpg", alt: "Solo traveler posing with a bronze sculpture at night", caption: "Exploring the World" },
  ]
  
  export const categories = [
    { id: "all", name: "All Posts" },
    { id: "adventure", name: "Adventure" },
    { id: "city-guide", name: "City Guides" },
    { id: "wellness", name: "Wellness" },
    { id: "safety-tips", name: "Safety Tips" }
  ]
  
  export const continents = [
    { id: "all", name: "All Destinations" },
    { id: "europe", name: "Europe" },
    { id: "asia", name: "Asia" },
    { id: "americas", name: "Americas" },
    { id: "africa", name: "Africa" }
  ]
