export interface NetWorthInput {
  cash: number
  c_fixed_book: number
  c_circulating_stock: number
  lending: number
  debt: number
  land_units: number
  rent_per_unit: number
  bank_interest_rate: number
}

export function calcNetWorth(s: NetWorthInput): number {
  const landValue =
    s.land_units > 0 && s.bank_interest_rate > 0
      ? s.land_units * (s.rent_per_unit / s.bank_interest_rate)
      : 0
  return (
    s.cash +
    s.c_fixed_book +
    s.c_circulating_stock +
    s.lending -
    s.debt +
    landValue
  )
}


/** Session net worth: cash + land book + lent principal - debt - delivery obligation */
export interface SessionNetWorthInput {
  cash: number
  landAssets: number
  lentPrincipal: number
  debtPrincipal: number
  deliveryObligation: number
}

export function calcSessionNetWorth(s: SessionNetWorthInput): number {
  return (
    s.cash +
    s.landAssets +
    s.lentPrincipal -
    s.debtPrincipal -
    s.deliveryObligation
  )
}
