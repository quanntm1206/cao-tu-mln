import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'
import type { FinanceAction, LandChoice } from '../engine/distribution'
import CaseStudyPanel from './CaseStudyPanel'

function Slider({ label, value, min, max, step = 1, onChange, format = (v: number) => v.toString() }: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void; format?: (v: number) => string
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-stone-300">{label}</span>
        <span className="text-sm font-bold text-stone-50 bg-stone-900 px-2 py-0.5 rounded-lg">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #3b82f6 ${pct}%, #374151 ${pct}%)` }}
      />
      <div className="flex justify-between text-xs text-stone-600 mt-0.5">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
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
  const [coKhi, setCoKhi] = useState(sector_allocation.co_khi)
  const [det, setDet] = useState(sector_allocation.det)
  const [da, setDa] = useState(sector_allocation.da)

  const total = coKhi + det + da
  const remaining = mPool - total
  const balanced = Math.abs(remaining) < 1

  const handleCoKhi = (v: number) => {
    const newDet = Math.max(0, Math.floor((mPool - v) / 2))
    const newDa = Math.max(0, mPool - v - newDet)
    setCoKhi(v); setDet(newDet); setDa(newDa)
  }

  return (
    <div>
      <p className="text-xs text-stone-500 mb-3">
        Phan bo M-pool ({formatVnd(mPool, true)}) cho 3 nganh san xuat. Tong: {formatVnd(total, true)}
        {!balanced && <span className="text-red-400 ml-2">Con lai: {formatVnd(remaining, true)}</span>}
      </p>
      <Slider label="Co khi (ty suat 20%)" value={coKhi} min={0} max={mPool} step={Math.round(mPool / 100)}
        onChange={handleCoKhi} format={(v) => formatVnd(v, true)} />
      <Slider label="Det may (ty suat 30%)" value={det} min={0} max={mPool - coKhi} step={Math.round(mPool / 100)}
        onChange={(v) => { setDet(v); setDa(Math.max(0, mPool - coKhi - v)) }}
        format={(v) => formatVnd(v, true)} />
      <Slider label="Da giay (ty suat 40%)" value={da} min={0} max={mPool} step={1}
        onChange={() => {}} format={(v) => formatVnd(v, true)} />
      <p className="text-xs text-stone-600 mt-1 mb-3 italic">Da giay = M-pool − co khi − det</p>
      <button onClick={() => applyRound({ co_khi: coKhi, det, da: Math.max(0, mPool - coKhi - det) })}
        className="w-full py-3 rounded-xl font-bold text-base btn-action">
        Thuc hien vong san xuat
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
        Loi nhuan cong nghiep tich luy: <span className="text-blue-300 font-bold">{formatVnd(industrial_profit, true)}</span>
      </p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-stone-300">Dung kenh thuong nghiep</span>
        <button onClick={() => setUseMerchant(!useMerchant)}
          className={`relative w-12 h-6 rounded-full transition-colors ${useMerchant ? 'bg-amber-700' : 'bg-stone-800'}`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${useMerchant ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {useMerchant && (
        <Slider label="Ty le hoa hong thuong nghiep" value={share} min={0} max={0.25} step={0.01}
          onChange={setShare} format={(v) => `${(v * 100).toFixed(0)}%`} />
      )}
      <div className="bg-stone-900/60 rounded-lg p-3 mb-4 text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-stone-400">Loi nhuan TN nhuong</span>
          <span className="text-amber-300">{formatVnd(merchantProfit, true)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Loi nhuan giu lai</span>
          <span className="text-green-300">{formatVnd(kept, true)}</span>
        </div>
      </div>
      <button onClick={() => applyRound({ merchantShare: share, useMerchant })}
        className="w-full py-3 rounded-xl font-bold text-base btn-action">
        Thuc hien vong thuong nghiep
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
              {a === 'none' ? 'Khong vay/cho vay' : a === 'borrow' ? 'Vay von (tra lai)' : 'Cho vay (thu lai)'}
            </span>
          </label>
        ))}
      </div>
      {action !== 'none' && (
        <div className="mb-4">
          <Slider label={action === 'borrow' ? 'So tien vay' : 'So tien cho vay'}
            value={amount} min={0} max={maxAmount} step={Math.round(maxAmount / 20)}
            onChange={setAmount} format={(v) => formatVnd(v, true)} />
        </div>
      )}
      <button onClick={() => applyRound({ action, amount })}
        className="w-full py-3 rounded-xl font-bold text-base btn-action">
        Thuc hien vong tai chinh
      </button>
    </div>
  )
}

function Phase4Panel() {
  const { m_pool, applyRound } = useGameStore()
  const [choice, setChoice] = useState<LandChoice>('none')

  const options: { value: LandChoice; label: string; desc: string }[] = [
    { value: 'none', label: 'Khong lien quan dat', desc: 'Giu nguyen M-pool' },
    { value: 'buy', label: 'Mua dat (Hoai Duc)', desc: 'Dat tang gia 81% – tich luy gia tri' },
    { value: 'rent', label: 'Thue dat', desc: 'Tra dia to, chi phi on dinh' },
    { value: 'speculate', label: 'Dau co (Bac Ninh)', desc: 'Bong bong +40% → suy sup -15%' },
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
        Thuc hien vong dat dai
      </button>
    </div>
  )
}

export default function DecisionPanel() {
  const { phase, m_pool } = useGameStore()

  const titles: Record<number, string> = {
    1: 'Pha 1 – San xuat Cong nghiep',
    2: 'Pha 2 – Luu thong Thuong nghiep',
    3: 'Pha 3 – Tu ban Tai chinh',
    4: 'Pha 4 – Dat dai & Dia to',
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider">{titles[phase] ?? 'Quyet dinh'}</h2>
      <div className="glass-card rounded-xl p-3 flex items-center justify-between">
        <span className="text-xs text-stone-400">M-pool hien tai</span>
        <span className="text-lg font-bold text-emerald-300">{formatVnd(m_pool, true)}</span>
      </div>
      <Section title={`Quyet dinh Pha ${phase}`}>
        {phase === 1 && <Phase1Panel mPool={m_pool} />}
        {phase === 2 && <Phase2Panel />}
        {phase === 3 && <Phase3Panel />}
        {phase === 4 && <Phase4Panel />}
      </Section>
      <CaseStudyPanel />
    </div>
  )
}
