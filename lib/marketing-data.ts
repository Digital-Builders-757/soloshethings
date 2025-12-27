/**
 * Marketing Data Functions
 * 
 * Placeholder functions for landing page data fetching
 * These will be replaced with real Supabase queries when tables are ready
 */

import 'server-only';

// Types
export interface Destination {
  id: string;
  name: string;
  location: string;
  country?: string;
  image_url?: string;
  description?: string;
  gradient_class?: string;
  featured: boolean;
}

export interface Story {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  author?: {
    username: string;
    avatar_url?: string;
  };
  published_at: string;
}

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

export interface Event {
  id: string;
  title: string;
  type: 'Virtual' | 'In-Person';
  date: string;
  location?: string;
  attending_count: number;
  image_url?: string;
}

/**
 * Get featured destinations for hero carousel
 * TODO: Replace with Supabase query when destinations table exists
 */
export async function getFeaturedDestinations(): Promise<Destination[]> {
  // Placeholder: Return mock data with Unsplash images
  // Future: SELECT * FROM destinations WHERE featured = true LIMIT 4
  // Using Unsplash Source API for curated travel images
  return [
    {
      id: '1',
      name: 'Lisbon',
      location: 'Portugal',
      country: 'Portugal',
      image_url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=1000&fit=crop&q=80',
      gradient_class: 'from-blue-600 to-orange-500',
      featured: true,
    },
    {
      id: '2',
      name: 'Kyoto',
      location: 'Japan',
      country: 'Japan',
      image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=1000&fit=crop&q=80',
      gradient_class: 'from-amber-500 to-rose-400',
      featured: true,
    },
    {
      id: '3',
      name: 'Reykjavik',
      location: 'Iceland',
      country: 'Iceland',
      image_url: 'https://images.unsplash.com/photo-1504829857797-ddff9c9e7f3b?w=800&h=1000&fit=crop&q=80',
      gradient_class: 'from-purple-600 to-pink-500',
      featured: true,
    },
    {
      id: '4',
      name: 'Barcelona',
      location: 'Spain',
      country: 'Spain',
      image_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=1000&fit=crop&q=80',
      gradient_class: 'from-green-500 to-emerald-400',
      featured: true,
    },
  ];
}

/**
 * Get latest stories for stories section
 * TODO: Replace with Supabase query from community_posts table
 */
export async function getLatestStories(limit = 6): Promise<Story[]> {
  // Placeholder: Return mock data
  // Future: SELECT id, title, excerpt, image_url, author_id, published_at 
  //         FROM community_posts 
  //         WHERE status = 'published' AND privacy_level = 'public'
  //         ORDER BY published_at DESC LIMIT $limit
  return [
    {
      id: '1',
      title: 'Finding My Rhythm in Barcelona',
      excerpt: 'A week of mornings at the same café, evenings watching the sunset.',
      image_url: '/placeholder-story-1.png',
      author: { username: 'Sarah M.' },
      published_at: '2024-03-15',
    },
    {
      id: '2',
      title: 'A Safe Haven in Tokyo',
      excerpt: 'The quiet bookstore that became my daily ritual.',
      image_url: '/placeholder-story-2.png',
      author: { username: 'Jessica K.' },
      published_at: '2024-03-10',
    },
    {
      id: '3',
      title: 'Morning Walks in Reykjavik',
      excerpt: 'How I found peace in the early hours, exploring safely on my own.',
      image_url: '/placeholder-story-3.png',
      author: { username: 'Maria L.' },
      published_at: '2024-03-05',
    },
  ].slice(0, limit);
}

/**
 * Get latest blog posts
 * TODO: Replace with WordPress API or Supabase query
 */
export async function getLatestBlogPosts(limit = 6): Promise<BlogPost[]> {
  // Placeholder: Return mock data
  // Future: Fetch from WordPress API or blog_posts table
  return [
    {
      id: '1',
      title: 'Solo Travel Safety Tips',
      slug: 'solo-travel-safety-tips',
      excerpt: 'Essential safety tips for solo female travelers.',
      category: 'Safety',
      image_url: '/placeholder-blog-1.png',
      published_at: '2024-03-20',
    },
    {
      id: '2',
      title: 'Budget Travel Planning',
      slug: 'budget-travel-planning',
      excerpt: 'How to plan an amazing trip on a budget.',
      category: 'Budget',
      image_url: '/placeholder-blog-2.png',
      published_at: '2024-03-18',
    },
    {
      id: '3',
      title: 'Travel Meditation & Wellness',
      slug: 'travel-meditation-wellness',
      excerpt: 'Staying centered while exploring the world.',
      category: 'Wellness',
      image_url: '/placeholder-blog-3.png',
      published_at: '2024-03-15',
    },
  ].slice(0, limit);
}

/**
 * Get community statistics
 * TODO: Replace with aggregate queries from Supabase
 */
export async function getCommunityStats(): Promise<CommunityStats> {
  // Placeholder: Return mock data
  // Future: Aggregate queries from profiles, community_posts, etc.
  return {
    active_members: 10000,
    countries: 152,
    stories_shared: 5891,
    connections_made: 15432,
  };
}

/**
 * Get upcoming events
 * TODO: Replace with Supabase query when events table is ready
 */
export async function getUpcomingEvents(limit = 3): Promise<Event[]> {
  // Placeholder: Return mock data
  // Future: SELECT * FROM events 
  //         WHERE event_date >= NOW() AND status = 'published'
  //         ORDER BY event_date ASC LIMIT $limit
  const events: Event[] = [
    {
      id: '1',
      title: 'Solo Travel Safety Workshop',
      type: 'Virtual' as const,
      date: '2024-03-15',
      attending_count: 156,
    },
    {
      id: '2',
      title: 'Community Meetup: Central Park',
      type: 'In-Person' as const,
      date: '2024-03-22',
      location: 'Central Park, NY',
      attending_count: 42,
    },
    {
      id: '3',
      title: 'Budget Travel Planning Session',
      type: 'Virtual' as const,
      date: '2024-04-05',
      attending_count: 89,
    },
  ];
  return events.slice(0, limit);
}

