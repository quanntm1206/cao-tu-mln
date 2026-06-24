import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'
import type { FinanceAction, LandChoice } from '../engine/distribution'
import CaseStudyPanel from './CaseStudyPanel'

const ALLOCATION_STEPS = 100

function amountToSteps(amount: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(ALLOCATION_STEPS, Math.max(0, Math.round((amount / total) * ALLOCATION_STEPS)))
}

function stepsToAmount(steps: number, total: number): number {
  return Math.round((steps / ALLOCATION_STEPS) * total)
}

function Slider({ label, value, min, max, step = 1, onChange, format = (v: number) => v.toString(), disabled = false }: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void; format?: (v: number) => string; disabled?: boolean
}) {
  const safeValue = Math.min(max, Math.max(min, value))
  const pct = max > min ? ((safeValue - min) / (max - min)) * 100 : 0
  return (
    <div className="mb-4 select-none">
      <div className="flex justify-between items-center mb-1 gap-2">
        <span className="text-sm text-stone-300">{label}</span>
        <span className="text-sm font-bold text-stone-50 bg-stone-900 px-2 py-0.5 rounded-lg shrink-0">{format(safeValue)}</span>
      </div>
      <div className="allocation-slider-track">
        <div className="allocation-slider-fill" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          disabled={disabled || max <= min}
          onChange={(e) => onChange(Number(e.target.value))}
          className="allocation-slider relative z-10 w-full cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      <div className="flex justify-between text-xs text-stone-600 mt-0.5">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  )
}

function ReadOnlyAllocation({ label, value, total, format }: {
  label: string; value: number; total: number; format: (v: number) => string
}) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-stone-300">{label}</span>
        <span className="text-sm font-bold text-amber-200 bg-stone-900 px-2 py-0.5 rounded-lg">{format(value)}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-stone-700 overflow-hidden" aria-hidden>
        <div className="h-full rounded-full bg-amber-600/80 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-stone-600 mt-0.5">{pct.toFixed(1)}% M-pool</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="theory-card rounded-xl p-4 mb-4">
      <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Phase1Panel({ mPool }: { mPool: number }) {
  const { sector_allocation, applyRound } = useGameStore()
  const [coSteps, setCoSteps] = useState(amountToSteps(sector_allocation.co_khi, mPool))
  const [detSteps, setDetSteps] = useState(amountToSteps(sector_allocation.det, mPool))

  const maxDetSteps = Math.max(0, ALLOCATION_STEPS - coSteps)
  const safeDetSteps = Math.min(detSteps, maxDetSteps)

  const coKhi = stepsToAmount(coSteps, mPool)
  const det = stepsToAmount(safeDetSteps, mPool)
  const da = Math.max(0, mPool - coKhi - det)
  const total = coKhi + det + da

  const handleCoSteps = (nextCo: number) => {
    setCoSteps(nextCo)
    setDetSteps((prev) => Math.min(prev, Math.max(0, ALLOCATION_STEPS - nextCo)))
  }

  const handleDetSteps = (nextDet: number) => {
    setDetSteps(Math.min(nextDet, maxDetSteps))
  }

  return (
    <div>
      <p className="text-xs text-stone-500 mb-3">
        Phân bổ M-pool ({formatVnd(mPool, true)}) cho 3 ngành sản xuất. Tổng: {formatVnd(total, true)}
      </p>
      <Slider
        label="Cơ khí (tỷ suất 20%)"
        value={coSteps}
        min={0}
        max={ALLOCATION_STEPS}
        step={1}
        onChange={handleCoSteps}
        format={(steps) => formatVnd(stepsToAmount(steps, mPool), true)}
      />
      <Slider
        label="Dệt may (tỷ suất 30%)"
        value={safeDetSteps}
        min={0}
        max={maxDetSteps}
        step={1}
        disabled={maxDetSteps === 0}
        onChange={handleDetSteps}
        format={(steps) => formatVnd(stepsToAmount(steps, mPool), true)}
      />
      <ReadOnlyAllocation
        label="Da giày (tỷ suất 40%) — tự động"
        value={da}
        total={mPool}
        format={(v) => formatVnd(v, true)}
      />
      <p className="text-xs text-stone-600 -mt-2 mb-3 italic">Da giày = M-pool − cơ khí − dệt may</p>
      <button onClick={() => applyRound({ co_khi: coKhi, det, da })}
        className="w-full py-3 rounded-xl font-bold text-base btn-action">
        Thực hiện vòng sản xuất
      </button>
    </div>
  )
}

function Phase2Panel() {
  const { industrial_profit, merchant_share, applyRound } = useGameStore()
  const [useMerchant, setUseMerchant] = useState(false)
  const [share, setShare] = useState(merchant_share)

  const merchantProfit = useMerchant ? industrial_profit * share : 0
  const kept = industrial_profit - merchantProfit

  return (
    <div>
      <p className="text-xs text-stone-500 mb-3">
        Lợi nhuận công nghiệp tích lũy: <span className="text-blue-300 font-bold">{formatVnd(industrial_profit, true)}</span>
      </p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-stone-300">Dùng kênh thương nghiệp</span>
        <button onClick={() => setUseMerchant(!useMerchant)}
          className={`relative w-12 h-6 rounded-full transition-colors ${useMerchant ? 'bg-amber-700' : 'bg-stone-800'}`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${useMerchant ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {useMerchant && (
        <Slider label="Tỷ lệ hoa hồng thương nghiệp" value={share} min={0} max={0.25} step={0.01}
          onChange={setShare} format={(v) => `${(v * 100).toFixed(0)}%`} />
      )}
      <div className="bg-stone-900/60 rounded-lg p-3 mb-4 text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-stone-400">Lợi nhuận TN nhượng</span>
          <span className="text-amber-300">{formatVnd(merchantProfit, true)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Lợi nhuận giữ lại</span>
          <span className="text-green-300">{formatVnd(kept, true)}</span>
        </div>
      </div>
      <button onClick={() => applyRound({ merchantShare: share, useMerchant })}
        className="w-full py-3 rounded-xl font-bold text-base btn-action">
        Thực hiện vòng thương nghiệp
      </button>
    </div>
  )
}

function Phase3Panel() {
  const { m_pool, applyRound } = useGameStore()
  const [action, setAction] = useState<FinanceAction>('none')
  const [amount, setAmount] = useState(0)

  const maxAmount = Math.floor(m_pool * 0.5)

  return (
    <div>
      <p className="text-xs text-stone-500 mb-3">
        M-pool: <span className="text-blue-300 font-bold">{formatVnd(m_pool, true)}</span>
      </p>
      <div className="space-y-2 mb-4">
        {(['none', 'borrow', 'lend'] as FinanceAction[]).map((a) => (
          <label key={a} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${action === a ? 'border-amber-600 bg-amber-950/30' : 'border-stone-700/50 bg-stone-900/40'}`}>
            <input type="radio" checked={action === a} onChange={() => { setAction(a); if (a === 'none') setAmount(0) }}
              className="accent-amber-500" />
            <span className="text-sm text-stone-200">
              {a === 'none' ? 'Không vay/cho vay' : a === 'borrow' ? 'Vay vốn (trả lãi)' : 'Cho vay (thu lãi)'}
            </span>
          </label>
        ))}
      </div>
      {action !== 'none' && (
        <div className="mb-4">
          <Slider label={action === 'borrow' ? 'Số tiền vay' : 'Số tiền cho vay'}
            value={amount} min={0} max={maxAmount} step={Math.round(maxAmount / 20)}
            onChange={setAmount} format={(v) => formatVnd(v, true)} />
        </div>
      )}
      <button onClick={() => applyRound({ action, amount })}
        className="w-full py-3 rounded-xl font-bold text-base btn-action">
        Thực hiện vòng tài chính
      </button>
    </div>
  )
}

function Phase4Panel() {
  const { m_pool, applyRound } = useGameStore()
  const [choice, setChoice] = useState<LandChoice>('none')

  const options: { value: LandChoice; label: string; desc: string }[] = [
    { value: 'none', label: 'Không liên quan đất', desc: 'Giữ nguyên M-pool' },
    { value: 'buy', label: 'Mua đất (Hoài Đức)', desc: 'Đất tăng giá 81% - tích lũy giá trị' },
    { value: 'rent', label: 'Thuê đất', desc: 'Trả địa tô, chi phí ổn định' },
    { value: 'speculate', label: 'Đầu cơ (Bắc Ninh)', desc: 'Bong bóng +40% → suy sụp -15%' },
  ]

  return (
    <div>
      <p className="text-xs text-stone-500 mb-3">
        M-pool: <span className="text-blue-300 font-bold">{formatVnd(m_pool, true)}</span>
      </p>
      <div className="space-y-2 mb-4">
        {options.map((o) => (
          <label key={o.value} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${choice === o.value ? 'border-amber-600 bg-amber-950/30' : 'border-stone-700/50 bg-stone-900/40'}`}>
            <input type="radio" checked={choice === o.value} onChange={() => setChoice(o.value)} className="accent-amber-500 mt-0.5" />
            <div>
              <p className="text-sm text-stone-200 font-medium">{o.label}</p>
              <p className="text-xs text-stone-500">{o.desc}</p>
            </div>
          </label>
        ))}
      </div>
      <button onClick={() => applyRound({ landChoice: choice })}
        className="w-full py-3 rounded-xl font-bold text-base btn-action">
        Thực hiện vòng đất đai
      </button>
    </div>
  )
}

export default function DecisionPanel() {
  const { phase, m_pool } = useGameStore()

  const titles: Record<number, string> = {
    1: 'Pha 1 - Sản xuất Công nghiệp',
    2: 'Pha 2 - Lưu thông Thương nghiệp',
    3: 'Pha 3 - Tư bản Tài chính',
    4: 'Pha 4 - Đất đai & Địa tô',
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider">{titles[phase] ?? 'Quyết định'}</h2>
      <div className="glass-card rounded-xl p-3 flex items-center justify-between">
        <span className="text-xs text-stone-400">M-pool hiện tại</span>
        <span className="text-lg font-bold text-emerald-300">{formatVnd(m_pool, true)}</span>
      </div>
      <Section title={`Quyết định Pha ${phase}`}>
        {phase === 1 && <Phase1Panel mPool={m_pool} />}
        {phase === 2 && <Phase2Panel />}
        {phase === 3 && <Phase3Panel />}
        {phase === 4 && <Phase4Panel />}
      </Section>
      <CaseStudyPanel />
    </div>
  )
}