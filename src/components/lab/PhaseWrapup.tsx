import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Props {
  phase: 1 | 2 | 3 | 4
  nextPhaseLabel: string
  takeaways: string[]
  accent: string
  onContinue: () => void
}

export default function PhaseWrapup({ phase, nextPhaseLabel, takeaways, accent, onContinue }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-20 lg:py-28"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="lab-cite mb-3" style={{ color: accent }}>WRAP UP · KẾT THÚC PHA {phase}</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black leading-tight mb-8">
          Bạn vừa khám phá <span style={{ color: accent }}>{phase} / 4</span> giai đoạn của
          phân chia giá trị thặng dư.
        </h2>

        <div className="space-y-3 mb-10 text-left">
          {takeaways.map((t, i) => (
            <div key={i} className="lab-card p-4 flex gap-3 items-start">
              <span className="lab-display-num text-xl shrink-0" style={{ color: accent }}>
                0{i + 1}
              </span>
              <p className="text-sm text-[var(--color-lab-fg)] leading-relaxed">{t}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onContinue}
          data-testid="phase-wrapup-next"
          className="lab-btn-primary px-10 py-4 rounded-xl font-display text-base inline-flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, ${accent}, var(--color-lab-yellow))` }}
        >
          {nextPhaseLabel}
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </motion.section>
  )
}
