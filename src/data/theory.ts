export interface TheoryLesson {
  round: number
  title: string
  concept: string
  formula?: string
  explanation: string
  marxSource?: string
}

const SOURCE = 'Giáo trình KTCT Mác–Lênin, Chương 3, tr. 53–78'

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    round: 1,
    title: "Công thức chung của tư bản",
    concept: 'capital_formula',
    formula: "T–H–T'",
    explanation:
      "Tiền chỉ trở thành tư bản khi vận động theo công thức T–H–T', tức ứng tiền ra để thu về số tiền lớn hơn. Phần lớn hơn đó là giá trị thặng dư, không sinh ra từ mua bán thông thường mà phải được giải thích trong sản xuất.",
    marxSource: SOURCE,
  },
  {
    round: 2,
    title: 'Hàng hóa sức lao động',
    concept: 'labour_power',
    formula: 'Nguồn gốc m = sức lao động tạo giá trị mới',
    explanation:
      'Hàng hóa sức lao động đặc biệt ở chỗ khi được sử dụng trong sản xuất, nó tạo ra giá trị mới lớn hơn giá trị bản thân nó. Đây là chìa khóa giải thích nguồn gốc giá trị thặng dư trong giáo trình.',
    marxSource: SOURCE,
  },
  {
    round: 3,
    title: 'Sản xuất giá trị thặng dư',
    concept: 'surplus_value',
    formula: 'G = c + v + m',
    explanation:
      'Giá trị hàng hóa gồm tư bản bất biến c, tư bản khả biến v và giá trị thặng dư m. Trong game, máy móc và nguyên liệu chỉ chuyển giá trị; phần giá trị tăng thêm do lao động sống tạo ra.',
    marxSource: SOURCE,
  },
  {
    round: 4,
    title: 'Tư bản bất biến và tư bản khả biến',
    concept: 'constant_variable_capital',
    formula: 'c = tư liệu sản xuất, v = tiền mua sức lao động',
    explanation:
      'Tư bản bất biến c không tự làm tăng giá trị, còn tư bản khả biến v biến đổi trong quá trình lao động vì công nhân tạo ra giá trị mới lớn hơn tiền công được trả.',
    marxSource: SOURCE,
  },
  {
    round: 5,
    title: 'Tiền công',
    concept: 'wage',
    formula: 'Tiền công = biểu hiện bằng tiền của giá trị sức lao động',
    explanation:
      'Tiền công trong giáo trình không phải giá của toàn bộ lao động đã tạo ra, mà là biểu hiện bằng tiền của giá trị hàng hóa sức lao động. Vì vậy vẫn có phần lao động thặng dư tạo ra m.',
    marxSource: SOURCE,
  },
  {
    round: 6,
    title: "Tỷ suất và khối lượng giá trị thặng dư",
    concept: 'surplus_rate_mass',
    formula: "m' = m / v;  M = m' × V",
    explanation:
      "Tỷ suất giá trị thặng dư m' đo mức độ tạo giá trị thặng dư so với tư bản khả biến. Khối lượng giá trị thặng dư M phụ thuộc vào m' và tổng tư bản khả biến V được sử dụng.",
    marxSource: SOURCE,
  },
  {
    round: 7,
    title: 'Giá trị thặng dư tuyệt đối',
    concept: 'absolute_surplus_value',
    formula: "m' = (h − t_n) / t_n",
    explanation:
      'Kéo dài ngày lao động khi thời gian lao động tất yếu không đổi làm tăng thời gian lao động thặng dư. Đây là phương pháp sản xuất giá trị thặng dư tuyệt đối.',
    marxSource: SOURCE,
  },
  {
    round: 8,
    title: 'Giá trị thặng dư tương đối',
    concept: 'relative_surplus_value',
    formula: "m' tăng khi t_n giảm",
    explanation:
      'Tăng năng suất lao động xã hội làm giảm thời gian lao động tất yếu, từ đó làm tăng phần thời gian lao động thặng dư dù ngày lao động không cần kéo dài.',
    marxSource: SOURCE,
  },
  {
    round: 9,
    title: 'Giá trị thặng dư siêu ngạch',
    concept: 'super_surplus',
    formula: 'Giá trị cá biệt < giá trị xã hội',
    explanation:
      'Doanh nghiệp có năng suất cá biệt cao hơn mức xã hội có thể thu giá trị thặng dư siêu ngạch. Đây là biểu hiện giáo trình dùng để giải thích động lực cải tiến kỹ thuật.',
    marxSource: SOURCE,
  },
  {
    round: 10,
    title: 'Tuần hoàn và chu chuyển tư bản',
    concept: 'turnover',
    formula: 'n = CH / ch;  M_năm = m\' × V × n',
    explanation:
      'Tư bản tuần hoàn qua các hình thái tiền tệ, sản xuất và hàng hóa. Khi chu chuyển nhanh hơn, cùng một tư bản khả biến có thể tạo khối lượng giá trị thặng dư hằng năm lớn hơn.',
    marxSource: SOURCE,
  },
  {
    round: 11,
    title: 'Tái sản xuất giản đơn và mở rộng',
    concept: 'reproduction',
    formula: 'Tích lũy = biến một phần m thành tư bản mới',
    explanation:
      'Tái sản xuất giản đơn lặp lại quy mô cũ; tái sản xuất mở rộng dùng một phần giá trị thặng dư để tăng quy mô sản xuất. Bản chất tích lũy tư bản là chuyển hóa m thành tư bản phụ thêm.',
    marxSource: SOURCE,
  },
  {
    round: 12,
    title: 'Nhân tố ảnh hưởng quy mô tích lũy',
    concept: 'accumulation_factors',
    formula: 'Quy mô tích lũy phụ thuộc α, m, năng suất, hiệu quả máy móc',
    explanation:
      'Giáo trình nêu các nhân tố chính: tỷ lệ phân chia m cho tiêu dùng và tích lũy, trình độ khai thác sức lao động, năng suất lao động xã hội, sử dụng hiệu quả máy móc và quy mô tư bản ứng trước.',
    marxSource: SOURCE,
  },
  {
    round: 13,
    title: 'Hệ quả của tích lũy tư bản',
    concept: 'accumulation_consequences',
    formula: 'c/v tăng; tích tụ và tập trung tư bản',
    explanation:
      'Tích lũy làm tăng cấu tạo hữu cơ của tư bản, đồng thời dẫn tới tích tụ và tập trung tư bản. Game chỉ dùng các chỉ số này để minh họa hệ quả giáo trình, không mô phỏng quản trị doanh nghiệp ngoài bài.',
    marxSource: SOURCE,
  },
  {
    round: 14,
    title: 'Chi phí sản xuất và lợi nhuận',
    concept: 'profit',
    formula: 'k = c + v;  p là hình thức biểu hiện của m',
    explanation:
      'Trong kinh doanh, nhà tư bản nhìn phần chênh lệch so với chi phí sản xuất k như lợi nhuận p. Về bản chất lý luận, lợi nhuận là hình thức biểu hiện chuyển hóa của giá trị thặng dư.',
    marxSource: SOURCE,
  },
  {
    round: 15,
    title: 'Tỷ suất lợi nhuận và lợi nhuận bình quân',
    concept: 'average_profit',
    formula: "p' = p / (c + v);  P̄ = p̄ × tư bản ứng trước",
    explanation:
      'Tỷ suất lợi nhuận chịu ảnh hưởng của m, cấu tạo hữu cơ, tốc độ chu chuyển và tiết kiệm tư bản bất biến. Cạnh tranh giữa các ngành hình thành lợi nhuận bình quân.',
    marxSource: SOURCE,
  },
  {
    round: 16,
    title: 'Lợi nhuận thương nghiệp',
    concept: 'merchant_capital',
    formula: 'Lợi nhuận thương nghiệp = một phần m được phân chia',
    explanation:
      'Tư bản thương nghiệp không tạo ra nguồn giá trị thặng dư độc lập. Lợi nhuận thương nghiệp là một phần giá trị thặng dư do tư bản sản xuất nhường lại để thực hiện khâu lưu thông hàng hóa.',
    marxSource: SOURCE,
  },
  {
    round: 17,
    title: 'Lợi tức',
    concept: 'interest',
    formula: "z' = z / tư bản cho vay",
    explanation:
      'Lợi tức là một phần lợi nhuận bình quân mà nhà tư bản đi vay trả cho người sở hữu tư bản cho vay. Vì vậy tiền lãi ngân hàng trong bài học vẫn được quy về sự phân chia giá trị thặng dư.',
    marxSource: SOURCE,
  },
  {
    round: 18,
    title: 'Địa tô và giá đất',
    concept: 'rent',
    formula: 'Giá đất = Địa tô / Tỷ suất lợi tức ngân hàng',
    explanation:
      'Địa tô là phần giá trị thặng dư chuyển cho chủ sở hữu đất. Giá đất trong giáo trình được giải thích bằng địa tô tư bản hóa, nên các biến động giá đất cần được phân tích theo địa tô và lợi tức.',
    marxSource: SOURCE,
  },
]

export const TOOLTIP_FORMULAS: Record<string, string> = {
  G: 'G = c + v + m  (Tổng giá trị hàng hóa)',
  k: 'k = c + v  (Chi phí sản xuất)',
  m: 'm = G − k  (Giá trị thặng dư)',
  m_rate: "m' = m / v = (h − t_n) / t_n  (Tỷ suất GTTT)",
  p_rate: "p' = p / (c + v)  (Tỷ suất lợi nhuận)",
  organic_comp: 'c/v  (Cấu tạo hữu cơ của tư bản)',
  n: 'n = CH / ch  (Số vòng chu chuyển)',
  M_year: "M_năm = m' × V × n  (Khối lượng GTTT hằng năm)",
  m_super: 'Siêu GTTT: giá trị cá biệt thấp hơn giá trị xã hội',
  land_price: 'Giá đất = Địa tô / tỷ suất lợi tức ngân hàng',
}

export function getLessonForRound(round: number): TheoryLesson | undefined {
  return THEORY_LESSONS.find((lesson) => lesson.round === round)
}
