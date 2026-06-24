import { useGameStore } from '../store/gameStore'

interface Props { onClose?: () => void }

export default function TeacherTools({ onClose }: Props) {
  const round = useGameStore((s) => s.round)
  const maxRounds = useGameStore((s) => s.maxRounds)
  const teacherModeEnabled = useGameStore((s) => s.teacherModeEnabled)
  const toggleTeacherMode = useGameStore((s) => s.toggleTeacherMode)
  const forceNextQuickEvent = useGameStore((s) => s.forceNextQuickEvent)
  const jumpToRound = useGameStore((s) => s.jumpToRound)

  const phaseRounds = [1, 5, 9, 13]

  return (
    <div className="glass-card rounded-xl p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-amber-300">🎓 Cong cu Giao vien</p>
          <p className="text-xs text-stone-500 mt-1">
            {teacherModeEnabled ? 'Dang mo che do giang nhanh.' : 'Bat de hien tua vong va ap tinh huong khi day tren lop.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTeacherMode}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${teacherModeEnabled ? 'bg-amber-500 text-stone-950' : 'bg-stone-950/55 text-stone-300 hover:bg-stone-800'}`}>
            {teacherModeEnabled ? 'Dang bat' : 'Bat'}
          </button>
          {onClose && (
            <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-stone-900/70 text-stone-300 hover:bg-stone-800">
              Dong
            </button>
          )}
        </div>
      </div>

      {teacherModeEnabled && (
        <div className="mt-3 rounded-lg border border-amber-700/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100">
          📋 Giang nhanh: so lieu khong dung de so diem chuan, chi de nhan den khai niem can day.
        </div>
      )}

      {teacherModeEnabled && (
        <div className="mt-3 space-y-3">
          <button onClick={forceNextQuickEvent}
            className="w-full rounded-lg border border-amber-700/50 bg-amber-950/35 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-900/45 transition-colors">
            ⚡ Ap tinh huong nhanh o vong toi
          </button>

          <div>
            <p className="text-xs text-stone-400 mb-2">Nhay den dau Pha (vong 1, 5, 9, 13)</p>
            <div className="grid grid-cols-4 gap-1.5">
              {phaseRounds.map((r) => (
                <button key={r} onClick={() => jumpToRound(r)}
                  className={`rounded-lg py-2 text-xs font-semibold transition-colors ${round === r ? 'bg-amber-600 text-stone-50' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}>
                  Pha {phaseRounds.indexOf(r) + 1}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-stone-400 mb-2">Tua toi vong cu the (1–{maxRounds})</p>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: maxRounds }, (_, i) => i + 1).map((r) => (
                <button key={r} onClick={() => jumpToRound(r)}
                  className={`rounded-lg py-2 text-xs font-semibold transition-colors ${round === r ? 'bg-amber-600 text-stone-50' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
