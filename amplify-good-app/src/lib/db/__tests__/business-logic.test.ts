import { describe, it, expect } from 'vitest'

const COMMISSION_RATE = 0.15

describe('Booking commission calculation', () => {
  it('calculates 15% commission on per-event rate', () => {
    const musicianRate = 500
    const commission = Math.round(musicianRate * COMMISSION_RATE * 100) / 100
    expect(commission).toBe(75)
    expect(musicianRate + commission).toBe(575)
  })

  it('calculates 15% commission on hourly rate × hours', () => {
    const ratePerHour = 75
    const hours = 3
    const musicianRate = ratePerHour * hours // 225
    const commission = Math.round(musicianRate * COMMISSION_RATE * 100) / 100
    expect(commission).toBe(33.75)
    expect(musicianRate + commission).toBe(258.75)
  })

  it('rounds commission to 2 decimal places', () => {
    const musicianRate = 350
    const commission = Math.round(musicianRate * COMMISSION_RATE * 100) / 100
    expect(commission).toBe(52.5)
    expect(musicianRate + commission).toBe(402.5)
  })

  it('commission is exactly 15% for round numbers', () => {
    const amounts = [100, 200, 300, 400, 600]
    amounts.forEach((amount) => {
      const commission = Math.round(amount * COMMISSION_RATE * 100) / 100
      expect(commission).toBe(amount * 0.15)
    })
  })
})

describe('Musician rate duration calculation', () => {
  it('multiplies hourly rate by duration', () => {
    const rate = 75
    const hours = 4
    expect(rate * hours).toBe(300)
  })

  it('uses flat rate for per_event musicians regardless of hours', () => {
    const rate = 500
    const rateType: 'per_event' | 'hourly' = 'per_event'
    const durationHours = 4
    const musicianRate = rateType === 'hourly' ? rate * durationHours : rate
    expect(musicianRate).toBe(500)
  })
})
