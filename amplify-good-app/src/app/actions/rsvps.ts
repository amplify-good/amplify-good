'use server'

import { getServerSession } from '@/lib/supabase/server'
import { getUserRsvp, createRsvp, deleteRsvp } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleRsvpAction(
  eventId: string
): Promise<{ success: boolean; rsvped?: boolean; error?: string }> {
  const session = await getServerSession()
  if (!session) return { success: false, error: 'You must be logged in to RSVP.' }

  try {
    const existing = await getUserRsvp(eventId, session.userId)

    if (existing) {
      await deleteRsvp(eventId, session.userId)
      revalidatePath(`/events/${eventId}`)
      revalidatePath('/home')
      return { success: true, rsvped: false }
    } else {
      await createRsvp(eventId, session.userId)
      revalidatePath(`/events/${eventId}`)
      revalidatePath('/home')
      return { success: true, rsvped: true }
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update RSVP.' }
  }
}
