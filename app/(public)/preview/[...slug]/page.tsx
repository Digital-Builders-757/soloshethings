/**
 * Preview Page
 * 
 * Draft mode preview route for WordPress content
 * Must use noStore() and never cache
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 * 
 * NOTE: WordPress integration is OPTIONAL in Phase 1.
 * Returns 404 when WP_URL is not configured.
 */

import { draftMode } from "next/headers";
import { getWpPostBySlug, isWordPressConfigured } from "@/lib/wp-rest";
import { Prose } from "@/components/prose";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function PreviewPage({ params }: Props) {
  // Disable caching for preview mode
  noStore();

  const { slug } = await params;
  const slugString = slug.join("/");

  // Check if WordPress is configured
  if (!isWordPressConfigured()) {
    notFound();
  }

  // Check if draft mode is enabled
  const draft = await draftMode();
  if (!draft.isEnabled) {
    return (
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-orange text-white p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Preview Mode Not Enabled</h1>
            <p>You must access this page through the preview API route.</p>
          </div>
        </div>
      </main>
    );
  }

  // Try to fetch the post (may be draft/unpublished)
  // Note: WordPress REST API may require authentication for drafts
  // This is a best-effort fetch
  const post = await getWpPostBySlug(slugString);

  if (!post) {
    return (
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-yellow1 text-black p-6 rounded-lg mb-8">
            <h1 className="text-2xl font-bold mb-2">Preview Mode Active</h1>
            <p>
              Draft content may require WordPress authentication. Post not found
              or not accessible.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-brand-blue1 hover:text-brand-blue2 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name || "SoloSheThings";

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-brand-yellow1 text-black p-4 rounded-lg mb-8">
          <p className="font-semibold">🔒 Preview Mode Active</p>
          <p className="text-sm mt-1">
            This is a draft preview. Content may not be published yet.
          </p>
        </div>

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
              <div className="aspect-video bg-neutral-200 rounded-lg mb-8 overflow-hidden relative">
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

