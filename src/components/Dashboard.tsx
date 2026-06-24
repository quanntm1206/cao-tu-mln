import { Suspense, lazy, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { formatVnd } from '../lib/currency'
import MetricsPanel from './MetricsPanel'
import DecisionPanel from './DecisionPanel'
import TeachingFocus from './TeachingFocus'
import EventLogPanel from './EventLogPanel'
import TeacherTools from './TeacherTools'
import DistributionFlow from './DistributionFlow'
const Charts = lazy(() => import('./Charts'))

type Tab = 'decisions' | 'charts' | 'metrics'

interface Props { onLeaderboard: () => void }

const chartFallback = <div className="glass-card rounded-xl p-6 text-sm text-stone-400">Dang tai bieu do…</div>

export default function Dashboard({ onLeaderboard }: Props) {
  const { playerName, round, maxRounds, m_pool, phase, reset } = useGameStore()
  const [tab, setTab] = useState<Tab>('decisions')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showTeacherPanel, setShowTeacherPanel] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const progress = ((round - 1) / maxRounds) * 100

  const phaseColors = ['from-blue-700', 'from-amber-700', 'from-red-700', 'from-orange-700']
  const phaseColor = phaseColors[(phase - 1)] ?? 'from-blue-700'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-card border-b border-amber-900/30 px-3 sm:px-4 py-3 flex flex-wrap sm:flex-nowrap items-center gap-3 lg:sticky lg:top-0 z-10">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">📚</span>
          <span className="font-black text-sm sm:text-lg leading-none whitespace-nowrap">
            <span className="text-stone-50">Phan chia</span>
            <span className="text-amber-300"> GTTT</span>
          </span>
        </div>

        <div className="order-3 sm:order-none basis-full sm:basis-auto flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 overflow-hidden">
            <span className="text-sm text-stone-300 truncate hidden sm:inline">{playerName}</span>
            <span className="text-xs text-amber-400 shrink-0 font-semibold">Pha {phase}/4</span>
            <span className="text-xs text-stone-500 shrink-0">Vong {round}/{maxRounds}</span>
          </div>
          <div className="w-full bg-stone-800 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${phaseColor} to-green-700 transition-all`}
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="ml-auto text-right shrink-0">
          <p className="text-xs text-stone-400 hidden sm:block">M-pool</p>
          <p className="text-sm font-bold text-emerald-300 whitespace-nowrap">{formatVnd(m_pool, true)}</p>
        </div>

        <div className="flex gap-1 sm:gap-2 shrink-0">
          <button onClick={() => setShowTeacherPanel(true)}
            className="text-amber-300 hover:text-amber-200 text-xs font-black border border-amber-800/50 rounded-lg px-2 py-1 transition-colors" title="Cong cu giao vien">GV</button>
          <button onClick={onLeaderboard}
            className="text-amber-300 hover:text-amber-200 text-lg sm:text-xl transition-colors" title="Bang xep hang">🏆</button>
          <button onClick={() => setShowResetConfirm(true)}
            className="text-stone-400 hover:text-stone-200 text-lg sm:text-xl transition-colors" title="Bat dau lai">🔄</button>
        </div>
      </header>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/70">
          <div className="theory-card rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="relative z-10">
              <p className="text-3xl mb-3">🔄</p>
              <h2 className="text-xl font-bold text-stone-50 mb-2">Bat dau lai?</h2>
              <p className="text-sm text-stone-300 leading-relaxed mb-5">Tien trinh hien tai se bi xoa. Bang xep hang da luu truoc do khong bi anh huong.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 rounded-xl border border-stone-700/70 bg-stone-900/70 py-3 font-bold text-stone-100 hover:bg-stone-800">Huy</button>
                <button onClick={reset} className="flex-1 rounded-xl py-3 font-bold btn-primary">Choi lai</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTeacherPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/70">
          <div className="w-full max-w-md mx-4">
            <TeacherTools onClose={() => setShowTeacherPanel(false)} />
          </div>
        </div>
      )}

      {!isDesktop && (
        <div className="flex border-b border-amber-900/30 bg-stone-950/30">
          {(['decisions', 'metrics', 'charts'] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { decisions: '⚡ Quyet dinh', metrics: '📊 Chi so', charts: '📈 Bieu do' }
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === t ? 'text-amber-300 border-b-2 border-amber-400' : 'text-stone-400'}`}>
                {labels[t]}
              </button>
            )
          })}
        </div>
      )}

      <main className="flex-1 p-4 lg:p-6">
        {isDesktop ? (
          <div className="grid grid-cols-[300px_1fr_340px] gap-6 max-w-7xl mx-auto">
            <div className="space-y-4">
              <TeachingFocus round={round} />
              <MetricsPanel />
              <DistributionFlow />
            </div>
            <div className="space-y-4">
              <Suspense fallback={chartFallback}><Charts /></Suspense>
              <EventLogPanel />
            </div>
            <div className="space-y-4">
              <DecisionPanel />
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto space-y-4">
            <TeachingFocus round={round} />
            {tab === 'decisions' && <DecisionPanel />}
            {tab === 'metrics' && <><MetricsPanel /><DistributionFlow /><EventLogPanel /></>}
            {tab === 'charts' && <Suspense fallback={chartFallback}><Charts /></Suspense>}
          </div>
        )}
      </main>
    </div>
  )
}
