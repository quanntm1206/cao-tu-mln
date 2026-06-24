import { formatVnd } from '../lib/currency'

export type EndingId =
  | 'expanded_accumulation'
  | 'organic_composition'
  | 'absolute_surplus'
  | 'relative_surplus'
  | 'interest_dependency'
  | 'rent_dominated'
  | 'merchant_circulation'
  | 'cautious_reproduction'

export interface EndingRoundInput {
  alpha: number
  h: number
  invest_rnd: number
  use_merchant: boolean
  m: number
  m_super: number
  net_profit: number
  reinvestment: number
  organic_comp: number
  z_interest: number
  rent_cost: number
  p_merchant: number
}

export interface EndingInput {
  initialCapital: number
  netWorth: number
  debt: number
  landUnits: number
  eventCount: number
  rounds: EndingRoundInput[]
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

interface EndingCandidate extends Omit<EndingResult, 'secondaryConsequences'> {
  score: number
  priority: number
  shortLabel: string
}

const pct = (value: number) => `${(value * 100).toFixed(1)}%`
const safeAvg = (values: number[]) => values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
const safeSum = (values: number[]) => values.reduce((sum, value) => sum + value, 0)

export function deriveEnding(input: EndingInput): EndingResult {
  const rounds = input.rounds
  const totalSurplus = safeSum(rounds.map((round) => round.m + round.m_super))
  const totalNetProfit = safeSum(rounds.map((round) => round.net_profit))
  const totalReinvestment = safeSum(rounds.map((round) => round.reinvestment))
  const totalInterest = safeSum(rounds.map((round) => round.z_interest))
  const totalRent = safeSum(rounds.map((round) => round.rent_cost))
  const totalMerchant = safeSum(rounds.map((round) => round.p_merchant))
  const totalRnd = safeSum(rounds.map((round) => round.invest_rnd))
  const avgAlpha = safeAvg(rounds.map((round) => round.alpha))
  const avgHours = safeAvg(rounds.map((round) => round.h))
  const highHourRounds = rounds.filter((round) => round.h >= 10).length
  const merchantRounds = rounds.filter((round) => round.use_merchant).length
  const finalOrganicComp = rounds.length > 0 ? rounds[rounds.length - 1].organic_comp : 0
  const growthRatio = input.initialCapital > 0 ? input.netWorth / input.initialCapital : 1
  const debtRatio = input.initialCapital > 0 ? input.debt / input.initialCapital : 0
  const interestShare = Math.abs(totalNetProfit) > 0 ? totalInterest / Math.max(1, Math.abs(totalNetProfit)) : 0
  const rentShare = Math.abs(totalNetProfit) > 0 ? totalRent / Math.max(1, Math.abs(totalNetProfit)) : 0
  const merchantShare = Math.abs(totalNetProfit) > 0 ? totalMerchant / Math.max(1, Math.abs(totalNetProfit)) : 0
  const reinvestShare = totalNetProfit > 0 ? totalReinvestment / totalNetProfit : 0

  const baseSignals: EndingSignal[] = [
    { label: 'α trung bình', value: pct(avgAlpha) },
    { label: 'c/v cuối kỳ', value: finalOrganicComp.toFixed(2) },
    { label: 'Tổng tái đầu tư', value: formatVnd(totalReinvestment, true) },
    { label: 'Tổng giá trị thặng dư', value: formatVnd(totalSurplus, true) },
  ]

  const candidates: EndingCandidate[] = [
    {
      endingId: 'interest_dependency',
      title: 'Kết cục: Lệ thuộc lợi tức',
      tone: 'warning',
      score: (debtRatio >= 0.45 ? 3 : 0) + (interestShare >= 0.18 ? 3 : 0) + (totalInterest > 0 ? 1 : 0),
      priority: 1,
      shortLabel: 'Lợi tức chi phối phân phối lợi nhuận',
      summary: 'Một phần đáng kể kết quả cuối kỳ bị kéo về quan hệ vay — trả lãi.',
      whyThisHappened: 'Bạn dùng nợ hoặc chịu chi phí lãi vay nổi bật trong nhiều vòng, nên phần lợi nhuận ròng sau phân phối bị thu hẹp.',
      textbookConnection: 'Lợi tức là phần lợi nhuận chuyển cho người sở hữu tư bản cho vay; nó không phải nguồn giá trị thặng dư độc lập mà là một hình thức phân chia từ m.',
      reflectionQuestions: [
        'Nếu giảm vay, phần giá trị thặng dư được giữ lại sẽ thay đổi thế nào?',
        'Vì sao lợi tức được xem là phần phân chia của lợi nhuận?',
      ],
      keySignals: [...baseSignals, { label: 'Nợ cuối kỳ', value: formatVnd(input.debt, true) }, { label: 'Tổng lãi vay', value: formatVnd(totalInterest, true) }],
    },
    {
      endingId: 'rent_dominated',
      title: 'Kết cục: Địa tô chi phối',
      tone: 'warning',
      score: (input.landUnits >= 3 ? 2 : 0) + (rentShare >= 0.16 ? 3 : 0) + (totalRent > 0 ? 1 : 0),
      priority: 2,
      shortLabel: 'Địa tô trở thành khoản phân chia nổi bật',
      summary: 'Đất đai và địa tô trở thành yếu tố nổi bật trong phần phân chia giá trị thặng dư.',
      whyThisHappened: 'Bạn sử dụng nhiều đất hoặc trả địa tô đáng kể, làm một phần lợi nhuận chuyển sang chủ sở hữu đất.',
      textbookConnection: 'Địa tô là phần giá trị thặng dư chuyển cho chủ sở hữu đất; giá đất trong bài được hiểu như địa tô tư bản hóa.',
      reflectionQuestions: [
        'Địa tô khác gì với lợi nhuận sản xuất trực tiếp?',
        'Công thức giá đất = R / i giúp đọc quan hệ nào giữa địa tô và lợi tức?',
      ],
      keySignals: [...baseSignals, { label: 'Đơn vị đất cuối kỳ', value: `${input.landUnits} đơn vị` }, { label: 'Tổng địa tô', value: formatVnd(totalRent, true) }],
    },
    {
      endingId: 'merchant_circulation',
      title: 'Kết cục: Thương nghiệp hóa lưu thông',
      tone: 'analysis',
      score: (merchantRounds >= 5 ? 3 : 0) + (merchantShare >= 0.12 ? 3 : 0) + (totalMerchant > 0 ? 1 : 0),
      priority: 3,
      shortLabel: 'Lợi nhuận thương nghiệp xuất hiện rõ',
      summary: 'Kênh thương nghiệp giúp lưu thông, nhưng cũng nhận một phần lợi nhuận.',
      whyThisHappened: 'Bạn dùng kênh thương nghiệp nhiều vòng, nên một phần m được phân chia sang khâu lưu thông hàng hóa.',
      textbookConnection: 'Tư bản thương nghiệp không tạo nguồn m độc lập; lợi nhuận thương nghiệp là một phần giá trị thặng dư được tư bản sản xuất nhường lại.',
      reflectionQuestions: [
        'Thương nghiệp giúp rút ngắn lưu thông nhưng lấy đi phần nào của m?',
        'Vì sao lợi nhuận thương nghiệp vẫn quy về giá trị thặng dư?',
      ],
      keySignals: [...baseSignals, { label: 'Vòng dùng thương nghiệp', value: `${merchantRounds}/${rounds.length}` }, { label: 'Tổng p thương nghiệp', value: formatVnd(totalMerchant, true) }],
    },
    {
      endingId: 'organic_composition',
      title: 'Kết cục: c/v tăng rõ rệt',
      tone: 'analysis',
      score: finalOrganicComp >= 3 ? 4 : finalOrganicComp >= 2.2 ? 2 : 0,
      priority: 4,
      shortLabel: 'Cấu tạo hữu cơ của tư bản tăng',
      summary: 'Cơ cấu cuối kỳ nghiêng mạnh về máy móc, nguyên liệu so với tiền công.',
      whyThisHappened: 'Bạn tích lũy nhiều vào tư bản bất biến, làm tỷ lệ c/v cuối kỳ cao hơn rõ rệt.',
      textbookConnection: 'Tích lũy tư bản thường đi kèm biến đổi cấu tạo hữu cơ: c tăng nhanh so với v.',
      reflectionQuestions: [
        'c/v tăng nói gì về cơ cấu tư bản?',
        'Nếu c tăng mà v không tăng tương ứng, nguồn m cần được giải thích ra sao?',
      ],
      keySignals: [...baseSignals, { label: 'c/v cuối kỳ', value: finalOrganicComp.toFixed(2) }],
    },
    {
      endingId: 'relative_surplus',
      title: 'Kết cục: Khai thác GTTD tương đối',
      tone: 'growth',
      score: totalRnd >= input.initialCapital * 0.45 ? 4 : totalRnd >= input.initialCapital * 0.2 ? 2 : 0,
      priority: 5,
      shortLabel: 'Năng suất trở thành đường chính',
      summary: 'Chiến lược nổi bật là cải tiến năng suất để giảm thời gian lao động tất yếu.',
      whyThisHappened: 'Bạn chi nhiều cho cải tiến năng suất, khiến t_n có xu hướng giảm và m có thể tăng mà không cần kéo dài ngày lao động.',
      textbookConnection: 'Giá trị thặng dư tương đối tăng khi thời gian lao động tất yếu giảm nhờ năng suất lao động xã hội tăng.',
      reflectionQuestions: [
        'Tăng năng suất khác gì với kéo dài ngày lao động?',
        'Vì sao t_n giảm làm phần lao động thặng dư tăng?',
      ],
      keySignals: [...baseSignals, { label: 'Tổng chi năng suất', value: formatVnd(totalRnd, true) }],
    },
    {
      endingId: 'absolute_surplus',
      title: 'Kết cục: Khai thác GTTD tuyệt đối',
      tone: 'analysis',
      score: highHourRounds >= 7 ? 4 : avgHours >= 9.5 ? 2 : 0,
      priority: 6,
      shortLabel: 'Kéo dài ngày lao động là dấu hiệu nổi bật',
      summary: 'Kết quả cuối kỳ gắn rõ với việc tăng giờ lao động trong nhiều vòng.',
      whyThisHappened: 'Bạn thường chọn ngày lao động dài, làm phần h − t_n lớn hơn.',
      textbookConnection: 'Giá trị thặng dư tuyệt đối tăng bằng cách kéo dài ngày lao động khi thời gian lao động tất yếu chưa đổi.',
      reflectionQuestions: [
        'Khi h tăng còn t_n giữ nguyên, phần lao động thặng dư thay đổi thế nào?',
        'Vì sao đây là GTTD tuyệt đối chứ không phải tương đối?',
      ],
      keySignals: [...baseSignals, { label: 'Số vòng h ≥ 10', value: `${highHourRounds}/${rounds.length}` }, { label: 'h trung bình', value: `${avgHours.toFixed(1)} giờ` }],
    },
    {
      endingId: 'expanded_accumulation',
      title: 'Kết cục: Tích lũy mở rộng mạnh',
      tone: 'growth',
      score: (avgAlpha >= 0.6 ? 3 : 0) + (reinvestShare >= 0.45 ? 2 : 0) + (growthRatio >= 1.35 ? 2 : 0),
      priority: 7,
      shortLabel: 'm được chuyển hóa mạnh thành tư bản phụ thêm',
      summary: 'Một phần lớn giá trị thặng dư được đưa trở lại sản xuất, tạo xu hướng tái sản xuất mở rộng.',
      whyThisHappened: 'Bạn duy trì tỷ lệ tái đầu tư cao và tích lũy phần đáng kể lợi nhuận ròng.',
      textbookConnection: 'Tích lũy tư bản là biến một phần m thành tư bản phụ thêm để mở rộng quy mô sản xuất.',
      reflectionQuestions: [
        'Phần m nào được giữ lại để mở rộng sản xuất?',
        'Tái sản xuất mở rộng khác gì tái sản xuất giản đơn?',
      ],
      keySignals: [...baseSignals, { label: 'Tài sản ròng / vốn đầu', value: `${growthRatio.toFixed(2)} lần` }],
    },
    {
      endingId: 'cautious_reproduction',
      title: 'Kết cục: Tái sản xuất thận trọng',
      tone: 'analysis',
      score: (avgAlpha <= 0.25 ? 3 : 0) + (growthRatio < 1.2 ? 2 : 0) + (debtRatio < 0.2 ? 1 : 0),
      priority: 8,
      shortLabel: 'Quy mô tăng chậm, gần tái sản xuất giản đơn',
      summary: 'Kết quả cuối kỳ cho thấy xu hướng giữ quy mô hơn là mở rộng mạnh.',
      whyThisHappened: 'Bạn tái đầu tư thấp hoặc tăng quy mô chậm, nên mô hình gần với tái sản xuất giản đơn hơn.',
      textbookConnection: 'Tái sản xuất giản đơn lặp lại quy mô cũ; tái sản xuất mở rộng đòi hỏi biến một phần m thành tư bản mới.',
      reflectionQuestions: [
        'Nếu tăng α, kết cục có chuyển sang tích lũy mở rộng không?',
        'Giữ ít nợ nhưng tái đầu tư thấp tạo ưu và nhược điểm lý luận nào?',
      ],
      keySignals: [...baseSignals, { label: 'Tài sản ròng / vốn đầu', value: `${growthRatio.toFixed(2)} lần` }],
    },
  ]

  const sorted = candidates
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.priority - b.priority)

  const primary = sorted[0] ?? candidates.find((candidate) => candidate.endingId === 'cautious_reproduction')!
  const incompatibleSecondary: Partial<Record<EndingId, EndingId[]>> = {
    expanded_accumulation: ['cautious_reproduction'],
    cautious_reproduction: ['expanded_accumulation'],
  }
  const blockedSecondary = incompatibleSecondary[primary.endingId] ?? []
  const secondaryConsequences = sorted
    .filter((candidate) => candidate.endingId !== primary.endingId)
    .filter((candidate) => !blockedSecondary.includes(candidate.endingId))
    .slice(0, 2)
    .map((candidate) => candidate.shortLabel)

  const { score: _score, priority: _priority, shortLabel: _shortLabel, ...ending } = primary
  return {
    ...ending,
    secondaryConsequences,
  }
}


