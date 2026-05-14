/**
 * Submit a Spot/Story Page
 *
 * Authenticated route, server `getUser()` per AUTH_CONTRACT.
 */

import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { SubmitForm } from '@/components/submit/submit-form'
import { getRecentPostsForAuthor } from '@/lib/queries/community-posts'
import { getUser } from '@/lib/supabase/server'

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function SubmitPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login?redirectTo=/submit')
  }

  const recentPosts = await getRecentPostsForAuthor(user.id)

  return (
    <main className="section-y shell-inline mx-auto min-w-0 w-full max-w-5xl flex-1 overflow-x-clip">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start">
        <SubmitForm recentPostCount={recentPosts.length} />

        <aside className="space-y-4">
          <div className="surface-card p-5 text-foreground sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.2em]">What saves right now</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-[#6d5849]">
              <li>• Title, description, privacy, and optional images save into Supabase now.</li>
              <li>• Images upload server-side with validation and per-user storage paths.</li>
              <li>• Your recent submissions render back here with signed image URLs for verification.</li>
            </ul>
          </div>

          <div className="editorial-card p-5 sm:p-6">
            <h2 className="font-serif text-2xl font-semibold text-[#7a331b]">Recent submissions</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d5849]">
              A quick confirmation surface while the broader community feed is still being built.
            </p>

            {recentPosts.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-[#d9c4a8] bg-[#fffaf4] p-4 text-sm text-[#6d5849]">
                No posts yet. Your first saved spot or story will show up here.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {recentPosts.map((post) => (
                  <article key={post.id} className="overflow-hidden rounded-3xl border border-[#ead8c2] bg-white shadow-sm">
                    {post.images[0]?.signedUrl ? (
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f6efe4]">
                        <Image
                          src={post.images[0].signedUrl}
                          alt={post.images[0].alt_text ?? post.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 28rem, 100vw"
                          unoptimized
                        />
                      </div>
                    ) : null}

                    <div className="space-y-3 p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b7455]">
                        <span>{post.is_public ? 'Public' : 'Private'}</span>
                        <span aria-hidden>•</span>
                        <span>{post.images.length} image{post.images.length === 1 ? '' : 's'}</span>
                      </div>

                      <div>
                        <h3 className="font-serif text-xl font-semibold text-[#7a331b]">
                          <Link href={`/places/${post.id}`} className="transition hover:text-[#e34b16]">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#6d5849]">{post.content}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">Saved {formatSubmittedAt(post.created_at)}</p>
                        <Link href={`/places/${post.id}`} className="text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
                          Open story detail →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}
