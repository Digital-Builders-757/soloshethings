/**
 * Dashboard — signed-in home base
 */

import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BookOpen,
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
import { getMembershipTier } from '@/lib/billing/entitlements'
import { getProfileWithBoundedRepair } from '@/lib/queries/profiles'
import { getAvatarSignedUrl } from '@/lib/storage/avatars'
import { getUser } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { DashboardHero } from './components/dashboard-hero'
import { DashboardModules } from './components/dashboard-modules'

function roleLabel(role: string) {
  if (role === 'client') return 'Community partner'
  return 'Traveler'
}

type ActionTone = 'sun' | 'ember' | 'cream' | 'cocoa'

/**
 * Stripped to the essentials: tile background, and four text roles.
 * No icon-wrap boxes, no pill badges, no hover shadows.
 * Hover lift is handled globally by .dash-card-lift.
 * The result reads editorial rather than product.
 */
const actionToneStyles: Record<
  ActionTone,
  {
    tile: string
    eyebrow: string
    icon: string
    title: string
    description: string
    cta: string
  }
> = {
  sun: {
    /* Border at /38: edge suggests rather than declares */
    tile: 'border-[#eed9a0]/38 bg-[linear-gradient(165deg,rgba(247,232,190,0.72)_0%,rgba(255,253,247,0.97)_100%)]',
    eyebrow: 'text-[#9c6115]',
    icon: 'text-[#d48e11]',
    /* #713522: +2° warmer hue, -10% saturation — ink on warm stock, less digitally crisp */
    title: 'text-[#713522]',
    description: 'text-[#7a5e4a]',
    cta: 'text-[#c97b05]',
  },
  ember: {
    tile: 'border-[#efc0af]/38 bg-[linear-gradient(165deg,rgba(227,75,22,0.07)_0%,rgba(255,248,243,0.97)_100%)]',
    eyebrow: 'text-[#b44d20]',
    icon: 'text-[#e34b16]',
    title: 'text-[#713522]',
    description: 'text-[#76584a]',
    cta: 'text-[#e34b16]',
  },
  cream: {
    tile: 'border-[#ead8c2]/38 bg-[linear-gradient(165deg,rgba(255,250,244,0.97)_0%,rgba(247,232,190,0.28)_100%)]',
    eyebrow: 'text-[#8b5f43]',
    icon: 'text-[#a14b24]',
    title: 'text-[#713522]',
    description: 'text-[#6d5849]',
    cta: 'text-[#a14b24]',
  },
  cocoa: {
    tile: 'border-white/12 bg-[linear-gradient(160deg,rgba(122,51,27,0.90)_0%,rgba(95,43,26,0.96)_100%)]',
    eyebrow: 'text-[#f7c89e]',
    icon: 'text-[#fab642]',
    title: 'text-[#fff7ea]',
    description: 'text-[#f3dbc2]',
    cta: 'text-[#fab642]',
  },
}

type ActionVariant = 'featured' | 'compact' | 'quiet'

/**
 * ActionTile — editorial navigation object with variant hierarchy.
 *
 * Variants:
 *   featured  — spans 2 columns; horizontal layout; large display title;
 *               feels like a magazine feature lead. One per grid.
 *   compact   — reduced padding + quieter title scale; functional utilities.
 *   quiet     — no visible border (tile embeds into page surface, not floating).
 *   (default) — standard weight: the editorial baseline.
 *
 * liClassName — escape hatch for deliberate vertical stagger offsets
 *               (e.g. sm:mt-4 to break column lockstep).
 */
function ActionTile({
  href,
  icon: Icon,
  title,
  description,
  cta,
  eyebrow,
  tone,
  variant,
  liClassName,
}: {
  href: string
  icon: LucideIcon
  title: string
  description: string
  cta: string
  eyebrow: string
  tone: ActionTone
  variant?: ActionVariant
  liClassName?: string
}) {
  const s = actionToneStyles[tone]
  const isCompact = variant === 'compact'
  const isQuiet = variant === 'quiet'

  /* ── FEATURED variant — full-width editorial anchor ─────────────────────── */
  if (variant === 'featured') {
    return (
      <li className="sm:col-span-2 lg:-ml-2">
        <Link
          href={href}
          className={cn(
            /* Base shadow at 5% opacity: foreground plane signal.
             * Not perceived as a shadow — perceived as the tile being
             * slightly closer than the others. Subconscious depth only. */
            'group relative block overflow-hidden rounded-2xl border p-6 dash-card-lift shadow-[0_4px_20px_rgba(122,51,27,0.05)] sm:flex sm:items-center sm:justify-between sm:gap-10 sm:p-8',
            s.tile
          )}
        >
          {/*
           * Paper warmth — light settling unevenly into one region of the surface.
           * Real paper is never tonally uniform. This creates the physical impression
           * without being identifiable as a gradient. 0.045 opacity only.
           */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              background:
                'radial-gradient(circle at 24% 32%, rgba(250,182,66,0.42), transparent 58%)',
            }}
          />

          {/* Left: label → large title → description → CTA */}
          <div className="min-w-0 flex-1">
            {/* Eyebrow — slightly more open tracking for the wider featured context */}
            <p className={cn('text-[0.62rem] font-bold uppercase tracking-[0.26em]', s.eyebrow)}>
              {eyebrow}
            </p>
            {/* Title — tighter leading on large display type, optically correct */}
            <p className={cn(
              'mt-3 font-display font-black leading-[1.08] text-[1.55rem] sm:text-[1.85rem]',
              s.title
            )}>
              {title}
            </p>
            {/* Description — extra breath after the large title */}
            <p className={cn('mt-3 text-[0.85rem] leading-relaxed sm:max-w-[52ch]', s.description)}>
              {description}
            </p>
            {/* CTA — more vertical distance so it feels placed, not docked */}
            <p className={cn('mt-6 flex items-center gap-1.5 text-sm font-semibold', s.cta)}>
              {cta}
              {/* translate-x-0.5 (2px): barely perceptible, atmospheric not interactive */}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </p>
          </div>

          {/*
           * Right: oversized ambient icon — compositional, not UI.
           * Hidden on mobile (content stacks). On desktop creates
           * the left-heavy / right-open editorial balance typical
           * of magazine feature layouts.
           */}
          <Icon
            className={cn('mt-5 h-7 w-7 shrink-0 opacity-30 sm:mt-0 sm:h-14 sm:w-14', s.icon)}
            aria-hidden
          />
        </Link>
      </li>
    )
  }

  /* ── REGULAR / COMPACT / QUIET variants ─────────────────────────────────── */
  return (
    <li className={liClassName}>
      <Link
        href={href}
        className={cn(
          'group relative block overflow-hidden rounded-2xl dash-card-lift',
          /* Compact reduces padding; regular is the editorial baseline */
          isCompact ? 'p-4 sm:p-5' : 'p-5 sm:p-6',
          /* Quiet removes the outline so the tile embeds into the page surface */
          isQuiet ? undefined : 'border',
          s.tile
        )}
      >
        {/*
         * Cocoa tile only: ultra-soft dot texture that breaks the digital-smooth
         * surface of the dark background. Inked, not noisy. 0.035 opacity only.
         * The tile should feel printed, not rendered.
         */}
        {tone === 'cocoa' && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-[0.035]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.18) 0.6px, transparent 0.6px)',
              backgroundSize: '5px 5px',
            }}
          />
        )}

        {/* Category label + ambient icon */}
        <div className="flex items-start justify-between gap-3">
          <p className={cn('text-[0.62rem] font-bold uppercase tracking-[0.22em]', s.eyebrow)}>
            {eyebrow}
          </p>
          {/*
           * Icon: opacity-45 → opacity-55 on hover (10% shift, not 27%).
           * duration-500: the change arrives slowly, like warmth breathing,
           * not like a UI element responding to a cursor event.
           */}
          <Icon
            className={cn(
              'shrink-0 opacity-45 transition-opacity duration-500 group-hover:opacity-55',
              isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4',
              s.icon
            )}
            aria-hidden
          />
        </div>

        {/* Title — scale varies by variant */}
        <p className={cn(
          'font-display font-black leading-tight',
          isCompact ? 'mt-2.5 text-[0.95rem]' : 'mt-3 text-[1.05rem] sm:text-[1.1rem]',
          s.title
        )}>
          {title}
        </p>

        {/* Description — regular gets mt-2 (one step more than compact's mt-1) */}
        <p className={cn(
          'leading-relaxed',
          isCompact ? 'mt-1 text-[0.78rem]' : 'mt-2 text-[0.82rem]',
          s.description
        )}>
          {description}
        </p>

        {/* CTA */}
        <p className={cn(
          'flex items-center gap-1 font-semibold',
          isCompact ? 'mt-3 text-[0.72rem]' : 'mt-4 text-[0.75rem]',
          s.cta
        )}>
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
        </p>
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

  /**
   * Ordered for editorial eye-flow:
   *
   *   [FEATURED: Submit a story ──────────────────── full width, entry point]
   *   [Browse member stories  ]  [Profile (compact)]   ← row 1, left-heavy
   *   [     ↓ 16px stagger    ]  [                 ]
   *   [Saved stories (dark)   ]  [Travel + SHE Things]  ← row 2, dark anchors left
   *   [Safety reports (quiet) ]  [          ← empty = editorial negative space]
   *
   * The diagonal left-column rhythm (Browse → Saved dropped by mt-4) pulls
   * the eye toward the bottom-right where the Identity Record sidebar sits.
   */
  const quickActions: Array<{
    href: string
    icon: LucideIcon
    title: string
    description: string
    cta: string
    eyebrow: string
    tone: ActionTone
    variant?: ActionVariant
    liClassName?: string
  }> = [
    /* ── Featured anchor — editorial lead tile ── */
    {
      href: '/submit',
      icon: Sparkles,
      title: 'Submit a story',
      description: 'Share a lesson, ritual, or field note with the collective.',
      cta: 'Start a submission',
      eyebrow: 'Create',
      tone: 'sun',
      variant: 'featured',
    },
    /* ── Supporting tiles — row 1 ── */
    {
      href: '/places',
      icon: MapPin,
      title: 'Browse member stories',
      description: 'See public community posts and keep your own private stories in view.',
      cta: 'Open the feed',
      eyebrow: 'Explore',
      tone: 'ember',
      /* +4px downward drift: loosens the row without displacing it */
      liClassName: 'lg:mt-1',
    },
    {
      href: '/profile',
      icon: UserRound,
      title: 'Profile & visibility',
      description: 'Username, bio, and who can see your details.',
      cta: 'Open profile',
      eyebrow: 'Identity',
      tone: 'sun',
      variant: 'compact',
      /* -8px upward: the compact tile rides slightly above the row, creating tension */
      liClassName: 'lg:-mt-2',
    },
    /* ── Supporting tiles — row 2 (Saved dropped for diagonal rhythm) ── */
    {
      href: '/saved',
      icon: Heart,
      title: 'Saved stories',
      description: 'Keep community stories you want to revisit in one private list.',
      cta: 'Open saved stories',
      eyebrow: 'Keep',
      tone: 'cocoa',
      /* Visual anchor of the lower cluster — do not move */
      liClassName: 'sm:mt-4',
    },
    {
      href: '/blog',
      icon: BookOpen,
      title: 'Travel + SHE Things',
      description: 'Stories, notes, and guides from the road.',
      cta: 'Read the blog',
      eyebrow: 'Read',
      tone: 'cream',
      /* +12px: the most open stagger in the cluster, creates airy diagonal */
      liClassName: 'lg:mt-3',
    },
    /* ── Quiet utility — row 3, left only (right stays empty = negative space) ── */
    {
      href: '/reports',
      icon: Flag,
      title: 'Your safety reports',
      description: 'Track the moderation status of the public stories you have flagged.',
      cta: 'Open reports',
      eyebrow: 'Safety',
      tone: 'cream',
      variant: 'quiet',
      /* -4px: slight uptuck so the quiet tile doesn't perfectly close the grid */
      liClassName: 'lg:-mt-1',
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

      {/*
       * ── LOWER-SECTION ENVIRONMENTAL FIELDS ──────────────────────────────
       *
       * The four blobs above cover the hero and editorial modules.
       * Without these, the utility landscape and Identity Record sit on a
       * perceptually flat, atmospherically dry plane.
       *
       * These two fields at 5% and 4% opacity are functionally invisible.
       * Their combined effect is a very soft ambient warmth variation across
       * the lower page — like candlelight varying across warm paper stock.
       * The viewer feels the space is alive; they do not see the source.
       *
       * Sizes are large (28rem / 22rem) + blur-3xl so they spread as pure
       * atmospheric tint rather than identifiable objects.
       */}
      <div
        className="pointer-events-none absolute left-[5%] top-[58rem] h-[28rem] w-[28rem] rounded-full bg-[#fab642]/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-4%] top-[66rem] h-[22rem] w-[22rem] rounded-full bg-[#e34b16]/4 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-9 lg:px-8 lg:pb-20 lg:pt-11">
        <DashboardHero
          avatarUrl={avatarUrl}
          displayName={displayName}
          email={user.email ?? ''}
          role={profile.role}
          membershipTier={membershipTier}
          membershipLabel={membershipLabel}
          memberSinceLabel={memberSinceLabel}
          profileChecklist={profileChecklist}
        />

        <DashboardModules
          completedCount={completedChecklistCount}
          totalCount={profileChecklist.length}
          profileChecklist={profileChecklist}
          remainingCount={remainingChecklistCount}
          nextStep={nextStep}
          liveNowItems={liveNowItems}
        />

        {/*
         * ── HORIZONTAL COMPOSITIONAL ANCHOR ────────────────────────────────
         *
         * A single thin warm gradient rule with generous vertical whitespace.
         * Almost invisible consciously. Structurally important subconsciously.
         * Creates a reading pause — a breath — between the three editorial
         * modules above and the utility system below, re-establishing the
         * publication rhythm before the eye descends.
         */}
        <div className="my-12 sm:my-14 lg:my-16" aria-hidden>
          <hr className="editorial-rule" />
        </div>

        {/* xl sidebar: 22rem → 20.5rem — tile landscape gains dominance */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,20rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_20.5rem]">

          {/*
           * ── IDENTITY RECORD ASIDE ────────────────────────────────────────
           *
           * Phase 6 architectural composition:
           * — Border reduced to top-edge only. The block has a defined starting
           *   point (the warm top rule) but dissolves downward, flowing off the
           *   bottom of its zone. Like a contributor profile in a magazine margin.
           * — No overflow-hidden: content is text only, no clipping needed.
           * — Asymmetric padding (heavy bottom) creates "open bottom" — the block
           *   doesn't feel "filled from top to bottom".
           * — lg:mt-8 diagonal offset: sidebar arrives 32px below the Quick Actions
           *   heading. The eye travels left→down through tiles, then diagonally
           *   right-and-down to the sidebar. Intentional reading path.
           * — Lighter background tint: a zone suggestion, not a container.
           */}
          <aside
            className="relative order-1 overflow-hidden rounded-2xl border-t border-[#ead8c2]/45 bg-[#fffdf8]/65 px-6 pt-5 pb-10 sm:px-7 sm:pt-6 sm:pb-12 lg:sticky lg:top-24 lg:order-2 lg:mt-12 lg:self-start"
            aria-labelledby="dash-snapshot-heading"
            aria-label="Your member identity"
          >
            {/*
             * Tonal paper modulation — real paper planes are never perfectly flat.
             * A faint cool-to-warm top-to-bottom breathing makes the surface feel
             * dimensional, like paper under diffuse window light. 0.03 opacity only.
             * Must sit behind all text (z-index: below content flow).
             */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.55), transparent 38%, rgba(250,182,66,0.18) 100%)',
              }}
            />

            {/* Section label */}
            <p className="eyebrow text-[0.62rem] tracking-[0.28em]">Identity record</p>
            <hr className="editorial-rule mt-3" />

            {/* Display name — typographic anchor, tighter leading on display size */}
            <div className="mt-5">
              <h2
                id="dash-snapshot-heading"
                className="font-display text-[1.6rem] font-black leading-[1.05] text-[#7a331b]"
              >
                {displayName}
              </h2>
              {/* Handle + name are a unit — tight proximity */}
              <p className="mt-0.5 text-sm text-[#9a7258]">@{profile.username}</p>
            </div>

            {/*
             * Metadata — label / value pairs with hairline separators between each field.
             * Removes the slot-machine feeling of uniform space-y-5.
             * Each thin warm rule creates editorial pacing, like a printed credits list.
             */}
            <dl className="mt-6 text-sm">
              <div className="pb-4">
                <dt className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#a14b24]">
                  Role
                </dt>
                <dd className="mt-1.5 font-medium text-[#7a331b]">
                  {roleLabel(profile.role)}
                  <span className="ml-2 font-normal text-[#9a7258] capitalize">
                    · {profile.privacy_level}
                  </span>
                </dd>
              </div>

              <div className="border-t border-[#ead8c2]/20 pt-4 pb-4">
                <dt className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#a14b24]">
                  Membership
                </dt>
                <dd className="mt-1.5 leading-relaxed text-[#6d5849]">
                  {membershipDescription}
                </dd>
              </div>

              {memberSinceLabel && (
                <div className="border-t border-[#ead8c2]/20 pt-4 pb-4">
                  <dt className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#a14b24]">
                    Member since
                  </dt>
                  <dd className="mt-1.5 text-[#6d5849]">{memberSinceLabel}</dd>
                </div>
              )}

              <div className="border-t border-[#ead8c2]/20 pt-4">
                <dt className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#a14b24]">
                  Bio
                </dt>
                {profile.bio ? (
                  <dd className="mt-1.5 leading-relaxed text-[#6d5849]">{profile.bio}</dd>
                ) : (
                  <dd className="mt-1.5 italic text-[#9a7258]/70">
                    No bio yet — add one in your profile.
                  </dd>
                )}
              </div>
            </dl>

            {/*
             * Footer: a single quiet link, not a status bar.
             * The membership label is already in the Membership metadata row —
             * repeating it here created a "dashboard footer bar" reading.
             * Removing it leaves a clean typographic CTA that feels placed.
             */}
            <div className="mt-8 flex items-center justify-end">
              <Link
                href="/profile"
                className="group flex items-center gap-1 text-[0.8rem] font-semibold text-[#7a331b] transition-colors hover:text-[#e34b16]"
              >
                Open profile
                <ArrowRight
                  className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </aside>

          {/* ── QUICK ACTIONS SECTION ──────────────────────────────────────── */}
          {/* lg:pr-3: 12px of asymmetric right padding creates whitespace tension
            * between the tile field edge and the sidebar — breaks rectangular closure */}
          <section aria-labelledby="dash-actions-heading" className="order-2 min-w-0 lg:order-1 lg:pr-3">
            {/* Editorial section heading — eyebrow close, heading dominant */}
            <div>
              {/* Slightly more open tracking at section level signals authority */}
              <p className="eyebrow text-[0.62rem] tracking-[0.32em]">Your space</p>
              {/* Tight mt-1.5: eyebrow and heading are optically a single typographic unit */}
              <h2
                id="dash-actions-heading"
                className="mt-1.5 font-display text-[2rem] font-black leading-[1.08] text-[#7a331b] sm:text-[2.5rem]"
              >
                Quick actions
              </h2>
            </div>

            {/*
             * mt-9 sm:mt-11: more gravity between heading and tiles.
             * sm:grid-cols-[1.02fr_0.98fr]: 2% column width asymmetry.
             * The viewer feels the columns are not perfectly equal;
             * they cannot consciously measure the difference.
             * Creates the subconscious sense of editorial composition
             * rather than a mechanical two-column grid.
             */}
            <ul className="mt-9 grid list-none items-start gap-x-4 gap-y-[0.9rem] sm:mt-11 sm:grid-cols-[1.02fr_0.98fr] sm:gap-x-5 sm:gap-y-[1.05rem]">
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
