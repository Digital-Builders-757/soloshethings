'use client'

import { motion } from 'framer-motion'
import { ArrowRight, UserRound } from 'lucide-react'
import Link from 'next/link'

import { Avatar } from '@/components/ui/avatar'
import { MemberProfileLink } from '@/components/profile/member-profile-link'
import {
  AmbientField,
  ContourBackground,
  GeometryAccent,
  GrainOverlay,
} from '@/components/visual'

interface ProfileChecklistItem {
  label: string
  done: boolean
}

interface DashboardHeroProps {
  avatarUrl: string | null
  displayName: string
  username: string
  email: string
  role: string
  membershipTier: 'full' | 'limited'
  membershipLabel: string
  memberSinceLabel: string | null
  profileChecklist: ProfileChecklistItem[]
}

function roleLabel(role: string) {
  if (role === 'client') return 'Community partner'
  return 'Traveler'
}

const CINEMATIC: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Left field — stagger children in from below */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: CINEMATIC },
  },
}

/** Right art panel — whole field fades + drifts left */
const artPanelVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: CINEMATIC, delay: 0.06 },
  },
}

export function DashboardHero({
  avatarUrl,
  displayName,
  username,
  email,
  role,
  membershipTier,
  membershipLabel,
  memberSinceLabel,
  profileChecklist,
}: DashboardHeroProps) {
  const completedCount = profileChecklist.filter((i) => i.done).length
  const totalCount = profileChecklist.length
  const profilePct = Math.round((completedCount / totalCount) * 100)
  const isFullAccess = membershipTier === 'full'
  const circumference = 2 * Math.PI * 28

  return (
    <header className="dash-hero-panel" aria-label="Member home base">

      {/*
       * ── SIGNATURE "S" — compositional gesture, not branding ────────────
       *
       * An oversized italic Fraunces "S" that spans both the cream and orange
       * panels. Its role is atmospheric: it unifies the two halves by existing
       * across the boundary between them.
       *
       * Design decisions:
       * — Heavily cropped: font-size is ~1.6–2× the panel height. Only the
       *   central section of the letterform is visible (the waist/counter area —
       *   the most ambiguous and beautiful part of the S).
       * — Off-center: left at 57% (slightly past the 55% panel boundary) with a
       *   −2° rotation. The S leans into the orange panel, which is where it
       *   belongs — an orange-field signature that reaches across.
       * — 5% opacity + soft-light blend: soft-light brightens dark areas and
       *   leaves light areas almost unchanged. The S is most present in the
       *   deepest dark of the orange panel and nearly invisible on cream.
       * — z-index: 2 (above panel backgrounds). At 5% opacity, full-opacity
       *   content visually dominates — the letter reads as depth, not layer.
       * — Only rendered at ≥900px where the split layout is active.
       *   On mobile the panels stack and the effect breaks; hiding is correct.
       */}
      <span
        aria-hidden
        className="pointer-events-none absolute hidden select-none font-display font-black italic leading-none min-[900px]:block"
        style={{
          left: '57%',
          top: '50%',
          transform: 'translateX(-50%) translateY(-50%) rotate(-2deg)',
          fontSize: 'clamp(50rem, 95vw, 80rem)',
          color: '#f7e8be',
          opacity: 0.05,
          mixBlendMode: 'soft-light',
          zIndex: 2,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        S
      </span>

      {/* ── LEFT: EDITORIAL TEXT FIELD ─────────────────────────────────── */}
      <motion.div
        className="dash-hero-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="eyebrow text-[0.62rem] tracking-[0.32em]"
        >
          Your creative home base
        </motion.p>

        {/* ── HEADLINE — two typographic moments ── */}
        <motion.h1 variants={itemVariants} className="mt-5 max-w-xl">
          {/* Line 1: greeting — light, sets the stage */}
          <span className="block font-display text-lg font-normal italic leading-snug text-[#a14b24] sm:text-xl lg:text-2xl">
            Welcome back,
          </span>
          {/* Line 2: the name — dominant, emotional, the composition's focal point */}
          <span
            className="mt-0.5 block font-display font-black italic leading-[0.94] tracking-[-0.03em] text-[#e34b16]"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 4.4rem)' }}
            data-testid="user-name"
          >
            {displayName}
          </span>
        </motion.h1>

        {/* Identity strip — avatar + minimal label, understated */}
        <motion.div
          variants={itemVariants}
          className="mt-5 flex items-center gap-3"
        >
          <MemberProfileLink
            username={username}
            className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e34b16]"
            ariaLabel={`View @${username} member profile`}
          >
            <Avatar
              src={avatarUrl}
              fallback={displayName.slice(0, 2).toUpperCase()}
              size="lg"
              alt={`${displayName} avatar`}
            />
          </MemberProfileLink>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#7a331b]">
              <MemberProfileLink
                username={username}
                className="text-[#7a331b] hover:text-[#e34b16]"
              >
                @{username}
              </MemberProfileLink>
            </p>
            <p className="mt-0.5 truncate text-xs text-[#6d5849]/75">{email}</p>
          </div>
          <span className="shrink-0 inline-flex rounded-full border border-[#ead8c2] bg-white/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#7a331b]">
            {roleLabel(role)}
          </span>
          <span
            className={
              isFullAccess
                ? 'shrink-0 inline-flex rounded-full border border-[#efc0af] bg-[#fff2eb] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#b44d20]'
                : 'shrink-0 inline-flex rounded-full border border-[#ead8c2] bg-white/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#a14b24]'
            }
          >
            {membershipLabel}
          </span>
        </motion.div>

        {/* Supporting copy */}
        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-md text-[0.95rem] leading-[1.7] text-[#6d5849]"
        >
          Everything signed-in lives here. Tighten your profile, then move into
          stories, places, and whatever brave thing is next.
        </motion.p>

        {/* Membership status — plain inline, not a bordered card */}
        <motion.p
          variants={itemVariants}
          className="mt-3 max-w-md text-xs leading-relaxed text-[#a14b24]/80"
        >
          {isFullAccess ? (
            <>
              ✦{' '}Full community access active
              {memberSinceLabel ? ` · Member since ${memberSinceLabel}` : ''}
            </>
          ) : (
            <>
              ✦{' '}Limited access —{' '}
              <Link
                href="/subscribe"
                className="font-semibold text-[#e34b16] underline underline-offset-2 transition hover:text-[#c74010]"
              >
                start 7-day free trial
              </Link>
              {memberSinceLabel ? ` · Member since ${memberSinceLabel}` : ''}
            </>
          )}
        </motion.p>

        {/* CTA row */}
        <motion.div
          variants={itemVariants}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/profile"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e34b16] px-7 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(227,75,22,0.32)] transition hover:bg-[#c74010] hover:shadow-[0_14px_36px_rgba(227,75,22,0.40)] active:scale-[0.97]"
          >
            <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Edit profile
          </Link>
          <Link
            href="/submit"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#d9c4a8] bg-white/85 px-7 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/50 hover:text-[#e34b16]"
          >
            Share a story
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            href="/collections"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-2 text-sm font-semibold text-[#a14b24]/80 underline-offset-4 transition hover:text-[#e34b16] hover:underline"
          >
            Solo SHEntries →
          </Link>
        </motion.div>

        {/* Browse nav */}
        <motion.nav
          variants={itemVariants}
          className="mt-7 border-t border-[#ead8c2]/50 pt-5"
          aria-label="Explore more of the site"
        >
          <p className="eyebrow text-[0.6rem] tracking-[0.3em]">Browse next</p>
          <ul className="mt-2 flex list-none flex-wrap gap-x-0.5 gap-y-1.5 text-sm font-semibold text-[#7a331b]">
            {[
              { label: 'Blog', href: '/blog' },
              { label: 'Map', href: '/map' },
              { label: 'Sprint', href: '/sprint' },
              { label: 'Shop', href: '/shop' },
              { label: 'Contact', href: '/contact' },
            ].map((item, i, arr) => (
              <li key={item.href} className="flex items-center gap-0.5">
                <Link
                  className="rounded-md px-1.5 py-1 transition hover:text-[#e34b16]"
                  href={item.href}
                >
                  {item.label}
                </Link>
                {i < arr.length - 1 && (
                  <span aria-hidden className="select-none text-[#d9c4a8]">·</span>
                )}
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>

      {/* ── RIGHT: ART FIELD ────────────────────────────────────────────── */}
      <motion.div
        className="dash-hero-art"
        variants={artPanelVariants}
        initial="hidden"
        animate="visible"
        aria-hidden
      >
        {/*
         * ── ATMOSPHERE LAYERS — all below z-10 content ──────────────────
         *
         * Layer 1: drifting gold warmth pool — 20s cycle, barely perceptible.
         * Opacity 0.45 × gold gradient peak (0.35) = effective 0.16 at maximum.
         * Adds the sense that light is slowly moving across the panel.
         */}
        <AmbientField variant="drift" palette="gold" opacity={0.45} />

        {/*
         * Layer 2: topographic contour rings — cream strokes on dark field.
         * The cream variant rings are 0.06–0.12 opacity each; the opacity-[0.55]
         * class multiplies that down to 0.033–0.066. Almost subliminal.
         * Centers at (44, 47), rotated -8° — organic asymmetry, not a bullseye.
         */}
        <ContourBackground
          variant="cream"
          density={5}
          strokeWidth={0.12}
          className="opacity-[0.55]"
        />

        {/*
         * Layer 3: paper grain — medium intensity (0.030 opacity).
         * On a dark panel the grain reads as warmth, not noise.
         * Makes the surface feel physical rather than digital.
         */}
        <GrainOverlay intensity="medium" />

        {/*
         * Layer 4: localised radial warmth directly behind the type block.
         * The "YOUR / Story / BEGINS" stack sits bottom-left. This gold pool
         * emanates from below it — the type appears to be reading by candlelight.
         */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-3/5 w-4/5"
          style={{
            background:
              'radial-gradient(ellipse 75% 65% at 18% 92%, rgba(250,182,66,0.28) 0%, rgba(250,182,66,0.08) 44%, transparent 68%)',
          }}
        />

        {/*
         * Layer 5 (signature shape): GeometryAccent circle-open.
         * 85% of a circle arc — the gap at bottom-right feels editorial,
         * like a crop mark or a stamp that is only partially revealed.
         * Bleeds off bottom-right corner; never competes with typography.
         */}
        <GeometryAccent
          shape="circle-open"
          size="xl"
          color="#f7e8be"
          opacity={0.20}
          className="absolute -bottom-14 -right-14"
        />

        {/* ── MAIN CONTENT — always above all atmosphere layers ── */}
        <div className="relative z-10 flex h-full w-full flex-1 flex-col justify-between px-7 pb-8 pt-8 sm:px-9 sm:pb-10">

          {/* Top accent: compact profile ring */}
          <div className="flex items-center gap-3 self-start">
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 68 68" className="h-16 w-16 -rotate-90" aria-hidden>
                <circle
                  cx="34" cy="34" r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="4"
                />
                <circle
                  cx="34" cy="34" r="28"
                  fill="none"
                  stroke="#f7e8be"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={`${circumference * (1 - profilePct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-sm font-black leading-none text-[#f7e8be]">
                  {profilePct}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/50">
                Profile
              </p>
              <p className="text-[0.7rem] font-semibold text-[#f7e8be]/80">
                {completedCount}/{totalCount} complete
              </p>
            </div>
          </div>

          {/* Bottom: dominant stacked type — left-aligned, large */}
          <div className="select-none">
            <p
              className="font-display font-black leading-[0.92] tracking-[-0.025em] text-[#f7e8be]/90"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4rem)' }}
            >
              YOUR
            </p>
            <p
              className="font-display font-black italic leading-[0.92] tracking-[-0.015em] text-white/75"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
            >
              Story
            </p>
            <p
              className="font-display font-black leading-[0.92] tracking-[-0.025em] text-[#fab642]"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4rem)' }}
            >
              BEGINS
            </p>

            {/* Thin decorative rule under the type block */}
            <div className="mt-4 h-px w-16 bg-[#f7e8be]/25" />

            {/* Compact status line */}
            <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
              Solo SHE Things ✦ Member
            </p>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
