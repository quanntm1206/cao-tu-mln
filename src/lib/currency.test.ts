import { describe, it, expect } from 'vitest'
import { formatVnd, formatVndAxis } from './currency'

describe('formatVnd', () => {
  it('formats billions', () => {
    expect(formatVnd(3_500_000_000)).toContain('tỷ')
    expect(formatVnd(3_500_000_000)).toContain('3,5')
  })

  it('formats millions', () => {
    expect(formatVnd(120_000_000)).toContain('triệu')
    expect(formatVnd(24_000_000, true)).toContain('24')
  })
})

describe('formatVndAxis', () => {
  it('compact axis labels', () => {
    expect(formatVndAxis(2_500_000_000)).toBe('2.5tỷ')
    expect(formatVndAxis(350_000_000)).toBe('350tr')
  })
})
