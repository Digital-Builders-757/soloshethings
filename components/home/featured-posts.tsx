import Image from "next/image"
import Link from "next/link"
import type { WpPost } from "@/lib/wp-types"

interface FeaturedPostsProps {
  posts: WpPost[]
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  // If no posts, show empty state or fallback
  if (!posts || posts.length === 0) {
    return (
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">Featured Posts</h2>
          <p className="text-center text-muted-foreground">No posts available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-muted/50 py-24">
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold text-foreground md:text-4xl">Featured Posts</h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
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
                className="group overflow-hidden rounded-lg bg-background shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-[300px] overflow-hidden md:h-[400px]">
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
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", { 
                      month: "long", 
                      year: "numeric" 
                    })}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary line-clamp-2">
                    {post.title.rendered}
                  </h3>
                  {excerpt && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {excerpt}...
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/blog" 
            className="inline-block border border-foreground px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}