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
    <>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FAFAFA_100%)] py-14 md:py-24 lg:py-32">
          <div className="mx-auto max-w-[1240px] px-5 text-center md:px-8">
            <span className="badge-tilt inline-block rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
              Travel + SHE Things
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[0.95] text-brand-blue sm:text-5xl md:text-6xl">
              SHE{" "}
              <span className="italic font-normal text-brand-orange">Stories</span>{" "}
              & Guides
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#555] md:mt-6 md:text-lg">
              Real travel stories, safety guides, and destination spotlights from solo female
              travelers around the world.
            </p>
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
                        <h2 className="font-serif text-lg font-bold leading-tight text-[#1A1A1A] md:text-xl">
                          {post.title.rendered}
                        </h2>
                        {excerpt && (
                          <p className="mt-2 text-sm leading-relaxed text-[#666] md:text-[0.95rem]">
                            {excerpt}...
                          </p>
                        )}
                        <span className="mt-3 inline-block text-sm font-bold uppercase tracking-wider text-brand-orange transition-colors group-hover:text-brand-blue">
                          Read More
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="grid-pattern-overlay overflow-hidden bg-brand-orange py-16 text-center text-white md:py-28">
          <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-8">
            <h2 className="font-serif text-3xl font-bold italic sm:text-4xl md:text-5xl lg:text-6xl">
              Have a Story to Share?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/90 md:mt-6 md:text-lg">
              We love featuring stories from our community. Share your solo travel experience and
              inspire others to go solo.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10 md:gap-6">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-orange transition-all hover:shadow-lg sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Submit Your Story
              </Link>
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-white/10 sm:w-auto md:px-10 md:py-4 md:text-lg"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
