import { headers } from 'next/headers'

const LOCALHOST_ORIGIN = 'http://localhost:3000'

function normalizeOrigin(value?: string | null): string | null {
  const trimmed = value?.trim()
  if (!trimmed) {
    return null
  }

  return trimmed.replace(/\/$/, '')
}

function fromVercelEnv(value?: string | null): string | null {
  const trimmed = value?.trim()
  if (!trimmed) {
    return null
  }

  return normalizeOrigin(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`)
}

export function getConfiguredAppOrigin(): string {
  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL) ??
    fromVercelEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    fromVercelEnv(process.env.VERCEL_URL) ??
    LOCALHOST_ORIGIN
  )
}

export async function getRequestOriginOrConfiguredAppOrigin(): Promise<string> {
  const headerStore = await headers()

  const directOrigin = normalizeOrigin(headerStore.get('origin'))
  if (directOrigin) {
    return directOrigin
  }

  const forwardedHost = normalizeOrigin(headerStore.get('x-forwarded-host'))
  if (forwardedHost) {
    const forwardedProto = normalizeOrigin(headerStore.get('x-forwarded-proto')) ?? 'https'
    return `${forwardedProto}://${forwardedHost}`
  }

  return getConfiguredAppOrigin()
}

export function absoluteAppUrl(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getConfiguredAppOrigin()}${normalizedPath}`
}
