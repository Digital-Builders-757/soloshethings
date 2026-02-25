import Image from "next/image"
import Link from "next/link"
import type { WpPost } from "@/lib/wp-types"

interface FeaturedPostsProps {
  posts: WpPost[]
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="bg-[#FFF8F3] py-14 md:py-24">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8">
          <div className="mb-10 text-center md:mb-16">
            <span className="mb-4 inline-block -rotate-2 rounded-full bg-brand-gold px-4 py-2 text-[0.8rem] font-bold uppercase tracking-[1px] text-white">
              Curated for you
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-blue sm:text-3xl md:text-[3rem]">
              SHE Stories
            </h2>
          </div>
          <p className="text-center text-[#666]">No posts available at the moment.</p>
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
    <section className="bg-[#FFF8F3] py-14 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* Header with section badge */}
        <div className="mb-10 text-center md:mb-16">
          <span className="mb-4 inline-block -rotate-2 rounded-full bg-brand-gold px-4 py-2 text-[0.8rem] font-bold uppercase tracking-[1px] text-white">
            Curated for you
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-blue sm:text-3xl md:text-[3rem]">
            SHE Stories
          </h2>
        </div>

        {/* Story Cards Grid */}
        <div className={`grid gap-6 md:gap-8 ${gridCols}`}>
          {posts.map((post) => {
            const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
            const excerpt = post.excerpt.rendered
              ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().substring(0, 150)
              : ""

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border-2 border-[#eee] bg-white transition-all duration-300 hover:-translate-y-2.5 hover:border-brand-gold md:rounded-3xl"
              >
                {/* Image */}
                <div className="relative h-[200px] overflow-hidden md:h-[240px]">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || post.title.rendered}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#ddd]">
                      <span className="text-sm text-[#999]">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-8">
                  <p className="mb-2 text-[0.8rem] font-bold uppercase text-brand-orange">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="font-serif text-xl font-bold leading-tight text-[#1A1A1A] md:text-2xl">
                    {post.title.rendered}
                  </h3>
                  {excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-[#666] md:mt-3 md:text-[0.95rem]">
                      {excerpt}...
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center md:mt-16">
          <Link
            href="/blog"
            className="inline-block rounded-full border-2 border-brand-orange bg-transparent px-6 py-3 text-sm font-bold uppercase text-brand-orange transition-all duration-200 hover:bg-brand-orange hover:text-white md:px-8"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}
