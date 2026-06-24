import { type ReactNode } from 'react'
import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'
import { FlaskConical, Trophy, RotateCcw } from 'lucide-react'

const PHASE_CONFIG: Record<number, { name: string; color: string; soft: string }> = {
  1: { name: 'Sản xuất', color: 'var(--color-phase-1)', soft: 'var(--color-phase-1-soft)' },
  2: { name: 'Thương nghiệp', color: 'var(--color-phase-2)', soft: 'var(--color-phase-2-soft)' },
  3: { name: 'Tài chính', color: 'var(--color-phase-3)', soft: 'var(--color-phase-3-soft)' },
  4: { name: 'Địa tô', color: 'var(--color-phase-4)', soft: 'var(--color-phase-4-soft)' },
}

interface Props {
  children: ReactNode
  onLeaderboard: () => void
  onReset: () => void
}

export default function LabShell({ children, onLeaderboard, onReset }: Props) {
  const { phase, round, m_pool, playerName } = useGameStore()
  const active = PHASE_CONFIG[phase] ?? PHASE_CONFIG[1]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 lab-surface border-b border-[var(--color-lab-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2 shrink-0">
            <FlaskConical className="w-5 h-5 text-[var(--color-lab-cyan)]" strokeWidth={1.75} />
            <span className="font-display font-bold text-base text-[var(--color-lab-fg)] hidden sm:inline">
              Surplus<span className="text-[var(--color-lab-cyan)]">.Lab</span>
            </span>
          </div>

          {/* Phase dots */}
          <nav aria-label="Tiến độ học phần" className="flex items-center gap-1.5 sm:gap-2 ml-1">
            {[1, 2, 3, 4].map((n) => {
              const isActive = n === phase
              const isDone = n < phase
              const cfg = PHASE_CONFIG[n]
              return (
                <div
                  key={n}
                  className="flex items-center gap-1.5"
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div
                    className="relative h-2 w-2 rounded-full transition-all"
                    style={{
                      background: isActive ? cfg.color : isDone ? cfg.color : 'var(--color-lab-border)',
                      boxShadow: isActive ? `0 0 12px ${cfg.color}` : 'none',
                    }}
                  />
                  <span
                    className={`text-[10px] uppercase tracking-wider hidden md:inline ${
                      isActive ? 'text-[var(--color-lab-fg)] font-semibold' : 'text-[var(--color-lab-fg-dim)]'
                    }`}
                  >
                    Pha {n}
                  </span>
                </div>
              )
            })}
          </nav>

          <div className="flex-1 min-w-0 hidden sm:flex items-baseline gap-2 px-3">
            <span
              className="lab-phase-chip"
              style={{ color: active.color, background: active.soft }}
            >
              Pha {phase}/4 · {active.name}
            </span>
            <span className="text-xs text-[var(--color-lab-fg-dim)] font-mono">
              v{round}/16
            </span>
          </div>

          <div className="text-right shrink-0 mr-1">
            <p className="text-[10px] uppercase tracking-widest text-[var(--color-lab-fg-dim)]">M-pool</p>
            <p className="lab-display-num text-sm text-[var(--color-lab-cyan)]">
              {formatVnd(m_pool, true)}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onLeaderboard}
              className="p-2 rounded-lg text-[var(--color-lab-fg-muted)] hover:text-[var(--color-lab-yellow)] hover:bg-[var(--color-lab-surface)] transition-colors"
              aria-label="Bảng xếp hạng"
              title="Bảng xếp hạng"
            >
              <Trophy className="w-4 h-4" strokeWidth={1.75} />
            </button>
            <button
              onClick={onReset}
              className="p-2 rounded-lg text-[var(--color-lab-fg-muted)] hover:text-[var(--color-lab-fg)] hover:bg-[var(--color-lab-surface)] transition-colors"
              aria-label="Bắt đầu lại"
              title="Bắt đầu lại"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Thin progress bar */}
        <div className="h-px bg-[var(--color-lab-border)]">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${((round - 1) / 16) * 100}%`,
              background: `linear-gradient(90deg, var(--color-phase-1), var(--color-phase-2), var(--color-phase-3), var(--color-phase-4))`,
            }}
          />
        </div>

        {playerName && (
          <p className="sr-only">Học viên: {playerName}</p>
        )}
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
