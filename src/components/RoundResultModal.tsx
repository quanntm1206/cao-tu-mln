import { useGameStore } from '../store/gameStore'
import { getLessonForRound } from '../data/theory'
import { formatVnd } from '../lib/currency'
import SurplusFlow from './SurplusFlow'

export default function RoundResultModal() {
  const {
    round,
    lastResult,
    dismissLesson,
    unlockedFeatures,
    history,
    gameOver,
  } = useGameStore()
  const prevRound = round - 1
  const lesson = getLessonForRound(prevRound)
  const surplusRevealed = unlockedFeatures.includes('surplus_reveal')

  if (!lastResult) {
    dismissLesson()
    return null
  }

  const fmt = (n: number) => formatVnd(n, true)
  const fmtPct = (n: number) => (n * 100).toFixed(1) + '%'
  const continueLabel = gameOver
      ? 'Xem tổng kết 18 vòng →'
      : `Tiếp tục vòng ${round} →`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/70">
      <div className="glass-card rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl border border-blue-900/40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400">Kết thúc vòng</p>
            <h2 className="text-2xl font-bold text-white">Vòng {prevRound}</h2>
          </div>
          <div className={`text-right ${lastResult.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <p className="text-xs text-gray-400">Lợi nhuận ròng</p>
            <p className="text-2xl font-bold">{fmt(lastResult.net_profit)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: surplusRevealed ? "m' (GTTT)" : "Tỷ suất LN",
              value: surplusRevealed ? fmtPct(lastResult.m_rate) : fmtPct(lastResult.p_rate),
              color: 'text-green-400',
            },
            {
              label: surplusRevealed ? "p' (LN)" : 'LN / vốn',
              value: fmtPct(lastResult.p_rate),
              color: 'text-blue-400',
            },
            {
              label: 'Tái đầu tư',
              value: fmt(lastResult.reinvestment),
              color: 'text-yellow-400',
            },
          ].map((item) => (
            <div key={item.label} className="bg-gray-800/60 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">{item.label}</p>
              <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <SurplusFlow result={lastResult} surplusRevealed={surplusRevealed} />

        {lesson && (
          <div className="mt-5 bg-blue-950/40 border border-blue-800/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📚</span>
              <h3 className="text-sm font-bold text-blue-300">{lesson.title}</h3>
            </div>
            {lesson.formula && (
              <p className="text-xs font-mono text-yellow-300 bg-gray-900/60 rounded-lg px-3 py-1.5 mb-3 inline-block">
                {lesson.formula}
              </p>
            )}
            <p className="text-sm text-gray-300 leading-relaxed">{lesson.explanation}</p>
            {lesson.marxSource && (
              <p className="text-xs text-gray-500 mt-2 italic">— {lesson.marxSource}</p>
            )}
          </div>
        )}

        {history.length > 0 && (() => {
          const newFeatureRounds: Record<number, string> = {
            3: '🏗️ Đầu tư máy móc đã mở khóa!',
            5: '🔬 Tăng năng suất lao động đã mở khóa!',
            7: '🚚 Chu chuyển & thương nghiệp đã mở khóa!',
            9: '🏦 Lợi tức đã mở khóa!',
            11: '🌾 Đất đai & Địa tô đã mở khóa!',
            13: '📊 Tất cả chỉ số GTTT đã hiển thị!',
          }
          const msg = newFeatureRounds[round]
          if (!msg) return null
          return (
            <div className="mt-4 bg-purple-950/40 border border-purple-700/40 rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">🔓</span>
              <p className="text-sm text-purple-300 font-medium">{msg}</p>
            </div>
          )
        })()}

        <button
          onClick={dismissLesson}
          className="w-full mt-5 py-3 rounded-xl font-bold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}
