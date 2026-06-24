import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'

export default function SurplusFlow() {
  const { industrial_profit, merchant_profit, interest_paid, interest_earned, rent_paid, m_pool } = useGameStore()
  const netZ = interest_earned - interest_paid
  const total = Math.max(1, industrial_profit + merchant_profit + Math.abs(interest_paid) + rent_paid)

  const items = [
    { label: 'p (lợi nhuận CN)', value: industrial_profit, color: 'bg-blue-500', textColor: 'text-blue-400' },
    { label: 'p_TN (thương nghiệp)', value: merchant_profit, color: 'bg-amber-500', textColor: 'text-amber-400' },
    { label: 'Z (lãi tức trả)', value: interest_paid, color: 'bg-red-600', textColor: 'text-red-400' },
    { label: 'Z thu (cho vay)', value: interest_earned, color: 'bg-green-600', textColor: 'text-green-400' },
    { label: 'R (địa tô)', value: rent_paid, color: 'bg-orange-500', textColor: 'text-orange-400' },
  ].filter((i) => i.value > 0)

  return (
    <div className="theory-card rounded-xl p-4">
      <p className="text-xs uppercase tracking-wider text-amber-300 mb-1">Dòng chảy Giá trị Thặng dư</p>
      <div className="text-xs font-mono text-center text-stone-300 mb-3">
        <span className="text-amber-300">m</span>
        {' = '}
        <span className="text-blue-400">p</span>
        {' + '}
        <span className="text-amber-400">LN thương nghiệp</span>
        {' + '}
        <span className="text-red-400">Z</span>
        {' + '}
        <span className="text-orange-400">R</span>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-stone-600 italic text-center">Chưa có phân phối - bắt đầu thi đấu!</p>
      ) : (
        <>
          <div className="flex h-5 rounded-lg overflow-hidden mb-3 gap-px">
            {items.map((it) => (
              <div key={it.label}
                className={`${it.color} transition-all`}
                style={{ width: `${(it.value / total) * 100}%` }}
                title={`${it.label}: ${formatVnd(it.value, true)}`} />
            ))}
          </div>
          <div className="space-y-1.5">
            {items.map((it) => (
              <div key={it.label} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm ${it.color}`} />
                  <span className="text-stone-400">{it.label}</span>
                </div>
                <span className={`font-bold ${it.textColor}`}>{formatVnd(it.value, true)}</span>
              </div>
            ))}
            {netZ !== 0 && (
              <div className="flex justify-between items-center text-xs border-t border-stone-700/50 pt-1.5 mt-1.5">
                <span className="text-stone-500">Tài chính ròng (Z thu - Z trả)</span>
                <span className={`font-bold ${netZ >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatVnd(netZ, true)}</span>
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-between items-center text-xs border-t border-stone-700/50 pt-2">
            <span className="text-stone-400">M-pool hiện tại</span>
            <span className="font-bold text-emerald-300">{formatVnd(m_pool, true)}</span>
          </div>
        </>
      )}
    </div>
  )
}