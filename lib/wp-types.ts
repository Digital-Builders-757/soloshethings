/**
 * WordPress Types
 * 
 * Minimal types for WordPress REST API responses
 * Server-only usage
 */

import "server-only";

export type WpPost = {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
      };
    }>;
    author?: Array<{
      name: string;
      slug: string;
    }>;
  };
};

export type WpPostListResponse = WpPost[];

export type WpPostListParams = {
  page?: number;
  perPage?: number;
  category?: number;
  tag?: number;
  search?: string;
};

