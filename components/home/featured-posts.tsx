import Image from "next/image"
import Link from "next/link"
import type { WpPost } from "@/lib/wp-types"
import { Sparkles } from "lucide-react"

interface FeaturedPostsProps {
  posts: WpPost[]
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  // If no posts, show empty state or fallback
  if (!posts || posts.length === 0) {
    return (
      <section className="section-sunrise relative py-24 overflow-hidden bg-white">
        <div className="container relative mx-auto px-6 z-10">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#FCC5E2]/30 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#DD9917]">
              <Sparkles className="h-3 w-3" />
              Curated for you
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#FB5315] md:text-4xl lg:text-5xl">
              SHE Stories
            </h2>
          </div>
          <p className="text-center text-neutral-600">No posts available at the moment.</p>
        </div>
      </section>
    )
  }

  const count = posts.length
  const showCtaTile = count > 0 && count < 3
  const gridCols =
    count === 1
      ? "md:grid-cols-2 lg:grid-cols-2"
      : count === 2
      ? "md:grid-cols-2 lg:grid-cols-3"
      : "md:grid-cols-2 lg:grid-cols-3"

  return (
    <section className="section-sunrise relative py-24 overflow-hidden bg-white">
      <div className="container relative mx-auto px-6 z-10">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full badge-sunrise px-4 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-900">
            <Sparkles className="h-3 w-3" />
            Curated for you
          </span>
          <h2 className="font-serif text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
            SHE Stories
          </h2>
        </div>

        <div className={`grid gap-8 ${gridCols}`}>
          {posts.map((post, index) => {
            // Extract featured image from WordPress _embedded data
            const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url

            // Extract and clean excerpt (remove HTML tags)
            const excerpt = post.excerpt.rendered
              ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().substring(0, 150)
              : ""

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group gradient-border overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="h-full overflow-hidden rounded-lg bg-card">
                  {/* Image */}
                  <div className="relative h-[300px] overflow-hidden md:h-[350px]">
                    {featuredImage ? (
                      <>
                        <Image
                          src={featuredImage}
                          alt={post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || post.title.rendered}
                          fill
                          className="image-clean object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                        {/* Hover overlay only - for interaction feedback */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-blue1/10 via-white to-brand-yellow1/20">
                        <span className="text-sm font-medium text-neutral-600">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 transition-colors duration-300 group-hover:text-brand-blue1 line-clamp-2">
                      {post.title.rendered}
                    </h3>
                    {excerpt && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600">{excerpt}...</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
          {showCtaTile && (
            <Link
              href="/blog"
              className="group gradient-border overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-full overflow-hidden rounded-lg bg-white">
                <div className="flex h-full flex-col justify-between gap-6 p-8">
                  <div>
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-blue1/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-blue2">
                      Explore
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">
                      Explore the Blog
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      Read stories, tips, and destination guides curated for solo travelers.
                    </p>
                  </div>
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-blue1 px-4 py-2 text-sm font-semibold text-white transition-all group-hover:bg-brand-blue2">
                    Browse all posts
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#FB5315] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#DD9917] hover:shadow-lg"
          >
            <span className="relative z-10">View All Posts</span>
          </Link>
        </div>
      </div>
    </section>
  )
}