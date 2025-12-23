/**
 * Next.js Middleware for Authentication and Route Protection
 *
 * MUST follow: docs/contracts/AUTH_CONTRACT.md
 *
 * Responsibilities:
 * - Refresh Supabase session on every request
 * - Protect authenticated routes
 * - Redirect unauthenticated users to login
 * - Allow public routes without auth
 */

import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update Supabase session
  const { supabase, response } = await updateSession(request)

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl
  const pathname = url.pathname

  // Define protected routes (require authentication)
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/submit',
    '/saved',
    '/app', // All routes under (app) route group
  ]

  // Define auth routes (redirect to dashboard if already logged in)
  const authRoutes = ['/login', '/signup']

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is NOT authenticated and trying to access protected routes, redirect to login
  if (!user && isProtectedRoute) {
    // Preserve the original URL to redirect back after login
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow request to proceed
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
