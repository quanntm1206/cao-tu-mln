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
  const continueLabel = gameOver ? 'Xem tổng kết' : `Tiếp tục vòng ${round}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/70 p-4 overscroll-contain">
      <div className="theory-card rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[min(90dvh,90vh)]">
        <div
          className="flex-1 overflow-y-auto p-6 min-h-0 relative z-10"
          data-testid="round-result-scroll-area"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">
              {lastResult.phase === 1 ? '🏭' : lastResult.phase === 2 ? '🏪' : lastResult.phase === 3 ? '🏦' : '🏗️'}
            </span>
            <div>
              <p className="text-xs text-amber-300 uppercase tracking-wider">Vòng {prevRound} - Pha {lastResult.phase}/4</p>
              <h2 className="text-lg font-bold text-stone-50">
                {lastResult.phase === 1 ? 'Sản xuất Công nghiệp'
                  : lastResult.phase === 2 ? 'Thương nghiệp'
                  : lastResult.phase === 3 ? 'Tài chính / Lãi tức'
                  : 'Đất đai & Địa tô'}
              </h2>
            </div>
          </div>

          {/* Phase-specific results */}
          <div className="space-y-2 mb-4">
            {lastResult.phase === 1 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Lợi nhuận Cơ khí" value={fmt(r.co_khi_profit)} />
                  <ResultRow label="Lợi nhuận Dệt may" value={fmt(r.det_profit)} />
                  <ResultRow label="Lợi nhuận Da giày" value={fmt(r.da_profit)} />
                  <ResultRow label="Tổng lợi nhuận CN" value={fmt(r.total_industrial_profit)} highlight />
                  <ResultRow label="Tỷ suất lợi nhuận p'" value={`${(r.p_rate * 100).toFixed(1)}%`} />
                </>
              )
            })()}
            {lastResult.phase === 2 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Lợi nhuận TN nhượng" value={fmt(r.merchant_profit)} />
                  <ResultRow label="Lợi nhuận CN giữ lại" value={fmt(r.industrial_profit_after)} highlight />
                </>
              )
            })()}
            {lastResult.phase === 3 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Lãi đã trả (Z)" value={fmt(r.interest_paid)} color="text-red-400" />
                  <ResultRow label="Lãi thu được" value={fmt(r.interest_earned)} color="text-green-400" />
                  <ResultRow label="Tài chính ròng" value={fmt(r.net_finance)} highlight />
                </>
              )
            })()}
            {lastResult.phase === 4 && (() => {
              const r = lastResult
              return (
                <>
                  <ResultRow label="Địa tô đã trả (R)" value={fmt(r.rent_paid)} color="text-red-400" />
                  <ResultRow label="Giá trị đất" value={fmt(r.land_value)} />
                  <ResultRow label="Gain/loss đất" value={fmt(r.land_gain)} highlight />
                </>
              )
            })()}
          </div>

          {/* Lesson */}
          <div className="rounded-xl bg-amber-950/30 border border-amber-800/40 p-3 mb-4">
            <p className="text-xs text-amber-300 mb-1 font-semibold">Bài học kinh tế chính trị</p>
            <p className="text-sm text-stone-200 leading-relaxed">{lastResult.lesson}</p>
          </div>

          {/* Quick event */}
          {lastEvent && (
            <div className="rounded-xl bg-stone-900/60 border border-stone-700/50 p-3 mb-4">
              <p className="text-xs text-stone-400 mb-1">Tình huống: {lastEvent.title}</p>
              <p className="text-sm text-stone-300">{lastEvent.resultText}</p>
            </div>
          )}

          {/* Open question at phase end */}
          {isPhaseEnd && (
            <OpenQuestionCard phase={lastResult.phase as GamePhase} />
          )}
        </div>

        <div className="shrink-0 p-4 pt-3 border-t border-amber-900/30 bg-stone-950/50 relative z-10" data-testid="round-result-footer">
          <button onClick={dismissLesson}
            className="w-full py-3 rounded-xl font-bold text-base btn-action">
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