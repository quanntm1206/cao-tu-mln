/** Quy mo tien te theo doanh nghiep san xuat vua va nho Viet Nam (don vi: VND). */

export const CAPITAL_OPTIONS = [
  { label: '5 ty dong (De)', value: 5_000_000_000 },
  { label: '3 ty dong (TB)', value: 3_000_000_000 },
  { label: '1,5 ty dong (Kho)', value: 1_500_000_000 },
] as const

export const DEFAULT_CAPITAL = 3_000_000_000

/** Tong gia tri thang du m co san khi bat dau */
export const STARTING_M = 200_000_000_000

/** Ty suat loi nhuan binh quan muc tieu (P bar) */
export const P_BAR_TARGET = 0.20

export const SECTOR_PROFILES = [
  { id: 'co_khi', label: 'Co khi', profitRate: 0.20 },
  { id: 'det', label: 'Det may', profitRate: 0.30 },
  { id: 'da', label: 'Da giay', profitRate: 0.40 },
] as const

export type SectorId = (typeof SECTOR_PROFILES)[number]['id']

export const Z_RATE_TABLE_2022_2024 = {
  peak_2022: 0.078,
  low_2024: 0.037,
  mid_2024: 0.06,
  rebound_2024: 0.065,
} as const

export const R_CASE_HOAI_DUC = {
  rentPerSqmYear: 8_000_000,
  pricePerSqm: 100_000_000,
  priceGrowthPct: 0.81,
} as const

export const R_CASE_BAC_NINH = {
  rentPerSqmYear: 3_000_000,
  speculativePricePerSqm: 70_000_000,
  bubbleGrowthPct: 0.40,
  crashPct: -0.15,
} as const

export const MAX_LOAN_PER_ROUND = 3_000_000_000
export const LOAN_STEP = 100_000_000
export const LEND_STEP = 100_000_000
export const INVEST_STEP = 50_000_000
export const ROUNDS_PER_PHASE = 4
export const TOTAL_ROUNDS = 16