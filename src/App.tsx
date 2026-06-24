import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import { formatVnd } from './lib/currency'
import { FINAL_CHECKLIST } from './data/teachingAids'
import { deriveEnding, type EndingInput } from './data/endings'
import IntroScreen from './components/IntroScreen'
import Dashboard from './components/Dashboard'
import RoundResultModal from './components/RoundResultModal'
import QuickEventModal from './components/QuickEventModal'
import Leaderboard from './components/Leaderboard'
import DistributionFlow from './components/DistributionFlow'

export default function App() {
  const { started, gameOver, pendingLesson, pendingQuickEvent } = useGameStore()
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  if (!started) {
    return <IntroScreen onShowLeaderboard={() => setShowLeaderboard(true)} />
  }

  return (
    <div className="min-h-screen">
      {pendingLesson && <RoundResultModal />}
      {pendingQuickEvent && <QuickEventModal />}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      {gameOver && !pendingLesson ? (
        <FinalScreen onLeaderboard={() => setShowLeaderboard(true)} />
      ) : !gameOver ? (
        <Dashboard onLeaderboard={() => setShowLeaderboard(true)} />
      ) : null}
    </div>
  )
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const SOURCES = [
  { label: 'Giao trinh KTCT Mac-Lenin (Bo GD)', url: 'https://saomaidata.vn/library/803.Giao-Trinh-Kinh-Te-Chinh-Tri-Mac-Lenin.aspx' },
  { label: 'Bao cao BDS DKRA 2024', url: 'https://dkra.vn/bao-cao-thi-truong' },
  { label: 'NHNN – Lai suat 2022-2024', url: 'https://sbv.gov.vn/webcenter/portal/vi/menu/trangchu/tk/ldnh' },
  { label: 'So TN&MT Bac Ninh – Dat KCN', url: 'https://baodautu.vn/bat-dong-san' },
  { label: 'Kinh te chinh tri Marx-Lenin (Wikipedia)', url: 'https://vi.wikipedia.org/wiki/Kinh_t%E1%BA%BF_ch%C3%ADnh_tr%E1%BB%8B_Marx%E2%80%93Lenin' },
]

const SURVEY_LABELS = ['Rat kho', 'Vua phai', 'De hieu']
const CONCEPT_LABELS = [
  'm = p + p_TN + Z + R',
  'Gia dat = R / i',
  'T – H – T\'',
]

function FinalScreen({ onLeaderboard }: { onLeaderboard: () => void }) {
  const {
    playerName, m_pool, startingM,
    industrial_profit, merchant_profit, interest_paid, interest_earned, rent_paid,
    history, eventLog, reset,
  } = useGameStore()

  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [surveyDifficulty, setSurveyDifficulty] = useState<number | null>(null)
  const [surveyConcept, setSurveyConcept] = useState<number | null>(null)
  const [surveyComment, setSurveyComment] = useState('')

  const endingInput: EndingInput = {
    industrial_profit, merchant_profit, interest_paid, interest_earned, rent_paid, m_pool,
  }
  const ending = deriveEnding(endingInput)
  const growth = startingM > 0 ? ((m_pool - startingM) / startingM * 100) : 0

  const toggleChecklist = (item: string) =>
    setCheckedItems((items) => items.includes(item) ? items.filter((i) => i !== item) : [...items, item])

  const exportReport = () => {
    const report = {
      playerName,
      completedAt: new Date().toLocaleString('vi-VN'),
      schema: 'phan-chia-gttt-v2',
      mPool: Math.round(m_pool),
      startingM: Math.round(startingM),
      distribution: {
        industrial_profit: Math.round(industrial_profit),
        merchant_profit: Math.round(merchant_profit),
        interest_paid: Math.round(interest_paid),
        interest_earned: Math.round(interest_earned),
        rent_paid: Math.round(rent_paid),
      },
      ending: { id: ending.endingId, title: ending.title },
      checklist: FINAL_CHECKLIST.map((item) => ({ item, done: checkedItems.includes(item) })),
      survey: { difficulty: surveyDifficulty, conceptClarity: surveyConcept, comment: surveyComment },
      events: eventLog.map((e) => ({ round: e.round, title: e.title, choice: e.choiceLabel })),
      rounds: history.map((entry) => ({
        round: entry.round,
        phase: entry.result.phase,
        lesson: entry.result.lesson.substring(0, 80),
      })),
    }
    downloadText(
      `phan-chia-gttt-${playerName || 'bao-cao'}.json`,
      JSON.stringify(report, null, 2),
      'application/json;charset=utf-8',
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-10">
      <div className="text-center">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-4xl font-bold mb-2 text-amber-300">Hoan thanh hoc phan!</h1>
        <p className="text-stone-300 text-lg">{playerName}</p>
        <p className="text-stone-500 text-sm mt-2 max-w-md mx-auto">
          Ban da hoan thanh 4 pha: san xuat CN, thuong nghiep, tai chinh, dat dai.
          Chu de: <span className="text-amber-300">m = p + LN TN + Z + R</span>
        </p>
      </div>

      {/* M-pool summary */}
      <div className="theory-card rounded-2xl p-6 w-full max-w-md text-center">
        <div className="relative z-10">
          <p className="text-stone-400 text-sm mb-2">M-pool cuoi</p>
          <p className={`text-4xl font-bold ${m_pool >= startingM ? 'text-green-400' : 'text-red-400'}`}>
            {formatVnd(m_pool)}
          </p>
          <p className="text-sm text-stone-400 mt-2">
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% so voi M ban dau
          </p>
        </div>
      </div>

      {/* DistributionFlow full width */}
      <div className="w-full max-w-2xl">
        <DistributionFlow />
      </div>

      {/* Ending */}
      <div className="theory-card rounded-2xl p-5 w-full max-w-2xl">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Ket cuc mo phong</p>
          <h2 className="text-2xl font-black text-stone-50 mb-2">{ending.title}</h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">{ending.summary}</p>
          <div className="space-y-3 rounded-xl border border-amber-900/35 bg-stone-950/35 p-4">
            <p className="text-sm text-stone-300 leading-relaxed">
              <span className="font-bold text-amber-200">Vi sao ket cuc nay?</span> {ending.whyThisHappened}
            </p>
            <p className="text-sm text-stone-300 leading-relaxed">
              <span className="font-bold text-amber-200">Lien he giao trinh:</span> {ending.textbookConnection}
            </p>
            {ending.secondaryConsequences.length > 0 && (
              <p className="text-sm text-stone-300">
                <span className="font-bold text-amber-200">Khia canh khac:</span> {ending.secondaryConsequences.join('; ')}
              </p>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Cau hoi thao luan</p>
            {ending.reflectionQuestions.map((q) => (
              <p key={q} className="text-sm text-stone-300 mb-1">• {q}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="glass-card rounded-xl p-4 w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Checklist cuoi bai</p>
        <div className="space-y-2">
          {FINAL_CHECKLIST.map((item) => (
            <label key={item} className="flex items-start gap-2 rounded-lg bg-stone-950/35 p-2 text-sm text-stone-300 cursor-pointer">
              <input type="checkbox" checked={checkedItems.includes(item)}
                onChange={() => toggleChecklist(item)} className="mt-1 accent-amber-500" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* MicroSurvey */}
      <div className="glass-card rounded-xl p-4 w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-3">Khao sat nhanh</p>
        <div className="mb-4">
          <p className="text-sm text-stone-300 mb-2">Do kho cua hoc phan:</p>
          <div className="flex gap-2">
            {SURVEY_LABELS.map((l, i) => (
              <button key={l} onClick={() => setSurveyDifficulty(i)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${surveyDifficulty === i ? 'bg-amber-700 text-stone-50' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-sm text-stone-300 mb-2">Khai niem ro nhat:</p>
          <div className="flex gap-2">
            {CONCEPT_LABELS.map((l, i) => (
              <button key={l} onClick={() => setSurveyConcept(i)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${surveyConcept === i ? 'bg-amber-700 text-stone-50' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <textarea value={surveyComment} onChange={(e) => setSurveyComment(e.target.value)}
          rows={2} placeholder="Gop y them (tuy chon)..."
          className="w-full rounded-lg bg-stone-900/70 border border-amber-900/30 text-stone-100 text-sm px-3 py-2 resize-none focus:outline-none" />
      </div>

      {/* Sources */}
      <div className="glass-card rounded-xl p-4 w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Tai lieu tham khao</p>
        <div className="space-y-2">
          {SOURCES.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-stone-300 hover:text-amber-300 transition-colors">
              <span className="text-stone-500">•</span> {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <button onClick={onLeaderboard} className="px-6 py-3 bg-amber-700 hover:bg-amber-600 rounded-xl font-semibold transition-colors text-stone-50">
          🏆 Bang xep hang
        </button>
        <button onClick={exportReport} className="px-6 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl font-semibold transition-colors text-stone-50">
          💾 Xuat bao cao JSON
        </button>
        <button onClick={reset} className="px-6 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl font-semibold transition-colors text-stone-50">
          🔄 Choi lai
        </button>
      </div>
    </div>
  )
}
