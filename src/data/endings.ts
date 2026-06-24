import { formatVnd } from '../lib/currency'

export type EndingId =
  | 'industrial_pure'
  | 'merchant_extreme'
  | 'lender_focus'
  | 'land_speculator'
  | 'land_wise'
  | 'balanced_distribution'

export interface EndingInput {
  industrial_profit: number
  merchant_profit: number
  interest_paid: number
  interest_earned: number
  rent_paid: number
  m_pool: number
}

export interface EndingSignal {
  label: string
  value: string
}

export interface EndingResult {
  endingId: EndingId
  title: string
  tone: 'growth' | 'warning' | 'analysis'
  summary: string
  whyThisHappened: string
  textbookConnection: string
  reflectionQuestions: string[]
  keySignals: EndingSignal[]
  secondaryConsequences: string[]
}

const pct = (v: number, total: number) => total > 0 ? `${((v / total) * 100).toFixed(1)}%` : '0%'
const fmt = (v: number) => formatVnd(v, true)

export function deriveEnding(input: EndingInput): EndingResult {
  const { industrial_profit, merchant_profit, interest_paid, rent_paid, m_pool } = input
  const total = Math.max(1, industrial_profit + merchant_profit + Math.abs(interest_paid) + rent_paid)
  const indShare = industrial_profit / total
  const merShare = merchant_profit / total
  const finShare = Math.abs(interest_paid) / total
  const rentShare = rent_paid / total

  const signals: EndingSignal[] = [
    { label: 'Lợi nhuận CN', value: fmt(industrial_profit) + ` (${pct(industrial_profit, total)})` },
    { label: 'Lợi nhuận TN', value: fmt(merchant_profit) + ` (${pct(merchant_profit, total)})` },
    { label: 'Lãi tức đã trả (Z)', value: fmt(interest_paid) + ` (${pct(interest_paid, total)})` },
    { label: 'Địa tô đã trả (R)', value: fmt(rent_paid) + ` (${pct(rent_paid, total)})` },
    { label: 'M-pool cuối', value: fmt(m_pool) },
  ]

  // Score each ending
  type Candidate = EndingResult & { score: number }
  const candidates: Candidate[] = [
    {
      endingId: 'industrial_pure',
      title: 'Nhà tư bản Công nghiệp thuần túy',
      tone: 'growth',
      score: indShare >= 0.7 ? 5 : indShare >= 0.5 ? 3 : 1,
      summary: 'Phần lớn GTTT được giữ lại trong sản xuất công nghiệp. M-pool tăng chủ yếu từ lợi nhuận sản xuất trực tiếp.',
      whyThisHappened: 'Bạn tập trung phân bổ M-pool cho cơ khí, dệt may, da giày và giữ hạn chế sự phụ thuộc vào thương nhân, ngân hàng, chủ đất.',
      textbookConnection: "Lợi nhuận CN = hình thái biến đổi của m. p' = m/(c+v). Khi phân phối ít hơn cho các hình thái khác, nhà tư bản sản xuất giữ lại nhiều p hơn.",
      reflectionQuestions: [
        'Nếu dùng nhiều kênh thương nghiệp hơn, phần m nào sẽ chuyển sang p_TN?',
        "Lợi nhuận CN có 'trong sạch' hơn lãi tức hay địa tô không? Giải thích?",
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'merchant_extreme',
      title: 'Phụ thuộc Kênh Thương nghiệp',
      tone: 'analysis',
      score: merShare >= 0.35 ? 5 : merShare >= 0.2 ? 3 : 0,
      summary: 'Phần lớn GTTT đã được nhượng cho thương nhân. Lưu thông được ưu tiên nhưng lợi nhuận giữ lại bị thu hẹp.',
      whyThisHappened: 'Bạn sử dụng kênh thương mại với tỷ lệ hoa hồng cao trong nhiều vòng Pha 2.',
      textbookConnection: 'p_TN = phần m nhượng cho tư bản TN. Tư bản TN không tạo m độc lập - nó là phân phối từ m sản xuất.',
      reflectionQuestions: [
        'Tư bản TN có tạo ra giá trị mới không? Nếu không, tại sao nó vẫn được hưởng p_TN?',
        'Biết từ đó, ta biết rằng lưu thông không tạo giá trị - ý nghĩa là gì?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'lender_focus',
      title: 'Phụ thuộc Tư bản Tài chính',
      tone: 'warning',
      score: finShare >= 0.3 ? 5 : finShare >= 0.15 ? 3 : 0,
      summary: 'Lãi tức chiếm phần đáng kể trong phân phối GTTT. Nhà tư bản sản xuất phải nhượng nhiều m cho chủ nợ.',
      whyThisHappened: 'Bạn vay vốn nhiều trong Pha 3, làm tăng khoản lãi phải trả trong các vòng tiếp theo.',
      textbookConnection: 'Z = m chuyển cho chủ sở hữu tư bản cho vay. Lãi suất VN 2022: 7,8%, 2024: 3,7% - minh họa xu hướng biến động Z theo chu kỳ kinh tế.',
      reflectionQuestions: [
        'Tại sao Z vẫn được quy về là phân phối từ m, dù chủ nợ không tham gia sản xuất?',
        'Lợi ích của vay vốn là gì, và điểm nào thì Z trở thành gánh nặng?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'land_speculator',
      title: 'Đầu cơ Đất - Bong bóng & Suy sụp',
      tone: 'warning',
      score: (rentShare >= 0.2 && rent_paid > 0) ? 4 : 0,
      summary: 'Đất đai chiếm phần đáng kể trong phân phối. Nếu chọn đầu cơ (Bắc Ninh), bong bóng đã gây tổn thất.',
      whyThisHappened: 'Bạn chọn đầu cơ đất Bắc Ninh trong Pha 4. Bong bóng tăng 40% nhưng sau đó sụp đổ -15%, minh họa rủi ro.',
      textbookConnection: 'Giá đất = R/i. Đầu cơ làm giá đất tăng vọt khỏi GTTT thực. Khi bong bóng vỡ, giá đất quay về vốn hóa R thực.',
      reflectionQuestions: [
        'Tại sao giá đất có thể tăng vượt xa "giá trị" của đất?',
        'Bong bóng bất động sản ảnh hưởng thế nào đến phân phối m trong xã hội?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'land_wise',
      title: 'Đầu tư Đất khôn ngoan',
      tone: 'growth',
      score: (rent_paid > 0 && rentShare < 0.15) ? 3 : 0,
      summary: 'Bất động sản đóng góp vừa phải vào phân phối. Bạn quản lý R hiệu quả, tránh đầu cơ quá mức.',
      whyThisHappened: 'Bạn chọn mua đất Hoài Đức hoặc chỉ thuê với tỷ lệ hợp lý trong Pha 4.',
      textbookConnection: 'Giá đất Hoài Đức tăng 81% (2022-2024) dù R ổn định - minh họa giá đất = R/i khi i giảm. Đây là vốn hóa địa tô.',
      reflectionQuestions: [
        'Sự tăng giá đất 81% có phản ánh tăng GTTT thực không? Giải thích qua công thức.',
        'Khi i giảm 50%, giá đất thay đổi bao nhiêu % nếu R không đổi?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'balanced_distribution',
      title: 'Phân phối GTTT cân bằng',
      tone: 'analysis',
      score: (indShare >= 0.3 && indShare <= 0.6 && (merShare > 0 || finShare > 0 || rentShare > 0)) ? 4 : 0,
      summary: 'GTTT được phân phối tương đối đều giữa các hình thái. Minh họa đầy đủ m = p + p_TN + Z + R.',
      whyThisHappened: 'Bạn đã tham gia cả 4 kênh phân phối qua 4 pha của học phần.',
      textbookConnection: 'Công thức m = p + LN TN + Z + R là tổng kết lý thuyết phân phối GTTT trong giáo trình Chương 3 tr. 70-78.',
      reflectionQuestions: [
        'Trong 4 hình thái phân phối, hình thái nào cần thiết để tạo ra GTTT? Tại sao?',
        'Nếu chỉ có p mà không có p_TN, Z, R thì nền kinh tế sẽ vận hành thế nào?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
  ]

  const sorted = candidates.filter((c) => c.score > 0).sort((a, b) => b.score - a.score)
  const primary = sorted[0] ?? candidates.find((c) => c.endingId === 'industrial_pure')!
  const secondaryConsequences = sorted
    .filter((c) => c.endingId !== primary.endingId)
    .slice(0, 2)
    .map((c) => c.title)

  const { score: _s, ...rest } = primary
  return { ...rest, secondaryConsequences }
}