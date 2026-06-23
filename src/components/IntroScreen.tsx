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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1e] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl">🦊</span>
          <h1 className="text-5xl font-black tracking-tight">
            <span className="text-white">Cáo Tử</span>
            <span className="text-blue-400"> MLN</span>
          </h1>
        </div>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Game học Chương 3 Kinh tế chính trị Mác–Lênin
        </p>
        <p className="text-gray-500 text-sm mt-2">Mô phỏng Chương 3 KTCT Mác–Lênin · mỗi vòng = 1 quý</p>
      </div>

      <div className="relative z-10 glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Bắt đầu hành trình tư bản</h2>

        <div className="mb-5">
          <label className="block text-sm text-gray-400 mb-2">Tên nhà tư bản của bạn</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Nguyễn Tư Bản..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="mb-7">
          <label className="block text-sm text-gray-400 mb-2">Vốn khởi đầu T</label>
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
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                  capital === opt.value
                    ? 'bg-blue-600 text-white glow-blue'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
          className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
        >
          Bắt đầu sản xuất →
        </button>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          { icon: '⚙️', title: '18 vòng lý thuyết', desc: 'Mỗi vòng minh họa một ý trong Chương 3' },
          { icon: '📚', title: 'Bám giáo trình', desc: 'Tập trung giá trị thặng dư và các hình thức biểu hiện' },
          { icon: '🏆', title: 'Tổng kết', desc: 'So sánh kết quả tích lũy sau khi hoàn thành học phần' },
        ].map((item) => (
          <div key={item.title} className="glass-card rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onShowLeaderboard}
        className="relative z-10 mt-6 text-gray-500 hover:text-gray-300 text-sm transition-colors underline"
      >
        Xem bảng xếp hạng
      </button>
    </div>
  )
}
