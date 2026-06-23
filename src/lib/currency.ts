/** Định dạng VND theo quy ước DN Việt Nam: triệu / tỷ */
export function formatVnd(amount: number, compact = false): string {
  const n = Math.round(amount)
  if (n === 0) return '0 ₫'

  const abs = Math.abs(n)

  if (abs >= 1_000_000_000) {
    const ty = n / 1_000_000_000
    const digits = compact && abs >= 10_000_000_000 ? 1 : 2
    return `${ty.toLocaleString('vi-VN', { maximumFractionDigits: digits, minimumFractionDigits: 0 })} tỷ ₫`
  }

  if (abs >= 1_000_000) {
    const trieu = n / 1_000_000
    const digits = compact && abs >= 100_000_000 ? 0 : 1
    return `${trieu.toLocaleString('vi-VN', { maximumFractionDigits: digits, minimumFractionDigits: 0 })} triệu ₫`
  }

  return `${n.toLocaleString('vi-VN')} ₫`
}

/** Rút gọn cho trục biểu đồ */
export function formatVndAxis(amount: number): string {
  const abs = Math.abs(amount)
  if (abs >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}tỷ`
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)}tr`
  if (abs >= 1_000) return `${(amount / 1_000).toFixed(0)}k`
  return amount.toFixed(0)
}
