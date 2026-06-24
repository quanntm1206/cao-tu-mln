import { useState, useMemo, useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { SECTOR_PROFILES } from '../../data/economyConstants'
import HeroSection from './HeroSection'
import RoundSection from './RoundSection'
import LiveBarChart from './LiveBarChart'
import ResultSection from './ResultSection'
import NarrativeCard from './NarrativeCard'
import PhaseWrapup from './PhaseWrapup'
import { LabSlider, ReadOnlyRow, ControlsCard } from './InlineDecision'

const ACCENT_HEX = '#3B82F6'

interface SectorState {
  co_khi: number
  det: number
  da: number
}

const rate = (id: string) => SECTOR_PROFILES.find((s) => s.id === id)?.profitRate ?? 0.2

function Phase1Round({ onSubmit, mPool, roundInPhase }: { onSubmit: (s: SectorState) => void; mPool: number; roundInPhase: number }) {
  const STEPS = 100
  const [coSteps, setCoSteps] = useState(33)
  const [detSteps, setDetSteps] = useState(33)

  const maxDetSteps = Math.max(0, STEPS - coSteps)
  const safeDetSteps = Math.min(detSteps, maxDetSteps)

  const coKhi = Math.round((coSteps / STEPS) * mPool)
  const det = Math.round((safeDetSteps / STEPS) * mPool)
  const da = Math.max(0, mPool - coKhi - det)

  const handleCo = (steps: number) => {
    setCoSteps(steps)
    setDetSteps((prev) => Math.min(prev, Math.max(0, STEPS - steps)))
  }

  const sectorsForChart = useMemo(
    () => [
      { id: 'co_khi', label: 'Cơ khí', invested: coKhi, rate: rate('co_khi'), color: ACCENT_HEX },
      { id: 'det', label: 'Dệt may', invested: det, rate: rate('det'), color: '#22D3EE' },
      { id: 'da', label: 'Da giày', invested: da, rate: rate('da'), color: '#FACC15' },
    ],
    [coKhi, det, da],
  )

  const hints = [
    'Vòng 1: bắt đầu nhẹ — hãy thử chia đều rồi xem ngành nào sinh lời nhiều nhất.',
    'Vòng 2: cảm nhận rõ p′ khác nhau. Bạn có nên dồn vào ngành tỷ suất cao?',
    'Vòng 3: cạnh tranh giữa ngành sẽ kéo p′ về trung bình — vẫn còn cơ hội.',
    'Vòng 4: vòng cuối của pha. Hãy chọn tổ hợp bạn cho là tối ưu nhất.',
  ]

  return (
    <RoundSection
      roundLabel={`VÒNG ${roundInPhase}/4 · PHÂN BỔ M-POOL`}
      title="Đầu tư M-pool vào 3 ngành — đâu là vốn, đâu là lợi nhuận?"
      description={
        <>
          <p>{hints[roundInPhase - 1]}</p>
          <p className="text-[var(--color-lab-fg-dim)] text-sm mt-2">
            Tỷ suất p′ cố định theo ngành: Cơ khí 20% · Dệt may 30% · Da giày 40%.
          </p>
        </>
      }
      accent={ACCENT_HEX}
      chart={<LiveBarChart sectors={sectorsForChart} mPool={mPool} />}
      controls={
        <ControlsCard
          title={`Phân bổ vòng ${roundInPhase}`}
          subtitle={`Tổng M-pool: ${mPool.toLocaleString('vi-VN')} ₫`}
          ctaLabel={`Áp dụng vòng ${roundInPhase}`}
          onCommit={() => onSubmit({ co_khi: coKhi, det, da })}
          accent={ACCENT_HEX}
        >
          <LabSlider
            label="Cơ khí (p′ = 20%)"
            value={coKhi}
            max={mPool}
            onChange={(v) => handleCo(Math.round((v / mPool) * STEPS))}
            hint={`${coSteps}% M-pool`}
            accent={ACCENT_HEX}
          />
          <LabSlider
            label="Dệt may (p′ = 30%)"
            value={det}
            max={Math.max(0, mPool - coKhi)}
            disabled={maxDetSteps === 0}
            onChange={(v) => setDetSteps(Math.round((v / mPool) * STEPS))}
            hint={`${safeDetSteps}% M-pool`}
            accent="#22D3EE"
          />
          <ReadOnlyRow
            label="Da giày (p′ = 40%) — tự động"
            value={da}
            total={mPool}
            hint="= M-pool − cơ khí − dệt may"
            accent="#FACC15"
          />
        </ControlsCard>
      }
    />
  )
}

const PHASE1_TAKEAWAYS = [
  'Lợi nhuận công nghiệp xuất phát từ giá trị thặng dư trong sản xuất — không phải từ lưu thông hay tỷ giá.',
  'Mỗi ngành có cấu tạo hữu cơ của tư bản khác nhau (c/v), nên tỷ suất p′ khác nhau — đó là lý do giáo trình tách c và v.',
  'Cạnh tranh giữa các ngành kéo tỷ suất về bình quân toàn xã hội — tiền đề của lý thuyết giá cả sản xuất.',
  'Tích lũy công nghiệp là nền tảng cho 3 pha tiếp theo: TN, tài chính, đất đai.',
]

interface Props { onNextPhase: () => void }

export default function Phase1Page({ onNextPhase }: Props) {
  const {
    round, m_pool, applyRound, pendingLesson, pendingQuickEvent, lastResult, dismissLesson, phase,
  } = useGameStore()
  const resultRef = useRef<HTMLDivElement | null>(null)
  const eventRef = useRef<HTMLDivElement | null>(null)

  const roundInPhase = ((round - 1) % 4) + 1
  const showResult = pendingLesson && lastResult?.phase === 1
  const showEvent = !!pendingQuickEvent
  const phaseDone = phase > 1

  useEffect(() => {
    if (showEvent && eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [showEvent])

  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showResult, round])

  const continueLabel = round > 16 ? 'Xem tổng kết' : phase > 1 ? 'Sang Pha 2 · Thương nghiệp' : `Tiếp tục vòng ${round}`

  return (
    <div className="lab-scroll-snap">
      <HeroSection
        phase={1}
        title="Sản xuất tạo ra giá trị — m từ đâu mà có?"
        subtitle="Pha 1: bạn là nhà tư bản công nghiệp với 200 tỷ ₫ M-pool. Phân bổ vào 3 ngành và quan sát giá trị thặng dư sinh ra như thế nào qua 4 vòng."
        formula={{
          l: "p'",
          r: '= m / (c + v)',
          title: 'Tỷ suất lợi nhuận',
          purpose: 'Đo hiệu quả sinh lời của vốn — bao nhiêu m thu được trên mỗi đồng vốn ứng trước (c+v). Là cơ sở để so sánh các ngành.',
          legend: [
            { sym: "p'", meaning: 'Tỷ suất lợi nhuận (%)' },
            { sym: 'm', meaning: 'Giá trị thặng dư — phần lợi nhuận do lao động sống tạo ra' },
            { sym: 'c', meaning: 'Tư bản bất biến — máy móc, nguyên liệu (không tự sinh giá trị)' },
            { sym: 'v', meaning: 'Tư bản khả biến — tiền công lao động (biến thành giá trị mới)' },
          ],
        }}
        bigNumber={m_pool}
        bigNumberLabel="M-pool hiện có"
        quote={{
          text: 'Lưu thông không tạo ra giá trị mới. Giá trị thặng dư có nguồn gốc trong sản xuất.',
          cite: 'Mác, Tư bản, dẫn theo Giáo trình KTCT Mác–Lênin, Chương 3, tr.70',
        }}
        color={ACCENT_HEX}
      />

      {showEvent && (
        <section ref={eventRef} className="py-12 border-b border-[var(--color-lab-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <NarrativeCard event={pendingQuickEvent!} accent={ACCENT_HEX} />
          </div>
        </section>
      )}

      {!phaseDone && !showResult && !showEvent && (
        <Phase1Round
          key={`r${round}`}
          onSubmit={(s) => applyRound(s as unknown as Record<string, unknown>)}
          mPool={m_pool}
          roundInPhase={roundInPhase}
        />
      )}

      {showResult && (
        <div ref={resultRef}>
          <ResultSection
            result={lastResult!}
            accent={ACCENT_HEX}
            prevRound={round - 1}
            isLastInPhase={(round - 1) % 4 === 0 && round > 1}
            onContinue={dismissLesson}
            continueLabel={continueLabel}
          />
        </div>
      )}

      {phaseDone && !showResult && (
        <PhaseWrapup
          phase={1}
          nextPhaseLabel="Sang Pha 2 · Thương nghiệp"
          takeaways={PHASE1_TAKEAWAYS}
          accent={ACCENT_HEX}
          onContinue={onNextPhase}
        />
      )}
    </div>
  )
}
