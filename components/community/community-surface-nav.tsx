import Link from 'next/link'

import type { CommunitySurfaceKey } from '@/lib/community-navigation'

type CommunitySurfaceNavProps = {
  active: CommunitySurfaceKey
  backHref?: string
  backLabel?: string
  itemHrefs?: Partial<Record<CommunitySurfaceKey, string>>
}

const NAV_ITEMS: Array<{ key: CommunitySurfaceKey; href: string; label: string }> = [
  { key: 'places', href: '/places', label: 'Browse stories' },
  { key: 'saved', href: '/saved', label: 'Saved stories' },
  { key: 'reports', href: '/reports', label: 'Safety reports' },
  { key: 'submit', href: '/submit', label: 'Submit story' },
]

export function CommunitySurfaceNav({ active, backHref, backLabel, itemHrefs }: CommunitySurfaceNavProps) {
  return (
    <section className="editorial-card mt-6 p-4 sm:p-5" aria-label="Community workspace navigation">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b7455]">Community workspace</p>
          <p className="mt-2 text-sm leading-6 text-[#6d5849]">Jump between browse, saved, reports, and submit without losing the current member tools.</p>
        </div>

        {backHref && backLabel ? (
          <Link href={backHref} className="inline-flex text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]">
            Back to {backLabel.toLowerCase()} →
          </Link>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active

          return (
            <Link
              key={item.key}
              href={itemHrefs?.[item.key] ?? item.href}
              aria-current={isActive ? 'page' : undefined}
              className={
                isActive
                  ? 'inline-flex min-h-11 items-center justify-center rounded-full border border-[#e34b16]/30 bg-[#fff3ec] px-4 text-sm font-semibold text-[#7a331b]'
                  : 'inline-flex min-h-11 items-center justify-center rounded-full border border-[#ead8c2] bg-white px-4 text-sm font-semibold text-[#7a331b] transition hover:border-[#e34b16]/40 hover:text-[#e34b16]'
              }
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
