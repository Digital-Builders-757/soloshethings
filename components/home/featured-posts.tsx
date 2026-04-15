import Image from "next/image"
import Link from "next/link"
import type { WpPost } from "@/lib/wp-types"

interface FeaturedPostsProps {
  posts: WpPost[]
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
        {eyebrow}
      </p>
      <h2 className="font-serif text-3xl font-bold text-brand-orange md:text-4xl lg:text-5xl text-balance">
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-16 bg-brand-orange" />
    </div>
  )
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <SectionHeader eyebrow="Curated for you" title="SHE Stories" />
          <p className="text-center text-muted-foreground">No posts available at the moment.</p>
        </div>
      </section>
    )
  }

  const gridCols =
    posts.length === 1
      ? "md:grid-cols-1 max-w-xl mx-auto"
      : posts.length === 2
      ? "md:grid-cols-2 max-w-4xl mx-auto"
      : "md:grid-cols-2 lg:grid-cols-3"

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <SectionHeader eyebrow="Curated for you" title="SHE Stories" />

        <div className={`grid gap-8 ${gridCols}`}>
          {posts.map((post) => {
            const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
            const excerpt = post.excerpt.rendered
              ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().substring(0, 150)
              : ""

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-[280px] overflow-hidden">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || post.title.rendered}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-cream">
                      <span className="text-sm text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-brand-orange line-clamp-2">
                    {post.title.rendered}
                  </h3>
                  {excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{excerpt}...</p>
                  )}
                  <span className="mt-2 text-sm font-semibold text-brand-orange">
                    See How SHE Did It &rarr;
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-blue px-8 py-3 text-sm font-semibold text-brand-blue transition-all hover:bg-brand-blue hover:text-white"
          >
            View All Stories
          </Link>
        </div>
      </div>
    </section>
  )
}
