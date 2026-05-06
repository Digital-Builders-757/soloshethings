/**
 * Community place/story detail (authenticated shell).
 * Middleware enforces session; this page repeats getUser() per AUTH_CONTRACT.
 */

import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getUser } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params

  const user = await getUser()
  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(`/places/${slug}`)}`)
  }

  return (
    <main className="section-y shell-inline mx-auto min-w-0 max-w-4xl flex-1 overflow-x-clip py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#6d5849]">
        <Link href="/dashboard" className="font-semibold text-[#e34b16] transition hover:text-[#c74010]">
          My dashboard
        </Link>
        <span className="mx-2 text-[#d9c4a8]" aria-hidden>
          /
        </span>
        <span className="font-medium text-[#7a331b]">Place</span>
      </nav>

      <div className="min-w-0">
        <div className="surface-card mb-8 rounded-xl p-6 text-[#7a331b]">
          <p className="text-sm font-semibold leading-relaxed">
            Signed-in only. Full community posts and place pages will load here in a future release.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Slug: <span className="font-mono text-[#3a3a3a]">{slug}</span>
          </p>
        </div>

        <article>
          <header className="mb-8">
            <h1 className="mb-4 text-balance font-serif text-3xl font-bold text-[#7a331b] sm:text-4xl md:text-5xl">
              Community place or story
            </h1>
            <div className="mb-6 text-muted-foreground">
              <span>Preview</span>
              <span className="mx-2" aria-hidden>
                •
              </span>
              <time dateTime="2026-01-27">January 27, 2026</time>
            </div>
            <div className="mb-8 aspect-video rounded-xl bg-muted" />
          </header>

          <div className="prose prose-neutral max-w-none text-muted-foreground">
            <p>
              When live, this page will show the full post. Public listings stay on marketing routes;
              member-only detail stays behind auth and RLS.
            </p>
          </div>
        </article>

        <nav className="mt-12 border-t border-border pt-8" aria-label="Secondary">
          <Link href="/collections" className="text-sm font-semibold text-[#e34b16] hover:text-[#c74010]">
            ← Browse collections
          </Link>
        </nav>
      </div>
    </main>
  )
}
