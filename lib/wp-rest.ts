/**
 * WordPress REST API Client
 * 
 * Server-only WordPress content fetching
 * Uses ISR with revalidation tags
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 * 
 * NOTE: WordPress integration is OPTIONAL in Phase 1.
 * When WP_URL is not configured, functions return safe fallbacks.
 */

import "server-only";

import { WpPost, WpPostListParams, WpPostListResponse } from "./wp-types";
import { getWordpressBaseUrl } from "./wp-env";

const WP_BASE_URL = getWordpressBaseUrl();

// Allow build to succeed without WordPress URL configured
// This prevents build failures when env vars aren't set
const WP_API_BASE = WP_BASE_URL ? `${WP_BASE_URL}/wp-json/wp/v2` : "";

/**
 * Check if WordPress is configured
 * 
 * @returns true if WP_URL is set, false otherwise
 */
export function isWordPressConfigured(): boolean {
  return !!WP_BASE_URL;
}

/**
 * Get WordPress posts list
 * 
 * @param params - Query parameters (page, perPage, category, tag, search)
 * @returns Array of WordPress posts (empty array if WP not configured)
 */
export async function getWpPosts(
  params: WpPostListParams = {}
): Promise<WpPostListResponse> {
  if (!WP_BASE_URL) {
    // WordPress not configured - return empty array (safe fallback)
    console.warn(
      "WordPress not configured: WORDPRESS_URL/WP_URL environment variable is missing"
    );
    return [];
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
        // Tag standards: Lists MUST tag 'posts' (required) + 'posts:page:${page}' (optional, for granular invalidation)
        // See docs/contracts/WORDPRESS_CONTENT_CONTRACT.md for canonical tag standards
        tags: [`posts`, `posts:page:${page}`],
      },
    });

    if (!response.ok) {
      // Log error server-side, return empty array (graceful degradation)
      console.error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const posts = await response.json();
    return posts;
  } catch (error) {
    // Log error server-side, return empty array (graceful degradation)
    console.error("Failed to fetch WordPress posts:", error);
    return [];
  }
}

/**
 * Get WordPress post by slug
 * 
 * @param slug - Post slug
 * @returns WordPress post or null if not found or WP not configured
 */
export async function getWpPostBySlug(slug: string): Promise<WpPost | null> {
  if (!WP_BASE_URL) {
    // WordPress not configured - return null (safe fallback)
    console.warn(
      "WordPress not configured: WORDPRESS_URL/WP_URL environment variable is missing"
    );
    return null;
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
        // Tag standards: Details MUST tag 'posts' (required) + 'post:${slug}' (required)
        // See docs/contracts/WORDPRESS_CONTENT_CONTRACT.md for canonical tag standards
        tags: [`posts`, `post:${slug}`],
      },
    });

    if (!response.ok) {
      // Log error server-side, return null (graceful degradation)
      console.error(
        `WordPress API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const posts = await response.json();

    if (!Array.isArray(posts) || posts.length === 0) {
      return null;
    }

    return posts[0];
  } catch (error) {
    // Log error server-side, return null (graceful degradation)
    console.error("Failed to fetch WordPress post by slug:", error);
    return null;
  }
}

