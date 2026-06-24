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
  onPhaseAdvance?: () => void
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

export default function ResultSection({ result, accent, prevRound, onContinue, onPhaseAdvance, continueLabel }: Props) {
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
                  <MetricRow label="Σ c (tư bản bất biến)" value={formatVnd(r.total_c, true)} />
                  <MetricRow label="Σ v (tư bản khả biến)" value={formatVnd(r.total_v, true)} accent="#06B6D4" />
                  <MetricRow label="Σ m = v × m′" value={formatVnd(r.total_industrial_profit, true)} accent="var(--color-lab-yellow)" />
                  <MetricRow label="p′ vòng này = m/(c+v)" value={`${(r.p_rate * 100).toFixed(1)}%`} accent={accent} />
                  <MetricRow label="p′ bình quân (trước hội tụ)" value={`${(r.theoretical_average_profit_rate * 100).toFixed(1)}%`} />
                  <MetricRow
                    label="p′ ngành sau xu hướng hội tụ"
                    value={`CK ${(r.post_competition_display_rates.co_khi * 100).toFixed(1)}% · DT ${(r.post_competition_display_rates.det * 100).toFixed(1)}% · DA ${(r.post_competition_display_rates.da * 100).toFixed(1)}%`}
                    accent={accent}
                    big
                  />
                  <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-2">
                    Cạnh tranh giữa các ngành có xu hướng hình thành tỷ suất lợi nhuận bình quân; mô phỏng giản lược chỉ minh họa xu hướng — nguồn gốc m vẫn là v×m′.
                  </p>
                </>
              )
            })()}
            {result.phase === 2 && (() => {
              const r = result as Phase2Result
              return (
                <>
                  <MetricRow label="m đã tạo trong sản xuất (vòng)" value={formatVnd(r.distributable_surplus, true)} />
                  <MetricRow label="Lợi nhuận CN giữ lại" value={formatVnd(r.industrial_profit_after, true)} accent={accent} />
                  <MetricRow label="Lợi nhuận thương nghiệp" value={formatVnd(r.merchant_profit, true)} accent="var(--color-lab-yellow)" />
                  <MetricRow label="m mới do lưu thông tạo ra" value="= 0" />
                  <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-2">Không tạo m mới — chỉ chuyển phần m đã có.</p>
                </>
              )
            })()}
            {result.phase === 3 && (() => {
              const r = result as Phase3Result
              return (
                <>
                  <MetricRow label="Nợ gốc sau vòng" value={formatVnd(r.debt_after, true)} />
                  <MetricRow label="Vốn đang cho vay" value={formatVnd(r.lent_after, true)} />
                  <MetricRow label="Vay thêm (TBCV)" value={formatVnd(r.borrowed_principal, true)} />
                  <MetricRow label="Cho vay khóa (T)" value={formatVnd(r.lent_principal_delta, true)} />
                  <MetricRow label="Gốc cho vay (TBCV)" value={formatVnd(r.t_cho_vay, true)} />
                  <MetricRow label="Lợi tức Z phải trả" value={formatVnd(r.interest_paid, true)} accent="#EF4444" />
                  <MetricRow label="Lợi tức Z thu được" value={formatVnd(r.interest_earned, true)} accent="#10B981" />
                  <MetricRow label={`Z = TBCV × Z′ (${(r.z_prime * 100).toFixed(1)}%)`} value={formatVnd(r.t_cho_vay * r.z_prime, true)} accent={accent} />
                  <MetricRow label="Z phải trả" value={formatVnd(r.interest_paid, true)} accent="#EF4444" />
                  <MetricRow label="Z nhận được" value={formatVnd(r.interest_earned, true)} accent="#10B981" />
                  {r.borrowed_principal > 0 && (
                    <p className="text-[11px] text-[var(--color-lab-fg-dim)]">Tiền vay làm tăng tiền mặt và nợ gốc; không tăng tài sản ròng và không tạo m.</p>
                  )}
                  <MetricRow label="m mới do tài chính tạo ra" value="= 0" />
                  <MetricRow label="Δ thanh khoản (tiền mặt)" value={formatVnd(r.pool_delta, true)} accent={accent} big />
                  <MetricRow label="Tài chính ròng" value={formatVnd(r.net_finance, true)} accent={accent} big />
                </>
              )
            })()}
            {result.phase === 4 && (() => {
              const r = result as Phase4Result
              return (
                <>
                  <MetricRow label="m/lợi nhuận trước địa tô" value={formatVnd(r.profit_before_rent, true)} />
                  <MetricRow label="Địa tô R (phần m nhượng)" value={formatVnd(r.rent_paid_r, true)} accent="#EF4444" />
                  <MetricRow label="m giữ lại sau địa tô" value={formatVnd(r.profit_after_rent, true)} accent={accent} />
                  <MetricRow label="Giá mua đất (tiền mặt)" value={formatVnd(r.land_purchase_price, true)} />
                  <MetricRow label={`P = R / Z′ (${(r.z_prime * 100).toFixed(1)}%)`} value={formatVnd(r.p_land, true)} />
                  <MetricRow label="Tái định giá tài sản đất" value={formatVnd(r.land_asset_revaluation, true)} />
                  <MetricRow label="m mới do đất tạo ra" value="= 0" />
                  <MetricRow label="Δ thanh khoản (tiền mặt)" value={formatVnd(r.pool_delta, true)} accent={accent} big />
                  <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-2">Tái định giá chỉ cộng vào tài sản đất — không cộng vào tài sản/vốn khả dụng.</p>
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

        {isPhaseEnd && onPhaseAdvance && (
          <div className="mb-6">
            <OpenQuestionInline
              phase={result.phase as GamePhase}
              accent={accent}
              onPhaseAdvance={onPhaseAdvance}
            />
          </div>
        )}

        {!isPhaseEnd && (
          <div className="flex justify-center">
            <button
              onClick={onContinue}
              className="lab-btn-primary px-8 py-3.5 rounded-xl font-display flex items-center gap-2"
              data-testid="round-result-footer"
            >
              {continueLabel}
              <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </motion.section>
  )
}
