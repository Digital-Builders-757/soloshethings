/**
 * Authentication Server Actions
 *
 * MUST follow: docs/contracts/AUTH_CONTRACT.md
 *
 * Rules:
 * - Use getUser(), not getSession()
 * - Profile bootstrap is atomic with signup
 * - Role-based redirects after auth
 * - Bounded profile repair (max 1 retry)
 */

'use server'

import { formatSignInError, formatSignUpError } from '@/lib/auth-errors'
import { getPostAuthRedirectPath, getSafeInternalRedirectPath } from '@/lib/auth-redirects'
import { isValidUsername, normalizeUsername } from '@/lib/auth-utils'
import { getProfileWithBoundedRepair } from '@/lib/queries/profiles'
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { user_role } from '@/types/database'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Signup action with profile bootstrap
 */
export async function signup(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const supabase = await createClient()

  const email = `${formData.get('email') ?? ''}`.trim().toLowerCase()
  const password = `${formData.get('password') ?? ''}`
  const username = normalizeUsername(`${formData.get('username') ?? ''}`)
  const redirectToRaw = formData.get('redirectTo') as string | null

  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required' }
  }

  if (!isValidUsername(username)) {
    return { error: 'Username can only contain letters, numbers, and underscores' }
  }

  try {
    const adminSupabase = createServiceRoleClient()

    const { data: existingUsername, error: usernameLookupError } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (usernameLookupError) {
      if (usernameLookupError.code === 'PGRST205') {
        console.error(
          "[signup] public.profiles is missing on the Supabase project for NEXT_PUBLIC_SUPABASE_URL. " +
            'Apply migrations (e.g. `supabase link` then `supabase db push`, or run `supabase/migrations/*.sql` in the SQL editor).'
        )
        if (process.env.NODE_ENV === 'development') {
          return {
            error:
              'Database schema is not applied: the profiles table was not found. Run Supabase migrations for this project (see console).',
          }
        }
      } else {
        console.error('Signup username lookup failed:', usernameLookupError)
      }
      return { error: 'We could not validate your username. Please try again.' }
    }

    if (existingUsername) {
      return { error: 'This username is already taken. Please choose another.' }
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { error: formatSignUpError(authError) }
    }

    if (!authData.user) {
      return { error: 'We could not create your account. Please try again.' }
    }

    const { error: profileError } = await adminSupabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username,
        role: 'talent',
        privacy_level: 'public',
      })
      .select('id')
      .single()

    if (profileError) {
      console.error('Profile creation failed:', profileError)

      try {
        await adminSupabase.auth.admin.deleteUser(authData.user.id)
      } catch (deleteError) {
        console.error('Auth rollback failed after profile creation error:', deleteError)
      }

      if (profileError.code === '23505') {
        return { error: 'That username was just claimed. Please choose another and try again.' }
      }

      return { error: 'Profile creation failed. Please try again or contact support.' }
    }

    revalidatePath('/', 'layout')

    const defaultPath = getPostAuthRedirectPath('talent')
    const nextPath = getSafeInternalRedirectPath(redirectToRaw, defaultPath)

    if (!authData.session) {
      const params = new URLSearchParams({ notice: 'confirm_email' })
      if (nextPath !== defaultPath) {
        params.set('redirectTo', nextPath)
      }
      redirect(`/login?${params.toString()}`)
    }

    redirect(nextPath)
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'Something went wrong during sign up. Please try again.' }
  }
}

/**
 * Login action with profile check and safe redirect
 */
export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const supabase = await createClient()

  const email = `${formData.get('email') ?? ''}`.trim().toLowerCase()
  const password = `${formData.get('password') ?? ''}`
  const redirectToRaw = formData.get('redirectTo') as string | null

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  let role: user_role = 'talent'

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return { error: formatSignInError(authError) }
    }

    if (!authData.user) {
      return { error: 'Sign in failed. Please try again.' }
    }

    const userId = authData.user.id
    const profile = await getProfileWithBoundedRepair(userId, authData.user.email ?? email)

    if (!profile) {
      await supabase.auth.signOut()
      return {
        error:
          'Your profile could not be loaded. Please try again or contact support if this continues.',
      }
    }

    role = profile.role
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Something went wrong during sign in. Please try again.' }
  }

  const defaultPath = getPostAuthRedirectPath(role)
  const nextPath = getSafeInternalRedirectPath(redirectToRaw, defaultPath)
  redirect(nextPath)
}

/** Sign out on the server (clears cookies on the response). Client navigates to login — avoids redirect/try-catch issues in client handlers. See AUTH_CONTRACT.md */
export async function logout(): Promise<
  { error: string } | { ok: true }
> {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout Supabase error:', error)
      return { error: 'We could not sign you out. Please try again.' }
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'Something went wrong while signing out.' }
  }

  return { ok: true }
}
