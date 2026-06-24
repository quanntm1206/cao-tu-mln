import { motion } from 'framer-motion'
import { formatVnd } from '../../lib/currency'

export interface FormulaLegend {
  sym: string
  meaning: string
}

export interface FormulaSpec {
  l: string
  r: string
  title?: string
  purpose?: string
  analogy?: string
  legend?: FormulaLegend[]
}

interface Props {
  phase: 1 | 2 | 3 | 4
  title: string
  subtitle: string
  formula: FormulaSpec
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

          {/* Formula card with explanation */}
          <div className="lab-card p-6 mb-10 max-w-2xl" style={{ borderColor: `${color}55` }}>
            <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <p className="lab-cite" style={{ color }}>
                FORMULA{formula.title ? ` · ${formula.title}` : ''}
              </p>
            </div>

            <p className="font-mono text-2xl sm:text-3xl font-bold mb-4">
              <span style={{ color }}>{formula.l}</span>
              <span className="text-[var(--color-lab-fg-muted)] ml-2">{formula.r}</span>
            </p>

            {formula.purpose && (
              <div className="mb-4 pb-4 border-b border-[var(--color-lab-border)]">
                <p className="lab-cite mb-1.5 text-[var(--color-lab-fg-dim)]">DÙNG ĐỂ LÀM GÌ</p>
                <p className="text-sm text-[var(--color-lab-fg)] leading-relaxed">{formula.purpose}</p>
                {formula.analogy && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-lab-border)]/60">
                    <p className="lab-cite mb-1.5 text-[var(--color-lab-fg-dim)]">LIÊN TƯỞNG DỄ HIỂU</p>
                    <p className="text-sm text-[var(--color-lab-fg-muted)] leading-relaxed italic">
                      {formula.analogy}
                    </p>
                  </div>
                )}
              </div>
            )}

            {formula.legend && formula.legend.length > 0 && (
              <div>
                <p className="lab-cite mb-2 text-[var(--color-lab-fg-dim)]">Ý NGHĨA KÝ HIỆU</p>
                <dl className="grid sm:grid-cols-2 gap-x-5 gap-y-2">
                  {formula.legend.map((item) => (
                    <div key={item.sym} className="flex items-baseline gap-2">
                      <dt
                        className="font-mono font-bold text-sm shrink-0 min-w-[2.25rem]"
                        style={{ color }}
                      >
                        {item.sym}
                      </dt>
                      <dd className="text-xs text-[var(--color-lab-fg-muted)] leading-relaxed">
                        {item.meaning}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
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
