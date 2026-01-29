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
      <section className="section-mist relative py-24 overflow-hidden">
        <div className="container relative mx-auto px-6 z-10">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full badge-sunrise px-4 py-1 text-xs font-semibold uppercase tracking-widest text-foreground">
              <Sparkles className="h-3 w-3" />
              Curated for you
            </span>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-brand-primary-2 to-brand-primary bg-clip-text text-transparent">Featured Posts</span>
            </h2>
          </div>
          <p className="text-center text-muted-foreground">No posts available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-mist relative py-24 overflow-hidden">
      <div className="container relative mx-auto px-6 z-10">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full badge-sunrise px-4 py-1 text-xs font-semibold uppercase tracking-widest text-foreground">
            <Sparkles className="h-3 w-3" />
            Curated for you
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-brand-primary-2 to-brand-primary bg-clip-text text-transparent">Featured Posts</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg-dark)]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </>
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-serif text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2">
                      {post.title.rendered}
                    </h3>
                    {excerpt && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{excerpt}...</p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-ocean px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-brand-primary/40"
          >
            <span className="relative z-10">View All Posts</span>
            <span className="absolute inset-0 bg-gradient-to-r from-brand-primary-2 to-brand-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}