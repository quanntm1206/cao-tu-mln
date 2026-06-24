interface Props {
  phase: 1 | 2 | 3 | 4
  accent: string
}

const CONTENT: Record<number, { title: string; bullets: string[] }> = {
  1: {
    title: 'Đừng hiểu nhầm',
    bullets: [
      'Không phải toàn bộ c+v tự sinh m; chỉ lao động sống tương ứng với v tạo giá trị mới.',
      'c (máy móc, nguyên liệu) chỉ chuyển giá trị hoặc tạo điều kiện sản xuất — không tự tạo m.',
      'Mua thêm máy không tăng m/v; nó chỉ nâng khả năng triển khai vốn ở vòng sau.',
    ],
  },
  2: {
    title: 'Đừng hiểu nhầm',
    bullets: [
      'Thương nghiệp không tạo m mới; nó nhận một phần m để thực hiện hàng hóa.',
      'Tổng m xã hội không đổi; chỉ thay đổi phân phối giữa công nghiệp và thương nghiệp.',
      'm mới do lưu thông tạo ra = 0.',
      'Đừng hiểu nhầm: mua rẻ bán đắt trong lưu thông không phải nguồn gốc cuối cùng của m; m đã được tạo ra trong sản xuất.',
    ],
  },
  3: {
    title: 'Đừng hiểu nhầm',
    bullets: [
      'Tư bản cho vay không trực tiếp tạo m; lợi tức Z là phần m/lợi nhuận được phân phối cho chủ tư bản cho vay.',
      'Z = TBCV × Z′; Z là lợi tức (số tiền), Z′ là tỷ suất lợi tức.',
      'm mới do tài chính tạo ra = 0.',
    ],
  },
  4: {
    title: 'Đừng hiểu nhầm',
    bullets: [
      'Đất có giá cả, nhưng giá cả đất đai là địa tô được tư bản hóa; đất không tự tạo m.',
      'P_land = R/Z′ — giá đất phản ánh địa tô kỳ vọng và tỷ suất lợi tức, không phải giá trị lao động.',
      'm mới do đất tạo ra = 0.',
    ],
  },
}

export default function DontMisunderstand({ phase, accent }: Props) {
  const data = CONTENT[phase]
  if (!data) return null
  return (
    <div
      className="lab-card p-5 border-l-4 mx-auto max-w-4xl px-4 sm:px-6 my-6"
      style={{ borderLeftColor: accent }}
      data-testid={`dont-misunderstand-phase-${phase}`}
    >
      <p className="lab-cite mb-3" style={{ color: accent }}>{data.title}</p>
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
