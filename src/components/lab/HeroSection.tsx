import { motion } from 'framer-motion'
import { formatVnd } from '../../lib/currency'

interface Props {
  phase: 1 | 2 | 3 | 4
  title: string
  subtitle: string
  formula: { l: string; r: string }
  bigNumber: number
  bigNumberLabel: string
  quote: { text: string; cite: string }
  color: string
}

export default function HeroSection({
  phase, title, subtitle, formula, bigNumber, bigNumberLabel, quote, color,
}: Props) {
  return (
    <section className="relative min-h-[80vh] flex items-center py-16 lg:py-24 border-b border-[var(--color-lab-border)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="lab-phase-chip mb-6"
            style={{ color, background: `${color}1F`, borderColor: `${color}55` }}
          >
            Chapter {phase} of 4 · {bigNumberLabel}
          </span>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-5 max-w-3xl">
            {title}
          </h1>
          <p className="text-lg text-[var(--color-lab-fg-muted)] max-w-2xl leading-relaxed mb-10">
            {subtitle}
          </p>

          {/* Formula card */}
          <div className="lab-card p-6 mb-10 max-w-xl" style={{ borderColor: `${color}55` }}>
            <p className="lab-cite mb-2">FORMULA</p>
            <p className="font-mono text-2xl sm:text-3xl font-bold">
              <span style={{ color }}>{formula.l}</span>
              <span className="text-[var(--color-lab-fg-muted)] ml-2">{formula.r}</span>
            </p>
          </div>

          {/* Big number */}
          <div className="flex items-baseline gap-4 mb-10 flex-wrap">
            <p className="lab-display-num text-6xl sm:text-7xl lg:text-8xl" style={{ color }}>
              {formatVnd(bigNumber, true)}
            </p>
            <p className="text-sm text-[var(--color-lab-fg-dim)] uppercase tracking-widest font-mono">
              {bigNumberLabel}
            </p>
          </div>

          {/* Pull quote */}
          <blockquote className="border-l-2 pl-5 max-w-2xl" style={{ borderColor: color }}>
            <p className="text-[var(--color-lab-fg)] text-base sm:text-lg italic leading-relaxed mb-1">
              “{quote.text}”
            </p>
            <footer className="lab-cite">— {quote.cite}</footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}
