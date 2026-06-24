import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  roundLabel: string
  title: string
  description?: ReactNode
  chart: ReactNode
  controls: ReactNode
  accent: string
  footer?: ReactNode
}

export default function RoundSection({ roundLabel, title, description, chart, controls, accent, footer }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="py-16 lg:py-20 border-b border-[var(--color-lab-border)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <p className="lab-cite mb-2" style={{ color: accent }}>{roundLabel}</p>
          <h2 className="font-display text-3xl sm:text-4xl font-black leading-tight mb-3">{title}</h2>
          {description && (
            <div className="text-[var(--color-lab-fg-muted)] text-base leading-relaxed">{description}</div>
          )}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-10 items-start">
          <div className="lg:order-1 order-2">{chart}</div>
          <div className="lg:order-2 order-1">{controls}</div>
        </div>

        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </motion.section>
  )
}
