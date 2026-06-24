import { useGameStore } from '../store/gameStore'

export default function EventLogPanel() {
  const eventLog = useGameStore((state) => state.eventLog)

  return (
    <details className="glass-card rounded-xl p-4 group">
      <summary className="cursor-pointer list-none text-sm font-bold text-amber-300 flex items-center justify-between gap-3">
        <span>🧾 Lịch sử tình huống</span>
        <span className="text-xs text-stone-500">{eventLog.length} event</span>
      </summary>
      {eventLog.length === 0 ? (
        <p className="text-xs text-stone-500 mt-3 leading-relaxed">
          Chưa có tình huống nào. Giáo viên có thể bật chế độ giáo viên để ép tình huống khi cần thảo luận trên lớp.
        </p>
      ) : (
        <div className="mt-3 space-y-3 max-h-72 overflow-y-auto pr-1">
          {eventLog.map((event, index) => (
            <div key={`${event.eventId}-${index}`} className="rounded-lg bg-stone-950/45 border border-amber-900/25 p-3">
              <p className="text-xs text-amber-300 uppercase tracking-wider">
                Vòng {event.round}{event.forcedByTeacher ? ' · giáo viên ép' : ''}
              </p>
              <p className="text-sm font-bold text-stone-50 mt-1">{event.title}</p>
              <p className="text-xs text-stone-300 mt-1"><span className="font-semibold">Chọn:</span> {event.choiceLabel}</p>
              <p className="text-xs text-amber-100 mt-2 leading-relaxed">{event.teachingPoint}</p>
            </div>
          ))}
        </div>
      )}
    </details>
  )
}
