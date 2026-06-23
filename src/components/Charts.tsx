import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useGameStore } from '../store/gameStore'
import { formatVnd, formatVndAxis } from '../lib/currency'

function fmt(n: number) {
  return formatVndAxis(n)
}

const CHART_STYLE = {
  backgroundColor: 'transparent',
  border: 'none',
}

const tooltipStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid #374151',
  borderRadius: '0.5rem',
  color: '#e5e7eb',
  fontSize: '12px',
}

export default function Charts() {
  const { history, unlockedFeatures } = useGameStore()
  const surplusRevealed = unlockedFeatures.includes('surplus_reveal')

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
        Chưa có dữ liệu. Hoàn thành vòng đầu tiên để xem biểu đồ.
      </div>
    )
  }

  const chartData = history.map((h) => ({
    round: `V${h.round}`,
    m: Math.round(h.result.m),
    m_super: Math.round(h.result.m_super),
    net_profit: Math.round(h.result.net_profit),
    p_rate: parseFloat((h.result.p_rate * 100).toFixed(1)),
    p_bar: parseFloat((h.state_after.p_bar * 100).toFixed(1)),
    p_converged: parseFloat((h.result.p_rate_converged * 100).toFixed(1)),
    m_rate: parseFloat((h.result.m_rate * 100).toFixed(1)),
    organic: parseFloat(h.result.organic_comp.toFixed(2)),
    cash: Math.round(h.state_after.cash),
    net_worth: Math.round(
      h.state_after.cash +
        h.state_after.c_fixed_book +
        h.state_after.c_circulating_stock +
        h.state_after.lending -
        h.state_after.debt,
    ),
  }))

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Net worth over time */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Tài sản ròng theo vòng</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} style={CHART_STYLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tickFormatter={fmt} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatVnd(v, true), '']} />
            <Line
              type="monotone"
              dataKey="net_worth"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              name="Tài sản ròng"
            />
            <Line
              type="monotone"
              dataKey="cash"
              stroke="#22c55e"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              name="Tiền mặt"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Profit / surplus value */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">
          {surplusRevealed ? 'Giá trị thặng dư m theo vòng' : 'Lợi nhuận theo vòng'}
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} style={CHART_STYLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tickFormatter={fmt} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatVnd(v, true), '']} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            <Bar dataKey="m" name={surplusRevealed ? 'GTTT (m)' : 'Lợi nhuận'} fill="#22c55e" radius={[3, 3, 0, 0]} />
            {surplusRevealed && (
              <Bar dataKey="m_super" name="Siêu GTTT" fill="#a855f7" radius={[3, 3, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {surplusRevealed && history.length >= 3 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">p&apos; so với P̄ thị trường</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} style={CHART_STYLE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Line
                type="monotone"
                dataKey="p_rate"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                name="p' của bạn (%)"
              />
              <Line
                type="monotone"
                dataKey="p_bar"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                name="P̄ thị trường (%)"
              />
              <Line
                type="monotone"
                dataKey="p_converged"
                stroke="#a855f7"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
                name="p' sau kéo về P̄ (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Rates */}
      {surplusRevealed && history.length >= 3 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Tỷ suất GTTT m&apos;</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} style={CHART_STYLE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Line
                type="monotone"
                dataKey="m_rate"
                stroke="#eab308"
                strokeWidth={2}
                dot={{ fill: '#eab308', r: 3 }}
                name="m' (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Organic composition */}
      {history.length >= 4 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Thành phần hữu cơ c/v</h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData} style={CHART_STYLE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toFixed(2), 'c/v']} />
              <Line
                type="monotone"
                dataKey="organic"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 3 }}
                name="c / v"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
