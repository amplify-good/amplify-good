'use client'

import { createClient } from '@/lib/supabase/client'

export type Role = 'musician' | 'nonprofit' | 'community'

export interface AppSession {
  userId: string
  email: string
  role: Role
  displayName: string
}

type SignUpPayload = {
  email: string
  password: string
  role: Role
  displayName: string
  musician?: {
    bio?: string
    genres: string[]
    rate?: number
    rateType: 'per_event' | 'hourly'
  }
  nonprofit?: {
    bio?: string
    website?: string
    cause?: string
  }
}

/**
 * Sign in with email + password.
 * Returns the user's role on success, or an error message on failure.
 */
export async function login(
  email: string,
  password: string
): Promise<{ role: Role } | { error: string }> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    return { error: error?.message ?? 'Login failed' }
  }

  const role = data.user.user_metadata?.role as Role | undefined
  if (!role) return { error: 'Profile not found. Please contact support.' }

  return { role }
}

/**
 * Sign up a new user and immediately sign them in.
 * The handle_new_user trigger auto-creates the profiles row.
 */
export async function signupAndLogin(
  payload: SignUpPayload
): Promise<{ role: Role } | { error: string }> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: { role: payload.role, display_name: payload.displayName },
    },
  })

  if (error || !data.user) {
    return { error: error?.message ?? 'Signup failed' }
  }

  if (!data.session) {
    return {
      error:
        'Signup succeeded, but no active session was created. Disable email confirmation in Supabase or add a confirmation callback flow before allowing public signup.',
    }
  }

  if (payload.role === 'musician') {
    const musician = payload.musician
    const { error: musicianError } = await supabase
      .from('musicians')
      .insert({
        user_id: data.user.id,
        name: payload.displayName,
        bio: musician?.bio?.trim() || null,
        genres: musician?.genres?.length ? musician.genres : [],
        photo_url: null,
        rate: musician?.rate ?? 0,
        rate_type: musician?.rateType ?? 'hourly',
        available: true,
      })

    if (musicianError) {
      return { error: `Signup succeeded, but musician profile creation failed: ${musicianError.message}` }
    }
  }

  if (payload.role === 'nonprofit') {
    const nonprofit = payload.nonprofit
    const { error: nonprofitError } = await supabase
      .from('nonprofits')
      .insert({
        user_id: data.user.id,
        name: payload.displayName,
        bio: nonprofit?.bio?.trim() || null,
        website: nonprofit?.website?.trim() || null,
        logo_url: null,
        contact_email: payload.email,
        cause: nonprofit?.cause?.trim() || null,
      })

    if (nonprofitError) {
      return { error: `Signup succeeded, but nonprofit profile creation failed: ${nonprofitError.message}` }
    }
  }

  return { role: payload.role }
}

/**
 * Get the current session from the browser Supabase client.
 * Returns null if not logged in.
 */
export async function getSession(): Promise<AppSession | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const role = user.user_metadata?.role as Role | undefined
  const displayName = user.user_metadata?.display_name as string | undefined

  if (!role) return null

  return {
    userId: user.id,
    email: user.email!,
    role,
    displayName: displayName || user.email!,
  }
}

/**
 * Sign out the current user (local only — clears cookies without a network call).
 */
export async function logout(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut({ scope: 'local' })
}
