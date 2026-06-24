/** Quy mô tiền tệ theo doanh nghiệp sản xuất vừa và nhỏ Việt Nam (đơn vị: VND). */

export const CAPITAL_OPTIONS = [
  { label: '5 tỷ đồng (Dễ)', value: 5_000_000_000 },
  { label: '3 tỷ đồng (TB)', value: 3_000_000_000 },
  { label: '1,5 tỷ đồng (Khó)', value: 1_500_000_000 },
] as const

export const DEFAULT_CAPITAL = 3_000_000_000

/** Tổng giá trị thặng dư m có sẵn khi bắt đầu */
export const STARTING_M = 200_000_000_000

/** Tỷ suất lợi nhuận bình quân mục tiêu (P bar) */
export const P_BAR_TARGET = 0.20

/**
 * Mỗi ngành có cấu tạo hữu cơ c/v khác nhau (organicComposition).
 * Với m′ = 100% (tỷ suất giá trị thặng dư chuẩn theo giáo trình),
 * tỷ suất lợi nhuận dẫn xuất: p' = m'/(c/v + 1)
 *   Cơ khí  c/v = 4    → p' = 20%  (thâm dụng máy móc)
 *   Dệt may c/v = 7/3  → p' = 30%  (cân bằng)
 *   Da giày c/v = 3/2  → p' = 40%  (thâm dụng lao động)
 */
export const SECTOR_PROFILES = [
  {
    id: 'co_khi',
    label: 'Cơ khí',
    profitRate: 0.20,
    organicComposition: 4,
    surplusValueRate: 1.0,
    archetype: 'Thâm dụng máy móc (c cao, v thấp)',
    examples: 'VinFast, THACO',
  },
  {
    id: 'det',
    label: 'Dệt may',
    profitRate: 0.30,
    organicComposition: 7 / 3,
    surplusValueRate: 1.0,
    archetype: 'Cân bằng vốn–lao động',
    examples: 'Vinatex, Việt Tiến',
  },
  {
    id: 'da',
    label: 'Da giày',
    profitRate: 0.40,
    organicComposition: 1.5,
    surplusValueRate: 1.0,
    archetype: 'Thâm dụng lao động (v cao, c thấp)',
    examples: 'Biti\'s, gia công Nike',
  },
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