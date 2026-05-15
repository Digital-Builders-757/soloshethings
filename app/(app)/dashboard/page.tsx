/**
 * Dashboard — signed-in home base
 */

import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Flag,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProfileErrorFallback } from '@/components/profile/profile-error-fallback'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getMembershipTier } from '@/lib/billing/entitlements'
import { getProfileWithBoundedRepair } from '@/lib/queries/profiles'
import { getAvatarSignedUrl } from '@/lib/storage/avatars'
import { getUser } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

function roleLabel(role: string) {
  if (role === 'client') return 'Community partner'
  return 'Traveler'
}

type ActionTone = 'sun' | 'ember' | 'cream' | 'cocoa'

const actionToneStyles: Record<
  ActionTone,
  {
    card: string
    iconWrap: string
    icon: string
    title: string
    description: string
    badge: string
    cta: string
    chevron: string
  }
> = {
  sun: {
    card: 'border-[#ebcf8b] bg-[linear-gradient(180deg,rgba(247,232,190,0.9)_0%,#fffdf7_100%)] hover:border-[#fab642]/55 hover:shadow-[0_18px_44px_rgba(250,182,66,0.18)]',
    iconWrap: 'bg-white/80 text-[#7a331b] ring-[#ebcf8b]/80',
    icon: 'text-[#d48e11]',
    title: 'text-[#7a331b]',
    description: 'text-[#6f5947]',
    badge: 'border-[#efd79f] bg-white/75 text-[#9c6115]',
    cta: 'text-[#c97b05]',
    chevron: 'text-[#d48e11]',
  },
  ember: {
    card: 'border-[#efc0af] bg-[linear-gradient(180deg,rgba(227,75,22,0.08)_0%,#fff8f3_100%)] hover:border-[#e34b16]/45 hover:shadow-[0_18px_44px_rgba(227,75,22,0.16)]',
    iconWrap: 'bg-[#fff0e8] text-[#7a331b] ring-[#efc0af]/80',
    icon: 'text-[#e34b16]',
    title: 'text-[#7a331b]',
    description: 'text-[#76584a]',
    badge: 'border-[#f4c7b7] bg-white/75 text-[#b44d20]',
    cta: 'text-[#e34b16]',
    chevron: 'text-[#e34b16]',
  },
  cream: {
    card: 'border-[#ead8c2] bg-[linear-gradient(180deg,rgba(255,250,244,0.98)_0%,rgba(247,232,190,0.38)_100%)] hover:border-[#d8bc96] hover:shadow-[0_18px_42px_rgba(122,51,27,0.12)]',
    iconWrap: 'bg-white/85 text-[#7a331b] ring-[#ead8c2]/80',
    icon: 'text-[#a14b24]',
    title: 'text-[#7a331b]',
    description: 'text-[#6d5849]',
    badge: 'border-[#ead8c2] bg-white/75 text-[#8b5f43]',
    cta: 'text-[#a14b24]',
    chevron: 'text-[#a14b24]',
  },
  cocoa: {
    card: 'border-[#9b6249]/30 bg-[linear-gradient(160deg,rgba(122,51,27,0.92)_0%,rgba(95,43,26,0.98)_100%)] hover:border-[#f7e8be]/35 hover:shadow-[0_20px_50px_rgba(74,28,14,0.28)]',
    iconWrap: 'bg-white/12 text-[#fff5df] ring-white/10',
    icon: 'text-[#fab642]',
    title: 'text-[#fff7ea]',
    description: 'text-[#f3dbc2]',
    badge: 'border-white/15 bg-white/10 text-[#f7e8be]',
    cta: 'text-[#fab642]',
    chevron: 'text-[#f7e8be]',
  },
}

function ActionTile({
  href,
  icon: Icon,
  title,
  description,
  cta,
  eyebrow,
  tone,
}: {
  href: string
  icon: LucideIcon
  title: string
  description: string
  cta: string
  eyebrow: string
  tone: ActionTone
}) {
  const toneStyles = actionToneStyles[tone]

  return (
    <li>
      <Link
        href={href}
        className={cn(
          'group flex min-h-[11rem] gap-4 rounded-[1.55rem] border p-4 transition sm:min-h-[12rem] sm:flex-col sm:p-5',
          toneStyles.card
        )}
      >
        <div className="flex items-start justify-between gap-3 sm:min-h-[3.75rem]">
          <span
            className={cn(
              'inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]',
              toneStyles.badge
            )}
          >
            {eyebrow}
          </span>
          <ChevronRight
            className={cn(
              'mt-0.5 h-5 w-5 shrink-0 opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100',
              toneStyles.chevron
            )}
            aria-hidden
          />
        </div>

        <div className="flex gap-4 sm:flex-1 sm:flex-col sm:justify-between">
          <span
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 sm:h-11 sm:w-11',
              toneStyles.iconWrap
            )}
          >
            <Icon className={cn('h-5 w-5', toneStyles.icon)} aria-hidden />
          </span>

          <span className="min-w-0 flex-1 sm:flex-none">
            <span className={cn('block font-serif text-lg font-bold', toneStyles.title)}>{title}</span>
            <span className={cn('mt-2 block text-sm leading-relaxed', toneStyles.description)}>
              {description}
            </span>
            <span className={cn('mt-4 inline-flex items-center gap-1 text-sm font-semibold', toneStyles.cta)}>
              {cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </span>
        </div>
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
  const membershipTier = await getMembershipTier(user.id)
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
  const remainingChecklistCount = profileChecklist.length - completedChecklistCount

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

  const membershipLabel = membershipTier === 'full' ? 'Full access' : 'Starter mode'
  const membershipDescription =
    membershipTier === 'full'
      ? 'You can move through the full community experience from here.'
      : 'You are in limited-access mode until you start the subscription flow.'

  const quickActions: Array<{
    href: string
    icon: LucideIcon
    title: string
    description: string
    cta: string
    eyebrow: string
    tone: ActionTone
  }> = [
    {
      href: '/profile',
      icon: UserRound,
      title: 'Profile & visibility',
      description: 'Username, bio, and who can see your details.',
      cta: 'Open profile',
      eyebrow: 'Identity',
      tone: 'sun',
    },
    {
      href: '/blog',
      icon: BookOpen,
      title: 'Travel + SHE Things',
      description: 'Stories, notes, and guides from the road.',
      cta: 'Read the blog',
      eyebrow: 'Read',
      tone: 'cream',
    },
    {
      href: '/places',
      icon: MapPin,
      title: 'Browse member stories',
      description: 'See public community posts and keep your own private stories in view.',
      cta: 'Open the feed',
      eyebrow: 'Explore',
      tone: 'ember',
    },
    {
      href: '/saved',
      icon: Heart,
      title: 'Saved stories',
      description: 'Keep community stories you want to revisit in one private list.',
      cta: 'Open saved stories',
      eyebrow: 'Keep',
      tone: 'cocoa',
    },
    {
      href: '/reports',
      icon: Flag,
      title: 'Your safety reports',
      description: 'Track the moderation status of the public stories you have flagged.',
      cta: 'Open reports',
      eyebrow: 'Safety',
      tone: 'cream',
    },
    {
      href: '/submit',
      icon: Sparkles,
      title: 'Submit a story',
      description: 'Share a lesson, ritual, or field note with the collective.',
      cta: 'Start a submission',
      eyebrow: 'Create',
      tone: 'sun',
    },
  ]

  if (profile.role === 'admin') {
    quickActions.push({
      href: '/admin/moderation',
      icon: ShieldCheck,
      title: 'Moderation queue',
      description: 'Review member reports and publish honest status updates.',
      cta: 'Open moderation',
      eyebrow: 'Admin',
      tone: 'ember',
    })
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#f7e8be]/55 via-[#fffaf0]/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 top-24 h-48 w-48 rounded-full bg-[#fab642]/18 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-28 h-56 w-56 rounded-full bg-[#e34b16]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/3 top-[28rem] h-52 w-52 rounded-full bg-[#7a331b]/8 blur-3xl"
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

            <p className="eyebrow text-[0.65rem] sm:text-xs sm:tracking-[0.28em]">Your home base</p>

            <div className="mt-5 flex items-center gap-4 rounded-[1.4rem] border border-[#ead8c2]/80 bg-white/75 p-3 shadow-[0_18px_40px_rgba(122,51,27,0.08)] sm:inline-flex">
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
                  {profile.avatar_url
                    ? 'Avatar live and ready across your signed-in spaces.'
                    : 'Add an avatar to make your account feel more like yours.'}
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
              <span className="inline-flex items-center rounded-full border border-[#efc0af] bg-[#fff2eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#b44d20]">
                {membershipLabel}
              </span>
              {memberSinceLabel ? (
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a14b24]/90">
                  Member since {memberSinceLabel}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 max-w-3xl font-serif text-display-md text-[#7a331b] sm:text-display-lg">
              Welcome back, <span className="text-[#e34b16] italic" data-testid="user-name">{displayName}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6d5849] sm:text-[1.05rem] sm:leading-7">
              Everything signed-in lives here. Start by tightening your profile, then move into stories,
              places, and whatever brave thing is next.
            </p>
            <p className="mt-2 max-w-2xl text-sm text-[#6d5849]/90">
              <span className="sr-only">Account email:</span>
              Signed in as <span className="font-medium text-[#7a331b]">{user.email}</span>
            </p>

            <div className="mt-4 rounded-[1.35rem] border border-[#ead8c2] bg-[linear-gradient(135deg,#fffaf4_0%,rgba(247,232,190,0.4)_100%)] px-4 py-3 text-sm text-[#7a331b] shadow-[0_12px_30px_rgba(122,51,27,0.06)]">
              {membershipTier === 'full' ? (
                <span>You have full community access (active trial or paid membership).</span>
              ) : (
                <span>
                  Limited community access until you subscribe (7-day trial, then US $3.99/mo via Stripe).{' '}
                  <Link
                    href="/subscribe"
                    className="font-semibold text-[#e34b16] underline underline-offset-2 hover:text-[#c74010]"
                  >
                    Billing
                  </Link>
                  .
                </span>
              )}
            </div>

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

            <nav className="mt-8 border-t border-[#ead8c2]/70 pt-6 sm:mt-10" aria-label="Explore more of the site">
              <p className="eyebrow text-[0.65rem] tracking-[0.26em]">Browse next</p>
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

        <section aria-labelledby="dash-start-here-heading" className="mt-6 grid gap-4 sm:mt-7 lg:grid-cols-3">
          <article className="editorial-card-sun relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/35 blur-2xl" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Profile readiness</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-[#c97b05] ring-1 ring-[#ebcf8b]/70">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <h2 id="dash-start-here-heading" className="mt-3 font-serif text-xl font-bold text-[#7a331b]">
              {completedChecklistCount} of {profileChecklist.length} basics done
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6d5849]">
              {remainingChecklistCount === 0
                ? 'Your account foundation is in great shape — now the fun part is using it.'
                : `${remainingChecklistCount} quick ${remainingChecklistCount === 1 ? 'touch' : 'touches'} will make your space feel much more complete.`}
            </p>
            <ul className="mt-5 space-y-3 text-sm text-[#6d5849]">
              {profileChecklist.map((item) => (
                <li key={item.label} className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-3 ring-1 ring-white/70">
                  <span
                    className={item.done ? 'h-2.5 w-2.5 rounded-full bg-[#e34b16]' : 'h-2.5 w-2.5 rounded-full bg-[#d9c4a8]'}
                    aria-hidden
                  />
                  <span className={item.done ? 'font-medium text-[#7a331b]' : undefined}>{item.label}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="editorial-card-ember relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[#ffd2c0]/45 blur-2xl" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <p className="eyebrow text-[0.65rem] tracking-[0.22em]">Best next move</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-[#e34b16] ring-1 ring-[#efc0af]/80">
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <h2 className="mt-3 font-serif text-xl font-bold text-[#7a331b]">{nextStep.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6d5849]">{nextStep.description}</p>
            <Link
              href={nextStep.href}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#e34b16] px-5 text-sm font-semibold text-white transition hover:bg-[#c74010]"
            >
              {nextStep.cta}
            </Link>
          </article>

          <article className="editorial-card-cocoa relative overflow-hidden p-5 text-[#fff5df] sm:p-6">
            <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-[#fab642]/14 blur-2xl" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <p className="eyebrow-light text-[0.65rem] tracking-[0.22em]">Live right now</p>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-[#fab642] ring-1 ring-white/10">
                <Heart className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <h2 className="mt-3 font-serif text-xl font-bold text-[#fff7ea]">What this member area already does well</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#f3dbc2]">A little more color, a little more delight, same honest product underneath.</p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#f3dbc2]">
              {liveNowItems.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl bg-white/5 px-3 py-3 ring-1 ring-white/8">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fab642]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <div className="mt-10 grid gap-10 lg:mt-11 lg:grid-cols-[minmax(0,1fr)_min(100%,20rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <aside
            className="editorial-card-strong order-1 overflow-hidden p-5 sm:p-6 lg:sticky lg:top-24 lg:order-2 lg:self-start"
            aria-labelledby="dash-snapshot-heading"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="dash-snapshot-heading" className="font-serif text-lg font-bold text-[#7a331b]">
                  Profile snapshot
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  How you show up across Solo SHE Things.
                  <span className="font-medium text-[#7a331b]"> @{profile.username}</span>
                </p>
              </div>
              <span className="inline-flex rounded-full border border-[#ebcf8b] bg-[#fff8df] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#a14b24]">
                {membershipLabel}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-[#ead8c2] bg-white/80 px-3 py-1 text-xs font-semibold text-[#7a331b]">
                {roleLabel(profile.role)}
              </span>
              <span className="inline-flex rounded-full border border-[#efc0af] bg-[#fff2eb] px-3 py-1 text-xs font-semibold text-[#b44d20] capitalize">
                {profile.privacy_level}
              </span>
            </div>

            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                  Display name
                </dt>
                <dd className="mt-1.5 font-medium text-foreground">{profile.full_name?.trim() || profile.username}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#a14b24]">
                  Membership
                </dt>
                <dd className="mt-1.5 leading-relaxed text-muted-foreground">{membershipDescription}</dd>
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

          <section aria-labelledby="dash-actions-heading" className="order-2 min-w-0 lg:order-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <h2 id="dash-actions-heading" className="font-serif text-xl font-bold text-[#7a331b] sm:text-2xl">
                  Quick actions
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6d5849] sm:text-base">
                  Common places members open from here — now with a little more energy and visual rhythm.
                </p>
              </div>
            </div>

            <ul className="mt-8 grid list-none gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-5">
              {quickActions.map((action) => (
                <ActionTile key={action.href} {...action} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
