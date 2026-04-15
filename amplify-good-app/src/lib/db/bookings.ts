import { createClient } from '@/lib/supabase/server'
import type { DbBooking, DbBookingStatus, DbBookingWithMusician, CreateBookingData } from './types'

export async function getBookingsByMusicianId(musicianId: string): Promise<DbBooking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('musician_id', musicianId)
    .order('event_date', { ascending: true })

  if (error) throw new Error(`Failed to fetch musician bookings: ${error.message}`)
  return data ?? []
}

export async function getBookingsByCommunityMemberId(
  userId: string
): Promise<DbBookingWithMusician[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, musicians(*)')
    .eq('community_member_id', userId)
    .order('event_date', { ascending: true })

  if (error) throw new Error(`Failed to fetch community bookings: ${error.message}`)
  return (data ?? []) as DbBookingWithMusician[]
}

export async function createBooking(data: CreateBookingData): Promise<DbBooking> {
  const supabase = await createClient()
  const { data: created, error } = await supabase
    .from('bookings')
    .insert({
      musician_id: data.musicianId,
      community_member_id: data.communityMemberId,
      event_name: data.eventName,
      event_date: data.eventDate,
      location: data.location ?? null,
      duration: data.duration ?? null,
      musician_rate: data.musicianRate,
      commission_amount: data.commissionAmount,
      total_charged: data.totalCharged,
      status: 'pending',
      message: data.message ?? null,
    })
    .select()
    .single()

  if (error || !created) throw new Error(`Failed to create booking: ${error?.message}`)
  return created
}

export async function completeExpiredBookings(): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'completed' as DbBookingStatus, updated_at: new Date().toISOString() })
    .eq('status', 'confirmed')
    .lt('event_date', new Date().toISOString())

  if (error) console.error('Failed to auto-complete bookings:', error.message)
}

export async function updateBookingStatus(
  id: string,
  status: DbBookingStatus
): Promise<DbBooking> {
  const supabase = await createClient()
  const { data: updated, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error || !updated) throw new Error(`Failed to update booking status: ${error?.message}`)
  return updated
}
