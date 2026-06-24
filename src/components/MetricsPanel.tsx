import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'

function MetricCard({ label, value, sub, color = 'text-stone-50' }: {
  label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div className="glass-card rounded-xl p-4">
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className={`text-xl font-bold leading-tight break-words ${color}`}>{value}</p>
      {sub && <p className="text-xs text-stone-500 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function MetricsPanel() {
  const {
    m_pool, startingM, phase, round, maxRounds,
    industrial_profit, merchant_profit, interest_paid, interest_earned, rent_paid,
    lastResult,
  } = useGameStore()

  const growth = startingM > 0 ? ((m_pool - startingM) / startingM) * 100 : 0

  return (
    <div>
      <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Chi so – Pha {phase}/4</h3>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="M-pool hien tai" value={formatVnd(m_pool, true)} color="text-emerald-300"
          sub={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% tu dau`} />
        <MetricCard label="Tien do" value={`Vong ${round}/${maxRounds}`}
          sub={`Pha ${phase}/4`} />

        {/* Phase 1 metrics */}
        {phase >= 1 && (
          <MetricCard label="Loi nhuan CN tich luy" value={formatVnd(industrial_profit, true)}
            color="text-blue-300" />
        )}
        {phase >= 1 && lastResult?.phase === 1 && (
          <MetricCard label="Ty suat p' vong nay" value={`${(lastResult.p_rate * 100).toFixed(1)}%`} />
        )}

        {/* Phase 2 metrics */}
        {phase >= 2 && (
          <MetricCard label="Loi nhuan TN tich luy" value={formatVnd(merchant_profit, true)}
            color="text-amber-300" />
        )}
        {phase >= 2 && lastResult?.phase === 2 && (
          <MetricCard label="TN giu lai vong nay" value={formatVnd(lastResult.industrial_profit_after, true)} />
        )}

        {/* Phase 3 metrics */}
        {phase >= 3 && (
          <>
            <MetricCard label="Tong lai da tra (Z)" value={formatVnd(interest_paid, true)}
              color="text-red-400" />
            <MetricCard label="Tong lai thu duoc" value={formatVnd(interest_earned, true)}
              color="text-green-400" />
          </>
        )}

        {/* Phase 4 metrics */}
        {phase >= 4 && (
          <MetricCard label="Dia to da tra (R)" value={formatVnd(rent_paid, true)}
            color="text-orange-400" />
        )}
        {phase >= 4 && lastResult?.phase === 4 && (
          <MetricCard label="Gain/loss dat vong nay" value={formatVnd(lastResult.land_gain, true)}
            color={lastResult.land_gain >= 0 ? 'text-green-300' : 'text-red-400'} />
        )}
      </div>

      {/* Distribution summary */}
      {(industrial_profit + merchant_profit + interest_paid + rent_paid) > 0 && (
        <div className="mt-4 glass-card rounded-xl p-3">
          <p className="text-xs text-stone-400 mb-2">Phan phoi GTTT (tich luy)</p>
          <div className="text-xs font-mono text-center text-stone-300">
            <span className="text-amber-300">m</span>
            {' = '}
            <span className="text-blue-400">p</span> ({formatVnd(industrial_profit, true)})
            {' + '}
            <span className="text-amber-400">p_TN</span> ({formatVnd(merchant_profit, true)})
            {' + '}
            <span className="text-red-400">Z</span> ({formatVnd(interest_paid, true)})
            {' + '}
            <span className="text-orange-400">R</span> ({formatVnd(rent_paid, true)})
          </div>
        </div>
      )}
    </div>
  )
}
