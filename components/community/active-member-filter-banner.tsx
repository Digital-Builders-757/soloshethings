import Link from 'next/link'

type Props = {
  memberLabel?: string
  clearHref: string
  className?: string
}

export function ActiveMemberFilterBanner({ memberLabel, clearHref, className }: Props) {
  if (!memberLabel?.trim()) {
    return null
  }

  return (
    <div
      className={[
        'flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-[#f0e1cf] bg-[#fffaf5] px-4 py-3 text-sm text-[#6d5849]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>
        Member filter active: <span className="font-semibold text-[#7a331b]">{memberLabel.trim()}</span>
      </span>
      <Link href={clearHref} className="font-semibold text-[#e34b16] transition hover:text-[#c74010]">
        Clear member filter
      </Link>
    </div>
  )
}
