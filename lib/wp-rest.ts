/**
 * WordPress REST API Client
 * 
 * Server-only WordPress content fetching
 * Uses ISR with revalidation tags
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 */

import "server-only";

import { WpPost, WpPostListParams, WpPostListResponse } from "./wp-types";

const WP_URL = process.env.WP_URL;

// Allow build to succeed without WP_URL (will fail at runtime)
// This prevents build failures when env vars aren't set
const WP_API_BASE = WP_URL ? `${WP_URL}/wp-json/wp/v2` : "";

/**
 * Get WordPress posts list
 * 
 * @param params - Query parameters (page, perPage, category, tag, search)
 * @returns Array of WordPress posts
 */
export async function getWpPosts(
  params: WpPostListParams = {}
): Promise<WpPostListResponse> {
  if (!WP_URL) {
    throw new Error("WP_URL environment variable is required");
  }

  const { page = 1, perPage = 10, category, tag, search } = params;

  const searchParams = new URLSearchParams({
    _embed: "1",
    per_page: perPage.toString(),
    page: page.toString(),
  });

  if (category) {
    searchParams.append("categories", category.toString());
  }

  if (tag) {
    searchParams.append("tags", tag.toString());
  }

  if (search) {
    searchParams.append("search", search);
  }

  const url = `${WP_API_BASE}/posts?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // 1 hour ISR
        tags: [`posts`, `posts:page:${page}`],
      },
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch WordPress posts: ${error.message}`);
    }
    throw new Error("Failed to fetch WordPress posts: Unknown error");
  }
}

/**
 * Get WordPress post by slug
 * 
 * @param slug - Post slug
 * @returns WordPress post or null if not found
 */
export async function getWpPostBySlug(slug: string): Promise<WpPost | null> {
  if (!WP_URL) {
    throw new Error("WP_URL environment variable is required");
  }

  const searchParams = new URLSearchParams({
    _embed: "1",
    slug: slug,
  });

  const url = `${WP_API_BASE}/posts?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600, // 1 hour ISR
        tags: [`posts`, `post:${slug}`],
      },
    });

    if (!response.ok) {
      throw new Error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
    }

    const posts = await response.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      return null;
    }

    return posts[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch WordPress post by slug: ${error.message}`
      );
    }
    throw new Error("Failed to fetch WordPress post by slug: Unknown error");
  }
}

