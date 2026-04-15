import { createClient } from '@/lib/supabase/server'
import type { DbEvent, DbEventWithRelations, CreateEventData } from './types'

export async function getEvents(filters?: {
  status?: string
  cause?: string
  genre?: string
  search?: string
}): Promise<DbEvent[]> {
  const supabase = await createClient()

  let query = supabase
    .from('events')
    .select('*')
    .not('name', 'ilike', 'Test%')
    .order('date_time', { ascending: true })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.neq('status', 'draft')
  }

  if (filters?.cause) {
    query = query.eq('cause', filters.cause)
  }

  if (filters?.genre) {
    query = query.eq('genre_pref', filters.genre)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch events: ${error.message}`)
  return data ?? []
}

export async function getEventById(id: string): Promise<DbEventWithRelations | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*, nonprofits(*), musicians(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as DbEventWithRelations
}

export async function getEventsByNonprofitId(nonprofitId: string): Promise<DbEvent[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('nonprofit_id', nonprofitId)
    .order('date_time', { ascending: true })

  if (error) throw new Error(`Failed to fetch nonprofit events: ${error.message}`)
  return data ?? []
}

export async function completeExpiredEvents(): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('events')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('status', 'upcoming')
    .lt('date_time', new Date().toISOString())

  if (error) console.error('Failed to auto-complete events:', error.message)
}

export async function createEvent(data: CreateEventData): Promise<DbEvent> {
  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('events')
    .insert({
      nonprofit_id: data.nonprofitId,
      name: data.name,
      date_time: data.dateTime,
      venue: data.venue,
      vibe: data.vibe ?? null,
      expected_attendance: data.expectedAttendance ?? null,
      genre_pref: data.genrePref ?? null,
      description: data.description ?? null,
      short_description: data.shortDescription ?? null,
      cause: data.cause ?? null,
      status: 'draft',
    })
    .select()
    .single()

  if (error || !created) throw new Error(`Failed to create event: ${error?.message}`)
  return created
}

export async function updateEvent(id: string, data: Partial<CreateEventData> & {
  status?: 'upcoming' | 'completed' | 'draft'
  musicianId?: string | null
}): Promise<DbEvent> {
  const supabase = await createClient()

  const patch: Record<string, unknown> = {}
  if (data.name !== undefined) patch.name = data.name
  if (data.dateTime !== undefined) patch.date_time = data.dateTime
  if (data.venue !== undefined) patch.venue = data.venue
  if (data.vibe !== undefined) patch.vibe = data.vibe
  if (data.expectedAttendance !== undefined) patch.expected_attendance = data.expectedAttendance
  if (data.genrePref !== undefined) patch.genre_pref = data.genrePref
  if (data.description !== undefined) patch.description = data.description
  if (data.shortDescription !== undefined) patch.short_description = data.shortDescription
  if (data.cause !== undefined) patch.cause = data.cause
  if (data.status !== undefined) patch.status = data.status
  if (data.musicianId !== undefined) patch.musician_id = data.musicianId
  patch.updated_at = new Date().toISOString()

  const { data: updated, error } = await supabase
    .from('events')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) throw new Error(`Failed to update event: ${error?.message}`)
  return updated
}
