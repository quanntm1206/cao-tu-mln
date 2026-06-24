import { describe, expect, it } from 'vitest'
import { deriveEnding, type EndingInput } from './endings'

function makeRound(overrides: Partial<EndingInput['rounds'][number]> = {}): EndingInput['rounds'][number] {
  return {
    alpha: 0.5,
    h: 8,
    invest_rnd: 0,
    use_merchant: false,
    m: 100,
    m_super: 0,
    net_profit: 100,
    reinvestment: 50,
    organic_comp: 1.2,
    z_interest: 0,
    rent_cost: 0,
    p_merchant: 0,
    ...overrides,
  }
}

function input(rounds: EndingInput['rounds'], final = {}): EndingInput {
  return {
    initialCapital: 1_000,
    netWorth: 1_400,
    debt: 0,
    landUnits: 0,
    eventCount: 0,
    rounds,
    ...final,
  }
}

describe('deriveEnding', () => {
  it('classifies strong expanded accumulation', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ alpha: 0.75, reinvestment: 120 })), { netWorth: 2_300 }))
    expect(ending.endingId).toBe('expanded_accumulation')
    expect(ending.title).toContain('Tích lũy')
  })

  it('prioritizes interest dependency when debt and interest are prominent', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ z_interest: 45, net_profit: 80 })), { debt: 900 }))
    expect(ending.endingId).toBe('interest_dependency')
    expect(ending.textbookConnection.toLowerCase()).toContain('lợi tức')
  })

  it('classifies rent dominated outcomes', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ rent_cost: 55, net_profit: 90 })), { landUnits: 5 }))
    expect(ending.endingId).toBe('rent_dominated')
  })

  it('classifies merchant circulation outcomes', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ use_merchant: true, p_merchant: 35, net_profit: 100 }))))
    expect(ending.endingId).toBe('merchant_circulation')
  })

  it('classifies high organic composition outcomes', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ organic_comp: 4.2 }))))
    expect(ending.endingId).toBe('organic_composition')
  })

  it('classifies relative surplus value strategy', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ invest_rnd: 100, h: 8 }))))
    expect(ending.endingId).toBe('relative_surplus')
  })

  it('classifies absolute surplus value strategy', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ h: 12 }))))
    expect(ending.endingId).toBe('absolute_surplus')
  })

  it('classifies cautious reproduction when reinvestment is low', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ alpha: 0.15, reinvestment: 10, net_profit: 80 })), { netWorth: 1_050 }))
    expect(ending.endingId).toBe('cautious_reproduction')
  })

  it('returns one primary ending and at most two secondary consequences', () => {
    const ending = deriveEnding(input(Array.from({ length: 18 }, () => makeRound({ alpha: 0.8, reinvestment: 100, organic_comp: 4, use_merchant: true, p_merchant: 30 })), { netWorth: 2_000 }))
    expect(ending.secondaryConsequences.length).toBeLessThanOrEqual(2)
    expect(ending.keySignals.length).toBeGreaterThan(0)
  })
})

