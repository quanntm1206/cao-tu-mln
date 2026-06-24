import { getTeachingAidForRound } from '../data/teachingAids'

export default function TeachingFocus({ round }: { round: number }) {
  const aid = getTeachingAidForRound(round)

  return (
    <div className="theory-card rounded-xl p-4 mb-4">
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-2">Mục tiêu học tập vòng {round}</p>
        <p className="text-sm font-semibold text-stone-50 leading-relaxed">{aid.objective}</p>
        <p className="text-xs text-stone-400 mt-2">🎯 {aid.focusMetric}</p>
      </div>
    </div>
  )
}
