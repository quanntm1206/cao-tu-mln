import { useState, useRef, useEffect } from 'react'
import { TOOLTIP_FORMULAS } from '../data/theory'

interface Props {
  metricKey: string
  children: React.ReactNode
}

export default function TheoryTooltip({ metricKey, children }: Props) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const formula = TOOLTIP_FORMULAS[metricKey]

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    if (visible) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [visible])

  if (!formula) return <>{children}</>

  return (
    <span ref={ref} className="relative inline-flex items-center gap-1 cursor-help group">
      {children}
      <button
        onClick={() => setVisible((v) => !v)}
        className="w-4 h-4 rounded-full bg-blue-900 text-blue-400 text-xs flex items-center justify-center hover:bg-blue-800 transition-colors shrink-0"
        aria-label="Xem công thức"
      >
        ?
      </button>
      {visible && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-72 glass-card rounded-xl p-3 shadow-xl border border-blue-800/40">
          <p className="text-xs text-blue-300 font-mono">{formula}</p>
        </div>
      )}
    </span>
  )
}
