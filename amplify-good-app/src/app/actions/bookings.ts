'use server'

import { getServerSession } from '@/lib/supabase/server'
import { getMusicianById, createBooking, updateBookingStatus } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const IMPACT_COMMISSION_RATE = 0.15

export async function createBookingAction(data: {
  musicianId: string
  eventName: string
  eventDate: string
  location: string
  duration: string
  message?: string
}): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'You must be logged in to make a booking.' }
  if (session.role !== 'community') {
    return { success: false, error: 'Only community members can book musicians.' }
  }

  const musician = await getMusicianById(data.musicianId)
  if (!musician) return { success: false, error: 'Musician not found.' }
  if (!musician.available) return { success: false, error: 'This musician is currently unavailable.' }

  // Calculate rate based on duration and rate type
  let durationHours = 1
  const durationMatch = data.duration.match(/^(\d+)/)
  if (durationMatch) durationHours = parseInt(durationMatch[1], 10)

  const musicianRate =
    musician.rate_type === 'hourly'
      ? musician.rate * durationHours
      : musician.rate

  const commissionAmount = Math.round(musicianRate * IMPACT_COMMISSION_RATE * 100) / 100
  const totalCharged = musicianRate + commissionAmount

  try {
    const booking = await createBooking({
      musicianId: data.musicianId,
      communityMemberId: session.userId,
      eventName: data.eventName,
      eventDate: data.eventDate,
      location: data.location,
      duration: data.duration,
      musicianRate,
      commissionAmount,
      totalCharged,
      message: data.message,
    })

    revalidatePath('/dashboard')
    return { success: true, bookingId: booking.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create booking.' }
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: 'confirmed' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'Not authenticated.' }

  if (
    (status === 'confirmed' || status === 'cancelled') &&
    session.role !== 'musician'
  ) {
    return { success: false, error: 'Only musicians can accept or decline bookings.' }
  }

  try {
    await updateBookingStatus(bookingId, status)
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update booking.' }
  }
}
