import { describe, it, expect } from 'vitest'
import { calcProfitRate, convergeToPBar, distributeProfit, calcLandPrice } from './economy'

describe('calcProfitRate', () => {
  it("p' = m / (c + v)", () => {
    expect(calcProfitRate(500, 800, 200)).toBeCloseTo(0.5)
  })
  it('returns 0 when c + v = 0', () => {
    expect(calcProfitRate(100, 0, 0)).toBe(0)
  })
  it('higher m gives higher rate', () => {
    expect(calcProfitRate(300, 500, 200)).toBeGreaterThan(calcProfitRate(100, 500, 200))
  })
})

describe('convergeToPBar', () => {
  it('moves toward market average', () => {
    const result = convergeToPBar(0.1, 0.3, 0.2)
    expect(result).toBeGreaterThan(0.1)
    expect(result).toBeLessThan(0.3)
    expect(result).toBeCloseTo(0.14)
  })
  it('above-average rate converges down', () => {
    const result = convergeToPBar(0.4, 0.2, 0.2)
    expect(result).toBeLessThan(0.4)
    expect(result).toBeGreaterThan(0.2)
  })
  it('already at p_bar stays the same', () => {
    expect(convergeToPBar(0.2, 0.2, 0.5)).toBeCloseTo(0.2)
  })
})

describe('distributeProfit', () => {
  it('interest on debt reduces available profit', () => {
    const d = distributeProfit(1000, 5000, 0.05, 0, 0, 0, false, false, 0)
    expect(d.z_interest).toBeCloseTo(250)
    expect(d.available).toBeCloseTo(750)
  })
  it('lending earns interest', () => {
    const d = distributeProfit(1000, 0, 0.05, 2000, 0, 0, false, false, 0)
    expect(d.z_earned).toBeCloseTo(75)
    expect(d.available).toBeCloseTo(1075)
  })
  it('rent_mode deducts rent', () => {
    const d = distributeProfit(1000, 0, 0, 0, 3, 100, true, false, 0)
    expect(d.rent_cost).toBeCloseTo(300)
    expect(d.available).toBeCloseTo(700)
  })
  it('not renting means zero rent cost', () => {
    const d = distributeProfit(1000, 0, 0, 0, 3, 100, false, false, 0)
    expect(d.rent_cost).toBe(0)
  })
  it('merchant takes commission', () => {
    const d = distributeProfit(1000, 0, 0, 0, 0, 0, false, true, 0.1)
    expect(d.p_merchant).toBeCloseTo(100)
    expect(d.available).toBeCloseTo(900)
  })
})

describe('calcLandPrice', () => {
  it('capitalised rent = R / i', () => {
    expect(calcLandPrice(1000, 0.05)).toBeCloseTo(20000)
  })
  it('returns 0 for zero interest rate', () => {
    expect(calcLandPrice(1000, 0)).toBe(0)
  })
})