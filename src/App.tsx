import { useState } from 'react'
import { useGameStore } from './store/gameStore'
import { calcNetWorth } from './lib/networth'
import { formatVnd } from './lib/currency'
import { FINAL_CHECKLIST } from './data/teachingAids'
import { deriveEnding } from './data/endings'
import IntroScreen from './components/IntroScreen'
import Dashboard from './components/Dashboard'
import RoundResultModal from './components/RoundResultModal'
import QuickEventModal from './components/QuickEventModal'
import Leaderboard from './components/Leaderboard'

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
        <GameOverScreen onLeaderboard={() => setShowLeaderboard(true)} />
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

function GameOverScreen({ onLeaderboard }: { onLeaderboard: () => void }) {
  const {
    playerName,
    cash,
    c_fixed_book,
    c_circulating_stock,
    lending,
    debt,
    land_units,
    rent_per_unit,
    bank_interest_rate,
    initialCapital,
    history,
    eventLog,
    lectureMode,
    reset,
  } = useGameStore()
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const netWorth = Math.round(
    calcNetWorth({
      cash,
      c_fixed_book,
      c_circulating_stock,
      lending,
      debt,
      land_units,
      rent_per_unit,
      bank_interest_rate,
    }),
  )

  const totalSurplus = history.reduce((sum, entry) => sum + entry.result.m + entry.result.m_super, 0)
  const totalNetProfit = history.reduce((sum, entry) => sum + entry.result.net_profit, 0)
  const averageSurplusRate = history.length > 0
    ? history.reduce((sum, entry) => sum + entry.result.m_rate, 0) / history.length
    : 0
  const bestRound = history.reduce<typeof history[number] | null>((best, entry) => (
    !best || entry.result.net_profit > best.result.net_profit ? entry : best
  ), null)
  const finalOrganicComp = history.length > 0 ? history[history.length - 1].result.organic_comp : 0
  const ending = deriveEnding({
    initialCapital: Math.max(1, initialCapital),
    netWorth,
    debt,
    landUnits: land_units,
    eventCount: eventLog.length,
    rounds: history.map((entry) => ({
      alpha: entry.decisions.alpha,
      h: entry.decisions.h,
      invest_rnd: entry.decisions.invest_rnd,
      use_merchant: entry.decisions.use_merchant,
      m: entry.result.m,
      m_super: entry.result.m_super,
      net_profit: entry.result.net_profit,
      reinvestment: entry.result.reinvestment,
      organic_comp: entry.result.organic_comp,
      z_interest: entry.result.z_interest,
      rent_cost: entry.result.rent_cost,
      p_merchant: entry.result.p_merchant,
    })),
  })

  const overviewItems = [
    { label: 'Tổng giá trị thặng dư', value: formatVnd(totalSurplus, true) },
    { label: 'Tổng lợi nhuận ròng', value: formatVnd(totalNetProfit, true) },
    { label: "m' trung bình", value: `${(averageSurplusRate * 100).toFixed(1)}%` },
    { label: 'Event đã gặp', value: `${eventLog.length} tình huống` },
    { label: 'Vòng lời nhất', value: bestRound ? `Vòng ${bestRound.round}` : '—' },
    { label: 'c/v cuối kỳ', value: finalOrganicComp.toFixed(2) },
  ]

  const summaryConcepts = [
    "T–H–T' cho thấy tiền trở thành tư bản khi vận động để tạo giá trị thặng dư.",
    'c chỉ chuyển giá trị, v gắn với sức lao động sống tạo ra m.',
    "m' cho thấy mức độ tạo giá trị thặng dư; p' là hình thức lợi nhuận nhìn từ toàn bộ tư bản ứng trước.",
    'Lợi nhuận thương nghiệp, lợi tức và địa tô là các hình thức/phần phân chia từ giá trị thặng dư trong bài học.',
  ]

  const toggleChecklist = (item: string) => {
    setCheckedItems((items) => (
      items.includes(item) ? items.filter((current) => current !== item) : [...items, item]
    ))
  }

  const exportReport = () => {
    const report = {
      playerName,
      completedAt: new Date().toLocaleString('vi-VN'),
      mode: lectureMode ? 'giang-nhanh' : 'choi-chuan',
      netWorth: Math.round(netWorth),
      cash: Math.round(cash),
      fixedCapital: Math.round(c_fixed_book),
      circulatingCapital: Math.round(c_circulating_stock),
      overview: {
        totalSurplus: Math.round(totalSurplus),
        totalNetProfit: Math.round(totalNetProfit),
        averageSurplusRate,
        bestRound: bestRound?.round ?? null,
        finalOrganicComp,
      },
      ending,
      checklist: FINAL_CHECKLIST.map((item) => ({ item, done: checkedItems.includes(item) })),
      events: eventLog.map((event) => ({
        round: event.round,
        title: event.title,
        choice: event.choiceLabel,
        forcedByTeacher: Boolean(event.forcedByTeacher),
        teachingPoint: event.teachingPoint,
      })),
      rounds: history.map((entry) => ({
        round: entry.round,
        netProfit: Math.round(entry.result.net_profit),
        surplusValue: Math.round(entry.result.m),
        surplusRate: entry.result.m_rate,
        profitRate: entry.result.p_rate,
        organicComposition: entry.result.organic_comp,
        eventTitle: entry.event?.title ?? null,
      })),
    }
    downloadText(
      `cao-tu-mln-${playerName || 'bao-cao'}.json`,
      JSON.stringify(report, null, 2),
      'application/json;charset=utf-8',
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 py-10">
      <div className="text-center">
        <div className="text-6xl mb-4">🦊</div>
        <h1 className="text-4xl font-bold mb-2 text-amber-300">Kết thúc học phần!</h1>
        <p className="text-stone-300 text-lg">{playerName}</p>
        <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
          Bạn đã đi qua các khái niệm chính của Chương 3: giá trị thặng dư,
          tích lũy tư bản, lợi nhuận, lợi tức và địa tô.
        </p>
        {lectureMode && (
          <p className="chapter-badge mt-4 mx-auto">📌 Kết quả từ chế độ giảng nhanh</p>
        )}
      </div>

      <div className="theory-card rounded-2xl p-8 w-full max-w-md text-center">
        <div className="relative z-10">
          <p className="text-stone-400 text-sm mb-2">Tổng tài sản ròng</p>
          <p className={`text-5xl font-bold leading-tight break-words ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatVnd(netWorth)}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-stone-900/70 rounded-lg p-3">
              <p className="text-stone-400">Tiền mặt</p>
              <p className="text-stone-50 font-bold leading-tight break-words">{formatVnd(cash, true)}</p>
            </div>
            <div className="bg-stone-900/70 rounded-lg p-3">
              <p className="text-stone-400">Tư bản cố định</p>
              <p className="text-stone-50 font-bold leading-tight break-words">{formatVnd(c_fixed_book, true)}</p>
            </div>
          </div>
        </div>
      </div>


      <div className="theory-card rounded-2xl p-5 w-full max-w-2xl">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Kết cục mô phỏng</p>
          <h2 className="text-2xl font-black text-stone-50 mb-2">{ending.title}</h2>
          <p className="text-sm text-stone-300 leading-relaxed mb-4">{ending.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {ending.keySignals.map((signal) => (
              <div key={signal.label} className="rounded-lg bg-stone-950/45 border border-amber-900/25 p-3">
                <p className="text-[11px] text-stone-500">{signal.label}</p>
                <p className="text-sm font-bold text-amber-100 mt-1 leading-tight break-words">{signal.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-xl border border-amber-900/35 bg-stone-950/35 p-4">
            <p className="text-sm text-stone-300 leading-relaxed"><span className="font-bold text-amber-200">Vì sao ra kết cục này?</span> {ending.whyThisHappened}</p>
            <p className="text-sm text-stone-300 leading-relaxed"><span className="font-bold text-amber-200">Liên hệ giáo trình:</span> {ending.textbookConnection}</p>
            {ending.secondaryConsequences.length > 0 && (
              <p className="text-sm text-stone-300 leading-relaxed"><span className="font-bold text-amber-200">Hệ quả phụ:</span> {ending.secondaryConsequences.join('; ')}.</p>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Câu hỏi thảo luận</p>
            <div className="space-y-2">
              {ending.reflectionQuestions.map((question) => (
                <p key={question} className="text-sm text-stone-300 leading-relaxed">• {question}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 w-full max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-3">Tổng quan học phần</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {overviewItems.map((item) => (
            <div key={item.label} className="rounded-lg bg-stone-950/40 border border-amber-900/25 p-3">
              <p className="text-[11px] text-stone-500">{item.label}</p>
              <p className="text-sm font-bold text-stone-50 mt-1 leading-tight break-words">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {summaryConcepts.map((concept) => (
            <p key={concept} className="text-sm text-stone-300 leading-relaxed">• {concept}</p>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Checklist cuối bài</p>
        <div className="space-y-2">
          {FINAL_CHECKLIST.map((item) => (
            <label key={item} className="flex items-start gap-2 rounded-lg bg-stone-950/35 p-2 text-sm text-stone-300">
              <input
                type="checkbox"
                checked={checkedItems.includes(item)}
                onChange={() => toggleChecklist(item)}
                className="mt-1 accent-amber-500"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Câu hỏi ôn tập</p>
        <p className="text-sm text-stone-300 leading-relaxed">
          Sau 18 vòng, hãy chỉ ra phần nào của lợi nhuận ròng bắt nguồn từ m và phần nào được phân chia thành lợi tức, địa tô, lợi nhuận thương nghiệp.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <button onClick={onLeaderboard} className="px-6 py-3 bg-amber-700 hover:bg-amber-600 rounded-xl font-semibold transition-colors text-stone-50">
          🏆 Bảng xếp hạng
        </button>
        <button onClick={exportReport} className="px-6 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl font-semibold transition-colors text-stone-50">
          ⬇️ Xuất báo cáo
        </button>
        <button onClick={reset} className="px-6 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl font-semibold transition-colors text-stone-50">
          🔄 Chơi lại
        </button>
      </div>
    </div>
  )
}



