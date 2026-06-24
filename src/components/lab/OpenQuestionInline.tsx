import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { GamePhase } from '../../engine/distribution'
import { MessageSquareText } from 'lucide-react'

const QUESTIONS: Record<GamePhase, string> = {
  1: 'Sau 4 vòng sản xuất: Lợi nhuận xuất phát từ đâu? Tại sao ngành dệt/da có tỷ suất cao hơn cơ khí?',
  2: 'Thương nhân không sản xuất nhưng vẫn hưởng lợi nhuận — điều này được giải thích thế nào theo giáo trình?',
  3: 'Lãi tức là gì? Nó khác lợi nhuận sản xuất thế nào và từ đâu mà có?',
  4: 'Địa tô khác lãi tức và lợi nhuận thương nghiệp thế nào? Công thức Giá cả đất đai = R/Z′ cho thấy điều gì?',
}

interface Props { phase: GamePhase; accent: string }

export default function OpenQuestionInline({ phase, accent }: Props) {
  const { saveOpenAnswer, openAnswers } = useGameStore()
  const [draft, setDraft] = useState(openAnswers[phase] ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveOpenAnswer(phase, draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="lab-card-elevated p-5" style={{ borderColor: `${accent}55` }}>
      <div className="flex items-start gap-3 mb-3">
        <MessageSquareText className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} strokeWidth={2} />
        <div>
          <p className="lab-cite mb-1" style={{ color: accent }}>CÂU HỎI MỞ · KẾT THÚC PHA {phase}</p>
          <p className="text-sm text-[var(--color-lab-fg)] leading-relaxed">{QUESTIONS[phase]}</p>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        placeholder="Viết suy nghĩ của bạn…"
        className="lab-input w-full resize-none text-sm"
      />

      <button
        onClick={handleSave}
        className="lab-btn-ghost mt-2 w-full py-2 rounded-lg text-sm font-semibold"
      >
        {saved ? '✓ Đã lưu phản hồi' : 'Lưu câu trả lời'}
      </button>
    </div>
  )
}
