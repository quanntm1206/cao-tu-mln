import { useMemo, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { useGameStore } from '../store/gameStore'
import { formatVndAxis } from '../lib/currency'

type ChartTab = 'mpool' | 'profits' | 'distribution'

const tooltipStyle = {
  backgroundColor: '#231914',
  border: '1px solid rgba(217,119,6,0.35)',
  borderRadius: '0.75rem',
  color: '#f4ead7',
  fontSize: '12px',
}

export default function Charts() {
  const { history, phase } = useGameStore()
  const [tab, setTab] = useState<ChartTab>('mpool')

  const chartData = useMemo(() => {
    let runningInd = 0; let runningMer = 0; let runningFin = 0; let runningRent = 0
    return history.map((entry) => {
      const r = entry.result
      if (r.phase === 1) runningInd += r.total_industrial_profit
      if (r.phase === 2) runningMer += r.merchant_profit
      if (r.phase === 3) { runningFin += r.interest_earned; runningFin -= r.interest_paid }
      if (r.phase === 4) runningRent += r.land_gain
      return {
        round: `V${entry.round}`,
        phase: r.phase,
        ind: r.phase === 1 ? Math.round(r.total_industrial_profit) : 0,
        mer: r.phase === 2 ? Math.round(r.merchant_profit) : 0,
        fin: r.phase === 3 ? Math.round(r.net_finance) : 0,
        ren: r.phase === 4 ? Math.round(r.land_gain) : 0,
        p_rate: r.phase === 1 ? parseFloat((r.p_rate * 100).toFixed(1)) : null,
        cumInd: Math.round(runningInd),
        cumMer: Math.round(runningMer),
        cumFin: Math.round(runningFin),
        cumRent: Math.round(runningRent),
      }
    })
  }, [history])

  const tabs: { id: ChartTab; label: string }[] = [
    { id: 'mpool', label: 'M-pool' },
    { id: 'profits', label: 'Loi nhuan' },
    { id: 'distribution', label: 'Phan phoi' },
  ]

  if (history.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center text-stone-500 text-sm">
        Chua co du lieu – hay bat dau thi dau!
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${tab === t.id ? 'bg-amber-700 text-stone-50' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'mpool' && (
        <div>
          <p className="text-xs text-stone-500 mb-2">Loi nhuan CN tich luy qua cac vong</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData.filter(d => d.ind > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tickFormatter={formatVndAxis} tick={{ fill: '#9ca3af', fontSize: 10 }} width={55} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatVndAxis(v)} />
              <Bar dataKey="ind" name="Loi nhuan CN" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          {phase >= 2 && (
            <>
              <p className="text-xs text-stone-500 mt-4 mb-2">Loi nhuan TN cac vong</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData.filter(d => d.mer > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tickFormatter={formatVndAxis} tick={{ fill: '#9ca3af', fontSize: 10 }} width={55} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatVndAxis(v)} />
                  <Bar dataKey="mer" name="Loi nhuan TN" fill="#f59e0b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      )}

      {tab === 'profits' && (
        <div>
          <p className="text-xs text-stone-500 mb-2">Ty suat loi nhuan p' (Pha 1)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData.filter(d => d.p_rate !== null)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} unit="%" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v.toFixed(1)}%`} />
              <Line type="monotone" dataKey="p_rate" name="p'" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'distribution' && (
        <div>
          <p className="text-xs text-stone-500 mb-2">Phan phoi GTTT tich luy – m = p + p_TN + Z + R</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData.slice(-8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="round" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tickFormatter={formatVndAxis} tick={{ fill: '#9ca3af', fontSize: 10 }} width={55} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatVndAxis(v)} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Bar dataKey="cumInd" name="p (CN)" fill="#3b82f6" stackId="a" />
              <Bar dataKey="cumMer" name="p_TN" fill="#f59e0b" stackId="a" />
              <Bar dataKey="cumFin" name="Z" fill="#ef4444" stackId="a" />
              <Bar dataKey="cumRent" name="R" fill="#f97316" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
