/**
 * Blog Post Detail Page
 * 
 * WordPress editorial content (public, no auth required)
 * ISR with webhook revalidation on WordPress publish
 * Server-side fetch only
 * Content sanitization via Prose component
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 */

import { getWpPostBySlug } from "@/lib/wp-rest";
import { Prose } from "@/components/prose";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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
  const post = await getWpPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name || "SoloSheThings";

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {post.title.rendered}
            </h1>
            <div className="text-neutral-600 mb-6">
              <span>By {author}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {featuredImage && (
              <div className="aspect-video bg-neutral-200 rounded-lg mb-8 overflow-hidden">
                <img
                  src={featuredImage}
                  alt={
                    post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
                    post.title.rendered
                  }
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <Prose html={post.content.rendered} />
        </article>

        <nav className="mt-16 pt-8 border-t border-neutral-200">
          <Link
            href="/blog"
            className="text-brand-blue1 hover:text-brand-blue2 font-medium"
          >
            ← Back to Blog
          </Link>
        </nav>
      </div>
    </main>
  );
}
