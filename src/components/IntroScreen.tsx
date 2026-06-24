import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { FlaskConical, Factory, Store, Banknote, Sprout, ArrowRight, Trophy } from 'lucide-react'

const APP_VERSION = 'v0.7.1'

interface Props {
  onShowLeaderboard: () => void
}

const PHASES = [
  { n: 1, Icon: Factory, label: 'Sản xuất', desc: 'Cơ khí · Dệt · Da giày', color: 'var(--color-phase-1)' },
  { n: 2, Icon: Store, label: 'Thương nghiệp', desc: 'Phân phối lợi nhuận', color: 'var(--color-phase-2)' },
  { n: 3, Icon: Banknote, label: 'Tài chính', desc: 'Lãi tức Z', color: 'var(--color-phase-3)' },
  { n: 4, Icon: Sprout, label: 'Địa tô', desc: 'Giá cả đất đai = R/Z′', color: 'var(--color-phase-4)' },
]

const FORMULAS = [
  { l: 'k', r: '= c + v', muted: false },
  { l: "m'", r: '= m / v', muted: false },
  { l: "p'", r: '= m / (c + v)', muted: false },
  { l: "Z'", r: '= Z / TBCV', muted: false },
  { l: 'Giá cả đất đai', r: '= R / Z′', muted: true },
]

export default function IntroScreen({ onShowLeaderboard }: Props) {
  const [name, setName] = useState('')
  const startGame = useGameStore((s) => s.startGame)

  const handleStart = () => {
    const n = name.trim()
    if (n) startGame(n)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top thin bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[var(--color-lab-cyan)]" strokeWidth={1.75} />
          <span className="font-display font-bold text-base">
            Surplus<span className="text-[var(--color-lab-cyan)]">.Lab</span>
          </span>
        </div>
        <p className="text-[10px] font-mono text-[var(--color-lab-fg-dim)] uppercase tracking-widest">
          {APP_VERSION} · KTCT Mác–Lênin Ch.3
        </p>
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-16 pt-4 sm:pt-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          {/* LEFT — Hero */}
          <div>
            <p className="lab-phase-chip mb-6" style={{ color: 'var(--color-lab-cyan)', background: 'var(--color-lab-cyan-soft)' }}>
              Mô phỏng phân chia GTTT
            </p>
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
              Tiền không tự<br />
              đẻ ra <span className="text-[var(--color-lab-cyan)]">tiền</span>.
            </h1>
            <p className="text-[var(--color-lab-fg-muted)] text-lg leading-relaxed max-w-xl mb-8">
              Một phòng-lab tương tác để thấy giá trị thặng dư
              <em className="text-[var(--color-lab-fg)] not-italic font-semibold"> m </em>
              được chia thành lợi nhuận công nghiệp, lợi nhuận thương nghiệp, lãi tức và địa tô —
              như thế nào, và vì sao.
            </p>

            {/* Formula grid */}
            <div className="grid sm:grid-cols-2 gap-2 mb-8 max-w-md">
              {FORMULAS.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-baseline gap-2 font-mono text-sm px-3 py-2 rounded-md ${
                    f.muted
                      ? 'text-[var(--color-lab-fg-dim)] bg-[var(--color-lab-surface)]/40'
                      : 'text-[var(--color-lab-fg)] bg-[var(--color-lab-cyan-soft)] border border-[var(--color-lab-cyan)]/30'
                  }`}
                >
                  <span className="font-bold">{f.l}</span>
                  <span className="opacity-70">{f.r}</span>
                </div>
              ))}
            </div>

            {/* Mini glossary — symbols at a glance */}
            <div className="lab-card p-4 mb-6 max-w-md">
              <p className="lab-cite mb-2 text-[var(--color-lab-fg-dim)]">Ý NGHĨA KÝ HIỆU</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {[
                  { sym: 'm', meaning: 'Giá trị thặng dư' },
                  { sym: 'k', meaning: 'Chi phí sản xuất = c + v' },
                  { sym: 'p', meaning: 'Lợi nhuận — về bản chất chính là m' },
                  { sym: "p'", meaning: 'Tỷ suất lợi nhuận = m/(c+v)' },
                  { sym: "m'", meaning: 'Tỷ suất giá trị thặng dư = m/v' },
                  { sym: 'Z', meaning: 'Lợi tức — phần m trả cho chủ tư bản cho vay' },
                  { sym: "Z'", meaning: 'Tỷ suất lợi tức = Z/TBCV' },
                  { sym: 'R', meaning: 'Địa tô — phần m chiếm bởi địa chủ' },
                  { sym: 'k₫', meaning: 'Tài sản/vốn khả dụng — tiền mặt người chơi (không phải m)' },
                  { sym: '—', meaning: 'Lợi nhuận thương nghiệp — một phần của m chuyển cho thương nhân (không có ký hiệu riêng)' },
                ].map((g) => (
                  <div key={g.sym} className="flex items-baseline gap-2">
                    <dt className="font-mono font-bold text-xs text-[var(--color-lab-cyan)] shrink-0 min-w-[2.5rem]">
                      {g.sym}
                    </dt>
                    <dd className="text-[11px] text-[var(--color-lab-fg-muted)] leading-snug">
                      {g.meaning}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 4 phases preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PHASES.map(({ n, Icon, label, desc, color }) => (
                <div
                  key={n}
                  className="lab-card p-3 hover:-translate-y-0.5 transition-transform"
                  style={{ borderColor: `${color}55` }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={2} />
                    <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>
                      Pha {n}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-lab-fg)] leading-tight">{label}</p>
                  <p className="text-[11px] text-[var(--color-lab-fg-dim)] mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Sign in card */}
          <div className="lab-card-elevated p-7 sm:p-9">
            <p className="lab-cite mb-1">START_SESSION</p>
            <h2 className="font-display text-2xl font-bold mb-1">Bắt đầu nghiên cứu</h2>
            <p className="text-sm text-[var(--color-lab-fg-muted)] mb-6">
              16 vòng · 4 pha · ~15 phút
            </p>

            <label className="block mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-lab-fg-dim)] mb-2 block">
                Tên học viên
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder="Nguyễn Văn A…"
                className="lab-input w-full text-base"
                autoFocus
              />
            </label>

            <button
              onClick={handleStart}
              disabled={!name.trim()}
              data-testid="start-game-btn"
              className="lab-btn-primary w-full py-4 rounded-xl font-display text-base flex items-center justify-center gap-2"
            >
              Vào phòng-lab
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div className="mt-6 pt-5 border-t border-[var(--color-lab-border)] flex items-center justify-between">
              <button
                onClick={onShowLeaderboard}
                className="text-sm text-[var(--color-lab-fg-muted)] hover:text-[var(--color-lab-yellow)] transition-colors flex items-center gap-2"
              >
                <Trophy className="w-3.5 h-3.5" strokeWidth={2} />
                Bảng xếp hạng
              </button>
              <p className="lab-cite">Giáo trình tr.70–78</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
