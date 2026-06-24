import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'

export default function DistributionFlow() {
  const { m_pool, industrial_profit, merchant_profit, interest_earned, interest_paid, rent_paid } = useGameStore()

  const netInterest = interest_earned - interest_paid
  const total = Math.max(1, industrial_profit + merchant_profit + Math.abs(netInterest) + rent_paid)

  const bars = [
    { label: 'Lợi nhuận CN', key: 'ind', value: industrial_profit, color: '#3b82f6' },
    { label: 'Lợi nhuận TN', key: 'mer', value: merchant_profit, color: '#f59e0b' },
    { label: 'Lãi tức (Z)', key: 'fin', value: Math.abs(netInterest), color: '#ef4444' },
    { label: 'Địa tô (R)', key: 'ren', value: rent_paid, color: '#f97316' },
  ].filter((b) => b.value > 0)

  return (
    <div className="glass-card rounded-xl p-4">
      <p className="text-xs uppercase tracking-wider text-amber-300 mb-1">
        Dòng chảy M - Phân chia giá trị thặng dư
      </p>
      <p className="text-xs text-stone-500 mb-3">
        m = p + LN thương nghiệp + Z + R &nbsp;|&nbsp; M-pool hiện tại: <span className="text-emerald-300 font-bold">{formatVnd(m_pool, true)}</span>
      </p>

      {bars.length === 0 ? (
        <p className="text-xs text-stone-600 italic">Chưa có dữ liệu phân phối - hãy thi đấu!</p>
      ) : (
        <>
          <div className="flex h-5 rounded-lg overflow-hidden mb-3 gap-px">
            {bars.map((b) => (
              <div
                key={b.key}
                style={{ width: `${(b.value / total) * 100}%`, backgroundColor: b.color }}
                className="transition-all"
                title={`${b.label}: ${formatVnd(b.value, true)}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {bars.map((b) => (
              <div key={b.key} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: b.color }} />
                <div>
                  <p className="text-stone-300">{b.label}</p>
                  <p className="text-stone-500">{formatVnd(b.value, true)} ({((b.value / total) * 100).toFixed(0)}%)</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-stone-950/60 rounded-lg p-2 text-xs font-mono text-center text-stone-300">
            <span className="text-amber-300">m</span>
            {' = '}
            <span className="text-blue-400">p</span>
            {' + '}
            <span className="text-amber-400">p_TN</span>
            {' + '}
            <span className="text-red-400">Z</span>
            {' + '}
            <span className="text-orange-400">R</span>
          </div>
        </>
      )}
    </div>
  )
}