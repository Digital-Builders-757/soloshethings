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
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Signup action with profile bootstrap
 *
 * Flow:
 * 1. Create auth user
 * 2. Bootstrap profile (atomic)
 * 3. Create Stripe subscription with trial (TODO: Phase 4)
 * 4. Send welcome email (TODO: Phase 4)
 * 5. Redirect to dashboard
 *
 * @param formData - Form data containing email, password, username
 * @returns Error object or redirects (never returns on success)
 */
export async function signup(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const supabase = await createClient()

  // Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // Validate inputs
  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required' }
  }

  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'User creation failed' }
    }

    // 2. Bootstrap profile (atomic with signup)
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: username.toLowerCase().trim(),
        role: 'talent', // Default role
        privacy_level: 'public', // Default privacy
      })
      .select('id')
      .single()

    if (profileError) {
      // Rollback: Delete auth user if profile creation fails
      // Note: This requires service role, which we'll implement later
      console.error('Profile creation failed:', profileError)
      return { error: 'Profile creation failed. Please try again.' }
    }

    // TODO Phase 4: Create Stripe subscription with 7-day trial
    // const subscription = await createSubscriptionWithTrial(authData.user.id, email)

    // TODO Phase 4: Send welcome email (non-blocking)
    // sendWelcomeEmail(email, username).catch(console.error)

    // Success! Revalidate and redirect
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred during signup' }
  }

  // Redirect to dashboard (outside try-catch as redirect throws)
  redirect('/dashboard')
}

/**
 * Login action with profile check
 *
 * Flow:
 * 1. Authenticate user
 * 2. Check profile exists (repair if missing, bounded)
 * 3. Redirect based on role
 *
 * @param _prevState - Previous form state (from useFormState)
 * @param formData - Form data containing email and password
 * @returns Error object or redirects (never returns on success)
 */
export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const supabase = await createClient()

  // Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate inputs
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    // 1. Authenticate
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Authentication failed' }
    }

    // 2. Profile check (repair if missing - bounded, max 1 retry)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      // Profile missing - attempt repair (bounded, max 1 retry)
      console.warn('Profile missing for user:', authData.user.id)

      // Try to create missing profile
      const { error: repairError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: generateUsername(email),
          role: 'talent',
          privacy_level: 'public',
        })
        .select('id')
        .single()

      if (repairError) {
        // Repair failed - don't allow login
        console.error('Profile repair failed:', repairError)
        await supabase.auth.signOut()
        return { error: 'Profile setup incomplete. Please contact support.' }
      }
    }

    // Success! Revalidate and redirect
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An unexpected error occurred during login' }
  }

  // TODO: Role-based redirect in future
  // For now, redirect all users to /dashboard
  redirect('/dashboard')
}

/**
 * Logout action
 *
 * Signs out the user and redirects to home page
 */
export async function logout() {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Logout error:', error)
    return { error: 'An unexpected error occurred during logout' }
  }

  redirect('/')
}

/**
 * Generate a username from email
 *
 * Takes the part before @ and sanitizes it
 * Adds random numbers if needed to ensure uniqueness
 *
 * @param email - User's email address
 * @returns Generated username
 */
function generateUsername(email: string): string {
  const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  const random = Math.floor(Math.random() * 10000)
  return `${base}${random}`
}
