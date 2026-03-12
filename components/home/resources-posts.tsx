import Image from "next/image"
import Link from "next/link"
import type { WpPost } from "@/lib/wp-types"

interface ResourcesPostsProps {
  posts: WpPost[]
}

/**
 * Resources for Your Solo Journey
 * 
 * Same card grid as Real Stories, but different title
 */

export function ResourcesPosts({ posts }: ResourcesPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#df4915] md:text-[2rem]">
            Resources for Your Solo Journey
          </h2>
          <p className="mt-2 text-base text-[#4b5563]">
            Whether you{"'"}re planning your first solo experience or looking for inspiration...
          </p>
        </div>

        {/* 4-card grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => {
            const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
            const excerpt = post.excerpt.rendered
              ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().substring(0, 120)
              : ""

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-lg bg-[#faf8f5]"
              >
                {/* Image */}
                <div className="relative h-[200px] overflow-hidden">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || post.title.rendered}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#e5e7eb]">
                      <span className="text-sm text-[#6b7280]">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-[#6b7280]">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="mt-1 text-base font-bold leading-tight text-[#111827]">
                    {post.title.rendered}
                  </h3>
                  {excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-[#4b5563]">
                      {excerpt}...
                    </p>
                  )}
                  <span className="mt-3 inline-block text-sm font-medium text-[#c53030]">
                    Read More
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
