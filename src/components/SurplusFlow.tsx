import type { RoundResult } from '../engine/economy'
import { formatVnd } from '../lib/currency'

interface Props {
  result: RoundResult
  surplusRevealed: boolean
}

interface FlowItem {
  label: string
  value: number
  color: string
  pct: number
}

export default function SurplusFlow({ result, surplusRevealed }: Props) {
  const totalCreated = Math.max(1, result.m + result.m_super)

  const outflows: FlowItem[] = []
  if (result.p_merchant > 0) {
    outflows.push({
      label: 'Thương nghiệp (p_tn)',
      value: result.p_merchant,
      color: 'bg-amber-500',
      pct: 0,
    })
  }
  if (result.z_interest > 0) {
    outflows.push({
      label: 'Lãi vay (z)',
      value: result.z_interest,
      color: 'bg-red-700',
      pct: 0,
    })
  }
  if (result.rent_cost > 0) {
    outflows.push({
      label: 'Địa tô (R)',
      value: result.rent_cost,
      color: 'bg-orange-500',
      pct: 0,
    })
  }

  const kept = Math.max(0, result.net_profit)
  const items: FlowItem[] = [
    ...outflows.map((item) => ({
      ...item,
      pct: item.value / totalCreated,
    })),
    {
      label: 'Lợi nhuận ròng',
      value: kept,
      color: 'bg-green-600',
      pct: kept / totalCreated,
    },
  ]

  const totalPct = items.reduce((sum, item) => sum + item.pct, 0)
  if (totalPct > 0) {
    items.forEach((item) => {
      item.pct = item.pct / totalPct
    })
  }

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-stone-300 mb-1">
        Dòng chảy của {surplusRevealed ? 'Khối m (GTTT)' : 'Lợi nhuận'}
      </h3>
      <p className="text-xs text-stone-500 mb-3">
        Tổng tạo ra: {formatVnd(totalCreated)}
        {result.z_earned > 0 && (
          <span className="text-green-400">
            {' '}
            (+{formatVnd(result.z_earned, true)} lãi cho vay)
          </span>
        )}
      </p>

      <div className="flex h-8 rounded-xl overflow-hidden mb-4 gap-0.5">
        {items.map((item) => (
          <div
            key={item.label}
            className={`${item.color} transition-all flex items-center justify-center`}
            style={{ width: `${item.pct * 100}%`, minWidth: item.pct > 0.03 ? '2rem' : '0' }}
            title={`${item.label}: ${formatVnd(item.value)}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-sm shrink-0 ${item.color}`} />
            <div className="min-w-0">
              <p className="text-stone-300 truncate">{item.label}</p>
              <p className="text-stone-500">
                {formatVnd(item.value, true)} ({(item.pct * 100).toFixed(0)}%)
              </p>
            </div>
          </div>
        ))}
      </div>

      {surplusRevealed && (
        <div className="mt-4 bg-stone-950 rounded-xl p-3 text-xs font-mono text-center text-stone-300">
          <span className="text-amber-300">G</span>
          {' = '}
          <span className="text-amber-300">c</span>
          {' + '}
          <span className="text-orange-300">v</span>
          {' + '}
          <span className="text-green-300">m</span>
          {'   '}
          <span className="text-stone-500">
            = {formatVnd(result.c, true)} + {formatVnd(result.k - result.c, true)} +{' '}
            {formatVnd(result.m, true)}
          </span>
        </div>
      )}
    </div>
  )
}


