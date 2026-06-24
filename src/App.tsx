import { useState, useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import IntroScreen from './components/IntroScreen'
import LabShell from './components/LabShell'
import Phase1Page from './components/lab/Phase1Page'
import Phase2Page from './components/lab/Phase2Page'
import Phase3Page from './components/lab/Phase3Page'
import Phase4Page from './components/lab/Phase4Page'
import FinalInfographic from './components/lab/FinalInfographic'
import Leaderboard from './components/Leaderboard'

export default function App() {
  const { started, gameOver, phase, reset } = useGameStore()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [completed, setCompleted] = useState(false)
  // viewingPhase lags store.phase so we can show wrap-up + result of previous phase
  const [viewingPhase, setViewingPhase] = useState<1 | 2 | 3 | 4>(1)

  useEffect(() => {
    if (!started) setViewingPhase(1)
  }, [started])

  if (!started) {
    return (
      <>
        <IntroScreen onShowLeaderboard={() => setShowLeaderboard(true)} />
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      </>
    )
  }

  const advancePhase = (next: 1 | 2 | 3 | 4) => {
    setViewingPhase(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleComplete = () => {
    setCompleted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    reset()
    setShowResetConfirm(false)
    setCompleted(false)
    setViewingPhase(1)
  }

  return (
    <LabShell
      viewingPhase={viewingPhase}
      onLeaderboard={() => setShowLeaderboard(true)}
      onReset={() => setShowResetConfirm(true)}
    >
      {gameOver && completed ? (
        <FinalInfographic onLeaderboard={() => setShowLeaderboard(true)} />
      ) : (
        <>
          {viewingPhase === 1 && (
            <Phase1Page onNextPhase={() => advancePhase(2)} />
          )}
          {viewingPhase === 2 && (
            <Phase2Page onNextPhase={() => advancePhase(3)} />
          )}
          {viewingPhase === 3 && (
            <Phase3Page onNextPhase={() => advancePhase(4)} />
          )}
          {viewingPhase === 4 && (
            <Phase4Page onComplete={handleComplete} />
          )}
          {/* If user is on a phase page but the store has already moved forward (e.g. user dismissed wrap-up),
             auto-sync viewingPhase to store.phase */}
          <PhaseSync storePhase={phase} viewingPhase={viewingPhase} setViewingPhase={setViewingPhase} />
        </>
      )}

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 lab-modal-backdrop flex items-center justify-center p-4">
          <div className="lab-card-elevated p-7 max-w-sm w-full">
            <p className="lab-cite mb-2 text-[var(--color-lab-yellow)]">CONFIRM</p>
            <h2 className="font-display text-xl font-bold mb-2">Bắt đầu lại?</h2>
            <p className="text-sm text-[var(--color-lab-fg-muted)] mb-5 leading-relaxed">
              Tiến trình hiện tại sẽ bị xóa. Bảng xếp hạng đã lưu vẫn còn.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowResetConfirm(false)} className="lab-btn-ghost flex-1 py-2.5 rounded-lg">Hủy</button>
              <button onClick={handleReset} className="lab-btn-primary flex-1 py-2.5 rounded-lg">Chơi lại</button>
            </div>
          </div>
        </div>
      )}
    </LabShell>
  )
}

function PhaseSync({ storePhase, viewingPhase, setViewingPhase }: { storePhase: number; viewingPhase: number; setViewingPhase: (n: 1 | 2 | 3 | 4) => void }) {
  // If store moves backwards (reset), reset viewing
  useEffect(() => {
    if (storePhase < viewingPhase) {
      setViewingPhase(storePhase as 1 | 2 | 3 | 4)
    }
  }, [storePhase, viewingPhase, setViewingPhase])
  return null
}
