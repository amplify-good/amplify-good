import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — can't set cookies, safe to ignore
          }
        },
      },
    }
  )
}

/**
 * Returns the authenticated user's session with profile data, or null.
 * Use this in Server Components and Server Actions.
 */
export async function getServerSession(): Promise<{
  userId: string
  email: string
  role: 'musician' | 'nonprofit' | 'community'
  displayName: string
} | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    userId: user.id,
    email: user.email!,
    role: profile.role as 'musician' | 'nonprofit' | 'community',
    displayName: profile.display_name || user.email!,
  }
}
