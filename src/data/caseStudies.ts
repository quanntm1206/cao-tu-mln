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
    title: 'Dat Hoai Duc - Von hoa dia to o vung ven Ha Noi',
    phase: 4,
    source: 'Batdongsan.com.vn / CafeF (2024)',
    verifiedDate: '2024-06-01',
    relatedFormula: 'Gia dat = Dia to (R) / Ty suat lai tuc (Z\')',
    summary:
      'Dat nen Hoai Duc tang 81% (2022-2024) nho hoan thien ha tang Vanh dai 3. ' +
      'Gia thue 8 trieu/m2/nam, gia ban len toi 100 trieu/m2. Cong thuc P = R/Z\' giai thich muc gia cao.',
    dataPoints: [
      { label: 'Gia thue', value: 8_000_000, unit: 'VND/m2/nam', year: 2024 },
      { label: 'Gia ban', value: 100_000_000, unit: 'VND/m2', year: 2024 },
      { label: 'Tang gia 2022-2024', value: '81%' },
      { label: 'Ty suat lai tuc NH', value: '6%', year: 2024 },
    ],
    sourceUrl: 'https://vars.com.vn/nghien-cuu-thi-truong/vars-bao-cao-thi-truong-bds-viet-nam-quy-32024-tang-nhiet-hay-tao-nhiet-mn244',
  },
  {
    id: 'bac_ninh_speculation',
    title: 'Sot dat Bac Ninh - Dau co do sap nhap tinh 2025',
    phase: 4,
    source: 'Bo Xay dung QII/2025, VARS',
    verifiedDate: '2025-07-15',
    relatedFormula: 'Gia dat = Dia to (R) / Ty suat lai tuc (Z\')',
    summary:
      'Gia dat Bac Ninh, Hung Yen tang toi 40% trong ~2 tuan sau tin sap nhap tinh (2025). ' +
      'Bo XD xac nhan phan lon giao dich mang tinh dau co, tach roi gia ca va dia to thuc.',
    dataPoints: [
      { label: 'Gia thue', value: 3_000_000, unit: 'VND/m2/nam', year: 2025 },
      { label: 'Tang gia 2 tuan', value: '40%' },
      { label: 'Giam sau ha nhiet', value: '-15%/thang', year: 2025 },
    ],
    sourceUrl: 'https://moc.gov.vn',
  },
  {
    id: 'merger_2025',
    title: 'Sap nhap tinh 2025 - Ky vong dia to va dau co',
    phase: 4,
    source: 'VARS bao cao 15/7/2025',
    verifiedDate: '2025-07-15',
    relatedFormula: 'Dia to = phan m con lai sau loi nhuan binh quan',
    summary:
      '63 tinh thanh gop thanh 34 don vi hanh chinh (7/2025). Gia dat tang toi 40%, co TH +10% trong mot dem. ' +
      'Sau 1 thang ha nhiet - minh hoa bong bong khi gia tach roi dia to thuc.',
    dataPoints: [
      { label: 'Tang gia toi da', value: '40%', year: 2025 },
      { label: 'Tang trong mot dem', value: '10%', year: 2025 },
      { label: 'Giam quan tam dat nen Ha Noi', value: '-15%/thang', year: 2025 },
    ],
    sourceUrl: 'https://vars.com.vn/nghien-cuu-thi-truong/vars-bao-cao-thi-truong-bds-viet-nam-quy-32024-tang-nhiet-hay-tao-nhiet-mn244',
  },
  {
    id: 'tphcm_land',
    title: 'Dat TP.HCM - Dia to chenh lech va quy hoach do thi',
    phase: 4,
    source: 'DKRA Group bao cao Q1/2025',
    verifiedDate: '2025-03-01',
    relatedFormula: 'Dia to chenh lech II = f(vi tri, ha tang, quy hoach)',
    summary:
      'Dat nen TP.HCM tang 12-16% Q1/2025, hotspot 20-30% do sap nhap/mo rong. ' +
      'Pha tron dia to ky vong va dau co.',
    dataPoints: [
      { label: 'Tang gia dat nen Q1/2025', value: '12-16%' },
      { label: 'Hotspot sap nhap', value: '20-30%', year: 2025 },
    ],
    sourceUrl: 'https://dkra.vn/bao-cao-thi-truong',
  },
  {
    id: 'mwg_retail_war',
    title: 'MWG - Cuoc chien gia ban le dien may 2023-2024',
    phase: 2,
    source: 'BCTC MWG Q4/2023 (HOSE/Vietstock)',
    verifiedDate: '2024-01-15',
    relatedFormula: 'Loi nhuan thuong nghiep = phan m nha SX nhuong lai',
    summary:
      'MWG bien loi nhuan gop giam tu 23% xuong 19% (2023) do canh tranh gia. ' +
      'NPAT 2024 dat 3,7 nghin ty. Loi nhuan thuong nghiep la phan m duoc chia, khong tu sinh.',
    dataPoints: [
      { label: 'Bien LN gop 2021', value: '23%' },
      { label: 'Bien LN gop 2023', value: '19%' },
      { label: 'NPAT 2024', value: '3.700 ty VND', year: 2024 },
      { label: 'Doanh thu 2024', value: '134.000 ty VND', year: 2024 },
    ],
    sourceUrl: 'https://static2.vietstock.vn/data/HOSE/2023/BCTC/VN/QUY%204/MWG_Baocaotaichinh_Q4_2023_Hopnhat.pdf',
  },
  {
    id: 'fpt_retail_shift',
    title: 'FPT Retail - Dich chuyen von sang Long Chau (P binh quan)',
    phase: 1,
    source: 'BCTN FRT 2023 (HOSE/Vietstock)',
    verifiedDate: '2024-03-01',
    relatedFormula: 'P\' binh quan - von tu do di chuyen giua nganh',
    summary:
      'FPT Shop lo 294 ty (2023), Long Chau chiem 63% doanh thu (2024). ' +
      'Minh hoa quy luat P binh quan: von chay sang nganh ty suat loi nhuan cao hon.',
    dataPoints: [
      { label: 'Lo FPT Shop 2023', value: '294 ty VND', year: 2023 },
      { label: 'Long Chau % DT 2024', value: '63%', year: 2024 },
      { label: 'LN truoc thue FRT 2024', value: '527 ty VND', year: 2024 },
    ],
    sourceUrl: 'https://static2.vietstock.vn/data/HOSE/2023/BCTN/VN/FRT_Baocaothuongnien_2023.pdf',
  },
  {
    id: 'bank_interest_rates',
    title: 'Lai suat tiet kiem VN 2022-2024 - Tien co de ra tien?',
    phase: 3,
    source: 'NHNN / Vietstock / VnEconomy',
    verifiedDate: '2024-12-01',
    relatedFormula: 'Z\' = Z / TBCV x 100% (T-T\')',
    summary:
      'Lai suat 12 thang: 7,8% (2022) -> 3,7% (8/2024) -> tang lai cuoi 2024. ' +
      'Z la phan P binh quan cua nguoi vay tra lai - bac bo ao tuong tien tu sinh lai.',
    dataPoints: [
      { label: 'LS 12 thang dinh 2022', value: '7,8%', year: 2022 },
      { label: 'LS 12 thang day 8/2024', value: '3,7%', year: 2024 },
      { label: 'No xau tang 2024', value: '+4,55%', year: 2024 },
      { label: 'Tien gui 2023', value: '>13,5 trieu ty VND', year: 2023 },
    ],
    sourceUrl: 'https://finance.vietstock.vn/vi-mo/du-lieu/lai-suat-tien-gui-ngan-hang-69',
  },
  {
    id: 'land_bubble_crash',
    title: 'Bong bong dat 2022-2024 - Khi ky vong vuot dia to thuc',
    phase: 4,
    source: 'Bo Xay dung 2022, VARS, HoREA',
    verifiedDate: '2024-06-01',
    relatedFormula: 'Gia dat thuc te = Dia to / Lai suat',
    summary:
      'Sau sot dat 2021, thi truong giam 30-50% khi that chat tin dung. ' +
      'Hang ngan du an dung bang - minh hoa nguy hiem khi gia tach roi dia to thuc.',
    dataPoints: [
      { label: 'Muc giam gia dat nen', value: '30-50%', year: 2023 },
      { label: 'Du an dung bang', value: '1200+', year: 2023 },
      { label: 'Ty le hap thu Q4/2022', value: '11%' },
    ],
    sourceUrl: 'https://moc.gov.vn',
  },
]

export function getCasesForPhase(phase: 1 | 2 | 3 | 4): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.phase === phase)
}