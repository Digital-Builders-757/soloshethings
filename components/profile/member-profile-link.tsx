import { getMemberProfilePath } from '@/lib/profile/member-profile-path'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface MemberProfileLinkProps {
  username: string | null | undefined
  children: ReactNode
  className?: string
  ariaLabel?: string
}

export function MemberProfileLink({
  username,
  children,
  className,
  ariaLabel,
}: MemberProfileLinkProps) {
  const href = getMemberProfilePath(username)

  if (!href) {
    return <span className={className}>{children}</span>
  }

  return (
    <Link
      href={href}
      className={cn('transition hover:text-[#e34b16]', className)}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  )
}
