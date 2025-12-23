/**
 * Prose Component
 * 
 * Canonical HTML renderer for WordPress content
 * Sanitizes HTML before rendering
 * Server Component
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 */

import { sanitizeHtml } from "@/lib/sanitize";

type ProseProps = {
  html: string;
  className?: string;
};

/**
 * Render sanitized HTML content
 * 
 * @param html - HTML string to render (will be sanitized)
 * @param className - Additional CSS classes
 */
export function Prose({ html, className = "" }: ProseProps) {
  const sanitized = sanitizeHtml(html);

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

