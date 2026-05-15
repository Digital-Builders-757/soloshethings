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

import { captureProductSignal } from '@/lib/analytics/product-signals'
import { formatSignInError, formatSignUpError } from '@/lib/auth-errors'
import { getPostAuthRedirectPath, getSafeInternalRedirectPath } from '@/lib/auth-redirects'
import { isValidUsername, normalizeUsername } from '@/lib/auth-utils'
import { getRequestOriginOrConfiguredAppOrigin } from '@/lib/app-url'
import { getProfileWithBoundedRepair } from '@/lib/queries/profiles'
import { logServerFailure } from '@/lib/server-log'
import { mapSupabaseErrorForUser } from '@/lib/supabase-errors'
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { user_role } from '@/types/database'
import type { PostgrestError } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect, unstable_rethrow } from 'next/navigation'

const SIGNUP_PROFILE_FK_MAX_ATTEMPTS = 4
const SIGNUP_PROFILE_FK_RETRY_DELAYS_MS = [120, 200, 280] as const

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Insert signup profile with bounded retries when the FK parent row is not yet visible (replication / ordering).
 */
async function insertSignupProfileRow(
  adminSupabase: ReturnType<typeof createServiceRoleClient>,
  params: { userId: string; username: string },
): Promise<{ error: PostgrestError | null }> {
  const row = {
    id: params.userId,
    username: params.username,
    role: 'talent' as const,
    privacy_level: 'public' as const,
  }

  for (let attempt = 0; attempt < SIGNUP_PROFILE_FK_MAX_ATTEMPTS; attempt++) {
    const { error } = await adminSupabase.from('profiles').insert(row).select('id').single()

    if (!error) {
      return { error: null }
    }

    const isLastAttempt = attempt >= SIGNUP_PROFILE_FK_MAX_ATTEMPTS - 1
    if (error.code === '23503' && !isLastAttempt) {
      logServerFailure({
        category: 'mutation',
        operation: 'signup.insertProfile.retry',
        cause: error,
        context: { userId: params.userId, attempt: attempt + 1, maxAttempts: SIGNUP_PROFILE_FK_MAX_ATTEMPTS },
      })
      await delay(SIGNUP_PROFILE_FK_RETRY_DELAYS_MS[attempt] ?? 300)
      continue
    }

    return { error }
  }

  return { error: null }
}

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
        logServerFailure({
          category: 'mutation',
          operation: 'signup.usernameLookup',
          cause: usernameLookupError,
          context: { note: 'profiles_table_or_schema_missing' },
        })
        if (process.env.NODE_ENV === 'development') {
          return {
            error:
              'Database schema is not applied: the profiles table was not found. Run Supabase migrations for this project (see server logs).',
          }
        }
      } else {
        const mapped = mapSupabaseErrorForUser(
          usernameLookupError,
          'We could not validate your username. Please try again.'
        )
        logServerFailure({
          category: 'mutation',
          operation: 'signup.usernameLookup',
          cause: usernameLookupError,
          context: mapped.devHint ? { devHint: mapped.devHint } : undefined,
        })
        return { error: mapped.userMessage }
      }
      return { error: 'We could not validate your username. Please try again.' }
    }

    if (existingUsername) {
      return { error: 'This username is already taken. Please choose another.' }
    }

    const defaultPath = getPostAuthRedirectPath('talent')
    const nextPath = getSafeInternalRedirectPath(redirectToRaw, defaultPath)
    const confirmEmailUrl = new URL('/login', await getRequestOriginOrConfiguredAppOrigin())
    confirmEmailUrl.searchParams.set('notice', 'confirmed_email')
    if (nextPath !== defaultPath) {
      confirmEmailUrl.searchParams.set('redirectTo', nextPath)
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: confirmEmailUrl.toString(),
      },
    })

    if (authError) {
      return { error: formatSignUpError(authError) }
    }

    if (!authData.user) {
      return { error: 'We could not create your account. Please try again.' }
    }

    const userId = authData.user.id

    const { data: verifiedAuthUser, error: verifyUserError } =
      await adminSupabase.auth.admin.getUserById(userId)
    if (verifyUserError || !verifiedAuthUser.user) {
      logServerFailure({
        category: 'mutation',
        operation: 'signup.verifyAuthUser',
        cause: verifyUserError ?? new Error('auth_user_missing_after_signup'),
        context: { userId },
      })
      try {
        await adminSupabase.auth.admin.deleteUser(userId)
      } catch (deleteError) {
        logServerFailure({
          category: 'auth',
          operation: 'signup.rollbackDeleteUser',
          cause: deleteError,
          context: { userId, note: 'after_verifyAuthUser_failed' },
        })
      }
      return { error: 'We could not create your account. Please try again.' }
    }

    const { error: profileError } = await insertSignupProfileRow(adminSupabase, {
      userId,
      username,
    })

    if (profileError) {
      logServerFailure({
        category: 'mutation',
        operation: 'signup.insertProfile',
        cause: profileError,
        context: { userId, profileErrorCode: profileError.code },
      })

      try {
        await adminSupabase.auth.admin.deleteUser(userId)
      } catch (deleteError) {
        logServerFailure({
          category: 'auth',
          operation: 'signup.rollbackDeleteUser',
          cause: deleteError,
          context: { userId },
        })
      }

      if (profileError.code === '23505') {
        return { error: 'That username was just claimed. Please choose another and try again.' }
      }

      const mapped = mapSupabaseErrorForUser(
        profileError,
        'Profile creation failed. Please try again or contact support.'
      )
      return { error: mapped.userMessage }
    }

    revalidatePath('/', 'layout')

    captureProductSignal('signup_completed', {
      confirm_email_pending: !authData.session,
    })

    if (!authData.session) {
      const params = new URLSearchParams({ notice: 'confirm_email' })
      if (nextPath !== defaultPath) {
        params.set('redirectTo', nextPath)
      }
      redirect(`/login?${params.toString()}`)
    }

    redirect(nextPath)
  } catch (error) {
    unstable_rethrow(error)
    logServerFailure({ category: 'auth', operation: 'signup', cause: error })
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
    unstable_rethrow(error)
    logServerFailure({ category: 'auth', operation: 'login', cause: error })
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
      logServerFailure({ category: 'auth', operation: 'logout.signOut', cause: error })
      return { error: 'We could not sign you out. Please try again.' }
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    logServerFailure({ category: 'auth', operation: 'logout', cause: error })
    return { error: 'Something went wrong while signing out.' }
  }

  return { ok: true }
}
