// Pure economy engine – all Marxist political economy formulas

import { RND_REFERENCE, RND_TECH_BOOST_DIVISOR } from '../data/economyConstants'

export interface RoundInputs {
  // Fixed capital
  c_fixed_book: number;          // book value of fixed capital (machines)
  depreciation_rate: number;     // fraction of fixed capital that depreciates per round
  // Circulating constant capital
  c_circulating: number;         // materials consumed this round
  // Variable capital
  v: number;                     // total wages paid this round
  // Labor
  h: number;                     // hours worked per day
  t_n: number;                   // necessary labor time per day (hours)
  workers: number;               // number of workers
  // Turnover
  CH: number;                    // total annual production periods (e.g. 4)
  ch: number;                    // circulation time in periods per cycle
  // Technology
  tech_lead: number;             // individual tech advantage [0, ∞)
  marketTechLevel: number;       // market avg tech (affects social value)
  // Market
  p_bar: number;                 // market average rate of profit
  // Finance
  debt: number;                  // outstanding loans
  bank_interest_rate: number;    // interest rate per round
  lending: number;               // capital lent to others
  // Land
  land_units: number;            // units of land used
  rent_per_unit: number;         // rent charged per unit per round
  rent_mode: boolean;            // true = renting in, false = own land
  // Merchant
  use_merchant: boolean;         // sell through merchant channel
  merchant_rate: number;         // fraction of profit the merchant takes
  // Logistics
  logistics_level: number;       // 0-5, reduces ch
  // Reinvestment
  alpha: number;                 // reinvestment ratio [0, 1]
}

export interface RoundResult {
  // — Supplement 1: Core value equations —
  c_depreciation: number;  // c_fixed depreciation this round
  c: number;               // total constant capital consumed (c_dep + c_circ)
  k: number;               // cost price = c + v
  m: number;               // surplus value (before tech super-profit)
  G: number;               // gross output value = k + m (= c + v + m)
  m_rate: number;          // rate of surplus value m' = m / v
  p_rate: number;          // rate of profit p' = m / (c + v)
  organic_comp: number;    // organic composition of capital c / v

  // — Supplement 2: Annual rate & turnovers —
  n: number;               // turnovers per year  n = CH / ch
  M_year: number;          // annual surplus value = m' × v × n

  // — Supplement 3: Relative/absolute surplus value & tech —
  m_super: number;         // extra surplus from tech lead
  new_tech_lead: number;   // tech lead after decay this round

  // — Supplement 4: P-bar convergence —
  p_rate_converged: number; // rate of profit after market pull

  // — Supplement 5: Distribution of surplus value —
  z_interest: number;      // interest paid on debt
  z_earned: number;        // interest earned from lending
  rent_cost: number;       // rent paid (if renting)
  p_merchant: number;      // portion going to merchant
  net_profit: number;      // profit after all deductions
  reinvestment: number;    // alpha × net_profit
  cash_delta: number;      // net change in cash = net_profit - reinvestment (kept as cash)
}

// ─── Supplement 1 – Core value equations ────────────────────────────────────

/** Surplus value and rate.
 *  m' = (h - t_n) / t_n
 *  m  = m' × v  (v = total variable capital)
 */
export function calcSurplusValue(
  v: number,
  h: number,
  t_n: number,
): { m: number; m_rate: number } {
  if (v <= 0 || t_n <= 0 || h <= t_n) return { m: 0, m_rate: 0 }
  const m_rate = (h - t_n) / t_n
  return { m: m_rate * v, m_rate }
}

/** Cost price k = c_fixed_depreciation + c_circulating + v */
export function calcCostPrice(
  c_fixed_depreciation: number,
  c_circulating: number,
  v: number,
): number {
  return c_fixed_depreciation + c_circulating + v
}

/** Rate of profit p' = m / (c + v) */
export function calcProfitRate(m: number, c: number, v: number): number {
  const denom = c + v
  return denom > 0 ? m / denom : 0
}

/** Organic composition of capital q = c / v */
export function calcOrganicComp(c: number, v: number): number {
  return v > 0 ? c / v : 0
}

// ─── Supplement 2 – Turnover & annual metrics ────────────────────────────────

/** Number of turnovers per year: n = CH / ch */
export function calcTurnovers(CH: number, ch: number): number {
  return ch > 0 ? CH / ch : 1
}

/** Annual surplus value: M_year = m' × V × n */
export function calcAnnualSurplus(
  m_rate: number,
  V: number,
  n: number,
): number {
  return m_rate * V * n
}

// ─── Supplement 3 – Tech, relative surplus value ─────────────────────────────

/** Super-surplus value from individual technology lead.
 *  m_super = tech_lead × m  (simplified: lead gives proportional extra)
 */
export function calcSuperSurplus(tech_lead: number, m: number): number {
  return tech_lead > 0 ? tech_lead * m : 0
}

/** Tech lead decays each round as market catches up.
 *  Δtech_lead = −decay_rate × tech_lead
 */
export function decayTechLead(
  tech_lead: number,
  decay_rate: number = 0.15,
): number {
  return Math.max(0, tech_lead * (1 - decay_rate))
}

/** R&D investment: reduces t_n (relative surplus value) and adds tech_lead. */
export function applyRnD(
  rnd_spend: number,
  current_t_n: number,
  base_t_n: number,
  current_tech_lead: number,
): { new_t_n: number; new_tech_lead: number } {
  if (rnd_spend <= 0) return { new_t_n: current_t_n, new_tech_lead: current_tech_lead }
  const factor = Math.log1p(rnd_spend / RND_REFERENCE) * 0.08
  const new_t_n = Math.max(base_t_n * 0.25, current_t_n * (1 - factor))
  const boost = rnd_spend / RND_TECH_BOOST_DIVISOR
  return { new_t_n, new_tech_lead: current_tech_lead + boost }
}

/** Logistics level reduces circulation time ch. Merchant channel also speeds circulation. */
export function applyLogistics(
  ch_base: number,
  logistics_level: number,
  use_merchant = false,
): number {
  const reduction = logistics_level * 0.08 + (use_merchant ? 0.12 : 0)
  return Math.max(0.25, ch_base * (1 - reduction))
}

/** Tangible wear: fixed capital loses value proportional to output intensity. */
export function calcTangibleWear(
  c_fixed_book: number,
  output_intensity: number,
  wear_rate = 0.02,
): number {
  const intensity = Math.max(0, Math.min(1.5, output_intensity))
  return c_fixed_book * wear_rate * intensity
}

/** Intangible wear: obsolete machines lose value when market tech advances. */
export function calcIntangibleWear(
  c_fixed_book: number,
  tech_lead: number,
  marketTechLevel: number,
  obsolescence_rate = 0.08,
): number {
  if (marketTechLevel <= 0 || tech_lead > 0.05) return 0
  const gap = Math.max(0, marketTechLevel - tech_lead)
  return c_fixed_book * obsolescence_rate * gap
}

// ─── Supplement 4 – P-bar convergence ────────────────────────────────────────

/** Individual rate of profit drifts toward market average p_bar.
 *  Δp' = convergence_speed × (p_bar − p')
 */
export function convergeToPBar(
  p_rate: number,
  p_bar: number,
  speed: number = 0.2,
): number {
  return p_rate + (p_bar - p_rate) * speed
}

// ─── Supplement 5 – Distribution of surplus value ────────────────────────────

export interface Distribution {
  z_interest: number
  z_earned: number
  rent_cost: number
  p_merchant: number
  available: number
}

/** Distribute total profit among finance capital, land, and merchant capital. */
export function distributeProfit(
  total_profit: number,
  debt: number,
  bank_interest_rate: number,
  lending: number,
  land_units: number,
  rent_per_unit: number,
  rent_mode: boolean,
  use_merchant: boolean,
  merchant_rate: number,
): Distribution {
  const z_interest = debt * bank_interest_rate
  const z_earned = lending * bank_interest_rate * 0.75
  const rent_cost = rent_mode ? land_units * rent_per_unit : 0
  const p_merchant = use_merchant ? total_profit * merchant_rate : 0
  const available = total_profit - z_interest + z_earned - rent_cost - p_merchant
  return { z_interest, z_earned, rent_cost, p_merchant, available }
}

/** Land price = R / i  (capitalised rent) */
export function calcLandPrice(R: number, i: number): number {
  return i > 0 ? R / i : 0
}

// ─── Master round calculation ─────────────────────────────────────────────────

export function calcRound(inputs: RoundInputs): RoundResult {
  const {
    c_fixed_book,
    depreciation_rate,
    c_circulating,
    v,
    h,
    t_n,
    workers: _w,
    CH,
    ch: ch_raw,
    tech_lead,
    p_bar,
    debt,
    bank_interest_rate,
    lending,
    land_units,
    rent_per_unit,
    rent_mode,
    use_merchant,
    merchant_rate,
    logistics_level,
    alpha,
  } = inputs

  const effective_t_n = t_n

  // Logistics adjustment (merchant speeds circulation)
  const ch = applyLogistics(ch_raw, logistics_level, use_merchant)

  // Fixed capital depreciation + tangible/intangible wear
  const output_intensity = c_circulating / Math.max(1, c_fixed_book)
  const c_depreciation = c_fixed_book * depreciation_rate
  const tangible_wear = calcTangibleWear(c_fixed_book, output_intensity)
  const intangible_wear = calcIntangibleWear(
    c_fixed_book,
    tech_lead,
    inputs.marketTechLevel,
  )
  const total_fixed_loss = c_depreciation + tangible_wear + intangible_wear

  // Total constant capital
  const c = total_fixed_loss + c_circulating

  // Cost price
  const k = calcCostPrice(total_fixed_loss, c_circulating, v)

  // Surplus value (labor creates it); thiếu nguyên liệu → sản lượng giảm
  const { m: m_raw, m_rate } = calcSurplusValue(v, h, effective_t_n)
  const material_factor = c_circulating > 0 ? 1 : 0.5
  const m = m_raw * material_factor

  // Gross output
  const G = k + m

  // Rate of profit (before convergence)
  const p_rate_raw = calcProfitRate(m, c, v)

  // Organic composition
  const organic_comp = calcOrganicComp(c, v)

  // Turnovers
  const n = calcTurnovers(CH, ch)

  // Annual surplus
  const M_year = calcAnnualSurplus(m_rate, v, n)

  // Tech super-surplus
  const m_super = calcSuperSurplus(tech_lead, m)
  const new_tech_lead = decayTechLead(tech_lead)

  // P-bar convergence (market equalises profit rates)
  const p_rate_converged = convergeToPBar(p_rate_raw, p_bar)

  // Distribution
  const total_profit = m + m_super
  const dist = distributeProfit(
    total_profit,
    debt,
    bank_interest_rate,
    lending,
    land_units,
    rent_per_unit,
    rent_mode,
    use_merchant,
    merchant_rate,
  )

  const net_profit = dist.available
  const reinvestment = net_profit * alpha
  const cash_delta = net_profit - reinvestment

  return {
    c_depreciation: total_fixed_loss,
    c,
    k,
    m,
    G,
    m_rate,
    p_rate: p_rate_raw,
    organic_comp,
    n,
    M_year,
    m_super,
    new_tech_lead,
    p_rate_converged,
    z_interest: dist.z_interest,
    z_earned: dist.z_earned,
    rent_cost: dist.rent_cost,
    p_merchant: dist.p_merchant,
    net_profit,
    reinvestment,
    cash_delta,
  }
}


