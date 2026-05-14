import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getCommunityFeedPosts } from '@/lib/queries/community-posts'
import { getUser } from '@/lib/supabase/server'

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function PlacesPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login?redirectTo=/places')
  }

  const posts = await getCommunityFeedPosts(user.id)
  const ownPostsCount = posts.filter((post) => post.author_id === user.id).length
  const publicPostsCount = posts.filter((post) => post.is_public).length

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="editorial-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Community feed</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl md:text-5xl">
          Browse member stories and the places behind them
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5849] sm:text-base">
          This is the first real browsing surface for community posts. You see published public stories from other
          members, plus your own posts so private submissions stay visible to you without leaking outward.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6d5849]">
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {posts.length} stor{posts.length === 1 ? 'y' : 'ies'} in this view
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {publicPostsCount} public
          </Badge>
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {ownPostsCount} yours
          </Badge>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e34b16] px-5 text-sm font-semibold text-white transition hover:bg-[#c74010]"
          >
            Share a story
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      {posts.length === 0 ? (
        <section className="editorial-card mt-6 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">No stories yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5849] sm:text-base">
            Once members start publishing, this feed will show public stories here. Your own private and public
            submissions will also appear after you post.
          </p>
          <Link href="/submit" className="mt-6 inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
            Publish the first story →
          </Link>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          {posts.map((post) => {
            const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
            const isOwnPost = post.author_id === user.id
            const coverImage = post.images[0]?.signedUrl ?? null

            return (
              <article key={post.id} className="editorial-card overflow-hidden">
                {coverImage ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f6efe4]">
                    <Image
                      src={coverImage}
                      alt={post.images[0]?.alt_text ?? post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      unoptimized
                    />
                  </div>
                ) : null}

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">
                    <span>{post.is_public ? 'Public story' : 'Private to you'}</span>
                    {isOwnPost ? (
                      <>
                        <span aria-hidden>•</span>
                        <span>Your post</span>
                      </>
                    ) : null}
                    {post.images.length > 0 ? (
                      <>
                        <span aria-hidden>•</span>
                        <span>{post.images.length} photo{post.images.length === 1 ? '' : 's'}</span>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Avatar
                      src={post.authorAvatarUrl}
                      fallback={authorName.slice(0, 2).toUpperCase()}
                      alt={`${authorName} avatar`}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#7a331b]">{authorName}</p>
                      <p className="text-xs text-[#6d5849]">Published {formatPublishedAt(post.created_at)}</p>
                    </div>
                  </div>

                  <h2 className="mt-4 font-serif text-2xl font-semibold text-[#7a331b]">
                    <Link href={`/places/${post.id}`} className="transition hover:text-[#e34b16]">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#6d5849] sm:text-base">{post.content}</p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#6d5849]">
                      {isOwnPost && !post.is_public
                        ? 'Only you can see this in the feed.'
                        : 'Open the story for full details and reporting tools.'}
                    </p>
                    <Link href={`/places/${post.id}`} className="text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                      Open story →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
