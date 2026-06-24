import { describe, expect, it, beforeEach } from 'vitest'
import { useGameStore, type RoundDecisions } from './gameStore'

const baseDecisions: RoundDecisions = {
  h: 8,
  v_per_worker: 24_000_000,
  workers: 15,
  invest_machines: 0,
  invest_materials: 0,
  invest_rnd: 0,
  invest_logistics: 0,
  use_merchant: false,
  merchant_rate: 0.08,
  take_loan: 0,
  repay_loan: 0,
  lend_out: 0,
  recall_lending: 0,
  buy_land: 0,
  rent_mode: false,
  alpha: 0.5,
}

describe('gameStore quick event flow', () => {
  beforeEach(() => {
    useGameStore.getState().reset()
    useGameStore.getState().startGame('Event Tester', 3_000_000_000)
  })

  it('holds the round when a quick event is pending', () => {
    useGameStore.setState({ forceQuickEventForTesting: true })

    useGameStore.getState().applyRound(baseDecisions)

    const state = useGameStore.getState()
    expect(state.round).toBe(1)
    expect(state.pendingLesson).toBe(false)
    expect(state.pendingQuickEvent).not.toBeNull()
    expect(state.pendingRoundDecisions).toEqual(baseDecisions)
  })

  it('applies the selected event effect then calculates the round', () => {
    useGameStore.setState({ forceQuickEventForTesting: true })
    useGameStore.getState().applyRound(baseDecisions)
    const pending = useGameStore.getState().pendingQuickEvent
    expect(pending).not.toBeNull()

    useGameStore.getState().chooseQuickEvent(pending!.choices[0].id)

    const state = useGameStore.getState()
    expect(state.round).toBe(2)
    expect(state.pendingLesson).toBe(true)
    expect(state.pendingQuickEvent).toBeNull()
    expect(state.eventLog).toHaveLength(1)
    expect(state.lastEvent?.id).toBe(pending!.id)
    expect(state.history[0].event?.choiceId).toBe(pending!.choices[0].id)
  })
})
