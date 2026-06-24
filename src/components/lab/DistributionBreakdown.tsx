import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'

export default function DistributionBreakdown() {
  const s = useGameStore()
  // Compute each component
  const p = Math.max(0, s.industrial_profit - s.merchant_profit)
  const pTN = s.merchant_profit
  const Z = s.interest_earned - s.interest_paid  // can be negative
  const R_paid = s.rent_paid
  // What changed M-pool: industrial (kept) + Z + R + quick events
  const totalDelta = s.m_pool - s.startingM

  const items = [
    { key: 'p', label: 'Lợi nhuận CN (giữ lại)', sym: 'p', color: '#3B82F6', value: p, hint: 'Phần m mà nhà tư bản CN giữ lại sau khi nhường TN' },
    { key: 'pTN', label: 'Lợi nhuận TN (đã nhường)', sym: 'p_TN', color: '#10B981', value: pTN, hint: 'Phần m đã chuyển cho thương nhân' },
    { key: 'Z', label: 'Tài chính (net)', sym: 'Z', color: '#F59E0B', value: Z, hint: 'Lãi thu − lãi trả' },
    { key: 'R', label: 'Địa tô đã trả', sym: 'R', color: '#EC4899', value: -R_paid, hint: 'Tô phải trả nếu thuê đất' },
  ]
  const totalAbsM = items.reduce((sum, it) => sum + Math.abs(it.value), 0) || 1

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <p className="lab-cite mb-2 text-[var(--color-lab-cyan)]">PHÂN CHIA M · m = p + p_TN + Z + R</p>
      <h3 className="font-display text-xl font-bold mb-1">Bạn đã thấy m chia về 4 hướng</h3>
      <p className="text-sm text-[var(--color-lab-fg-muted)] mb-6">
        Tỷ lệ chiều dài = mức đóng góp tương đối của mỗi hình thái vào delta M-pool.
      </p>

      {/* Stacked horizontal bar */}
      <div className="mb-6">
        <div className="flex h-10 rounded-lg overflow-hidden border border-[var(--color-lab-border)]">
          {items.map((it) => {
            const w = (Math.abs(it.value) / totalAbsM) * 100
            return (
              <motion.div
                key={it.key}
                className="flex items-center justify-center text-xs font-mono font-bold"
                style={{ background: it.color, color: '#0A0A0B' }}
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                title={`${it.label}: ${formatVnd(it.value, true)}`}
              >
                {w > 6 && it.sym}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-3">
        {items.map((it) => {
          const sign = it.value >= 0 ? '+' : ''
          const pct = (Math.abs(it.value) / totalAbsM) * 100
          return (
            <div key={it.key} className="flex items-baseline gap-3">
              <div className="flex items-center gap-2 shrink-0" style={{ width: '36%' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: it.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{it.label}</p>
                  <p className="text-[11px] text-[var(--color-lab-fg-dim)] font-mono">{it.sym} · {pct.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex-1 h-1.5 rounded-full bg-[var(--color-lab-surface-2)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: it.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p
                className="lab-display-num text-sm text-right shrink-0"
                style={{ width: '22%', color: it.value >= 0 ? it.color : '#EF4444' }}
              >
                {sign}{formatVnd(it.value, true)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--color-lab-border)] flex items-baseline justify-between">
        <p className="text-xs text-[var(--color-lab-fg-muted)] font-mono uppercase tracking-widest">
          Δ M-pool tổng
        </p>
        <p className="lab-display-num text-2xl" style={{ color: totalDelta >= 0 ? '#10B981' : '#EF4444' }}>
          {totalDelta >= 0 ? '+' : ''}{formatVnd(totalDelta, true)}
        </p>
      </div>
    </div>
  )
}
