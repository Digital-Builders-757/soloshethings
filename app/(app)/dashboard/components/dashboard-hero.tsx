'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, UserRound } from 'lucide-react'
import Link from 'next/link'

import { Avatar } from '@/components/ui/avatar'

interface ProfileChecklistItem {
  label: string
  done: boolean
}

interface DashboardHeroProps {
  avatarUrl: string | null
  displayName: string
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

/** Stagger container variants */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
}

const CINEMATIC: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Each child fades up from slight offset */
const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: CINEMATIC },
  },
}

/** Right panel slides in from the right */
const artPanelVariants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: CINEMATIC, delay: 0.12 },
  },
}

export function DashboardHero({
  avatarUrl,
  displayName,
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

  return (
    <header className="dash-hero-panel" aria-label="Member home base">
      {/* ── LEFT: TEXT FIELD ──────────────────────────────────────────────── */}
      <motion.div
        className="dash-hero-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="eyebrow text-[0.65rem] tracking-[0.3em]"
        >
          Your creative home base
        </motion.p>

        {/* Inline identity row — avatar + name + badges */}
        <motion.div
          variants={itemVariants}
          className="mt-5 flex flex-wrap items-center gap-3"
        >
          <Avatar
            src={avatarUrl}
            fallback={displayName.slice(0, 2).toUpperCase()}
            size="xl"
            alt={`${displayName} avatar`}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#7a331b]">
              @{displayName}
            </p>
            <p className="mt-0.5 text-xs text-[#6d5849]/80">{email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex rounded-full border border-[#ead8c2] bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#7a331b]">
              {roleLabel(role)}
            </span>
            <span
              className={
                isFullAccess
                  ? 'inline-flex rounded-full border border-[#efc0af] bg-[#fff2eb] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#b44d20]'
                  : 'inline-flex rounded-full border border-[#ead8c2] bg-white/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#a14b24]'
              }
            >
              {membershipLabel}
            </span>
            {memberSinceLabel ? (
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#a14b24]/70">
                Since {memberSinceLabel}
              </span>
            ) : null}
          </div>
        </motion.div>

        {/* Display headline */}
        <motion.h1
          variants={itemVariants}
          className="mt-6 max-w-xl font-display text-[2.4rem] font-black leading-[1.06] tracking-[-0.025em] text-[#7a331b] sm:text-[3rem] lg:text-[3.4rem]"
        >
          Welcome back,{' '}
          <span
            className="italic text-[#e34b16]"
            data-testid="user-name"
          >
            {displayName}
          </span>
        </motion.h1>

        {/* Supporting copy */}
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-lg text-base leading-relaxed text-[#6d5849] sm:text-[1.03rem]"
        >
          Everything signed-in lives here. Tighten your profile, then move into
          stories, places, and whatever brave thing is next.
        </motion.p>

        {/* Membership access banner */}
        <motion.div
          variants={itemVariants}
          className="mt-5 inline-flex max-w-lg items-start gap-2 rounded-2xl border border-[#ead8c2] bg-[linear-gradient(135deg,#fffaf4_0%,rgba(247,232,190,0.45)_100%)] px-4 py-3 text-sm text-[#7a331b] shadow-[0_8px_24px_rgba(122,51,27,0.06)]"
        >
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fab642]" aria-hidden />
          <span>
            {isFullAccess ? (
              'Full community access — trial or paid membership active.'
            ) : (
              <>
                Limited access until you subscribe (7-day trial, then US $3.99/mo).{' '}
                <Link
                  href="/subscribe"
                  className="font-semibold text-[#e34b16] underline underline-offset-2 hover:text-[#c74010]"
                >
                  Start free trial
                </Link>
                .
              </>
            )}
          </span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Link
            href="/profile"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e34b16] px-7 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(227,75,22,0.30)] transition hover:bg-[#c74010] hover:shadow-[0_14px_32px_rgba(227,75,22,0.38)] active:scale-[0.98]"
          >
            <UserRound className="h-4 w-4 shrink-0" aria-hidden />
            Edit profile
          </Link>
          <Link
            href="/submit"
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-[#ead8c2] bg-white/90 px-7 text-sm font-semibold text-[#7a331b] shadow-sm transition hover:border-[#e34b16]/40 hover:text-[#e34b16]"
          >
            Share a story
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/collections"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-transparent px-2 text-sm font-semibold text-[#e34b16]/90 underline-offset-4 transition hover:underline"
          >
            Solo SHEntries →
          </Link>
        </motion.div>

        {/* Browse nav */}
        <motion.nav
          variants={itemVariants}
          className="mt-7 border-t border-[#ead8c2]/60 pt-5"
          aria-label="Explore more of the site"
        >
          <p className="eyebrow text-[0.62rem] tracking-[0.28em]">Browse next</p>
          <ul className="mt-2.5 flex list-none flex-wrap gap-x-1 gap-y-1.5 text-sm font-semibold text-[#7a331b]">
            {[
              { label: 'Blog', href: '/blog' },
              { label: 'Map', href: '/map' },
              { label: 'Sprint', href: '/sprint' },
              { label: 'Shop', href: '/shop' },
              { label: 'Contact', href: '/contact' },
            ].map((item, i, arr) => (
              <li key={item.href} className="flex items-center gap-1">
                <Link
                  className="rounded-md px-1.5 py-1 transition hover:text-[#e34b16]"
                  href={item.href}
                >
                  {item.label}
                </Link>
                {i < arr.length - 1 && (
                  <span aria-hidden className="select-none text-[#d9c4a8]">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>

      {/* ── RIGHT: ART FIELD ──────────────────────────────────────────────── */}
      <motion.div
        className="dash-hero-art"
        variants={artPanelVariants}
        initial="hidden"
        animate="visible"
        aria-hidden
      >
        {/* Bottom-left blob accent */}
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#fab642]/20 blur-3xl" />
        {/* Top-right blob accent */}
        <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        {/* Central composition */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-10 text-center">
          {/* Profile completeness ring */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 88 88"
              className="h-28 w-28 -rotate-90"
              aria-hidden
            >
              {/* Track */}
              <circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="5"
              />
              {/* Progress */}
              <circle
                cx="44"
                cy="44"
                r="36"
                fill="none"
                stroke="#f7e8be"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - profilePct / 100)}`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            {/* Centre number */}
            <div className="absolute flex flex-col items-center">
              <span className="font-display text-2xl font-black leading-none text-[#f7e8be]">
                {profilePct}%
              </span>
              <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#f7e8be]/70">
                Profile
              </span>
            </div>
          </div>

          {/* Stacked editorial type composition */}
          <div className="select-none">
            <p className="font-display text-[2.5rem] font-black leading-none tracking-[-0.02em] text-[#f7e8be] sm:text-[3rem]">
              YOUR
            </p>
            <p
              className="font-display font-black italic leading-none tracking-[-0.01em] text-white/90"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}
            >
              Story
            </p>
            <p className="font-display text-[2.5rem] font-black leading-none tracking-[-0.02em] text-[#fab642] sm:text-[3rem]">
              BEGINS
            </p>
          </div>

          {/* Checklist pills */}
          <ul className="flex flex-col items-center gap-1.5">
            {profileChecklist.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
              >
                <span
                  className={
                    item.done
                      ? 'h-1.5 w-1.5 rounded-full bg-[#fab642]'
                      : 'h-1.5 w-1.5 rounded-full bg-white/30'
                  }
                  aria-hidden
                />
                <span className={item.done ? 'text-[#f7e8be]' : 'text-white/50'}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </header>
  )
}
