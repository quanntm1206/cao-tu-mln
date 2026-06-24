import { useGameStore } from '../store/gameStore'

interface Props {
  onClose?: () => void
}

export default function TeacherTools({ onClose }: Props) {
  const round = useGameStore((state) => state.round)
  const maxRounds = useGameStore((state) => state.maxRounds)
  const teacherModeEnabled = useGameStore((state) => state.teacherModeEnabled)
  const lectureMode = useGameStore((state) => state.lectureMode)
  const toggleTeacherMode = useGameStore((state) => state.toggleTeacherMode)
  const forceNextQuickEvent = useGameStore((state) => state.forceNextQuickEvent)
  const jumpToRound = useGameStore((state) => state.jumpToRound)

  return (
    <div className="glass-card rounded-xl p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-amber-300">👩‍🏫 Chế độ giáo viên</p>
          <p className="text-xs text-stone-500 mt-1">
            {teacherModeEnabled ? 'Đang mở công cụ giảng nhanh.' : 'Bật để hiện tua vòng và ép tình huống khi dạy trên lớp.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleTeacherMode}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              teacherModeEnabled
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-950/55 text-stone-300 hover:bg-stone-800'
            }`}
          >
            {teacherModeEnabled ? 'Đang bật' : 'Bật'}
          </button>
          {onClose && (
            <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-stone-900/70 text-stone-300 hover:bg-stone-800">
              Đóng
            </button>
          )}
        </div>
      </div>

      {lectureMode && (
        <div className="mt-3 rounded-lg border border-amber-700/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100">
          📌 Giảng nhanh: số liệu không dùng để so điểm chuẩn, chỉ để nhảy tới khái niệm cần dạy.
        </div>
      )}

      {teacherModeEnabled && (
        <div className="mt-3 space-y-3">
          <button
            onClick={forceNextQuickEvent}
            className="w-full rounded-lg border border-amber-700/50 bg-amber-950/35 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-900/45 transition-colors"
          >
            Ép tình huống nhanh ở vòng tới
          </button>
          <div>
            <p className="text-xs text-stone-400 mb-2">Tua tới vòng bài học</p>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: maxRounds }, (_, idx) => idx + 1).map((target) => (
                <button
                  key={target}
                  onClick={() => jumpToRound(target)}
                  className={`rounded-lg py-1.5 text-xs font-bold transition-colors ${
                    target === round
                      ? 'bg-amber-600 text-stone-950'
                      : 'bg-stone-950/55 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {target}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
              Tua vòng chỉ dùng để giảng nhanh khái niệm; không mô phỏng lại lịch sử sản xuất trước đó.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
