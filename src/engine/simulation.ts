import { SECTOR_PROFILES } from '../data/economyConstants'
import { calcLandPrice, calcProfitRate } from './economy'

export { calcLandPrice, calcProfitRate }

export const SECTOR_CONVERGENCE_FACTOR = 0.2

export interface SectorRates {
  co_khi: number
  det: number
  da: number
}

export interface SectorBreakdown {
  c: number
  v: number
  m: number
}

export function getInitialSectorRates(): SectorRates {
  return {
    co_khi: SECTOR_PROFILES.find((s) => s.id === 'co_khi')!.profitRate,
    det: SECTOR_PROFILES.find((s) => s.id === 'det')!.profitRate,
    da: SECTOR_PROFILES.find((s) => s.id === 'da')!.profitRate,
  }
}

export function splitCVM(invested: number, sectorId: 'co_khi' | 'det' | 'da'): SectorBreakdown {
  const profile = SECTOR_PROFILES.find((s) => s.id === sectorId)!
  if (invested <= 0) return { c: 0, v: 0, m: 0 }
  const cv = profile.organicComposition
  const v = invested / (cv + 1)
  const c = invested - v
  const m = v * profile.surplusValueRate
  return { c, v, m }
}

export function splitCVMWithRate(
  invested: number,
  sectorId: 'co_khi' | 'det' | 'da',
  _sectorRate: number,
): SectorBreakdown {
  const profile = SECTOR_PROFILES.find((s) => s.id === sectorId)!
  if (invested <= 0) return { c: 0, v: 0, m: 0 }
  const cv = profile.organicComposition
  const v = invested / (cv + 1)
  const c = invested - v
  const m = v * profile.surplusValueRate
  return { c, v, m }
}

export function convergeSectorRates(
  rates: SectorRates,
  factor: number = SECTOR_CONVERGENCE_FACTOR,
): SectorRates {
  const avg = (rates.co_khi + rates.det + rates.da) / 3
  return {
    co_khi: rates.co_khi + (avg - rates.co_khi) * factor,
    det: rates.det + (avg - rates.det) * factor,
    da: rates.da + (avg - rates.da) * factor,
  }
}

export function productionDeployCap(
  fixedCapital: number,
  materialsStock: number,
  baseCapital: number,
): number {
  if (baseCapital <= 0) return 1.0
  const bonus = Math.min(0.15, ((fixedCapital + materialsStock) / baseCapital) * 0.15)
  return 1.0 + bonus
}
export const productionMultiplier = productionDeployCap

export function liquidAvailable(mPool: number, _debtPrincipal: number): number {
  return Math.max(0, mPool)
}

export function lendableCash(mPool: number, _lentPrincipal: number): number {
  return Math.max(0, mPool)
}
