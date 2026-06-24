import { useGameStore } from '../store/gameStore'
import { getLessonForRound } from '../data/theory'
import { getTeachingAidForRound } from '../data/teachingAids'
import { formatVnd } from '../lib/currency'
import SurplusFlow from './SurplusFlow'

const UNLOCK_EXPLANATIONS: Record<number, {
  icon: string
  title: string
  summary: string
  formula?: string
  teachingPoint: string
}> = {
  3: {
    icon: '🏗️',
    title: 'Mở khóa: Tư bản cố định và nguyên vật liệu',
    summary: 'Từ vòng này, bạn có thể đầu tư máy móc và mua thêm nguyên liệu để thấy rõ bộ phận tư bản bất biến c.',
    formula: 'G = c + v + m',
    teachingPoint: 'Máy móc và nguyên liệu không tự tạo ra giá trị thặng dư; chúng chuyển giá trị vào sản phẩm. Nguồn m vẫn gắn với lao động sống.',
  },
  5: {
    icon: '🔬',
    title: 'Mở khóa: Tăng năng suất lao động',
    summary: 'Bạn có thể chi cải tiến năng suất để làm giảm t_n, tức thời gian lao động tất yếu.',
    formula: "m' = m / v",
    teachingPoint: 'Khi t_n giảm trong cùng ngày lao động, phần lao động thặng dư tăng lên. Đây là cách minh họa giá trị thặng dư tương đối.',
  },
  7: {
    icon: '🚚',
    title: 'Mở khóa: Thời gian lưu thông và thương nghiệp',
    summary: 'Bạn có thể rút ngắn lưu thông hoặc dùng kênh thương nghiệp để thấy chu chuyển tư bản.',
    formula: 'n = CH / ch',
    teachingPoint: 'Rút ngắn thời gian lưu thông làm tăng số vòng chu chuyển. Lợi nhuận thương nghiệp là một phần giá trị thặng dư được phân chia.',
  },
  9: {
    icon: '🏦',
    title: 'Mở khóa: Lợi tức',
    summary: 'Bạn có thể vay thêm hoặc cho vay ra để quan sát quan hệ giữa lợi nhuận và lợi tức.',
    formula: 'z = tư bản cho vay × lãi suất',
    teachingPoint: 'Lợi tức không phải nguồn giá trị thặng dư độc lập; nó là phần lợi nhuận chuyển cho chủ sở hữu tư bản cho vay.',
  },
  11: {
    icon: '🌾',
    title: 'Mở khóa: Đất đai và địa tô',
    summary: 'Bạn có thể thuê hoặc mua đất để quan sát địa tô và giá đất trong mô hình.',
    formula: 'Giá đất = R / i',
    teachingPoint: 'Địa tô là phần giá trị thặng dư chuyển cho chủ sở hữu đất; giá đất được hiểu như địa tô tư bản hóa.',
  },
  13: {
    icon: '📊',
    title: 'Mở khóa: Toàn bộ chỉ số giá trị thặng dư',
    summary: "Game hiển thị đầy đủ m, m', p', c/v để tổng hợp các khái niệm Chương 3.",
    formula: "m' = m / v; p' = m / (c + v)",
    teachingPoint: "m' đo mức độ giá trị thặng dư so với tư bản khả biến; p' nhìn cùng phần m dưới hình thức lợi nhuận so với toàn bộ tư bản ứng trước.",
  },
}
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
              {(lesson.symbolGuide || lesson.formulaPurpose) && (
                <div className="mb-3 grid gap-2 rounded-xl border border-amber-900/35 bg-stone-950/45 p-3 text-xs leading-relaxed text-stone-300">
                  {lesson.symbolGuide && (
                    <p><span className="font-bold text-amber-200">Ký hiệu nghĩa là gì?</span> {lesson.symbolGuide}</p>
                  )}
                  {lesson.formulaPurpose && (
                    <p><span className="font-bold text-amber-200">Công thức để làm gì?</span> {lesson.formulaPurpose}</p>
                  )}
                </div>
              )}
              <p className="text-sm text-stone-300 leading-relaxed">{lesson.explanation}</p>
              {lesson.marxSource && <p className="text-xs text-stone-500 mt-2 italic">— {lesson.marxSource}</p>}
            </div>
          )}

          {history.length > 0 && (() => {
            const unlock = UNLOCK_EXPLANATIONS[round]
            if (!unlock) return null
            return (
              <div className="mt-5 rounded-2xl border border-amber-500/55 bg-gradient-to-br from-amber-950/55 via-red-950/35 to-stone-950/70 p-4 shadow-xl" role="dialog" aria-label={unlock.title}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-2xl">
                    {unlock.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Cửa sổ mở khóa</p>
                    <h3 className="mt-1 text-lg font-black text-amber-100">{unlock.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-200">{unlock.summary}</p>
                    {unlock.formula && <p className="formula-chip mt-3 inline-block">{unlock.formula}</p>}
                    <p className="mt-3 text-xs leading-relaxed text-amber-100">
                      <span className="font-bold">Ý nghĩa giáo trình:</span> {unlock.teachingPoint}
                    </p>
                  </div>
                </div>
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




