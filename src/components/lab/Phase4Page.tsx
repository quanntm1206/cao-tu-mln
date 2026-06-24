import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'
import { R_CASE_HOAI_DUC, R_CASE_BAC_NINH } from '../../data/economyConstants'
import { LAND_COMMIT_FRACTION, getZRateForRound } from '../../engine/distribution'
import { calcLandPrice } from '../../engine/economy'
import HeroSection from './HeroSection'
import RoundSection from './RoundSection'
import ResultSection from './ResultSection'
import NarrativeCard from './NarrativeCard'
import PhaseWrapup from './PhaseWrapup'
import DontMisunderstand from './DontMisunderstand'
import { ControlsCard, LabRadioGroup } from './InlineDecision'

const ACCENT = '#EC4899'

type LandChoice = 'buy' | 'rent' | 'speculate' | 'none'

function RentMetricsPanel({
  profitPerRound,
  zPrime,
  choice,
  mPool,
  landAssets,
  roundInPhase,
}: {
  profitPerRound: number
  zPrime: number
  choice: LandChoice
  mPool: number
  landAssets: number
  roundInPhase: number
}) {
  const commit = mPool * LAND_COMMIT_FRACTION
  const rAnnual = choice === 'speculate' ? R_CASE_BAC_NINH.rentPerSqmYear : R_CASE_HOAI_DUC.rentPerSqmYear
  const pLand = calcLandPrice(rAnnual, zPrime)
  const rentR = choice === 'rent' ? profitPerRound * LAND_COMMIT_FRACTION : 0
  const afterRent = profitPerRound - rentR

  let revalHint = 0
  if (choice === 'buy') {
    revalHint = (landAssets + commit) * (R_CASE_HOAI_DUC.priceGrowthPct / 4)
  } else if (choice === 'speculate') {
    const rate =
      roundInPhase <= 2
        ? R_CASE_BAC_NINH.bubbleGrowthPct / 2
        : roundInPhase === 3
          ? 0.02
          : R_CASE_BAC_NINH.crashPct
    revalHint = landAssets * rate
  }

  return (
    <div className="lab-card-elevated p-6 sm:p-8">
      <p className="lab-cite mb-2" style={{ color: ACCENT }}>
        PHÂN PHỐI m · ĐỊA TÔ R · GIÁ CẢ P = R / Z′
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <Stat label="m phân phối / vòng" value={formatVnd(profitPerRound, true)} accent="var(--color-lab-yellow)" />
        <Stat label="Z′ (tỷ suất lợi tức NHNN)" value={`${(zPrime * 100).toFixed(1)}%`} accent={ACCENT} />
        <Stat label="R thuê (nếu chọn thuê)" value={formatVnd(rentR, true)} accent="#EF4444" />
        <Stat label="m sau địa tô" value={formatVnd(afterRent, true)} />
        <Stat label="P tham chiếu (₫/m²)" value={formatVnd(pLand, true)} />
        <Stat label="Cam kết tiền mặt / vòng" value={formatVnd(commit, true)} />
      </div>
      {choice !== 'none' && (
        <div className="rounded-lg p-3 border" style={{ borderColor: `${ACCENT}55`, background: `${ACCENT}10` }}>
          <p className="lab-cite mb-1" style={{ color: ACCENT }}>
            DỰ KIẾN VÒNG NÀY
          </p>
          {choice === 'rent' && (
            <p className="text-sm text-[var(--color-lab-fg-muted)]">
              Trả R = {(LAND_COMMIT_FRACTION * 100).toFixed(0)}% phần m — ΔV = −{formatVnd(rentR, true)} (không tạo m mới).
            </p>
          )}
          {choice === 'buy' && (
            <p className="text-sm text-[var(--color-lab-fg-muted)]">
              Mua đất −{formatVnd(commit, true)} tiền mặt; tái định giá tài sản ≈ {formatVnd(revalHint, true)} (không tạo m mới).
            </p>
          )}
          {choice === 'speculate' && (
            <p className="text-sm text-[var(--color-lab-fg-muted)]">
              Thị trường thứ cấp: tái định giá ≈ {formatVnd(revalHint, true)} trên tài sản đất hiện có — ΔV = 0.
            </p>
          )}
        </div>
      )}
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

function Phase4Round({
  onSubmit,
  mPool,
  landAssets,
  profitPerRound,
  zPrime,
  roundInPhase,
}: {
  onSubmit: (d: { landChoice: LandChoice }) => void
  mPool: number
  landAssets: number
  profitPerRound: number
  zPrime: number
  roundInPhase: number
}) {
  const [choice, setChoice] = useState<LandChoice>('none')
  const commit = mPool * LAND_COMMIT_FRACTION

  return (
    <RoundSection
      roundLabel={`VÒNG ${12 + roundInPhase}/16 · ĐỊA TÔ · R`}
      title="Địa tô R — phần m chuyển cho chủ đất"
      description={
        <div>
          <p>
            Mỗi vòng phân phối{' '}
            <span className="font-mono text-[var(--color-lab-yellow)]">{formatVnd(profitPerRound, true)}</span> m (lợi
            nhuận công nghiệp còn lại). Thuê đất: trả R từ phần m; mua đất: trả tiền mặt, P = R/Z′; đầu cơ: chỉ tái
            định giá tài sản.
          </p>
          <p className="text-sm mt-1">Case thực: Hoài Đức (mua) · Bắc Ninh (bong bóng/sụp).</p>
        </div>
      }
      accent={ACCENT}
      chart={
        <RentMetricsPanel
          profitPerRound={profitPerRound}
          zPrime={zPrime}
          choice={choice}
          mPool={mPool}
          landAssets={landAssets}
          roundInPhase={roundInPhase}
        />
      }
      controls={
        <ControlsCard
          title={`Quyết định vòng ${roundInPhase}`}
          subtitle={`Tài sản đất: ${formatVnd(landAssets, true)} · Cam kết mua: ${formatVnd(commit, true)}`}
          ctaLabel={`Áp dụng vòng ${roundInPhase}`}
          onCommit={() => onSubmit({ landChoice: choice })}
          accent={ACCENT}
        >
          <LabRadioGroup<LandChoice>
            value={choice}
            onChange={setChoice}
            accent={ACCENT}
            options={[
              { value: 'none', label: 'Không liên quan đất', hint: 'Không R, không mua, không tái định giá' },
              {
                value: 'rent',
                label: 'Thuê đất sản xuất',
                hint: `R = ${(LAND_COMMIT_FRACTION * 100).toFixed(0)}% phần m / vòng — giả định mô phỏng để minh họa dòng phân phối địa tô, không phải công thức giáo trình — trừ khỏi lợi nhuận giữ lại`,
              },
              {
                value: 'buy',
                label: 'Mua đất Hoài Đức',
                hint: `Trả ${formatVnd(commit, true)} tiền mặt; tái định giá theo BĐS 2024`,
              },
              {
                value: 'speculate',
                label: 'Đầu cơ Bắc Ninh (thứ cấp)',
                hint: 'Chỉ biến động sổ sách tài sản đất — không thêm tiền mặt',
              },
            ]}
          />
        </ControlsCard>
      }
    />
  )
}

const TAKEAWAYS = [
  'Địa tô R là phần m nhà sản xuất nhượng cho chủ đất — không phải lao động của họ, mà từ quyền sở hữu đất.',
  'Giá cả đất đai P = R / Z′: vốn hóa dòng địa tô kỳ vọng; mua đất dùng tiền mặt, không tạo m mới.',
  'Bong bóng/sụp trên thị trường thứ cấp chỉ tái định giá tài sản — minh họa rủi ro BĐS VN, không sinh thêm m.',
]

interface Props {
  onComplete: () => void
}

export default function Phase4Page({ onComplete }: Props) {
  const {
    round,
    m_pool,
    land_assets,
    industrial_profit,
    phase4_profit_per_round,
    applyRound,
    pendingLesson,
    pendingQuickEvent,
    lastResult,
    dismissLesson,
    gameOver,
  } = useGameStore()

  const resultRef = useRef<HTMLDivElement | null>(null)
  const eventRef = useRef<HTMLDivElement | null>(null)

  const isPhaseEndRound = (round - 1) % 4 === 0 && round > 1
  const handlePhaseAdvance = () => {
    dismissLesson()
    if (isPhaseEndRound) onComplete()
  }
  const roundInPhase = ((round - 1) % 4) + 1
  const profitPerRound = phase4_profit_per_round > 0 ? phase4_profit_per_round : industrial_profit / 4
  const zPrime = getZRateForRound(round)

  const showResult = pendingLesson && lastResult?.phase === 4
  const showEvent = !!pendingQuickEvent

  useEffect(() => {
    if (showEvent && eventRef.current) eventRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [showEvent])
  useEffect(() => {
    if (showResult && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [showResult, round])

  return (
    <div className="lab-scroll-snap">
      <HeroSection
        phase={4}
        title="Địa tô: phần m chuyển về tay chủ đất."
        subtitle="Pha 4: Đất không sinh m mới. Thuê đất trả R từ phần m; giá cả P = R/Z′ vốn hóa địa tô; mua đất trừ tiền mặt; đầu cơ chỉ tái định giá tài sản."
        formula={{
          l: 'Giá cả đất đai P',
          r: '= R / Z′',
          title: 'Tư bản hóa địa tô',
          purpose:
            'R là phần m nhượng cho chủ đất. Z′ là giá tư bản tiền tệ dùng chiết khấu. P vốn hóa dòng R kỳ vọng — không phải m mới từ lao động.',
          analogy:
            'Giống thuê mặt bằng mỗi tháng (trả R cho chủ nhà) hoặc mua luôn căn hộ: giá mua ≈ tiền thuê chia cho tỷ suất lợi tức Z′ (P = R/Z′). Chủ nhà không làm trong quán nhưng vẫn nhận phần lợi nhuận nhờ quyền sở hữu đất.',
          legend: [
            { sym: 'R', meaning: 'Địa tô — phần m chuyển cho chủ đất (₫/năm hoặc phần m/vòng)' },
            { sym: 'Z′', meaning: 'Tỷ suất lợi tức — mẫu số vốn hóa địa tô (P = R/Z′)' },
            { sym: 'P', meaning: 'Giá cả đất đai — vốn hóa địa tô (₫/m² tham chiếu)' },
          ],
        }}
        bigNumber={profitPerRound}
        bigNumberLabel="m phân phối / vòng"
        quote={{
          text: 'Đất không phải sản phẩm lao động, nhưng chủ đất chiếm phần m — đó là địa tô.',
          cite: 'Giáo trình KTCT Mác–Lênin, Ch.3, tr.77',
        }}
        color={ACCENT}
      />


      <section className="py-6 border-b border-[var(--color-lab-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lab-card p-5">
          <p className="lab-cite mb-2" style={{ color: ACCENT }}>MINI BÀI — ĐỊA TÔ CHÊNH LỆCH & TUYỆT ĐỐI</p>
          <ul className="space-y-2 text-sm text-[var(--color-lab-fg-muted)]">
            <li><strong className="text-[var(--color-lab-fg)]">Địa tô chênh lệch:</strong> phát sinh do điều kiện sản xuất thuận lợi hơn (độ màu mỡ, vị trí, hạ tầng) hoặc đầu tư thâm canh. Phần lợi nhuận siêu ngạch chuyển thành địa tô chênh lệch (I: điều kiện tự nhiên/vị trí; II: thâm canh).</li>
            <li><strong className="text-[var(--color-lab-fg)]">Địa tô tuyệt đối:</strong> phát sinh từ độc quyền sở hữu ruộng đất; chủ đất có thể thu địa tô ngay cả trên loại đất xấu nhất được đưa vào sản xuất/kinh doanh.</li>
            <li><strong className="text-[var(--color-lab-fg)]">Kết luận:</strong> cả địa tô tuyệt đối và địa tô chênh lệch đều là hình thức <em>phân phối</em> giá trị thặng dư — không phải m mới do đất tự tạo ra.</li>
            <li>Giá đất có thể tách xa cơ sở địa tô do đầu cơ/tín dụng/quy hoạch; trong lý luận giáo trình, P = R/Z′ giải thích giá cả đất đai.</li>
          </ul>
        </div>
      </section>

      <section className="py-8 border-b border-[var(--color-lab-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <DontMisunderstand phase={4} accent={ACCENT} />
        </div>
      </section>

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
          landAssets={land_assets}
          profitPerRound={profitPerRound}
          zPrime={zPrime}
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
            onPhaseAdvance={handlePhaseAdvance}
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
