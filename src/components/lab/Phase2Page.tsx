import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'
import HeroSection from './HeroSection'
import RoundSection from './RoundSection'
import ResultSection from './ResultSection'
import NarrativeCard from './NarrativeCard'
import PhaseWrapup from './PhaseWrapup'
import { LabSlider, ControlsCard, LabToggle } from './InlineDecision'
import DontMisunderstand from './DontMisunderstand'

const ACCENT = '#10B981'

function MerchantSplit({ industrial, useMerchant, share }: { industrial: number; useMerchant: boolean; share: number }) {
  const merchantProfit = useMerchant ? industrial * share : 0
  const kept = industrial - merchantProfit
  const total = Math.max(industrial, 1)

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <p className="lab-cite mb-2" style={{ color: ACCENT }}>SPLIT · lợi nhuận công nghiệp</p>
      <h3 className="font-display text-xl font-bold mb-6">
        Phần nào giữ lại, phần nào nhường thương nhân?
      </h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[var(--color-lab-fg-muted)]">Giữ lại (CN)</span>
            <span className="lab-display-num text-base" style={{ color: ACCENT }}>{formatVnd(kept, true)}</span>
          </div>
          <div className="h-8 rounded-md bg-[var(--color-lab-surface-2)] border border-[var(--color-lab-border)] overflow-hidden flex">
            <motion.div
              className="h-full"
              style={{ background: `linear-gradient(90deg, ${ACCENT}, #34D399)` }}
              animate={{ width: `${(kept / total) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
            {useMerchant && (
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg, var(--color-lab-yellow), #F59E0B)' }}
                animate={{ width: `${(merchantProfit / total) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[var(--color-lab-fg-muted)]">Nhường TN</span>
            <span className="lab-display-num text-base text-[var(--color-lab-yellow)]">{formatVnd(merchantProfit, true)}</span>
          </div>
          <p className="text-xs text-[var(--color-lab-fg-dim)] leading-relaxed">
            {useMerchant
              ? `Dùng kênh thương nhân: nhường ${(share * 100).toFixed(0)}% lợi nhuận để đổi lấy lưu thông nhanh hơn.`
              : 'Không dùng kênh TN: giữ 100% lợi nhuận nhưng tự lo lưu thông.'}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--color-lab-border)] grid grid-cols-3 gap-3">
        <Stat label="Tổng p" value={formatVnd(industrial, true)} />
        <Stat label="Giữ lại" value={formatVnd(kept, true)} accent={ACCENT} />
        <Stat label="Lợi nhuận thương nghiệp" value={formatVnd(merchantProfit, true)} accent="var(--color-lab-yellow)" />
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

function Phase2Round({ onSubmit, industrial, merchantProfit, roundInPhase }: { onSubmit: (d: { merchantShare: number; useMerchant: boolean }) => void; industrial: number; merchantProfit: number; roundInPhase: number }) {
  const [useMerchant, setUseMerchant] = useState(false)
  const [share, setShare] = useState(15)

  const hints = [
    'Vòng 5: lần đầu chạm tới khái niệm "lợi nhuận thương nghiệp". Hãy thử bật/tắt kênh TN.',
    'Vòng 6: tỷ lệ hoa hồng dao động 0–25%. Càng cao thì TN càng giàu.',
    'Vòng 7: thực tế MWG, FPT Shop dùng kênh phân phối — đó là thương nghiệp đại trà.',
    'Vòng 8: vòng cuối Pha 2. Bạn đã thấy "lợi nhuận TN đến từ giá trị thặng dư" chưa?',
  ]

  return (
    <RoundSection
      roundLabel={`VÒNG ${4 + roundInPhase}/16 · LƯU THÔNG THƯƠNG NGHIỆP`}
      title="Thương nhân không sản xuất — vì sao họ vẫn có lợi nhuận?"
      description={<p>{hints[roundInPhase - 1]}</p>}
      accent={ACCENT}
      chart={<MerchantSplit industrial={industrial} useMerchant={useMerchant} share={share / 100} />}
      controls={
        <ControlsCard
          title={`Quyết định vòng ${roundInPhase}`}
          subtitle={`m phân phối vòng: ${formatVnd(industrial, true)} · LN TN đã nhượng: ${formatVnd(merchantProfit, true)}`}
          ctaLabel={`Áp dụng vòng ${roundInPhase}`}
          onCommit={() => onSubmit({ merchantShare: share / 100, useMerchant })}
          accent={ACCENT}
        >
          <LabToggle
            checked={useMerchant}
            onChange={setUseMerchant}
            label={useMerchant ? 'Đang dùng kênh thương nghiệp' : 'Không dùng kênh thương nghiệp'}
            hint={useMerchant ? 'Nhường một phần lợi nhuận cho TN' : 'Giữ 100% lợi nhuận, tự lo lưu thông'}
            accent={ACCENT}
          />
          {useMerchant && (
            <LabSlider
              label="Tỷ lệ hoa hồng TN"
              value={share}
              max={25}
              onChange={setShare}
              hint={`${formatVnd(industrial * share / 100, true)} sẽ nhường cho thương nhân`}
              accent="var(--color-lab-yellow)"
              formatValue={(v) => `${v}%`}
            />
          )}
        </ControlsCard>
      }
    />
  )
}

const TAKEAWAYS = [
  'Lợi nhuận thương nghiệp là phần giá trị thặng dư mà nhà sản xuất nhường cho thương nhân — không phải giá trị mới.',
  'Bình quân hóa lợi nhuận: cả TN lẫn CN đều hướng về tỷ suất bình quân toàn xã hội.',
  'Trong thực tế VN: nhà bán lẻ (MWG, FPT) chính là tư bản thương nghiệp; nhà sản xuất nhường % nhất định.',
]

interface Props { onNextPhase: () => void }

export default function Phase2Page({ onNextPhase }: Props) {
  const {
    round, industrial_profit, merchant_profit, phase2_surplus_per_round, applyRound, pendingLesson, pendingQuickEvent, lastResult, dismissLesson, phase,
  } = useGameStore()
  const resultRef = useRef<HTMLDivElement | null>(null)
  const eventRef = useRef<HTMLDivElement | null>(null)

  const roundInPhase = ((round - 1) % 4) + 1
  const showResult = pendingLesson && lastResult?.phase === 2
  const showEvent = !!pendingQuickEvent
  const isPhaseEndRound = (round - 1) % 4 === 0 && round > 1
  const handlePhaseAdvance = () => { dismissLesson(); if (isPhaseEndRound) onNextPhase() }
  const phaseDone = phase > 2

  useEffect(() => {
    if (showEvent && eventRef.current) eventRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [showEvent])
  useEffect(() => {
    if (showResult && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [showResult, round])

  return (
    <div className="lab-scroll-snap">
      <HeroSection
        phase={2}
        title="Lợi nhuận thương nghiệp"
        subtitle="Pha 2: Tư bản thương nghiệp không tạo ra giá trị thặng dư mới; lợi nhuận thương nghiệp là phần m do tư bản công nghiệp nhượng lại để lưu thông hàng hóa nhanh hơn."
        formula={{
          l: "m phân phối",
          r: "= CN giữ + LN thương nghiệp",
          title: 'Phân phối m qua lưu thông',
          purpose: "T ứng ra mua hàng hóa H (gồm sức lao động + tư liệu sản xuất), bán lại thu T' > T. Phần chênh T' − T chính là m — khi qua thương nhân, một phần m chuyển thành lợi nhuận thương nghiệp.",
          analogy:
            'Giống bạn làm trà sữa xong rồi nhờ Shopee/TikTok bán hộ: đồ uống đã có lợi nhuận từ sản xuất (m), sàn chỉ giúp đưa tới khách và lấy một phần hoa hồng — sàn không pha thêm ly nào.',
          legend: [
            { sym: 'T', meaning: 'Tiền vốn ứng trước ban đầu' },
            { sym: 'H', meaning: 'Hàng hóa — gồm sức lao động + tư liệu sản xuất' },
            { sym: "T'", meaning: "Tiền thu về sau lưu thông (T' = T + Δ, với Δ = m)" },
            { sym: '—', meaning: 'Lợi nhuận thương nghiệp — phần m nhường cho thương nhân (không có ký hiệu riêng trong giáo trình)' },
          ],
        }}
        bigNumber={industrial_profit}
        bigNumberLabel="Lợi nhuận CN giữ lại (sau thương nghiệp)"
        quote={{ text: 'Tư bản thương nghiệp không tạo ra giá trị thặng dư, mà chỉ chiếm một phần giá trị thặng dư từ sản xuất.', cite: 'Giáo trình KTCT Mác–Lênin, Ch.3, tr.73' }}
        color={ACCENT}
      />

      <DontMisunderstand phase={2} accent={ACCENT} />

      {showEvent && (
        <section ref={eventRef} className="py-12 border-b border-[var(--color-lab-border)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <NarrativeCard event={pendingQuickEvent!} accent={ACCENT} />
          </div>
        </section>
      )}

      {!phaseDone && !showResult && !showEvent && (
        <Phase2Round
          key={`r${round}`}
          onSubmit={(d) => applyRound(d as unknown as Record<string, unknown>)}
          industrial={phase2_surplus_per_round > 0 ? phase2_surplus_per_round : industrial_profit / 4}
          merchantProfit={merchant_profit}
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
            onPhaseAdvance={handlePhaseAdvance}
            continueLabel={`Tiếp tục vòng ${round}`}
          />
        </div>
      )}

      {phaseDone && !showResult && (
        <PhaseWrapup
          phase={2}
          nextPhaseLabel="Sang Pha 3 · Tài chính"
          takeaways={TAKEAWAYS}
          accent={ACCENT}
          onContinue={onNextPhase}
        />
      )}
    </div>
  )
}
