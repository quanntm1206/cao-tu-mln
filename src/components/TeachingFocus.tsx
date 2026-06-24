import { useGameStore } from '../store/gameStore'

const PHASE_FOCUS: Record<number, { title: string; concept: string; formula: string; objective: string }> = {
  1: {
    title: 'Pha 1 – Loi nhuan Cong nghiep',
    concept: 'p\' = m / (c+v)',
    formula: 'Ty suat loi nhuan binh quan',
    objective: 'Hieu loi nhuan CN xuat phat tu GTTT m, khong phai tu mua ban.',
  },
  2: {
    title: 'Pha 2 – Loi nhuan Thuong nghiep',
    concept: 'p_TN = phan m nhuong cho thuong nhan',
    formula: 'm = p_CN + p_TN',
    objective: 'Tu ban thuong nghiep khong tao m doc lap; no la phan phoi tu m.',
  },
  3: {
    title: 'Pha 3 – Lai tuc (Z)',
    concept: 'Z = m chuyen cho chu so huu tu ban cho vay',
    formula: 'Gia von cho vay × lai suat',
    objective: 'Lai tuc khong phai nguon GTTT doc lap – la hinh thuc phan chia tu m.',
  },
  4: {
    title: 'Pha 4 – Dia to (R) & Gia dat',
    concept: 'Gia dat = R / i',
    formula: 'Dia to = m chuyen cho chu so huu dat',
    objective: 'Gia dat phan anh su von hoa dia to. Bong bong dat tach roi GTTT thuc.',
  },
}

export default function TeachingFocus({ round }: { round: number }) {
  const phase = useGameStore((s) => s.phase)
  const focus = PHASE_FOCUS[phase] ?? PHASE_FOCUS[1]
  const roundInPhase = ((round - 1) % 4) + 1

  return (
    <div className="theory-card rounded-xl p-4 mb-4">
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-300 mb-1">Muc tieu Pha {phase} – Vong {roundInPhase}/4</p>
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
