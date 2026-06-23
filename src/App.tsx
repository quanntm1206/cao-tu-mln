import { useGameStore } from './store/gameStore'
import { calcNetWorth } from './lib/networth'
import { formatVnd } from './lib/currency'
import IntroScreen from './components/IntroScreen'
import Dashboard from './components/Dashboard'
import RoundResultModal from './components/RoundResultModal'
import Leaderboard from './components/Leaderboard'
import { useState } from 'react'

export default function App() {
  const { started, gameOver, pendingLesson } = useGameStore()
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  if (!started) {
    return <IntroScreen onShowLeaderboard={() => setShowLeaderboard(true)} />
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {pendingLesson && <RoundResultModal />}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
      {gameOver ? (
        <GameOverScreen onLeaderboard={() => setShowLeaderboard(true)} />
      ) : (
        <Dashboard onLeaderboard={() => setShowLeaderboard(true)} />
      )}
    </div>
  )
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
    reset,
  } = useGameStore()
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🏭</div>
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">Kết thúc!</h1>
        <p className="text-gray-300 text-lg">{playerName}</p>
      </div>

      <div className="glass-card rounded-2xl p-8 w-full max-w-md text-center">
        <p className="text-gray-400 text-sm mb-2">Tổng tài sản ròng</p>
        <p className="text-5xl font-bold text-green-400">
          {formatVnd(netWorth)}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400">Tiền mặt</p>
            <p className="text-white font-bold">{formatVnd(cash, true)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400">Tư bản cố định</p>
            <p className="text-white font-bold">{formatVnd(c_fixed_book, true)}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onLeaderboard}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors"
        >
          🏆 Bảng xếp hạng
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
        >
          🔄 Chơi lại
        </button>
      </div>
    </div>
  )
}
