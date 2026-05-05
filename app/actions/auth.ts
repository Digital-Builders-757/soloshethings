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

import { createClient } from '@/lib/supabase/server'
import { formatSignInError, formatSignUpError } from '@/lib/auth-errors'
import { getPostAuthRedirectPath, getSafeInternalRedirectPath } from '@/lib/auth-redirects'
import { generateUsername } from '@/lib/auth-utils'
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

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required' }
  }

  try {
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

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: username.toLowerCase().trim(),
        role: 'talent',
        privacy_level: 'public',
      })
      .select('id')
      .single()

    if (profileError) {
      console.error('Profile creation failed:', profileError)
      await supabase.auth.signOut()
      return { error: 'Profile creation failed. Please try again or contact support.' }
    }

    revalidatePath('/', 'layout')

    if (!authData.session) {
      redirect('/login?notice=confirm_email')
    }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'Something went wrong during sign up. Please try again.' }
  }

  redirect(getPostAuthRedirectPath('talent'))
}

/**
 * Login action with profile check and safe redirect
 */
export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
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

    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (!existing) {
      console.warn('Profile missing for user:', userId)

      const { error: repairError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: generateUsername(email),
          role: 'talent',
          privacy_level: 'public',
        })
        .select('id')
        .single()

      if (repairError) {
        console.error('Profile repair failed:', repairError)
        const { data: raced } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle()

        if (!raced) {
          await supabase.auth.signOut()
          return {
            error:
              'Your account is missing profile data and we could not fix it automatically. Please contact support.',
          }
        }
      }
    }

    const { data: roleRow } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()

    if (!roleRow) {
      await supabase.auth.signOut()
      return {
        error: 'Your profile could not be loaded. Please try again or contact support.',
      }
    }

    role = roleRow.role
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Something went wrong during sign in. Please try again.' }
  }

  const defaultPath = getPostAuthRedirectPath(role)
  const nextPath = getSafeInternalRedirectPath(redirectToRaw, defaultPath)
  redirect(nextPath)
}

/**
 * Logout — contract: return users to sign-in after session ends
 */
export async function logout() {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: 'We could not sign you out. Please try again.' }
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'Something went wrong while signing out.' }
  }

  redirect('/login?signedOut=1')
}
