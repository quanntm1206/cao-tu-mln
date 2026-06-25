import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'
import { Trophy, X, Inbox, Trash2 } from 'lucide-react'

interface Props {
  onClose: () => void
}

const MEDAL = ['🥇', '🥈', '🥉']

export default function Leaderboard({ onClose }: Props) {
  const getLeaderboardFn = useGameStore((s) => s.getLeaderboard)
  const clearLeaderboardFn = useGameStore((s) => s.clearLeaderboard)
  const [entries, setEntries] = useState(() => getLeaderboardFn())
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    clearLeaderboardFn()
    setEntries([])
    setConfirmClear(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center lab-modal-backdrop p-4">
      <div className="lab-card-elevated w-full max-w-md flex flex-col max-h-[min(85dvh,720px)]">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[var(--color-lab-border)]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--color-lab-yellow)]" strokeWidth={2} />
            <h2 className="font-display text-xl font-bold">Bảng xếp hạng</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg lab-btn-ghost flex items-center justify-center"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {entries.length === 0 ? (
            <div className="text-center py-10 text-[var(--color-lab-fg-muted)]">
              <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" strokeWidth={1.5} />
              <p className="text-sm">Chưa có ai hoàn thành học phần.</p>
              <p className="text-xs mt-1 text-[var(--color-lab-fg-dim)]">Hãy là người đầu tiên!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((e, i) => (
                <div
                  key={`${e.name}-${i}`}
                  className="flex items-center gap-3 lab-card p-3"
                  style={i === 0 ? { borderColor: 'var(--color-lab-yellow)' } : {}}
                >
                  <span className="text-xl w-8 text-center shrink-0">
                    {MEDAL[i] ?? <span className="font-mono text-sm text-[var(--color-lab-fg-dim)]">{i + 1}.</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--color-lab-fg)] truncate">{e.name}</p>
                    <p className="text-xs text-[var(--color-lab-fg-dim)] font-mono">{e.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="lab-display-num text-sm text-[var(--color-lab-cyan)]">{formatVnd(e.score, true)}</p>
                    <p className="text-[10px] text-[var(--color-lab-fg-dim)] font-mono">{e.rounds} vòng</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 pt-3 border-t border-[var(--color-lab-border)] space-y-2">
          {entries.length > 0 && !confirmClear && (
            <button
              onClick={() => setConfirmClear(true)}
              className="lab-btn-ghost w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-[#EF4444] hover:text-[#EF4444]"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
              Xóa bảng xếp hạng
            </button>
          )}
          {confirmClear && (
            <div className="space-y-2">
              <p className="text-xs text-center text-[var(--color-lab-fg-muted)]">Xóa tất cả kỷ lục trên thiết bị này?</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setConfirmClear(false)} className="lab-btn-ghost py-2.5 rounded-lg font-semibold">
                  Hủy
                </button>
                <button
                  onClick={handleClear}
                  className="py-2.5 rounded-lg font-semibold bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/25"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
          <button onClick={onClose} className="lab-btn-ghost w-full py-2.5 rounded-lg font-semibold">
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
