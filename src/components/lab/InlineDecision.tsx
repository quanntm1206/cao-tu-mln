import { useState, type ReactNode } from 'react'
import { formatVnd } from '../../lib/currency'

interface SliderProps {
  label: string
  hint?: string
  value: number
  max: number
  onChange: (v: number) => void
  disabled?: boolean
  accent: string
}

export function LabSlider({ label, hint, value, max, onChange, disabled, accent }: SliderProps) {
  const safeMax = Math.max(1, max)
  const safeValue = Math.min(value, max)
  const pct = max > 0 ? (safeValue / max) * 100 : 0
  return (
    <div className="select-none">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm text-[var(--color-lab-fg-muted)]">{label}</span>
        <span className="lab-display-num text-base text-[var(--color-lab-fg)]" style={{ color: accent }}>
          {formatVnd(safeValue, true)}
        </span>
      </div>
      <div className="lab-slider-track">
        <div
          className="lab-slider-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, var(--color-lab-yellow))` }}
        />
        <input
          type="range"
          min={0}
          max={safeMax}
          step={1}
          value={safeValue}
          disabled={disabled || max === 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="lab-slider relative z-10"
        />
      </div>
      {hint && <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-1 font-mono">{hint}</p>}
    </div>
  )
}

interface ReadOnlyRowProps {
  label: string
  value: number
  total: number
  hint?: string
  accent: string
}

export function ReadOnlyRow({ label, value, total, hint, accent }: ReadOnlyRowProps) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="select-none">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm text-[var(--color-lab-fg-muted)]">{label}</span>
        <span className="lab-display-num text-base" style={{ color: accent }}>
          {formatVnd(value, true)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-lab-surface-2)] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: accent }} />
      </div>
      {hint && <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-1 font-mono">{hint}</p>}
    </div>
  )
}

interface ControlsCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  ctaLabel: string
  onCommit: () => void
  ctaDisabled?: boolean
  accent: string
}

export function ControlsCard({ title, subtitle, children, ctaLabel, onCommit, ctaDisabled, accent }: ControlsCardProps) {
  return (
    <div className="lab-card-elevated p-6 lg:sticky lg:top-24" style={{ borderColor: `${accent}55` }}>
      <p className="lab-cite mb-1" style={{ color: accent }}>CONTROL_PANEL</p>
      <h3 className="font-display text-lg font-bold mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-[var(--color-lab-fg-muted)] mb-5">{subtitle}</p>}
      <div className="space-y-5 mb-6">{children}</div>
      <button
        onClick={onCommit}
        disabled={ctaDisabled}
        data-testid="apply-round-btn"
        className="lab-btn-primary w-full py-3.5 rounded-xl font-display text-sm"
        style={ctaDisabled ? {} : { background: `linear-gradient(135deg, ${accent}, var(--color-lab-yellow))` }}
      >
        {ctaLabel}
      </button>
    </div>
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint?: string
  accent: string
}

export function LabToggle({ checked, onChange, label, hint, accent }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border transition-all"
      style={{
        borderColor: checked ? accent : 'var(--color-lab-border)',
        background: checked ? `${accent}10` : 'transparent',
      }}
    >
      <div className="text-left">
        <p className="text-sm font-semibold" style={{ color: checked ? accent : 'var(--color-lab-fg)' }}>{label}</p>
        {hint && <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-0.5">{hint}</p>}
      </div>
      <div
        className="relative w-11 h-6 rounded-full transition-colors shrink-0"
        style={{ background: checked ? accent : 'var(--color-lab-surface-2)' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </div>
    </button>
  )
}

interface RadioOption<T extends string> {
  value: T
  label: string
  hint?: string
}

interface RadioGroupProps<T extends string> {
  value: T
  onChange: (v: T) => void
  options: RadioOption<T>[]
  accent: string
}

export function LabRadioGroup<T extends string>({ value, onChange, options, accent }: RadioGroupProps<T>) {
  return (
    <div className="space-y-2">
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all"
            style={{
              borderColor: active ? accent : 'var(--color-lab-border)',
              background: active ? `${accent}10` : 'transparent',
            }}
          >
            <div className="mt-1 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
              style={{ borderColor: active ? accent : 'var(--color-lab-fg-dim)' }}>
              {active && <div className="w-2 h-2 rounded-full" style={{ background: accent }} />}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: active ? accent : 'var(--color-lab-fg)' }}>
                {o.label}
              </p>
              {o.hint && <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-0.5 leading-relaxed">{o.hint}</p>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// Keep a placeholder export so module tree-shakes well in any usage
export const _useDummyState = useState
