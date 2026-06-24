import { useState } from 'react'
import { useGameStore, type RoundDecisions, type Feature } from '../store/gameStore'
import { formatVnd } from '../lib/currency'
import {
  INVEST_STEP,
  LOGISTICS_UNIT_COST,
  MAX_LOAN_PER_ROUND,
  LOAN_STEP,
  LEND_STEP,
  WAGE_MIN,
  WAGE_MAX,
  WAGE_STEP,
} from '../data/economyConstants'

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v: number) => v.toString(),
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-stone-300">{label}</span>
        <span className="text-sm font-bold text-stone-50 bg-stone-900 px-2 py-0.5 rounded-lg">
          {format(value)}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${pct}%, #374151 ${pct}%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-stone-600 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

function NumberInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  preview,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  preview?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-stone-300 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step ?? 1}
          onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
          className={`input-field w-full rounded-lg py-2 ${unit ? 'pr-16 pl-3' : 'px-3'}`}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-amber-200/80">
            {unit}
          </span>
        )}
      </div>
      {preview && <p className="mt-1 text-xs text-stone-500">{preview}</p>}
    </div>
  )
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-stone-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-amber-700' : 'bg-stone-800'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="theory-card rounded-xl p-4 mb-4">
      <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function DecisionPanel() {
  const {
    unlockedFeatures,
    cash,
    c_fixed_book,
    c_circulating_stock,
    v_per_worker,
    workers,
    h,
    alpha,
    debt,
    lending,
    bank_interest_rate,
    rent_per_unit,
    applyRound,
  } = useGameStore()

  const maxInvest = Math.max(0, Math.floor(cash * 0.8))

  const [decisions, setDecisions] = useState<RoundDecisions>({
    h,
    v_per_worker,
    workers,
    invest_machines: 0,
    invest_materials: 0,
    invest_rnd: 0,
    invest_logistics: 0,
    use_merchant: false,
    merchant_rate: 0.08,
    take_loan: 0,
    repay_loan: 0,
    lend_out: 0,
    recall_lending: 0,
    buy_land: 0,
    rent_mode: false,
    alpha,
  })

  const set = <K extends keyof RoundDecisions>(k: K, v: RoundDecisions[K]) =>
    setDecisions((d) => ({ ...d, [k]: v }))

  const landUnitPrice = rent_per_unit / bank_interest_rate
  const landPurchaseCost = decisions.buy_land * landUnitPrice

  const totalSpend =
    decisions.invest_machines +
    decisions.invest_materials +
    decisions.invest_rnd +
    decisions.invest_logistics +
    decisions.repay_loan +
    decisions.lend_out +
    landPurchaseCost -
    decisions.recall_lending

  const canAfford = totalSpend <= cash

  const handleSubmit = () => {
    if (!canAfford) return
    applyRound(decisions)
    setDecisions((d) => ({
      ...d,
      invest_machines: 0,
      invest_materials: 0,
      invest_rnd: 0,
      invest_logistics: 0,
      take_loan: 0,
      repay_loan: 0,
      lend_out: 0,
      recall_lending: 0,
      buy_land: 0,
    }))
  }

  const has = (f: Feature) => unlockedFeatures.includes(f)

  return (
    <div className="flex flex-col gap-0">
      <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4">
        Phiếu quyết định sản xuất
      </h2>

      {/* Spend summary */}
      <div className={`glass-card rounded-xl p-3 mb-4 flex items-center gap-3 ${!canAfford ? 'border border-red-700' : ''}`}>
        <div className="flex-1">
          <p className="text-xs text-stone-400">Chi phí kế hoạch</p>
          <p className={`text-lg font-bold ${!canAfford ? 'text-red-400' : 'text-stone-50'}`}>
            {formatVnd(totalSpend)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">Tiền khả dụng</p>
          <p className="text-lg font-bold text-green-400">{formatVnd(cash)}</p>
        </div>
      </div>

      {/* Labor */}
      <Section title="⚙️ Lao động">
        <Slider
          label="Số công nhân"
          value={decisions.workers}
          min={1}
          max={50}
          onChange={(v) => set('workers', v)}
          format={(v) => `${v} người`}
        />
        <Slider
          label="Lương mỗi công nhân"
          value={decisions.v_per_worker}
          min={WAGE_MIN}
          max={WAGE_MAX}
          step={WAGE_STEP}
          onChange={(v) => set('v_per_worker', v)}
          format={(v) => formatVnd(v, true)}
        />
        {has('hours') && (
          <Slider
            label="Giờ lao động / ngày (h)"
            value={decisions.h}
            min={6}
            max={14}
            onChange={(v) => set('h', v)}
            format={(v) => `${v}h`}
          />
        )}
      </Section>

      {/* Capital investment */}
      {has('machines') && (
        <Section title="🏗️ Tư bản cố định">
          <NumberInput
            label={`Đầu tư máy móc (có: ${formatVnd(c_fixed_book, true)})`}
            value={decisions.invest_machines}
            min={0}
            max={maxInvest}
            step={INVEST_STEP}
                        unit="đ"
            preview={formatVnd(decisions.invest_machines, true)}
            onChange={(v) => set('invest_machines', v)}
          />
        </Section>
      )}

      {has('materials') && (
        <Section title="📦 Nguyên vật liệu">
          <NumberInput
            label={`Mua nguyên liệu (có: ${formatVnd(c_circulating_stock, true)})`}
            value={decisions.invest_materials}
            min={0}
            max={maxInvest}
            step={INVEST_STEP}
                        unit="đ"
            preview={formatVnd(decisions.invest_materials, true)}
            onChange={(v) => set('invest_materials', v)}
          />
        </Section>
      )}

      {/* Productivity */}
      {has('rnd') && (
        <Section title="🔬 Tăng năng suất lao động">
          <p className="text-xs text-stone-500 mb-3">
            Tăng năng suất làm giảm t_n (lao động tất yếu) → GTTT tương đối ↑
          </p>
          <NumberInput
            label="Chi cải tiến năng suất"
            value={decisions.invest_rnd}
            min={0}
            max={maxInvest}
            step={INVEST_STEP}
                        unit="đ"
            preview={formatVnd(decisions.invest_rnd, true)}
            onChange={(v) => set('invest_rnd', v)}
          />
        </Section>
      )}

      {/* Circulation */}
      {has('logistics') && (
        <Section title="🚚 Thời gian lưu thông">
          <p className="text-xs text-stone-500 mb-3">
            Rút ngắn thời gian lưu thông ch → tăng vòng quay n → tăng M_năm (mỗi cấp:{' '}
            {formatVnd(LOGISTICS_UNIT_COST, true)})
          </p>
          <NumberInput
            label="Chi rút ngắn lưu thông"
            value={decisions.invest_logistics}
            min={0}
            max={maxInvest}
            step={LOGISTICS_UNIT_COST}
                        unit="đ"
            preview={formatVnd(decisions.invest_logistics, true)}
            onChange={(v) => set('invest_logistics', v)}
          />
          <Toggle
            label="Dùng kênh thương nghiệp"
            value={decisions.use_merchant}
            onChange={(v) => set('use_merchant', v)}
          />
          {decisions.use_merchant && (
            <Slider
              label="Hoa hồng thương nghiệp"
              value={decisions.merchant_rate}
              min={0.03}
              max={0.2}
              step={0.01}
              onChange={(v) => set('merchant_rate', v)}
              format={(v) => `${(v * 100).toFixed(0)}%`}
            />
          )}
        </Section>
      )}

      {/* Finance */}
      {has('interest') && (
        <Section title="🏦 Lợi tức">
          <p className="text-xs text-stone-500 mb-3">
            Lãi suất: {(bank_interest_rate * 100).toFixed(0)}%/vòng. Nợ hiện tại: {formatVnd(debt, true)}
          </p>
          <NumberInput
            label="Vay thêm"
            value={decisions.take_loan}
            min={0}
            max={MAX_LOAN_PER_ROUND}
            step={LOAN_STEP}
                        unit="đ"
            preview={formatVnd(decisions.take_loan, true)}
            onChange={(v) => set('take_loan', v)}
          />
          {debt > 0 && (
            <NumberInput
              label="Trả nợ"
              value={decisions.repay_loan}
              min={0}
              max={Math.min(maxInvest, debt)}
              step={INVEST_STEP}
                            unit="đ"
              preview={formatVnd(decisions.repay_loan, true)}
              onChange={(v) => set('repay_loan', v)}
            />
          )}
          <NumberInput
            label="Cho vay ra"
            value={decisions.lend_out}
            min={0}
            max={maxInvest}
            step={LEND_STEP}
                        unit="đ"
            preview={formatVnd(decisions.lend_out, true)}
            onChange={(v) => set('lend_out', v)}
          />
          {lending > 0 && (
            <NumberInput
              label={`Thu hồi cho vay (đang cho vay: ${formatVnd(lending, true)})`}
              value={decisions.recall_lending}
              min={0}
              max={lending}
              step={LEND_STEP}
                            unit="đ"
              preview={formatVnd(decisions.recall_lending, true)}
              onChange={(v) => set('recall_lending', v)}
            />
          )}
        </Section>
      )}

      {/* Land */}
      {has('rent') && (
        <Section title="🌾 Đất đai & Địa tô">
          <Toggle
            label="Thuê đất (thay vì sở hữu)"
            value={decisions.rent_mode}
            onChange={(v) => set('rent_mode', v)}
          />
          {!decisions.rent_mode && (
            <NumberInput
              label={`Mua thêm đất (đơn vị, ${formatVnd(landUnitPrice, true)}/đơn vị)`}
              value={decisions.buy_land}
              min={0}
              max={Math.min(10, Math.floor(cash / Math.max(1, landUnitPrice)))}
              step={1}
                            unit="đơn vị"
              preview={landPurchaseCost > 0 ? `Tổng giá đất: ${formatVnd(landPurchaseCost, true)}` : 'Mỗi đơn vị đất tính theo địa tô tư bản hóa'}
              onChange={(v) => set('buy_land', v)}
            />
          )}
        </Section>
      )}

      {/* Reinvestment */}
      {has('reinvest') && (
        <Section title="🔄 Tái đầu tư">
          <Slider
            label="Tỷ lệ tái đầu tư α"
            value={decisions.alpha}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => set('alpha', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <p className="text-xs text-stone-500">
            Tái đầu tư {(decisions.alpha * 100).toFixed(0)}% lợi nhuận → mở rộng quy mô sản xuất
          </p>
        </Section>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canAfford}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all mt-2 ${
          canAfford
            ? 'btn-action'
            : 'bg-stone-900 text-stone-500 cursor-not-allowed'
        }`}
      >
        {canAfford ? '▶ Thực hiện vòng sản xuất' : '⚠ Không đủ tiền'}
      </button>
    </div>
  )
}


