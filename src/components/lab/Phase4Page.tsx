import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'
import { R_CASE_HOAI_DUC, R_CASE_BAC_NINH, Z_RATE_TABLE_2022_2024 } from '../../data/economyConstants'
import { calcLandPrice } from '../../engine/economy'
import HeroSection from './HeroSection'
import RoundSection from './RoundSection'
import ResultSection from './ResultSection'
import NarrativeCard from './NarrativeCard'
import PhaseWrapup from './PhaseWrapup'
import { ControlsCard, LabRadioGroup } from './InlineDecision'

const ACCENT = '#EC4899'

type LandChoice = 'buy' | 'rent' | 'speculate' | 'none'

function LandPriceCurve({ choice, roundInPhase }: { choice: LandChoice; roundInPhase: number }) {
  const z = Z_RATE_TABLE_2022_2024.mid_2024
  const hoaiDucPrice = calcLandPrice(R_CASE_HOAI_DUC.rentPerSqmYear, z)
  const bacNinhPrice = calcLandPrice(R_CASE_BAC_NINH.rentPerSqmYear, z)

  // Synthetic price trajectory across 4 rounds for the chosen scenario
  const points = (() => {
    if (choice === 'buy') {
      const base = hoaiDucPrice
      const growth = R_CASE_HOAI_DUC.priceGrowthPct / 4
      return [base, base * (1 + growth), base * (1 + 2 * growth), base * (1 + 3 * growth), base * (1 + 4 * growth)]
    }
    if (choice === 'speculate') {
      const base = bacNinhPrice
      const peak = base * (1 + R_CASE_BAC_NINH.bubbleGrowthPct)
      const crashed = peak * (1 + R_CASE_BAC_NINH.crashPct)
      return [base, base * 1.15, base * 1.30, peak, crashed]
    }
    if (choice === 'rent') {
      const base = R_CASE_HOAI_DUC.rentPerSqmYear
      return [0, -base / 4, -base / 2, -base * 3 / 4, -base]
    }
    return [0, 0, 0, 0, 0]
  })()

  const minVal = Math.min(...points, 0)
  const maxVal = Math.max(...points, 0)
  const range = maxVal - minVal || 1

  const W = 320
  const H = 160
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * W
    const y = H - ((p - minVal) / range) * H
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <p className="lab-cite mb-2" style={{ color: ACCENT }}>BĐS · HOÀI ĐỨC vs BẮC NINH (2024)</p>
      <h3 className="font-display text-xl font-bold mb-6">
        Giá đất = <span style={{ color: ACCENT }}>R / i</span> — đầu cơ thì khác thế nào?
      </h3>

      <div className="relative w-full" style={{ paddingBottom: '50%' }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {[0.25, 0.5, 0.75].map((y) => (
            <line key={y} x1={0} y1={H * y} x2={W} y2={H * y} stroke="var(--color-lab-border)" strokeDasharray="2,4" />
          ))}
          <motion.path
            d={path}
            fill="none"
            stroke={choice === 'speculate' ? '#EF4444' : ACCENT}
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
          {points.map((p, i) => {
            const x = (i / (points.length - 1)) * W
            const y = H - ((p - minVal) / range) * H
            const isActive = i === roundInPhase
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={isActive ? 6 : 3.5}
                fill={isActive ? 'var(--color-lab-yellow)' : ACCENT}
                stroke="var(--color-lab-bg)"
                strokeWidth={2}
              />
            )
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[var(--color-lab-border)]">
        <Stat label="R Hoài Đức" value={formatVnd(R_CASE_HOAI_DUC.rentPerSqmYear, true) + '/m²/năm'} />
        <Stat label="Giá đất = R/i" value={formatVnd(hoaiDucPrice, true) + '/m²'} accent={ACCENT} />
        <Stat label="Bong bóng BN" value={'+' + (R_CASE_BAC_NINH.bubbleGrowthPct * 100).toFixed(0) + '% → ' + (R_CASE_BAC_NINH.crashPct * 100).toFixed(0) + '%'} accent="#EF4444" />
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

function Phase4Round({ onSubmit, roundInPhase }: { onSubmit: (d: { landChoice: LandChoice }) => void; roundInPhase: number }) {
  const [choice, setChoice] = useState<LandChoice>('none')

  return (
    <RoundSection
      roundLabel={`VÒNG ${12 + roundInPhase}/16 · ĐẤT ĐAI · R`}
      title="Địa tô R — phần m mà chủ đất chiếm về"
      description={<p>Đất là tư liệu sản xuất không thể tái tạo. Mỗi vòng bạn chọn 1 trong 4 hướng và quan sát biến động giá đất thực tế Việt Nam.</p>}
      accent={ACCENT}
      chart={<LandPriceCurve choice={choice} roundInPhase={roundInPhase} />}
      controls={
        <ControlsCard
          title={`Quyết định vòng ${roundInPhase}`}
          subtitle="Dữ liệu: DKRA 2024, Hoài Đức & Bắc Ninh"
          ctaLabel={`Áp dụng vòng ${roundInPhase}`}
          onCommit={() => onSubmit({ landChoice: choice })}
          accent={ACCENT}
        >
          <LabRadioGroup<LandChoice>
            value={choice}
            onChange={setChoice}
            accent={ACCENT}
            options={[
              { value: 'none', label: 'Không liên quan đất', hint: 'Giữ nguyên M-pool, không R cũng không gain/loss' },
              { value: 'buy', label: 'Mua đất Hoài Đức', hint: 'Giá đất = R/i, tăng 81% trong sóng 2024' },
              { value: 'rent', label: 'Thuê đất sản xuất', hint: 'Trả địa tô R ổn định mỗi vòng' },
              { value: 'speculate', label: 'Đầu cơ Bắc Ninh', hint: 'Bong bóng +40% rồi sụp -15%' },
            ]}
          />
        </ControlsCard>
      }
    />
  )
}

const TAKEAWAYS = [
  'Địa tô R là phần giá trị thặng dư mà chủ đất chiếm — không từ lao động của họ, mà từ độc quyền sở hữu.',
  'Công thức giá đất = R / i: đất không có giá trị, nhưng có giá cả vốn hóa từ địa tô tương lai.',
  'Bong bóng giá đất phản ánh kỳ vọng đầu cơ, không phải giá trị thực — đó là rủi ro của thị trường BĐS VN.',
]

interface Props { onComplete: () => void }

export default function Phase4Page({ onComplete }: Props) {
  const {
    round, applyRound, pendingLesson, pendingQuickEvent, lastResult, dismissLesson, gameOver,
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
        subtitle="Pha cuối: bạn ra quyết định mua, thuê, hoặc đầu cơ đất — dữ liệu BĐS Việt Nam 2024."
        formula={{ l: 'Giá đất', r: '= R / i' }}
        bigNumber={R_CASE_HOAI_DUC.pricePerSqm}
        bigNumberLabel="Hoài Đức (giá/m²)"
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
