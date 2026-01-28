/**
 * Marketing Data Functions
 * 
 * Data from SOLOSHETHINGS_CODE_PACKAGE integrated
 * These will be replaced with real Supabase queries when tables are ready
 */

import 'server-only';

// Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image_url?: string;
  category?: string;
  published_at: string;
}

export interface CommunityStats {
  active_members: number;
  countries: number;
  stories_shared: number;
  connections_made: number;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isFounder: boolean;
}

export interface CommunityStory {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: {
    name: string;
    location: string;
    avatar?: string;
  };
  publishedAt: string;
}

// Site info from package
export const siteInfo = {
  name: "SoloSheThings",
  tagline: "Safe Travels for Solo Female Travelers",
  description: "A community dedicated to empowering solo female travelers with guides, safety tips, and inspiring stories from fearless women around the world."
};

// Founder data from package
export const founder: Author = {
  id: "founder-1",
  name: "Solo She",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  bio: "Hey! I'm the founder of SoloSheThings. After years of traveling solo, I've discovered that the world is much more welcoming than we're led to believe. My mission is to empower women to explore the world confidently and safely, sharing my adventures and creating a community where solo female travelers can connect and inspire each other.",
  isFounder: true
};

/**
 * Get latest blog posts - Using data from SOLOSHETHINGS_CODE_PACKAGE
 */
export async function getLatestBlogPosts(limit = 6): Promise<BlogPost[]> {
  const posts: BlogPost[] = [
    {
      id: "post-1",
      title: "Solo She Things – Entry 12",
      slug: "solo-she-things-entry-12",
      excerpt: "Dear Solo SHE, I can't say enough good things about Portugal. It was on this trip, my second to this beautiful country with incredible landscapes that...",
      category: "Adventure",
      image_url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=1000&fit=crop",
      published_at: "2026-01-19",
    },
    {
      id: "post-2",
      title: "Hello world!",
      slug: "hello-world",
      excerpt: "Welcome to SoloSheThings. This is your introduction to safe travels for solo female travelers!",
      category: "Announcement",
      image_url: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=1000&fit=crop",
      published_at: "2026-01-01",
    },
  ];
  return posts.slice(0, limit);
}

/**
 * Get community statistics
 */
export async function getCommunityStats(): Promise<CommunityStats> {
  return {
    active_members: 10000,
    countries: 152,
    stories_shared: 5891,
    connections_made: 15432,
  };
}

/**
 * Get community stories - Using data from SOLOSHETHINGS_CODE_PACKAGE
 */
export async function getCommunityStories(limit = 3): Promise<CommunityStory[]> {
  const stories: CommunityStory[] = [
    {
      id: "story-1",
      title: "My First Solo Trip to Iceland",
      excerpt: "I was nervous about traveling alone, but Iceland turned out to be the perfect destination for my first solo adventure.",
      image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=600&h=400&fit=crop",
      author: {
        name: "Sarah M.",
        location: "New York",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
      },
      publishedAt: "2025-01-12"
    },
    {
      id: "story-2",
      title: "Finding Confidence in Thailand",
      excerpt: "Thailand taught me that I'm stronger than I thought. From navigating Bangkok's markets to exploring ancient temples, every day was a new adventure.",
      image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop",
      author: {
        name: "Emma L.",
        location: "London",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop"
      },
      publishedAt: "2025-01-08"
    },
    {
      id: "story-3",
      title: "A Month in Bali Changed Everything",
      excerpt: "Spending a month in Bali solo was transformative. I found peace, made lifelong friends, and discovered a version of myself I didn't know existed.",
      image: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=600&h=400&fit=crop",
      author: {
        name: "Jessica K.",
        location: "Sydney",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop"
      },
      publishedAt: "2025-01-03"
    }
  ];
  return stories.slice(0, limit);
}