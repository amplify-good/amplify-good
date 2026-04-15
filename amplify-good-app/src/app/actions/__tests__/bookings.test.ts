import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  getServerSession: vi.fn(),
  createClient: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  getMusicianById: vi.fn(),
  createBooking: vi.fn(),
  updateBookingStatus: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { getServerSession } from '@/lib/supabase/server'
import { getMusicianById, createBooking } from '@/lib/db'
import { createBookingAction, updateBookingStatusAction } from '@/app/actions/bookings'

const mockSession = { userId: 'user-1', email: 'fan@gmail.com', role: 'community' as const, displayName: 'Rachel' }
const mockMusician = { id: 'musician-1', name: 'Jazz Band', rate: 350, rate_type: 'per_event' as const, available: true, genres: ['Jazz'], user_id: null, bio: null, photo_url: null, created_at: '', updated_at: '', musician_media_links: [], musician_social_links: [] }
const mockBooking = { id: 'booking-1', musician_id: 'musician-1', community_member_id: 'user-1', event_name: 'Test Event', event_date: '2026-06-01T18:00:00Z', location: 'Austin TX', duration: '2 hours', musician_rate: 350, commission_amount: 52.5, total_charged: 402.5, status: 'pending' as const, message: null, created_at: '', updated_at: '' }

beforeEach(() => vi.clearAllMocks())

describe('createBookingAction', () => {
  it('returns error when not authenticated', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await createBookingAction({
      musicianId: 'musician-1', eventName: 'Test', eventDate: '2026-06-01', location: 'Austin', duration: '2 hours',
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('logged in')
  })

  it('returns error when musician role tries to book', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockSession, role: 'musician' })
    const result = await createBookingAction({
      musicianId: 'musician-1', eventName: 'Test', eventDate: '2026-06-01', location: 'Austin', duration: '2 hours',
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('community members')
  })

  it('returns error when musician not found', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession)
    ;(getMusicianById as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await createBookingAction({
      musicianId: 'bad-id', eventName: 'Test', eventDate: '2026-06-01', location: 'Austin', duration: '2 hours',
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('not found')
  })

  it('returns error when musician is unavailable', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession)
    ;(getMusicianById as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockMusician, available: false })
    const result = await createBookingAction({
      musicianId: 'musician-1', eventName: 'Test', eventDate: '2026-06-01', location: 'Austin', duration: '2 hours',
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('unavailable')
  })

  it('creates booking with correct commission calculation', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession)
    ;(getMusicianById as ReturnType<typeof vi.fn>).mockResolvedValue(mockMusician)
    ;(createBooking as ReturnType<typeof vi.fn>).mockResolvedValue(mockBooking)

    const result = await createBookingAction({
      musicianId: 'musician-1', eventName: 'Test Event', eventDate: '2026-06-01T18:00:00Z',
      location: 'Austin TX', duration: '2 hours', message: 'Great event',
    })

    expect(result.success).toBe(true)
    expect(result.bookingId).toBe('booking-1')

    // Verify createBooking was called with correct commission math
    const createCall = (createBooking as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(createCall.musicianRate).toBe(350) // per_event rate
    expect(createCall.commissionAmount).toBe(52.5) // 350 * 0.15
    expect(createCall.totalCharged).toBe(402.5)
  })

  it('calculates hourly rate correctly', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession)
    ;(getMusicianById as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockMusician, rate: 75, rate_type: 'hourly' as const })
    ;(createBooking as ReturnType<typeof vi.fn>).mockResolvedValue(mockBooking)

    await createBookingAction({
      musicianId: 'musician-1', eventName: 'Test', eventDate: '2026-06-01',
      location: 'Austin', duration: '3 hours',
    })

    const createCall = (createBooking as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(createCall.musicianRate).toBe(225) // 75/hr * 3 hours
    expect(createCall.commissionAmount).toBe(33.75)
    expect(createCall.totalCharged).toBe(258.75)
  })
})

describe('updateBookingStatusAction', () => {
  it('returns error when not authenticated', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null)
    const result = await updateBookingStatusAction('booking-1', 'confirmed')
    expect(result.success).toBe(false)
  })

  it('successfully updates booking status', async () => {
    ;(getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession)
    const { updateBookingStatus } = await import('@/lib/db')
    ;(updateBookingStatus as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockBooking, status: 'confirmed' })

    const result = await updateBookingStatusAction('booking-1', 'confirmed')
    expect(result.success).toBe(true)
  })
})
