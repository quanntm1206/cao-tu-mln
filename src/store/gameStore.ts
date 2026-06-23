import { create } from 'zustand'
import { calcRound, applyRnD, type RoundResult } from '../engine/economy'
import { saveLeaderboard, getLeaderboard, type LeaderboardEntry } from '../lib/storage'
import { calcNetWorth } from '../lib/networth'
import {
  DEFAULT_WAGE_PER_WORKER,
  DEFAULT_WORKERS,
  DEFAULT_RENT_PER_UNIT,
  FAIR_WAGE_THRESHOLD,
  LOGISTICS_UNIT_COST,
} from '../data/economyConstants'

export type Feature =
  | 'hours'
  | 'reinvest'
  | 'machines'
  | 'materials'
  | 'rnd'
  | 'logistics'
  | 'merchant'
  | 'interest'
  | 'rent'
  | 'surplus_reveal'

function getUnlockedFeatures(round: number): Feature[] {
  const features: Feature[] = ['hours', 'reinvest']
  if (round >= 3) features.push('machines', 'materials')
  if (round >= 5) features.push('rnd')
  if (round >= 7) features.push('logistics', 'merchant')
  if (round >= 9) features.push('interest')
  if (round >= 11) features.push('rent')
  if (round >= 13) features.push('surplus_reveal')
  return features
}

export interface RoundDecisions {
  // Labor
  h: number                  // hours per day
  v_per_worker: number       // wage per worker
  workers: number            // number of workers

  // Capital
  invest_machines: number    // invest in new fixed capital
  invest_materials: number   // purchase circulating capital

  // R&D
  invest_rnd: number

  // Logistics
  invest_logistics: number   // spend to increase logistics level

  // Distribution
  use_merchant: boolean
  merchant_rate: number

  // Finance
  take_loan: number          // borrow this amount
  repay_loan: number         // repay this amount
  lend_out: number           // lend this amount
  recall_lending: number     // recall lending

  // Land
  buy_land: number           // buy N units of land
  rent_mode: boolean         // true = rent land from landlord

  // Reinvestment
  alpha: number              // fraction to reinvest
}

export interface HistoryEntry {
  round: number
  decisions: RoundDecisions
  result: RoundResult
  state_after: GameSnapshot
}

export interface GameSnapshot {
  cash: number
  c_fixed_book: number
  c_circulating_stock: number
  v_per_worker: number
  workers: number
  t_n: number
  tech_lead: number
  logistics_level: number
  debt: number
  lending: number
  land_units: number
  morale: number
  marketTechLevel: number
  p_bar: number
}

export interface GameState {
  // Meta
  playerName: string
  started: boolean
  round: number
  maxRounds: number
  gameOver: boolean

  // Capital state
  cash: number
  c_fixed_book: number        // book value of fixed capital
  c_circulating_stock: number // available circulating capital
  v_per_worker: number        // base wage per worker
  workers: number
  h: number                   // hours
  t_n: number                 // necessary labor time
  base_t_n: number            // minimum t_n (floor)
  tech_lead: number
  logistics_level: number
  ch_base: number             // base circulation time
  debt: number
  lending: number
  land_units: number
  rent_per_unit: number
  rent_mode: boolean
  use_merchant: boolean
  merchant_rate: number
  alpha: number
  morale: number
  marketTechLevel: number
  p_bar: number               // market average rate of profit

  // Derived config
  depreciation_rate: number
  bank_interest_rate: number
  CH: number                  // annual production periods

  // Game flow
  history: HistoryEntry[]
  unlockedFeatures: Feature[]
  pendingLesson: boolean      // show theory modal after round
  lastResult: RoundResult | null

  // Actions
  startGame: (name: string, initialCapital: number) => void
  applyRound: (decisions: RoundDecisions) => void
  dismissLesson: () => void
  reset: () => void
  getLeaderboard: () => LeaderboardEntry[]
}

const DEFAULT_STATE = {
  playerName: '',
  started: false,
  round: 1,
  maxRounds: 18,
  gameOver: false,
  cash: 0,
  c_fixed_book: 0,
  c_circulating_stock: 0,
  v_per_worker: DEFAULT_WAGE_PER_WORKER,
  workers: DEFAULT_WORKERS,
  h: 8,
  t_n: 4,
  base_t_n: 1.5,
  tech_lead: 0,
  logistics_level: 0,
  ch_base: 1,
  debt: 0,
  lending: 0,
  land_units: 0,
  rent_per_unit: DEFAULT_RENT_PER_UNIT,
  rent_mode: false,
  use_merchant: false,
  merchant_rate: 0.08,
  alpha: 0.5,
  morale: 75,
  marketTechLevel: 0,
  p_bar: 0.18,
  depreciation_rate: 0.05,
  bank_interest_rate: 0.04,
  CH: 4,
  history: [] as HistoryEntry[],
  unlockedFeatures: ['hours', 'reinvest'] as Feature[],
  pendingLesson: false,
  lastResult: null as RoundResult | null,
}

function calcSnapshotNetWorth(
  snap: GameSnapshot,
  rent_per_unit: number,
  bank_interest_rate: number,
): number {
  return calcNetWorth({
    cash: snap.cash,
    c_fixed_book: snap.c_fixed_book,
    c_circulating_stock: snap.c_circulating_stock,
    lending: snap.lending,
    debt: snap.debt,
    land_units: snap.land_units,
    rent_per_unit,
    bank_interest_rate,
  })
}

export const useGameStore = create<GameState>((set, get) => ({
  ...DEFAULT_STATE,

  startGame: (name: string, initialCapital: number) => {
    const startCash = initialCapital
    const c_fixed = Math.floor(initialCapital * 0.4)
    const c_circ = Math.floor(initialCapital * 0.2)
    const cash = startCash - c_fixed - c_circ
    set({
      ...DEFAULT_STATE,
      playerName: name,
      started: true,
      round: 1,
      gameOver: false,
      cash,
      c_fixed_book: c_fixed,
      c_circulating_stock: c_circ,
      unlockedFeatures: getUnlockedFeatures(1),
      history: [],
      lastResult: null,
      pendingLesson: false,
    })
  },

  applyRound: (decisions: RoundDecisions) => {
    const s = get()
    if (!s.started || s.gameOver) return

    // Apply player decisions to state
    let cash = s.cash
    let c_fixed_book = s.c_fixed_book
    let c_circulating_stock = s.c_circulating_stock
    let debt = s.debt
    let lending = s.lending
    let land_units = s.land_units
    let logistics_level = s.logistics_level
    let t_n = s.t_n
    let tech_lead = s.tech_lead

    // Finance decisions
    cash += decisions.take_loan
    debt += decisions.take_loan
    cash -= decisions.repay_loan
    debt = Math.max(0, debt - decisions.repay_loan)
    cash -= decisions.lend_out
    lending += decisions.lend_out
    cash += decisions.recall_lending
    lending = Math.max(0, lending - decisions.recall_lending)

    // Investment decisions
    cash -= decisions.invest_machines
    c_fixed_book += decisions.invest_machines

    cash -= decisions.invest_materials
    c_circulating_stock += decisions.invest_materials

    // R&D
    cash -= decisions.invest_rnd
    const { new_t_n: rnd_t_n, new_tech_lead } = applyRnD(
      decisions.invest_rnd,
      t_n,
      s.base_t_n,
      tech_lead,
    )
    t_n = rnd_t_n
    tech_lead = new_tech_lead

    // Logistics upgrade
    if (decisions.invest_logistics > 0) {
      const upgrade = Math.floor(decisions.invest_logistics / LOGISTICS_UNIT_COST)
      logistics_level = Math.min(5, logistics_level + upgrade)
      cash -= decisions.invest_logistics
    }

    // Land purchase
    if (decisions.buy_land > 0) {
      const land_price = s.rent_per_unit / s.bank_interest_rate
      const total_cost = decisions.buy_land * land_price
      cash -= total_cost
      land_units += decisions.buy_land
    }

    // Variable capital per round = workers × wage × hours_factor
    const v_total = decisions.workers * decisions.v_per_worker
    const c_circulating_used =
      c_circulating_stock > 0 ? c_circulating_stock * 0.8 : 0
    const rent_land_units = decisions.rent_mode ? Math.max(1, land_units) : 0

    // Run economy engine
    const result = calcRound({
      c_fixed_book,
      depreciation_rate: s.depreciation_rate,
      c_circulating: c_circulating_used,
      v: v_total,
      h: decisions.h,
      t_n,
      workers: decisions.workers,
      CH: s.CH,
      ch: s.ch_base,
      tech_lead,
      marketTechLevel: s.marketTechLevel,
      p_bar: s.p_bar,
      debt,
      bank_interest_rate: s.bank_interest_rate,
      lending,
      land_units: rent_land_units,
      rent_per_unit: s.rent_per_unit,
      rent_mode: decisions.rent_mode,
      use_merchant: decisions.use_merchant,
      merchant_rate: decisions.merchant_rate,
      logistics_level,
      morale: s.morale,
      alpha: decisions.alpha,
    })

    // Apply result to state
    cash += result.cash_delta
    c_fixed_book = Math.max(0, c_fixed_book - result.c_depreciation)
    c_circulating_stock = Math.max(0, c_circulating_stock - c_circulating_used)

    // Reinvestment goes to fixed capital or circulating
    const reinvest = result.reinvestment
    c_fixed_book += reinvest * 0.6
    c_circulating_stock += reinvest * 0.4

    // Tech lead decays (already applied in calcRound)
    tech_lead = result.new_tech_lead

    // Market evolves: AI capital movement + tech diffusion
    const new_market_tech = s.marketTechLevel + 0.02 + (tech_lead < 0.05 ? 0.01 : 0)
    let new_t_n = t_n
    if (tech_lead < 0.05 && s.marketTechLevel > 0.1) {
      // Super-surplus converts to relative surplus as rivals catch up
      new_t_n = Math.max(s.base_t_n, t_n * 0.995)
    }
    const new_p_bar = s.p_bar + (Math.random() * 0.02 - 0.01)

    // Morale: working long hours decreases morale, fair wages increase it
    const morale_delta =
      (decisions.h <= 8 ? 2 : -3) +
      (decisions.v_per_worker >= FAIR_WAGE_THRESHOLD ? 2 : -1)
    const new_morale = Math.max(10, Math.min(100, s.morale + morale_delta))

    const newRound = s.round + 1
    const isGameOver = newRound > s.maxRounds

    const snapshot: GameSnapshot = {
      cash,
      c_fixed_book,
      c_circulating_stock,
      v_per_worker: decisions.v_per_worker,
      workers: decisions.workers,
      t_n: new_t_n,
      tech_lead,
      logistics_level,
      debt,
      lending,
      land_units,
      morale: new_morale,
      marketTechLevel: new_market_tech,
      p_bar: new_p_bar,
    }

    const entry: HistoryEntry = {
      round: s.round,
      decisions,
      result,
      state_after: snapshot,
    }

    if (isGameOver) {
      const netWorth = calcSnapshotNetWorth(snapshot, s.rent_per_unit, s.bank_interest_rate)
      saveLeaderboard({
        name: s.playerName,
        score: Math.round(netWorth),
        rounds: s.maxRounds,
        date: new Date().toLocaleDateString('vi-VN'),
      })
    }

    set({
      cash,
      c_fixed_book,
      c_circulating_stock,
      v_per_worker: decisions.v_per_worker,
      workers: decisions.workers,
      h: decisions.h,
      t_n: new_t_n,
      tech_lead,
      logistics_level,
      debt,
      lending,
      land_units,
      rent_mode: decisions.rent_mode,
      use_merchant: decisions.use_merchant,
      merchant_rate: decisions.merchant_rate,
      alpha: decisions.alpha,
      morale: new_morale,
      marketTechLevel: new_market_tech,
      p_bar: Math.max(0.05, Math.min(0.5, new_p_bar)),
      history: [...s.history, entry],
      lastResult: result,
      round: newRound,
      gameOver: isGameOver,
      unlockedFeatures: getUnlockedFeatures(newRound),
      pendingLesson: true,
    })
  },

  dismissLesson: () => set({ pendingLesson: false }),

  reset: () => set({ ...DEFAULT_STATE }),

  getLeaderboard: () => getLeaderboard(),
}))
