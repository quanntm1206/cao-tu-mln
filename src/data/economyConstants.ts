/** Quy mô tiền tệ theo doanh nghiệp sản xuất vừa và nhỏ Việt Nam (đơn vị: VND). Mỗi vòng ≈ một quý sản xuất. */

export const CAPITAL_OPTIONS = [
  { label: '5 tỷ ₫ (Dễ)', value: 5_000_000_000 },
  { label: '3 tỷ ₫ (TB)', value: 3_000_000_000 },
  { label: '1,5 tỷ ₫ (Khó)', value: 1_500_000_000 },
] as const

export const DEFAULT_CAPITAL = 3_000_000_000

/** Lương bình quân mỗi công nhân mỗi vòng (quý) — khoảng 7–9 triệu/tháng × 3 */
export const DEFAULT_WAGE_PER_WORKER = 24_000_000
export const WAGE_MIN = 15_000_000
export const WAGE_MAX = 45_000_000
export const WAGE_STEP = 1_000_000
export const FAIR_WAGE_THRESHOLD = 24_000_000

export const DEFAULT_WORKERS = 15

/** Địa tô thuê mặt bằng sản xuất mỗi đơn vị mỗi vòng (quý) */
export const DEFAULT_RENT_PER_UNIT = 120_000_000

/** Bước nhập liệu đầu tư (máy móc, NVL, R&D) */
export const INVEST_STEP = 50_000_000

/** Chi phí nâng một cấp logistics */
export const LOGISTICS_UNIT_COST = 500_000_000

/** Tham số engine R&D — mức chi tương đương DN VN */
export const RND_REFERENCE = 500_000_000
export const RND_TECH_BOOST_DIVISOR = 4_000_000_000

/** Hạn mức vay một lần */
export const MAX_LOAN_PER_ROUND = 3_000_000_000
export const LOAN_STEP = 100_000_000
export const LEND_STEP = 100_000_000
