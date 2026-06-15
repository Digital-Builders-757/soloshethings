import Image from 'next/image'
import Link from 'next/link'

import { SaveCommunityPostButton } from '@/components/cards/save-community-post-button'
import { CommunityAuthorPreview } from '@/components/community/community-author-preview'
import {
  communityWarmCardClassName,
  CommunityBadgeFeatured,
  CommunityBadgeReported,
  CommunityChipEmphasis,
  CommunityChipPrivate,
  CommunityChipPublic,
  CommunityChipSavedTimestamp,
  CommunityChipTopic,
  CommunityPillSaved,
} from '@/components/community/community-story-surface'
import { MemberProfileLink } from '@/components/profile/member-profile-link'
import { StatusBadge } from '@/components/ui/status-badge'
import { COMMUNITY_STORY_TOPIC_LABELS, type CommunityStoryTopicSlug } from '@/lib/community-story-taxonomy'
import { cn } from '@/lib/utils'
import type { report_status } from '@/types/database'

const communityLinkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e34b16]'

const communityLinkFocusBrand =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange'

type CommunityStoryCardAuthor = {
  username?: string | null
  fullName?: string | null
  avatarUrl?: string | null
}

type CommunityStoryCardBase = {
  postId: string
  title: string
  content: string
  isPublic: boolean
  isFeatured: boolean
  imageCount: number
  detailHref: string
  author: CommunityStoryCardAuthor
  authorDisplayName: string
  publishedAt: string
  formatPublishedAt: (iso: string) => string
  coverImageSrc?: string | null
  coverImageAlt?: string
  latestReport?: { status: report_status } | null
  className?: string
}

export type CommunityStoryCardFeedProps = CommunityStoryCardBase & {
  variant: 'feed'
  isOwnPost: boolean
  isSaved: boolean
  placeLabel?: string | null
  storyTags?: string[]
  currentPath: string
  moreFromAuthorHref?: string | null
}

export type CommunityStoryCardSavedProps = CommunityStoryCardBase & {
  variant: 'saved'
  isOwnPost: boolean
  savedAtLabel: string
  currentPath: string
  moreFromAuthorHref?: string | null
}

export type CommunityStoryCardRelatedProps = {
  variant: 'related'
  title: string
  content: string
  isPublic: boolean
  isFeatured: boolean
  imageCount: number
  detailHref: string
  authorUsername?: string | null
  authorDisplayName: string
  reasonLabel: string
  highlight?: boolean
  className?: string
}

export type CommunityStoryCardProps =
  | CommunityStoryCardFeedProps
  | CommunityStoryCardSavedProps
  | CommunityStoryCardRelatedProps

function CommunityStoryCardCover({
  coverImageSrc,
  coverImageAlt,
}: {
  coverImageSrc: string
  coverImageAlt: string
}) {
  return (
    <div className="story-detail-photo-frame relative aspect-[16/10] w-full shrink-0 rounded-none border-x-0 border-t-0">
      <Image
        src={coverImageSrc}
        alt={coverImageAlt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
        unoptimized
      />
    </div>
  )
}

function CommunityStoryCardReportBadge({
  latestReport,
}: {
  latestReport: { status: report_status }
}) {
  return (
    <StatusBadge
      kind="report"
      status={latestReport.status}
      className="mt-6 min-h-10 items-center justify-center px-4"
    />
  )
}

function CommunityStoryCardFeed(props: CommunityStoryCardFeedProps) {
  const {
    postId,
    title,
    content,
    isPublic,
    isFeatured,
    imageCount,
    detailHref,
    author,
    authorDisplayName,
    publishedAt,
    formatPublishedAt,
    coverImageSrc,
    coverImageAlt,
    latestReport,
    isOwnPost,
    isSaved,
    placeLabel,
    storyTags,
    currentPath,
    moreFromAuthorHref,
    className,
  } = props

  const topicSlugs = (storyTags ?? []).filter(Boolean)

  return (
    <article className={cn(communityWarmCardClassName({ featured: isFeatured }), className)}>
      {coverImageSrc ? (
        <CommunityStoryCardCover coverImageSrc={coverImageSrc} coverImageAlt={coverImageAlt ?? title} />
      ) : null}

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {isPublic ? (
            <CommunityChipPublic className="text-[0.58rem]">Public story</CommunityChipPublic>
          ) : (
            <CommunityChipPrivate className="text-[0.58rem]">Private to you</CommunityChipPrivate>
          )}
          {isOwnPost ? (
            <CommunityChipEmphasis className="text-[0.58rem]">Your post</CommunityChipEmphasis>
          ) : null}
          {isSaved ? <CommunityPillSaved /> : null}
          {isFeatured ? <CommunityBadgeFeatured /> : null}
          <span className="story-meta-chip text-[0.58rem]">
            {imageCount} image{imageCount === 1 ? '' : 's'}
          </span>
          {latestReport ? <CommunityBadgeReported /> : null}
        </div>

        <CommunityAuthorPreview
          className="mt-4"
          username={author.username}
          fullName={author.fullName}
          avatarUrl={author.avatarUrl}
          publishedAt={publishedAt}
          publishedAtLabel={formatPublishedAt}
        />

        <h2 className="mt-4 font-serif text-2xl font-semibold text-[#7a331b]">
          <Link href={detailHref} className={cn('transition hover:text-[#e34b16]', communityLinkFocus)}>
            {title}
          </Link>
        </h2>
        {placeLabel?.trim() ? (
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#9b7455]">
            Place · {placeLabel.trim()}
          </p>
        ) : null}
        {topicSlugs.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {topicSlugs.map((slug) => {
              const label = COMMUNITY_STORY_TOPIC_LABELS[slug as CommunityStoryTopicSlug]
              if (!label) return null
              return <CommunityChipTopic key={`${postId}-${slug}`}>{label}</CommunityChipTopic>
            })}
          </div>
        ) : null}
        <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#6d5849] sm:text-base">{content}</p>

        {latestReport ? <CommunityStoryCardReportBadge latestReport={latestReport} /> : null}

        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0 space-y-2">
            <SaveCommunityPostButton postId={postId} path={currentPath} initialSaved={isSaved} />
            <p className="text-xs text-[#6d5849]">
              {isOwnPost && !isPublic
                ? 'Only you can see this in the feed, and saves stay on your account only.'
                : 'Open the story for full details, saving, and reporting tools.'}
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
            {!isOwnPost && moreFromAuthorHref ? (
              <Link
                href={moreFromAuthorHref}
                className={cn('text-sm font-semibold text-[#7a331b] transition hover:text-[#e34b16]', communityLinkFocus)}
              >
                More from {authorDisplayName}
              </Link>
            ) : null}
            <Link
              href={latestReport ? '/reports' : '/saved'}
              className={cn('text-sm font-semibold text-[#7a331b] transition hover:text-[#e34b16]', communityLinkFocus)}
            >
              {latestReport ? 'Track report' : 'Saved list'}
            </Link>
            <Link
              href={detailHref}
              className={cn('text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]', communityLinkFocus)}
            >
              Open story →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function CommunityStoryCardSaved(props: CommunityStoryCardSavedProps) {
  const {
    postId,
    title,
    content,
    isPublic,
    isFeatured,
    imageCount,
    detailHref,
    author,
    authorDisplayName,
    publishedAt,
    formatPublishedAt,
    coverImageSrc,
    coverImageAlt,
    latestReport,
    isOwnPost,
    savedAtLabel,
    currentPath,
    moreFromAuthorHref,
    className,
  } = props

  return (
    <article className={cn(communityWarmCardClassName({ featured: isFeatured }), className)}>
      {coverImageSrc ? (
        <CommunityStoryCardCover coverImageSrc={coverImageSrc} coverImageAlt={coverImageAlt ?? title} />
      ) : null}

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {isPublic ? (
            <CommunityChipPublic className="text-[0.58rem]">Public story</CommunityChipPublic>
          ) : (
            <CommunityChipPrivate className="text-[0.58rem]">Private to you</CommunityChipPrivate>
          )}
          <CommunityChipSavedTimestamp>Saved {savedAtLabel}</CommunityChipSavedTimestamp>
          {isOwnPost ? (
            <CommunityChipEmphasis className="text-[0.58rem]">Your post</CommunityChipEmphasis>
          ) : null}
          {isFeatured ? <CommunityBadgeFeatured /> : null}
          <span className="story-meta-chip text-[0.58rem]">
            {imageCount} photo{imageCount === 1 ? '' : 's'}
          </span>
          {latestReport ? <CommunityBadgeReported /> : null}
        </div>

        <CommunityAuthorPreview
          className="mt-4"
          username={author.username}
          fullName={author.fullName}
          avatarUrl={author.avatarUrl}
          publishedAt={publishedAt}
          publishedAtLabel={formatPublishedAt}
        />

        <h2 className="mt-4 font-serif text-2xl font-semibold text-[#7a331b]">
          <Link href={detailHref} className={cn('transition hover:text-[#e34b16]', communityLinkFocus)}>
            {title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#6d5849] sm:text-base">{content}</p>

        {latestReport ? <CommunityStoryCardReportBadge latestReport={latestReport} /> : null}

        <div className="mt-6 border-t border-brand-pinkDark/10 pt-5">
          <p className="profile-form-section-label mb-3 text-[0.62rem]">Library cleanup</p>
          <SaveCommunityPostButton
            postId={postId}
            path={currentPath}
            initialSaved
            variant="card"
            savedListContext
          />
          <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
            {!isOwnPost && moreFromAuthorHref ? (
              <Link
                href={moreFromAuthorHref}
                className={cn('text-sm font-semibold text-[#7a331b] transition hover:text-[#e34b16]', communityLinkFocus)}
              >
                More from {authorDisplayName}
              </Link>
            ) : null}
            <Link
              href={detailHref}
              className={cn('text-sm font-semibold text-[#e34b16] transition hover:text-[#c74010]', communityLinkFocus)}
            >
              Open story →
            </Link>
            {latestReport ? (
              <Link
                href="/reports"
                className={cn('text-sm font-semibold text-[#7a331b] transition hover:text-[#e34b16]', communityLinkFocus)}
              >
                Track report
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function CommunityStoryCardRelated(props: CommunityStoryCardRelatedProps) {
  const {
    title,
    content,
    isPublic,
    isFeatured,
    imageCount,
    detailHref,
    authorUsername,
    authorDisplayName,
    reasonLabel,
    highlight,
    className,
  } = props

  return (
    <article
      className={cn(
        'story-detail-related-card flex flex-col p-4 sm:p-5',
        highlight && 'lg:ring-2 lg:ring-brand-gold/35',
        className,
      )}
    >
      <p className="community-section-label text-[0.65rem]">{reasonLabel}</p>
      <h3 className="mt-3 font-serif text-xl font-semibold text-brand-pinkDark">
        <Link href={detailHref} className={cn('transition hover:text-brand-orange', communityLinkFocusBrand)}>
          {title}
        </Link>
      </h3>
      <p className="mt-2 text-sm font-semibold text-brand-pinkDark">
        <MemberProfileLink
          username={authorUsername}
          className="text-brand-pinkDark hover:text-brand-orange"
        >
          {authorDisplayName}
        </MemberProfileLink>
      </p>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-brand-blue/85">{content}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {isPublic ? (
          <CommunityChipPublic className="text-[0.58rem]">Public</CommunityChipPublic>
        ) : (
          <CommunityChipPrivate className="text-[0.58rem]">Private to owner</CommunityChipPrivate>
        )}
        {isFeatured ? <CommunityBadgeFeatured /> : null}
        <span className="story-meta-chip text-[0.58rem]">
          {imageCount} photo{imageCount === 1 ? '' : 's'}
        </span>
      </div>
      <Link
        href={detailHref}
        className={cn(
          'mt-5 inline-flex text-sm font-semibold text-brand-orange transition hover:text-brand-coral',
          communityLinkFocusBrand,
        )}
      >
        Open story →
      </Link>
    </article>
  )
}

export function CommunityStoryCard(props: CommunityStoryCardProps) {
  switch (props.variant) {
    case 'feed':
      return <CommunityStoryCardFeed {...props} />
    case 'saved':
      return <CommunityStoryCardSaved {...props} />
    case 'related':
      return <CommunityStoryCardRelated {...props} />
    default: {
      const _exhaustive: never = props
      return _exhaustive
    }
  }
}
