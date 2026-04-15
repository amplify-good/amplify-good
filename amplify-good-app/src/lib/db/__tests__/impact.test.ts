import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '@/lib/supabase/server'
import { getImpactPoolSummary } from '@/lib/db/impact'

function mockImpactQuery(data: { total_inflows: number; total_outflows: number; balance: number } | null) {
  const chain = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error: data ? null : { message: 'No rows' } }),
  }
  ;(createClient as ReturnType<typeof vi.fn>).mockResolvedValue(chain)
}

beforeEach(() => vi.clearAllMocks())

describe('getImpactPoolSummary', () => {
  it('returns formatted summary from view', async () => {
    mockImpactQuery({ total_inflows: 1835, total_outflows: 1150, balance: 685 })
    const summary = await getImpactPoolSummary()
    expect(summary.balance).toBe(685)
    expect(summary.totalInflows).toBe(1835)
    expect(summary.totalOutflows).toBe(1150)
  })

  it('returns zeros when view is empty', async () => {
    mockImpactQuery(null)
    const summary = await getImpactPoolSummary()
    expect(summary.balance).toBe(0)
    expect(summary.totalInflows).toBe(0)
    expect(summary.totalOutflows).toBe(0)
  })

  it('converts numeric strings from postgres to numbers', async () => {
    mockImpactQuery({ total_inflows: 1835 as unknown as number, total_outflows: 1150 as unknown as number, balance: 685 as unknown as number })
    const summary = await getImpactPoolSummary()
    expect(typeof summary.balance).toBe('number')
    expect(typeof summary.totalInflows).toBe('number')
  })
})
