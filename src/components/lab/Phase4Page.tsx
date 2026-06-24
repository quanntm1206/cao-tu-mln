import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'
import { R_CASE_HOAI_DUC, R_CASE_BAC_NINH } from '../../data/economyConstants'
import { LAND_COMMIT_FRACTION } from '../../engine/distribution'
import HeroSection from './HeroSection'
import RoundSection from './RoundSection'
import ResultSection from './ResultSection'
import NarrativeCard from './NarrativeCard'
import PhaseWrapup from './PhaseWrapup'
import { ControlsCard, LabRadioGroup } from './InlineDecision'

const ACCENT = '#EC4899'

type LandChoice = 'buy' | 'rent' | 'speculate' | 'none'

// Per-round gain rates (relative to commit amount)
const RATES = {
  buy:     [0.2025, 0.2025, 0.2025, 0.2025] as const, // Hoài Đức steady +20%/round
  rent:    [-0.05, -0.05, -0.05, -0.05] as const,     // pay rent each round
  speculate: [0.20, 0.20, 0.02, -0.15] as const,      // BN bubble → crash
  none:    [0, 0, 0, 0] as const,
}

function LandPriceCurve({ choice, mPool, roundInPhase }: { choice: LandChoice; mPool: number; roundInPhase: number }) {
  const commit = mPool * LAND_COMMIT_FRACTION
  const rates = RATES[choice]

  // Trajectory of cumulative commit value across 4 rounds (relative to commit baseline)
  // After round k: cumulative gain = sum of (commit * rate_i) for i = 0..k-1
  const trajectory = [commit]
  let running = commit
  for (let i = 0; i < 4; i += 1) {
    running += commit * rates[i]
    trajectory.push(running)
  }

  const maxVal = Math.max(...trajectory, commit * 1.1)
  const minVal = Math.min(...trajectory, commit * 0.9)
  const range = maxVal - minVal || commit * 0.2

  const W = 320
  const H = 160

  const pointsXY = trajectory.map((v, i) => {
    const x = (i / (trajectory.length - 1)) * W
    const y = H - ((v - minVal) / range) * H
    return { x, y, v }
  })

  const linePath = pointsXY.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`

  const isLoss = trajectory[4] < commit
  const stroke = isLoss ? '#EF4444' : ACCENT

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <p className="lab-cite mb-2" style={{ color: ACCENT }}>QUỸ ĐẤT · {(LAND_COMMIT_FRACTION * 100).toFixed(0)}% V / vòng</p>
      <h3 className="font-display text-xl font-bold mb-1">
        {formatVnd(commit, true)} cam kết vào đất mỗi vòng
      </h3>
      <p className="text-sm text-[var(--color-lab-fg-muted)] mb-5">
        Đường giá trị quỹ đất {(R_CASE_HOAI_DUC.priceGrowthPct * 100).toFixed(0)}% (Hoài Đức) vs {(R_CASE_BAC_NINH.bubbleGrowthPct * 100).toFixed(0)}% → {(R_CASE_BAC_NINH.crashPct * 100).toFixed(0)}% (Bắc Ninh)
      </p>

      <div className="relative w-full" style={{ paddingBottom: '50%' }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Baseline (commit reference) */}
          {(() => {
            const baselineY = H - ((commit - minVal) / range) * H
            return (
              <line
                x1={0}
                y1={baselineY}
                x2={W}
                y2={baselineY}
                stroke="var(--color-lab-fg-dim)"
                strokeDasharray="3,4"
                strokeWidth="0.5"
              />
            )
          })()}
          <motion.path
            d={areaPath}
            fill="url(#landGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke={stroke}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
          {pointsXY.map((pt, i) => {
            const isActive = i === roundInPhase
            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 6 : 3.5}
                  fill={isActive ? 'var(--color-lab-yellow)' : stroke}
                  stroke="var(--color-lab-bg)"
                  strokeWidth={2}
                />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="grid grid-cols-4 gap-1 mt-4 text-center">
        {['Khởi đầu', 'Vòng 1', 'Vòng 2', 'Vòng 3', 'Vòng 4'].slice(1).map((label, i) => {
          const v = trajectory[i + 1]
          const delta = v - commit
          const isCurrent = i + 1 === roundInPhase
          return (
            <div key={label}>
              <p className="font-mono text-[10px] text-[var(--color-lab-fg-dim)]">{label}</p>
              <p
                className="lab-display-num text-xs mt-0.5"
                style={{ color: isCurrent ? 'var(--color-lab-yellow)' : delta >= 0 ? ACCENT : '#EF4444' }}
              >
                {delta >= 0 ? '+' : ''}{formatVnd(delta, true)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[var(--color-lab-border)]">
        <Stat label="Cam kết / vòng" value={formatVnd(commit, true)} />
        <Stat label="Tổng kết dự kiến" value={formatVnd(trajectory[4] - commit, true)} accent={trajectory[4] >= commit ? ACCENT : '#EF4444'} />
        <Stat label="% biến động" value={`${(((trajectory[4] - commit) / commit) * 100).toFixed(1)}%`} accent={trajectory[4] >= commit ? ACCENT : '#EF4444'} />
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--color-lab-fg-dim)]">{label}</p>
      <p className="font-mono text-sm mt-1" style={{ color: accent ?? 'var(--color-lab-fg)' }}>{value}</p>
    </div>
  )
}

function Phase4Round({ onSubmit, mPool, roundInPhase }: { onSubmit: (d: { landChoice: LandChoice }) => void; mPool: number; roundInPhase: number }) {
  const [choice, setChoice] = useState<LandChoice>('none')
  const commit = mPool * LAND_COMMIT_FRACTION
  const rate = RATES[choice][roundInPhase - 1] ?? 0
  const projectedGain = commit * rate

  return (
    <RoundSection
      roundLabel={`VÒNG ${12 + roundInPhase}/16 · ĐẤT ĐAI · R`}
      title="Địa tô R — phần m chảy về tay chủ đất"
      description={
        <div>
          <p>Mỗi vòng bạn cam kết <span className="font-mono text-[var(--color-lab-yellow)]">{formatVnd(commit, true)}</span> ({(LAND_COMMIT_FRACTION * 100).toFixed(0)}% V) vào đất.</p>
          <p className="text-sm mt-1">Choice định hình lợi/lỗ trên cam kết đó — dữ liệu thực Việt Nam 2024.</p>
        </div>
      }
      accent={ACCENT}
      chart={<LandPriceCurve choice={choice} mPool={mPool} roundInPhase={roundInPhase} />}
      controls={
        <ControlsCard
          title={`Quyết định vòng ${roundInPhase}`}
          subtitle={`Cam kết vòng này: ${formatVnd(commit, true)}`}
          ctaLabel={`Áp dụng vòng ${roundInPhase}`}
          onCommit={() => onSubmit({ landChoice: choice })}
          accent={ACCENT}
        >
          <LabRadioGroup<LandChoice>
            value={choice}
            onChange={setChoice}
            accent={ACCENT}
            options={[
              { value: 'none', label: 'Không liên quan đất', hint: 'Giữ V ngoài đất, không gain/loss' },
              { value: 'buy', label: 'Mua đất Hoài Đức', hint: `Tăng đều ~${(RATES.buy[0] * 100).toFixed(0)}%/vòng (sóng BĐS 2024)` },
              { value: 'rent', label: 'Thuê đất sản xuất', hint: `Trả R ổn định ~${Math.abs(RATES.rent[0] * 100).toFixed(0)}%/vòng (drag)` },
              { value: 'speculate', label: 'Đầu cơ Bắc Ninh', hint: 'Bong bóng +20%/vòng đầu rồi sụp −15% cuối' },
            ]}
          />
          {choice !== 'none' && (
            <div className="rounded-lg p-3 border" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}10` }}>
              <p className="lab-cite mb-1" style={{ color: ACCENT }}>DỰ KIẾN VÒNG NÀY</p>
              <p className="lab-display-num text-lg" style={{ color: projectedGain >= 0 ? ACCENT : '#EF4444' }}>
                {projectedGain >= 0 ? '+' : ''}{formatVnd(projectedGain, true)}
              </p>
              <p className="text-[11px] text-[var(--color-lab-fg-muted)] mt-1">
                {(rate * 100).toFixed(1)}% × {formatVnd(commit, true)}
              </p>
            </div>
          )}
        </ControlsCard>
      }
    />
  )
}

const TAKEAWAYS = [
  'Địa tô R là phần giá trị thặng dư mà chủ đất chiếm — không từ lao động của họ, mà từ độc quyền sở hữu.',
  'Công thức Giá cả đất đai = Địa tô / Tỷ suất lợi tức ngân hàng: đất không có giá trị, nhưng có giá cả vốn hóa từ địa tô tương lai.',
  'Bong bóng giá đất phản ánh kỳ vọng đầu cơ, không phải giá trị thực — đó là rủi ro của thị trường BĐS VN.',
]

interface Props { onComplete: () => void }

export default function Phase4Page({ onComplete }: Props) {
  const {
    round, m_pool, applyRound, pendingLesson, pendingQuickEvent, lastResult, dismissLesson, gameOver,
  } = useGameStore()
  const resultRef = useRef<HTMLDivElement | null>(null)
  const eventRef = useRef<HTMLDivElement | null>(null)

  const roundInPhase = ((round - 1) % 4) + 1
  const showResult = pendingLesson && lastResult?.phase === 4
  const showEvent = !!pendingQuickEvent

  useEffect(() => { if (showEvent && eventRef.current) eventRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, [showEvent])
  useEffect(() => { if (showResult && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [showResult, round])

  return (
    <div className="lab-scroll-snap">
      <HeroSection
        phase={4}
        title="Địa tô: phần m chảy về tay chủ đất."
        subtitle="Pha 4: Đất không có giá trị theo nghĩa sản phẩm lao động; Giá cả đất đai = Địa tô / Tỷ suất lợi tức ngân hàng. Mua đất trừ vốn khả dụng; thuê đất trả địa tô."
                formula={{
          l: 'Giá cả đất đai',
          r: '= Địa tô / Tỷ suất lợi tức ngân hàng',
          title: 'Tô bản hóa địa tô',
          purpose: 'Đất không có giá trị (không do lao động tạo ra) nhưng có giá cả — Giá cả đất đai = Địa tô / Tỷ suất lợi tức ngân hàng vốn hóa dòng địa tô tương lai. Khi tỷ suất lợi tức ngân hàng giảm → giá cả đất đai tăng dù địa tô không đổi.',
          legend: [
            { sym: 'Địa tô', meaning: 'R — phần m mà chủ đất chiếm hàng năm (₫/m²/năm)' },
            { sym: 'Tỷ suất lợi tức ngân hàng', meaning: 'Z′ — giá của tư bản tiền tệ, dùng làm mẫu số vốn hóa' },
            { sym: 'Giá cả đất đai', meaning: 'Vốn hóa địa tô tương lai về hiện tại (₫/m²)' },
          ],
        }}
        bigNumber={m_pool * LAND_COMMIT_FRACTION}
        bigNumberLabel={`${(LAND_COMMIT_FRACTION * 100).toFixed(0)}% V cam kết`}
        quote={{ text: 'Đất không phải sản phẩm lao động, nhưng có giá cả — đó là tô bản hóa.', cite: 'Giáo trình KTCT Mác–Lênin, Ch.3, tr.77' }}
        color={ACCENT}
      />

      {showEvent && (
        <section ref={eventRef} className="py-12 border-b border-[var(--color-lab-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <NarrativeCard event={pendingQuickEvent!} accent={ACCENT} />
          </div>
        </section>
      )}

      {!gameOver && !showResult && !showEvent && (
        <Phase4Round
          key={`r${round}`}
          onSubmit={(d) => applyRound(d as unknown as Record<string, unknown>)}
          mPool={m_pool}
          roundInPhase={roundInPhase}
        />
      )}

      {showResult && (
        <div ref={resultRef}>
          <ResultSection
            result={lastResult!}
            accent={ACCENT}
            prevRound={round - 1}
            isLastInPhase={false}
            onContinue={dismissLesson}
            continueLabel={gameOver ? 'Xem tổng kết' : `Tiếp tục vòng ${round}`}
          />
        </div>
      )}

      {gameOver && !showResult && (
        <PhaseWrapup
          phase={4}
          nextPhaseLabel="Xem tổng kết toàn học phần"
          takeaways={TAKEAWAYS}
          accent={ACCENT}
          onContinue={onComplete}
        />
      )}
    </div>
  )
}
