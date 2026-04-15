import { createClient } from '@/lib/supabase/server'
import type { DbMusician, DbMusicianWithLinks, CreateMusicianData, UpdateMusicianData } from './types'

export async function getMusicians(filters?: {
  genres?: string[]
  maxRate?: number
  available?: boolean
}): Promise<DbMusician[]> {
  const supabase = await createClient()

  let query = supabase
    .from('musicians')
    .select('*')
    .not('name', 'ilike', 'UI Test%')
    .order('name')

  if (filters?.available !== undefined) {
    query = query.eq('available', filters.available)
  }
  if (filters?.maxRate !== undefined) {
    query = query.lte('rate', filters.maxRate)
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch musicians: ${error.message}`)

  let musicians = data ?? []

  // Genre filtering done in-memory since genres is an array column
  if (filters?.genres && filters.genres.length > 0) {
    musicians = musicians.filter((m) =>
      filters.genres!.some((g) => m.genres.includes(g))
    )
  }

  return musicians
}

export async function getMusicianById(id: string): Promise<DbMusicianWithLinks | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('musicians')
    .select('*, musician_media_links(*), musician_social_links(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null

  // Deduplicate and sort links by sort_order (seed may insert duplicates without unique constraints)
  const dedup = <T extends { url: string; sort_order: number }>(arr: T[]): T[] => {
    const seen = new Set<string>()
    return arr
      .sort((a, b) => a.sort_order - b.sort_order)
      .filter((item) => {
        if (seen.has(item.url)) return false
        seen.add(item.url)
        return true
      })
  }

  return {
    ...data,
    musician_media_links: dedup(data.musician_media_links ?? []),
    musician_social_links: dedup(data.musician_social_links ?? []),
  }
}

export async function getMusicianByUserId(userId: string): Promise<DbMusician | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('musicians')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data
}

export async function createMusician(data: CreateMusicianData): Promise<DbMusician> {
  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('musicians')
    .insert({
      user_id: data.userId,
      name: data.name,
      bio: data.bio ?? null,
      genres: data.genres,
      photo_url: data.photoUrl ?? null,
      rate: data.rate,
      rate_type: data.rateType,
      available: true,
    })
    .select()
    .single()

  if (error || !created) throw new Error(`Failed to create musician: ${error?.message}`)
  return created
}

export async function updateMusician(
  musicianId: string,
  data: UpdateMusicianData
): Promise<DbMusician> {
  const supabase = await createClient()

  const patch: Record<string, unknown> = {}
  if (data.name !== undefined) patch.name = data.name
  if (data.bio !== undefined) patch.bio = data.bio
  if (data.genres !== undefined) patch.genres = data.genres
  if (data.photoUrl !== undefined) patch.photo_url = data.photoUrl
  if (data.rate !== undefined) patch.rate = data.rate
  if (data.rateType !== undefined) patch.rate_type = data.rateType
  if (data.available !== undefined) patch.available = data.available

  const { data: updated, error } = await supabase
    .from('musicians')
    .update(patch)
    .eq('id', musicianId)
    .select()
    .single()

  if (error || !updated) throw new Error(`Failed to update musician: ${error?.message}`)
  return updated
}

/**
 * Returns up to `limit` musicians sorted by genre match first.
 * Genre-matched musicians appear before unmatched ones.
 */
export async function suggestMusiciansForEvent(
  genrePref: string,
  limit = 3
): Promise<DbMusician[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('musicians')
    .select('*')
    .eq('available', true)
    .not('name', 'ilike', 'UI Test%')
    .order('name')

  if (error) throw new Error(`Failed to suggest musicians: ${error.message}`)

  const all = data ?? []
  const matched = all.filter((m) =>
    m.genres.some((g: string) => g.toLowerCase() === genrePref.toLowerCase())
  )
  const others = all.filter(
    (m) => !m.genres.some((g: string) => g.toLowerCase() === genrePref.toLowerCase())
  )

  return [...matched, ...others].slice(0, limit)
}

export async function getEventsByMusicianId(musicianId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('musician_id', musicianId)
    .order('date_time')

  if (error) throw new Error(`Failed to fetch musician events: ${error.message}`)
  return data ?? []
}
