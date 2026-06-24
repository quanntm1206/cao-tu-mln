export interface DataPoint {
  label: string
  value: string | number
  unit?: string
  year?: number
}

export interface CaseStudy {
  id: string
  title: string
  phase: 1 | 2 | 3 | 4
  source: string
  verifiedDate: string
  relatedFormula: string
  summary: string
  dataPoints: DataPoint[]
  sourceUrl: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'hoai_duc_land',
    title: 'Đất Hoài Đức - Vốn hóa địa tô ở vùng ven Hà Nội',
    phase: 4,
    source: 'Batdongsan.com.vn / CafeF (2024)',
    verifiedDate: '2024-06-01',
    relatedFormula: "Giá đất = Địa tô (R) / Tỷ suất lãi tức (Z')",
    summary:
      'Đất nền Hoài Đức tăng 81% (2022-2024) nhờ hoàn thiện hạ tầng Vành đai 3. ' +
      "Giá thuê 8 triệu/m²/năm, giá bán lên tới 100 triệu/m². Công thức P = R/Z' giải thích mức giá cao.",
    dataPoints: [
      { label: 'Giá thuê', value: 8_000_000, unit: 'VND/m²/năm', year: 2024 },
      { label: 'Giá bán', value: 100_000_000, unit: 'VND/m²', year: 2024 },
      { label: 'Tăng giá 2022-2024', value: '81%' },
      { label: 'Tỷ suất lãi tức NH', value: '6%', year: 2024 },
    ],
    sourceUrl: 'https://vars.com.vn/nghien-cuu-thi-truong/vars-bao-cao-thi-truong-bds-viet-nam-quy-32024-tang-nhiet-hay-tao-nhiet-mn244',
  },
  {
    id: 'bac_ninh_speculation',
    title: 'Sốt đất Bắc Ninh - Đầu cơ do sáp nhập tỉnh 2025',
    phase: 4,
    source: 'Bộ Xây dựng QII/2025, VARS',
    verifiedDate: '2025-07-15',
    relatedFormula: "Giá đất = Địa tô (R) / Tỷ suất lãi tức (Z')",
    summary:
      'Giá đất Bắc Ninh, Hưng Yên tăng tới 40% trong ~2 tuần sau tin sáp nhập tỉnh (2025). ' +
      'Bộ XD xác nhận phần lớn giao dịch mang tính đầu cơ, tách rời giá cả và địa tô thực.',
    dataPoints: [
      { label: 'Giá thuê', value: 3_000_000, unit: 'VND/m²/năm', year: 2025 },
      { label: 'Tăng giá 2 tuần', value: '40%' },
      { label: 'Giảm sau hạ nhiệt', value: '-15%/tháng', year: 2025 },
    ],
    sourceUrl: 'https://moc.gov.vn',
  },
  {
    id: 'merger_2025',
    title: 'Sáp nhập tỉnh 2025 - Kỳ vọng địa tô và đầu cơ',
    phase: 4,
    source: 'VARS báo cáo 15/7/2025',
    verifiedDate: '2025-07-15',
    relatedFormula: 'Địa tô = phần m còn lại sau lợi nhuận bình quân',
    summary:
      '63 tỉnh thành gộp thành 34 đơn vị hành chính (7/2025). Giá đất tăng tới 40%, có TH +10% trong một đêm. ' +
      'Sau 1 tháng hạ nhiệt - minh họa bong bóng khi giá tách rời địa tô thực.',
    dataPoints: [
      { label: 'Tăng giá tối đa', value: '40%', year: 2025 },
      { label: 'Tăng trong một đêm', value: '10%', year: 2025 },
      { label: 'Giảm quan tâm đất nền Hà Nội', value: '-15%/tháng', year: 2025 },
    ],
    sourceUrl: 'https://vars.com.vn/nghien-cuu-thi-truong/vars-bao-cao-thi-truong-bds-viet-nam-quy-32024-tang-nhiet-hay-tao-nhiet-mn244',
  },
  {
    id: 'tphcm_land',
    title: 'Đất TP.HCM - Địa tô chênh lệch và quy hoạch đô thị',
    phase: 4,
    source: 'DKRA Group báo cáo Q1/2025',
    verifiedDate: '2025-03-01',
    relatedFormula: 'Địa tô chênh lệch II = f(vị trí, hạ tầng, quy hoạch)',
    summary:
      'Đất nền TP.HCM tăng 12-16% Q1/2025, hotspot 20-30% do sáp nhập/mở rộng. ' +
      'Pha trộn địa tô kỳ vọng và đầu cơ.',
    dataPoints: [
      { label: 'Tăng giá đất nền Q1/2025', value: '12-16%' },
      { label: 'Hotspot sáp nhập', value: '20-30%', year: 2025 },
    ],
    sourceUrl: 'https://dkra.vn/bao-cao-thi-truong',
  },
  {
    id: 'mwg_retail_war',
    title: 'MWG - Cuộc chiến giá bán lẻ điện máy 2023-2024',
    phase: 2,
    source: 'BCTC MWG Q4/2023 (HOSE/Vietstock)',
    verifiedDate: '2024-01-15',
    relatedFormula: 'Lợi nhuận thương nghiệp = phần m nhà SX nhượng lại',
    summary:
      'MWG biên lợi nhuận gộp giảm từ 23% xuống 19% (2023) do cạnh tranh giá. ' +
      'NPAT 2024 đạt 3,7 nghìn tỷ. Lợi nhuận thương nghiệp là phần m được chia, không tự sinh.',
    dataPoints: [
      { label: 'Biên LN gộp 2021', value: '23%' },
      { label: 'Biên LN gộp 2023', value: '19%' },
      { label: 'NPAT 2024', value: '3.700 tỷ VND', year: 2024 },
      { label: 'Doanh thu 2024', value: '134.000 tỷ VND', year: 2024 },
    ],
    sourceUrl: 'https://static2.vietstock.vn/data/HOSE/2023/BCTC/VN/QUY%204/MWG_Baocaotaichinh_Q4_2023_Hopnhat.pdf',
  },
  {
    id: 'fpt_retail_shift',
    title: "FPT Retail - Dịch chuyển vốn sang Long Châu (P bình quân)",
    phase: 1,
    source: 'BCTN FRT 2023 (HOSE/Vietstock)',
    verifiedDate: '2024-03-01',
    relatedFormula: "P' bình quân - vốn tự do di chuyển giữa ngành",
    summary:
      'FPT Shop lỗ 294 tỷ (2023), Long Châu chiếm 63% doanh thu (2024). ' +
      "Minh họa quy luật P bình quân: vốn chạy sang ngành tỷ suất lợi nhuận cao hơn.",
    dataPoints: [
      { label: 'Lỗ FPT Shop 2023', value: '294 tỷ VND', year: 2023 },
      { label: 'Long Châu % DT 2024', value: '63%', year: 2024 },
      { label: 'LN trước thuế FRT 2024', value: '527 tỷ VND', year: 2024 },
    ],
    sourceUrl: 'https://static2.vietstock.vn/data/HOSE/2023/BCTN/VN/FRT_Baocaothuongnien_2023.pdf',
  },
  {
    id: 'bank_interest_rates',
    title: 'Lãi suất tiết kiệm VN 2022-2024 - Tiền có đẻ ra tiền?',
    phase: 3,
    source: 'NHNN / Vietstock / VnEconomy',
    verifiedDate: '2024-12-01',
    relatedFormula: "Z′ = Z / TBCV x 100% (T-T')",
    summary:
      'Lãi suất 12 tháng: 7,8% (2022) -> 3,7% (8/2024) -> tăng lại cuối 2024. ' +
      'Z là phần P bình quân của người vay trả lãi - bác bỏ ảo tưởng tiền tự sinh lãi.',
    dataPoints: [
      { label: 'LS 12 tháng đỉnh 2022', value: '7,8%', year: 2022 },
      { label: 'LS 12 tháng đáy 8/2024', value: '3,7%', year: 2024 },
      { label: 'Nợ xấu tăng 2024', value: '+4,55%', year: 2024 },
      { label: 'Tiền gửi 2023', value: '>13,5 triệu tỷ VND', year: 2023 },
    ],
    sourceUrl: 'https://finance.vietstock.vn/vi-mo/du-lieu/lai-suat-tien-gui-ngan-hang-69',
  },
  {
    id: 'land_bubble_crash',
    title: 'Bong bóng đất 2022-2024 - Khi kỳ vọng vượt địa tô thực',
    phase: 4,
    source: 'Bộ Xây dựng 2022, VARS, HoREA',
    verifiedDate: '2024-06-01',
    relatedFormula: 'Giá đất thực tế = Địa tô / Lãi suất',
    summary:
      'Sau sốt đất 2021, thị trường giảm 30-50% khi thắt chặt tín dụng. ' +
      'Hàng nghìn dự án đứng băng - minh họa nguy hiểm khi giá tách rời địa tô thực.',
    dataPoints: [
      { label: 'Mức giảm giá đất nền', value: '30-50%', year: 2023 },
      { label: 'Dự án đứng băng', value: '1200+', year: 2023 },
      { label: 'Tỷ lệ hấp thu Q4/2022', value: '11%' },
    ],
    sourceUrl: 'https://moc.gov.vn',
  },
]

export function getCasesForPhase(phase: 1 | 2 | 3 | 4): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.phase === phase)
}