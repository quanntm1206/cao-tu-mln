import { describe, it, expect } from 'vitest'
import {
  RND_REFERENCE,
  RND_TECH_BOOST_DIVISOR,
} from '../data/economyConstants'
import {
  calcSurplusValue,
  calcCostPrice,
  calcProfitRate,
  calcOrganicComp,
  calcTurnovers,
  calcAnnualSurplus,
  calcSuperSurplus,
  decayTechLead,
  applyRnD,
  applyLogistics,
  calcTangibleWear,
  calcIntangibleWear,
  convergeToPBar,
  distributeProfit,
  calcLandPrice,
  calcMoraleEffect,
  calcRound,
} from './economy'

// ─── Supplement 1: Core value equations ──────────────────────────────────────
describe('Supplement 1 – Core value equations', () => {
  it('calcSurplusValue: m = m_rate × v, m_rate = (h - t_n) / t_n', () => {
    const { m, m_rate } = calcSurplusValue(1000, 8, 4)
    expect(m_rate).toBeCloseTo(1.0) // (8-4)/4 = 1
    expect(m).toBeCloseTo(1000)
  })

  it('calcSurplusValue: returns 0 when h <= t_n', () => {
    const { m, m_rate } = calcSurplusValue(1000, 4, 4)
    expect(m).toBe(0)
    expect(m_rate).toBe(0)
  })

  it('calcSurplusValue: longer hours increase m', () => {
    const { m: m1 } = calcSurplusValue(1000, 8, 4)
    const { m: m2 } = calcSurplusValue(1000, 10, 4)
    expect(m2).toBeGreaterThan(m1)
  })

  it('calcCostPrice: k = c_fixed_dep + c_circ + v', () => {
    expect(calcCostPrice(200, 300, 500)).toBe(1000)
  })

  it('calcProfitRate: p\' = m / (c + v)', () => {
    expect(calcProfitRate(500, 800, 200)).toBeCloseTo(0.5)
  })

  it('calcProfitRate: returns 0 when c+v = 0', () => {
    expect(calcProfitRate(100, 0, 0)).toBe(0)
  })

  it('calcOrganicComp: c / v', () => {
    expect(calcOrganicComp(800, 200)).toBeCloseTo(4)
  })

  it('G = k + m', () => {
    const { m } = calcSurplusValue(500, 8, 4)
    const k = calcCostPrice(100, 200, 500)
    expect(k + m).toBeCloseTo(800 + m)
  })
})

// ─── Supplement 2: Annual rate & turnovers ───────────────────────────────────
describe('Supplement 2 – Turnover and annual surplus', () => {
  it('calcTurnovers: n = CH / ch', () => {
    expect(calcTurnovers(4, 1)).toBeCloseTo(4)
    expect(calcTurnovers(4, 2)).toBeCloseTo(2)
  })

  it('calcAnnualSurplus: M_year = m_rate × V × n', () => {
    // m_rate=1, V=1000, n=4 → 4000
    expect(calcAnnualSurplus(1, 1000, 4)).toBeCloseTo(4000)
  })

  it('faster circulation (lower ch) increases annual surplus', () => {
    const n_fast = calcTurnovers(4, 0.5)
    const n_slow = calcTurnovers(4, 2)
    expect(n_fast).toBeGreaterThan(n_slow)
    expect(calcAnnualSurplus(1, 1000, n_fast)).toBeGreaterThan(
      calcAnnualSurplus(1, 1000, n_slow),
    )
  })
})

// ─── Supplement 3: Tech / relative surplus value ─────────────────────────────
describe('Supplement 3 – Technology and relative surplus value', () => {
  it('calcSuperSurplus: proportional to tech_lead × m', () => {
    const ms = calcSuperSurplus(0.5, 1000)
    expect(ms).toBeCloseTo(500)
  })

  it('calcSuperSurplus: 0 when no tech lead', () => {
    expect(calcSuperSurplus(0, 1000)).toBe(0)
  })

  it('decayTechLead: decreases each round', () => {
    const after = decayTechLead(1.0, 0.15)
    expect(after).toBeCloseTo(0.85)
    expect(after).toBeLessThan(1.0)
  })

  it('decayTechLead: never goes below 0', () => {
    expect(decayTechLead(0, 0.5)).toBe(0)
  })

  it('applyRnD: reduces t_n with sufficient investment', () => {
    const { new_t_n } = applyRnD(RND_REFERENCE * 4, 4, 3, 0)
    expect(new_t_n).toBeLessThan(4)
    expect(new_t_n).toBeGreaterThanOrEqual(3 * 0.25)
  })

  it('applyRnD: increases tech_lead', () => {
    const { new_tech_lead } = applyRnD(RND_TECH_BOOST_DIVISOR, 4, 2, 0.1)
    expect(new_tech_lead).toBeGreaterThan(0.1)
  })

  it('applyRnD: no R&D keeps state unchanged', () => {
    const { new_t_n, new_tech_lead } = applyRnD(0, 4, 2, 0.5)
    expect(new_t_n).toBe(4)
    expect(new_tech_lead).toBe(0.5)
  })

  it('applyLogistics: reduces ch', () => {
    const ch = applyLogistics(2, 3)
    expect(ch).toBeLessThan(2)
    expect(ch).toBeGreaterThanOrEqual(0.25)
  })

  it('applyLogistics: merchant channel speeds circulation further', () => {
    const direct = applyLogistics(2, 1, false)
    const merchant = applyLogistics(2, 1, true)
    expect(merchant).toBeLessThan(direct)
  })

  it('calcTangibleWear: higher output intensity increases wear', () => {
    const low = calcTangibleWear(10000, 0.2)
    const high = calcTangibleWear(10000, 1.0)
    expect(high).toBeGreaterThan(low)
  })

  it('calcIntangibleWear: obsolete machines lose value when market advances', () => {
    const wear = calcIntangibleWear(10000, 0, 0.5)
    expect(wear).toBeGreaterThan(0)
  })
})

// ─── Supplement 4: P-bar convergence ─────────────────────────────────────────
describe('Supplement 4 – P-bar convergence', () => {
  it('convergeToPBar: moves toward market average', () => {
    const result = convergeToPBar(0.1, 0.3, 0.2)
    expect(result).toBeGreaterThan(0.1)
    expect(result).toBeLessThan(0.3)
    expect(result).toBeCloseTo(0.14) // 0.1 + 0.2*(0.3-0.1) = 0.14
  })

  it('convergeToPBar: above-average also converges down', () => {
    const result = convergeToPBar(0.4, 0.2, 0.2)
    expect(result).toBeLessThan(0.4)
    expect(result).toBeGreaterThan(0.2)
  })

  it('convergeToPBar: already at p_bar stays the same', () => {
    expect(convergeToPBar(0.2, 0.2, 0.5)).toBeCloseTo(0.2)
  })
})

// ─── Supplement 5: Distribution of surplus value ─────────────────────────────
describe('Supplement 5 – Distribution of surplus value', () => {
  it('distributeProfit: interest on debt reduces available profit', () => {
    const d = distributeProfit(1000, 5000, 0.05, 0, 0, 0, false, false, 0)
    expect(d.z_interest).toBeCloseTo(250)
    expect(d.available).toBeCloseTo(750)
  })

  it('distributeProfit: lending earns interest', () => {
    const d = distributeProfit(1000, 0, 0.05, 2000, 0, 0, false, false, 0)
    expect(d.z_earned).toBeCloseTo(75) // 2000 × 0.05 × 0.75
    expect(d.available).toBeCloseTo(1075)
  })

  it('distributeProfit: rent_mode deducts rent', () => {
    const d = distributeProfit(1000, 0, 0, 0, 3, 100, true, false, 0)
    expect(d.rent_cost).toBeCloseTo(300)
    expect(d.available).toBeCloseTo(700)
  })

  it('distributeProfit: not renting means zero rent cost', () => {
    const d = distributeProfit(1000, 0, 0, 0, 3, 100, false, false, 0)
    expect(d.rent_cost).toBe(0)
  })

  it('distributeProfit: merchant takes commission', () => {
    const d = distributeProfit(1000, 0, 0, 0, 0, 0, false, true, 0.1)
    expect(d.p_merchant).toBeCloseTo(100)
    expect(d.available).toBeCloseTo(900)
  })

  it('calcLandPrice: capitalised rent = R / i', () => {
    expect(calcLandPrice(1000, 0.05)).toBeCloseTo(20000)
  })

  it('calcLandPrice: returns 0 for zero interest rate', () => {
    expect(calcLandPrice(1000, 0)).toBe(0)
  })
})

// ─── Integration: full round ──────────────────────────────────────────────────
describe('Integration – full round calculation', () => {
  const base: Parameters<typeof calcRound>[0] = {
    c_fixed_book: 10000,
    depreciation_rate: 0.05,
    c_circulating: 2000,
    v: 1000,
    h: 8,
    t_n: 4,
    workers: 10,
    CH: 4,
    ch: 1,
    tech_lead: 0,
    marketTechLevel: 0,
    p_bar: 0.2,
    debt: 0,
    bank_interest_rate: 0.05,
    lending: 0,
    land_units: 0,
    rent_per_unit: 0,
    rent_mode: false,
    use_merchant: false,
    merchant_rate: 0,
    logistics_level: 0,
    morale: 80,
    alpha: 0.5,
  }

  it('G = k + m', () => {
    const r = calcRound(base)
    expect(r.G).toBeCloseTo(r.k + r.m, 5)
  })

  it('reinvestment = alpha × net_profit', () => {
    const r = calcRound(base)
    expect(r.reinvestment).toBeCloseTo(r.net_profit * 0.5, 5)
  })

  it('cash_delta = net_profit - reinvestment', () => {
    const r = calcRound(base)
    expect(r.cash_delta).toBeCloseTo(r.net_profit - r.reinvestment, 5)
  })

  it('calcMoraleEffect: stays neutral to avoid non-textbook management mechanics', () => {
    const low = calcMoraleEffect(20)
    const high = calcMoraleEffect(90)
    expect(low).toEqual({ productivity_mult: 1, t_n_mult: 1 })
    expect(high).toEqual({ productivity_mult: 1, t_n_mult: 1 })
  })

  it('tech_lead decays each round in calcRound', () => {
    const r = calcRound({ ...base, tech_lead: 1.0 })
    expect(r.new_tech_lead).toBeLessThan(1.0)
  })

  it('higher alpha means more reinvestment', () => {
    const r1 = calcRound({ ...base, alpha: 0.3 })
    const r2 = calcRound({ ...base, alpha: 0.8 })
    expect(r2.reinvestment).toBeGreaterThan(r1.reinvestment)
  })

  it('zero materials reduces surplus value by half', () => {
    const withMaterials = calcRound(base)
    const withoutMaterials = calcRound({ ...base, c_circulating: 0 })
    expect(withoutMaterials.m).toBeCloseTo(withMaterials.m * 0.5, 5)
  })
})
