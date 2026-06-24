import { motion } from 'framer-motion'
import { formatVnd } from '../../lib/currency'

interface SectorBar {
  id: string
  label: string
  invested: number
  rate: number
  color: string
}

interface Props {
  sectors: SectorBar[]
  mPool: number
}

export default function LiveBarChart({ sectors, mPool }: Props) {
  const maxInvested = Math.max(mPool * 0.6, ...sectors.map((s) => s.invested), 1)
  const maxProfit = Math.max(...sectors.map((s) => s.invested * s.rate), 1)
  const maxVal = Math.max(maxInvested, maxProfit) * 1.05

  return (
    <div className="lab-card-elevated p-6 sm:p-8 h-full">
      <div className="flex items-baseline justify-between mb-1">
        <p className="lab-cite text-[var(--color-lab-cyan)]">LIVE_OUTPUT · vốn vs lợi nhuận dự kiến</p>
      </div>
      <h3 className="font-display text-xl font-bold mb-6">
        Bạn phân bổ → ngành sinh lời thế nào?
      </h3>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-6 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[var(--color-lab-surface-2)] border border-[var(--color-lab-border)]" />
          <span className="text-[var(--color-lab-fg-muted)]">Vốn đầu tư</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm" style={{ background: 'var(--color-lab-yellow)' }} />
          <span className="text-[var(--color-lab-fg-muted)]">Lợi nhuận dự kiến</span>
        </div>
      </div>

      <div className="space-y-7">
        {sectors.map((s) => {
          const profit = s.invested * s.rate
          const investedPct = (s.invested / maxVal) * 100
          const profitPct = (profit / maxVal) * 100
          return (
            <div key={s.id}>
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-base font-bold" style={{ color: s.color }}>{s.label}</span>
                  <span className="font-mono text-[11px] text-[var(--color-lab-fg-dim)]">
                    p′ = {(s.rate * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-[var(--color-lab-fg-dim)]">
                    {formatVnd(s.invested, true)} → <span className="text-[var(--color-lab-yellow)]">{formatVnd(profit, true)}</span>
                  </p>
                </div>
              </div>

              {/* Invested bar */}
              <div className="relative h-3 rounded-full bg-[var(--color-lab-surface-2)] border border-[var(--color-lab-border)] mb-1.5 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: s.color, opacity: 0.45 }}
                  animate={{ width: `${investedPct}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              </div>
              {/* Profit bar */}
              <div className="relative h-3 rounded-full bg-[var(--color-lab-surface-2)] border border-[var(--color-lab-border)] overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${s.color}, var(--color-lab-yellow))` }}
                  animate={{ width: `${profitPct}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-7 pt-5 border-t border-[var(--color-lab-border)] flex items-baseline justify-between">
        <p className="text-xs text-[var(--color-lab-fg-muted)] font-mono uppercase tracking-widest">
          Σ tổng lợi nhuận
        </p>
        <p className="lab-display-num text-2xl text-[var(--color-lab-yellow)]">
          {formatVnd(sectors.reduce((sum, s) => sum + s.invested * s.rate, 0), true)}
        </p>
      </div>
    </div>
  )
}
