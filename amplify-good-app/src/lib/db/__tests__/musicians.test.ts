import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { getMusicians } from '@/lib/db/musicians'

const allMusicians = [
  { id: '1', name: 'Jazz Band', genres: ['Jazz'], rate: 350, rate_type: 'per_event', available: true, user_id: null, bio: null, photo_url: null, created_at: '', updated_at: '' },
  { id: '2', name: 'Rock Group', genres: ['Rock', 'Blues'], rate: 500, rate_type: 'per_event', available: true, user_id: null, bio: null, photo_url: null, created_at: '', updated_at: '' },
  { id: '3', name: 'DJ', genres: ['Electronic'], rate: 75, rate_type: 'hourly', available: false, user_id: null, bio: null, photo_url: null, created_at: '', updated_at: '' },
]

function mockQuery(data: typeof allMusicians) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data, error: null }),
  }
  ;(createClient as ReturnType<typeof vi.fn>).mockResolvedValue(chain)
  return chain
}

beforeEach(() => vi.clearAllMocks())

describe('getMusicians', () => {
  it('returns all musicians with no filters', async () => {
    mockQuery(allMusicians)
    const results = await getMusicians()
    expect(results).toHaveLength(3)
  })

  it('filters by genres in-memory', async () => {
    mockQuery(allMusicians)
    const results = await getMusicians({ genres: ['Jazz'] })
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('Jazz Band')
  })

  it('returns empty array when no genre matches', async () => {
    mockQuery(allMusicians)
    const results = await getMusicians({ genres: ['Mariachi'] })
    expect(results).toHaveLength(0)
  })

  it('handles empty data from supabase gracefully', async () => {
    mockQuery([])
    const results = await getMusicians()
    expect(results).toEqual([])
  })
})
