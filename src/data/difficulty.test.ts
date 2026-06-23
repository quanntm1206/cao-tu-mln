import { describe, it, expect } from 'vitest'
import { getDifficultyForCapital } from '../data/difficulty'

describe('getDifficultyForCapital', () => {
  it('maps 5B to easy', () => {
    expect(getDifficultyForCapital(5_000_000_000).id).toBe('easy')
  })

  it('maps 3B to normal', () => {
    expect(getDifficultyForCapital(3_000_000_000).id).toBe('normal')
  })

  it('maps 1.5B to hard', () => {
    expect(getDifficultyForCapital(1_500_000_000).id).toBe('hard')
  })
})
