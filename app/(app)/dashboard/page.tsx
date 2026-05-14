/**
 * Dashboard — signed-in home base
 */

import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Heart,
  MapPin,
  Sparkles,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProfileErrorFallback } from '@/components/profile/profile-error-fallback'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getProfileWithBoundedRepair } from '@/lib/queries/profiles'
import { getAvatarSignedUrl } from '@/lib/storage/avatars'
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
        className="editorial-card group flex min-h-[5.25rem] gap-4 p-4 transition hover:border-[#e34b16]/30 hover:shadow-[0_12px_36px_rgba(122,51,27,0.09)] sm:min-h-0 sm:flex-col sm:p-5"
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
    redirect('/login?redirectTo=/dashboard')
  }

  const profile = await getProfileWithBoundedRepair(user.id, user.email)

  if (!profile) {
    return <ProfileErrorFallback context="dashboard" userEmail={user.email} />
  }

  const avatarUrl = await getAvatarSignedUrl(profile.avatar_url)
  const displayName = profile.full_name?.trim() || profile.username
  const memberSinceLabel = profile.created_at
    ? new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(
        new Date(profile.created_at)
      )
    : null

  const profileChecklist = [
    { label: 'Avatar added', done: Boolean(profile.avatar_url) },
    { label: 'Display name added', done: Boolean(profile.full_name?.trim()) },
    { label: 'Bio written', done: Boolean(profile.bio?.trim()) },
    { label: 'Visibility reviewed', done: Boolean(profile.privacy_level) },
  ]

  const completedChecklistCount = profileChecklist.filter((item) => item.done).length

  const nextStep = !profile.avatar_url
    ? {
        title: 'Add a profile photo',
        description: 'A warm recognizable avatar helps your account feel finished right away.',
        href: '/profile',
        cta: 'Upload avatar',
      }
    : !profile.full_name?.trim()
      ? {
          title: 'Add your name',
          description: 'Finish the basics so your member card feels like you right away.',
          href: '/profile',
          cta: 'Finish profile',
        }
      : !profile.bio?.trim()
        ? {
            title: 'Write a short bio',
            description: 'A few lines gives your dashboard and public profile more shape.',
            href: '/profile',
            cta: 'Add a bio',
          }
        : {
            title: 'Share your first story',
            description: 'Your profile is in good shape. The next meaningful move is publishing something.',
            href: '/submit',
            cta: 'Start a submission',
          }

  const liveNowItems = [
    'Profile editing and visibility settings',
    'An authenticated community feed with public member stories plus your own private posts',
    'A signed-in shell that keeps auth state and account recovery honest',
  ]

  return (
    <div className="relative isolate">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#f7e8be]/50 via-[#fffaf0]/30 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-9 lg:px-8 lg:pb-20 lg:pt-11">
        <header className="editorial-card-strong overflow-hidden">
          <div className="relative px-5 py-8 sm:p-8 md:p-10 lg:p-11">
            <div
              className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#fab642]/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-[#e34b16]/10 blur-3xl"
              aria-hidden
            />

            <p className="eyebrow text-[0.65rem] sm:text-xs sm:tracking-[0.28em]">
              Your home base
            </p>

            <div className="mt-5 flex items-center gap-4 rounded-[1.25rem] border border-[#ead8c2]/80 bg-white/70 p-3 sm:inline-flex">
              <Avatar
                src={avatarUrl}
                fallback={displayName.slice(0, 2).toUpperCase()}
                size="xl"
                alt={`${displayName} avatar`}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                  Profile preview
                </p>
                <p className="truncate text-sm font-semibold text-[#7a331b]">{displayName}</p>
                <p className="text-sm text-[#6d5849]">
                  {profile.avatar_url ? 'Avatar live and ready across your signed-in spaces.' : 'Add an avatar to make your account feel more like yours.'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge
                variant="neutral"
                size="sm"
                className="border border-[#ead8c2] bg-white/90 font-semibold capitalize text-[#7a331b]"
              >
                {roleLabel(profile.role)}
              </Badge>
              {memberSinceLabel ? (
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a14b24]/90">
                  Member since {memberSinceLabel}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 max-w-3xl font-serif text-display-md text-[#7a331b] sm:text-display-lg">
              Welcome back,{' '}
              <span
                className="text-[#e34b16] italic"
                data-testid="user-name"
              >
                {displayName}
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6d5849] sm:text-[1.05rem] sm:leading-7">
              Everything signed-in lives here. Start by tightening your profile, then move into stories,
              places, and whatever brave thing is next.
            </p>
            <p className="mt-2 max-w-2xl text-sm text-[#6d5849]/90">
              <span className="sr-only">Account email:</span>
              Signed in as <span className="font-medium text-[#7a331b]">{user.email}</span>
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
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
                Solo SHEntries
              </Link>
              <Link
                href="/submit"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-transparent px-1 text-sm font-semibold text-[#e34b16] underline-offset-4 hover:underline sm:px-3"
              >
                Share a story →
              </Link>
            </div>

            <nav
              className="mt-8 border-t border-[#ead8c2]/70 pt-6 sm:mt-10"
              aria-label="Explore more of the site"
            >
              <p className="eyebrow text-[0.65rem] tracking-[0.26em]">
                Browse next
              </p>
              <ul className="mt-3 flex list-none flex-wrap gap-x-1 gap-y-2 text-sm font-semibold text-[#7a331b]">
                <li>
                  <Link className="rounded-md px-1.5 py-1 hover:text-[#e34b16]" href="/blog">
                    Blog
                  </Link>
                </li>
                <li aria-hidden className="select-none text-[#d9c4a8]">
                  ·
                </li>
                <li>
                  <Link className="rounded-md px-1.5 py-1 hover:text-[#e34b16]" href="/map">
                    Map
                  </Link>
                </li>
                <li aria-hidden className="select-none text-[#d9c4a8]">
                  ·
                </li>
                <li>
                  <Link className="rounded-md px-1.5 py-1 hover:text-[#e34b16]" href="/sprint">
                    Sprint
                  </Link>
                </li>
                <li aria-hidden className="select-none text-[#d9c4a8]">
                  ·
                </li>
                <li>
                  <Link className="rounded-md px-1.5 py-1 hover:text-[#e34b16]" href="/shop">
                    Shop
                  </Link>
                </li>
                <li aria-hidden className="select-none text-[#d9c4a8]">
                  ·
                </li>
                <li>
                  <Link className="rounded-md px-1.5 py-1 hover:text-[#e34b16]" href="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <section
          aria-labelledby="dash-start-here-heading"
          className="mt-6 grid gap-4 sm:mt-7 lg:grid-cols-3"
        >
          <article className="editorial-card p-5 sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">
              Profile readiness
            </p>
            <h2
              id="dash-start-here-heading"
              className="mt-3 font-serif text-xl font-bold text-[#7a331b]"
            >
              {completedChecklistCount} of {profileChecklist.length} basics done
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-[#6d5849]">
              {profileChecklist.map((item) => (
                <li key={item.label} className="flex items-center gap-3 rounded-xl bg-[#fffdf8] px-3 py-3">
                  <span
                    className={item.done ? 'h-2.5 w-2.5 rounded-full bg-[#e34b16]' : 'h-2.5 w-2.5 rounded-full bg-[#d9c4a8]'}
                    aria-hidden
                  />
                  <span className={item.done ? 'font-medium text-[#7a331b]' : undefined}>{item.label}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="editorial-card-strong overflow-hidden p-5 sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">
              Best next move
            </p>
            <h2 className="mt-3 font-serif text-xl font-bold text-[#7a331b]">{nextStep.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6d5849]">{nextStep.description}</p>
            <Link
              href={nextStep.href}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#e34b16] px-5 text-sm font-semibold text-white transition hover:bg-[#c74010]"
            >
              {nextStep.cta}
            </Link>
          </article>

          <article className="editorial-card p-5 sm:p-6">
            <p className="eyebrow text-[0.65rem] tracking-[0.22em]">
              Live right now
            </p>
            <h2 className="mt-3 font-serif text-xl font-bold text-[#7a331b]">What this member area already does well</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#6d5849]">
              {liveNowItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fab642]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <div className="mt-10 grid gap-10 lg:mt-11 lg:grid-cols-[minmax(0,1fr)_min(100%,20rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <aside
            className="editorial-card order-1 p-5 sm:p-6 lg:sticky lg:top-24 lg:order-2 lg:self-start"
            aria-labelledby="dash-snapshot-heading"
          >
            <h2 id="dash-snapshot-heading" className="font-serif text-lg font-bold text-[#7a331b]">
              Profile snapshot
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              How you show up across Solo SHE Things.<span className="font-medium text-[#7a331b]"> @{profile.username}</span>
            </p>

            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                  Display name
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
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                    Bio
                  </dt>
                  <dd className="mt-1.5">
                    <p className="rounded-xl border border-dashed border-[#ead8c2] bg-[#fffdf8] px-3 py-3 text-sm leading-relaxed text-[#6d5849]">
                      Add a short bio—others see it when your profile is public.
                    </p>
                  </dd>
                </div>
              )}
            </dl>

            <Link
              href="/profile"
              className="mt-7 flex min-h-11 w-full items-center justify-center rounded-full border border-[#ead8c2] bg-white text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
            >
              Open full profile
            </Link>
          </aside>

          <section
            aria-labelledby="dash-actions-heading"
            className="order-2 min-w-0 lg:order-1"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <h2
                  id="dash-actions-heading"
                  className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl"
                >
                  Quick actions
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6d5849] sm:text-base">
                  Common places members open from here—everything stays one tap away on mobile too.
                </p>
              </div>
            </div>

            <ul className="mt-8 grid list-none gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-5">
              <ActionTile
                href="/profile"
                icon={UserRound}
                title="Profile & visibility"
                description="Username, bio, and who can see your details."
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
                href="/places"
                icon={MapPin}
                title="Browse member stories"
                description="See public community posts and keep your own private stories in view."
                cta="Open the feed"
              />
              <ActionTile
                href="/saved"
                icon={Heart}
                title="Saved stories"
                description="Keep community stories you want to revisit in one private list."
                cta="Open saved stories"
              />
              <ActionTile
                href="/submit"
                icon={Sparkles}
                title="Submit a story"
                description="Share a lesson, ritual, or field note with the collective."
                cta="Start a submission"
              />
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
