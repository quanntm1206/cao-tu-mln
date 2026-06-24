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
  getInitialSectorRates,
} from './distribution'
import { convergeSectorRates } from './simulation'
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
  const baseParams = {
    availableCash: M,
    sectorRates: getInitialSectorRates(),
    roundInPhase: 1,
    fixedCapital: 0,
    materialsStock: 0,
    baseCapital: M,
  }

  it('computes profit for each sector using dynamic rates', () => {
    const result = distributePhase1({
      ...baseParams,
      allocations: { co_khi: 1_000_000, det: 1_000_000, da: 1_000_000 },
    })
    expect(result.phase).toBe(1)
    expect(result.co_khi_profit).toBeCloseTo(200_000)
    expect(result.det_profit).toBeCloseTo(300_000)
    expect(result.da_profit).toBeCloseTo(400_000)
    expect(result.total_industrial_profit).toBeCloseTo(900_000)
  })

  it('higher allocation gives higher profit', () => {
    const low = distributePhase1({ ...baseParams, allocations: { co_khi: 1_000_000, det: 0, da: 0 } })
    const high = distributePhase1({ ...baseParams, allocations: { co_khi: 5_000_000, det: 0, da: 0 } })
    expect(high.total_industrial_profit).toBeGreaterThan(low.total_industrial_profit)
  })

  it('zero allocation yields zero profit', () => {
    const result = distributePhase1({ ...baseParams, allocations: { co_khi: 0, det: 0, da: 0 } })
    expect(result.phase).toBe(1)
    expect(result.total_industrial_profit).toBe(0)
  })

  it('returns lesson text', () => {
    const result = distributePhase1({ ...baseParams, roundInPhase: 2, allocations: { co_khi: 1_000_000, det: 0, da: 0 } })
    expect(result.lesson.length).toBeGreaterThan(10)
  })

  it('returns m_created equal to total_industrial_profit', () => {
    const result = distributePhase1({ ...baseParams, allocations: { co_khi: 2_000_000, det: 1_000_000, da: 0 } })
    expect(result.m_created).toBeCloseTo(result.total_industrial_profit)
  })

  it('pool_delta equals m_created', () => {
    const result = distributePhase1({ ...baseParams, allocations: { co_khi: 2_000_000, det: 1_000_000, da: 0 } })
    expect(result.pool_delta).toBeCloseTo(result.m_created)
  })

  it('sector_rates_after converges toward average', () => {
    const result = distributePhase1({ ...baseParams, allocations: { co_khi: 1_000_000, det: 0, da: 0 } })
    const avg = (result.sector_rates_after.co_khi + result.sector_rates_after.det + result.sector_rates_after.da) / 3
    const initial = getInitialSectorRates()
    const initialAvg = (initial.co_khi + initial.det + initial.da) / 3
    // Average is preserved under convergence
    expect(avg).toBeCloseTo(initialAvg, 5)
    // Rates have moved toward average
    expect(Math.abs(result.sector_rates_after.co_khi - avg)).toBeLessThan(Math.abs(initial.co_khi - initialAvg))
  })

  it('allocations are capped to availableCash', () => {
    const small = distributePhase1({
      ...baseParams,
      availableCash: 1_000_000,
      allocations: { co_khi: 5_000_000, det: 5_000_000, da: 5_000_000 },
    })
    const full = distributePhase1({
      ...baseParams,
      availableCash: M,
      allocations: { co_khi: 5_000_000, det: 5_000_000, da: 5_000_000 },
    })
    expect(small.total_industrial_profit).toBeLessThan(full.total_industrial_profit)
  })

  it('deploy cap allows more allocation when effectiveCash > availableCash', () => {
    // With fixedCapital, productionDeployCap > 1, effectiveCash > availableCash
    // So allocations that exceed availableCash but not effectiveCash get through
    const noCap = distributePhase1({
      ...baseParams,
      availableCash: 1_000_000,
      allocations: { co_khi: 1_200_000, det: 0, da: 0 },
      fixedCapital: 0,
      materialsStock: 0,
    })
    const withCap = distributePhase1({
      ...baseParams,
      availableCash: 1_000_000,
      allocations: { co_khi: 1_200_000, det: 0, da: 0 },
      fixedCapital: M,
      materialsStock: 0,
    })
    // deployCap = 1.15, effectiveCash = 1_150_000, cappedTotal = 1_150_000 > 1_000_000
    expect(withCap.total_industrial_profit).toBeGreaterThan(noCap.total_industrial_profit)
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

  it('pool_delta is always 0 — merchant does not change m_pool', () => {
    const r1 = distributePhase2(10_000_000, { merchantShare: 0.2, useMerchant: true }, 1)
    const r2 = distributePhase2(10_000_000, { merchantShare: 0.2, useMerchant: false }, 2)
    expect(r1.pool_delta).toBe(0)
    expect(r2.pool_delta).toBe(0)
  })

  it('distributable_surplus is passed through', () => {
    const result = distributePhase2(5_000_000, { merchantShare: 0.1, useMerchant: true }, 1)
    expect(result.distributable_surplus).toBe(5_000_000)
  })

  it('merchant does not increase total surplus — invariant', () => {
    const surplus = 20_000_000
    const result = distributePhase2(surplus, { merchantShare: 0.15, useMerchant: true }, 1)
    expect(result.merchant_profit + result.industrial_profit_after).toBeCloseTo(surplus)
  })
})

describe('distributePhase3', () => {
  it('interest paid on existing debt principal', () => {
    const result = distributePhase3(M, 1_000_000_000, 0, { action: 'none', amount: 0 }, 1)
    expect(result.interest_paid).toBeGreaterThan(0)
    expect(result.net_finance).toBeLessThan(0)
  })

  it('interest earned on existing lent principal', () => {
    const result = distributePhase3(M, 0, 1_000_000_000, { action: 'none', amount: 0 }, 2)
    expect(result.interest_earned).toBeGreaterThan(0)
    expect(result.net_finance).toBeGreaterThan(0)
  })

  it('borrow action adds to debt_after and pool_delta', () => {
    const result = distributePhase3(M, 0, 0, { action: 'borrow', amount: 1_000_000_000 }, 1)
    expect(result.borrowed_principal).toBe(1_000_000_000)
    expect(result.debt_after).toBe(1_000_000_000)
    expect(result.pool_delta).toBeCloseTo(1_000_000_000)
  })

  it('lend action adds to lent_after and reduces pool', () => {
    const result = distributePhase3(M, 0, 0, { action: 'lend', amount: 500_000_000 }, 2)
    expect(result.lent_after).toBe(500_000_000)
    expect(result.pool_delta).toBeCloseTo(-500_000_000)
  })

  it('no action yields zero borrowed_principal and lent_principal_delta', () => {
    const result = distributePhase3(M, 0, 0, { action: 'none', amount: 0 }, 1)
    expect(result.borrowed_principal).toBe(0)
    expect(result.lent_principal_delta).toBe(0)
    expect(result.interest_paid).toBe(0)
    expect(result.interest_earned).toBe(0)
  })

  it('debt_after and lent_after correctly track cumulative principals', () => {
    const r1 = distributePhase3(M, 500_000_000, 200_000_000, { action: 'borrow', amount: 300_000_000 }, 1)
    expect(r1.debt_after).toBe(800_000_000)
    expect(r1.lent_after).toBe(200_000_000)
  })
})

describe('distributePhase4', () => {
  const profit = 5000000000

  it('buying land costs pool_delta < 0 and yields land_asset_revaluation > 0', () => {
    const result = distributePhase4(profit, M, 0, 0.06, { landChoice: 'buy' }, 1)
    expect(result.phase).toBe(4)
    expect(result.pool_delta).toBeLessThan(0)
    expect(result.land_asset_revaluation).toBeGreaterThan(0)
    expect(result.land_purchase_price).toBeGreaterThan(0)
    expect(result.m_new_from_land).toBe(0)
  })

  it('p_land reflects calcLandPrice reference', () => {
    const result = distributePhase4(profit, M, 0, 0.06, { landChoice: 'buy' }, 1)
    expect(result.p_land).toBeGreaterThan(0)
    expect(result.land_value).toBe(result.p_land)
  })

  it('renting takes R from profit share and reduces profit_after_rent', () => {
    const result = distributePhase4(profit, M, 0, 0.06, { landChoice: 'rent' }, 1)
    expect(result.rent_paid_r).toBeGreaterThan(0)
    expect(result.profit_after_rent).toBeCloseTo(profit - result.rent_paid_r)
    expect(result.pool_delta).toBeCloseTo(-result.rent_paid_r)
  })

  it('speculation revalues assets only — no cash purchase', () => {
    const early = distributePhase4(profit, M, 1_000_000_000, 0.06, { landChoice: 'speculate' }, 1)
    const late = distributePhase4(profit, M, 1_000_000_000, 0.06, { landChoice: 'speculate' }, 4)
    expect(early.land_asset_revaluation).toBeGreaterThan(0)
    expect(late.land_asset_revaluation).toBeLessThan(0)
    expect(early.land_purchase_price).toBe(0)
    expect(early.pool_delta).toBe(0)
  })

  it('no land choice yields zero values and zero pool_delta', () => {
    const result = distributePhase4(profit, M, 0, 0.06, { landChoice: 'none' }, 1)
    expect(result.rent_paid_r).toBe(0)
    expect(result.land_asset_revaluation).toBe(0)
    expect(result.pool_delta).toBe(0)
  })

  it('existing land_assets amplify revaluation for buy', () => {
    const noAssets = distributePhase4(profit, M, 0, 0.06, { landChoice: 'buy' }, 1)
    const withAssets = distributePhase4(profit, M, 1_000_000_000, 0.06, { landChoice: 'buy' }, 1)
    expect(withAssets.land_asset_revaluation).toBeGreaterThan(noAssets.land_asset_revaluation)
  })
})

describe('calcDistributionTotals', () => {
  it('aggregates all phase results correctly', () => {
    const r1 = distributePhase1({
      availableCash: M,
      sectorRates: getInitialSectorRates(),
      allocations: { co_khi: 1_000_000, det: 0, da: 0 },
      roundInPhase: 1,
      fixedCapital: 0,
      materialsStock: 0,
      baseCapital: M,
    })
    const r2 = distributePhase2(r1.total_industrial_profit, { merchantShare: 0.1, useMerchant: true }, 1)
    const r3 = distributePhase3(M, 0, 500_000_000, { action: 'lend', amount: 0 }, 1)
    const r4 = distributePhase4(5000000000, M, 0, 0.06, { landChoice: 'buy' }, 1)

    const totals = calcDistributionTotals([r1, r2, r3, r4])
    expect(totals.total_industrial).toBeCloseTo(r1.total_industrial_profit)
    expect(totals.total_merchant).toBeCloseTo(r2.merchant_profit)
    expect(totals.total_finance).toBeCloseTo(Math.max(0, r3.net_finance))
    expect(totals.total_rent).toBeCloseTo(r4.rent_paid_r)
  })
})

describe('convergeSectorRates', () => {
  it('moves rates toward average', () => {
    const rates = { co_khi: 0.10, det: 0.30, da: 0.50 }
    const after = convergeSectorRates(rates)
    const avg = (rates.co_khi + rates.det + rates.da) / 3
    expect(after.co_khi).toBeGreaterThan(rates.co_khi)
    expect(after.da).toBeLessThan(rates.da)
    expect(after.det).toBeCloseTo(rates.det)
    // Average is preserved
    expect((after.co_khi + after.det + after.da) / 3).toBeCloseTo(avg, 5)
  })

  it('already equal rates remain unchanged', () => {
    const rates = { co_khi: 0.25, det: 0.25, da: 0.25 }
    const after = convergeSectorRates(rates)
    expect(after.co_khi).toBeCloseTo(0.25)
    expect(after.det).toBeCloseTo(0.25)
    expect(after.da).toBeCloseTo(0.25)
  })
})
