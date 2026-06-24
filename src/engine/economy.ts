// Pure economy engine - core formulas retained after refactor

/** Rate of profit p' = m / (c + v) */
export function calcProfitRate(m: number, c: number, v: number): number {
  const denom = c + v
  return denom > 0 ? m / denom : 0
}

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