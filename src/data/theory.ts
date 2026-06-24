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

const SOURCE = 'Giao trinh KTCT Mac-Lenin, Chuong 3, tr. 70-78'

/** 5 sections matching textbook tr 70-78 */
export const THEORY_SECTIONS: TheorySection[] = [
  {
    id: 'profit',
    title: 'Loi nhuan (p) – Hinh thai bien doi cua GTTT',
    pages: 'tr. 70-72',
    formula: 'p = m (trong cau truc T-H-T\')',
    symbolGuide: 'p la loi nhuan (profit), m la gia tri thang du. p chi la hinh thai bieu hien cua m – che giau nguon goc that su.',
    explanation: 'Loi nhuan la hinh thai bien doi cua gia tri thang du. Khi m xuat hien nhu p, no bi quy cho toan bo tu ban ung truoc (c+v) thay vi chi tu v. Dieu nay che giau bo loc lao dong.',
    keyPoints: [
      'p = m ve mat luong, nhung khac ve chat: m phat sinh tu v, p quy cho (c+v)',
      'Ty suat loi nhuan: p\' = m/(c+v) < m\' = m/v',
      'Canh tranh giua cac nganh binh quan hoa p\' thanh ty suat loi nhuan binh quan P\',',
      'Gia ca san xuat = k + P (chi phi san xuat + loi nhuan binh quan)',
    ],
  },
  {
    id: 'average_profit',
    title: 'Loi nhuan binh quan & Gia ca san xuat',
    pages: 'tr. 72-73',
    formula: 'Gia ca san xuat = k + P\'tb × (c+v)',
    symbolGuide: 'k = chi phi san xuat (c+v); P\'tb = ty suat loi nhuan binh quan; P = loi nhuan binh quan.',
    explanation: 'Canh tranh giua cac nganh buoc tu ban dich chuyen de binh quan hoa ty suat loi nhuan. Gia ca san xuat la trung tam xoay quanh gia ca thi truong. Tong gia ca san xuat = tong gia tri hang hoa xa hoi.',
    keyPoints: [
      'Tu ban chuyen tu nganh p\' thap sang nganh p\' cao',
      'Cung-cau dieu chinh den khi p\' bien vi P\'tb',
      'P\'tb = tong m / tong tu ban xa hoi',
      'Gia ca san xuat ≠ gia tri: co the cao hon hoac thap hon',
    ],
  },
  {
    id: 'merchant_profit',
    title: 'Loi nhuan Thuong nghiep',
    pages: 'tr. 73-74',
    formula: 'm = p_CN + p_TN (p_TN la phan m nhuong cho thuong nhan)',
    symbolGuide: 'p_TN = loi nhuan thuong nghiep, la phan gia tri thang du nha san xuat nhuong cho thuong nhan de luu thong hang hoa.',
    explanation: 'Tu ban thuong nghiep khong truc tiep boc lot lao dong nhung huong phan m tu qua trinh san xuat thong qua viec mua re ban dat (mua theo gia ban buon, ban theo gia ca san xuat). Luu thong khong tao ra gia tri moi.',
    keyPoints: [
      'p_TN khong phat sinh tu luu thong ma la phan phoi tu m',
      'Thuong nhan rut ngan thoi gian luu thong, tang n vong quay',
      'Chi phi luu thong thuan tuy (bao bi, van chuyen) duoc tinh vao gia ca san xuat',
      'Binh quan hoa p\' bao gom ca tu ban thuong nghiep',
    ],
  },
  {
    id: 'interest',
    title: 'Lai tuc (Z) – Phan chia GTTT cho tu ban cho vay',
    pages: 'tr. 74-76',
    formula: 'Z = tu ban cho vay × lai suat i',
    symbolGuide: 'Z = lai tuc (interest), i = lai suat. Tu ban cho vay nhan Z ma khong tham gia san xuat.',
    explanation: 'Lai tuc la phan loi nhuan ma nha tu ban san xuat nhuong cho chu so huu tu ban cho vay. Lai suat i = Z/tu ban cho vay, phan anh gia ca cua tu ban. Lai suat co xu huong bien dong theo chu ky kinh te va chinh sach tien te.',
    keyPoints: [
      'Tu ban cho vay: T – T\' (khong qua H, khong san xuat)',
      'Lai suat = phan m chuyen cho chu no',
      'Gioi han: 0 < i < p\' (cach duoi la 0, cach tren la toan bo loi nhuan)',
      'Tin dung la don bay cua tu ban nhung cung la nguon goc khung hoang tai chinh',
    ],
  },
  {
    id: 'land_rent',
    title: 'Dia to (R) & Gia dat',
    pages: 'tr. 76-78',
    formula: 'Gia dat = R / i',
    symbolGuide: 'R = dia to (land rent), i = lai suat. Gia dat = R von hoa theo lai suat.',
    explanation: 'Dia to la phan gia tri thang du ma nha tu ban san xuat nhuong cho chu so huu dat de duoc quyen su dung dat. Gia dat khong phai gia tri cua dat ma la gia tri von hoa cua dong dia to. Dia to co 2 hinh thai: tuyet doi (moi dat deu co) va chenh lech (dat tot hon).',
    keyPoints: [
      'Dia to tuyet doi: do tu ban dat nong nghiep co cau tao huu co thap hon CN',
      'Dia to chenh lech I: do do phi do mau mo va vi tri khac nhau',
      'Dia to chenh lech II: do dau tu them tren cung dien tich',
      'Gia dat tang khi R tang hoac i giam – bong bong bat dong san',
    ],
  },
]

export const THEORY_LESSONS: TheoryLesson[] = [
  {
    round: 1,
    title: 'Cong thuc chung cua tu ban',
    concept: 'capital_formula',
    formula: 'T – H – T\'',
    symbolGuide: 'T = tien ban dau; H = hang hoa san xuat; T\' = tien thu ve lon hon. Dau phay tren T\' nghia la tien da tang them.',
    explanation: 'Tien chi tro thanh tu ban khi van dong theo cong thuc T-H-T\', tuc dung tien ra de thu ve so tien lon hon. Phan lon hon do la gia tri thang du.',
    marxSource: SOURCE,
  },
  {
    round: 2,
    title: 'Gia tri thang du va san xuat cong nghiep',
    concept: 'surplus_value',
    formula: 'G = c + v + m',
    symbolGuide: 'G = gia tri hang hoa; c = tu ban bat bien; v = tu ban kha bien; m = gia tri thang du.',
    explanation: 'Gia tri hang hoa gom tu ban bat bien c, tu ban kha bien v va gia tri thang du m. May moc va nguyen lieu chi chuyen gia tri; phan gia tri tang them do lao dong song tao ra.',
    marxSource: SOURCE,
  },
  {
    round: 3,
    title: 'Ty suat loi nhuan p\'',
    concept: 'profit_rate',
    formula: 'p\' = m / (c + v)',
    symbolGuide: 'p\' = ty suat loi nhuan; m = gia tri thang du; c+v = tu ban ung truoc.',
    explanation: 'Khi m xuat hien nhu p, ty suat duoc tinh tren toan bo tu ban ung truoc (c+v). p\' < m\' vi mau so lon hon. Day la su che giau nguon goc that su cua m.',
    marxSource: SOURCE,
  },
  {
    round: 4,
    title: 'Loi nhuan binh quan P\',',
    concept: 'average_profit',
    formula: 'P\',  = tong m / tong (c+v)',
    symbolGuide: 'P\', = ty suat loi nhuan binh quan; binh quan hoa qua canh tranh giua cac nganh.',
    explanation: 'Canh tranh giua cac nganh lam cho tu ban dich chuyen den noi co p\' cao hon, biet tu do binh quan hoa. Gia ca san xuat = k + P bien trung tam xoay quanh gia ca thi truong.',
    marxSource: SOURCE,
  },
  {
    round: 5,
    title: 'Loi nhuan Thuong nghiep',
    concept: 'merchant_profit',
    formula: 'm = p_CN + p_TN',
    symbolGuide: 'p_TN = phan m nhuong cho thuong nhan de luu thong hang hoa.',
    explanation: 'Tu ban thuong nghiep khong tao nguon m doc lap; loi nhuan thuong nghiep la mot phan gia tri thang du duoc tu ban san xuat nhuong lai. Luu thong khong tao gia tri moi.',
    marxSource: SOURCE,
  },
  {
    round: 6,
    title: 'Luu thong tu ban thuong nghiep',
    concept: 'merchant_circulation',
    formula: 'T – H – T\' (mua ban de an chenh lech)',
    symbolGuide: 'Thuong nhan mua theo gia ban buon (thap hon gia ca san xuat) va ban theo gia ca san xuat.',
    explanation: 'Thuong nhan rut ngan thoi gian luu thong, tang n vong quay. Nhung p_TN van la phan m tu san xuat – luu thong khong tao them gia tri moi.',
    marxSource: SOURCE,
  },
  {
    round: 7,
    title: 'Tu ban cho vay va Lai tuc',
    concept: 'interest',
    formula: 'Z = tu ban cho vay × i',
    symbolGuide: 'Z = lai tuc; i = lai suat. Tu ban cho vay van dong T – T\' ma khong qua san xuat.',
    explanation: 'Lai tuc la phan loi nhuan chuyen cho chu so huu tu ban cho vay. Lai suat phan anh gia ca cua tu ban. Tin dung la don bay nhung cung la nguon goc khung hoang tai chinh.',
    marxSource: SOURCE,
  },
  {
    round: 8,
    title: 'Lai suat va chu ky kinh te',
    concept: 'interest_rate_cycle',
    formula: '0 < i < p\'',
    symbolGuide: 'Gioi han duoi la 0 (khong co loi); gioi han tren la p\' (nha san xuat khong co loi nhuan)',
    explanation: 'Lai suat bien dong theo chu ky: tang trong giai doan hung thinh, giam trong suy thoai. Chinh sach tien te anh huong den i, do do anh huong den phan phoi m giua san xuat va tai chinh.',
    marxSource: SOURCE,
  },
  {
    round: 9,
    title: 'Dia to (R) tuyet doi',
    concept: 'absolute_rent',
    formula: 'R = p_CN_nonong nghiep - p_CN_nong nghiep',
    symbolGuide: 'Dia to tuyet doi phat sinh do cau tao huu co cua tu ban nong nghiep thap hon CN, tao ra GTTT cao hon.',
    explanation: 'Moi dat deu phai tra dia to tuyet doi. Nguon goc: tu ban nong nghiep co cau tao huu co thap hon CN, tao GTTT cao hon, phan vuot troi la dia to tuyet doi chuyen cho chu dat.',
    marxSource: SOURCE,
  },
  {
    round: 10,
    title: 'Dia to chenh lech I & II',
    concept: 'differential_rent',
    formula: 'R_CL = sieu loi nhuan do dieu kien san xuat uu dai',
    symbolGuide: 'R_CL I = do do phi, do mau mo, vi tri; R_CL II = do dau tu them tren cung manh dat.',
    explanation: 'Dat tot hon (do phi, mau mo, gan thi truong) tao ra sieu loi nhuan. Chu so huu dat tiep chiem sieu loi nhuan nay qua dia to chenh lech. R_CL II xuat hien khi dau tu them tren cung dien tich.',
    marxSource: SOURCE,
  },
  {
    round: 11,
    title: 'Von hoa dia to – Gia dat',
    concept: 'land_price',
    formula: 'Gia dat = R / i',
    symbolGuide: 'Gia dat khong phai gia tri cua dat (dat khong co gia tri) ma la von hoa dong dia to tuong lai.',
    explanation: 'Gia dat = dong dia to thuong nien / lai suat. Khi i giam, gia dat tang du R khong thay doi. Bong bong bat dong san phat sinh khi ky vong lam tang R ky vong trong khi i thap.',
    marxSource: SOURCE,
  },
  {
    round: 12,
    title: 'Tich luy tu ban va GTTT',
    concept: 'capital_accumulation',
    formula: 'TA san xuat mo rong: bien m thanh tu ban phu them',
    symbolGuide: 'Tich luy = bien phan m giu lai thanh tu ban de mo rong san xuat.',
    explanation: 'Tich luy tu ban la bien mot phan m thanh tu ban phu them de mo rong quy mo san xuat. Day la nen tang cua tai san xuat mo rong – dong co ban cua he thong tu ban chu nghia.',
    marxSource: SOURCE,
  },
  {
    round: 13,
    title: 'Phan chia GTTT: m = p + p_TN + Z + R',
    concept: 'surplus_distribution',
    formula: 'm = p + p_TN + Z + R',
    symbolGuide: 'p = loi nhuan CN; p_TN = loi nhuan TN; Z = lai tuc; R = dia to.',
    explanation: 'Toan bo gia tri thang du m duoc phan chia giua 4 hinh thuc: loi nhuan san xuat p (nha tu ban CN giu), loi nhuan thuong nghiep p_TN (thuong nhan), lai tuc Z (ngan hang/cho vay), dia to R (chu so huu dat).',
    marxSource: SOURCE,
  },
  {
    round: 14,
    title: 'Gia tri thang du va tien de ra tien',
    concept: 'money_breeding',
    formula: 'T – H – T\' (tien de ra tien qua san xuat)',
    symbolGuide: 'Tien de ra tien khong phai tu mua ban thuan tuy ma phai qua san xuat tao m.',
    explanation: 'Tien de ra tien (T\' > T) chi xay ra qua viec tao gia tri thang du trong san xuat. Mua ban chi phan phoi lai m, khong tao m moi. Day la nen tang cua loan Chuong 3 giao trinh.',
    marxSource: SOURCE,
  },
  {
    round: 15,
    title: 'Bien dong lai suat Viet Nam 2022-2024',
    concept: 'vietnam_interest_rates',
    formula: 'i = 7.8% (2022) → 3.7% (2024)',
    symbolGuide: 'Lai suat huy dong binh quan VN 2022-2024: dau 2022 la 7.8%, cuoi 2024 giam con 3.7%.',
    explanation: 'Chu ky lai suat VN 2022-2024 minh hoa ro rang ly thuyet: khi NHNN giam lai suat, phan m chuyen cho tu ban cho vay giam, nha san xuat giu lai nhieu hon. Gia dat tang khi i giam.',
    marxSource: 'NHNN Viet Nam, Bao cao thuong nien 2024',
  },
  {
    round: 16,
    title: 'Tong ket: Phan chia GTTT va tien de ra tien',
    concept: 'full_distribution',
    formula: 'm = p + LN thuong nghiep + Z + R',
    symbolGuide: 'Toan bo GTTT phat sinh trong san xuat, duoc phan phoi qua 4 kenh. M-pool = von ban dau + phan m giu lai.',
    explanation: 'Sau 16 vong, chung ta thay ro: m phat sinh tu san xuat, duoc phan phoi cho thuong nhan, ngan hang, chu dat va nha tu ban san xuat. Mau thuan co ban: nguoi tao m (cong nhan) khong duoc nhan m.',
    marxSource: SOURCE,
  },
]

export function getLessonForRound(round: number): TheoryLesson {
  return THEORY_LESSONS.find((l) => l.round === round) ?? THEORY_LESSONS[THEORY_LESSONS.length - 1]
}

export const TOOLTIP_FORMULAS: Record<string, string> = {
  p_rate: "p' = m / (c + v) — ty suat loi nhuan",
  m_rate: "m' = m / v — ty suat gia tri thang du",
  organic: "c/v — cau tao huu co cua tu ban",
  z: "Z = tu ban cho vay x lai suat i",
  r: "Gia dat = R / i — von hoa dia to",
  m_pool: "M-pool = von ban dau + m giu lai",
  industrial_profit: "p = m cua nha tu ban CN giu lai",
  merchant_profit: "p_TN = phan m nhuong cho thuong nhan",
  interest_paid: "Z = phan m chuyen cho chu so huu tu ban cho vay",
  rent_paid: "R = phan m chuyen cho chu so huu dat",
}
