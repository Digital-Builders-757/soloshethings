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
import { Footer } from "@/components/footer";

export default async function BlogPage() {
  const wpConfigured = isWordPressConfigured();
  const posts: WpPostListResponse = await getWpPosts({ perPage: 12 });

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-brand-orange">SHE <span className="text-brand-blue">Stories</span> & Guides</h1>
        
        {!wpConfigured || posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-800">
                Blog Coming Soon
              </h2>
              <p className="text-neutral-600 text-lg mb-6">
                {!wpConfigured
                  ? "We're preparing amazing travel content for you. Check back soon!"
                  : "No blog posts available at the moment. Check back soon!"}
              </p>
              <div className="bg-brand-peach/30 border border-brand-peach/50 text-foreground p-4 rounded-xl">
                <p className="text-sm font-medium">
                  ✨ Stay tuned for travel guides, destination spotlights, and solo travel stories!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid or Coming Soon */}
        <section className="bg-[#FFF8F3] py-14 md:py-24">
          <div className="mx-auto max-w-[1240px] px-5 md:px-8">
            {!wpConfigured || posts.length === 0 ? (
              <div className="py-10 text-center md:py-16">
                <div className="mx-auto max-w-md">
                  <h2 className="font-serif text-2xl font-bold text-brand-blue sm:text-3xl">
                    Blog Coming Soon
                  </h2>
                  <p className="mt-3 text-base text-[#555] md:mt-4 md:text-lg">
                    {!wpConfigured
                      ? "We're preparing amazing travel content for you. Check back soon!"
                      : "No blog posts available at the moment. Check back soon!"}
                  </p>
                  <div className="mt-6 rounded-2xl border-2 border-brand-peach/50 bg-brand-peach/20 p-4 md:rounded-3xl">
                    <p className="text-sm font-medium text-foreground">
                      Stay tuned for travel guides, destination spotlights, and solo travel stories!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {posts.map((post) => {
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
                      className="group overflow-hidden rounded-2xl border-2 border-[#eee] bg-white transition-all duration-300 hover:-translate-y-2.5 hover:border-brand-gold md:rounded-3xl"
                    >
                      <div className="relative h-[180px] overflow-hidden md:h-[240px]">
                        {featuredImage ? (
                          <Image
                            src={featuredImage}
                            alt={
                              post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
                              post.title.rendered
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#ddd]">
                            <span className="text-sm text-[#999]">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-6">
                        <p className="mb-2 text-[0.8rem] font-bold uppercase text-brand-orange">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-brand-orange hover:text-brand-orange/80 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
