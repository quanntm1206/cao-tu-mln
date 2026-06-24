import { Lightbulb } from 'lucide-react'

interface Props {
  lesson: string
  accent: string
  citation?: string
}

export default function LessonInsight({ lesson, accent, citation }: Props) {
  return (
    <div
      className="relative rounded-xl p-5 border-l-4 lab-card"
      style={{ borderLeftColor: accent }}
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} strokeWidth={2} />
        <div className="flex-1">
          <p className="lab-cite mb-1.5" style={{ color: accent }}>INSIGHT</p>
          <p className="text-sm text-[var(--color-lab-fg)] leading-relaxed">{lesson}</p>
          {citation && <p className="lab-cite mt-2">— {citation}</p>}
        </div>
      </div>
    </div>
  )
}
