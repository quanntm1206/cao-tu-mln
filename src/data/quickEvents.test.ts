import { describe, expect, it } from 'vitest'
import {
  QUICK_EVENTS,
  FORBIDDEN_QUICK_EVENT_TERMS,
  getQuickEventForRound,
  makeEventSeed,
} from './quickEvents'
import type { Feature, HistoryEntry } from '../store/gameStore'

const allEventText = QUICK_EVENTS.map((event) => [
  event.title,
  event.description,
  event.teachingPoint,
  ...event.choices.flatMap((choice) => [choice.label, choice.resultText, choice.teachingPoint]),
].join(' ')).join('\n')

describe('quick events', () => {
  it('uses deterministic seeded random by player and capital', () => {
    const seed = makeEventSeed('An', 3_000_000_000)
    const features: Feature[] = ['hours', 'reinvest', 'machines', 'materials']
    const first = getQuickEventForRound(seed, 4, features, [])
    const second = getQuickEventForRound(seed, 4, features, [])

    expect(second?.id).toBe(first?.id)
  })

  it('does not return events before their unlock round or feature gates', () => {
    const seed = 'force-merchant-check'
    const noMerchantFeatures: Feature[] = ['hours', 'reinvest']
    const history: HistoryEntry[] = []

    for (let round = 1; round <= 6; round += 1) {
      const event = getQuickEventForRound(seed, round, noMerchantFeatures, history, { forceEvent: true })
      expect(event?.requiredFeatures ?? []).not.toContain('merchant')
      expect(event?.unlockRound ?? round).toBeLessThanOrEqual(round)
    }
  })

  it('keeps every event within the chapter 3 teaching scope', () => {
    expect(QUICK_EVENTS.length).toBeGreaterThanOrEqual(24)

    for (const event of QUICK_EVENTS) {
      expect(event.choices.length).toBeGreaterThanOrEqual(2)
      expect(event.choices.length).toBeLessThanOrEqual(3)
      expect(event.teachingPoint.length).toBeGreaterThan(20)
      for (const choice of event.choices) {
        expect(choice.label.length).toBeGreaterThan(0)
        expect(choice.teachingPoint.length).toBeGreaterThan(20)
        expect(choice.effect).toBeDefined()
      }
    }

    for (const term of FORBIDDEN_QUICK_EVENT_TERMS) {
      expect(allEventText.toLowerCase()).not.toContain(term.toLowerCase())
    }
  })
})
