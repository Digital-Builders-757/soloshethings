import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { SaveCommunityPostButton } from '@/components/cards/save-community-post-button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getSavedCommunityPosts } from '@/lib/queries/saved-posts'
import { getUser } from '@/lib/supabase/server'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function SavedPostsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login?redirectTo=/saved')
  }

  const savedPosts = await getSavedCommunityPosts(user.id)

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <header className="editorial-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
        <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Saved stories</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl md:text-5xl">
          Keep the stories you want to come back to close
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6d5849] sm:text-base">
          This first pass saves community stories into your own private list. It covers member posts today, with broader saved surfaces still to come.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6d5849]">
          <Badge variant="neutral" size="sm" className="border border-[#ead8c2] bg-white/90 text-[#7a331b]">
            {savedPosts.length} saved stor{savedPosts.length === 1 ? 'y' : 'ies'}
          </Badge>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/places"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#e34b16] px-5 text-sm font-semibold text-white transition hover:bg-[#c74010]"
          >
            Browse stories
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-5 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      {savedPosts.length === 0 ? (
        <section className="editorial-card mt-6 p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">Nothing saved yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5849] sm:text-base">
            Use the save button on a story card or detail page and it will appear here for your account only.
          </p>
          <Link href="/places" className="mt-6 inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
            Explore the feed →
          </Link>
        </section>
      ) : (
        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          {savedPosts.map((post) => {
            const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
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
                    <span aria-hidden>•</span>
                    <span>Saved {formatDate(post.saved_at)}</span>
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
                      <p className="text-xs text-[#6d5849]">Published {formatDate(post.created_at)}</p>
                    </div>
                  </div>

                  <h2 className="mt-4 font-serif text-2xl font-semibold text-[#7a331b]">
                    <Link href={`/places/${post.id}`} className="transition hover:text-[#e34b16]">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#6d5849] sm:text-base">{post.content}</p>

                  <div className="mt-6 space-y-3">
                    <SaveCommunityPostButton postId={post.id} path="/saved" initialSaved variant="card" />
                    <Link href={`/places/${post.id}`} className="inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
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
