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
  // Show section even if no posts, with placeholder cards
  const displayPosts = posts && posts.length > 0 ? posts.slice(0, 4) : []

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* Header */}
        <div className="mb-6 text-center md:mb-10">
          <h2 className="text-lg font-bold text-[#df4915] md:text-2xl lg:text-[2rem]">
            Resources for Your Solo Journey
          </h2>
          <p className="mt-2 text-sm text-[#4b5563] md:text-base">
            Whether you{"'"}re planning your first solo experience or looking for inspiration...
          </p>
        </div>

        {/* 4-card grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {displayPosts.length > 0 ? (
            displayPosts.map((post) => {
              const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
              const excerpt = post.excerpt.rendered
                ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim().substring(0, 80)
                : ""

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-lg bg-[#faf8f5]"
                >
                  {/* Image */}
                  <div className="relative h-[120px] overflow-hidden md:h-[180px]">
                    {featuredImage ? (
                      <Image
                        src={featuredImage}
                        alt={post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || post.title.rendered}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e5e7eb]">
                        <span className="text-xs text-[#6b7280]">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-4">
                    <p className="text-[10px] text-[#6b7280] md:text-xs">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-tight text-[#111827] md:text-base">
                      {post.title.rendered}
                    </h3>
                    {excerpt && (
                      <p className="mt-1 line-clamp-2 text-xs text-[#4b5563] md:mt-2 md:line-clamp-3 md:text-sm">
                        {excerpt}...
                      </p>
                    )}
                    <span className="mt-2 inline-block text-xs font-medium text-[#c53030] md:mt-3 md:text-sm">
                      Read More
                    </span>
                  </div>
                </Link>
              )
            })
          ) : (
            // Placeholder cards when no posts available
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-[#faf8f5]">
                <div className="h-[120px] bg-[#e5e7eb] md:h-[180px]" />
                <div className="p-3 md:p-4">
                  <div className="h-3 w-16 rounded bg-[#e5e7eb]" />
                  <div className="mt-2 h-4 w-full rounded bg-[#e5e7eb]" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-[#e5e7eb]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
