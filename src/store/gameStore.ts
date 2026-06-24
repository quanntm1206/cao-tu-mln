import { create } from 'zustand'
import { STARTING_M, TOTAL_ROUNDS, P_BAR_TARGET } from '../data/economyConstants'
import {
  getPhaseForRound,
  getRoundInPhase,
  getZRateForRound,
  distributePhase1,
  distributePhase2,
  distributePhase3,
  distributePhase4,
  getInitialSectorRates,
  type GamePhase,
  type PhaseResult,
  type Phase1Result,
  type Phase2Result,
  type Phase3Result,
  type Phase4Result,
  type LandChoice,
  type FinanceAction,
  type SectorRates,
} from '../engine/distribution'
import {
  getQuickEventChoice,
  getQuickEventForRound,
  makeEventSeed,
  type QuickEventEffect,
  type QuickEventSelection,
  type ResolvedQuickEvent,
} from '../data/quickEvents'
import { saveLeaderboard, getLeaderboard, type LeaderboardEntry } from '../lib/storage'

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

export interface RoundDecisions {
  [key: string]: unknown
}

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

export interface HistoryEntry {
  round: number
  result: PhaseResult
  event?: ResolvedGameEvent
}

function getUnlockedFeatures(round: number): Feature[] {
  const features: Feature[] = ['hours', 'reinvest', 'machines', 'materials']
  if (round >= 5) features.push('merchant')
  if (round >= 9) features.push('interest')
  if (round >= 13) features.push('rent')
  if (round >= 16) features.push('surplus_reveal')
  return features
}

const DEFAULT_SECTOR = {
  co_khi: Math.round(STARTING_M / 3),
  det: Math.round(STARTING_M / 3),
  da: STARTING_M - 2 * Math.round(STARTING_M / 3),
}

export interface GameState {
  playerName: string
  started: boolean
  round: number
  maxRounds: number
  gameOver: boolean
  phase: GamePhase

  m_pool: number
  startingM: number
  industrial_profit: number
  merchant_profit: number
  interest_paid: number
  interest_earned: number
  rent_paid: number

  // New economic state
  debt_principal: number
  lent_principal: number
  land_assets: number
  fixed_capital: number
  materials_stock: number
  reinvest_rate: number
  sector_rates: SectorRates
  phase2_surplus_per_round: number
  m_created_total: number

  p_bar_rate: number
  sector_allocation: { co_khi: number; det: number; da: number }
  merchant_share: number
  finance_action: FinanceAction
  land_choice: LandChoice

  history: HistoryEntry[]
  eventLog: QuickEventSelection[]
  openAnswers: Partial<Record<GamePhase, string>>

  pendingLesson: boolean
  lastResult: PhaseResult | null
  lastEvent: ResolvedGameEvent | null
  unlockedFeatures: Feature[]

  pendingQuickEvent: ResolvedQuickEvent | null
  pendingRoundDecisions: RoundDecisions | null
  lastQuickEventChoice: QuickEventSelection | null
  skipQuickEventOnce: boolean
  forceQuickEventForTesting: boolean
  teacherModeEnabled: boolean
  lectureMode: boolean

  startGame: (name: string, initialCapital?: number) => void
  applyRound: (decision: RoundDecisions) => void
  chooseQuickEvent: (choiceId: string) => void
  dismissLesson: () => void
  reset: () => void
  forceNextQuickEvent: () => void
  getLeaderboard: () => LeaderboardEntry[]
  toggleTeacherMode: () => void
  jumpToRound: (round: number) => void
  saveOpenAnswer: (phase: GamePhase, answer: string) => void
}

const DEFAULT_STATE: Omit<
  GameState,
  'startGame' | 'applyRound' | 'chooseQuickEvent' | 'dismissLesson' | 'reset' | 'forceNextQuickEvent' | 'getLeaderboard' | 'toggleTeacherMode' | 'jumpToRound' | 'saveOpenAnswer'
> = {
  playerName: '',
  started: false,
  round: 1,
  maxRounds: TOTAL_ROUNDS,
  gameOver: false,
  phase: 1,

  m_pool: STARTING_M,
  startingM: STARTING_M,
  industrial_profit: 0,
  merchant_profit: 0,
  interest_paid: 0,
  interest_earned: 0,
  rent_paid: 0,

  debt_principal: 0,
  lent_principal: 0,
  land_assets: 0,
  fixed_capital: 0,
  materials_stock: 0,
  reinvest_rate: 0,
  sector_rates: getInitialSectorRates(),
  phase2_surplus_per_round: 0,
  m_created_total: 0,

  p_bar_rate: P_BAR_TARGET,
  sector_allocation: DEFAULT_SECTOR,
  merchant_share: 0.15,
  finance_action: 'none',
  land_choice: 'none',

  history: [],
  eventLog: [],
  openAnswers: {},

  pendingLesson: false,
  lastResult: null,
  lastEvent: null,
  unlockedFeatures: getUnlockedFeatures(1),

  pendingQuickEvent: null,
  pendingRoundDecisions: null,
  lastQuickEventChoice: null,
  skipQuickEventOnce: false,
  forceQuickEventForTesting: false,
  teacherModeEnabled: false,
  lectureMode: false,
}

function applyEffectToState(state: GameState, effect: QuickEventEffect): Partial<GameState> {
  const updates: Partial<GameState> = {}
  updates.m_pool = Math.max(0, state.m_pool + (effect.cashDelta ?? 0))
  if (effect.machinesDelta !== undefined) {
    updates.fixed_capital = Math.max(0, state.fixed_capital + effect.machinesDelta)
  }
  if (effect.materialsDelta !== undefined) {
    updates.materials_stock = Math.max(0, state.materials_stock + effect.materialsDelta)
  }
  if (effect.alphaDelta !== undefined) {
    updates.reinvest_rate = Math.max(0, state.reinvest_rate + effect.alphaDelta)
  }
  if (effect.debtDelta !== undefined) {
    updates.debt_principal = Math.max(0, state.debt_principal + effect.debtDelta)
    // borrowing adds cash
    if (effect.debtDelta > 0) {
      updates.m_pool = Math.max(0, (updates.m_pool ?? state.m_pool) + effect.debtDelta)
    }
  }
  if (effect.lendingDelta !== undefined) {
    updates.lent_principal = Math.max(0, state.lent_principal + effect.lendingDelta)
    // lending removes cash
    if (effect.lendingDelta > 0) {
      updates.m_pool = Math.max(0, (updates.m_pool ?? state.m_pool) - effect.lendingDelta)
    }
  }
  return updates
}

function applyEffectToDecision(decision: RoundDecisions, effect: QuickEventEffect): RoundDecisions {
  return { ...decision, _qeEffect: effect }
}

export const useGameStore = create<GameState>((set, get) => ({
  ...DEFAULT_STATE,

  startGame: (name: string, _initialCapital?: number) => {
    set({
      ...DEFAULT_STATE,
      playerName: name,
      started: true,
      round: 1,
      gameOver: false,
      m_pool: STARTING_M,
      startingM: STARTING_M,
      industrial_profit: 0,
      merchant_profit: 0,
      interest_paid: 0,
      interest_earned: 0,
      rent_paid: 0,
      debt_principal: 0,
      lent_principal: 0,
      land_assets: 0,
      fixed_capital: 0,
      materials_stock: 0,
      reinvest_rate: 0,
      sector_rates: getInitialSectorRates(),
      phase2_surplus_per_round: 0,
      m_created_total: 0,
      history: [],
      eventLog: [],
      openAnswers: {},
      lastResult: null,
      lastEvent: null,
      pendingQuickEvent: null,
      pendingRoundDecisions: null,
      lastQuickEventChoice: null,
      skipQuickEventOnce: false,
      forceQuickEventForTesting: false,
      teacherModeEnabled: false,
      lectureMode: false,
      pendingLesson: false,
      unlockedFeatures: getUnlockedFeatures(1),
    })
  },

  applyRound: (decision: RoundDecisions) => {
    const s = get()
    if (!s.started || s.gameOver) return

    if (!s.skipQuickEventOnce) {
      const event = getQuickEventForRound(
        makeEventSeed(s.playerName, s.startingM),
        s.round,
        s.unlockedFeatures,
        s.history,
        { forceEvent: s.forceQuickEventForTesting },
      )
      if (event) {
        set({ pendingQuickEvent: event, pendingRoundDecisions: decision, lastQuickEventChoice: null })
        return
      }
    }

    const phase = getPhaseForRound(s.round)
    const roundInPhase = getRoundInPhase(s.round)

    let result: PhaseResult

    switch (phase) {
      case 1: {
        const d = decision as { co_khi?: number; det?: number; da?: number }
        result = distributePhase1({
          availableCash: s.m_pool,
          sectorRates: s.sector_rates,
          allocations: {
            co_khi: Number(d.co_khi ?? s.sector_allocation.co_khi),
            det: Number(d.det ?? s.sector_allocation.det),
            da: Number(d.da ?? s.sector_allocation.da),
          },
          roundInPhase,
          fixedCapital: s.fixed_capital,
          materialsStock: s.materials_stock,
          baseCapital: s.startingM,
        })
        break
      }
      case 2: {
        const d = decision as { merchantShare?: number; useMerchant?: boolean }
        // On first round of phase 2, set the per-round surplus
        const surplusPerRound =
          roundInPhase === 1 && s.phase2_surplus_per_round === 0
            ? s.industrial_profit / 4
            : s.phase2_surplus_per_round
        result = distributePhase2(
          surplusPerRound,
          {
            merchantShare: Number(d.merchantShare ?? s.merchant_share),
            useMerchant: Boolean(d.useMerchant),
          },
          roundInPhase,
        )
        break
      }
      case 3: {
        const d = decision as { action?: FinanceAction; amount?: number }
        result = distributePhase3(
          s.m_pool,
          s.debt_principal,
          s.lent_principal,
          {
            action: (d.action as FinanceAction) ?? s.finance_action,
            amount: Number(d.amount ?? 0),
          },
          roundInPhase,
        )
        break
      }
      default: {
        const d = decision as { landChoice?: LandChoice }
        const z_rate = getZRateForRound(s.round)
        result = distributePhase4(
          s.m_pool,
          s.land_assets,
          z_rate,
          { landChoice: (d.landChoice as LandChoice) ?? s.land_choice },
          roundInPhase,
        )
        break
      }
    }

    let m_pool = s.m_pool
    let industrial_profit = s.industrial_profit
    let merchant_profit = s.merchant_profit
    let interest_paid = s.interest_paid
    let interest_earned = s.interest_earned
    let rent_paid = s.rent_paid
    let debt_principal = s.debt_principal
    let lent_principal = s.lent_principal
    let land_assets = s.land_assets
    let sector_rates = s.sector_rates
    let phase2_surplus_per_round = s.phase2_surplus_per_round
    let m_created_total = s.m_created_total

    if (result.phase === 1) {
      const r = result as Phase1Result
      industrial_profit += r.total_industrial_profit
      m_pool += r.pool_delta
      m_created_total += r.m_created
      sector_rates = r.sector_rates_after
    } else if (result.phase === 2) {
      const r = result as Phase2Result
      merchant_profit += r.merchant_profit
      industrial_profit -= r.merchant_profit
      // pool_delta = 0 for phase 2
      if (roundInPhase === 1 && phase2_surplus_per_round === 0) {
        phase2_surplus_per_round = s.industrial_profit / 4
      }
    } else if (result.phase === 3) {
      const r = result as Phase3Result
      interest_paid += r.interest_paid
      interest_earned += r.interest_earned
      m_pool += r.pool_delta
      debt_principal = r.debt_after
      lent_principal = r.lent_after
    } else {
      const r = result as Phase4Result
      rent_paid += r.rent_paid
      if (r.land_purchase_price > 0) {
        land_assets += r.land_purchase_price + r.land_gain
      }
      m_pool += r.pool_delta
    }

    m_pool = Math.max(0, m_pool)

    const selectedQE = s.lastQuickEventChoice
    const lastEvent: ResolvedGameEvent | null = selectedQE
      ? {
          id: selectedQE.eventId,
          round: s.round,
          title: selectedQE.title,
          description: selectedQE.resultText,
          choiceId: selectedQE.choiceId,
          choiceLabel: selectedQE.choiceLabel,
          resultText: selectedQE.resultText,
          teachingPoint: selectedQE.teachingPoint,
        }
      : null

    const entry: HistoryEntry = { round: s.round, result, event: lastEvent ?? undefined }

    const newRound = s.round + 1
    const isGameOver = newRound > s.maxRounds

    if (isGameOver) {
      saveLeaderboard({
        name: s.playerName,
        score: Math.max(0, Math.round(m_pool)),
        rounds: s.maxRounds,
        date: new Date().toLocaleDateString('vi-VN'),
      })
    }

    set({
      m_pool,
      industrial_profit,
      merchant_profit,
      interest_paid,
      interest_earned,
      rent_paid,
      debt_principal,
      lent_principal,
      land_assets,
      sector_rates,
      phase2_surplus_per_round,
      m_created_total,
      round: newRound,
      phase: getPhaseForRound(Math.min(newRound, TOTAL_ROUNDS)),
      history: [...s.history, entry],
      eventLog: selectedQE ? [...s.eventLog, selectedQE] : s.eventLog,
      lastResult: result,
      lastEvent,
      lastQuickEventChoice: null,
      pendingQuickEvent: null,
      pendingRoundDecisions: null,
      skipQuickEventOnce: false,
      forceQuickEventForTesting: false,
      gameOver: isGameOver,
      pendingLesson: true,
      unlockedFeatures: getUnlockedFeatures(newRound),
    })
  },

  chooseQuickEvent: (choiceId: string) => {
    const s = get()
    const event = s.pendingQuickEvent
    const decision = s.pendingRoundDecisions
    if (!event || !decision) return

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

    const nextDecision = applyEffectToDecision(decision, choice.effect)
    set({
      ...applyEffectToState(s, choice.effect),
      lastQuickEventChoice: selection,
      pendingQuickEvent: null,
      pendingRoundDecisions: null,
      skipQuickEventOnce: true,
    })
    get().applyRound(nextDecision)
  },

  forceNextQuickEvent: () =>
    set({ forceQuickEventForTesting: true, teacherModeEnabled: true, lectureMode: true }),

  dismissLesson: () => set({ pendingLesson: false }),

  reset: () => set({ ...DEFAULT_STATE }),

  getLeaderboard: () => getLeaderboard(),
  toggleTeacherMode: () => set((s) => ({ teacherModeEnabled: !s.teacherModeEnabled, lectureMode: !s.teacherModeEnabled })),
  jumpToRound: (round: number) => {
    const clamped = Math.max(1, Math.min(round, TOTAL_ROUNDS))
    set({ round: clamped, phase: getPhaseForRound(clamped) })
  },
  saveOpenAnswer: (phase: GamePhase, answer: string) => set((s) => ({ openAnswers: { ...s.openAnswers, [phase]: answer } })),
}))
