import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { formatVnd } from '../../lib/currency'
import { calcSessionNetWorth } from '../../lib/networth'
import { deriveEnding } from '../../data/endings'
import { FINAL_CHECKLIST } from '../../data/teachingAids'
import { Download, Trophy, RotateCcw, Award, CheckSquare, Square } from 'lucide-react'
import MPoolTrajectory from './MPoolTrajectory'
import DistributionBreakdown from './DistributionBreakdown'

const DIFFICULTY = ['Rất khó', 'Vừa phải', 'Dễ hiểu']
const CONCEPT = ['k = c + v', 'P = R / Z′', 'T − H − T′']

interface Props { onLeaderboard: () => void }

function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const PHASE_NAMES = ['Sản xuất', 'Thương nghiệp', 'Tài chính', 'Địa tô']
const PHASE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899']
const PHASE_NOTES = [
  'Tạo m trong sản xuất',
  'Phân phối/thực hiện m',
  'Dòng tiền/thanh khoản pha (có thể do vay) — không phải m, không đồng nghĩa tăng tài sản ròng',
  'Địa tô/tái định giá tài sản đất — không tạo m',
]

export default function FinalInfographic({ onLeaderboard }: Props) {
  const {
    playerName, m_pool, startingM,
    industrial_profit, merchant_profit, interest_paid, interest_earned, rent_paid,
    debt_principal, lent_principal, land_assets, delivery_obligation,
    history, eventLog, reset,
  } = useGameStore()

  const [checked, setChecked] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<number | null>(null)
  const [concept, setConcept] = useState<number | null>(null)
  const [comment, setComment] = useState('')

  const ending = deriveEnding({ industrial_profit, merchant_profit, interest_paid, interest_earned, rent_paid, m_pool })
  const netWorth = calcSessionNetWorth({
    cash: m_pool,
    landAssets: land_assets,
    lentPrincipal: lent_principal,
    debtPrincipal: debt_principal,
    deliveryObligation: delivery_obligation,
  })
  const growth = startingM > 0 ? ((netWorth - startingM) / startingM) * 100 : 0
  const positive = netWorth >= startingM
  const totalEvents = eventLog.length

  // Per-phase contribution summary
  const phaseStats = [1, 2, 3, 4].map((ph) => {
    const entries = history.filter((h) => h.result.phase === ph)
    let delta = 0
    for (const e of entries) {
      const r = e.result
      if (r.phase === 1) delta += r.total_industrial_profit
      else if (r.phase === 3) delta += r.pool_delta
      else if (r.phase === 4) delta += r.land_gain
    }
    return { phase: ph, name: PHASE_NAMES[ph - 1], color: PHASE_COLORS[ph - 1], delta, rounds: entries.length }
  })

  const toggle = (item: string) =>
    setChecked((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item])

  const exportReport = () => {
    downloadJSON(`surplus-lab-${playerName || 'bao-cao'}.json`, {
      playerName,
      completedAt: new Date().toLocaleString('vi-VN'),
      schema: 'surplus-lab-v3',
      mPool: Math.round(m_pool),
      netWorth: Math.round(netWorth),
      deliveryObligation: Math.round(delivery_obligation),
      startingM: Math.round(startingM),
      growthPct: Number(growth.toFixed(2)),
      distribution: {
        industrial_profit: Math.round(industrial_profit),
        merchant_profit: Math.round(merchant_profit),
        interest_paid: Math.round(interest_paid),
        interest_earned: Math.round(interest_earned),
        rent_paid: Math.round(rent_paid),
      },
      perPhase: phaseStats,
      ending: { id: ending.endingId, title: ending.title, tone: ending.tone },
      checklist: FINAL_CHECKLIST.map((item) => ({ item, done: checked.includes(item) })),
      survey: { difficulty, conceptClarity: concept, comment },
      events: eventLog.map((e) => ({ round: e.round, title: e.title, choice: e.choiceLabel })),
      rounds: history.map((h) => ({
        round: h.round,
        phase: h.result.phase,
        lesson: h.result.lesson.substring(0, 100),
      })),
    })
  }

  return (
    <div className="min-h-screen pb-16" data-testid="final-infographic">
      {/* ============ HERO ============ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-[var(--color-lab-border)] py-16 lg:py-20"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="lab-cite mb-4 text-[var(--color-lab-cyan)]">SESSION REPORT</p>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
            {playerName}, bạn đã thấy<br />
            <span className="text-[var(--color-lab-cyan)]">m chia về 4 hướng</span>.
          </h1>
          <p className="text-lg text-[var(--color-lab-fg-muted)] max-w-2xl leading-relaxed">
            16 vòng · 4 pha · {totalEvents} sự kiện. Game mô phỏng quá trình m được tạo ra trong sản xuất và được phân phối/thực hiện/chuyển hóa thành p, lợi nhuận thương nghiệp, Z, R. Thương nghiệp, tài chính và địa tô không tạo m mới.
          </p>
        </div>
      </motion.section>

      {/* ============ HEADLINE NUMBERS ============ */}
      <section className="py-12 border-b border-[var(--color-lab-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Headline label="Tiền mặt khả dụng" value={formatVnd(m_pool, true)} color={positive ? '#10B981' : '#EF4444'} sub="Không đồng nhất với tài sản ròng hay giá trị thặng dư." big />
          <Headline label="Tài sản ròng" value={formatVnd(netWorth, true)} color="var(--color-lab-cyan)" sub="tiền mặt + đất + cho vay − nợ − nghĩa vụ giao hàng" />
          <Headline
            label="Tăng trưởng"
            value={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`}
            color={positive ? '#10B981' : '#EF4444'}
            sub={`so với ${formatVnd(startingM, true)} M ban đầu`}
          />
          <Headline
            label="Sự kiện đã trải qua"
            value={`${totalEvents}`}
            color="var(--color-lab-yellow)"
            sub={totalEvents > 0 ? 'quyết định ngẫu nhiên định hình kết quả' : 'không sự kiện ngẫu nhiên nào'}
          />
        </div>
      </section>


      <section className="py-8 border-b border-[var(--color-lab-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="lab-cite mb-3">PHÂN TÁCH TÀI SẢN (MÔ PHỎNG GIẢN LƯỢC)</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <AssetRow label="Lợi nhuận CN giữ lại" value={formatVnd(industrial_profit, true)} />
            <AssetRow label="LN thương nghiệp đã nhượng" value={formatVnd(merchant_profit, true)} />
            <AssetRow label="Nợ gốc" value={formatVnd(debt_principal, true)} />
            <AssetRow label="Vốn cho vay" value={formatVnd(lent_principal, true)} />
            <AssetRow label="Tài sản đất" value={formatVnd(land_assets, true)} />
            <AssetRow label="Nghĩa vụ giao hàng (cọc)" value={formatVnd(delivery_obligation, true)} hint="Tiền cọc tăng tiền mặt tạm thời nhưng phát sinh nghĩa vụ giao hàng — không tính như tài sản ròng hay lợi nhuận." />
          </div>
        </div>
      </section>
      {/* ============ M-POOL TRAJECTORY ============ */}
      <section className="py-12 border-b border-[var(--color-lab-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <MPoolTrajectory />
        </div>
      </section>

      {/* ============ PER-PHASE CONTRIBUTION ============ */}
      <section className="py-12 border-b border-[var(--color-lab-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="lab-cite mb-2 text-[var(--color-lab-cyan)]">ĐÓNG GÓP THEO PHA</p>
          <h2 className="font-display text-2xl font-bold mb-2">Đóng góp theo pha (dòng tiền / phân phối m)</h2>
          <p className="text-sm text-[var(--color-lab-fg-muted)] mb-6 leading-relaxed">Số dương ở pha tài chính có thể là dòng tiền vay/thanh khoản, không phải giá trị thặng dư m và không đồng nghĩa với tăng tài sản ròng.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {phaseStats.map((ps) => {
              const positive = ps.delta >= 0
              return (
                <div
                  key={ps.phase}
                  className="lab-card p-4"
                  style={{ borderColor: `${ps.color}55` }}
                >
                  <p className="lab-cite mb-1" style={{ color: ps.color }}>PHA {ps.phase} · {ps.name}</p>
                  <p className="lab-display-num text-2xl mt-1" style={{ color: positive ? ps.color : '#EF4444' }}>
                    {positive ? '+' : ''}{formatVnd(ps.delta, true)}
                  </p>
                  <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-1 leading-relaxed">{PHASE_NOTES[ps.phase - 1]}</p>
                  <p className="text-[10px] text-[var(--color-lab-fg-dim)] mt-0.5 font-mono">{ps.rounds} vòng đã chơi</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ DISTRIBUTION BREAKDOWN ============ */}
      <section className="py-12 border-b border-[var(--color-lab-border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <DistributionBreakdown />
        </div>
      </section>

      {/* ============ ENDING ============ */}
      <section className="py-12 border-b border-[var(--color-lab-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="lab-card-elevated p-6 mb-6">
            <p className="lab-cite mb-3">KẾT CỤC HỌC PHẦN</p>
            <div className="flex items-start gap-3 mb-4">
              <Award
                className="w-10 h-10 mt-0.5 shrink-0"
                style={{ color: ending.tone === 'growth' ? '#10B981' : ending.tone === 'warning' ? '#F59E0B' : '#06B6D4' }}
                strokeWidth={1.75}
              />
              <div>
                <h2 className="font-display text-2xl font-black mb-1">{ending.title}</h2>
                <p className="text-sm text-[var(--color-lab-fg-muted)] leading-relaxed">{ending.summary}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--color-lab-border)]">
              <ExplanationRow label="VÌ SAO" body={ending.whyThisHappened} accent="var(--color-lab-cyan)" />
              <ExplanationRow label="LIÊN HỆ GIÁO TRÌNH" body={ending.textbookConnection} accent="var(--color-lab-yellow)" />
              {ending.secondaryConsequences.length > 0 && (
                <ExplanationRow
                  label="KHÍA CẠNH KHÁC"
                  body={ending.secondaryConsequences.join('; ')}
                  accent="#EC4899"
                />
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--color-lab-border)]">
              <p className="lab-cite mb-2 text-[var(--color-lab-yellow)]">CÂU HỎI THẢO LUẬN</p>
              {ending.reflectionQuestions.map((q) => (
                <p key={q} className="text-sm text-[var(--color-lab-fg)] leading-relaxed mb-1">• {q}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHECKLIST ============ */}
      <section className="py-12 border-b border-[var(--color-lab-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="lab-cite mb-3">CHECKLIST CUỐI BÀI</p>
          <div className="space-y-2">
            {FINAL_CHECKLIST.map((item) => {
              const done = checked.includes(item)
              const Icon = done ? CheckSquare : Square
              return (
                <label
                  key={item}
                  className="w-full flex items-start gap-3 p-3 rounded-lg lab-card hover:border-[var(--color-lab-cyan)] transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={done}
                    onChange={() => toggle(item)}
                  />
                  <Icon
                    className="w-5 h-5 mt-0.5 shrink-0"
                    style={{ color: done ? 'var(--color-lab-cyan)' : 'var(--color-lab-fg-dim)' }}
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span
                    className={`text-sm leading-relaxed ${done ? 'text-[var(--color-lab-fg)] line-through opacity-70' : 'text-[var(--color-lab-fg)]'}`}
                  >
                    {item}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ SURVEY ============ */}
      <section className="py-12 border-b border-[var(--color-lab-border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="lab-cite mb-4">KHẢO SÁT NHANH</p>

          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">Độ khó học phần</p>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY.map((l, i) => (
                <button
                  key={l}
                  onClick={() => setDifficulty(i)}
                  className={`py-3 rounded-lg text-sm font-semibold border transition-all ${
                    difficulty === i
                      ? 'bg-[var(--color-lab-cyan-soft)] border-[var(--color-lab-cyan)] text-[var(--color-lab-cyan)]'
                      : 'border-[var(--color-lab-border)] text-[var(--color-lab-fg-muted)] hover:text-[var(--color-lab-fg)]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold mb-3">Khái niệm rõ nhất</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CONCEPT.map((l, i) => (
                <button
                  key={l}
                  onClick={() => setConcept(i)}
                  className={`py-3 rounded-lg text-sm font-mono border transition-all ${
                    concept === i
                      ? 'bg-[var(--color-lab-yellow-soft)] border-[var(--color-lab-yellow)] text-[var(--color-lab-yellow)]'
                      : 'border-[var(--color-lab-border)] text-[var(--color-lab-fg-muted)] hover:text-[var(--color-lab-fg)]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Góp ý thêm (tùy chọn)…"
            className="lab-input w-full text-sm resize-none"
          />
        </div>
      </section>

      {/* ============ ACTIONS ============ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 grid sm:grid-cols-3 gap-3">
          <button
            onClick={onLeaderboard}
            className="lab-btn-ghost py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <Trophy className="w-4 h-4" strokeWidth={2} /> Bảng xếp hạng
          </button>
          <button
            onClick={exportReport}
            data-testid="export-json-btn"
            className="lab-btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} /> Xuất JSON
          </button>
          <button
            onClick={reset}
            className="lab-btn-ghost py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} /> Chơi lại
          </button>
        </div>
      </section>
    </div>
  )
}

function Headline({ label, value, color, sub, big }: { label: string; value: string; color: string; sub?: string; big?: boolean }) {
  return (
    <div className="lab-card p-5">
      <p className="lab-cite mb-2 text-[var(--color-lab-fg-dim)]">{label}</p>
      <p className={`lab-display-num ${big ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`} style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-xs text-[var(--color-lab-fg-muted)] mt-2 leading-relaxed">{sub}</p>}
    </div>
  )
}

function AssetRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="lab-card p-3 flex justify-between gap-2" title={hint}>
      <span className="text-[var(--color-lab-fg-muted)]">{label}</span>
      <span className="lab-display-num text-sm">{value}</span>
    </div>
  )
}

function ExplanationRow({ label, body, accent }: { label: string; body: string; accent: string }) {
  return (
    <div>
      <p className="lab-cite mb-1" style={{ color: accent }}>{label}</p>
      <p className="text-sm text-[var(--color-lab-fg)] leading-relaxed">{body}</p>
    </div>
  )
}
