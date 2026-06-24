import { useGameStore } from '../store/gameStore'

const PHASE_FOCUS: Record<number, { title: string; concept: string; formula: string; objective: string }> = {
  1: {
    title: 'Pha 1 - Lợi nhuận Công nghiệp',
    concept: "p' = m / (c+v)",
    formula: 'Tỷ suất lợi nhuận bình quân',
    objective: 'Hiểu lợi nhuận CN xuất phát từ GTTT m, không phải từ mua bán.',
  },
  2: {
    title: 'Pha 2 - Lợi nhuận Thương nghiệp',
    concept: 'p_TN = phần m nhượng cho thương nhân',
    formula: 'm = p_CN + p_TN',
    objective: 'Tư bản thương nghiệp không tạo m độc lập; nó là phân phối từ m.',
  },
  3: {
    title: 'Pha 3 - Lãi tức (Z)',
    concept: 'Z = m chuyển cho chủ sở hữu tư bản cho vay',
    formula: 'Giá vốn cho vay x lãi suất',
    objective: 'Lãi tức không phải nguồn GTTT độc lập - là hình thức phân chia từ m.',
  },
  4: {
    title: 'Pha 4 - Địa tô (R) & Giá đất',
    concept: 'Giá đất = R / i',
    formula: 'Địa tô = m chuyển cho chủ sở hữu đất',
    objective: 'Giá đất phản ánh sự vốn hóa địa tô. Bong bóng đất tách rời GTTT thực.',
  },
}

export default function TeachingFocus({ round }: { round: number }) {
  const phase = useGameStore((s) => s.phase)
  const focus = PHASE_FOCUS[phase] ?? PHASE_FOCUS[1]
  const roundInPhase = ((round - 1) % 4) + 1

  return (
    <div className="theory-card rounded-xl p-4 mb-4">
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-1">Mục tiêu Pha {phase} - Vòng {roundInPhase}/4</p>
        <p className="text-sm font-bold text-stone-50 mb-1">{focus.title}</p>
        <p className="text-sm text-stone-300 leading-relaxed mb-2">{focus.objective}</p>
        <div className="bg-stone-950/60 rounded-lg p-2 text-xs font-mono text-center">
          <span className="text-amber-300">{focus.concept}</span>
        </div>
        <p className="text-xs text-stone-500 mt-2">📐 {focus.formula}</p>
      </div>
    </div>
  )
}