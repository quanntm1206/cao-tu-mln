import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'

const PHASE_COLORS: Record<number, string> = {
  1: '#3B82F6',
  2: '#10B981',
  3: '#F59E0B',
  4: '#EC4899',
}

interface PointMeta {
  round: number
  phase: number
  m: number
  delta: number
}

export default function MPoolTrajectory() {
  const { history, startingM, m_pool } = useGameStore()

  // Reconstruct M-pool per round from history
  const trajectory: PointMeta[] = [{ round: 0, phase: 1, m: startingM, delta: 0 }]
  let running = startingM
  for (const entry of history) {
    let delta = 0
    const r = entry.result
    if (r.phase === 1) delta = r.total_industrial_profit
    else if (r.phase === 2) delta = 0 // merchant profit doesn't change m_pool in store
    else if (r.phase === 3) delta = r.net_finance
    else if (r.phase === 4) delta = r.land_gain
    // Effect of quick events also accumulated, so use endingM (m_pool) as final anchor
    running += delta
    trajectory.push({ round: entry.round, phase: r.phase, m: running, delta })
  }
  // Anchor last point to actual store m_pool to absorb quick-event drift
  if (trajectory.length > 1) trajectory[trajectory.length - 1].m = m_pool

  if (trajectory.length <= 1) {
    return (
      <div className="lab-card-elevated p-6 sm:p-8">
        <p className="lab-cite mb-2 text-[var(--color-lab-cyan)]">TÀI SẢN/VỐN KHẢ DỤNG</p>
        <p className="text-sm text-[var(--color-lab-fg-muted)]">Chưa có vòng nào được áp dụng.</p>
      </div>
    )
  }

  const W = 720
  const H = 240
  const PAD_L = 56
  const PAD_R = 16
  const PAD_T = 16
  const PAD_B = 36
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B

  const ms = trajectory.map((p) => p.m)
  const minM = Math.min(...ms, startingM)
  const maxM = Math.max(...ms, startingM)
  const range = Math.max(maxM - minM, startingM * 0.05)

  const xFor = (i: number) => PAD_L + (i / (trajectory.length - 1)) * innerW
  const yFor = (m: number) => PAD_T + (1 - (m - minM) / range) * innerH

  const linePath = trajectory.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i).toFixed(1)},${yFor(p.m).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${xFor(trajectory.length - 1).toFixed(1)},${(PAD_T + innerH).toFixed(1)} L${xFor(0).toFixed(1)},${(PAD_T + innerH).toFixed(1)} Z`

  const startingY = yFor(startingM)
  const growth = startingM > 0 ? ((m_pool - startingM) / startingM) * 100 : 0
  const positive = m_pool >= startingM

  // Phase boundary markers (after rounds 4, 8, 12)
  const boundaries = [4, 8, 12]

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <p className="lab-cite text-[var(--color-lab-cyan)]">TÀI SẢN/VỐN KHẢ DỤNG · 16 vòng</p>
        <p className="text-xs font-mono text-[var(--color-lab-fg-dim)]">
          {trajectory.length - 1}/16 vòng đã chơi
        </p>
      </div>
      <h3 className="font-display text-xl font-bold mb-6">
        Tài sản/vốn khả dụng đi từ {formatVnd(startingM, true)} đến{' '}
        <span style={{ color: positive ? '#10B981' : '#EF4444' }}>{formatVnd(m_pool, true)}</span>
      </h3>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="mPoolGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0.25, 0.5, 0.75].map((p) => (
            <line
              key={p}
              x1={PAD_L}
              x2={W - PAD_R}
              y1={PAD_T + innerH * p}
              y2={PAD_T + innerH * p}
              stroke="var(--color-lab-border)"
              strokeDasharray="2,4"
            />
          ))}

          {/* Phase color bands at bottom */}
          {[1, 2, 3, 4].map((ph) => {
            const startRound = (ph - 1) * 4
            const endRound = ph * 4
            return (
              <rect
                key={ph}
                x={xFor(startRound)}
                y={H - PAD_B + 4}
                width={xFor(endRound) - xFor(startRound)}
                height={4}
                fill={PHASE_COLORS[ph]}
                opacity={0.6}
              />
            )
          })}

          {/* Phase boundary dotted lines */}
          {boundaries.map((b) => (
            <line
              key={b}
              x1={xFor(b)}
              x2={xFor(b)}
              y1={PAD_T}
              y2={PAD_T + innerH}
              stroke="var(--color-lab-fg-dim)"
              strokeDasharray="3,5"
              strokeWidth={0.5}
              opacity={0.5}
            />
          ))}

          {/* Starting M baseline */}
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={startingY}
            y2={startingY}
            stroke="var(--color-lab-yellow)"
            strokeDasharray="4,3"
            strokeWidth={1}
            opacity={0.5}
          />
          <text
            x={W - PAD_R - 4}
            y={startingY - 4}
            textAnchor="end"
            className="font-mono"
            style={{ fontSize: 10, fill: 'var(--color-lab-yellow)' }}
          >
            M ban đầu
          </text>

          {/* Area under curve */}
          <motion.path
            d={areaPath}
            fill="url(#mPoolGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={positive ? '#10B981' : '#EF4444'}
            strokeWidth={2.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />

          {/* Points colored by phase */}
          {trajectory.map((p, i) => (
            <circle
              key={i}
              cx={xFor(i)}
              cy={yFor(p.m)}
              r={i === trajectory.length - 1 ? 5 : 2.5}
              fill={PHASE_COLORS[p.phase]}
              stroke="var(--color-lab-bg)"
              strokeWidth={1.5}
            />
          ))}

          {/* Y-axis labels */}
          {[0, 0.5, 1].map((p) => {
            const m = minM + range * (1 - p)
            return (
              <text
                key={p}
                x={PAD_L - 8}
                y={PAD_T + innerH * p + 4}
                textAnchor="end"
                className="font-mono"
                style={{ fontSize: 10, fill: 'var(--color-lab-fg-dim)' }}
              >
                {formatVnd(m, true)}
              </text>
            )
          })}

          {/* X-axis labels */}
          {[0, 4, 8, 12, 16].map((r) => (
            <text
              key={r}
              x={xFor(Math.min(r, trajectory.length - 1))}
              y={H - PAD_B + 22}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 10, fill: 'var(--color-lab-fg-dim)' }}
            >
              V{r}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--color-lab-border)] grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--color-lab-fg-dim)]">M ban đầu</p>
          <p className="lab-display-num text-sm mt-1 text-[var(--color-lab-yellow)]">{formatVnd(startingM, true)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--color-lab-fg-dim)]">M cuối</p>
          <p className="lab-display-num text-sm mt-1" style={{ color: positive ? '#10B981' : '#EF4444' }}>
            {formatVnd(m_pool, true)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--color-lab-fg-dim)]">Tăng trưởng</p>
          <p className="lab-display-num text-sm mt-1" style={{ color: positive ? '#10B981' : '#EF4444' }}>
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}
