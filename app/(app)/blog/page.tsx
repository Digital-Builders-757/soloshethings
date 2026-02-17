/**
 * Blog List Page (Protected - requires authentication)
 * 
 * WordPress editorial content
 * ISR with 1-hour revalidation
 * Server-side fetch only
 */

import { getWpPosts, isWordPressConfigured } from "@/lib/wp-rest";
import type { WpPostListResponse } from "@/lib/wp-types";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function BlogPage() {
  const wpConfigured = isWordPressConfigured();
  const posts: WpPostListResponse = await getWpPosts({ perPage: 12 });

  return (
    <>
      <Header showBanner={false} />
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Travel Guides & Stories</h1>
          
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
                <div className="bg-[#F2E205]/90 text-black p-4 rounded-xl backdrop-blur-sm">
                  <p className="text-sm font-medium">
                    Stay tuned for travel guides, destination spotlights, and solo travel stories!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const featuredImage =
                  post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
                const excerpt = post.excerpt.rendered
                  .replace(/<[^>]*>/g, "")
                  .trim()
                  .substring(0, 150);

                return (
                  <article
                    key={post.id}
                    className="border-2 border-[#0439D9]/20 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="overflow-hidden rounded-xl">
                      {featuredImage && (
                        <div className="aspect-video bg-neutral-200 relative overflow-hidden">
                          <Image
                            src={featuredImage}
                            alt={
                              post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ||
                              post.title.rendered
                            }
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      {!featuredImage && (
                        <div className="aspect-video bg-neutral-200"></div>
                      )}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                          {post.title.rendered}
                        </h2>
                        {excerpt && (
                          <p className="text-neutral-600 mb-4 line-clamp-3">
                            {excerpt}...
                          </p>
                        )}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-[#0439D9] hover:text-[#034AA6] font-medium"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
