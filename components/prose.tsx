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
      className={`prose prose-lg prose-headings:font-serif prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-strong:font-semibold prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-img:rounded-xl prose-img:shadow-lg prose-hr:border-border max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}