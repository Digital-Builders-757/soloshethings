'use client'

/**
 * DashboardModules
 *
 * Phase 2 editorial lower-dashboard layout. Three compositionally distinct
 * blocks arranged on an asymmetric grid — not equal-weight cards.
 *
 * PROFILE READINESS  →  wider, grounded anchor; ghost number + progress fill
 * BEST NEXT MOVE     →  narrower, directional sidebar; CTA-forward
 * LIVE RIGHT NOW     →  airy, atmospheric; a visual pause in the layout
 *
 * This is a Client Component only for Framer Motion stagger entrance.
 * All data is server-computed and passed as props.
 */

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { ContourBackground } from '@/components/visual'

// ── Types ───────────────────────────────────────────────────────────────────

interface ChecklistItem {
  label: string
  done: boolean
}

interface NextStep {
  title: string
  description: string
  href: string
  cta: string
}

export interface DashboardModulesProps {
  completedCount: number
  totalCount: number
  profileChecklist: ChecklistItem[]
  remainingCount: number
  nextStep: NextStep
  liveNowItems: string[]
}

// ── Motion constants — same CINEMATIC easing as the hero ────────────────────

const CINEMATIC: [number, number, number, number] = [0.22, 1, 0.36, 1]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
}

const moduleVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: CINEMATIC },
  },
}

// ── Component ────────────────────────────────────────────────────────────────

export function DashboardModules({
  completedCount,
  totalCount,
  profileChecklist,
  remainingCount,
  nextStep,
  liveNowItems,
}: DashboardModulesProps) {
  const profilePct = Math.round((completedCount / totalCount) * 100)

  return (
    <section aria-label="Dashboard overview" className="mt-7 sm:mt-8">
      <motion.div
        className="grid items-start gap-5 lg:grid-cols-[2.2fr_1.4fr_1.6fr] lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* ════════════════════════════════════════════════════════════════
            LEFT MODULE — PROFILE READINESS
            Wider, grounded. Ghost count number as composition. Contour bg.
            The visual anchor of the three-module band.
            ════════════════════════════════════════════════════════════════ */}
        <motion.article
          variants={moduleVariants}
          aria-labelledby="dash-readiness-heading"
          className="editorial-mod-readiness dash-card-lift relative overflow-hidden p-6 sm:p-7"
        >
          {/* Atmospheric contour rings — warm brown, ultra-faint */}
          <ContourBackground
            variant="warm"
            density={3}
            strokeWidth={0.13}
            className="opacity-[0.62]"
          />

          {/*
           * Ghost count number — compositional element, not informational.
           * Bleeds off the top-right corner. Discovered, not announced.
           * The actual data is the smaller text below; this is atmosphere.
           */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-3 right-4 select-none font-display font-black italic leading-none"
            style={{
              fontSize: 'clamp(5.5rem, 10vw, 8rem)',
              color: '#fab642',
              opacity: 0.09,
              lineHeight: 1,
            }}
          >
            {completedCount}
          </span>

          <div className="relative z-10">
            <p className="eyebrow text-[0.62rem] tracking-[0.28em]">Profile readiness</p>

            {/*
             * Editorial progress rule — a single thin fill-line.
             * mt-3 (tighter than center): left module is grounded, not airy.
             */}
            <div
              className="relative mt-3 h-px overflow-hidden bg-[#ead8c2]"
              role="progressbar"
              aria-valuenow={profilePct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Profile ${profilePct}% complete`}
            >
              <div
                className="absolute inset-y-0 left-0 bg-[#e34b16]/60 transition-all duration-700"
                style={{ width: `${profilePct}%` }}
              />
            </div>

            {/* Strong typographic display of the count — mt-3: tight to the rule */}
            <div className="mt-3 flex items-baseline gap-2.5">
              <span
                id="dash-readiness-heading"
                className="font-display text-[2.5rem] font-black leading-none text-[#7a331b]"
              >
                {completedCount}
              </span>
              <span className="text-sm font-semibold text-[#9a7258]">
                of {totalCount} complete
              </span>
            </div>

            {/* mt-3 after count: description reads as a caption to the number */}
            <p className="mt-3 text-sm leading-relaxed text-[#6d5849]">
              {remainingCount === 0
                ? 'Your account foundation is in great shape — now the fun part is using it.'
                : `${remainingCount} quick ${remainingCount === 1 ? 'touch' : 'touches'} will make your space feel much more complete.`}
            </p>

            {/*
             * Clean editorial checklist — no boxy rows.
             * mt-6: the list breathes away from the description — a visual pause
             * before the detail. More air here than at the top.
             */}
            <ul
              className="mt-6 space-y-2.5 text-sm"
              aria-label="Profile checklist"
            >
              {profileChecklist.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span
                    className={
                      item.done
                        ? 'h-1.5 w-1.5 shrink-0 rounded-full bg-[#e34b16]'
                        : 'h-1.5 w-1.5 shrink-0 rounded-full border border-[#d9c4a8]'
                    }
                    aria-hidden
                  />
                  <span
                    className={
                      item.done
                        ? 'font-medium text-[#7a331b]'
                        : 'text-[#6d5849]/70'
                    }
                  >
                    {item.label}
                  </span>
                  {item.done && <span className="sr-only">(complete)</span>}
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

        {/* ════════════════════════════════════════════════════════════════
            CENTER MODULE — BEST NEXT MOVE
            Narrower vertical block, offset upward. Directional sidebar.
            The left-border accent in CSS signals momentum. CTA dominant.
            ════════════════════════════════════════════════════════════════ */}
        <motion.article
          variants={moduleVariants}
          aria-label="Your best next move"
          className="editorial-mod-action dash-card-lift relative overflow-hidden p-6 sm:p-7 lg:-mt-4"
        >
          {/*
           * Oversized arrow — compositional gesture, low opacity.
           * Sits behind content at bottom-right. Signals direction without
           * competing with the CTA button above it.
           */}
          <ArrowRight
            aria-hidden
            className="pointer-events-none absolute bottom-4 right-4 select-none text-[#e34b16]"
            style={{ width: 72, height: 72, opacity: 0.065 }}
          />

          {/*
           * CENTER spacing rhythm: urgency.
           * Tighter eyebrow→title (mt-4 vs left's mt-3 after rule)
           * gives the impression of forward momentum. CTA at mt-6 instead of
           * mt-7 — it arrives sooner, feels more direct.
           */}
          <div className="relative z-10">
            <p className="eyebrow text-[0.62rem] tracking-[0.28em]">Best next move</p>

            <h2 className="mt-4 font-display text-[1.55rem] font-black leading-[1.1] text-[#7a331b]">
              {nextStep.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-[#6d5849]">
              {nextStep.description}
            </p>

            <Link href={nextStep.href} className="cta-primary mt-6 px-5 text-sm">
              {nextStep.cta}
            </Link>
          </div>
        </motion.article>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT MODULE — LIVE RIGHT NOW
            Lightest visual weight. Airy. Atmospheric. A pause.
            Lower in the vertical stack than the center module.
            ════════════════════════════════════════════════════════════════ */}
        <motion.article
          variants={moduleVariants}
          aria-label="What is live right now"
          className="editorial-mod-live relative overflow-hidden p-6 sm:p-7 lg:mt-8"
        >
          {/* Atmosphere — gold contour, very faint, low density */}
          <ContourBackground
            variant="gold"
            density={3}
            strokeWidth={0.11}
            className="opacity-[0.36]"
          />

          {/*
           * RIGHT spacing rhythm: expansive.
           * More gap between eyebrow and title (mt-7) — the module takes its time.
           * More gap before the list (mt-8) — this is the breath in the composition.
           * This is the compositional rest after the urgency of the center block.
           */}
          <div className="relative z-10">
            <p className="eyebrow text-[0.62rem] tracking-[0.28em]">Live right now</p>

            <h2 className="mt-7 font-display text-[1.35rem] font-black leading-tight text-[#7a331b]">
              What this member area already does
            </h2>

            <p className="mt-2.5 text-sm leading-relaxed text-[#6d5849]/80">
              A little more color, a little more delight, same honest product underneath.
            </p>

            {/*
             * Loose item list — no boxy rows, generous spacing.
             * mt-8: the list floats below with deliberate air.
             * This module should feel like a visual pause, not an information block.
             */}
            <ul
              className="mt-8 space-y-4 text-sm leading-relaxed"
              aria-label="Live features"
            >
              {liveNowItems.map((item) => (
                <li key={item} className="flex gap-3 text-[#6d5849]/70">
                  <span
                    className="mt-[0.38rem] h-1 w-1 shrink-0 rounded-full bg-[#fab642]/55"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.article>

      </motion.div>
    </section>
  )
}
