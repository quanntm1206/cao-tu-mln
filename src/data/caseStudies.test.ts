import { describe, it, expect } from 'vitest'
import { CASE_STUDIES, type CaseStudy } from './caseStudies'

describe('caseStudies', () => {
  it('exports exactly 8 case studies', () => {
    expect(CASE_STUDIES).toHaveLength(8)
  })

  it('contains all required case ids', () => {
    const ids = CASE_STUDIES.map((c) => c.id)
    expect(ids).toContain('hoai_duc_land')
    expect(ids).toContain('bac_ninh_speculation')
    expect(ids).toContain('merger_2025')
    expect(ids).toContain('tphcm_land')
    expect(ids).toContain('mwg_retail_war')
    expect(ids).toContain('fpt_retail_shift')
    expect(ids).toContain('bank_interest_rates')
    expect(ids).toContain('land_bubble_crash')
  })

  it('every case has a non-empty source', () => {
    for (const c of CASE_STUDIES) {
      expect(c.source.length).toBeGreaterThan(5)
    }
  })

  it('every case has a verifiedDate in YYYY-MM-DD format', () => {
    const isoDate = /^\d{4}-\d{2}-\d{2}$/
    for (const c of CASE_STUDIES) {
      expect(c.verifiedDate).toMatch(isoDate)
    }
  })

  it('every case has a phase between 1 and 4', () => {
    for (const c of CASE_STUDIES) {
      expect(c.phase).toBeGreaterThanOrEqual(1)
      expect(c.phase).toBeLessThanOrEqual(4)
    }
  })

  it('every case has at least one data point', () => {
    for (const c of CASE_STUDIES) {
      expect(c.dataPoints.length).toBeGreaterThanOrEqual(1)
    }
  })

  it('every case has a relatedFormula and sourceUrl', () => {
    for (const c of CASE_STUDIES) {
      expect(c.relatedFormula.length).toBeGreaterThan(5)
      expect(c.sourceUrl).toMatch(/^https?:\/\//)
    }
  })

  it('phase 4 cases include land-related cases', () => {
    const phase4 = CASE_STUDIES.filter((c) => c.phase === 4)
    expect(phase4.length).toBeGreaterThanOrEqual(3)
  })

  it('phase 3 cases include finance-related cases', () => {
    const phase3 = CASE_STUDIES.filter((c) => c.phase === 3)
    expect(phase3.length).toBeGreaterThanOrEqual(1)
  })

  it('satisfies CaseStudy type shape', () => {
    const first: CaseStudy = CASE_STUDIES[0]
    expect(typeof first.id).toBe('string')
    expect(typeof first.title).toBe('string')
    expect(typeof first.summary).toBe('string')
    expect(Array.isArray(first.dataPoints)).toBe(true)
  })
})