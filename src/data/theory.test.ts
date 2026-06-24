import { describe, expect, it } from 'vitest'
import { THEORY_LESSONS, THEORY_SECTIONS, getLessonForRound } from './theory'

const allText = THEORY_LESSONS.map((l) =>
  [l.title, l.concept, l.formula, l.symbolGuide, l.explanation, l.marxSource].filter(Boolean).join(' ')
).join('\n') + ' ' + THEORY_SECTIONS.map((s) =>
  [s.title, s.formula, s.explanation, s.keyPoints.join(' ')].join(' ')
).join('\n')

describe('theory lessons align with MLN122 chapter 3 tr.70-78', () => {
  it('has 16 lessons matching 16 rounds', () => {
    expect(THEORY_LESSONS.length).toBe(16)
    for (let r = 1; r <= 16; r++) {
      expect(getLessonForRound(r)).toBeDefined()
    }
  })

  it('has 5 sections matching textbook sections', () => {
    expect(THEORY_SECTIONS.length).toBe(5)
    const ids = THEORY_SECTIONS.map((s) => s.id)
    expect(ids).toContain('profit')
    expect(ids).toContain('average_profit')
    expect(ids).toContain('merchant_profit')
    expect(ids).toContain('interest')
    expect(ids).toContain('land_rent')
  })

  it('covers key concepts from tr.70-78', () => {
    const required = ["p'", 'Z', 'R', 'giá đất', 'lãi tức', 'địa tô', 'thương nghiệp', 'phân phối']
    for (const phrase of required) {
      expect(allText.toLowerCase()).toContain(phrase.toLowerCase())
    }
  })

  it('mentions Vietnam real data', () => {
    expect(allText.toLowerCase()).toContain('việt nam')
  })

  it('getLessonForRound falls back to last lesson for out-of-range', () => {
    const lesson = getLessonForRound(99)
    expect(lesson).toBeDefined()
    expect(lesson.round).toBe(16)
  })
})