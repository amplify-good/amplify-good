import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  getServerSession: vi.fn(),
  createClient: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  getNonprofitByUserId: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { getServerSession } from '@/lib/supabase/server'
import { getNonprofitByUserId, createEvent } from '@/lib/db'
import { createEventAction, publishEventAction } from '@/app/actions/events'

const mockNonprofitSession = { userId: 'npo-user', email: 'npo@gmail.com', role: 'nonprofit' as const, displayName: 'Austin Food Bank' }
const mockNonprofit = { id: 'np-1', user_id: 'npo-user', name: 'Austin Food Bank', bio: null, website: null, logo_url: null, contact_email: null, cause: null, created_at: '', updated_at: '' }
const mockEvent = { id: 'event-1', nonprofit_id: 'np-1', musician_id: null, name: 'Test Gala', date_time: '2026-07-01T18:00:00Z', venue: 'Austin', vibe: null, expected_attendance: null, genre_pref: 'Jazz', description: null, short_description: null, cause: 'Healthcare', status: 'draft' as const, rsvp_count: 0, created_at: '', updated_at: '' }

beforeEach(() => vi.clearAllMocks())

describe('createEventAction', () => {
  it('returns error when not authenticated', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await createEventAction({ name: 'Test', dateTime: '2026-07-01', venue: 'Austin' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('authenticated')
  })

  it('returns error when community member tries to create event', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockNonprofitSession, role: 'community' })
    const result = await createEventAction({ name: 'Test', dateTime: '2026-07-01', venue: 'Austin' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('nonprofit')
  })

  it('returns error when nonprofit profile not found', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockNonprofitSession)
    ;(getNonprofitByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await createEventAction({ name: 'Test', dateTime: '2026-07-01', venue: 'Austin' })
    expect(result.success).toBe(false)
    expect(result.error).toContain('Nonprofit profile')
  })

  it('creates event successfully and returns eventId', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockNonprofitSession)
    ;(getNonprofitByUserId as ReturnType<typeof vi.fn>).mockResolvedValue(mockNonprofit)
    ;(createEvent as ReturnType<typeof vi.fn>).mockResolvedValue(mockEvent)

    const result = await createEventAction({
      name: 'Test Gala', dateTime: '2026-07-01T18:00:00Z', venue: 'The Driskill',
      genrePref: 'Jazz', cause: 'Healthcare',
    })

    expect(result.success).toBe(true)
    expect(result.eventId).toBe('event-1')
  })
})

describe('publishEventAction', () => {
  it('sets event status to upcoming', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockNonprofitSession)
    const { updateEvent } = await import('@/lib/db')
    ;(updateEvent as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockEvent, status: 'upcoming' })

    const result = await publishEventAction('event-1')
    expect(result.success).toBe(true)
    expect(updateEvent).toHaveBeenCalledWith('event-1', { status: 'upcoming' })
  })
})
