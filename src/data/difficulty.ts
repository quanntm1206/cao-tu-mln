/** Cấu hình độ khó theo vốn khởi đầu — 5 tỷ (dễ), 3 tỷ (TB), 1,5 tỷ (khó). */

export type DifficultyId = 'easy' | 'normal' | 'hard'

export interface DifficultyProfile {
  id: DifficultyId
  label: string
  p_bar: number
  bank_interest_rate: number
  market_tech_growth: number
  p_bar_volatility: number
}

const PROFILES: Record<DifficultyId, DifficultyProfile> = {
  easy: {
    id: 'easy',
    label: 'Dễ',
    p_bar: 0.16,
    bank_interest_rate: 0.035,
    market_tech_growth: 0.015,
    p_bar_volatility: 0.008,
  },
  normal: {
    id: 'normal',
    label: 'Trung bình',
    p_bar: 0.18,
    bank_interest_rate: 0.04,
    market_tech_growth: 0.02,
    p_bar_volatility: 0.01,
  },
  hard: {
    id: 'hard',
    label: 'Khó',
    p_bar: 0.21,
    bank_interest_rate: 0.05,
    market_tech_growth: 0.028,
    p_bar_volatility: 0.014,
  },
}

export function getDifficultyForCapital(initialCapital: number): DifficultyProfile {
  if (initialCapital >= 5_000_000_000) return PROFILES.easy
  if (initialCapital >= 3_000_000_000) return PROFILES.normal
  return PROFILES.hard
}
