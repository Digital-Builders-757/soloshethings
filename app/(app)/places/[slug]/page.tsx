/**
 * Community place/story detail (authenticated shell).
 * Middleware enforces session; this page repeats getUser() per AUTH_CONTRACT.
 */

import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { SaveCommunityPostButton } from '@/components/cards/save-community-post-button'
import { ReportPostForm } from '@/components/safety/report-post-form'
import { OwnerCommunityPostManager } from '@/components/submit/owner-community-post-manager'
import { OwnerPostImageManager } from '@/components/submit/owner-post-image-manager'
import { getCommunityPostDetail } from '@/lib/queries/community-posts'
import { getSavedCommunityPostIds } from '@/lib/queries/saved-posts'
import { getUser } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ slug: string }>
}

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params

  const user = await getUser()
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/places/${slug}`)}`)
  }

  const post = await getCommunityPostDetail(slug, user.id)

  if (!post) {
    notFound()
  }

  const authorName = post.author?.full_name?.trim() || post.author?.username || 'Solo SHE member'
  const isOwnPost = post.author_id === user.id
  const savedPostIds = await getSavedCommunityPostIds(user.id, [post.id])
  const isSaved = savedPostIds.has(post.id)

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#6d5849]">
        <Link href="/dashboard" className="font-semibold text-[#e34b16] transition hover:text-[#c74010]">
          My dashboard
        </Link>
        <span className="mx-2 text-[#d9c4a8]" aria-hidden>
          /
        </span>
        <Link href="/places" className="font-semibold text-[#e34b16] transition hover:text-[#c74010]">
          Browse stories
        </Link>
        <span className="mx-2 text-[#d9c4a8]" aria-hidden>
          /
        </span>
        <span className="font-medium text-[#7a331b]">Story detail</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
        <article className="min-w-0">
          <header className="editorial-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">
              <span>{post.is_public ? 'Public member story' : 'Private story'}</span>
              <span aria-hidden>•</span>
              <span>Published</span>
            </div>

            <h1 className="mt-4 text-balance font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#6d5849]">
              <span>
                By <span className="font-semibold text-[#7a331b]">{authorName}</span>
              </span>
              <span aria-hidden>•</span>
              <time dateTime={post.created_at}>{formatPublishedAt(post.created_at)}</time>
              {post.images.length > 0 ? (
                <>
                  <span aria-hidden>•</span>
                  <span>{post.images.length} photo{post.images.length === 1 ? '' : 's'}</span>
                </>
              ) : null}
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#6d5849] sm:text-base">
              This detail page is now the real view for community stories. If something here breaks trust or safety,
              members can send a private report for review.
            </p>
          </header>

          {post.images.length > 0 ? (
            <section className="mt-6 grid gap-4 sm:grid-cols-2" aria-label="Story photos">
              {post.images.map((image, index) => (
                <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-[#ead8c2] bg-[#f6efe4] shadow-sm">
                  {image.signedUrl ? (
                    <Image
                      src={image.signedUrl}
                      alt={image.alt_text ?? `${post.title} photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#6d5849]">
                      Photo preview unavailable right now.
                    </div>
                  )}
                </div>
              ))}
            </section>
          ) : null}

          <section className="editorial-card mt-6 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">Story</h2>
            <div className="prose prose-neutral mt-4 max-w-none whitespace-pre-wrap break-words text-[#4f4034]">
              {post.content}
            </div>
          </section>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Save for later</p>
            <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">Keep this story close</h2>
            <div className="mt-4">
              <SaveCommunityPostButton postId={post.id} path={`/places/${post.id}`} initialSaved={isSaved} variant="card" />
            </div>
            <Link href="/saved" className="mt-4 inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
              Open saved stories →
            </Link>
          </div>

          {isOwnPost ? (
            <>
              <OwnerCommunityPostManager
                key={post.updated_at}
                postId={post.id}
                path={`/places/${post.id}`}
                title={post.title}
                content={post.content}
                isPublic={post.is_public}
              />
              <OwnerPostImageManager
                key={`${post.updated_at}-${post.images.map((image) => image.id).join(',')}`}
                postId={post.id}
                path={`/places/${post.id}`}
                title={post.title}
                images={post.images}
              />
            </>
          ) : post.is_public ? (
            <ReportPostForm postId={post.id} path={`/places/${post.id}`} postTitle={post.title} />
          ) : (
            <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Privacy</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">Private stories stay scoped</h2>
              <p className="mt-3 text-sm leading-6 text-[#6d5849]">
                This post is private, so reporting from the shared story detail surface is not enabled.
              </p>
            </div>
          )}

          <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">What changed</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-[#6d5849]">
              <li>• Story detail now renders saved community post content instead of a placeholder shell.</li>
              <li>• Owners can now edit title, story copy, and visibility from their story detail page.</li>
              <li>• Owners can archive a story to remove it from community surfaces without fake delete copy.</li>
              <li>• Owners can now remove old photos and add new ones from the story detail page.</li>
              <li>• Public stories can be privately reported into the existing moderation table.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
