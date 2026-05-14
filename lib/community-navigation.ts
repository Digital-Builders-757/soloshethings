import { getSafeInternalRedirectPath } from '@/lib/auth-redirects'

export function buildStoryDetailHref(postId: string, returnTo?: string) {
  const safeReturnTo = getSafeInternalRedirectPath(returnTo, '')

  if (!safeReturnTo) {
    return `/places/${postId}`
  }

  const params = new URLSearchParams({ returnTo: safeReturnTo })
  return `/places/${postId}?${params.toString()}`
}

export function getCommunityReturnLink(returnTo?: string) {
  const href = getSafeInternalRedirectPath(returnTo, '/places')
  const pathname = href.split('?')[0]?.split('#')[0] ?? href

  if (pathname === '/saved') {
    return { href, label: 'Saved stories' }
  }

  if (pathname === '/reports') {
    return { href, label: 'Safety reports' }
  }

  if (pathname === '/submit') {
    return { href, label: 'Recent submissions' }
  }

  return { href, label: 'Browse stories' }
}

export function appendQueryParam(path: string, key: string, value: string) {
  const [pathnameWithQuery, hash = ''] = path.split('#', 2)
  const [pathname = '', query = ''] = pathnameWithQuery.split('?', 2)
  const params = new URLSearchParams(query)
  params.set(key, value)

  const nextQuery = params.toString()
  return `${pathname}${nextQuery ? `?${nextQuery}` : ''}${hash ? `#${hash}` : ''}`
}
