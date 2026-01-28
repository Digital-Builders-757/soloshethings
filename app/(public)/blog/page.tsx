/**
 * Blog List Page
 * 
 * WordPress editorial content (public, no auth required)
 * ISR with 1-hour revalidation
 * Server-side fetch only
 * 
 * Reference: docs/WORDPRESS_SUPABASE_BLUEPRINT.md
 * 
 * NOTE: WordPress integration is OPTIONAL in Phase 1.
 * Shows "Coming Soon" when WP_URL is not configured.
 */

import { getWpPosts, isWordPressConfigured } from "@/lib/wp-rest";
import type { WpPostListResponse } from "@/lib/wp-types";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default async function BlogPage() {
  const wpConfigured = isWordPressConfigured();
  const posts: WpPostListResponse = await getWpPosts({ perPage: 12 });

  return (
    <main className="relative min-h-screen bg-muted/30 py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.15_350_/_0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.78_0.12_195_/_0.1),transparent_50%)]" />
      
      <div className="container relative mx-auto px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.75_0.15_350_/_0.2)] to-[oklch(0.78_0.12_195_/_0.2)] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-foreground">
            <Sparkles className="h-3 w-3" />
            Travel Stories
          </span>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Travel Guides & Stories
          </h1>
        </div>
        
        {!wpConfigured || posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="font-serif text-2xl font-semibold mb-4 text-foreground">
                Blog Coming Soon
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                {!wpConfigured
                  ? "We're preparing amazing travel content for you. Check back soon!"
                  : "No blog posts available at the moment. Check back soon!"}
              </p>
              <div className="gradient-border rounded-xl p-6 bg-card">
                <p className="text-sm font-medium text-foreground">
                  ✨ Stay tuned for travel guides, destination spotlights, and solo travel stories!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const featuredImage =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              const excerpt = post.excerpt.rendered
                .replace(/<[^>]*>/g, "")
                .trim()
                .substring(0, 150);

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group gradient-border overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-full overflow-hidden rounded-lg bg-card">
                    {/* Image */}
                    <div className="relative h-[300px] overflow-hidden md:h-[350px]">
                      {featuredImage ? (
                        <Image
                          src={featuredImage}
                          alt={
                            post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
                            post.title.rendered
                          }
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3 p-6">
                      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                        {new Date(post.date).toLocaleDateString("en-US", { 
                          month: "long", 
                          year: "numeric" 
                        })}
                      </p>
                      <h2 className="font-serif text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2">
                        {post.title.rendered}
                      </h2>
                      {excerpt && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {excerpt}...
                        </p>
                      )}
                      <span className="text-sm font-medium text-primary mt-2 group-hover:underline">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}