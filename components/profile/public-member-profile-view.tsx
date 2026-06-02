import { MemberProfilePageShell } from '@/components/profile/member-profile-page-shell'
import { TravelStyleChipList } from '@/components/profile/travel-style-chip-list'
import { Avatar } from '@/components/ui/avatar'
import { getAvatarFallback } from '@/lib/profile/avatar-fallback'
import { getPrivacyDisplayLabel } from '@/lib/profile/privacy-display'
import type { PublicMemberProfile } from '@/lib/profile/member-profile-types'

interface PublicMemberProfileViewProps {
  profile: PublicMemberProfile
  avatarUrl: string | null
}

export function PublicMemberProfileView({ profile, avatarUrl }: PublicMemberProfileViewProps) {
  const displayName = profile.full_name?.trim() || `@${profile.username}`
  const avatarFallback = getAvatarFallback(profile.full_name, profile.username)

  return (
    <MemberProfilePageShell username={profile.username}>
      <header className="mb-7 sm:mb-9">
        <p className="eyebrow text-[0.65rem] tracking-[0.26em]">Member profile</p>
        <h1 className="display-headline mt-3 text-[1.85rem] text-[#713522] sm:text-[2.25rem] lg:text-[2.6rem]">
          {displayName}
        </h1>
        {profile.full_name?.trim() ? (
          <p className="mt-3 text-sm font-medium text-[#7a331b]/62">@{profile.username}</p>
        ) : null}
        <div className="mt-4">
          <span className="inline-flex rounded-full border border-[#c8a882]/35 bg-[#fffdf8]/80 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#713522]/75">
            {getPrivacyDisplayLabel(profile.privacy_level)}
          </span>
        </div>
      </header>

      <div className="editorial-rule mb-6 sm:mb-7" />

      <section
        className="profile-portrait-zone relative mb-10 overflow-hidden px-5 pb-6 pt-5 sm:mb-12 sm:px-7 sm:pb-7 sm:pt-5"
        aria-labelledby="member-portrait-label"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-[0.032]"
          style={{
            background:
              'radial-gradient(circle at 22% 28%, rgba(250,182,66,0.6), transparent 62%)',
          }}
        />

        <p id="member-portrait-label" className="profile-form-section-label relative mb-4 sm:mb-5">
          Portrait
        </p>

        <div className="relative grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 sm:gap-x-5">
          <div className="profile-avatar-ring shrink-0">
            <div className="rounded-full bg-white p-1">
              <Avatar
                src={avatarUrl}
                fallback={avatarFallback}
                alt={`${profile.username} portrait`}
                size="xl"
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-[#713522]">@{profile.username}</p>
            {profile.full_name?.trim() ? (
              <p className="mt-1.5 text-xs text-[#7a331b]/55">{profile.full_name}</p>
            ) : null}
          </div>
        </div>
      </section>

      {(profile.bio?.trim() || profile.travel_styles.length > 0) && (
        <section
          className="mb-12 rounded-2xl border border-[#fab642]/15 bg-gradient-to-b from-[#f7e8be]/20 to-[#fffdf8]/52 p-5 sm:mb-14 sm:p-7"
          aria-labelledby="member-voice-label"
        >
          <div className="mb-7 sm:mb-9">
            <p id="member-voice-label" className="profile-form-section-label mb-1">
              Voice &amp; presence
            </p>
          </div>

          {profile.bio?.trim() ? (
            <div className="border-t border-[#c8a882]/12 pt-6 sm:pt-7">
              <p className="mb-2.5 text-sm font-medium text-[#713522]/82">Bio</p>
              <div
                className="editorial-input min-w-0 whitespace-pre-wrap px-5 py-5 text-base leading-[1.72] sm:text-sm"
                style={{ background: '#fffdf8' }}
              >
                {profile.bio.trim()}
              </div>
            </div>
          ) : null}

          <TravelStyleChipList values={profile.travel_styles} />
        </section>
      )}
    </MemberProfilePageShell>
  )
}
