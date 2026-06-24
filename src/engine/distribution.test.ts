import { describe, it, expect } from 'vitest'
import {
  getPhaseForRound,
  getRoundInPhase,
  getZRateForRound,
  calcDistributionTotals,
  distributePhase1,
  distributePhase2,
  distributePhase3,
  distributePhase4,
} from './distribution'
import { STARTING_M } from '../data/economyConstants'

const M = STARTING_M

describe('getPhaseForRound', () => {
  it('rounds 1-4 are phase 1', () => {
    expect(getPhaseForRound(1)).toBe(1)
    expect(getPhaseForRound(4)).toBe(1)
  })
  it('rounds 5-8 are phase 2', () => {
    expect(getPhaseForRound(5)).toBe(2)
    expect(getPhaseForRound(8)).toBe(2)
  })
  it('rounds 9-12 are phase 3', () => {
    expect(getPhaseForRound(9)).toBe(3)
    expect(getPhaseForRound(12)).toBe(3)
  })
  it('rounds 13-16 are phase 4', () => {
    expect(getPhaseForRound(13)).toBe(4)
    expect(getPhaseForRound(16)).toBe(4)
  })
})

describe('getRoundInPhase', () => {
  it('round 1 is round 1 in phase 1', () => {
    expect(getRoundInPhase(1)).toBe(1)
  })
  it('round 4 is round 4 in phase 1', () => {
    expect(getRoundInPhase(4)).toBe(4)
  })
  it('round 5 is round 1 in phase 2', () => {
    expect(getRoundInPhase(5)).toBe(1)
  })
  it('round 12 is round 4 in phase 3', () => {
    expect(getRoundInPhase(12)).toBe(4)
  })
})

describe('getZRateForRound', () => {
  it('returns mid_2024 rate outside phase 3', () => {
    const rate = getZRateForRound(3)
    expect(rate).toBeGreaterThan(0)
    expect(rate).toBeLessThan(0.2)
  })
  it('returns peak_2022 for first round of phase 3', () => {
    const rate = getZRateForRound(9)
    expect(rate).toBeGreaterThan(0.07)
  })
  it('returns low_2024 for third round of phase 3', () => {
    const rate = getZRateForRound(11)
    expect(rate).toBeLessThan(0.05)
  })
})

describe('distributePhase1', () => {
  it('computes profit for each sector', () => {
    const result = distributePhase1(M, { co_khi: 1_000_000, det: 1_000_000, da: 1_000_000 }, 1)
    expect(result.phase).toBe(1)
    expect(result.co_khi_profit).toBeCloseTo(200_000)
    expect(result.det_profit).toBeCloseTo(300_000)
    expect(result.da_profit).toBeCloseTo(400_000)
    expect(result.total_industrial_profit).toBeCloseTo(900_000)
  })

  it('higher allocation gives higher profit', () => {
    const low = distributePhase1(M, { co_khi: 1_000_000, det: 0, da: 0 }, 1)
    const high = distributePhase1(M, { co_khi: 5_000_000, det: 0, da: 0 }, 1)
    expect(high.total_industrial_profit).toBeGreaterThan(low.total_industrial_profit)
  })

  it('zero allocation defaults to m_pool fraction', () => {
    const result = distributePhase1(M, { co_khi: 0, det: 0, da: 0 }, 1)
    expect(result.phase).toBe(1)
    expect(result.total_industrial_profit).toBe(0)
  })

  it('returns lesson text', () => {
    const result = distributePhase1(M, { co_khi: 1_000_000, det: 0, da: 0 }, 2)
    expect(result.lesson.length).toBeGreaterThan(10)
  })
})

describe('distributePhase2', () => {
  it('merchant takes share when useMerchant is true', () => {
    const result = distributePhase2(10_000_000, { merchantShare: 0.1, useMerchant: true }, 1)
    expect(result.phase).toBe(2)
    expect(result.merchant_profit).toBeCloseTo(1_000_000)
    expect(result.industrial_profit_after).toBeCloseTo(9_000_000)
  })

  it('no merchant share when useMerchant is false', () => {
    const result = distributePhase2(10_000_000, { merchantShare: 0.1, useMerchant: false }, 1)
    expect(result.merchant_profit).toBe(0)
    expect(result.industrial_profit_after).toBe(10_000_000)
  })

  it('merchantShare is clamped to [0, 1]', () => {
    const result = distributePhase2(10_000_000, { merchantShare: 2, useMerchant: true }, 1)
    expect(result.merchant_profit).toBeCloseTo(10_000_000)
    expect(result.industrial_profit_after).toBeCloseTo(0)
  })
})

describe('distributePhase3', () => {
  it('borrowing incurs interest cost', () => {
    const result = distributePhase3(M, { action: 'borrow', amount: 1_000_000_000 }, 1)
    expect(result.phase).toBe(3)
    expect(result.interest_paid).toBeGreaterThan(0)
    expect(result.net_finance).toBeLessThan(0)
  })

  it('lending earns interest', () => {
    const result = distributePhase3(M, { action: 'lend', amount: 1_000_000_000 }, 2)
    expect(result.interest_earned).toBeGreaterThan(0)
    expect(result.net_finance).toBeGreaterThan(0)
  })

  it('no action yields zero interest', () => {
    const result = distributePhase3(M, { action: 'none', amount: 0 }, 1)
    expect(result.interest_paid).toBe(0)
    expect(result.interest_earned).toBe(0)
    expect(result.net_finance).toBe(0)
  })
})

describe('distributePhase4', () => {
  it('buying land yields positive land gain', () => {
    const result = distributePhase4(M, { landChoice: 'buy' }, 1)
    expect(result.phase).toBe(4)
    expect(result.land_value).toBeGreaterThan(0)
    expect(result.land_gain).toBeGreaterThan(0)
  })

  it('renting incurs rent cost', () => {
    const result = distributePhase4(M, { landChoice: 'rent' }, 1)
    expect(result.rent_paid).toBeGreaterThan(0)
    expect(result.land_gain).toBeLessThan(0)
  })

  it('speculation yields gain in early rounds and loss in late rounds', () => {
    const early = distributePhase4(M, { landChoice: 'speculate' }, 1)
    const late = distributePhase4(M, { landChoice: 'speculate' }, 4)
    expect(early.land_gain).toBeGreaterThan(0)
    expect(late.land_gain).toBeLessThan(0)
  })

  it('no land choice yields zero values', () => {
    const result = distributePhase4(M, { landChoice: 'none' }, 1)
    expect(result.rent_paid).toBe(0)
    expect(result.land_gain).toBe(0)
  })
})

describe('calcDistributionTotals', () => {
  it('aggregates all phase results correctly', () => {
    const r1 = distributePhase1(M, { co_khi: 1_000_000, det: 0, da: 0 }, 1)
    const r2 = distributePhase2(r1.total_industrial_profit, { merchantShare: 0.1, useMerchant: true }, 1)
    const r3 = distributePhase3(M, { action: 'lend', amount: 500_000_000 }, 1)
    const r4 = distributePhase4(M, { landChoice: 'buy' }, 1)

    const totals = calcDistributionTotals([r1, r2, r3, r4])
    expect(totals.total_industrial).toBeCloseTo(r1.total_industrial_profit)
    expect(totals.total_merchant).toBeCloseTo(r2.merchant_profit)
    expect(totals.total_finance).toBeCloseTo(r3.net_finance)
    expect(totals.total_rent).toBeCloseTo(r4.land_gain)
  })
})