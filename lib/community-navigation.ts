import { getSafeInternalRedirectPath } from '@/lib/auth-redirects'

export type CommunitySurfaceKey = 'places' | 'saved' | 'reports' | 'submit'

type CommunityWorkspaceHrefOptions = {
  authorId?: string
  authorLabel?: string
}

export function buildStoryDetailHref(postId: string, returnTo?: string) {
  const safeReturnTo = getSafeInternalRedirectPath(returnTo, '')

  if (!safeReturnTo) {
    return `/places/${postId}`
  }

  const params = new URLSearchParams({ returnTo: safeReturnTo })
  return `/places/${postId}?${params.toString()}`
}

export function getCommunitySurfaceKey(path?: string): CommunitySurfaceKey {
  const pathname = (path ?? '').split('?')[0]?.split('#')[0] ?? path ?? ''

  if (pathname === '/saved') {
    return 'saved'
  }

  if (pathname === '/reports') {
    return 'reports'
  }

  if (pathname === '/submit') {
    return 'submit'
  }

  return 'places'
}

export function getCommunityReturnLink(returnTo?: string) {
  const href = getSafeInternalRedirectPath(returnTo, '/places')
  const active = getCommunitySurfaceKey(href)

  if (active === 'saved') {
    return { href, label: 'Saved stories', active }
  }

  if (active === 'reports') {
    return { href, label: 'Safety reports', active }
  }

  if (active === 'submit') {
    return { href, label: 'Recent submissions', active }
  }

  return { href, label: 'Browse stories', active }
}

export function appendQueryParam(path: string, key: string, value: string) {
  const [pathnameWithQuery, hash = ''] = path.split('#', 2)
  const [pathname = '', query = ''] = pathnameWithQuery.split('?', 2)
  const params = new URLSearchParams(query)
  params.set(key, value)

  const nextQuery = params.toString()
  return `${pathname}${nextQuery ? `?${nextQuery}` : ''}${hash ? `#${hash}` : ''}`
}

export function appendCommunityAuthorParams(params: URLSearchParams, authorId?: string, authorLabel?: string) {
  if (authorId) {
    params.set('author', authorId)
  }

  if (authorLabel?.trim()) {
    params.set('authorLabel', authorLabel.trim())
  }
}

export function buildCommunityWorkspaceHref(
  surface: CommunitySurfaceKey,
  options?: CommunityWorkspaceHrefOptions
) {
  const pathname = surface === 'places' ? '/places' : `/${surface}`

  if (surface === 'submit') {
    return pathname
  }

  const params = new URLSearchParams()
  appendCommunityAuthorParams(params, options?.authorId, options?.authorLabel)

  const search = params.toString()
  return search ? `${pathname}?${search}` : pathname
}
