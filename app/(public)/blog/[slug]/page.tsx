/**
 * Blog Post Detail Page
 * 
 * WordPress editorial content (public, no auth required)
 * ISR with webhook revalidation on WordPress publish
 * Server-side fetch only
 * Content sanitization via Prose component
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 * 
 * NOTE: WordPress integration is OPTIONAL in Phase 1.
 * Returns 404 when WP_URL is not configured or post not found.
 */

import { getWpPostBySlug, isWordPressConfigured } from "@/lib/wp-rest";
import { Prose } from "@/components/prose";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // If WordPress not configured, return generic metadata
  if (!isWordPressConfigured()) {
    return {
      title: "Post Not Found",
    };
  }
  
  const post = await getWpPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const excerpt = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .trim()
    .substring(0, 160);

  return {
    title: post.title.rendered,
    description: excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // If WordPress not configured, return 404
  if (!isWordPressConfigured()) {
    notFound();
  }
  
  const post = await getWpPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name || "SoloSheThings";

  return (
    <main className="relative min-h-screen bg-muted/30 py-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.15_350_/_0.05),transparent_50%)]" />
      
      <div className="container relative mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <nav className="mb-8">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </nav>

          <article className="gradient-border rounded-xl overflow-hidden bg-card">
            <div className="p-8 md:p-12">
              {/* Header */}
              <header className="mb-8">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
                  {post.title.rendered}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                  <span className="font-medium text-foreground">By {author}</span>
                  <span className="text-muted-foreground">•</span>
                  <time dateTime={post.date} className="font-medium">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </header>

              {/* Featured Image */}
              {featuredImage && (
                <div className="relative aspect-video mb-12 rounded-xl overflow-hidden gradient-border">
                  <Image
                    src={featuredImage}
                    alt={
                      post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
                      post.title.rendered
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose-wrapper">
                <Prose html={post.content.rendered} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}