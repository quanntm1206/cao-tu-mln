import {
  Z_RATE_TABLE_2022_2024,
  R_CASE_HOAI_DUC,
  R_CASE_BAC_NINH,
  ROUNDS_PER_PHASE,
} from '../data/economyConstants'
import { calcProfitRate, calcLandPrice } from './economy'
import {
  type SectorRates,
  type SectorBreakdown,
  splitCVMWithRate,
  convergeSectorRates,
  productionDeployCap,
  getInitialSectorRates,
} from './simulation'

export type { SectorRates, SectorBreakdown }
export { getInitialSectorRates }

export type GamePhase = 1 | 2 | 3 | 4

export type LandChoice = 'buy' | 'rent' | 'speculate' | 'none'
export type RentType = LandChoice
export type FinanceAction = 'borrow' | 'lend' | 'none'
export type MarketCondition = 'boom' | 'normal' | 'recession'

export interface SectorAllocation {
  co_khi: number
  det: number
  da: number
}

export interface Phase1Decision {
  co_khi: number
  det: number
  da: number
}

export interface Phase2Decision {
  merchantShare: number
  useMerchant: boolean
}

export interface Phase3Decision {
  action: FinanceAction
  amount: number
}

export interface Phase4Decision {
  landChoice: LandChoice
}

export interface Phase1Params {
  availableCash: number
  sectorRates: SectorRates
  allocations: { co_khi: number; det: number; da: number }
  roundInPhase: number
  fixedCapital: number
  materialsStock: number
  baseCapital: number
}

export interface Phase1Result {
  phase: 1
  roundInPhase: number
  breakdown: {
    co_khi: SectorBreakdown
    det: SectorBreakdown
    da: SectorBreakdown
  }
  co_khi_profit: number
  det_profit: number
  da_profit: number
  total_c: number
  total_v: number
  total_industrial_profit: number
  p_rate: number
  m_created: number
  individual_p_prime: SectorRates
  post_competition_display_rates: SectorRates
  theoretical_average_profit_rate: number
  /** @deprecated */ sector_rates_after: SectorRates
  /** @deprecated */ average_profit_rate: number
  pool_delta: number
  lesson: string
}

export interface Phase2Result {
  phase: 2
  roundInPhase: number
  merchant_profit: number
  industrial_profit_after: number
  distributable_surplus: number
  m_new_from_circulation: 0
  pool_delta: number
  lesson: string
}

export interface Phase3Result {
  phase: 3
  roundInPhase: number
  interest_paid: number
  interest_earned: number
  net_finance: number
  borrowed_principal: number
  lent_principal_delta: number
  debt_after: number
  lent_after: number
  m_new_from_finance: 0
  z_prime: number
  t_cho_vay: number
  pool_delta: number
  lesson: string
}

export interface Phase4Result {
  phase: 4
  roundInPhase: number
  profit_before_rent: number
  rent_paid_r: number
  profit_after_rent: number
  z_prime: number
  theoretical_land_price: number
  rent_simulation_note: string
  p_land: number
  land_asset_revaluation: number
  rent_type: RentType
  land_purchase_price: number
  m_new_from_land: 0
  pool_delta: number
  lesson: string
  /** @deprecated use rent_paid_r */
  rent_paid: number
  /** @deprecated use p_land */
  land_value: number
  /** @deprecated use land_asset_revaluation */
  land_gain: number
}

export type PhaseResult = Phase1Result | Phase2Result | Phase3Result | Phase4Result

export function getPhaseForRound(round: number): GamePhase {
  if (round <= 4) return 1
  if (round <= 8) return 2
  if (round <= 12) return 3
  return 4
}

export function getRoundInPhase(round: number): number {
  return ((round - 1) % ROUNDS_PER_PHASE) + 1
}

export function getZRateForRound(round: number): number {
  const phase = getPhaseForRound(round)
  if (phase === 3) {
    const rip = getRoundInPhase(round)
    if (rip === 1) return Z_RATE_TABLE_2022_2024.peak_2022
    if (rip === 2) return Z_RATE_TABLE_2022_2024.mid_2024
    if (rip === 3) return Z_RATE_TABLE_2022_2024.low_2024
    return Z_RATE_TABLE_2022_2024.rebound_2024
  }
  return Z_RATE_TABLE_2022_2024.mid_2024
}

export function calcDistributionTotals(results: PhaseResult[]): {
  total_industrial: number
  total_merchant: number
  total_finance: number
  total_rent: number
} {
  let total_industrial = 0
  let total_merchant = 0
  let total_finance = 0
  let total_rent = 0
  for (const r of results) {
    if (r.phase === 1) total_industrial += r.total_industrial_profit
    if (r.phase === 2) total_merchant += r.merchant_profit
    if (r.phase === 3) total_finance += Math.max(0, r.net_finance)
    if (r.phase === 4) total_rent += r.rent_paid_r
  }
  return { total_industrial, total_merchant, total_finance, total_rent }
}

const PHASE1_LESSONS_VI = [
  'Lợi nhuận công nghiệp xuất phát từ giá trị thặng dư trong sản xuất.',
  'Tỷ suất lợi nhuận khác nhau giữa các ngành do cấu tạo hữu cơ của tư bản.',
  'Cạnh tranh giữa các ngành tạo xu hướng bình quân hóa tỷ suất lợi nhuận.',
  'Tích lũy tư bản công nghiệp là nền tảng của toàn bộ nền kinh tế tư bản.',
]

export function distributePhase1(params: Phase1Params): Phase1Result {
  const { availableCash, sectorRates, allocations, roundInPhase, fixedCapital, materialsStock, baseCapital } = params

  const deployCap = productionDeployCap(fixedCapital, materialsStock, baseCapital)
  const effectiveCash = availableCash * deployCap
  const rawTotal = allocations.co_khi + allocations.det + allocations.da
  const cappedTotal = Math.min(rawTotal, Math.max(0, effectiveCash))
  const scale = rawTotal > 0 ? cappedTotal / rawTotal : 0

  const capped = {
    co_khi: allocations.co_khi * scale,
    det: allocations.det * scale,
    da: allocations.da * scale,
  }

  const breakdown = {
    co_khi: splitCVMWithRate(capped.co_khi, 'co_khi', sectorRates.co_khi),
    det: splitCVMWithRate(capped.det, 'det', sectorRates.det),
    da: splitCVMWithRate(capped.da, 'da', sectorRates.da),
  }

  const co_khi_profit = breakdown.co_khi.m
  const det_profit = breakdown.det.m
  const da_profit = breakdown.da.m
  const total_c = breakdown.co_khi.c + breakdown.det.c + breakdown.da.c
  const total_v = breakdown.co_khi.v + breakdown.det.v + breakdown.da.v
  const total_industrial_profit = co_khi_profit + det_profit + da_profit
  const m_created = total_industrial_profit
  const pool_delta = m_created

  const theoretical_average_profit_rate = (sectorRates.co_khi + sectorRates.det + sectorRates.da) / 3
  const post_competition_display_rates = convergeSectorRates(sectorRates)
  const sector_rates_after = post_competition_display_rates
  const average_profit_rate = theoretical_average_profit_rate

  const individual_p_prime = {
    co_khi: calcProfitRate(breakdown.co_khi.m, breakdown.co_khi.c, breakdown.co_khi.v),
    det: calcProfitRate(breakdown.det.m, breakdown.det.c, breakdown.det.v),
    da: calcProfitRate(breakdown.da.m, breakdown.da.c, breakdown.da.v),
  }

  const p_rate = calcProfitRate(total_industrial_profit, total_c, total_v)

  const idx = Math.max(0, Math.min(3, roundInPhase - 1))
  return {
    phase: 1,
    roundInPhase,
    breakdown,
    co_khi_profit,
    det_profit,
    da_profit,
    total_c,
    total_v,
    total_industrial_profit,
    p_rate,
    m_created,
    individual_p_prime,
    post_competition_display_rates,
    theoretical_average_profit_rate,
    sector_rates_after,
    average_profit_rate,
    pool_delta,
    lesson: PHASE1_LESSONS_VI[idx],
  }
}

const PHASE2_LESSONS = [
  'Tư bản thương nghiệp không tạo ra giá trị nhưng chiếm một phần giá trị thặng dư.',
  'Lợi nhuận thương nghiệp là phần giá trị thặng dư nhà sản xuất nhượng cho thương nhân.',
  'Sử dụng kênh thương mại giúp tăng tốc lưu thông nhưng giảm phần lợi nhuận giữ lại.',
  'Bình quân hóa lợi nhuận tạo ra tỷ suất lợi nhuận bình quân toàn xã hội.',
]

export function distributePhase2(
  distributableSurplus: number,
  decision: Phase2Decision,
  roundInPhase: number,
): Phase2Result {
  const share = Math.max(0, Math.min(1, decision.merchantShare))
  const merchant_profit = decision.useMerchant ? distributableSurplus * share : 0
  const industrial_profit_after = distributableSurplus - merchant_profit

  const idx = Math.max(0, Math.min(3, roundInPhase - 1))
  return {
    phase: 2,
    roundInPhase,
    merchant_profit,
    industrial_profit_after,
    distributable_surplus: distributableSurplus,
    m_new_from_circulation: 0 as const,
    pool_delta: 0,
    lesson: PHASE2_LESSONS[idx],
  }
}

const PHASE3_LESSONS = [
  'Lợi tức Z là giá cả của tư bản cho vay, phản ánh phần giá trị thặng dư/lợi nhuận chuyển cho chủ tư bản tiền tệ. Tỷ suất lợi tức Z′ biểu hiện tỷ lệ Z/TBCV.',
  'Tư bản cho vay không trực tiếp bóc lột lao động nhưng hưởng phần m từ quá trình sản xuất.',
  'Tỷ suất lợi tức Z′ có xu hướng biến động theo chu kỳ kinh tế và chính sách tiền tệ.',
  'Tín dụng là đòn bẩy của tư bản nhưng cũng là nguồn gốc của khủng hoảng tài chính.',
]

export function distributePhase3(
  availableCash: number,
  debtPrincipal: number,
  lentPrincipal: number,
  decision: Phase3Decision,
  roundInPhase: number,
): Phase3Result {
  const z_rate = getZRateForRound(8 + roundInPhase)
  const z_prime = z_rate
  let t_cho_vay = lentPrincipal

  const interest_paid = debtPrincipal * z_rate
  const interest_earned = lentPrincipal * z_rate
  const net_finance = interest_earned - interest_paid

  let borrowed_principal = 0
  let lent_principal_delta = 0
  let debt_after = debtPrincipal
  let lent_after = lentPrincipal

  if (decision.action === 'borrow') {
    borrowed_principal = Math.max(0, decision.amount)
    debt_after = debtPrincipal + borrowed_principal
  } else if (decision.action === 'lend') {
    const safe_lend = Math.min(Math.max(0, decision.amount), Math.max(0, availableCash))
    lent_principal_delta = safe_lend
    lent_after = lentPrincipal + safe_lend
  }
  t_cho_vay = lent_after

  const pool_delta = net_finance + borrowed_principal - lent_principal_delta

  const idx = Math.max(0, Math.min(3, roundInPhase - 1))
  return {
    phase: 3,
    roundInPhase,
    interest_paid,
    interest_earned,
    net_finance,
    borrowed_principal,
    lent_principal_delta,
    debt_after,
    lent_after,
    m_new_from_finance: 0 as const,
    z_prime,
    t_cho_vay,
    pool_delta,
    lesson: PHASE3_LESSONS[idx],
  }
}

const PHASE4_LESSONS = [
  'Địa tô R là phần giá trị thặng dư mà nhà tư bản sản xuất nhượng cho chủ sở hữu đất — không phải m mới.',
  'Giá cả đất đai P = R / Z′: vốn hóa dòng địa tô kỳ vọng theo tỷ suất lợi tức ngân hàng (Z′).',
  'Bong bóng giá đất là biến động giá cả trên thị trường thứ cấp — tài sản đất đai, không sinh thêm m.',
  'Địa tô tuyệt đối và địa tô chênh lệch phân phối lại phần m đã có trong xã hội.',
]

export const LAND_COMMIT_FRACTION = 0.25

export function distributePhase4(
  profitBeforeRent: number,
  availableCash: number,
  landAssets: number,
  z_prime: number,
  decision: Phase4Decision,
  roundInPhase: number,
): Phase4Result {
  const commit = Math.max(0, availableCash) * LAND_COMMIT_FRACTION
  const choice = decision.landChoice
  const profit_before_rent = Math.max(0, profitBeforeRent)

  // Mô phỏng giản lược: R = 25% phần m phân phối mỗi vòng (giả định game hóa)
  const R_simulation = profit_before_rent * LAND_COMMIT_FRACTION
  const rent_simulation_note =
    'Trong mô phỏng giản lược, R = 25% phần m/vòng để minh họa dòng phân phối địa tô — giả định mô phỏng, không phải công thức trong giáo trình. Giáo trình không quy định địa tô bằng tỷ lệ cố định của m; R là phần m/lợi nhuận siêu ngạch chuyển cho chủ đất.'
  const theoretical_land_price = calcLandPrice(R_simulation, z_prime)
  const p_land = theoretical_land_price

  let rent_paid_r = 0
  let profit_after_rent = profit_before_rent
  let land_purchase_price = 0
  let land_asset_revaluation = 0
  let pool_delta = 0

  if (choice === 'rent') {
    rent_paid_r = R_simulation
    profit_after_rent = profit_before_rent - rent_paid_r
    pool_delta = -rent_paid_r
  } else if (choice === 'buy') {
    land_purchase_price = Math.min(Math.max(0, availableCash), theoretical_land_price)
    const growthPerRound = R_CASE_HOAI_DUC.priceGrowthPct / ROUNDS_PER_PHASE
    land_asset_revaluation = (landAssets + land_purchase_price) * growthPerRound
    pool_delta = -land_purchase_price
  } else if (choice === 'speculate') {
    land_purchase_price = Math.min(commit, Math.max(0, availableCash))
    pool_delta = -land_purchase_price
    let growthRate: number
    if (roundInPhase <= 2) {
      growthRate = R_CASE_BAC_NINH.bubbleGrowthPct / 2
    } else if (roundInPhase === 3) {
      growthRate = 0.02
    } else {
      growthRate = R_CASE_BAC_NINH.crashPct
    }
    land_asset_revaluation = (landAssets + land_purchase_price) * growthRate
  }

  const idx = Math.max(0, Math.min(3, roundInPhase - 1))
  return {
    phase: 4,
    roundInPhase,
    profit_before_rent,
    rent_paid_r,
    profit_after_rent,
    z_prime,
    theoretical_land_price,
    rent_simulation_note,
    p_land,
    land_asset_revaluation,
    rent_type: choice,
    land_purchase_price,
    m_new_from_land: 0 as const,
    pool_delta,
    lesson: PHASE4_LESSONS[idx],
    rent_paid: rent_paid_r,
    land_value: p_land,
    land_gain: land_asset_revaluation,
  }
}
