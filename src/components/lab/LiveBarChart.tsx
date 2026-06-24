import { motion } from 'framer-motion'
import { formatVnd } from '../../lib/currency'

interface SectorBar {
  id: string
  label: string
  invested: number
  rate: number
  postCompetitionRate?: number
  c: number
  v: number
  m: number
  color: string
  archetype?: string
}

interface Props {
  sectors: SectorBar[]
  mPool: number
}

export default function LiveBarChart({ sectors, mPool }: Props) {
  // Scale: longest bar = largest (c + v + m) across sectors
  const maxComposite = Math.max(...sectors.map((s) => s.c + s.v + s.m), mPool * 0.4, 1)

  return (
    <div className="lab-card-elevated p-6 sm:p-8 h-full">
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <p className="lab-cite text-[var(--color-lab-cyan)]">LIVE · cấu tạo vốn của 3 ngành</p>
      </div>
      <h3 className="font-display text-xl font-bold mb-2">
        m sinh ra từ <span className="text-[var(--color-lab-cyan)]">v</span>, không từ c
      </h3>
      <p className="text-sm text-[var(--color-lab-fg-muted)] mb-5 leading-relaxed">
        Mỗi ngành có cấu tạo hữu cơ c/v khác nhau ⇒ cùng một đồng vốn, sinh ra m khác nhau ⇒ p′ khác nhau.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-xs font-mono">
        <LegendDot color="#52525B" label="c · tư bản bất biến (máy móc)" />
        <LegendDot color="#06B6D4" label="v · tư bản khả biến (lao động)" />
        <LegendDot color="#FACC15" label="m · giá trị thặng dư" />
      </div>

      <div className="space-y-7">
        {sectors.map((s) => {
          const cPct = (s.c / maxComposite) * 100
          const vPct = (s.v / maxComposite) * 100
          const mPct = (s.m / maxComposite) * 100
          const cvRatio = s.v > 0 ? s.c / s.v : 0

          return (
            <div key={s.id}>
              <div className="flex items-baseline justify-between mb-2 flex-wrap gap-y-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-display text-base font-bold" style={{ color: s.color }}>{s.label}</span>
                  <span className="font-mono text-[11px] text-[var(--color-lab-fg-dim)]">
                    c/v = {cvRatio.toFixed(2)} · p′ = {(s.rate * 100).toFixed(0)}%
                  </span>
                </div>
                {s.postCompetitionRate !== undefined && (
                  <span className="font-mono text-[10px] text-[var(--color-lab-fg-dim)] block mt-0.5">
                    p′ minh họa hội tụ = {(s.postCompetitionRate * 100).toFixed(1)}% (không dùng để tính m)
                  </span>
                )}
                {s.archetype && (
                  <span className="text-[10px] text-[var(--color-lab-fg-dim)] italic">{s.archetype}</span>
                )}
              </div>

              {/* Composition bar: c | v | + m */}
              <div className="relative h-7 rounded-md bg-[var(--color-lab-surface-2)] border border-[var(--color-lab-border)] overflow-hidden flex">
                <motion.div
                  className="h-full flex items-center justify-center"
                  style={{ background: '#52525B' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cPct}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  {cPct > 8 && <span className="font-mono text-[10px] font-bold text-white">c</span>}
                </motion.div>
                <motion.div
                  className="h-full flex items-center justify-center"
                  style={{ background: '#06B6D4' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${vPct}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  {vPct > 6 && <span className="font-mono text-[10px] font-bold text-[#042A33]">v</span>}
                </motion.div>
                {/* Gap separator showing m as "bonus" generated */}
                {mPct > 0.5 && (
                  <div className="h-full w-px bg-[var(--color-lab-bg)]" />
                )}
                <motion.div
                  className="h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(90deg, #FACC15, #F59E0B)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${mPct}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
                >
                  {mPct > 6 && <span className="font-mono text-[10px] font-bold text-[#3a2a00]">+m</span>}
                </motion.div>
              </div>

              {/* Detail row */}
              <div className="mt-1.5 grid grid-cols-3 gap-2 text-[10px] font-mono">
                <span className="text-[var(--color-lab-fg-dim)]">
                  c = {formatVnd(s.c, true)}
                </span>
                <span style={{ color: '#06B6D4' }}>
                  v = {formatVnd(s.v, true)}
                </span>
                <span className="text-right" style={{ color: '#FACC15' }}>
                  m = {formatVnd(s.m, true)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="mt-7 pt-5 border-t border-[var(--color-lab-border)] grid grid-cols-3 gap-4">
        <Total label="Σ c" value={formatVnd(sectors.reduce((s, x) => s + x.c, 0), true)} color="#52525B" />
        <Total label="Σ v" value={formatVnd(sectors.reduce((s, x) => s + x.v, 0), true)} color="#06B6D4" />
        <Total label="Σ m (lợi nhuận)" value={formatVnd(sectors.reduce((s, x) => s + x.m, 0), true)} color="#FACC15" />
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: color }} />
      <span className="text-[var(--color-lab-fg-muted)]">{label}</span>
    </div>
  )
}

function Total({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--color-lab-fg-dim)]">{label}</p>
      <p className="lab-display-num text-base mt-0.5" style={{ color }}>{value}</p>
    </div>
  )
}
