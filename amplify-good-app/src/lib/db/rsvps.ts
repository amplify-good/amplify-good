import { createClient } from '@/lib/supabase/server'
import type { DbRsvp } from './types'

export async function getRsvpCount(eventId: string): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  if (error) throw new Error(`Failed to get RSVP count: ${error.message}`)
  return count ?? 0
}

export async function getUserRsvp(
  eventId: string,
  userId: string
): Promise<DbRsvp | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data
}

export async function getUserRsvpEventIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rsvps')
    .select('event_id')
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to get user RSVPs: ${error.message}`)
  return new Set((data ?? []).map((r) => r.event_id))
}

export async function createRsvp(eventId: string, userId: string): Promise<DbRsvp> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rsvps')
    .insert({ event_id: eventId, user_id: userId })
    .select()
    .single()

  if (error || !data) throw new Error(`Failed to create RSVP: ${error?.message}`)
  return data
}

export async function deleteRsvp(eventId: string, userId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId)

  if (error) throw new Error(`Failed to delete RSVP: ${error.message}`)
}
