import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import type { ResolvedQuickEvent, QuickEventChoice } from '../../data/quickEvents'

interface Props {
  event: ResolvedQuickEvent
  accent: string
}

export default function NarrativeCard({ event, accent }: Props) {
  const chooseQuickEvent = useGameStore((s) => s.chooseQuickEvent)
  const [selected, setSelected] = useState<QuickEventChoice | null>(null)

  return (
    <div className="lab-card-elevated p-6" style={{ borderColor: `${accent}55` }}>
      <div className="flex items-start gap-3 mb-4">
        <Sparkles className="w-5 h-5 mt-1 shrink-0" style={{ color: accent }} strokeWidth={2} />
        <div className="flex-1">
          <p className="lab-cite mb-1" style={{ color: accent }}>SỰ KIỆN · VÒNG {event.round}</p>
          <h3 className="font-display text-xl font-bold leading-tight">{event.title}</h3>
        </div>
      </div>

      <p className="text-sm text-[var(--color-lab-fg-muted)] leading-relaxed mb-4">
        {event.description}
      </p>

      {!selected ? (
        <div className="space-y-2">
          {event.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              data-testid="narrative-choice"
              onClick={() => setSelected(c)}
              className="w-full text-left p-4 rounded-lg border border-[var(--color-lab-border)] hover:border-[var(--color-lab-cyan)] hover:bg-[var(--color-lab-cyan-soft)] transition-all"
            >
              <p className="text-sm font-semibold text-[var(--color-lab-fg)] mb-1">{c.label}</p>
              <p className="text-xs text-[var(--color-lab-fg-muted)] leading-relaxed">{c.resultText}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg p-4" style={{ background: `${accent}10`, borderLeft: `3px solid ${accent}` }}>
            <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: accent }}>BẠN CHỌN</p>
            <p className="text-sm font-semibold text-[var(--color-lab-fg)] mb-2">{selected.label}</p>
            <p className="text-xs text-[var(--color-lab-fg-muted)] leading-relaxed mb-2">{selected.resultText}</p>
            <p className="text-xs text-[var(--color-lab-fg-muted)] leading-relaxed">
              <span className="font-semibold">Liên hệ:</span> {selected.teachingPoint}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(null)}
              className="lab-btn-ghost flex-1 py-2.5 rounded-lg text-sm"
            >
              Chọn lại
            </button>
            <button
              data-testid="narrative-continue"
              onClick={() => chooseQuickEvent(selected.id)}
              className="lab-btn-primary flex-[1.5] py-2.5 rounded-lg text-sm"
            >
              Tiếp tục vòng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
