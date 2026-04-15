'use server'

import { getServerSession, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getMusicianByUserId, updateMusician } from '@/lib/db/musicians'
import type { UpdateMusicianData } from '@/lib/db/types'

export async function updateProfileAction(data: {
  displayName?: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'Not authenticated.' }

  const supabase = await createClient()

  const patch: Record<string, string> = {}
  if (data.displayName) patch.display_name = data.displayName

  if (Object.keys(patch).length === 0) {
    return { success: false, error: 'No fields to update.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', session.userId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateMusicianProfileAction(data: {
  name?: string
  bio?: string | null
  genres?: string[]
  photoUrl?: string | null
  rate?: number
  rateType?: 'per_event' | 'hourly'
  available?: boolean
}): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'Not authenticated.' }
  if (session.role !== 'musician') return { success: false, error: 'Only musicians can update musician profiles.' }

  const musician = await getMusicianByUserId(session.userId)
  if (!musician) return { success: false, error: 'Musician profile not found.' }

  const patch: UpdateMusicianData = {}
  if (data.name !== undefined) patch.name = data.name.trim()
  if (data.bio !== undefined) patch.bio = data.bio?.trim() || null
  if (data.genres !== undefined) patch.genres = data.genres
  if (data.photoUrl !== undefined) patch.photoUrl = data.photoUrl
  if (data.rate !== undefined) patch.rate = data.rate
  if (data.rateType !== undefined) patch.rateType = data.rateType
  if (data.available !== undefined) patch.available = data.available

  if (Object.keys(patch).length === 0) {
    return { success: false, error: 'No fields to update.' }
  }

  try {
    await updateMusician(musician.id, patch)
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Update failed.' }
  }

  // Keep profiles.display_name in sync when name changes
  if (patch.name) {
    const supabase = await createClient()
    await supabase.from('profiles').update({ display_name: patch.name }).eq('id', session.userId)
  }

  revalidatePath('/dashboard')
  revalidatePath('/musicians')
  return { success: true }
}
