import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { suggestMusiciansForEvent } from '@/lib/db/musicians'

const mockMusicians = [
  { id: '1', name: 'Jazz Band', genres: ['Jazz', 'R&B'], rate: 350, rate_type: 'per_event', available: true },
  { id: '2', name: 'Folk Duo', genres: ['Folk', 'Country'], rate: 400, rate_type: 'per_event', available: true },
  { id: '3', name: 'Rock Group', genres: ['Rock', 'Blues'], rate: 500, rate_type: 'per_event', available: true },
  { id: '4', name: 'DJ Set', genres: ['Electronic', 'Hip-Hop'], rate: 75, rate_type: 'hourly', available: true },
  { id: '5', name: 'Latin Band', genres: ['Latin', 'Folk'], rate: 500, rate_type: 'per_event', available: true },
]

function mockSupabase(data: typeof mockMusicians) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data, error: null }),
  }
  ;(createClient as ReturnType<typeof vi.fn>).mockResolvedValue(chain)
  return chain
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('suggestMusiciansForEvent', () => {
  it('returns genre-matched musicians first', async () => {
    mockSupabase(mockMusicians)
    const results = await suggestMusiciansForEvent('Jazz', 3)
    expect(results[0].name).toBe('Jazz Band')
    expect(results.length).toBe(3)
  })

  it('fills remaining slots with non-matching musicians', async () => {
    mockSupabase(mockMusicians)
    const results = await suggestMusiciansForEvent('Jazz', 3)
    // First is Jazz Band (matched), next 2 are non-jazz sorted by name
    expect(results[0].genres).toContain('Jazz')
    expect(results.length).toBe(3)
  })

  it('returns all musicians if fewer than limit exist', async () => {
    mockSupabase(mockMusicians.slice(0, 2))
    const results = await suggestMusiciansForEvent('Jazz', 3)
    expect(results.length).toBe(2)
  })

  it('returns empty array when no musicians available', async () => {
    mockSupabase([])
    const results = await suggestMusiciansForEvent('Jazz', 3)
    expect(results).toEqual([])
  })

  it('is case-insensitive for genre matching', async () => {
    mockSupabase(mockMusicians)
    const resultsLower = await suggestMusiciansForEvent('jazz', 3)
    const resultsUpper = await suggestMusiciansForEvent('JAZZ', 3)
    expect(resultsLower[0].name).toBe('Jazz Band')
    expect(resultsUpper[0].name).toBe('Jazz Band')
  })

  it('respects the limit parameter', async () => {
    mockSupabase(mockMusicians)
    const results = await suggestMusiciansForEvent('Jazz', 1)
    expect(results.length).toBe(1)
  })
})
