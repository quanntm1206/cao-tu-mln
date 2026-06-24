import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { GamePhase } from '../../engine/distribution'
import { MessageSquareText, ArrowRight } from 'lucide-react'

const QUESTIONS: Record<GamePhase, string> = {
  1: 'Sau 4 vòng sản xuất: Lợi nhuận xuất phát từ đâu? Tại sao ngành dệt/da có tỷ suất cao hơn cơ khí?',
  2: 'Thương nhân không sản xuất nhưng vẫn hưởng lợi nhuận — điều này được giải thích thế nào theo giáo trình?',
  3: 'Lãi tức là gì? Nó khác lợi nhuận sản xuất thế nào và từ đâu mà có?',
  4: 'Địa tô khác lãi tức và lợi nhuận thương nghiệp thế nào? Công thức Giá cả đất đai = Địa tô / Tỷ suất lợi tức ngân hàng cho thấy điều gì?',
}

const ADVANCE_LABELS: Record<GamePhase, string> = {
  1: 'Tiếp tục Pha 2',
  2: 'Tiếp tục Pha 3',
  3: 'Tiếp tục Pha 4',
  4: 'Xem tổng kết',
}

interface Props { phase: GamePhase; accent: string; onPhaseAdvance: () => void }

export default function OpenQuestionInline({ phase, accent, onPhaseAdvance }: Props) {
  const { saveOpenAnswer, openAnswers } = useGameStore()
  const [draft, setDraft] = useState(openAnswers[phase] ?? '')
  const [saved, setSaved] = useState(!!openAnswers[phase]?.trim())
  const trimmed = draft.trim()
  const canSave = trimmed.length > 0

  const handleSave = () => {
    if (!canSave) return
    saveOpenAnswer(phase, trimmed)
    setSaved(true)
  }

  return (
    <div className="lab-card-elevated p-5" data-testid="open-question-inline" style={{ borderColor: `${accent}55` }}>
      <div className="flex items-start gap-3 mb-3">
        <MessageSquareText className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} strokeWidth={2} />
        <div>
          <p className="lab-cite mb-1" style={{ color: accent }}>CÂU HỎI MỞ · KẾT THÚC PHA {phase}</p>
          <p className="text-sm text-[var(--color-lab-fg)] leading-relaxed">{QUESTIONS[phase]}</p>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(e) => { setDraft(e.target.value); setSaved(false) }}
        rows={3}
        placeholder="Viết suy nghĩ của bạn…"
        className="lab-input w-full resize-none text-sm"
      />

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="lab-btn-ghost mt-2 w-full py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid="open-question-save"
      >
        {saved ? '✓ Đã lưu phản hồi' : 'Lưu câu trả lời'}
      </button>
      {!canSave && (
        <p className="text-xs text-[var(--color-lab-fg-dim)] mt-2" data-testid="open-question-hint">
          Nhập câu trả lời để tiếp tục
        </p>
      )}

      {saved && (
        <button
          onClick={onPhaseAdvance}
          className="lab-btn-primary mt-2 w-full py-3 rounded-lg text-sm font-display font-semibold flex items-center justify-center gap-2"
          data-testid="open-question-advance"
        >
          {ADVANCE_LABELS[phase]}
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}

      <button
        onClick={onPhaseAdvance}
        className="lab-btn-ghost mt-1 w-full py-2 rounded-lg text-sm text-[var(--color-lab-fg-dim)]"
        data-testid="open-question-skip"
      >
        Bỏ qua
      </button>
    </div>
  )
}
