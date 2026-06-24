import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { GamePhase } from '../engine/distribution'

const PHASE_QUESTIONS: Record<GamePhase, string> = {
  1: 'Sau 4 vòng sản xuất công nghiệp: Lợi nhuận xuất phát từ đâu? Tại sao ngành dệt/da có tỷ suất cao hơn cơ khí?',
  2: 'Thương nhân không sản xuất nhưng vẫn hưởng lợi nhuận - điều này được giải thích thế nào theo giáo trình?',
  3: 'Lãi tức là gì? Nó khác lợi nhuận sản xuất như thế nào và từ đâu mà có?',
  4: 'Địa tô khác lãi tức và lợi nhuận thương nghiệp thế nào? Công thức giá đất = R/i cho thấy điều gì?',
}

interface Props {
  phase: GamePhase
}

export default function OpenQuestionCard({ phase }: Props) {
  const { saveOpenAnswer, openAnswers } = useGameStore()
  const [draft, setDraft] = useState(openAnswers[phase] ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveOpenAnswer(phase, draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="theory-card rounded-xl p-4 mt-4">
      <p className="text-xs uppercase tracking-wider text-amber-300 mb-2">Câu hỏi mở - Pha {phase}</p>
      <p className="text-sm text-stone-200 leading-relaxed mb-3">{PHASE_QUESTIONS[phase]}</p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        placeholder="Viết suy nghĩ của bạn..."
        className="w-full rounded-lg bg-stone-900/70 border border-amber-900/30 text-stone-100 text-sm px-3 py-2 resize-none focus:outline-none focus:border-amber-600/60"
      />
      <button
        onClick={handleSave}
        className="mt-2 w-full py-2 rounded-lg text-sm font-semibold bg-amber-700 hover:bg-amber-600 text-stone-50 transition-colors"
      >
        {saved ? 'Đã lưu!' : 'Lưu câu trả lời'}
      </button>
    </div>
  )
}