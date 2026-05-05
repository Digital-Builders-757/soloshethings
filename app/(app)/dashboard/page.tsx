/**
 * Dashboard — signed-in home base
 */

import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  MapPin,
  Sparkles,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProfileErrorFallback } from '@/components/profile/profile-error-fallback'
import { getProfileWithBoundedRepair } from '@/lib/queries/profiles'
import { getUser } from '@/lib/supabase/server'

function roleLabel(role: string) {
  if (role === 'client') return 'Community partner'
  return 'Traveler'
}

function ActionTile({
  href,
  icon: Icon,
  title,
  description,
  cta,
}: {
  href: string
  icon: LucideIcon
  title: string
  description: string
  cta: string
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex min-h-[5.25rem] gap-4 rounded-2xl border border-[#ead8c2] bg-white p-4 shadow-sm transition hover:border-[#e34b16]/30 hover:shadow-[0_12px_36px_rgba(122,51,27,0.09)] sm:min-h-0 sm:flex-col sm:p-5"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7e8be]/90 text-[#7a331b] ring-1 ring-[#ead8c2]/80 sm:h-11 sm:w-11">
          <Icon className="h-5 w-5 text-[#e34b16]" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 sm:flex-none">
          <span className="flex items-start justify-between gap-2">
            <span className="font-semibold text-[#7a331b]">{title}</span>
            <ChevronRight
              className="mt-0.5 h-5 w-5 shrink-0 text-[#e34b16] opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:hidden"
              aria-hidden
            />
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-[#6d5849]">{description}</span>
          <span className="mt-3 hidden items-center gap-1 text-sm font-semibold text-[#e34b16] sm:inline-flex">
            {cta}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </span>
      </Link>
    </li>
  )
}

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfileWithBoundedRepair(user.id, user.email)

  if (!profile) {
    return <ProfileErrorFallback context="dashboard" />
  }

  const displayName = profile.full_name?.trim() || profile.username

  return (
    <div className="relative isolate">
      {/* Soft top atmosphere — matches brand marketing pages */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#f7e8be]/50 via-[#fffaf0]/30 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pb-20 lg:pt-12">
        {/* —— Welcome —— */}
        <header className="overflow-hidden rounded-[1.75rem] border border-[#ead8c2] bg-gradient-to-br from-white via-[#fffdf8] to-[#f7e8be]/35 shadow-[0_20px_60px_rgba(122,51,27,0.08)]">
          <div className="relative px-5 py-8 sm:p-8 md:p-10 lg:p-11">
            <div
              className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#fab642]/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-[#e34b16]/10 blur-3xl"
              aria-hidden
            />

            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#a14b24] sm:text-xs sm:tracking-[0.28em]">
              Your dashboard
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-display-md text-[#7a331b] sm:text-display-lg">
              Welcome home,{' '}
              <span className="text-[#e34b16] italic">{displayName}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6d5849] sm:text-[1.05rem] sm:leading-7">
              <span className="font-medium text-[#7a331b]">{roleLabel(profile.role)}</span>
              <span className="text-[#6d5849]/80"> · </span>
              Signed in as <span className="font-medium text-[#7a331b]">{user.email}</span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/profile"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e34b16] px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(227,75,22,0.32)] transition hover:bg-[#c74010] sm:px-7"
              >
                <UserRound className="h-4 w-4 shrink-0" aria-hidden />
                Edit profile
              </Link>
              <Link
                href="/collections"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9c4a8] bg-white/90 px-6 text-sm font-semibold text-[#7a331b] shadow-sm transition hover:border-[#e34b16]/45 hover:text-[#e34b16] sm:px-7"
              >
                Browse Solo SHEntries
              </Link>
              <Link
                href="/submit"
                className="inline-flex min-h-12 items-center justify-center text-sm font-semibold text-[#e34b16] underline-offset-4 hover:underline sm:px-2"
              >
                Share a story →
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_min(100%,20rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          {/* —— Quick actions —— */}
          <section aria-labelledby="dash-actions-heading" className="min-w-0">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <h2
                  id="dash-actions-heading"
                  className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl"
                >
                  Where to next
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#6d5849] sm:text-base">
                  Pick up threads from your last visit or explore something new.
                </p>
              </div>
            </div>

            <ul className="mt-6 grid list-none gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
              <ActionTile
                href="/profile"
                icon={UserRound}
                title="Profile & visibility"
                description="Name, bio, and how you appear to others."
                cta="Open profile"
              />
              <ActionTile
                href="/blog"
                icon={BookOpen}
                title="Travel + SHE Things"
                description="Stories, notes, and guides from the road."
                cta="Read the blog"
              />
              <ActionTile
                href="/map"
                icon={MapPin}
                title="Map & places"
                description="Inspiration for your next solo adventure."
                cta="Open map"
              />
              <ActionTile
                href="/submit"
                icon={Sparkles}
                title="Submit a story"
                description="Tips, wins, or lessons for the collective."
                cta="Start a submission"
              />
            </ul>
          </section>

          {/* —— Account snapshot —— */}
          <aside
            className="surface-card rounded-[1.25rem] p-5 shadow-sm sm:p-6 lg:sticky lg:top-24 lg:self-start"
            aria-labelledby="dash-snapshot-heading"
          >
            <h2 id="dash-snapshot-heading" className="font-serif text-lg font-bold text-[#7a331b]">
              At a glance
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your public-facing basics. @{profile.username}
            </p>

            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                  Display
                </dt>
                <dd className="mt-1.5 font-medium text-foreground">
                  {profile.full_name?.trim() || profile.username}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                  Privacy
                </dt>
                <dd className="mt-1.5 capitalize text-foreground">{profile.privacy_level}</dd>
              </div>
              {profile.bio ? (
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                    Bio
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground">{profile.bio}</dd>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-[#ead8c2] bg-[#fffdf8] px-3 py-3 text-sm leading-relaxed text-[#6d5849]">
                  Add a short bio on your profile so other travelers can connect with you.
                </p>
              )}
            </dl>

            <Link
              href="/profile"
              className="mt-6 flex min-h-11 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
            >
              Manage profile
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
