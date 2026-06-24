import { motion } from 'framer-motion'
import { ArrowDown, CheckCircle2 } from 'lucide-react'
import { formatVnd } from '../../lib/currency'
import { useGameStore } from '../../store/gameStore'
import LessonInsight from './LessonInsight'
import OpenQuestionInline from './OpenQuestionInline'
import type { PhaseResult, Phase1Result, Phase2Result, Phase3Result, Phase4Result, GamePhase } from '../../engine/distribution'

const PHASE_END_ROUNDS = [4, 8, 12, 16]

interface Props {
  result: PhaseResult
  accent: string
  prevRound: number
  isLastInPhase: boolean
  onContinue: () => void
  continueLabel: string
}

function MetricRow({ label, value, accent, big }: { label: string; value: string; accent?: string; big?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-[var(--color-lab-border)] last:border-0">
      <span className="text-sm text-[var(--color-lab-fg-muted)]">{label}</span>
      <span
        className={`lab-display-num ${big ? 'text-2xl' : 'text-base'}`}
        style={{ color: accent ?? 'var(--color-lab-fg)' }}
      >
        {value}
      </span>
    </div>
  )
}

export default function ResultSection({ result, accent, prevRound, isLastInPhase, onContinue, continueLabel }: Props) {
  const lastEvent = useGameStore((s) => s.lastEvent)
  const isPhaseEnd = PHASE_END_ROUNDS.includes(prevRound)

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 lg:py-16 border-b border-[var(--color-lab-border)]"
      data-testid="round-result-scroll-area"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5" style={{ color: accent }} strokeWidth={2} />
          <p className="lab-cite" style={{ color: accent }}>
            KẾT QUẢ VÒNG {prevRound} · PHA {result.phase}/4
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="lab-card p-5">
            <p className="lab-cite mb-3">CHỈ SỐ VÒNG</p>
            {result.phase === 1 && (() => {
              const r = result as Phase1Result
              return (
                <>
                  <MetricRow label="Lợi nhuận Cơ khí" value={formatVnd(r.co_khi_profit, true)} />
                  <MetricRow label="Lợi nhuận Dệt may" value={formatVnd(r.det_profit, true)} />
                  <MetricRow label="Lợi nhuận Da giày" value={formatVnd(r.da_profit, true)} />
                  <MetricRow label="Tổng lợi nhuận CN" value={formatVnd(r.total_industrial_profit, true)} accent={accent} big />
                  <MetricRow label="Tỷ suất p′" value={`${(r.p_rate * 100).toFixed(1)}%`} />
                </>
              )
            })()}
            {result.phase === 2 && (() => {
              const r = result as Phase2Result
              return (
                <>
                  <MetricRow label="Lợi nhuận TN nhường" value={formatVnd(r.merchant_profit, true)} accent="var(--color-lab-yellow)" />
                  <MetricRow label="Lợi nhuận CN giữ lại" value={formatVnd(r.industrial_profit_after, true)} accent={accent} big />
                </>
              )
            })()}
            {result.phase === 3 && (() => {
              const r = result as Phase3Result
              return (
                <>
                  <MetricRow label="Lãi đã trả (Z)" value={formatVnd(r.interest_paid, true)} accent="#EF4444" />
                  <MetricRow label="Lãi thu được" value={formatVnd(r.interest_earned, true)} accent="#10B981" />
                  <MetricRow label="Tài chính ròng" value={formatVnd(r.net_finance, true)} accent={accent} big />
                </>
              )
            })()}
            {result.phase === 4 && (() => {
              const r = result as Phase4Result
              return (
                <>
                  <MetricRow label="Địa tô đã trả (R)" value={formatVnd(r.rent_paid, true)} accent="#EF4444" />
                  <MetricRow label="Giá trị đất" value={formatVnd(r.land_value, true)} />
                  <MetricRow label="Gain/Loss đất" value={formatVnd(r.land_gain, true)} accent={accent} big />
                </>
              )
            })()}
          </div>

          <LessonInsight lesson={result.lesson} accent={accent} citation="Giáo trình KTCT Mác–Lênin, Ch.3" />
        </div>

        {lastEvent && (
          <div className="lab-card p-4 mb-6">
            <p className="lab-cite mb-1">SỰ KIỆN ĐÃ ÁP DỤNG</p>
            <p className="text-sm font-semibold mb-1">{lastEvent.title}</p>
            <p className="text-xs text-[var(--color-lab-fg-muted)] leading-relaxed">{lastEvent.resultText}</p>
          </div>
        )}

        {isPhaseEnd && (
          <div className="mb-6">
            <OpenQuestionInline phase={result.phase as GamePhase} accent={accent} />
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="lab-btn-primary px-8 py-3.5 rounded-xl font-display flex items-center gap-2"
            data-testid="round-result-footer"
          >
            {isLastInPhase && !continueLabel.includes('tổng kết') ? 'Sang pha kế tiếp' : continueLabel}
            <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.section>
  )
}
