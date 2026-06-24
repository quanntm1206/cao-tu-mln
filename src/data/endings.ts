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
    { label: 'Loi nhuan CN', value: fmt(industrial_profit) + ` (${pct(industrial_profit, total)})` },
    { label: 'Loi nhuan TN', value: fmt(merchant_profit) + ` (${pct(merchant_profit, total)})` },
    { label: 'Lai tuc da tra (Z)', value: fmt(interest_paid) + ` (${pct(interest_paid, total)})` },
    { label: 'Dia to da tra (R)', value: fmt(rent_paid) + ` (${pct(rent_paid, total)})` },
    { label: 'M-pool cuoi', value: fmt(m_pool) },
  ]

  // Score each ending
  type Candidate = EndingResult & { score: number }
  const candidates: Candidate[] = [
    {
      endingId: 'industrial_pure',
      title: 'Nha tu ban Cong nghiep thuan tuy',
      tone: 'growth',
      score: indShare >= 0.7 ? 5 : indShare >= 0.5 ? 3 : 1,
      summary: 'Phan lon GTTT duoc giu lai trong san xuat cong nghiep. M-pool tang chu yeu tu loi nhuan san xuat truc tiep.',
      whyThisHappened: 'Ban tap trung phan bo M-pool cho co khi, det may, da giay va giu han che su phu thuoc vao thuong nhan, ngan hang, chu dat.',
      textbookConnection: 'Loi nhuan CN = hinh thai bien doi cua m. p\' = m/(c+v). Khi phan phoi it hon cho cac hinh thai khac, nha tu ban san xuat giu lai nhieu p hon.',
      reflectionQuestions: [
        'Neu dung nhieu kenh thuong nghiep hon, phan m nao se chuyen sang p_TN?',
        'Loi nhuan CN co "trong sach" hon lai tuc hay dia to khong? Giai thich?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'merchant_extreme',
      title: 'Phu thuoc Kenh Thuong nghiep',
      tone: 'analysis',
      score: merShare >= 0.35 ? 5 : merShare >= 0.2 ? 3 : 0,
      summary: 'Phan lon GTTT da duoc nhuong cho thuong nhan. Luu thong duoc uu tien nhung loi nhuan giu lai bi thu hep.',
      whyThisHappened: 'Ban su dung kenh thuong mai voi ty le hoa hong cao trong nhieu vong Pha 2.',
      textbookConnection: 'p_TN = phan m nhuong cho tu ban TN. Tu ban TN khong tao m doc lap – no la phan phoi tu m san xuat.',
      reflectionQuestions: [
        'Tu ban TN co tao ra gia tri moi khong? Neu khong, tai sao no van duoc huong p_TN?',
        'Biet tu do, ta biet rang luu thong khong tao gia tri – y nghia la gi?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'lender_focus',
      title: 'Phu thuoc Tu ban Tai chinh',
      tone: 'warning',
      score: finShare >= 0.3 ? 5 : finShare >= 0.15 ? 3 : 0,
      summary: 'Lai tuc chiem phan dang ke trong phan phoi GTTT. Nha tu ban san xuat phai nhuong nhieu m cho chu no.',
      whyThisHappened: 'Ban vay von nhieu trong Pha 3, lam tang khoan lai phai tra trong cac vong tiep theo.',
      textbookConnection: 'Z = m chuyen cho chu so huu tu ban cho vay. Lai suat VN 2022: 7.8%, 2024: 3.7% – minh hoa xu huong bien dong Z theo chu ky kinh te.',
      reflectionQuestions: [
        'Tai sao Z van duoc quy ve la phan phoi tu m, du chu no khong tham gia san xuat?',
        'Loi ich cua vay von la gi, va diem nao thi Z tro thanh ganh nang?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'land_speculator',
      title: 'Dau co Dat – Bong bong & Suy sup',
      tone: 'warning',
      score: (rentShare >= 0.2 && rent_paid > 0) ? 4 : 0,
      summary: 'Dat dai chiem phan dang ke trong phan phoi. Neu chon dau co (Bac Ninh), bong bong da gay ton that.',
      whyThisHappened: 'Ban chon dau co dat Bac Ninh trong Pha 4. Bong bong tang 40% nhung sau do sup do -15%, minh hoa rui ro.',
      textbookConnection: 'Gia dat = R/i. Dau co lam gia dat tang vot khoi GTTT thuc. Khi bong bong vo, gia dat quay ve von hoa R thuc.',
      reflectionQuestions: [
        'Tai sao gia dat co the tang vuot xa "gia tri" cua dat?',
        'Bong bong bat dong san anh huong the nao den phan phoi m trong xa hoi?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'land_wise',
      title: 'Dau tu Dat khon ngoan',
      tone: 'growth',
      score: (rent_paid > 0 && rentShare < 0.15) ? 3 : 0,
      summary: 'Bat dong san dong gop vua phai vao phan phoi. Ban quan ly R hieu qua, tranh dau co qua muc.',
      whyThisHappened: 'Ban chon mua dat Hoai Duc hoac chi thue voi ty le hop ly trong Pha 4.',
      textbookConnection: 'Gia dat Hoai Duc tang 81% (2022-2024) du R on dinh – minh hoa gia dat = R/i khi i giam. Day la von hoa dia to.',
      reflectionQuestions: [
        'Su tang gia dat 81% co phan anh tang GTTT thuc khong? Giai thich qua cong thuc.',
        'Khi i giam 50%, gia dat thay doi bao nhieu % neu R khong doi?',
      ],
      keySignals: signals,
      secondaryConsequences: [],
    },
    {
      endingId: 'balanced_distribution',
      title: 'Phan phoi GTTT can bang',
      tone: 'analysis',
      score: (indShare >= 0.3 && indShare <= 0.6 && (merShare > 0 || finShare > 0 || rentShare > 0)) ? 4 : 0,
      summary: 'GTTT duoc phan phoi tuong doi deu giua cac hinh thai. Minh hoa day du m = p + p_TN + Z + R.',
      whyThisHappened: 'Ban da tham gia ca 4 kenh phan phoi qua 4 pha cua hoc phan.',
      textbookConnection: 'Cong thuc m = p + LN TN + Z + R la tong ket ly thuyet phan phoi GTTT trong giao trinh Chuong 3 tr. 70-78.',
      reflectionQuestions: [
        'Trong 4 hinh thai phan phoi, hinh thai nao can thiet de tao ra GTTT? Tai sao?',
        'Neu chi co p ma khong co p_TN, Z, R thi nen kinh te se van hanh the nao?',
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


