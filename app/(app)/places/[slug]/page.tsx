/**
 * Community place/story detail (authenticated shell).
 * Middleware enforces session; this page repeats getUser() per AUTH_CONTRACT.
 */

import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { SaveCommunityPostButton } from '@/components/cards/save-community-post-button'
import { CommunitySurfaceNav } from '@/components/community/community-surface-nav'
import { ReportPostForm } from '@/components/safety/report-post-form'
import { OwnerCommunityPostManager } from '@/components/submit/owner-community-post-manager'
import { OwnerPostImageManager } from '@/components/submit/owner-post-image-manager'
import { getCommunityReturnLink } from '@/lib/community-navigation'
import { getCommunityPostDetail } from '@/lib/queries/community-posts'
import { getLatestMemberPostReportsForPosts, REPORT_REASON_LABELS, REPORT_STATUS_LABELS } from '@/lib/queries/reports'
import { getSavedCommunityPostIds } from '@/lib/queries/saved-posts'
import { getUser } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ returnTo?: string }>
}

function formatPublishedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value))
}

function reportStatusTone(status: 'pending' | 'reviewed' | 'resolved' | 'dismissed') {
  switch (status) {
    case 'resolved':
      return 'border-green-200 bg-green-50 text-green-800'
    case 'dismissed':
      return 'border-slate-200 bg-slate-50 text-slate-700'
    case 'reviewed':
      return 'border-amber-200 bg-amber-50 text-amber-800'
    default:
      return 'border-[#ead8c2] bg-white text-[#7a331b]'
  }
}

export default async function PlaceDetailPage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

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
  const returnLink = getCommunityReturnLink(resolvedSearchParams?.returnTo)
  const submitReturnTo = returnLink.href.split('?')[0] === '/submit' ? returnLink.href : null
  const savedPostIds = await getSavedCommunityPostIds(user.id, [post.id])
  const latestReportsByPostId = await getLatestMemberPostReportsForPosts(user.id, [post.id])
  const latestReport = latestReportsByPostId.get(post.id)
  const isSaved = savedPostIds.has(post.id)
  const hasOpenReport = latestReport?.status === 'pending' || latestReport?.status === 'reviewed'
  const savedStoriesHref = returnLink.active === 'saved' ? returnLink.href : '/saved'
  const savedStoriesLabel = returnLink.active === 'saved' ? 'Back to saved stories' : 'Open saved stories'
  const reportHistoryHref = returnLink.active === 'reports' ? returnLink.href : '/reports'
  const reportHistoryLabel = returnLink.active === 'reports' ? 'Back to report history' : 'Open report history'

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-clip py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#6d5849]">
        <Link href="/dashboard" className="font-semibold text-[#e34b16] transition hover:text-[#c74010]">
          My dashboard
        </Link>
        <span className="mx-2 text-[#d9c4a8]" aria-hidden>
          /
        </span>
        <Link href={returnLink.href} className="font-semibold text-[#e34b16] transition hover:text-[#c74010]">
          {returnLink.label}
        </Link>
        <span className="mx-2 text-[#d9c4a8]" aria-hidden>
          /
        </span>
        <span className="font-medium text-[#7a331b]">Story detail</span>
      </nav>

      <CommunitySurfaceNav active={returnLink.active} backHref={returnLink.href} backLabel={returnLink.label} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
        <article className="min-w-0">
          <header className="editorial-card-strong overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">
              <span>{post.is_public ? 'Public member story' : 'Private story'}</span>
              {post.is_featured ? (
                <>
                  <span aria-hidden>•</span>
                  <span>Featured</span>
                </>
              ) : null}
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
              {latestReport ? (
                <>
                  <span aria-hidden>•</span>
                  <span>Reported by you</span>
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
            <Link href={savedStoriesHref} className="mt-4 inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
              {savedStoriesLabel} →
            </Link>
          </div>

          {!isOwnPost && latestReport ? (
            <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Your report status</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">You already flagged this story</h2>
              <div className={`mt-4 inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold ${reportStatusTone(latestReport.status)}`}>
                {REPORT_STATUS_LABELS[latestReport.status]}
              </div>
              <p className="mt-4 text-sm leading-6 text-[#6d5849]">
                Latest reason: <span className="font-semibold text-[#7a331b]">{REPORT_REASON_LABELS[latestReport.reason]}</span>
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6d5849]">
                Sent {formatPublishedAt(latestReport.created_at)}. You can track the full moderation timeline from your private reports page.
              </p>
              <Link href={reportHistoryHref} className="mt-4 inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                {reportHistoryLabel} →
              </Link>
            </div>
          ) : null}

          {isOwnPost ? (
            <>
              <OwnerCommunityPostManager
                key={post.updated_at}
                postId={post.id}
                path={`/places/${post.id}`}
                title={post.title}
                content={post.content}
                isPublic={post.is_public}
                submitReturnTo={submitReturnTo}
              />
              <OwnerPostImageManager
                key={`${post.updated_at}-${post.images.map((image) => image.id).join(',')}`}
                postId={post.id}
                path={`/places/${post.id}`}
                title={post.title}
                images={post.images}
              />
            </>
          ) : post.is_public && !hasOpenReport ? (
            <ReportPostForm postId={post.id} path={`/places/${post.id}`} postTitle={post.title} />
          ) : !post.is_public ? (
            <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Privacy</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">Private stories stay scoped</h2>
              <p className="mt-3 text-sm leading-6 text-[#6d5849]">
                This post is private, so reporting from the shared story detail surface is not enabled.
              </p>
            </div>
          ) : null}

          {post.is_featured ? (
            <div className="rounded-[1.75rem] border border-[#f4c7a8] bg-[#fff7f0] p-5 shadow-sm sm:p-6">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Featured story</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-[#7a331b]">Community-highlighted right now</h2>
              <p className="mt-3 text-sm leading-6 text-[#6d5849]">
                This story is marked as featured, so members can now find it faster from both the browse feed and saved list.
              </p>
            </div>
          ) : null}

          <div className="rounded-[1.75rem] border border-[#ead8c2] bg-white p-5 shadow-sm sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">What changed</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-[#6d5849]">
              <li>• Story detail now renders saved community post content instead of a placeholder shell.</li>
              <li>• Owners can now edit title, story copy, and visibility from their story detail page.</li>
              <li>• Owners can archive a story to remove it from community surfaces without fake delete copy.</li>
              <li>• Owners can now remove old photos and add new ones from the story detail page.</li>
              <li>• Public stories can be privately reported into the existing moderation table.</li>
              <li>• Members can now track their own report history and moderation status from a dedicated reports page.</li>
              <li>• Stories you already flagged now show your latest report status across browse, saved, and detail surfaces.</li>
              <li>• Featured stories are now visibly tagged across browse, saved, and detail surfaces.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
