import { describe, expect, it } from 'vitest'
import { THEORY_LESSONS } from './theory'

const allLessonText = THEORY_LESSONS.map((lesson) =>
  [lesson.title, lesson.concept, lesson.formula, lesson.explanation, lesson.marxSource]
    .filter(Boolean)
    .join(' '),
).join('\n')

describe('theory lessons align with MLN122 chapter 3 scope', () => {
  it('covers the missing textbook concepts explicitly', () => {
    const required = [
      'T–H–T\'',
      'hàng hóa sức lao động',
      'tiền công',
      'tái sản xuất giản đơn',
      'tái sản xuất mở rộng',
      'tích tụ',
      'tập trung tư bản',
      'giá đất',
      'lợi nhuận thương nghiệp',
      'lợi tức',
    ]

    for (const phrase of required) {
      expect(allLessonText.toLowerCase()).toContain(phrase.toLowerCase())
    }
  })

  it('does not introduce concepts beyond the chapter 3 teaching brief', () => {
    const forbidden = [
      'tư bản ảo',
      'chứng khoán',
      'khủng hoảng thanh khoản',
      'M&A',
      'sáp nhập',
      'quy luật xu hướng tỷ suất lợi nhuận',
      'Tư Bản, Quyển',
    ]

    for (const phrase of forbidden) {
      expect(allLessonText).not.toContain(phrase)
    }
  })
})
