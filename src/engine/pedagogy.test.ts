import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import {
  distributePhase1,
  distributePhase2,
  distributePhase3,
  distributePhase4,
  getInitialSectorRates,
} from './distribution'
import { SECTOR_PROFILES } from '../data/economyConstants'
import { STARTING_M } from '../data/economyConstants'

const M = STARTING_M

const basePhase1Params = {
  availableCash: M,
  sectorRates: getInitialSectorRates(),
  roundInPhase: 1,
  fixedCapital: 0,
  materialsStock: 0,
  baseCapital: M,
}

describe('Pedagogy invariant: m = v × m′', () => {
  it('total_industrial_profit equals sum of breakdown.v × surplusValueRate for each sector', () => {
    const result = distributePhase1({
      ...basePhase1Params,
      allocations: { co_khi: 2_000_000, det: 2_000_000, da: 2_000_000 },
    })

    const getSurplusValueRate = (id: string) =>
      SECTOR_PROFILES.find((s) => s.id === id)!.surplusValueRate

    const expected =
      result.breakdown.co_khi.v * getSurplusValueRate('co_khi') +
      result.breakdown.det.v * getSurplusValueRate('det') +
      result.breakdown.da.v * getSurplusValueRate('da')

    expect(result.total_industrial_profit).toBeCloseTo(expected, 0)
  })

  it('individual sector profit equals v × m′', () => {
    const result = distributePhase1({
      ...basePhase1Params,
      allocations: { co_khi: 1_000_000, det: 0, da: 0 },
    })
    const surplusValueRate = SECTOR_PROFILES.find((s) => s.id === 'co_khi')!.surplusValueRate
    expect(result.co_khi_profit).toBeCloseTo(result.breakdown.co_khi.v * surplusValueRate, 0)
  })
})

describe('Pedagogy invariant: machines do not multiply m per unit v', () => {
  it('m/v ratio is the same with or without fixedCapital when allocations are below effectiveCash', () => {
    const base = distributePhase1({
      ...basePhase1Params,
      allocations: { co_khi: 1_000_000, det: 0, da: 0 },
      fixedCapital: 0,
    })
    const withMachines = distributePhase1({
      ...basePhase1Params,
      allocations: { co_khi: 1_000_000, det: 0, da: 0 },
      fixedCapital: M * 0.5,
      materialsStock: M * 0.5,
    })
    const ratioBase = base.total_industrial_profit / base.total_v
    const ratioMachines = withMachines.total_industrial_profit / withMachines.total_v
    expect(ratioMachines).toBeCloseTo(ratioBase, 5)
  })

  it('deploy cap allows more allocation when fixedCapital raises effective cash above allocation', () => {
    const noBoost = distributePhase1({
      ...basePhase1Params,
      availableCash: 1_000_000,
      allocations: { co_khi: 1_200_000, det: 0, da: 0 },
      fixedCapital: 0,
      materialsStock: 0,
    })
    const withBoost = distributePhase1({
      ...basePhase1Params,
      availableCash: 1_000_000,
      allocations: { co_khi: 1_200_000, det: 0, da: 0 },
      fixedCapital: M,
      materialsStock: 0,
    })
    // deployCap = 1.15, effectiveCash = 1_150_000 > 1_000_000, so more allocation goes through
    expect(withBoost.total_industrial_profit).toBeGreaterThan(noBoost.total_industrial_profit)
  })
})

describe('Pedagogy invariant: Phase 2 — circulation does not create m', () => {
  it('merchant + industrial equals distributable surplus', () => {
    const surplus = 10_000_000
    const result = distributePhase2(surplus, { merchantShare: 0.2, useMerchant: true }, 1)
    expect(result.merchant_profit + result.industrial_profit_after).toBeCloseTo(surplus)
  })

  it('m_new_from_circulation is always 0', () => {
    const r1 = distributePhase2(10_000_000, { merchantShare: 0.2, useMerchant: true }, 1)
    const r2 = distributePhase2(10_000_000, { merchantShare: 0, useMerchant: false }, 2)
    expect(r1.m_new_from_circulation).toBe(0)
    expect(r2.m_new_from_circulation).toBe(0)
  })
})

describe('Pedagogy invariant: Phase 3 — finance does not create m', () => {
  it('m_new_from_finance is always 0', () => {
    const r = distributePhase3(M, 0, 0, { action: 'borrow', amount: 500_000_000 }, 1)
    expect(r.m_new_from_finance).toBe(0)
  })

  it('z_prime is defined and positive', () => {
    const r = distributePhase3(M, 0, 0, { action: 'none', amount: 0 }, 1)
    expect(r.z_prime).toBeGreaterThan(0)
    expect(r.z_prime).toBeLessThan(0.2)
  })

  it('t_cho_vay equals lent_after', () => {
    const r = distributePhase3(M, 0, 0, { action: 'lend', amount: 300_000_000 }, 1)
    expect(r.t_cho_vay).toBe(r.lent_after)
  })
})


  it('interest_earned equals lentPrincipal * z_rate without spread factor', () => {
    const lent = 300_000_000
    const r = distributePhase3(M, 0, lent, { action: 'none', amount: 0 }, 1)
    expect(r.interest_earned).toBeCloseTo(lent * r.z_prime, 0)
  })

  it('borrow increases debt_after without creating m', () => {
    const r = distributePhase3(M, 100_000_000, 0, { action: 'borrow', amount: 50_000_000 }, 1)
    expect(r.debt_after).toBe(150_000_000)
    expect(r.m_new_from_finance).toBe(0)
  })

describe('Pedagogy invariant: Phase 4 — land does not create m', () => {
  it('m_new_from_land is always 0', () => {
    const r1 = distributePhase4(5000000000, M, 0, 0.06, { landChoice: 'buy' }, 1)
    const r2 = distributePhase4(5000000000, M, 0, 0.06, { landChoice: 'speculate' }, 1)
    const r3 = distributePhase4(5000000000, M, 0, 0.06, { landChoice: 'none' }, 1)
    expect(r1.m_new_from_land).toBe(0)
    expect(r2.m_new_from_land).toBe(0)
    expect(r3.m_new_from_land).toBe(0)
  })

  it('rent choice: profit_after_rent + rent_paid_r equals profit_before_rent', () => {
    const profit = 5000000000
    const r = distributePhase4(profit, M, 0, 0.06, { landChoice: 'rent' }, 1)
    expect(r.profit_after_rent + r.rent_paid_r).toBeCloseTo(r.profit_before_rent)
  })

  it('speculate does not change m_pool via revaluation', () => {
    const r = distributePhase4(5000000000, M, 500_000_000, 0.06, { landChoice: 'speculate' }, 2)
    expect(r.pool_delta).toBe(-r.land_purchase_price)
    expect(r.land_asset_revaluation).not.toBe(0)
  })

})
describe('UI pedagogy: Phase1Page asset labels', () => {
  it('Phase1Page.tsx does not use legacy V labels for total assets', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    const source = readFileSync(join(dir, '../components/lab/Phase1Page.tsx'), 'utf-8')
    expect(source).not.toContain('V hi?n c�')
    expect(source).not.toContain('T?ng V (v?n ?ng tru?c)')
  })
})

describe('Profit-rate equalization display', () => {
  it('sector_rates_after moves toward average after distributePhase1', () => {
    const initial = getInitialSectorRates()
    const initialAvg = (initial.co_khi + initial.det + initial.da) / 3
    const result = distributePhase1({
      ...basePhase1Params,
      sectorRates: initial,
      allocations: { co_khi: 2_000_000, det: 2_000_000, da: 2_000_000 },
    })
    const after = result.sector_rates_after
    const afterAvg = (after.co_khi + after.det + after.da) / 3
    expect(Math.abs(after.co_khi - afterAvg)).toBeLessThan(Math.abs(initial.co_khi - initialAvg))
  })
})


describe('Production formula invariants', () => {
  it('v = K/(organicComposition+1) and m = v * mPrime', () => {
    const K = 1_000_000
    const result = distributePhase1({ ...basePhase1Params, allocations: { co_khi: K, det: 0, da: 0 } })
    const b = result.breakdown.co_khi
    const profile = SECTOR_PROFILES.find((s) => s.id === 'co_khi')!
    const expectedV = K / (profile.organicComposition + 1)
    expect(b.v).toBeCloseTo(expectedV, 0)
    expect(b.m).toBeCloseTo(expectedV * profile.surplusValueRate, 0)
    expect(result.individual_p_prime.co_khi).toBeCloseTo(b.m / K, 5)
  })
})

describe('Land rent pedagogy v0.7', () => {
  it('theoreticalLandPrice equals rentPaidR / zPrime', () => {
    const profit = 4_000_000_000
    const z = 0.06
    const r = distributePhase4(profit, 2_000_000_000, 0, z, { landChoice: 'rent' }, 1)
    expect(r.theoretical_land_price).toBeCloseTo(r.rent_paid_r / z, 0)
  })
  it('speculate locks cash', () => {
    const r = distributePhase4(1_000_000_000, 2_000_000_000, 0, 0.06, { landChoice: 'speculate' }, 1)
    expect(r.pool_delta).toBe(-r.land_purchase_price)
  })
})


describe('Finance UI pedagogy v0.7.1', () => {
  it('Phase3Page has no Z x 75% label', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    const source = readFileSync(join(dir, '../components/lab/Phase3Page.tsx'), 'utf-8')
    expect(source).not.toContain('75%')
    expect(source).not.toMatch(/mở rộng sản xuất/)
  })

  it('Phase2Page uses corrected T-H-T prime explanation', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    const source = readFileSync(join(dir, '../components/lab/Phase2Page.tsx'), 'utf-8')
    expect(source).not.toMatch(/T' - T chính là m/)
    expect(source).toContain('Lưu thông không tạo ra m mới')
  })
})


describe('Accounting & symbols pedagogy v0.7.2', () => {
  it('FinalInfographic uses calcSessionNetWorth with delivery obligation', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    const source = readFileSync(join(dir, '../components/lab/FinalInfographic.tsx'), 'utf-8')
    expect(source).toContain('calcSessionNetWorth')
    expect(source).toContain('deliveryObligation')
    expect(source).toContain('nghĩa vụ giao hàng')
  })

  it('no forbidden Lãi suất Z or trừ khỏi V in UI sources', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    for (const rel of ['../components/lab/Phase3Page.tsx', '../components/lab/Phase4Page.tsx', '../data/quickEvents.ts']) {
      const source = readFileSync(join(dir, rel), 'utf-8')
      expect(source).not.toMatch(/Lãi suất Z/i)
      expect(source).not.toMatch(/trừ khỏi V/i)
      expect(source).not.toMatch(/Z hiện tại/)
    }
  })

  it('gameStore leaderboard uses net worth not raw m_pool', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    const source = readFileSync(join(dir, '../store/gameStore.ts'), 'utf-8')
    expect(source).toContain('calcSessionNetWorth')
    expect(source).not.toMatch(/score: Math\.max\(0, Math\.round\(m_pool\)\)/)
  })
})
