export interface TheoryLesson {
  round: number
  title: string
  concept: string
  formula?: string
  explanation: string
  marxSource?: string
}

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    round: 1,
    title: 'Giá trị thặng dư (m)',
    concept: 'surplus_value',
    formula: 'G = c + v + m',
    explanation:
      'Hàng hóa được tạo ra bằng tư bản bất biến (c – máy móc, nguyên liệu), tư bản khả biến (v – tiền lương) và giá trị thặng dư (m) do sức lao động tạo ra vượt quá giá trị sức lao động.',
    marxSource: 'Tư Bản, Quyển I, Ch.7',
  },
  {
    round: 2,
    title: 'Tái đầu tư và tích lũy',
    concept: 'reinvestment',
    formula: 'Tích lũy = α × m',
    explanation:
      'Một phần giá trị thặng dư được tư bản chuyển thành tư bản mới (tái đầu tư). Tỷ lệ α càng cao, quy mô sản xuất càng mở rộng nhanh hơn.',
    marxSource: 'Tư Bản, Quyển I, Ch.24',
  },
  {
    round: 3,
    title: 'Tư bản bất biến – Máy móc',
    concept: 'constant_capital',
    formula: 'c = c_cố_định_khấu_hao + c_lưu_động',
    explanation:
      'Tư bản bất biến gồm khấu hao máy móc (c_cố_định) và nguyên liệu tiêu hao (c_lưu_động). Máy móc chuyển dịch giá trị sang hàng hóa theo từng vòng sản xuất.',
    marxSource: 'Tư Bản, Quyển I, Ch.8',
  },
  {
    round: 4,
    title: 'Thành phần hữu cơ của tư bản',
    concept: 'organic_composition',
    formula: 'q = c / v',
    explanation:
      'q tăng nghĩa là dùng nhiều máy móc hơn so với lao động. Dài hạn, tỷ suất lợi nhuận có xu hướng giảm khi q tăng vì chỉ v mới tạo m.',
    marxSource: 'Tư Bản, Quyển III, Ch.13',
  },
  {
    round: 5,
    title: 'Giá trị thặng dư tương đối & Công nghệ',
    concept: 'relative_surplus_value',
    formula: "m' = (h - t_n) / t_n",
    explanation:
      "Công nghệ mới rút ngắn thời gian lao động tất yếu t_n, tăng m' mà không cần tăng giờ làm. Nhà tư bản nào có công nghệ vượt trội hưởng siêu giá trị thặng dư.",
    marxSource: 'Tư Bản, Quyển I, Ch.12',
  },
  {
    round: 6,
    title: 'Siêu giá trị thặng dư',
    concept: 'super_surplus',
    formula: 'm_super = tech_lead × m',
    explanation:
      'Khi giá trị cá biệt thấp hơn giá trị xã hội, nhà tư bản thu thêm m_super. Lợi thế này mất dần khi công nghệ lan rộng thị trường (tech_lead giảm).',
    marxSource: 'Tư Bản, Quyển I, Ch.12',
  },
  {
    round: 7,
    title: 'Vòng quay tư bản & Năng suất hàng năm',
    concept: 'turnover',
    formula: 'M_năm = m\' × V × n,  n = CH / ch',
    explanation:
      'Tư bản lưu động quay vòng nhiều lần trong năm. Rút ngắn thời gian lưu thông ch (kho vận, thị trường) tương đương mở rộng quy mô.',
    marxSource: 'Tư Bản, Quyển II, Ch.15',
  },
  {
    round: 8,
    title: 'Tư bản thương nghiệp',
    concept: 'merchant_capital',
    formula: 'p_thương = merchant_rate × m_tổng',
    explanation:
      'Tư bản thương nghiệp nhận một phần giá trị thặng dư để đảm nhận lưu thông. Bán trực tiếp giữ lại nhiều hơn nhưng chi phí kênh cao hơn.',
    marxSource: 'Tư Bản, Quyển III, Ch.16',
  },
  {
    round: 9,
    title: 'Tư bản cho vay & Lãi suất',
    concept: 'interest',
    formula: 'z = nợ × i,  z_thu = cho_vay × i × 0.75',
    explanation:
      'Tư bản tiền tệ được cho vay để thu lãi z. Nhà tư bản công nghiệp vay để mở rộng; lãi suất là phần giá trị thặng dư chuyển cho tư bản tài chính.',
    marxSource: 'Tư Bản, Quyển III, Ch.21',
  },
  {
    round: 10,
    title: 'P-bar: Bình quân hóa tỷ suất lợi nhuận',
    concept: 'profit_equalization',
    formula: "p'_cá_thể → p̄ (thị trường)",
    explanation:
      'Cạnh tranh liên tục điều chỉnh tỷ suất lợi nhuận cá biệt về mức trung bình thị trường p̄. Đây là cơ chế hình thành giá sản xuất.',
    marxSource: 'Tư Bản, Quyển III, Ch.10',
  },
  {
    round: 11,
    title: 'Địa tô',
    concept: 'rent',
    formula: 'Giá đất = R / i',
    explanation:
      'Địa tô R là phần giá trị thặng dư chuyển cho địa chủ vì sở hữu đất đai. Giá đất được xác định bằng địa tô tư bản hóa theo lãi suất hiện hành.',
    marxSource: 'Tư Bản, Quyển III, Ch.37',
  },
  {
    round: 12,
    title: 'Tích lũy nguyên thủy & Hao mòn vô hình',
    concept: 'moral_depreciation',
    formula: 'Hao mòn vô hình = giá_trị_cũ − giá_trị_xã_hội_mới',
    explanation:
      'Khi công nghệ mới lan rộng, máy cũ mất giá trị không phải do sử dụng mà do tiến bộ kỹ thuật. Đây là hao mòn vô hình (moral depreciation).',
    marxSource: 'Tư Bản, Quyển I, Ch.15',
  },
]

export const TOOLTIP_FORMULAS: Record<string, string> = {
  G: 'G = c + v + m  (Tổng giá trị hàng hóa)',
  k: 'k = c + v  (Giá thành sản xuất)',
  m: 'm = G − k  (Giá trị thặng dư)',
  m_rate: "m' = m / v = (h − t_n) / t_n  (Tỷ suất GTTT)",
  p_rate: "p' = m / (c + v)  (Tỷ suất lợi nhuận)",
  organic_comp: 'q = c / v  (Thành phần hữu cơ)',
  n: 'n = CH / ch  (Vòng quay tư bản)',
  M_year: "M_năm = m' × V × n  (GTTT hàng năm)",
  m_super: 'm_super = tech_lead × m  (Siêu GTTT)',
  land_price: 'Giá đất = R / i  (Địa tô tư bản hóa)',
}

export function getLessonForRound(round: number): TheoryLesson | undefined {
  return THEORY_LESSONS.find((l) => l.round === round)
}
