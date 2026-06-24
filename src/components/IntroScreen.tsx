import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import {
  CAPITAL_OPTIONS,
  DEFAULT_CAPITAL,
} from '../data/economyConstants'
import { getDifficultyForCapital } from '../data/difficulty'

interface Props {
  onShowLeaderboard: () => void
}

export default function IntroScreen({ onShowLeaderboard }: Props) {
  const [name, setName] = useState('')
  const [capital, setCapital] = useState(DEFAULT_CAPITAL)
  const startGame = useGameStore((s) => s.startGame)

  const handleStart = () => {
    if (!name.trim()) return
    startGame(name.trim(), capital)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[520px] bg-red-950/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] bg-amber-900/15 rounded-full blur-3xl" />
        <div className="absolute right-4 top-10 hidden lg:block text-[9rem] opacity-[0.035]">🏭</div>
        <div className="absolute left-6 bottom-16 hidden lg:block text-[8rem] opacity-[0.04]">📚</div>
      </div>

      <div className="relative z-10 text-center mb-8">
        <div className="chapter-badge mx-auto mb-4">📕 Chương 3 · Giá trị thặng dư</div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl drop-shadow-lg">🦊</span>
          <h1 className="text-5xl sm:text-6xl font-black dossier-title">
            Cáo Tử <span className="text-amber-300">MLN</span>
          </h1>
        </div>
        <p className="text-stone-300 text-lg max-w-xl mx-auto">
          Mô phỏng xưởng sản xuất để học giá trị thặng dư, tích lũy, lợi nhuận, lợi tức và địa tô.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['T–H–T’', 'G = c + v + m', "m’ = m/v", "p’ = m/(c+v)"].map((formula) => (
            <span key={formula} className="formula-chip">{formula}</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 theory-card rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-300 mb-2">Hồ sơ sản xuất</p>
          <h2 className="text-xl font-bold text-stone-50 mb-6">Bắt đầu vòng tuần hoàn tư bản</h2>

          <div className="mb-5">
            <label className="block text-sm text-stone-300 mb-2">Tên người chơi / nhóm học</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Nhóm Tư Bản A..."
              className="input-field w-full rounded-xl px-4 py-3 placeholder-stone-500 transition-colors"
            />
          </div>

          <div className="mb-7">
            <label className="block text-sm text-stone-300 mb-2">Vốn khởi đầu T</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CAPITAL_OPTIONS.map((opt) => {
                const profile = getDifficultyForCapital(opt.value)
                const hints: Record<string, string> = {
                  easy: 'P̄ thấp · lãi suất 3,5% · vốn nhiều hơn',
                  normal: 'Cân bằng · lãi suất 4%',
                  hard: 'P̄ cao · lãi suất 5% · vốn ít hơn',
                }
                return (
                <button
                  key={opt.value}
                  onClick={() => setCapital(opt.value)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border ${
                    capital === opt.value
                      ? 'bg-red-800/70 border-amber-400 text-amber-50 glow-red'
                      : 'bg-stone-950/35 border-stone-700/70 text-stone-400 hover:bg-stone-800/60 hover:text-stone-100'
                  }`}
                >
                  <span className="block">{opt.label}</span>
                  <span className="block text-[10px] mt-1 opacity-80 font-normal">
                    {hints[profile.id]}
                  </span>
                </button>
              )})}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className="btn-primary w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Mở xưởng sản xuất →
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {[
          { icon: '⚙️', title: '18 vòng học', desc: 'Mỗi vòng gắn với một ý chính của Chương 3' },
          { icon: '📚', title: 'Bám giáo trình', desc: 'Chỉ xoay quanh khái niệm Chương 3 trong giáo trình' },
          { icon: '🧾', title: 'Dạy bằng tình huống', desc: 'Có kết quả, công thức và câu hỏi thảo luận sau mỗi vòng' },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-sm font-semibold text-stone-50 mb-1">{item.title}</p>
            <p className="text-xs text-stone-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onShowLeaderboard}
        className="relative z-10 mt-6 text-stone-500 hover:text-amber-200 text-sm transition-colors underline"
      >
        Xem bảng xếp hạng
      </button>
    </div>
  )
}


