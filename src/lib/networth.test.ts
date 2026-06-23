import { describe, it, expect } from 'vitest'
import { calcNetWorth } from './networth'

describe('calcNetWorth', () => {
  it('sums cash, fixed, circulating, lending minus debt', () => {
    const worth = calcNetWorth({
      cash: 1000,
      c_fixed_book: 2000,
      c_circulating_stock: 500,
      lending: 300,
      debt: 200,
      land_units: 0,
      rent_per_unit: 200,
      bank_interest_rate: 0.04,
    })
    expect(worth).toBe(3600)
  })

  it('includes capitalised land value when owned', () => {
    const worth = calcNetWorth({
      cash: 0,
      c_fixed_book: 0,
      c_circulating_stock: 0,
      lending: 0,
      debt: 0,
      land_units: 2,
      rent_per_unit: 120_000_000,
      bank_interest_rate: 0.04,
    })
    expect(worth).toBe(6_000_000_000)
  })
})
