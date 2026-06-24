import { useGameStore } from '../store/gameStore'
import { getLessonForRound } from '../data/theory'
import { getTeachingAidForRound } from '../data/teachingAids'
import { formatVnd } from '../lib/currency'
import SurplusFlow from './SurplusFlow'

export default function RoundResultModal() {
  const {
    round,
    lastResult,
    lastEvent,
    dismissLesson,
    unlockedFeatures,
    history,
    gameOver,
  } = useGameStore()
  const prevRound = round - 1
  const lesson = getLessonForRound(prevRound)
  const teachingAid = getTeachingAidForRound(prevRound)
  const surplusRevealed = unlockedFeatures.includes('surplus_reveal')

  if (!lastResult) {
    dismissLesson()
    return null
  }

  const fmt = (n: number) => formatVnd(n, true)
  const fmtPct = (n: number) => (n * 100).toFixed(1) + '%'
  const continueLabel = gameOver ? 'Xem tổng kết 18 vòng →' : `Tiếp tục vòng ${round} →`

  return (
    <div className="fixed inset-0 z-50 modal-backdrop bg-black/70 overflow-y-auto p-3 sm:p-4">
      <div className="theory-card rounded-2xl w-full max-w-2xl mx-auto shadow-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-hidden flex flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 pb-4" data-testid="round-result-scroll-area">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <p className="text-xs text-stone-400">Kết thúc vòng</p>
              <h2 className="text-2xl font-bold text-stone-50">Vòng {prevRound}</h2>
            </div>
            <div className={`text-left sm:text-right ${lastResult.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <p className="text-xs text-stone-400">Lợi nhuận ròng</p>
              <p className="text-2xl font-bold">{fmt(lastResult.net_profit)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              {
                label: surplusRevealed ? "m' (GTTT)" : 'Tỷ suất LN',
                value: surplusRevealed ? fmtPct(lastResult.m_rate) : fmtPct(lastResult.p_rate),
                color: 'text-green-400',
              },
              {
                label: surplusRevealed ? "p' (LN)" : 'LN / vốn',
                value: fmtPct(lastResult.p_rate),
                color: 'text-amber-300',
              },
              {
                label: 'Tái đầu tư',
                value: fmt(lastResult.reinvestment),
                color: 'text-amber-300',
              },
            ].map((item) => (
              <div key={item.label} className="bg-stone-900/60 rounded-xl p-3 text-center">
                <p className="text-xs text-stone-400 mb-1">{item.label}</p>
                <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-5">
            <SurplusFlow result={lastResult} surplusRevealed={surplusRevealed} />
            <div className="space-y-4">
              <div className="bg-stone-950/45 border border-amber-800/40 rounded-xl p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Câu hỏi thảo luận</p>
                <p className="text-sm text-stone-50 leading-relaxed">{teachingAid.discussionQuestion}</p>
                <p className="text-xs text-stone-400 mt-2">Gợi ý quan sát: {teachingAid.focusMetric}</p>
              </div>

              {lastEvent && (
                <div className="bg-amber-950/35 border border-amber-700/40 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⚡</span>
                    <h3 className="text-sm font-bold text-amber-300">Tình huống vòng này: {lastEvent.title}</h3>
                  </div>
                  <p className="text-sm text-stone-300 mb-2"><span className="font-semibold text-stone-50">Bạn chọn:</span> {lastEvent.choiceLabel}</p>
                  <p className="text-sm text-stone-300 leading-relaxed mb-2">{lastEvent.resultText}</p>
                  <p className="text-xs text-amber-200 leading-relaxed"><span className="font-bold">Liên hệ giáo trình:</span> {lastEvent.teachingPoint}</p>
                </div>
              )}
            </div>
          </div>

          {lesson && (
            <div className="mt-5 bg-stone-950/45 border border-amber-800/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📚</span>
                <h3 className="text-sm font-bold text-amber-300">{lesson.title}</h3>
              </div>
              {lesson.formula && <p className="formula-chip mb-3 inline-block">{lesson.formula}</p>}
              <p className="text-sm text-stone-300 leading-relaxed">{lesson.explanation}</p>
              {lesson.marxSource && <p className="text-xs text-stone-500 mt-2 italic">— {lesson.marxSource}</p>}
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
              <div className="mt-4 bg-red-950/35 border border-amber-800/40 rounded-xl p-3 flex items-center gap-2">
                <span className="text-xl">🔓</span>
                <p className="text-sm text-amber-200 font-medium">{msg}</p>
              </div>
            )
          })()}
        </div>

        <div className="shrink-0 border-t border-amber-900/35 bg-[#1a100c]/95 p-4 shadow-[0_-18px_35px_rgba(0,0,0,0.28)]" data-testid="round-result-footer">
          <button onClick={dismissLesson} className="w-full py-3 rounded-xl font-bold text-stone-50 transition-all btn-primary">
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

