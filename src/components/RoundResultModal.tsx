import { useGameStore } from '../store/gameStore'
import { formatVnd } from '../lib/currency'
import OpenQuestionCard from './OpenQuestionCard'
import type { GamePhase } from '../engine/distribution'

const PHASE_END_ROUNDS = [4, 8, 12, 16]

export default function RoundResultModal() {
  const { round, lastResult, lastEvent, dismissLesson, gameOver } = useGameStore()
  const prevRound = round - 1
  const isPhaseEnd = PHASE_END_ROUNDS.includes(prevRound)

  if (!lastResult) {
    dismissLesson()
    return null
  }

  const fmt = (n: number) => formatVnd(n, true)
  const continueLabel = gameOver ? 'Xem tong ket' : `Tiep tuc vong ${round}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/70 p-4">
      <div className="theory-card rounded-2xl p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">
              {lastResult.phase === 1 ? '🏭' : lastResult.phase === 2 ? '🛒' : lastResult.phase === 3 ? '🏦' : '🏔'}
            </span>
            <div>
              <p className="text-xs text-amber-300 uppercase tracking-wider">Vong {prevRound} – Pha {lastResult.phase}/4</p>
              <h2 className="text-lg font-bold text-stone-50">
                {lastResult.phase === 1 ? 'San xuat Cong nghiep'
                  : lastResult.phase === 2 ? 'Thuong nghiep'
                  : lastResult.phase === 3 ? 'Tai chinh / Lai tuc'
                  : 'Dat dai & Dia to'}
              </h2>
            </div>
          </div>

          {/* Phase-specific results */}
          <div className="space-y-2 mb-4">
            {lastResult.phase === 1 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Loi nhuan Co khi" value={fmt(r.co_khi_profit)} />
                  <ResultRow label="Loi nhuan Det may" value={fmt(r.det_profit)} />
                  <ResultRow label="Loi nhuan Da giay" value={fmt(r.da_profit)} />
                  <ResultRow label="Tong loi nhuan CN" value={fmt(r.total_industrial_profit)} highlight />
                  <ResultRow label="Ty suat loi nhuan p'" value={`${(r.p_rate * 100).toFixed(1)}%`} />
                </>
              )
            })()}
            {lastResult.phase === 2 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Loi nhuan TN nhuong" value={fmt(r.merchant_profit)} />
                  <ResultRow label="Loi nhuan CN giu lai" value={fmt(r.industrial_profit_after)} highlight />
                </>
              )
            })()}
            {lastResult.phase === 3 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Lai da tra (Z)" value={fmt(r.interest_paid)} color="text-red-400" />
                  <ResultRow label="Lai thu duoc" value={fmt(r.interest_earned)} color="text-green-400" />
                  <ResultRow label="Tai chinh rong" value={fmt(r.net_finance)} highlight />
                </>
              )
            })()}
            {lastResult.phase === 4 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Dia to da tra (R)" value={fmt(r.rent_paid)} color="text-red-400" />
                  <ResultRow label="Gia tri dat" value={fmt(r.land_value)} />
                  <ResultRow label="Gain/loss dat" value={fmt(r.land_gain)} highlight />
                </>
              )
            })()}
          </div>

          {/* Lesson */}
          <div className="rounded-xl bg-amber-950/30 border border-amber-800/40 p-3 mb-4">
            <p className="text-xs text-amber-300 mb-1 font-semibold">Bai hoc kinh te chinh tri</p>
            <p className="text-sm text-stone-200 leading-relaxed">{lastResult.lesson}</p>
          </div>

          {/* Quick event */}
          {lastEvent && (
            <div className="rounded-xl bg-stone-900/60 border border-stone-700/50 p-3 mb-4">
              <p className="text-xs text-stone-400 mb-1">Tinh huong: {lastEvent.title}</p>
              <p className="text-sm text-stone-300">{lastEvent.resultText}</p>
            </div>
          )}

          {/* Open question at phase end */}
          {isPhaseEnd && (
            <OpenQuestionCard phase={lastResult.phase as GamePhase} />
          )}

          <button onClick={dismissLesson}
            className="w-full mt-4 py-3 rounded-xl font-bold text-base btn-action">
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function ResultRow({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className="flex justify-between items-center bg-stone-900/50 rounded-lg px-3 py-2">
      <span className="text-xs text-stone-400">{label}</span>
      <span className={`text-sm font-bold ${color ?? (highlight ? 'text-amber-300' : 'text-stone-100')}`}>{value}</span>
    </div>
  )
}
