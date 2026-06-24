import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'
import { Z_RATE_TABLE_2022_2024 } from '../../data/economyConstants'
import HeroSection from './HeroSection'
import RoundSection from './RoundSection'
import ResultSection from './ResultSection'
import NarrativeCard from './NarrativeCard'
import PhaseWrapup from './PhaseWrapup'
import { LabSlider, ControlsCard, LabRadioGroup } from './InlineDecision'

const ACCENT = '#F59E0B'

const Z_HISTORY: Array<{ year: string; rate: number; label: string }> = [
  { year: '2022', rate: Z_RATE_TABLE_2022_2024.peak_2022, label: 'Đỉnh Z′' },
  { year: '2023', rate: Z_RATE_TABLE_2022_2024.mid_2024, label: 'Hạ nhiệt' },
  { year: 'Q1/2024', rate: Z_RATE_TABLE_2022_2024.low_2024, label: 'Đáy lãi' },
  { year: 'Q4/2024', rate: Z_RATE_TABLE_2022_2024.rebound_2024, label: 'Bật lại' },
]

function InterestChart({ action, amount, roundInPhase }: { action: 'borrow' | 'lend' | 'none'; amount: number; roundInPhase: number }) {
  const currentZ = Z_HISTORY[roundInPhase - 1]?.rate ?? Z_HISTORY[1].rate
  const interestPaid = action === 'borrow' ? amount * currentZ : 0
  const interestEarned = action === 'lend' ? amount * currentZ * 0.75 : 0
  const netFinance = interestEarned - interestPaid

  const maxRate = Math.max(...Z_HISTORY.map((h) => h.rate))

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <p className="lab-cite mb-2" style={{ color: ACCENT }}>NHNN · LÃI SUẤT 2022–2024</p>
      <h3 className="font-display text-xl font-bold mb-6">
        Lãi tức <span style={{ color: ACCENT }}>Z</span> đến từ đâu trong chu kỳ thực?
      </h3>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {Z_HISTORY.map((h, i) => {
          const isCurrent = i === roundInPhase - 1
          const heightPct = (h.rate / maxRate) * 100
          return (
            <div key={h.year} className="text-center">
              <div className="h-32 flex flex-col justify-end mb-2">
                <motion.div
                  className="rounded-t-md"
                  style={{
                    background: isCurrent ? `linear-gradient(180deg, ${ACCENT}, #DC2626)` : 'var(--color-lab-surface-2)',
                    border: `1px solid ${isCurrent ? ACCENT : 'var(--color-lab-border)'}`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                />
              </div>
              <p className="font-mono text-[10px] text-[var(--color-lab-fg-dim)]">{h.year}</p>
              <p className="lab-display-num text-sm mt-0.5" style={{ color: isCurrent ? ACCENT : 'var(--color-lab-fg)' }}>
                {(h.rate * 100).toFixed(1)}%
              </p>
              <p className="text-[9px] text-[var(--color-lab-fg-dim)] mt-0.5 leading-tight">{h.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[var(--color-lab-border)]">
        <Stat label="Z hiện tại" value={`${(currentZ * 100).toFixed(1)}%`} accent={ACCENT} />
        <Stat label="Trả lãi" value={formatVnd(interestPaid, true)} accent="#EF4444" />
        <Stat label={action === 'lend' ? 'Thu lãi' : 'Tài chính ròng'} value={formatVnd(action === 'lend' ? interestEarned : netFinance, true)} accent={netFinance >= 0 ? '#10B981' : '#EF4444'} />
      </div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--color-lab-fg-dim)]">{label}</p>
      <p className="lab-display-num text-sm mt-1" style={{ color: accent ?? 'var(--color-lab-fg)' }}>{value}</p>
    </div>
  )
}

function Phase3Round({ onSubmit, mPool, roundInPhase }: { onSubmit: (d: { action: 'borrow' | 'lend' | 'none'; amount: number }) => void; mPool: number; roundInPhase: number }) {
  const [action, setAction] = useState<'borrow' | 'lend' | 'none'>('none')
  const [amount, setAmount] = useState(0)

  const maxAmount = Math.floor(mPool * 0.5)

  return (
    <RoundSection
      roundLabel={`VÒNG ${8 + roundInPhase}/16 · TÀI CHÍNH · Z`}
      title="Tiền tự đẻ ra tiền? Lãi tức là phần nào của m?"
      description={
        <p>Vay (trả Z) hay cho vay (thu Z) đều móc nối với phần giá trị thặng dư của sản xuất.
        Lãi suất NHNN 2022–2024 là dữ liệu thực được dùng làm Z.</p>
      }
      accent={ACCENT}
      chart={<InterestChart action={action} amount={amount} roundInPhase={roundInPhase} />}
      controls={
        <ControlsCard
          title={`Quyết định vòng ${roundInPhase}`}
          subtitle={`V khả dụng: ${formatVnd(mPool, true)}`}
          ctaLabel={`Áp dụng vòng ${roundInPhase}`}
          onCommit={() => onSubmit({ action, amount: action === 'none' ? 0 : amount })}
          accent={ACCENT}
        >
          <LabRadioGroup<'borrow' | 'lend' | 'none'>
            value={action}
            onChange={(v) => { setAction(v); if (v === 'none') setAmount(0) }}
            accent={ACCENT}
            options={[
              { value: 'none', label: 'Không vay, không cho vay', hint: 'Không phát sinh dòng Z' },
              { value: 'borrow', label: 'Vay vốn (trả lãi Z)', hint: 'Mở rộng sản xuất bằng vốn ngoài' },
              { value: 'lend', label: 'Cho vay (thu lãi Z × 75%)', hint: 'Lấy Z từ phần thặng dư của người khác' },
            ]}
          />
          {action !== 'none' && (
            <LabSlider
              label={action === 'borrow' ? 'Số tiền vay' : 'Số tiền cho vay'}
              value={amount}
              max={maxAmount}
              onChange={setAmount}
              hint={`Tối đa ${formatVnd(maxAmount, true)} (50% V)`}
              accent={ACCENT}
            />
          )}
        </ControlsCard>
      }
    />
  )
}

const TAKEAWAYS = [
  'Lãi tức Z là giá của tư bản cho vay — phản ánh phần giá trị thặng dư chuyển từ sản xuất sang tư bản tiền tệ.',
  'Tư bản cho vay không trực tiếp bóc lột lao động nhưng hưởng phần m từ quá trình sản xuất.',
  'Lãi suất NHNN 2022–2024 dao động 3,7% – 7,8% — tín dụng là đòn bẩy nhưng cũng là nguồn gốc khủng hoảng.',
]

interface Props { onNextPhase: () => void }

export default function Phase3Page({ onNextPhase }: Props) {
  const {
    round, m_pool, applyRound, pendingLesson, pendingQuickEvent, lastResult, dismissLesson, phase,
  } = useGameStore()
  const resultRef = useRef<HTMLDivElement | null>(null)
  const eventRef = useRef<HTMLDivElement | null>(null)

  const roundInPhase = ((round - 1) % 4) + 1
  const showResult = pendingLesson && lastResult?.phase === 3
  const showEvent = !!pendingQuickEvent
  const phaseDone = phase > 3

  useEffect(() => { if (showEvent && eventRef.current) eventRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, [showEvent])
  useEffect(() => { if (showResult && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [showResult, round])

  return (
    <div className="lab-scroll-snap">
      <HeroSection
        phase={3}
        title="Tài chính: lãi tức Z là phần nào của m?"
        subtitle="Pha 3: bạn quyết định vay hoặc cho vay — tỷ suất lợi tức Z′ theo NHNN 2022–2024 thực tế."
        formula={{
          l: 'Z',
          r: "= T × Z′  (Z′ = Z / T)",
          title: 'Lãi tức tư bản cho vay',
          purpose: 'Tư bản cho vay không trực tiếp tạo ra giá trị thặng dư; lợi tức Z là một phần lợi nhuận bình quân chuyển cho chủ tư bản cho vay (Z = T × Z′).',
          legend: [
            { sym: 'Z', meaning: 'Lãi tức (tiền lãi) — phần m mà người vay trả cho chủ vốn' },
            { sym: 'T', meaning: 'Vốn cho vay ban đầu' },
            { sym: "T'", meaning: 'Vốn + lãi sau kỳ vay' },
            { sym: "Z'", meaning: 'Tỷ suất lãi tức = Z/T (%/năm) — giá của tư bản tiền tệ' },
          ],
        }}
        bigNumber={m_pool}
        bigNumberLabel="V khả dụng"
        quote={{ text: 'Tư bản sinh ra lợi tức trở thành tư bản trừu tượng nhất, tự tăng giá trị trong nhận thức.', cite: 'Giáo trình KTCT Mác–Lênin, Ch.3, tr.75' }}
        color={ACCENT}
      />

      {showEvent && (
        <section ref={eventRef} className="py-12 border-b border-[var(--color-lab-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <NarrativeCard event={pendingQuickEvent!} accent={ACCENT} />
          </div>
        </section>
      )}

      {!phaseDone && !showResult && !showEvent && (
        <Phase3Round
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
            isLastInPhase={(round - 1) % 4 === 0 && round > 1}
            onContinue={dismissLesson}
            continueLabel={`Tiếp tục vòng ${round}`}
          />
        </div>
      )}

      {phaseDone && !showResult && (
        <PhaseWrapup
          phase={3}
          nextPhaseLabel="Sang Pha 4 · Địa tô"
          takeaways={TAKEAWAYS}
          accent={ACCENT}
          onContinue={onNextPhase}
        />
      )}
    </div>
  )
}
