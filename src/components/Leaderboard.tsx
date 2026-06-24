import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'

interface Props {
  onClose: () => void
}

const MEDAL = ['🥇', '🥈', '🥉']

export default function Leaderboard({ onClose }: Props) {
  const getLeaderboardFn = useGameStore((s) => s.getLeaderboard)
  const entries = getLeaderboardFn()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/70">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-amber-900/40">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-300">🏆 Bảng xếp hạng</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <p className="text-4xl mb-3">📭</p>
            <p>Chưa có ai hoàn thành trò chơi.</p>
            <p className="text-sm mt-1">Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => (
              <div
                key={`${entry.name}-${i}`}
                className={`flex items-center gap-4 rounded-xl p-4 ${
                  i === 0
                    ? 'bg-amber-950/35 border border-amber-700/40'
                    : i === 1
                    ? 'bg-stone-800/40 border border-stone-600/30'
                    : 'bg-stone-900/30'
                }`}
              >
                <span className="text-2xl w-8 text-center">{MEDAL[i] ?? `${i + 1}.`}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-50 truncate">{entry.name}</p>
                  <p className="text-xs text-stone-400">{entry.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">{formatVnd(entry.score)}</p>
                  <p className="text-xs text-stone-500">{entry.rounds} vòng</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl font-semibold bg-stone-800 hover:bg-stone-700 text-stone-50 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}


