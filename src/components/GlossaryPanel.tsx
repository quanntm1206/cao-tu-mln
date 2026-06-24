import { GLOSSARY } from '../data/teachingAids'

export default function GlossaryPanel() {
  return (
    <details className="glass-card rounded-xl p-4 group">
      <summary className="cursor-pointer list-none text-sm font-bold text-amber-300 flex items-center justify-between gap-3">
        <span>📖 Sổ tay công thức</span>
        <span className="text-xs text-stone-500 group-open:hidden">Mở</span>
        <span className="text-xs text-stone-500 hidden group-open:inline">Đóng</span>
      </summary>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {GLOSSARY.map((item) => (
          <div key={item.term} className="rounded-lg bg-stone-950/45 border border-amber-900/25 p-3">
            <p className="font-mono text-sm font-bold text-amber-200">{item.term}</p>
            <p className="text-xs text-stone-300 leading-relaxed mt-1">{item.meaning}</p>
          </div>
        ))}
      </div>
    </details>
  )
}
