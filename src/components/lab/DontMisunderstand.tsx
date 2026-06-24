interface Props {
  phase: 1 | 2 | 3 | 4
  accent: string
}

const CONTENT: Record<number, { title: string; bullets: string[] }> = {
  1: {
    title: 'Đừng hiểu nhầm: máy móc không tạo ra m mới',
    bullets: [
      'c (tư bản bất biến) chỉ chuyển giá trị cũ sang sản phẩm qua khấu hao — không tự sinh m.',
      'Chỉ v (tư bản khả biến — tiền công lao động sống) mới tạo ra m = v × m′.',
      'Ngành có c/v cao (cơ khí) có p′ thấp hơn ngành có c/v thấp (da giày) — vì v nhỏ hơn.',
      'Mua thêm máy không tăng m/v; nó chỉ nâng năng lực triển khai vốn khả dụng.',
    ],
  },
  2: {
    title: 'Đừng hiểu nhầm: lưu thông không tạo ra m mới',
    bullets: [
      'Lợi nhuận thương nghiệp = phần m nhà sản xuất nhượng lại cho thương nhân — không phải m mới.',
      'Tổng m trong xã hội không tăng khi hàng hóa qua tay thương nhân.',
      'm mới do lưu thông tạo ra = 0.',
      'Thương nhân đẩy nhanh vòng quay vốn, giúp thực hiện giá trị — nhưng không sản sinh giá trị.',
    ],
  },
  3: {
    title: 'Đừng hiểu nhầm: tài chính không tạo ra m mới',
    bullets: [
      'Lãi tức Z là phần m từ sản xuất chuyển sang chủ tư bản cho vay — không phải m mới.',
      'Tín dụng giúp mở rộng sản xuất, nhưng bản thân tiền không sinh m; chỉ lao động sống mới sinh m.',
      'm mới do tài chính tạo ra = 0.',
      'Z = T_cho_vay × Z′ — lãi tức tỷ lệ với gốc cho vay và tỷ suất lãi tức.',
    ],
  },
  4: {
    title: 'Đừng hiểu nhầm về địa tô',
    bullets: [
      'Địa tô không phải do đất tự tạo ra. Địa tô là một phần giá trị thặng dư do lao động tạo ra trong sản xuất, được chuyển cho chủ sở hữu đất thông qua quan hệ sở hữu.',
      'Đất đai không phải sản phẩm của lao động nên bản thân nó không có giá trị theo nghĩa hàng hóa thông thường; giá cả đất đai là địa tô được tư bản hóa (P_land = R / Z′).',
      'm mới do đất tạo ra = 0.',
      'Giá đất tăng khi địa tô kỳ vọng tăng hoặc tỷ suất lợi tức giảm — vốn hóa địa tô, không phải đất tự sinh giá trị.',
    ],
  },
}

export default function DontMisunderstand({ phase, accent }: Props) {
  const data = CONTENT[phase]
  if (!data) return null
  return (
    <div
      className="lab-card p-5 border-l-4"
      style={{ borderLeftColor: accent }}
      data-testid={`dont-misunderstand-phase-${phase}`}
    >
      <p className="lab-cite mb-3" style={{ color: accent }}>
        {data.title}
      </p>
      <ul className="space-y-1.5">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-lab-fg-muted)]">
            <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accent }} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}