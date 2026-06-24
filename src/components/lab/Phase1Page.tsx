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

const profile = (id: 'co_khi' | 'det' | 'da') => SECTOR_PROFILES.find((s) => s.id === id)!
function splitCV(invested: number, id: 'co_khi' | 'det' | 'da') {
  const p = profile(id)
  if (invested <= 0) return { c: 0, v: 0, m: 0 }
  const v = invested / (p.organicComposition + 1)
  const c = invested - v
  const m = v * p.surplusValueRate
  return { c, v, m }
}

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

  const sectorsForChart = useMemo(() => {
    const sectors: Array<'co_khi' | 'det' | 'da'> = ['co_khi', 'det', 'da']
    const invested: Record<string, number> = { co_khi: coKhi, det, da }
    return sectors.map((id) => {
      const p = profile(id)
      const split = splitCV(invested[id], id)
      const sectorColor = id === 'co_khi' ? ACCENT_HEX : id === 'det' ? '#22D3EE' : '#A78BFA'
      return {
        id,
        label: p.label,
        invested: invested[id],
        rate: p.profitRate,
        c: split.c,
        v: split.v,
        m: split.m,
        color: sectorColor,
        archetype: p.archetype,
      }
    })
  }, [coKhi, det, da])

  const hints = [
    'Vòng 1: bắt đầu nhẹ — hãy thử chia đều rồi xem ngành nào sinh lời nhiều nhất.',
    'Vòng 2: cảm nhận rõ p′ khác nhau. Bạn có nên dồn vào ngành tỷ suất cao?',
    'Vòng 3: cạnh tranh giữa ngành sẽ kéo p′ về trung bình — vẫn còn cơ hội.',
    'Vòng 4: vòng cuối của pha. Hãy chọn tổ hợp bạn cho là tối ưu nhất.',
  ]

  return (
    <RoundSection
      roundLabel={`VÒNG ${roundInPhase}/4 · PHÂN BỔ M-POOL`}
      title="Phân bổ vốn vào 3 ngành — đâu là c+v, đâu là m?"
      description={
        <>
          <p>{hints[roundInPhase - 1]}</p>
          <p className="text-[var(--color-lab-fg-dim)] text-sm mt-2">
            <span className="text-[var(--color-lab-fg-muted)]">Vì sao p′ khác nhau?</span> Mỗi ngành có
            cấu tạo hữu cơ <span className="font-mono">c/v</span> khác nhau ⇒ cùng vốn ứng trước,
            ngành thâm dụng lao động (da giày, v cao) sinh m nhiều hơn ngành thâm dụng máy móc (cơ khí, c cao).
          </p>
        </>
      }
      accent={ACCENT_HEX}
      chart={<LiveBarChart sectors={sectorsForChart} mPool={mPool} />}
      controls={
        <ControlsCard
          title={`Phân bổ vòng ${roundInPhase}`}
          subtitle={`Tài sản/vốn khả dụng: ${mPool.toLocaleString('vi-VN')} ₫`}
          ctaLabel={`Áp dụng vòng ${roundInPhase}`}
          onCommit={() => onSubmit({ co_khi: coKhi, det, da })}
          accent={ACCENT_HEX}
        >
          <LabSlider
            label="Cơ khí (p′ = 20%)"
            value={coKhi}
            max={mPool}
            onChange={(v) => handleCo(Math.round((v / mPool) * STEPS))}
            hint={`${coSteps}% V`}
            accent={ACCENT_HEX}
          />
          <LabSlider
            label="Dệt may (p′ = 30%)"
            value={det}
            max={Math.max(0, mPool - coKhi)}
            disabled={maxDetSteps === 0}
            onChange={(v) => setDetSteps(Math.round((v / mPool) * STEPS))}
            hint={`${safeDetSteps}% V`}
            accent="#22D3EE"
          />
          <ReadOnlyRow
            label="Da giày (p′ = 40%) — tự động"
            value={da}
            total={mPool}
            hint="= tổng vốn − cơ khí − dệt may"
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
        subtitle="Pha 1: bạn là nhà tư bản công nghiệp với 200 tỷ ₫ tài sản/vốn khả dụng. Phân bổ vào 3 ngành và quan sát m = v × m′ sinh ra như thế nào qua 4 vòng."
        formula={{
          l: "p'",
          r: "= m / (c + v)   ·   m = v × m'",
          title: 'Tỷ suất lợi nhuận',
          purpose: 'Mỗi đồng vốn k = c + v được tách thành c (tư bản bất biến) và v (tư bản khả biến). Chỉ v sinh ra m = v × m′. c/v khác nhau theo ngành ⇒ p′ khác nhau.',
          analogy:
            'Giống mở quán trà sữa: tiền máy xay + nguyên liệu (c) và tiền lương nhân viên (v). Chỉ giờ làm việc của nhân viên mới tạo thêm lợi nhuận (m); quán nhiều máy móc hơn nhân sự thì mỗi đồng bỏ ra thu về ít hơn (p′ thấp hơn).',
          legend: [
            { sym: "p'", meaning: 'Tỷ suất lợi nhuận = m/(c+v). Mô phỏng: cơ khí 20%, dệt 30%, da 40%' },
            { sym: 'm', meaning: 'Giá trị thặng dư — sinh ra từ v × m\', không phải từ c' },
            { sym: 'c', meaning: 'Tư bản bất biến — máy móc/nguyên liệu, chuyển giá trị nhưng không tự sinh m' },
            { sym: 'v', meaning: 'Tư bản khả biến — tiền công lao động sống, là nguồn duy nhất sinh m' },
            { sym: "m'", meaning: 'Tỷ suất giá trị thặng dư = m/v. Mô phỏng cố định 100%' },
            { sym: 'k', meaning: 'Chi phí sản xuất = c + v — toàn bộ vốn ứng trước' },
            { sym: 'c/v', meaning: 'Cấu tạo hữu cơ tư bản — tỷ lệ c/v của ngành' },
          ],
        }}
        bigNumber={m_pool}
        bigNumberLabel="Tài sản/vốn khả dụng"
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
