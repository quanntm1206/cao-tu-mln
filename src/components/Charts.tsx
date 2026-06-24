import { useMemo, useState } from 'react'
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
import { getTeachingAidForRound } from '../data/teachingAids'

type ChartTab = 'netWorth' | 'surplus' | 'profitRate' | 'surplusRate' | 'organic'

function fmt(n: number) {
  return formatVndAxis(n)
}

const CHART_STYLE = { backgroundColor: 'transparent', border: 'none' }
const tooltipStyle = {
  backgroundColor: '#231914',
  border: '1px solid rgba(217, 119, 6, 0.35)',
  borderRadius: '0.75rem',
  color: '#f4ead7',
  fontSize: '12px',
}

export default function Charts() {
  const { history, unlockedFeatures, round } = useGameStore()
  const surplusRevealed = unlockedFeatures.includes('surplus_reveal')
  const [activeTab, setActiveTab] = useState<ChartTab>('netWorth')
  const aid = getTeachingAidForRound(round)

  const chartData = useMemo(() => history.map((entry) => ({
    round: `V${entry.round}`,
    m: Math.round(entry.result.m),
    m_super: Math.round(entry.result.m_super),
    net_profit: Math.round(entry.result.net_profit),
    p_rate: parseFloat((entry.result.p_rate * 100).toFixed(1)),
    p_bar: parseFloat((entry.state_after.p_bar * 100).toFixed(1)),
    p_converged: parseFloat((entry.result.p_rate_converged * 100).toFixed(1)),
    m_rate: parseFloat((entry.result.m_rate * 100).toFixed(1)),
    organic: parseFloat(entry.result.organic_comp.toFixed(2)),
    cash: Math.round(entry.state_after.cash),
    net_worth: Math.round(
      entry.state_after.cash +
        entry.state_after.c_fixed_book +
        entry.state_after.c_circulating_stock +
        entry.state_after.lending -
        entry.state_after.debt,
    ),
  })), [history])

  if (history.length === 0) {
    return (
      <div className="theory-card rounded-xl p-6 min-h-72 flex items-center justify-center text-center">
        <div className="relative z-10 max-w-md">
          <p className="text-4xl mb-3">📈</p>
          <h3 className="text-lg font-bold text-stone-50 mb-2">Chưa có dữ liệu biểu đồ</h3>
          <p className="text-sm text-stone-300 leading-relaxed">Hoàn thành vòng đầu tiên để thấy số liệu. Trước mắt, hãy tập trung vào mục tiêu: {aid.objective}</p>
          <p className="text-xs text-amber-200 mt-3">Gợi ý giáo viên: {aid.discussionQuestion}</p>
        </div>
      </div>
    )
  }

  const tabs: Array<{ id: ChartTab; label: string; enabled: boolean }> = [
    { id: 'netWorth', label: 'Tài sản', enabled: true },
    { id: 'surplus', label: surplusRevealed ? 'm' : 'Lợi nhuận', enabled: true },
    { id: 'profitRate', label: "p' / P̄", enabled: surplusRevealed && history.length >= 3 },
    { id: 'surplusRate', label: "m'", enabled: surplusRevealed && history.length >= 3 },
    { id: 'organic', label: 'c/v', enabled: history.length >= 4 },
  ]
  const visibleTabs = tabs.filter((tab) => tab.enabled)
  const currentTab = visibleTabs.some((tab) => tab.id === activeTab) ? activeTab : visibleTabs[0].id

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Bảng trực quan</p>
          <h3 className="text-lg font-bold text-stone-50">Biểu đồ liên quan bài hiện tại</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                currentTab === tab.id
                  ? 'bg-amber-500 text-stone-950'
                  : 'bg-stone-950/55 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {currentTab === 'netWorth' && (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} style={CHART_STYLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(199,154,107,0.22)" />
            <XAxis dataKey="round" tick={{ fill: '#c7b299', fontSize: 11 }} />
            <YAxis tickFormatter={fmt} tick={{ fill: '#c7b299', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatVnd(value, true), '']} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#c7b299' }} />
            <Line type="monotone" dataKey="net_worth" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3 }} name="Tài sản ròng" />
            <Line type="monotone" dataKey="cash" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Tiền mặt" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {currentTab === 'surplus' && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} style={CHART_STYLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(199,154,107,0.22)" />
            <XAxis dataKey="round" tick={{ fill: '#c7b299', fontSize: 11 }} />
            <YAxis tickFormatter={fmt} tick={{ fill: '#c7b299', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatVnd(value, true), '']} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#c7b299' }} />
            <Bar dataKey="m" name={surplusRevealed ? 'GTTT (m)' : 'Lợi nhuận'} fill="#22c55e" radius={[3, 3, 0, 0]} />
            {surplusRevealed && <Bar dataKey="m_super" name="Siêu GTTT" fill="#a855f7" radius={[3, 3, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      )}

      {currentTab === 'profitRate' && (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} style={CHART_STYLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(199,154,107,0.22)" />
            <XAxis dataKey="round" tick={{ fill: '#c7b299', fontSize: 11 }} />
            <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: '#c7b299', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, '']} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#c7b299' }} />
            <Line type="monotone" dataKey="p_rate" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} name="p' của bạn (%)" />
            <Line type="monotone" dataKey="p_bar" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 4" dot={false} name="P̄ thị trường (%)" />
            <Line type="monotone" dataKey="p_converged" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="2 2" dot={false} name="p' sau kéo về P̄ (%)" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {currentTab === 'surplusRate' && (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} style={CHART_STYLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(199,154,107,0.22)" />
            <XAxis dataKey="round" tick={{ fill: '#c7b299', fontSize: 11 }} />
            <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: '#c7b299', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, '']} />
            <Line type="monotone" dataKey="m_rate" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308', r: 3 }} name="m' (%)" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {currentTab === 'organic' && (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} style={CHART_STYLE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(199,154,107,0.22)" />
            <XAxis dataKey="round" tick={{ fill: '#c7b299', fontSize: 11 }} />
            <YAxis tick={{ fill: '#c7b299', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value.toFixed(2), 'c/v']} />
            <Line type="monotone" dataKey="organic" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} name="c / v" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
