import { MemberProfileLink } from '@/components/profile/member-profile-link'
import { Avatar } from '@/components/ui/avatar'
import { getAuthorDisplayName } from '@/lib/profile/member-profile-path'
import { getAvatarFallback } from '@/lib/profile/avatar-fallback'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CommunityAuthorPreviewProps {
  username?: string | null
  fullName?: string | null
  avatarUrl?: string | null
  size?: 'md' | 'lg'
  publishedAt?: string | null
  publishedAtLabel?: (iso: string) => string
  meta?: ReactNode
  className?: string
  nameSuffix?: ReactNode
}

export function CommunityAuthorPreview({
  username,
  fullName,
  avatarUrl,
  size = 'md',
  publishedAt,
  publishedAtLabel,
  meta,
  className,
  nameSuffix,
}: CommunityAuthorPreviewProps) {
  const displayName = getAuthorDisplayName(fullName, username)
  const fallback = getAvatarFallback(fullName, username ?? '')
  const profileAriaLabel = `View ${displayName}'s member profile`

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <MemberProfileLink
        username={username}
        className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e34b16]"
        ariaLabel={profileAriaLabel}
      >
        <Avatar
          src={avatarUrl}
          fallback={fallback}
          alt={`${displayName} avatar`}
          size={size}
        />
      </MemberProfileLink>
      <div className="min-w-0">
        <p className="truncate text-sm text-[#7a331b]">
          <MemberProfileLink
            username={username}
            className="font-semibold text-[#7a331b] hover:text-[#e34b16]"
            ariaLabel={profileAriaLabel}
          >
            {displayName}
          </MemberProfileLink>
          {nameSuffix}
        </p>
        {meta ? (
          meta
        ) : publishedAt && publishedAtLabel ? (
          <p className="text-xs text-[#6d5849]">Published {publishedAtLabel(publishedAt)}</p>
        ) : null}
      </div>
    </div>
  )
}
