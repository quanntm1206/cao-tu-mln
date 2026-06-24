import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const APP_VERSION = 'v0.2.1'

interface Props { onShowLeaderboard: () => void }

const PHASES = [
  { n: 1, icon: '🏭', label: 'Sản xuất Công nghiệp', desc: "Phân bổ M-pool cho cơ khí, dệt may, da giày. Học p' và lý thuyết lợi nhuận." },
  { n: 2, icon: '🏪', label: 'Thương nghiệp', desc: 'Quyết định dùng kênh thương nhân. Khám phá lợi nhuận TN từ GTTT.' },
  { n: 3, icon: '🏦', label: 'Tư bản Tài chính', desc: 'Vay hoặc cho vay vốn. Hiểu lãi tức Z là phần phối từ m.' },
  { n: 4, icon: '🏗️', label: 'Đất đai & Địa tô', desc: 'Mua / thuê / đầu cơ đất. Thấy giá đất = R / i trong thực tế VN.' },
]

export default function IntroScreen({ onShowLeaderboard }: Props) {
  const [name, setName] = useState('')
  const startGame = useGameStore((s) => s.startGame)

  const handleStart = () => {
    if (!name.trim()) return
    startGame(name.trim())
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[520px] bg-red-950/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] bg-amber-900/15 rounded-full blur-3xl" />
      </div>

      <p className="text-[10px] text-stone-500 mb-2 text-center relative z-10">{APP_VERSION} · Cập nhật 24/06/2026</p>
      <div className="relative z-10 text-center mb-8">
        <div className="chapter-badge mx-auto mb-4">📖 Chương 3 - Phân chia GTTT</div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-5xl drop-shadow-lg">⚙️</span>
          <h1 className="text-5xl sm:text-6xl font-black dossier-title">
            Phân chia <span className="text-amber-300">GTTT</span>
          </h1>
        </div>
        <p className="text-stone-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Mô phỏng phân chia giá trị thặng dư và tiền đẻ ra tiền: <br />
          <span className="text-amber-300 font-semibold">m = p + LN thương nghiệp + Z + R</span>
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["T-H-T'", "p' = m/(c+v)", 'Z = lãi tức', 'R = địa tô', 'Giá đất = R/i'].map((f) => (
            <span key={f} className="formula-chip">{f}</span>
          ))}
        </div>
      </div>

      {/* 4 phases overview */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-8">
        {PHASES.map((ph) => (
          <div key={ph.n} className="glass-card rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">{ph.icon}</p>
            <p className="text-xs font-bold text-amber-300">Pha {ph.n}</p>
            <p className="text-xs font-semibold text-stone-200 mb-1">{ph.label}</p>
            <p className="text-[10px] text-stone-500 leading-relaxed">{ph.desc}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 theory-card rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-stone-50 mb-5">Bắt đầu học phần</h2>

          <div className="mb-4">
            <label className="block text-sm text-stone-300 mb-1">Tên học viên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="Nhập tên của bạn..."
              className="w-full rounded-xl bg-stone-900/70 border border-amber-900/30 text-stone-100 px-4 py-3 focus:outline-none focus:border-amber-600/60"
            />
          </div>

          <p className="text-xs text-stone-500 mb-5">
            16 vòng, 4 pha x 4 vòng. Giáo trình KTCT Mác-Lênin, Chương 3, tr. 70-78.
          </p>

          <button
            onClick={handleStart}
            disabled={!name.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${name.trim() ? 'btn-action' : 'bg-stone-900 text-stone-500 cursor-not-allowed'}`}
          >
            Bắt đầu 4 pha học tập
          </button>

          <button
            onClick={onShowLeaderboard}
            className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm bg-stone-800/70 text-stone-300 hover:bg-stone-700 transition-colors"
          >
            🏆 Xem bảng xếp hạng
          </button>
        </div>
      </div>
    </div>
  )
}