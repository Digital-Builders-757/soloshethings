import Image from "next/image"
import Link from "next/link"
import type { WpPost } from "@/lib/wp-types"

interface FeaturedPostsProps {
  posts: WpPost[]
  title?: string
  subtitle?: string
}

export function FeaturedPosts({ 
  posts, 
  title = "Featured Content",
  subtitle = ""
}: FeaturedPostsProps) {
  const hasPosts = posts && posts.length > 0

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        {/* Header - always visible */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-[#df4915] md:text-[2rem]">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-base text-[#4b5563]">{subtitle}</p>}
        </div>

        {/* 4-card grid or placeholder */}
        {hasPosts ? (
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
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg bg-[#faf8f5]">
                <div className="h-[200px] bg-[#e5e7eb]" />
                <div className="p-4">
                  <div className="h-3 w-20 rounded bg-[#e5e7eb]" />
                  <div className="mt-2 h-5 w-full rounded bg-[#e5e7eb]" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-[#e5e7eb]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
