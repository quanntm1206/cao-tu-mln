import { useGameStore } from '../store/gameStore'
import { calcNetWorth } from '../lib/networth'
import { formatVnd } from '../lib/currency'
import TheoryTooltip from './TheoryTooltip'

function fmtPct(n: number) {
  return (n * 100).toFixed(1) + '%'
}

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  color?: string
  metricKey?: string
  locked?: boolean
}

function MetricCard({ label, value, sub, color = 'text-white', metricKey, locked }: MetricCardProps) {
  return (
    <div className={`glass-card rounded-xl p-4 ${locked ? 'opacity-40' : ''}`}>
      <p className="text-xs text-gray-400 mb-1">
        {metricKey ? (
          <TheoryTooltip metricKey={metricKey}>{label}</TheoryTooltip>
        ) : (
          label
        )}
      </p>
      <p className={`text-xl font-bold ${color} ${locked ? 'blur-sm' : ''}`}>
        {locked ? '???' : value}
      </p>
      {sub && !locked && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function MetricsPanel() {
  const {
    cash,
    c_fixed_book,
    c_circulating_stock,
    debt,
    lending,
    workers,
    v_per_worker,
    lastResult,
    unlockedFeatures,
    round,
    land_units,
    p_bar,
    rent_per_unit,
    bank_interest_rate,
  } = useGameStore()

  const surplusRevealed = unlockedFeatures.includes('surplus_reveal')
  const showOrganic = round >= 4
  const showTurnover = round >= 7

  const netWorth = Math.round(
    calcNetWorth({
      cash,
      c_fixed_book,
      c_circulating_stock,
      lending,
      debt,
      land_units,
      rent_per_unit,
      bank_interest_rate,
    }),
  )

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Bảng chỉ số
      </h2>

      {/* Net worth */}
      <div className="glass-card rounded-xl p-4 border border-blue-800/30 glow-blue">
        <p className="text-xs text-gray-400 mb-1">Tài sản ròng</p>
        <p className="text-2xl font-black text-blue-400">{formatVnd(netWorth)}</p>
        <div className="flex gap-3 mt-2 text-xs text-gray-500">
          <span>Tiền: {formatVnd(cash, true)}</span>
          <span>Nợ: {formatVnd(debt, true)}</span>
        </div>
      </div>

      {/* Capital structure */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Tư bản cố định" value={formatVnd(c_fixed_book, true)} color="text-yellow-400" />
        <MetricCard label="Tư bản lưu động" value={formatVnd(c_circulating_stock, true)} color="text-orange-400" />
      </div>

      {/* Labor */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-2">Sức lao động</p>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{workers} công nhân</span>
          <span className="text-gray-300">{formatVnd(v_per_worker, true)}/người/vòng</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Tiền công biểu hiện bằng tiền của giá trị hàng hóa sức lao động.
        </p>
      </div>

      {/* Economy metrics */}
      {lastResult && (
        <>
          <div className="border-t border-gray-800 pt-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Vòng vừa rồi</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label={surplusRevealed ? 'Giá trị thặng dư m' : 'Lợi nhuận'}
              value={formatVnd(lastResult.m, true)}
              color="text-green-400"
              metricKey={surplusRevealed ? 'm' : undefined}
            />
            <MetricCard
              label={surplusRevealed ? "Tỷ suất GTTT m'" : 'Tỷ suất lợi nhuận'}
              value={surplusRevealed ? fmtPct(lastResult.m_rate) : fmtPct(lastResult.p_rate)}
              color="text-emerald-400"
              metricKey={surplusRevealed ? 'm_rate' : 'p_rate'}
            />
          </div>

          {surplusRevealed && (
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Giá trị tổng G"
                value={formatVnd(lastResult.G, true)}
                metricKey="G"
              />
              <MetricCard
                label="Giá thành k"
                value={formatVnd(lastResult.k, true)}
                metricKey="k"
              />
            </div>
          )}

          {showOrganic && (
            <MetricCard
              label="Thành phần hữu cơ"
              value={lastResult.organic_comp.toFixed(2)}
              sub="c / v"
              metricKey="organic_comp"
            />
          )}

          {showTurnover && (
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Vòng quay n"
                value={lastResult.n.toFixed(1)}
                metricKey="n"
              />
              <MetricCard
                label="GTTT hàng năm"
                value={formatVnd(lastResult.M_year, true)}
                metricKey="M_year"
              />
            </div>
          )}

          {lastResult.m_super > 0 && (
            <MetricCard
              label="Siêu GTTT"
              value={`+${formatVnd(lastResult.m_super, true)}`}
              color="text-purple-400"
              metricKey="m_super"
            />
          )}

          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">Phân phối GTTT</p>
            <div className="space-y-1 text-sm">
              {lastResult.z_interest > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Lãi vay →</span>
                  <span className="text-red-400">−{formatVnd(lastResult.z_interest, true)}</span>
                </div>
              )}
              {lastResult.z_earned > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Lãi cho vay ←</span>
                  <span className="text-green-400">+{formatVnd(lastResult.z_earned, true)}</span>
                </div>
              )}
              {lastResult.rent_cost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Địa tô →</span>
                  <span className="text-red-400">−{formatVnd(lastResult.rent_cost, true)}</span>
                </div>
              )}
              {lastResult.p_merchant > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Thương nghiệp →</span>
                  <span className="text-orange-400">−{formatVnd(lastResult.p_merchant, true)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
                <span className="text-gray-300 font-medium">Lợi nhuận ròng</span>
                <span className={`font-bold ${lastResult.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatVnd(lastResult.net_profit, true)}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">P̄ thị trường</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all"
                  style={{ width: `${Math.min(100, p_bar * 200)}%` }}
                />
              </div>
              <span className="text-xs text-blue-300 font-mono">{fmtPct(p_bar)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
