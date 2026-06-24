export interface TheorySection {
  id: string
  title: string
  pages: string
  formula?: string
  symbolGuide?: string
  explanation: string
  keyPoints: string[]
}

export interface TheoryLesson {
  round: number
  title: string
  concept: string
  formula?: string
  symbolGuide?: string
  explanation: string
  marxSource?: string
}

const SOURCE = 'Giáo trình KTCT Mác-Lênin, Chương 3, tr. 70-78'

/** 5 sections matching textbook tr 70-78 */
export const THEORY_SECTIONS: TheorySection[] = [
  {
    id: 'profit',
    title: "Lợi nhuận (p) - Hình thái biến đổi của GTTT",
    pages: 'tr. 70-72',
    formula: "p = m (trong cấu trúc T-H-T')",
    symbolGuide: "p là lợi nhuận (profit), m là giá trị thặng dư. p chỉ là hình thái biểu hiện của m - che giấu nguồn gốc thật sự.",
    explanation: 'Lợi nhuận là hình thái biến đổi của giá trị thặng dư. Khi m xuất hiện như p, nó bị quy cho toàn bộ tư bản ứng trước (c+v) thay vì chỉ từ v. Điều này che giấu bóc lột lao động.',
    keyPoints: [
      'p = m về mặt lượng, nhưng khác về chất: m phát sinh từ v, p quy cho (c+v)',
      "Tỷ suất lợi nhuận: p' = m/(c+v) < m' = m/v",
      "Cạnh tranh giữa các ngành bình quân hóa p' thành tỷ suất lợi nhuận bình quân P',",
      'Giá cả sản xuất = k + P (chi phí sản xuất + lợi nhuận bình quân)',
    ],
  },
  {
    id: 'average_profit',
    title: "Lợi nhuận bình quân & Giá cả sản xuất",
    pages: 'tr. 72-73',
    formula: "Giá cả sản xuất = k + P'tb x (c+v)",
    symbolGuide: "k = chi phí sản xuất (c+v); P'tb = tỷ suất lợi nhuận bình quân; P = lợi nhuận bình quân.",
    explanation: 'Cạnh tranh giữa các ngành buộc tư bản dịch chuyển để bình quân hóa tỷ suất lợi nhuận. Giá cả sản xuất là trung tâm xoay quanh giá cả thị trường. Tổng giá cả sản xuất = tổng giá trị hàng hóa xã hội.',
    keyPoints: [
      "Tư bản chuyển từ ngành p' thấp sang ngành p' cao",
      "Cung-cầu điều chỉnh đến khi p' bằng P'tb",
      "P'tb = tổng m / tổng tư bản xã hội",
      'Giá cả sản xuất ≠ giá trị: có thể cao hơn hoặc thấp hơn',
    ],
  },
  {
    id: 'merchant_profit',
    title: 'Lợi nhuận Thương nghiệp',
    pages: 'tr. 73-74',
    formula: 'm = p + lợi nhuận thương nghiệp (lợi nhuận thương nghiệp là phần m nhượng cho thương nhân)',
    symbolGuide: 'lợi nhuận thương nghiệp = lợi nhuận thương nghiệp, là phần giá trị thặng dư nhà sản xuất nhượng cho thương nhân để lưu thông hàng hóa.',
    explanation: 'Tư bản thương nghiệp không trực tiếp bóc lột lao động nhưng hưởng phần m từ quá trình sản xuất thông qua việc mua rẻ bán đắt (mua theo giá bán buôn, bán theo giá cả sản xuất). Lưu thông không tạo ra giá trị mới.',
    keyPoints: [
      'lợi nhuận thương nghiệp không phát sinh từ lưu thông mà là phân phối từ m',
      'Thương nhân rút ngắn thời gian lưu thông, tăng n vòng quay',
      'Chi phí lưu thông thuần túy (bao bì, vận chuyển) được tính vào giá cả sản xuất',
      "Bình quân hóa p' bao gồm cả tư bản thương nghiệp",
    ],
  },
  {
    id: 'interest',
    title: 'Lãi tức (Z) - Phần chia GTTT cho tư bản cho vay',
    pages: 'tr. 74-76',
    formula: "Z' = Z / TBCV",
    symbolGuide: 'Z = lãi tức (interest), Z′ = tỷ suất lợi tức. Tư bản cho vay nhận Z mà không tham gia sản xuất.',
    explanation: 'Lãi tức là phần lợi nhuận mà nhà tư bản sản xuất nhượng cho chủ sở hữu tư bản cho vay. Z′ = Z/T phản ánh giá cả của tư bản tiền tệ. Z′ biến động theo chu kỳ kinh tế và chính sách tiền tệ.',
    keyPoints: [
      "Tư bản cho vay: T - T' (không qua H, không sản xuất)",
      'Z = phần m chuyển cho chủ nợ',
      "Giới hạn: 0 < Z′ < p' (cách dưới là 0, cách trên là toàn bộ lợi nhuận)",
      'Tín dụng là đòn bẩy của tư bản nhưng cũng là nguồn gốc khủng hoảng tài chính',
    ],
  },
  {
    id: 'land_rent',
    title: 'Địa tô (R) & Giá đất',
    pages: 'tr. 76-78',
    formula: 'Giá cả đất đai = R / Z′',
    symbolGuide: 'R = địa tô (land rent), Z′ = tỷ suất lợi tức. Giá đất = R vốn hóa theo lãi suất.',
    explanation: 'Địa tô là phần giá trị thặng dư mà nhà tư bản sản xuất nhượng cho chủ sở hữu đất để được quyền sử dụng đất. Giá đất không phải giá trị của đất mà là giá trị vốn hóa của dòng địa tô. Địa tô có 2 hình thái: tuyệt đối (mọi đất đều có) và chênh lệch (đất tốt hơn).',
    keyPoints: [
      'Địa tô tuyệt đối: do tư bản đất nông nghiệp có cấu tạo hữu cơ thấp hơn CN',
      'Địa tô chênh lệch I: do độ phì, độ màu mỡ và vị trí khác nhau',
      'Địa tô chênh lệch II: do đầu tư thêm trên cùng diện tích',
      'Giá đất tăng khi R tăng hoặc i giảm - bong bóng bất động sản',
    ],
  },
]

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    round: 1,
    title: 'Công thức chung của tư bản',
    concept: 'capital_formula',
    formula: "T - H - T'",
    symbolGuide: "T = tiền ban đầu; H = hàng hóa sản xuất; T' = tiền thu về lớn hơn. Dấu phảy trên T' nghĩa là tiền đã tăng thêm.",
    explanation: "Tiền chỉ trở thành tư bản khi vận động theo công thức T-H-T', tức dùng tiền ra để thu về số tiền lớn hơn. Phần lớn hơn đó biểu hiện giá trị thặng dư m đã được tạo ra trong sản xuất, không phải do lưu thông tạo m.",
    marxSource: SOURCE,
  },
  {
    round: 2,
    title: 'Giá trị thặng dư và sản xuất công nghiệp',
    concept: 'surplus_value',
    formula: 'G = c + v + m',
    symbolGuide: 'G = giá trị hàng hóa; c = tư bản bất biến; v = tư bản khả biến; m = giá trị thặng dư.',
    explanation: 'Giá trị hàng hóa gồm tư bản bất biến c, tư bản khả biến v và giá trị thặng dư m. Máy móc và nguyên liệu chỉ chuyển giá trị; phần giá trị tăng thêm do lao động sống tạo ra.',
    marxSource: SOURCE,
  },
  {
    round: 3,
    title: "Tỷ suất lợi nhuận p'",
    concept: 'profit_rate',
    formula: "p' = m / (c + v)",
    symbolGuide: "p' = tỷ suất lợi nhuận; m = giá trị thặng dư; c+v = tư bản ứng trước.",
    explanation: "Khi m xuất hiện như p, tỷ suất được tính trên toàn bộ tư bản ứng trước (c+v). p' < m' vì mẫu số lớn hơn. Đây là sự che giấu nguồn gốc thật sự của m.",
    marxSource: SOURCE,
  },
  {
    round: 4,
    title: "Lợi nhuận bình quân P',",
    concept: 'average_profit',
    formula: "P',  = tổng m / tổng (c+v)",
    symbolGuide: "P', = tỷ suất lợi nhuận bình quân; bình quân hóa qua cạnh tranh giữa các ngành.",
    explanation: "Cạnh tranh giữa các ngành làm cho tư bản dịch chuyển đến nơi có p' cao hơn, biết từ đó bình quân hóa. Giá cả sản xuất = k + P biến trung tâm xoay quanh giá cả thị trường.",
    marxSource: SOURCE,
  },
  {
    round: 5,
    title: 'Lợi nhuận Thương nghiệp',
    concept: 'merchant_profit',
    formula: 'm = p + lợi nhuận thương nghiệp',
    symbolGuide: 'lợi nhuận thương nghiệp = phần m nhượng cho thương nhân để lưu thông hàng hóa.',
    explanation: 'Tư bản thương nghiệp không tạo nguồn m độc lập; lợi nhuận thương nghiệp là một phần giá trị thặng dư được tư bản sản xuất nhượng lại. Lưu thông không tạo giá trị mới.',
    marxSource: SOURCE,
  },
  {
    round: 6,
    title: 'Lưu thông tư bản thương nghiệp',
    concept: 'merchant_circulation',
    formula: "T - H - T' (mua bán để ăn chênh lệch)",
    symbolGuide: 'Thương nhân mua theo giá bán buôn (thấp hơn giá cả sản xuất) và bán theo giá cả sản xuất.',
    explanation: 'Thương nhân rút ngắn thời gian lưu thông, tăng n vòng quay. Nhưng lợi nhuận thương nghiệp vẫn là phần m từ sản xuất - lưu thông không tạo thêm giá trị mới.',
    marxSource: SOURCE,
  },
  {
    round: 7,
    title: 'Tư bản cho vay và Lãi tức',
    concept: 'interest',
    formula: 'Z = tư bản cho vay x i',
    symbolGuide: "Z = lãi tức; Z′ = tỷ suất lợi tức. Tư bản cho vay vận động T - T' mà không qua sản xuất.",
    explanation: 'Lãi tức là phần lợi nhuận chuyển cho chủ sở hữu tư bản cho vay. Lãi suất phản ánh giá cả của tư bản. Tín dụng là đòn bẩy nhưng cũng là nguồn gốc khủng hoảng tài chính.',
    marxSource: SOURCE,
  },
  {
    round: 8,
    title: 'Lãi suất và chu kỳ kinh tế',
    concept: 'interest_rate_cycle',
    formula: "0 < i < p'",
    symbolGuide: "Giới hạn dưới là 0 (không có lợi); giới hạn trên là p' (nhà sản xuất không có lợi nhuận)",
    explanation: 'Lãi suất biến động theo chu kỳ: tăng trong giai đoạn hưng thịnh, giảm trong suy thoái. Chính sách tiền tệ ảnh hưởng đến i, do đó ảnh hưởng đến phân phối m giữa sản xuất và tài chính.',
    marxSource: SOURCE,
  },
  {
    round: 9,
    title: 'Địa tô (R) tuyệt đối',
    concept: 'absolute_rent',
    formula: 'R = p_nonong nghiep - p_nong nghiep',
    symbolGuide: 'Địa tô tuyệt đối phát sinh do cấu tạo hữu cơ của tư bản nông nghiệp thấp hơn CN, tạo ra GTTT cao hơn.',
    explanation: 'Mọi đất đều phải trả địa tô tuyệt đối. Nguồn gốc: tư bản nông nghiệp có cấu tạo hữu cơ thấp hơn CN, tạo GTTT cao hơn, phần vượt trội là địa tô tuyệt đối chuyển cho chủ đất.',
    marxSource: SOURCE,
  },
  {
    round: 10,
    title: 'Địa tô chênh lệch I & II',
    concept: 'differential_rent',
    formula: 'R_CL = siêu lợi nhuận do điều kiện sản xuất ưu đãi',
    symbolGuide: 'R_CL I = do độ phì, độ màu mỡ, vị trí; R_CL II = do đầu tư thêm trên cùng mảnh đất.',
    explanation: 'Đất tốt hơn (độ phì, màu mỡ, gần thị trường) tạo ra siêu lợi nhuận. Chủ sở hữu đất tiếm chiếm siêu lợi nhuận này qua địa tô chênh lệch. R_CL II xuất hiện khi đầu tư thêm trên cùng diện tích.',
    marxSource: SOURCE,
  },
  {
    round: 11,
    title: 'Vốn hóa địa tô - Giá đất',
    concept: 'land_price',
    formula: 'Giá cả đất đai = R / Z′',
    symbolGuide: 'Giá cả đất đai P = R/Z′ là địa tô tư bản hóa; đất không có giá trị theo nghĩa hàng hóa thông thường.',
    explanation: 'Giá đất = dòng địa tô thường niên / lãi suất. Khi i giảm, giá đất tăng dù R không thay đổi. Bong bóng bất động sản phát sinh khi kỳ vọng làm tăng R kỳ vọng trong khi i thấp.',
    marxSource: SOURCE,
  },
  {
    round: 12,
    title: 'Tích lũy tư bản và GTTT',
    concept: 'capital_accumulation',
    formula: 'Tái sản xuất mở rộng: biến m thành tư bản phụ thêm',
    symbolGuide: 'Tích lũy = biến phần m giữ lại thành tư bản để mở rộng sản xuất.',
    explanation: 'Tích lũy tư bản là biến một phần m thành tư bản phụ thêm để mở rộng quy mô sản xuất. Đây là nền tảng của tái sản xuất mở rộng - động cơ bản của hệ thống tư bản chủ nghĩa.',
    marxSource: SOURCE,
  },
  {
    round: 13,
    title: 'Phân chia GTTT: m phân chia: p, lợi nhuận thương nghiệp, Z, R',
    concept: 'surplus_distribution',
    formula: 'm phân chia: p, lợi nhuận thương nghiệp, Z, R',
    symbolGuide: 'p = lợi nhuận CN; lợi nhuận thương nghiệp = lợi nhuận TN; Z = lãi tức; R = địa tô.',
    explanation: 'Toàn bộ giá trị thặng dư m được phân chia giữa 4 hình thức: lợi nhuận sản xuất p (nhà tư bản CN giữ), lợi nhuận thương nghiệp lợi nhuận thương nghiệp (thương nhân), lãi tức Z (ngân hàng/cho vay), địa tô R (chủ sở hữu đất).',
    marxSource: SOURCE,
  },
  {
    round: 14,
    title: 'Giá trị thặng dư và tiền đẻ ra tiền',
    concept: 'money_breeding',
    formula: "T - H - T' (tiền đẻ ra tiền qua sản xuất)",
    symbolGuide: 'Tiền đẻ ra tiền không phải từ mua bán thuần túy mà phải qua sản xuất tạo m.',
    explanation: "Tiền đẻ ra tiền (T' > T) chỉ xảy ra qua việc tạo giá trị thặng dư trong sản xuất. Mua bán chỉ phân phối lại m, không tạo m mới. Đây là nền tảng của Chương 3 giáo trình.",
    marxSource: SOURCE,
  },
  {
    round: 15,
    title: 'Biến động lãi suất Việt Nam 2022-2024',
    concept: 'vietnam_interest_rates',
    formula: 'i = 7,8% (2022) → 3,7% (2024)',
    symbolGuide: 'Lãi suất huy động bình quân VN 2022-2024: đầu 2022 là 7,8%, cuối 2024 giảm còn 3,7%.',
    explanation: 'Chu kỳ lãi suất VN 2022-2024 minh họa rõ ràng lý thuyết: khi NHNN giảm lãi suất, phần m chuyển cho tư bản cho vay giảm, nhà sản xuất giữ lại nhiều hơn. Giá đất tăng khi i giảm.',
    marxSource: 'NHNN Việt Nam, Báo cáo thường niên 2024',
  },
  {
    round: 16,
    title: 'Tổng kết: Phân chia GTTT và tiền đẻ ra tiền',
    concept: 'full_distribution',
    formula: 'm = p + LN thương nghiệp + Z + R',
    symbolGuide: 'Toàn bộ GTTT phát sinh trong sản xuất, được phân phối qua 4 kênh. V = quy mô vốn đầu tư (tư bản ứng trước).',
    explanation: 'Sau 16 vòng, chúng ta thấy rõ: m phát sinh từ sản xuất, được phân phối cho thương nhân, ngân hàng, chủ đất và nhà tư bản sản xuất. Mâu thuẫn cơ bản: người tạo m (công nhân) không được nhận m.',
    marxSource: SOURCE,
  },
]

export function getLessonForRound(round: number): TheoryLesson {
  return THEORY_LESSONS.find((l) => l.round === round) ?? THEORY_LESSONS[THEORY_LESSONS.length - 1]
}

export const TOOLTIP_FORMULAS: Record<string, string> = {
  p_rate: "p' = m / (c + v) - tỷ suất lợi nhuận",
  m_rate: "m' = m / v - tỷ suất giá trị thặng dư",
  organic: 'c/v - cấu tạo hữu cơ của tư bản',
  z: "Z' = Z / TBCV",
  r: 'Giá cả đất đai = R / Z′ - vốn hóa địa tô',
  m_pool: 'M-pool = vốn ban đầu + m giữ lại',
  industrial_profit: 'p = m của nhà tư bản CN giữ lại',
  merchant_profit: 'lợi nhuận thương nghiệp — phần m nhượng cho thương nhân',
  interest_paid: 'Z = phần m chuyển cho chủ sở hữu tư bản cho vay',
  rent_paid: 'R = phần m chuyển cho chủ sở hữu đất',
}