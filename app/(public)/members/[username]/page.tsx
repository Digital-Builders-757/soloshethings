import { MemberProfileAuthGate } from '@/components/profile/member-profile-auth-gate'
import { MemberProfilePrivateGate } from '@/components/profile/member-profile-private-gate'
import { PublicMemberProfileView } from '@/components/profile/public-member-profile-view'
import { resolveMemberProfile } from '@/lib/queries/member-profiles'
import { getAvatarSignedUrl } from '@/lib/storage/avatars'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type MemberProfilePageProps = {
  params: Promise<{ username: string }>
}

function buildMetadataTitle(label: string): string {
  return `${label} · Solo SHE Things`
}

export async function generateMetadata({ params }: MemberProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const result = await resolveMemberProfile(username)

  if (result.status === 'visible') {
    const { profile } = result
    const titleLabel = profile.full_name?.trim() || profile.username
    const description = profile.bio?.trim()
      ? profile.bio.trim().slice(0, 160)
      : `Community member profile for @${profile.username}.`

    return {
      title: buildMetadataTitle(titleLabel),
      description,
    }
  }

  if (result.status === 'auth_required' || result.status === 'private') {
    return {
      title: buildMetadataTitle('Member profile'),
      description: 'Member profile on Solo SHE Things.',
    }
  }

  return {
    title: buildMetadataTitle('Member not found'),
  }
}

export default async function MemberProfilePage({ params }: MemberProfilePageProps) {
  const { username } = await params
  const result = await resolveMemberProfile(username)

  if (result.status === 'not_found' || result.status === 'error') {
    notFound()
  }

  if (result.status === 'auth_required') {
    return <MemberProfileAuthGate username={result.username} />
  }

  if (result.status === 'private') {
    return <MemberProfilePrivateGate username={result.username} />
  }

  const avatarUrl = await getAvatarSignedUrl(result.profile.avatar_url)

  return <PublicMemberProfileView profile={result.profile} avatarUrl={avatarUrl} />
}
