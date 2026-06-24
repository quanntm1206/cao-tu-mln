import { useGameStore } from '../store/gameStore'
import { CASE_STUDIES } from '../data/caseStudies'
import type { GamePhase } from '../engine/distribution'

export function getCasesForPhase(phase: GamePhase) {
  return CASE_STUDIES.filter((c) => c.phase === phase)
}

export default function CaseStudyPanel() {
  const phase = useGameStore((s) => s.phase)
  const cases = getCasesForPhase(phase)

  if (cases.length === 0) return null

  return (
    <div className="theory-card rounded-xl p-4">
      <p className="text-xs uppercase tracking-wider text-amber-300 mb-3">Case study – Pha {phase}/4</p>
      {cases.map((cs) => (
        <div key={cs.id} className="mb-4 last:mb-0">
          <p className="text-sm font-semibold text-stone-100 leading-snug mb-1">{cs.title}</p>
          <p className="text-xs text-stone-400 mb-2">{cs.summary}</p>
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            {cs.dataPoints.slice(0, 4).map((dp) => (
              <div key={dp.label} className="bg-stone-950/50 rounded-lg p-2">
                <p className="text-[10px] text-stone-500">{dp.label}</p>
                <p className="text-xs font-bold text-amber-200">
                  {typeof dp.value === 'number' ? dp.value.toLocaleString('vi-VN') : dp.value}
                  {dp.unit ? ` ${dp.unit}` : ''}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-stone-500">
            Cong thuc: <span className="text-amber-400">{cs.relatedFormula}</span>
          </p>
          <p className="text-[10px] text-stone-600 mt-0.5">
            {cs.source} ({cs.verifiedDate})
          </p>
        </div>
      ))}
    </div>
  )
}
