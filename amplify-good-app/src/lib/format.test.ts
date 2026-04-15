import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, formatMoney } from '@/lib/format'

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-06-14T18:00:00Z')
    expect(result).toMatch(/June|Jun/)
    expect(result).toMatch(/14/)
    expect(result).toMatch(/2026/)
  })

  it('handles an empty string without throwing', () => {
    expect(() => formatDate('')).not.toThrow()
  })
})

describe('formatTime', () => {
  it('formats a valid time', () => {
    const result = formatTime('2026-06-14T18:00:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatMoney', () => {
  it('formats whole dollar amounts', () => {
    const result = formatMoney(500)
    expect(result).toContain('500')
  })

  it('formats decimal amounts', () => {
    const result = formatMoney(52.5)
    expect(result).toContain('52')
  })

  it('handles zero', () => {
    const result = formatMoney(0)
    expect(result).toBeDefined()
  })
})
