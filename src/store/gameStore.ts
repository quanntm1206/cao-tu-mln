import { create } from 'zustand'
import { calcRound, applyRnD, type RoundResult } from '../engine/economy'
import { saveLeaderboard, getLeaderboard, type LeaderboardEntry } from '../lib/storage'
import { calcNetWorth } from '../lib/networth'
import {
  DEFAULT_WAGE_PER_WORKER,
  DEFAULT_WORKERS,
  DEFAULT_RENT_PER_UNIT,
  LOGISTICS_UNIT_COST,
} from '../data/economyConstants'
import { getDifficultyForCapital, type DifficultyId } from '../data/difficulty'
import {
  getQuickEventChoice,
  getQuickEventForRound,
  makeEventSeed,
  seededUnit,
  type QuickEventEffect,
  type QuickEventSelection,
  type ResolvedQuickEvent,
} from '../data/quickEvents'

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

export type GameOverReason = 'completed' | null

export interface ResolvedGameEvent {
  id: string
  round: number
  title: string
  description: string
  choiceId: string
  choiceLabel: string
  resultText: string
  teachingPoint: string
}

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
  h: number
  v_per_worker: number
  workers: number
  invest_machines: number
  invest_materials: number
  invest_rnd: number
  invest_logistics: number
  use_merchant: boolean
  merchant_rate: number
  take_loan: number
  repay_loan: number
  lend_out: number
  recall_lending: number
  buy_land: number
  rent_mode: boolean
  alpha: number
}

export interface HistoryEntry {
  round: number
  decisions: RoundDecisions
  result: RoundResult
  state_after: GameSnapshot
  event?: ResolvedGameEvent
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
  marketTechLevel: number
  p_bar: number
}

export interface GameState {
  playerName: string
  started: boolean
  round: number
  maxRounds: number
  gameOver: boolean
  gameOverReason: GameOverReason
  initialCapital: number
  difficultyId: DifficultyId

  cash: number
  c_fixed_book: number
  c_circulating_stock: number
  v_per_worker: number
  workers: number
  h: number
  t_n: number
  base_t_n: number
  tech_lead: number
  logistics_level: number
  ch_base: number
  debt: number
  lending: number
  land_units: number
  rent_per_unit: number
  rent_mode: boolean
  use_merchant: boolean
  merchant_rate: number
  alpha: number
  marketTechLevel: number
  p_bar: number

  depreciation_rate: number
  bank_interest_rate: number
  CH: number

  history: HistoryEntry[]
  unlockedFeatures: Feature[]
  pendingLesson: boolean
  pendingQuickEvent: ResolvedQuickEvent | null
  pendingRoundDecisions: RoundDecisions | null
  lastQuickEventChoice: QuickEventSelection | null
  eventLog: QuickEventSelection[]
  skipQuickEventOnce: boolean
  forceQuickEventForTesting: boolean
  teacherModeEnabled: boolean
  lectureMode: boolean
  lastResult: RoundResult | null
  lastEvent: ResolvedGameEvent | null

  startGame: (name: string, initialCapital: number) => void
  applyRound: (decisions: RoundDecisions) => void
  chooseQuickEvent: (choiceId: string) => void
  toggleTeacherMode: () => void
  forceNextQuickEvent: () => void
  jumpToRound: (targetRound: number) => void
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
  gameOverReason: null as GameOverReason,
  initialCapital: 0,
  difficultyId: 'normal' as DifficultyId,
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
  marketTechLevel: 0,
  p_bar: 0.18,
  depreciation_rate: 0.05,
  bank_interest_rate: 0.04,
  CH: 4,
  history: [] as HistoryEntry[],
  unlockedFeatures: ['hours', 'reinvest'] as Feature[],
  pendingLesson: false,
  pendingQuickEvent: null as ResolvedQuickEvent | null,
  pendingRoundDecisions: null as RoundDecisions | null,
  lastQuickEventChoice: null as QuickEventSelection | null,
  eventLog: [] as QuickEventSelection[],
  skipQuickEventOnce: false,
  forceQuickEventForTesting: false,
  teacherModeEnabled: false,
  lectureMode: false,
  lastResult: null as RoundResult | null,
  lastEvent: null as ResolvedGameEvent | null,
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

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function applyQuickEventEffectToDecisions(
  decisions: RoundDecisions,
  effect: QuickEventEffect,
): RoundDecisions {
  return {
    ...decisions,
    h: clampNumber(decisions.h + (effect.hDelta ?? 0), 6, 14),
    v_per_worker: Math.max(0, decisions.v_per_worker + (effect.wageDelta ?? 0)),
    workers: clampNumber(decisions.workers + (effect.workersDelta ?? 0), 1, 50),
    use_merchant: effect.forceMerchant ? true : decisions.use_merchant,
    merchant_rate: clampNumber(
      decisions.merchant_rate + (effect.merchantRateDelta ?? 0),
      0.03,
      0.2,
    ),
    rent_mode: effect.forceRentMode ? true : decisions.rent_mode,
    alpha: clampNumber(decisions.alpha + (effect.alphaDelta ?? 0), 0, 1),
  }
}

function applyQuickEventEffectToSnapshot(
  state: GameState,
  effect: QuickEventEffect,
): Partial<GameState> {
  let cash = state.cash + (effect.cashDelta ?? 0)
  let land_units = state.land_units

  if (effect.landUnitsDelta && effect.landUnitsDelta > 0) {
    const landPrice = state.rent_per_unit / state.bank_interest_rate
    const affordableUnits = Math.min(effect.landUnitsDelta, Math.floor(cash / landPrice))
    if (affordableUnits > 0) {
      cash -= affordableUnits * landPrice
      land_units += affordableUnits
    }
  }

  return {
    cash,
    c_circulating_stock: Math.max(
      0,
      state.c_circulating_stock + (effect.materialsDelta ?? 0),
    ),
    c_fixed_book: Math.max(0, state.c_fixed_book + (effect.machinesDelta ?? 0)),
    debt: Math.max(0, state.debt + (effect.debtDelta ?? 0)),
    lending: Math.max(0, state.lending + (effect.lendingDelta ?? 0)),
    land_units,
    t_n: Math.max(state.base_t_n * 0.25, state.t_n + (effect.tNDelta ?? 0)),
    tech_lead: Math.max(0, state.tech_lead + (effect.techLeadDelta ?? 0)),
    logistics_level: clampNumber(
      state.logistics_level + (effect.logisticsLevelDelta ?? 0),
      0,
      5,
    ),
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  ...DEFAULT_STATE,

  startGame: (name: string, initialCapital: number) => {
    const profile = getDifficultyForCapital(initialCapital)
    const c_fixed = Math.floor(initialCapital * 0.4)
    const c_circ = Math.floor(initialCapital * 0.2)
    const cash = initialCapital - c_fixed - c_circ
    set({
      ...DEFAULT_STATE,
      playerName: name,
      started: true,
      round: 1,
      gameOver: false,
      gameOverReason: null,
      initialCapital,
      difficultyId: profile.id,
      cash,
      c_fixed_book: c_fixed,
      c_circulating_stock: c_circ,
      p_bar: profile.p_bar,
      bank_interest_rate: profile.bank_interest_rate,
      unlockedFeatures: getUnlockedFeatures(1),
      history: [],
      lastResult: null,
      lastEvent: null,
      pendingQuickEvent: null,
      pendingRoundDecisions: null,
      lastQuickEventChoice: null,
      eventLog: [],
      skipQuickEventOnce: false,
      teacherModeEnabled: false,
      lectureMode: false,
      pendingLesson: false,
    })
  },

  applyRound: (decisions: RoundDecisions) => {
    const s = get()
    if (!s.started || s.gameOver) return

    if (!s.skipQuickEventOnce) {
      const event = getQuickEventForRound(
        makeEventSeed(s.playerName, s.initialCapital),
        s.round,
        s.unlockedFeatures,
        s.history,
        { forceEvent: s.forceQuickEventForTesting },
      )

      if (event) {
        set({
          pendingQuickEvent: event,
          pendingRoundDecisions: decisions,
          lastQuickEventChoice: null,
        })
        return
      }
    }

    const profile = getDifficultyForCapital(s.initialCapital)

    let cash = s.cash
    let c_fixed_book = s.c_fixed_book
    let c_circulating_stock = s.c_circulating_stock
    let debt = s.debt
    let lending = s.lending
    let land_units = s.land_units
    let logistics_level = s.logistics_level
    let t_n = s.t_n
    let tech_lead = s.tech_lead

    cash += decisions.take_loan
    debt += decisions.take_loan
    cash -= decisions.repay_loan
    debt = Math.max(0, debt - decisions.repay_loan)
    cash -= decisions.lend_out
    lending += decisions.lend_out
    cash += decisions.recall_lending
    lending = Math.max(0, lending - decisions.recall_lending)

    cash -= decisions.invest_machines
    c_fixed_book += decisions.invest_machines

    cash -= decisions.invest_materials
    c_circulating_stock += decisions.invest_materials

    cash -= decisions.invest_rnd
    const { new_t_n: rnd_t_n, new_tech_lead } = applyRnD(
      decisions.invest_rnd,
      t_n,
      s.base_t_n,
      tech_lead,
    )
    t_n = rnd_t_n
    tech_lead = new_tech_lead

    if (decisions.invest_logistics > 0) {
      const upgrade = Math.floor(decisions.invest_logistics / LOGISTICS_UNIT_COST)
      logistics_level = Math.min(5, logistics_level + upgrade)
      cash -= decisions.invest_logistics
    }

    if (decisions.buy_land > 0) {
      const land_price = s.rent_per_unit / s.bank_interest_rate
      const total_cost = decisions.buy_land * land_price
      cash -= total_cost
      land_units += decisions.buy_land
    }

    const v_total = decisions.workers * decisions.v_per_worker
    const c_circulating_used =
      c_circulating_stock > 0 ? c_circulating_stock * 0.8 : 0
    const rent_land_units = decisions.rent_mode ? Math.max(1, land_units) : 0

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
      alpha: decisions.alpha,
    })

    cash += result.cash_delta
    c_fixed_book = Math.max(0, c_fixed_book - result.c_depreciation)
    c_circulating_stock = Math.max(0, c_circulating_stock - c_circulating_used)

    const reinvest = result.reinvestment
    c_fixed_book += reinvest * 0.6
    c_circulating_stock += reinvest * 0.4

    tech_lead = result.new_tech_lead

    let new_market_tech =
      s.marketTechLevel + profile.market_tech_growth + (tech_lead < 0.05 ? 0.01 : 0)
    let new_t_n = t_n
    if (tech_lead < 0.05 && s.marketTechLevel > 0.1) {
      new_t_n = Math.max(s.base_t_n, t_n * 0.995)
    }
    const seed = makeEventSeed(s.playerName, s.initialCapital)
    const pBarNoise = seededUnit(`${seed}::p-bar::round-${s.round}`) * 2 - 1
    let new_p_bar = s.p_bar + pBarNoise * profile.p_bar_volatility

    const selectedQuickEvent = s.lastQuickEventChoice
    const lastEvent: ResolvedGameEvent | null = selectedQuickEvent
      ? {
          id: selectedQuickEvent.eventId,
          round: s.round,
          title: selectedQuickEvent.title,
          description: selectedQuickEvent.resultText,
          choiceId: selectedQuickEvent.choiceId,
          choiceLabel: selectedQuickEvent.choiceLabel,
          resultText: selectedQuickEvent.resultText,
          teachingPoint: selectedQuickEvent.teachingPoint,
        }
      : null

    new_p_bar = Math.max(0.05, Math.min(0.5, new_p_bar))

    const newRound = s.round + 1

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
      marketTechLevel: new_market_tech,
      p_bar: new_p_bar,
    }

    const netWorth = calcSnapshotNetWorth(snapshot, s.rent_per_unit, s.bank_interest_rate)
    const completedAllRounds = newRound > s.maxRounds
    const isGameOver = completedAllRounds
    const gameOverReason: GameOverReason = completedAllRounds
        ? 'completed'
        : null

    const entry: HistoryEntry = {
      round: s.round,
      decisions,
      result,
      state_after: snapshot,
      event: lastEvent ?? undefined,
    }

    if (isGameOver) {
      saveLeaderboard({
        name: s.playerName,
        score: Math.max(0, Math.round(netWorth)),
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
      marketTechLevel: new_market_tech,
      p_bar: new_p_bar,
      history: [...s.history, entry],
      eventLog: selectedQuickEvent ? [...s.eventLog, selectedQuickEvent] : s.eventLog,
      lastResult: result,
      lastEvent,
      lastQuickEventChoice: null,
      pendingQuickEvent: null,
      pendingRoundDecisions: null,
      skipQuickEventOnce: false,
      forceQuickEventForTesting: false,
      round: newRound,
      gameOver: isGameOver,
      gameOverReason,
      unlockedFeatures: getUnlockedFeatures(newRound),
      pendingLesson: true,
    })
  },

  chooseQuickEvent: (choiceId: string) => {
    const s = get()
    const event = s.pendingQuickEvent
    const decisions = s.pendingRoundDecisions
    if (!event || !decisions) return

    const choice = getQuickEventChoice(event, choiceId)
    if (!choice) return

    const selection: QuickEventSelection = {
      round: event.round,
      eventId: event.id,
      choiceId: choice.id,
      title: event.title,
      choiceLabel: choice.label,
      resultText: choice.resultText,
      teachingPoint: choice.teachingPoint,
      effect: choice.effect,
      forcedByTeacher: s.forceQuickEventForTesting,
    }

    const nextDecisions = applyQuickEventEffectToDecisions(decisions, choice.effect)
    set({
      ...applyQuickEventEffectToSnapshot(s, choice.effect),
      lastQuickEventChoice: selection,
      pendingQuickEvent: null,
      pendingRoundDecisions: null,
      skipQuickEventOnce: true,
    })
    get().applyRound(nextDecisions)
  },


  toggleTeacherMode: () => {
    const s = get()
    set({
      teacherModeEnabled: !s.teacherModeEnabled,
      lectureMode: s.teacherModeEnabled ? false : s.lectureMode,
      forceQuickEventForTesting: s.teacherModeEnabled ? false : s.forceQuickEventForTesting,
    })
  },

  forceNextQuickEvent: () => set({
    forceQuickEventForTesting: true,
    teacherModeEnabled: true,
    lectureMode: true,
  }),

  jumpToRound: (targetRound: number) => {
    const s = get()
    if (!s.started || s.gameOver) return
    const nextRound = clampNumber(Math.round(targetRound), 1, s.maxRounds)
    set({
      round: nextRound,
      unlockedFeatures: getUnlockedFeatures(nextRound),
      pendingLesson: false,
      pendingQuickEvent: null,
      pendingRoundDecisions: null,
      lastQuickEventChoice: null,
      lastResult: null,
      lastEvent: null,
      forceQuickEventForTesting: false,
      teacherModeEnabled: true,
      lectureMode: true,
    })
  },
  dismissLesson: () => set({ pendingLesson: false }),

  reset: () => set({ ...DEFAULT_STATE }),

  getLeaderboard: () => getLeaderboard(),
}))










