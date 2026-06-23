import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { formatVnd } from '../lib/currency'
import MetricsPanel from './MetricsPanel'
import DecisionPanel from './DecisionPanel'
import Charts from './Charts'

type Tab = 'decisions' | 'charts' | 'metrics'

interface Props {
  onLeaderboard: () => void
}

export default function Dashboard({ onLeaderboard }: Props) {
  const { playerName, round, maxRounds, cash, reset } = useGameStore()
  const [tab, setTab] = useState<Tab>('decisions')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const progress = ((round - 1) / maxRounds) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-card border-b border-gray-800 px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏭</span>
          <span className="font-black text-lg hidden sm:block">
            <span className="text-white">Cap</span>
            <span className="text-blue-400">Accumulate</span>
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-300 truncate">{playerName}</span>
            <span className="text-xs text-gray-500">
              Vòng {round}/{maxRounds}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">Tiền mặt</p>
          <p className="text-sm font-bold text-green-400">{formatVnd(cash, true)}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onLeaderboard}
            className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors"
            title="Bảng xếp hạng"
          >
            🏆
          </button>
          <button
            onClick={() => {
              if (confirm('Bạn có chắc muốn bắt đầu lại?')) reset()
            }}
            className="text-gray-500 hover:text-gray-300 text-xl transition-colors"
            title="Bắt đầu lại"
          >
            🔄
          </button>
        </div>
      </header>

      {!isDesktop && (
        <div className="flex border-b border-gray-800 bg-gray-900/50">
          {(['decisions', 'metrics', 'charts'] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = {
              decisions: '⚙️ Quyết định',
              metrics: '📊 Chỉ số',
              charts: '📈 Biểu đồ',
            }
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  tab === t ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
                }`}
              >
                {labels[t]}
              </button>
            )
          })}
        </div>
      )}

      <main className="flex-1 p-4 lg:p-6">
        {isDesktop ? (
          <div className="grid grid-cols-[280px_1fr_320px] gap-6 max-w-7xl mx-auto">
            <MetricsPanel />
            <Charts />
            <DecisionPanel />
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {tab === 'decisions' && <DecisionPanel />}
            {tab === 'metrics' && <MetricsPanel />}
            {tab === 'charts' && <Charts />}
          </div>
        )}
      </main>
    </div>
  )
}
