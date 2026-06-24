import {
  SECTOR_PROFILES,
  Z_RATE_TABLE_2022_2024,
  R_CASE_HOAI_DUC,
  R_CASE_BAC_NINH,
  ROUNDS_PER_PHASE,
} from '../data/economyConstants'
import { calcProfitRate } from './economy'

export type GamePhase = 1 | 2 | 3 | 4

export type LandChoice = 'buy' | 'rent' | 'speculate' | 'none'
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

export interface SectorBreakdown {
  /** Tư bản bất biến (máy móc, nguyên liệu) */
  c: number
  /** Tư bản khả biến (tiền công lao động sống) */
  v: number
  /** Giá trị thặng dư tạo ra = v × m' */
  m: number
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
  lesson: string
}

export interface Phase2Result {
  phase: 2
  roundInPhase: number
  merchant_profit: number
  industrial_profit_after: number
  lesson: string
}

export interface Phase3Result {
  phase: 3
  roundInPhase: number
  interest_paid: number
  interest_earned: number
  net_finance: number
  lesson: string
}

export interface Phase4Result {
  phase: 4
  roundInPhase: number
  rent_paid: number
  land_value: number
  land_gain: number
  lesson: string
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
    if (r.phase === 4) total_rent += r.land_gain
  }
  return { total_industrial, total_merchant, total_finance, total_rent }
}

const PHASE1_LESSONS = [
  'Lợi nhuận công nghiệp xuất phát từ giá trị thặng dư trong sản xuất.',
  'Tỷ suất lợi nhuận khác nhau giữa các ngành do cấu tạo hữu cơ của tư bản.',
  'Cạnh tranh giữa các ngành tạo xu hướng bình quân hóa tỷ suất lợi nhuận.',
  'Tích lũy tư bản công nghiệp là nền tảng của toàn bộ nền kinh tế tư bản.',
]

/** Tách vốn ứng trước thành c + v và sinh m = v × m' theo cấu tạo hữu cơ của ngành. */
function splitCVM(invested: number, sectorId: 'co_khi' | 'det' | 'da'): SectorBreakdown {
  const profile = SECTOR_PROFILES.find((s) => s.id === sectorId)!
  if (invested <= 0) return { c: 0, v: 0, m: 0 }
  const cv = profile.organicComposition
  const v = invested / (cv + 1)
  const c = invested - v
  const m = v * profile.surplusValueRate
  return { c, v, m }
}

export function distributePhase1(
  m_pool: number,
  decision: Phase1Decision,
  roundInPhase: number,
): Phase1Result {
  const total_allocated = decision.co_khi + decision.det + decision.da
  const safe_total = total_allocated > 0 ? total_allocated : m_pool * 0.1

  const breakdown = {
    co_khi: splitCVM(decision.co_khi, 'co_khi'),
    det: splitCVM(decision.det, 'det'),
    da: splitCVM(decision.da, 'da'),
  }

  const co_khi_profit = breakdown.co_khi.m
  const det_profit = breakdown.det.m
  const da_profit = breakdown.da.m
  const total_c = breakdown.co_khi.c + breakdown.det.c + breakdown.da.c
  const total_v = breakdown.co_khi.v + breakdown.det.v + breakdown.da.v
  const total_industrial_profit = co_khi_profit + det_profit + da_profit
  const p_rate = calcProfitRate(total_industrial_profit, safe_total, 0)

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
    lesson: PHASE1_LESSONS[idx],
  }
}

const PHASE2_LESSONS = [
  'Tư bản thương nghiệp không tạo ra giá trị nhưng chiếm một phần giá trị thặng dư.',
  'Lợi nhuận thương nghiệp là phần giá trị thặng dư nhà sản xuất nhượng cho thương nhân.',
  'Sử dụng kênh thương mại giúp tăng tốc lưu thông nhưng giảm phần lợi nhuận giữ lại.',
  'Bình quân hóa lợi nhuận tạo ra tỷ suất lợi nhuận bình quân toàn xã hội.',
]

export function distributePhase2(
  industrial_profit: number,
  decision: Phase2Decision,
  roundInPhase: number,
): Phase2Result {
  const share = Math.max(0, Math.min(1, decision.merchantShare))
  const merchant_profit = decision.useMerchant ? industrial_profit * share : 0
  const industrial_profit_after = industrial_profit - merchant_profit

  const idx = Math.max(0, Math.min(3, roundInPhase - 1))
  return {
    phase: 2,
    roundInPhase,
    merchant_profit,
    industrial_profit_after,
    lesson: PHASE2_LESSONS[idx],
  }
}

const PHASE3_LESSONS = [
  'Lãi suất là giá của tư bản cho vay, phản ánh phần giá trị thặng dư chuyển cho tư bản tiền tệ.',
  'Tư bản cho vay không trực tiếp bóc lột lao động nhưng hưởng phần m từ quá trình sản xuất.',
  'Lãi suất có xu hướng biến động theo chu kỳ kinh tế và chính sách tiền tệ.',
  'Tín dụng là đòn bẩy của tư bản nhưng cũng là nguồn gốc của khủng hoảng tài chính.',
]

export function distributePhase3(
  m_pool: number,
  decision: Phase3Decision,
  roundInPhase: number,
): Phase3Result {
  const z_rate = getZRateForRound(8 + roundInPhase)
  const safe_amount = Math.min(Math.max(0, decision.amount), m_pool)

  let interest_paid = 0
  let interest_earned = 0

  if (decision.action === 'borrow') {
    interest_paid = safe_amount * z_rate
  } else if (decision.action === 'lend') {
    interest_earned = safe_amount * z_rate * 0.75
  }

  const net_finance = interest_earned - interest_paid

  const idx = Math.max(0, Math.min(3, roundInPhase - 1))
  return {
    phase: 3,
    roundInPhase,
    interest_paid,
    interest_earned,
    net_finance,
    lesson: PHASE3_LESSONS[idx],
  }
}

const PHASE4_LESSONS = [
  'Địa tô là phần giá trị thặng dư mà nhà tư bản phải nhượng cho chủ sở hữu đất.',
  'Giá cả đất đai = R / Z′, phản ánh sự vốn hóa địa tô.',
  'Bong bóng giá đất không phản ánh giá trị thực, mà phản ánh kỳ vọng đầu cơ tương lai.',
  'Địa tô tuyệt đối và địa tô chênh lệch phân phối lại giá trị thặng dư trong xã hội.',
]

/** Fraction of V committed to land per Phase 4 round */
export const LAND_COMMIT_FRACTION = 0.25

export function distributePhase4(
  m_pool: number,
  decision: Phase4Decision,
  roundInPhase: number,
): Phase4Result {
  // Player commits a meaningful slice of V to land each round
  const commit = Math.max(0, m_pool) * LAND_COMMIT_FRACTION

  let rent_paid = 0
  let land_value = 0
  let land_gain = 0

  if (decision.landChoice === 'buy') {
    // Steady appreciation: Hoài Đức 2022-2024 +81% over the period
    land_value = commit
    const growthPerRound = R_CASE_HOAI_DUC.priceGrowthPct / ROUNDS_PER_PHASE
    land_gain = commit * growthPerRound
  } else if (decision.landChoice === 'rent') {
    // Pay R each round, no upside (no production model coupled)
    rent_paid = commit * 0.05 // ~5% of committed = drag
    land_gain = -rent_paid
  } else if (decision.landChoice === 'speculate') {
    // Bắc Ninh bubble: rounds 1-2 bubble up, round 3 plateau, round 4 crash
    land_value = commit
    if (roundInPhase <= 2) {
      land_gain = commit * (R_CASE_BAC_NINH.bubbleGrowthPct / 2) // ~+20% / round
    } else if (roundInPhase === 3) {
      land_gain = commit * 0.02 // mild peak gain
    } else {
      land_gain = commit * R_CASE_BAC_NINH.crashPct // -15% crash
    }
  }

  const idx = Math.max(0, Math.min(3, roundInPhase - 1))
  return {
    phase: 4,
    roundInPhase,
    rent_paid,
    land_value,
    land_gain,
    lesson: PHASE4_LESSONS[idx],
  }
}