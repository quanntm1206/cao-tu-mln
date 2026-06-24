import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { GamePhase } from '../engine/distribution'

const PHASE_QUESTIONS: Record<GamePhase, string> = {
  1: 'Sau 4 vong san xuat cong nghiep: Loi nhuan xuat phat tu dau? Tai sao nganh det/da co ty suat cao hon co khi?',
  2: 'Thuong nhan khong san xuat nhung van huong loi nhuan – dieu nay duoc giai thich the nao theo giao trinh?',
  3: 'Lai tuc la gi? No khac loi nhuan san xuat nhu the nao va tu dau ma co?',
  4: 'Dia to khac lai tuc va loi nhuan thuong nghiep the nao? Cong thuc gia dat = R/i cho thay dieu gi?',
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
      <p className="text-xs uppercase tracking-wider text-amber-300 mb-2">Cau hoi mo – Pha {phase}</p>
      <p className="text-sm text-stone-200 leading-relaxed mb-3">{PHASE_QUESTIONS[phase]}</p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        placeholder="Viet suy nghi cua ban..."
        className="w-full rounded-lg bg-stone-900/70 border border-amber-900/30 text-stone-100 text-sm px-3 py-2 resize-none focus:outline-none focus:border-amber-600/60"
      />
      <button
        onClick={handleSave}
        className="mt-2 w-full py-2 rounded-lg text-sm font-semibold bg-amber-700 hover:bg-amber-600 text-stone-50 transition-colors"
      >
        {saved ? 'Da luu!' : 'Luu cau tra loi'}
      </button>
    </div>
  )
}
