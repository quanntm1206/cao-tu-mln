import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import type { QuickEventChoice, QuickEventEffect } from '../data/quickEvents'
import { formatVnd } from '../lib/currency'

function describeEffect(effect: QuickEventEffect): string[] {
  const lines: string[] = []
  if (effect.cashDelta) lines.push(`${effect.cashDelta > 0 ? '+' : ''}${formatVnd(effect.cashDelta, true)} tiền mặt`)
  if (effect.materialsDelta) lines.push(`${effect.materialsDelta > 0 ? '+' : ''}${formatVnd(effect.materialsDelta, true)} nguyên liệu`)
  if (effect.machinesDelta) lines.push(`${effect.machinesDelta > 0 ? '+' : ''}${formatVnd(effect.machinesDelta, true)} máy móc`)
  if (effect.debtDelta) lines.push(`${effect.debtDelta > 0 ? '+' : ''}${formatVnd(effect.debtDelta, true)} nợ vay`)
  if (effect.lendingDelta) lines.push(`${effect.lendingDelta > 0 ? '+' : ''}${formatVnd(effect.lendingDelta, true)} cho vay`)
  if (effect.landUnitsDelta) lines.push(`${effect.landUnitsDelta > 0 ? '+' : ''}${effect.landUnitsDelta} đơn vị đất`)
  if (effect.hDelta) lines.push(`${effect.hDelta > 0 ? '+' : ''}${effect.hDelta} giờ lao động/ngày`)
  if (effect.wageDelta) lines.push(`${effect.wageDelta > 0 ? '+' : ''}${formatVnd(effect.wageDelta, true)} tiền công/người`)
  if (effect.workersDelta) lines.push(`${effect.workersDelta > 0 ? '+' : ''}${effect.workersDelta} công nhân`)
  if (effect.tNDelta) lines.push(`${effect.tNDelta > 0 ? '+' : ''}${effect.tNDelta.toFixed(2)} t_n`)
  if (effect.techLeadDelta) lines.push(`${effect.techLeadDelta > 0 ? '+' : ''}${(effect.techLeadDelta * 100).toFixed(0)}% lợi thế năng suất`)
  if (effect.logisticsLevelDelta) lines.push(`${effect.logisticsLevelDelta > 0 ? '+' : ''}${effect.logisticsLevelDelta} cấp lưu thông`)
  if (effect.merchantRateDelta) lines.push(`${effect.merchantRateDelta > 0 ? '+' : ''}${(effect.merchantRateDelta * 100).toFixed(0)} điểm % thương nghiệp`)
  if (effect.forceMerchant) lines.push('Bật kênh thương nghiệp')
  if (effect.forceRentMode) lines.push('Bật thuê đất để thấy địa tô')
  if (effect.alphaDelta) lines.push(`${effect.alphaDelta > 0 ? '+' : ''}${(effect.alphaDelta * 100).toFixed(0)} điểm % tái đầu tư`)
  return lines.length > 0 ? lines : ['Không đổi số liệu, tập trung quan sát lý thuyết']
}

function ChoiceCard({ choice, onChoose }: { choice: QuickEventChoice; onChoose: () => void }) {
  return (
    <button onClick={onChoose} className="w-full text-left bg-stone-950/65 hover:bg-stone-900 border border-stone-700/70 hover:border-amber-400 rounded-xl p-4 transition-all">
      <p className="text-sm font-bold text-stone-50 mb-2">{choice.label}</p>
      <p className="text-xs text-stone-400 mb-3">{choice.resultText}</p>
      <div className="flex flex-wrap gap-2">
        {describeEffect(choice.effect).map((line) => (
          <span key={line} className="text-[11px] bg-amber-950/50 text-amber-100 px-2 py-1 rounded-lg">{line}</span>
        ))}
      </div>
    </button>
  )
}

export default function QuickEventModal() {
  const event = useGameStore((state) => state.pendingQuickEvent)
  const chooseQuickEvent = useGameStore((state) => state.chooseQuickEvent)
  const [selectedChoice, setSelectedChoice] = useState<QuickEventChoice | null>(null)

  if (!event) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/70 p-4 overscroll-contain">
      <div className="theory-card rounded-2xl w-full max-w-lg mx-4 shadow-2xl flex flex-col max-h-[min(90dvh,90vh)]">
        <div className="flex-1 overflow-y-auto p-6 min-h-0" data-testid="quick-event-scroll-area">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🧾</span>
          <div>
            <p className="text-xs text-amber-300 uppercase tracking-wider">Tình huống sản xuất · Vòng {event.round}</p>
            <h2 className="text-2xl font-bold text-stone-50">{event.title}</h2>
          </div>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed mb-4">{event.description}</p>
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 mb-5">
          <p className="text-xs text-amber-200 leading-relaxed"><span className="font-bold">Gợi ý bài học:</span> {event.teachingPoint}</p>
        </div>

        {!selectedChoice ? (
          <div className="space-y-3">
            {event.choices.map((choice) => (
              <ChoiceCard key={choice.id} choice={choice} onChoose={() => setSelectedChoice(choice)} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-950/40 border border-green-800/40 rounded-xl p-4">
              <p className="text-sm font-bold text-green-300 mb-2">Bạn chọn: {selectedChoice.label}</p>
              <p className="text-sm text-stone-300 mb-3">{selectedChoice.resultText}</p>
              <p className="text-xs text-green-200 leading-relaxed"><span className="font-bold">Liên hệ giáo trình:</span> {selectedChoice.teachingPoint}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setSelectedChoice(null)} className="flex-1 py-3 rounded-xl font-bold text-stone-100 border border-stone-700/70 bg-stone-900/70 hover:bg-stone-800 transition-all">
                Đổi lựa chọn
              </button>
              <button onClick={() => chooseQuickEvent(selectedChoice.id)} className="flex-[1.25] py-3 rounded-xl font-bold text-stone-50 transition-all btn-primary">
                Áp dụng lựa chọn & tính vòng sản xuất →
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
