import { describe, expect, it } from 'vitest'
import { deriveEnding, type EndingInput } from './endings'

function makeInput(overrides: Partial<EndingInput> = {}): EndingInput {
  return {
    industrial_profit: 500,
    merchant_profit: 0,
    interest_paid: 0,
    interest_earned: 0,
    rent_paid: 0,
    m_pool: 1000,
    ...overrides,
  }
}

describe('deriveEnding – new distribution schema', () => {
  it('returns industrial_pure when industrial dominates', () => {
    const result = deriveEnding(makeInput({ industrial_profit: 800, merchant_profit: 50, interest_paid: 30, rent_paid: 20 }))
    expect(result.endingId).toBe('industrial_pure')
    expect(result.tone).toBe('growth')
  })

  it('returns merchant_extreme when merchant share > 35%', () => {
    const result = deriveEnding(makeInput({ industrial_profit: 300, merchant_profit: 400, interest_paid: 0, rent_paid: 0 }))
    expect(result.endingId).toBe('merchant_extreme')
  })

  it('returns lender_focus when interest_paid dominates', () => {
    const result = deriveEnding(makeInput({ industrial_profit: 300, merchant_profit: 0, interest_paid: 400, rent_paid: 0 }))
    expect(result.endingId).toBe('lender_focus')
    expect(result.tone).toBe('warning')
  })

  it('returns land_speculator when rent_paid dominates', () => {
    const result = deriveEnding(makeInput({ industrial_profit: 200, merchant_profit: 0, interest_paid: 0, rent_paid: 500 }))
    expect(result.endingId).toBe('land_speculator')
  })

  it('returns balanced_distribution when multiple forms present', () => {
    const result = deriveEnding(makeInput({ industrial_profit: 400, merchant_profit: 150, interest_paid: 100, rent_paid: 100 }))
    expect(result.endingId).toBe('balanced_distribution')
  })

  it('always has reflectionQuestions and keySignals', () => {
    const result = deriveEnding(makeInput())
    expect(result.reflectionQuestions.length).toBeGreaterThan(0)
    expect(result.keySignals.length).toBeGreaterThan(0)
    expect(result.textbookConnection.length).toBeGreaterThan(10)
  })

  it('secondaryConsequences lists other endings', () => {
    const result = deriveEnding(makeInput({ industrial_profit: 400, merchant_profit: 200, interest_paid: 200, rent_paid: 200 }))
    expect(Array.isArray(result.secondaryConsequences)).toBe(true)
  })
})
