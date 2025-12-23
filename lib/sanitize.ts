/**
 * HTML Sanitization
 * 
 * Canonical sanitization helper for WordPress HTML content
 * Server-only usage
 * 
 * Uses sanitize-html for reliable server-side sanitization
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 */

import "server-only";
import sanitizeHtmlLib from "sanitize-html";

/**
 * Sanitize HTML content from WordPress
 * 
 * @param html - Raw HTML string from WordPress
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  return sanitizeHtmlLib(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "img",
      "figure",
      "figcaption",
      "div",
      "span",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      div: ["class", "id"],
      span: ["class", "id"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      a: ["http", "https", "mailto", "tel"],
      img: ["http", "https"],
    },
  });
}
