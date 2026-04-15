'use server'

import { getServerSession } from '@/lib/supabase/server'
import { getNonprofitByUserId, createEvent, updateEvent } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createEventAction(data: {
  name: string
  dateTime: string
  venue: string
  vibe?: string
  expectedAttendance?: number
  genrePref?: string
  description?: string
  shortDescription?: string
  cause?: string
}): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'Not authenticated.' }
  if (session.role !== 'nonprofit') {
    return { success: false, error: 'Only nonprofits can create events.' }
  }

  const nonprofit = await getNonprofitByUserId(session.userId)
  if (!nonprofit) {
    return { success: false, error: 'Nonprofit profile not found. Please complete your profile first.' }
  }

  try {
    const event = await createEvent({
      nonprofitId: nonprofit.id,
      ...data,
    })

    await updateEvent(event.id, { status: 'upcoming' })

    revalidatePath('/events')
    revalidatePath('/dashboard')
    return { success: true, eventId: event.id }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create event.' }
  }
}

export async function publishEventAction(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'Not authenticated.' }
  if (session.role !== 'nonprofit') {
    return { success: false, error: 'Only nonprofits can publish events.' }
  }

  try {
    await updateEvent(eventId, { status: 'upcoming' })
    revalidatePath('/events')
    revalidatePath('/dashboard')
    revalidatePath(`/events/${eventId}`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to publish event.' }
  }
}

export async function assignMusicianAction(
  eventId: string,
  musicianId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'Not authenticated.' }
  if (session.role !== 'nonprofit') {
    return { success: false, error: 'Only nonprofits can assign musicians.' }
  }

  try {
    await updateEvent(eventId, { musicianId })
    revalidatePath('/dashboard')
    revalidatePath(`/events/${eventId}`)
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to assign musician.' }
  }
}
