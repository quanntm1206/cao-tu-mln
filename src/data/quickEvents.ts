import type { Feature, HistoryEntry } from '../store/gameStore'

export const FORBIDDEN_QUICK_EVENT_TERMS = [
  'tư bản ảo',
  'chứng khoán',
  'M&A',
  'khủng hoảng thanh khoản',
  'đầu cơ',
  'phá sản',
]

export type QuickEventConcept =
  | 'capital_formula'
  | 'labour_power'
  | 'surplus_value'
  | 'constant_variable_capital'
  | 'wage'
  | 'absolute_surplus_value'
  | 'relative_surplus_value'
  | 'super_surplus'
  | 'turnover'
  | 'reproduction'
  | 'accumulation'
  | 'profit'
  | 'merchant_capital'
  | 'interest'
  | 'rent'

export interface QuickEventEffect {
  cashDelta?: number
  materialsDelta?: number
  machinesDelta?: number
  debtDelta?: number
  lendingDelta?: number
  landUnitsDelta?: number
  hDelta?: number
  wageDelta?: number
  workersDelta?: number
  tNDelta?: number
  techLeadDelta?: number
  logisticsLevelDelta?: number
  merchantRateDelta?: number
  forceMerchant?: boolean
  forceRentMode?: boolean
  alphaDelta?: number
}

export interface QuickEventChoice {
  id: string
  label: string
  resultText: string
  teachingPoint: string
  effect: QuickEventEffect
}

export interface QuickEvent {
  id: string
  unlockRound: number
  concept: QuickEventConcept
  requiredFeatures?: Feature[]
  title: string
  description: string
  teachingPoint: string
  choices: QuickEventChoice[]
}

export interface ResolvedQuickEvent extends QuickEvent {
  round: number
}

export interface QuickEventSelection {
  eventId: string
  choiceId: string
  title: string
  choiceLabel: string
  resultText: string
  teachingPoint: string
  effect: QuickEventEffect
}

const MILLION = 1_000_000

export const QUICK_EVENTS: QuickEvent[] = [
  {
    id: 'capital-advance-extra-materials',
    unlockRound: 1,
    concept: 'capital_formula',
    title: 'Một đơn đặt hàng vừa tới',
    description: 'Bạn có thể ứng thêm tiền để mua nguyên liệu trước khi sản xuất vòng này.',
    teachingPoint: "Tình huống này nhắc lại vận động T–H–T': tiền ứng trước chỉ có ý nghĩa tư bản nếu quay về thành số tiền lớn hơn.",
    choices: [
      {
        id: 'advance',
        label: 'Ứng thêm 60 triệu mua nguyên liệu',
        resultText: 'Bạn chuyển thêm tiền thành yếu tố sản xuất trước vòng này.',
        teachingPoint: 'Tiền T được ứng ra để mua hàng hóa phục vụ sản xuất, qua đó chuẩn bị điều kiện tạo T\'.',
        effect: { cashDelta: -60 * MILLION, materialsDelta: 60 * MILLION },
      },
      {
        id: 'hold',
        label: 'Giữ tiền mặt, sản xuất như cũ',
        resultText: 'Bạn không mở rộng phần nguyên liệu ở vòng này.',
        teachingPoint: 'Giữ tiền dưới dạng tiền mặt chưa làm nó vận động như tư bản trong sản xuất.',
        effect: { workersDelta: 2 },
      },
    ],
  },
  {
    id: 'labour-power-shift',
    unlockRound: 2,
    concept: 'labour_power',
    title: 'Một nhóm lao động lành nghề xin vào xưởng',
    description: 'Bạn cân nhắc thuê thêm lao động để mở rộng quá trình sản xuất.',
    teachingPoint: 'Sức lao động là hàng hóa đặc biệt vì khi được sử dụng, nó tạo ra giá trị mới lớn hơn giá trị bản thân nó.',
    choices: [
      {
        id: 'hire-two',
        label: 'Thuê thêm 2 công nhân',
        resultText: 'Quy mô tư bản khả biến của vòng này tăng nhẹ.',
        teachingPoint: 'Tăng lao động làm tăng V, qua đó có thể làm tăng khối lượng giá trị thặng dư M.',
        effect: { workersDelta: 1 },
      },
      {
        id: 'no-hire',
        label: 'Giữ quy mô lao động hiện tại',
        resultText: 'Bạn giữ nguyên số lao động để dễ quan sát công thức cơ bản.',
        teachingPoint: 'Giữ V ổn định giúp so sánh rõ hơn phần m do lao động tạo ra trong vòng này.',
        effect: {},
      },
    ],
  },
  {
    id: 'constant-capital-repair',
    unlockRound: 3,
    concept: 'constant_variable_capital',
    requiredFeatures: ['machines'],
    title: 'Máy móc cần bảo dưỡng nhỏ',
    description: 'Nếu chi một khoản nhỏ, máy móc giữ giá trị sử dụng tốt hơn cho vòng sản xuất.',
    teachingPoint: 'Máy móc thuộc tư bản bất biến: nó chuyển giá trị vào hàng hóa nhưng không tự tạo ra giá trị thặng dư.',
    choices: [
      {
        id: 'maintain',
        label: 'Chi 40 triệu bảo dưỡng máy',
        resultText: 'Giá trị tư bản cố định được bổ sung nhẹ.',
        teachingPoint: 'Đầu tư vào c giúp duy trì điều kiện sản xuất, nhưng nguồn m vẫn phải giải thích từ lao động sống.',
        effect: { cashDelta: -40 * MILLION, machinesDelta: 40 * MILLION },
      },
      {
        id: 'skip',
        label: 'Không bảo dưỡng thêm',
        resultText: 'Bạn giữ nguyên tư bản cố định hiện có.',
        teachingPoint: 'Không đổi c giúp thấy rõ vai trò của v và m trong vòng này.',
        effect: {},
      },
    ],
  },
  {
    id: 'materials-choice',
    unlockRound: 3,
    concept: 'surplus_value',
    requiredFeatures: ['materials'],
    title: 'Chọn lô nguyên liệu cho sản xuất',
    description: 'Có một lô nguyên liệu ổn định hơn nhưng cần ứng tiền ngay.',
    teachingPoint: 'Nguyên liệu là bộ phận c lưu động, chuyển giá trị vào sản phẩm trong vòng sản xuất.',
    choices: [
      {
        id: 'stable-lot',
        label: 'Mua thêm 80 triệu nguyên liệu',
        resultText: 'Bạn tăng tư bản lưu động để tránh thiếu đầu vào.',
        teachingPoint: 'Nguyên liệu đủ giúp quá trình tạo G = c + v + m diễn ra đầy đủ hơn.',
        effect: { cashDelta: -80 * MILLION, materialsDelta: 80 * MILLION },
      },
      {
        id: 'basic-lot',
        label: 'Dùng lượng nguyên liệu hiện có',
        resultText: 'Bạn không tăng thêm c lưu động ở vòng này.',
        teachingPoint: 'Khi c lưu động không đổi, thay đổi ở kết quả dễ quy về v và thời gian lao động hơn.',
        effect: {},
      },
    ],
  },
  {
    id: 'wage-clarification',
    unlockRound: 5,
    concept: 'wage',
    title: 'Công nhân yêu cầu ghi rõ tiền công theo quý',
    description: 'Bạn cần chọn cách xử lý tiền công trong vòng này.',
    teachingPoint: 'Tiền công là biểu hiện bằng tiền của giá trị sức lao động, không phải toàn bộ giá trị lao động tạo ra.',
    choices: [
      {
        id: 'raise-small',
        label: 'Tăng tiền công 1 triệu/người',
        resultText: 'Tư bản khả biến mỗi công nhân tăng nhẹ.',
        teachingPoint: 'Khi v tăng, cần phân biệt tiền công với phần giá trị mới lớn hơn mà lao động tạo ra.',
        effect: { wageDelta: 1 * MILLION },
      },
      {
        id: 'keep-wage',
        label: 'Giữ tiền công hiện tại',
        resultText: 'Bạn giữ nguyên v trên mỗi công nhân.',
        teachingPoint: 'Giữ v ổn định giúp quan sát trực tiếp tác động của h và t_n lên m\'.',
        effect: {},
      },
    ],
  },
  {
    id: 'urgent-delivery-hours',
    unlockRound: 7,
    concept: 'absolute_surplus_value',
    title: 'Đơn hàng cần giao sớm',
    description: 'Bạn cân nhắc tăng giờ làm trong vòng này để hoàn thành đơn hàng.',
    teachingPoint: 'Kéo dài ngày lao động khi t_n không đổi là cách minh họa giá trị thặng dư tuyệt đối.',
    choices: [
      {
        id: 'extend-hours',
        label: 'Tăng thêm 1 giờ làm/ngày',
        resultText: 'Giờ lao động của vòng này tăng nhẹ.',
        teachingPoint: 'h tăng làm phần lao động thặng dư tăng nếu thời gian lao động tất yếu không đổi.',
        effect: { hDelta: 1 },
      },
      {
        id: 'keep-hours',
        label: 'Giữ giờ làm để so sánh',
        resultText: 'Bạn giữ nguyên ngày lao động.',
        teachingPoint: 'Giữ h ổn định giúp so sánh với các cách tăng m khác như tăng năng suất.',
        effect: {},
      },
    ],
  },
  {
    id: 'workshop-flow-improvement',
    unlockRound: 8,
    concept: 'relative_surplus_value',
    requiredFeatures: ['rnd'],
    title: 'Cải tiến thao tác sản xuất',
    description: 'Một đề xuất sắp xếp lại thao tác có thể rút ngắn thời gian lao động tất yếu.',
    teachingPoint: 'Giá trị thặng dư tương đối tăng nhờ rút ngắn t_n, không nhất thiết kéo dài ngày lao động.',
    choices: [
      {
        id: 'apply-improvement',
        label: 'Chi 70 triệu để cải tiến thao tác',
        resultText: 't_n giảm nhẹ nhờ năng suất tăng.',
        teachingPoint: 't_n giảm làm m\' tăng vì tỷ lệ lao động thặng dư trong ngày lao động lớn hơn.',
        effect: { cashDelta: -70 * MILLION, tNDelta: -0.12, techLeadDelta: 0.02 },
      },
      {
        id: 'observe',
        label: 'Chưa cải tiến, quan sát thêm',
        resultText: 'Bạn giữ t_n hiện tại.',
        teachingPoint: 'Không đổi t_n giúp thấy rõ giới hạn của cách tăng m chỉ bằng kéo dài h.',
        effect: {},
      },
    ],
  },
  {
    id: 'individual-productivity-edge',
    unlockRound: 9,
    concept: 'super_surplus',
    requiredFeatures: ['rnd'],
    title: 'Một thao tác mới cho năng suất cá biệt cao hơn',
    description: 'Nếu áp dụng ngay, xưởng có thể tạm thời sản xuất với giá trị cá biệt thấp hơn mức xã hội.',
    teachingPoint: 'Giá trị thặng dư siêu ngạch xuất hiện khi giá trị cá biệt thấp hơn giá trị xã hội.',
    choices: [
      {
        id: 'apply-now',
        label: 'Áp dụng ngay cải tiến cá biệt',
        resultText: 'Lợi thế năng suất cá biệt tăng nhẹ trong vòng này.',
        teachingPoint: 'Lợi thế này chỉ tạm thời vì xã hội có thể học theo, nên siêu GTTD không bền vững mãi.',
        effect: { techLeadDelta: 0.04, cashDelta: -40 * MILLION },
      },
      {
        id: 'standard-process',
        label: 'Giữ quy trình phổ biến',
        resultText: 'Bạn không tạo lợi thế cá biệt ở vòng này.',
        teachingPoint: 'Không có chênh lệch năng suất cá biệt thì khó xuất hiện siêu GTTD.',
        effect: {},
      },
    ],
  },
  {
    id: 'circulation-route',
    unlockRound: 10,
    concept: 'turnover',
    requiredFeatures: ['logistics'],
    title: 'Sắp xếp lại tuyến lưu thông',
    description: 'Một cách tổ chức giao nhận mới có thể rút ngắn thời gian lưu thông ch.',
    teachingPoint: 'Chu chuyển nhanh hơn làm tăng số vòng n, từ đó có thể tăng khối lượng GTTD hằng năm M_năm.',
    choices: [
      {
        id: 'shorten-circulation',
        label: 'Chi 100 triệu rút ngắn lưu thông',
        resultText: 'Cấp lưu thông tăng nhẹ.',
        teachingPoint: 'ch giảm làm n = CH/ch tăng, cùng V có thể tạo M_năm lớn hơn.',
        effect: { cashDelta: -100 * MILLION, logisticsLevelDelta: 1 },
      },
      {
        id: 'keep-route',
        label: 'Giữ tuyến hiện tại',
        resultText: 'Thời gian lưu thông không đổi.',
        teachingPoint: 'Khi ch không đổi, M_năm phụ thuộc chủ yếu vào m\' và V.',
        effect: {},
      },
    ],
  },
  {
    id: 'simple-or-expanded-reproduction',
    unlockRound: 11,
    concept: 'reproduction',
    title: 'Phân chia phần giá trị thặng dư vừa thu được',
    description: 'Bạn cân nhắc giữ mức tái đầu tư hay tăng tích lũy cho vòng này.',
    teachingPoint: 'Tái sản xuất mở rộng dùng một phần m để biến thành tư bản phụ thêm.',
    choices: [
      {
        id: 'more-accumulation',
        label: 'Tăng tỷ lệ tái đầu tư thêm 5%',
        resultText: 'Tỷ lệ tích lũy của vòng này tăng nhẹ.',
        teachingPoint: 'α tăng nghĩa là phần m chuyển thành tư bản mới lớn hơn.',
        effect: { alphaDelta: 0.05 },
      },
      {
        id: 'simple-repeat',
        label: 'Giữ tỷ lệ tái đầu tư hiện tại',
        resultText: 'Bạn giữ nhịp tái sản xuất như cũ.',
        teachingPoint: 'Giữ α giúp so sánh tái sản xuất giản đơn với tái sản xuất mở rộng.',
        effect: {},
      },
    ],
  },
  {
    id: 'organic-composition-choice',
    unlockRound: 13,
    concept: 'accumulation',
    requiredFeatures: ['surplus_reveal'],
    title: 'Tăng máy hay tăng lao động?',
    description: 'Bạn có một khoản nhỏ để bổ sung cấu trúc tư bản trước vòng này.',
    teachingPoint: 'Tích lũy thường làm cấu tạo hữu cơ c/v thay đổi, đặc biệt khi c tăng nhanh hơn v.',
    choices: [
      {
        id: 'add-machine',
        label: 'Bổ sung 120 triệu máy móc',
        resultText: 'c cố định tăng, c/v có thể tăng.',
        teachingPoint: 'Khi c tăng nhanh hơn v, cấu tạo hữu cơ của tư bản tăng.',
        effect: { cashDelta: -120 * MILLION, machinesDelta: 120 * MILLION },
      },
      {
        id: 'add-materials',
        label: 'Bổ sung 120 triệu nguyên liệu',
        resultText: 'c lưu động tăng cho vòng sản xuất.',
        teachingPoint: 'Nguyên liệu vẫn thuộc c, chỉ chuyển giá trị vào sản phẩm.',
        effect: { cashDelta: -120 * MILLION, materialsDelta: 120 * MILLION },
      },
    ],
  },
  {
    id: 'cost-price-view',
    unlockRound: 14,
    concept: 'profit',
    requiredFeatures: ['surplus_reveal'],
    title: 'Nhìn kết quả theo chi phí sản xuất',
    description: 'Bạn chọn cách trình bày kết quả vòng này cho người học quan sát.',
    teachingPoint: 'Lợi nhuận là hình thức biểu hiện chuyển hóa của giá trị thặng dư khi nhìn từ chi phí k = c + v.',
    choices: [
      {
        id: 'emphasize-cost',
        label: 'Nhấn mạnh k = c + v',
        resultText: 'Bạn giữ mô hình ổn định để đọc rõ chi phí sản xuất.',
        teachingPoint: 'Khi so với k, m hiện ra dưới hình thức lợi nhuận p.',
        effect: {},
      },
      {
        id: 'save-constant-capital',
        label: 'Tiết kiệm 50 triệu tư bản bất biến',
        resultText: 'Tiền mặt tăng nhẹ nhờ tiết kiệm c trong vòng này.',
        teachingPoint: 'Tiết kiệm tư bản bất biến là một nhân tố ảnh hưởng tỷ suất lợi nhuận trong giáo trình.',
        effect: { cashDelta: 50 * MILLION },
      },
    ],
  },
  {
    id: 'merchant-channel-choice',
    unlockRound: 16,
    concept: 'merchant_capital',
    requiredFeatures: ['merchant'],
    title: 'Một thương nhân đề nghị bao tiêu hàng hóa',
    description: 'Kênh thương nghiệp giúp lưu thông nhanh hơn nhưng nhận một phần giá trị thặng dư.',
    teachingPoint: 'Lợi nhuận thương nghiệp là một phần m được phân chia cho khâu lưu thông, không phải nguồn m độc lập.',
    choices: [
      {
        id: 'use-merchant',
        label: 'Dùng kênh thương nghiệp',
        resultText: 'Lưu thông nhanh hơn nhưng chia một phần m cho thương nghiệp.',
        teachingPoint: 'Đây là cách minh họa p_tn: thương nghiệp nhận một phần giá trị thặng dư đã được tạo ra trong sản xuất.',
        effect: { forceMerchant: true, merchantRateDelta: 0.01 },
      },
      {
        id: 'direct-sale',
        label: 'Tự tổ chức lưu thông',
        resultText: 'Bạn không chia thêm phần thương nghiệp ở vòng này.',
        teachingPoint: 'Không dùng thương nghiệp giúp giữ lại phần m, nhưng không có lợi ích rút ngắn lưu thông.',
        effect: {},
      },
    ],
  },
  {
    id: 'borrow-for-materials',
    unlockRound: 17,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Cần vốn tiền tệ để mua nguyên liệu',
    description: 'Bạn có thể vay một khoản nhỏ, sau đó phải trả lợi tức theo lãi suất hiện hành.',
    teachingPoint: 'Lợi tức là một phần lợi nhuận bình quân chuyển cho người sở hữu tư bản cho vay.',
    choices: [
      {
        id: 'borrow',
        label: 'Vay 150 triệu mua nguyên liệu',
        resultText: 'Nợ tăng, nguyên liệu cũng tăng trước vòng sản xuất.',
        teachingPoint: 'Khoản vay không tự tạo m; nó chỉ cấp hình thái tiền tệ để mở rộng điều kiện sản xuất và sau đó đòi một phần lợi nhuận dưới dạng lợi tức.',
        effect: { debtDelta: 150 * MILLION, materialsDelta: 150 * MILLION },
      },
      {
        id: 'avoid-borrowing',
        label: 'Không vay thêm',
        resultText: 'Bạn không làm tăng nghĩa vụ lợi tức.',
        teachingPoint: 'Không vay giúp thấy rõ phần m không bị phân chia thêm cho lợi tức.',
        effect: {},
      },
    ],
  },
  {
    id: 'lend-idle-money',
    unlockRound: 17,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Có một phần tiền tạm thời nhàn rỗi',
    description: 'Bạn có thể cho vay một khoản nhỏ để quan sát lợi tức ở chiều ngược lại.',
    teachingPoint: 'Tư bản cho vay tách quyền sở hữu và quyền sử dụng, lợi tức là giá của quyền sử dụng tư bản tiền tệ.',
    choices: [
      {
        id: 'lend',
        label: 'Cho vay 100 triệu',
        resultText: 'Tiền mặt giảm, khoản cho vay tăng.',
        teachingPoint: 'Lãi nhận được vẫn cần được hiểu là một phần giá trị thặng dư trong nền sản xuất.',
        effect: { cashDelta: -100 * MILLION, lendingDelta: 100 * MILLION },
      },
      {
        id: 'keep-cash',
        label: 'Giữ tiền mặt',
        resultText: 'Bạn không tham gia quan hệ tư bản cho vay ở vòng này.',
        teachingPoint: 'Tiền nằm yên không tự sinh giá trị mới nếu không đi vào quan hệ sản xuất và phân chia m.',
        effect: {},
      },
    ],
  },
  {
    id: 'rent-land-choice',
    unlockRound: 18,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Cần thêm mặt bằng sản xuất',
    description: 'Bạn cân nhắc thuê đất cho vòng cuối để quan sát địa tô trong phân phối m.',
    teachingPoint: 'Địa tô là phần giá trị thặng dư chuyển cho chủ sở hữu đất.',
    choices: [
      {
        id: 'rent',
        label: 'Thuê thêm đất cho vòng này',
        resultText: 'Chi địa tô có thể xuất hiện trong dòng chảy khối m.',
        teachingPoint: 'Khi thuê đất, một phần m được phân chia thành R - địa tô.',
        effect: { forceRentMode: true },
      },
      {
        id: 'no-rent',
        label: 'Không thuê thêm',
        resultText: 'Bạn không phát sinh thêm địa tô ở vòng này.',
        teachingPoint: 'Không thuê đất giúp so sánh phần m trước và sau khi có R trong dòng phân phối.',
        effect: {},
      },
    ],
  },
  {
    id: 'land-price-formula',
    unlockRound: 18,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Tính giá đất từ địa tô',
    description: 'Bạn có thể mua một đơn vị đất để thấy công thức địa tô tư bản hóa.',
    teachingPoint: 'Giá đất trong giáo trình được giải thích bằng địa tô chia cho tỷ suất lợi tức ngân hàng.',
    choices: [
      {
        id: 'buy-one',
        label: 'Mua 1 đơn vị đất nếu đủ tiền',
        resultText: 'Đất sở hữu tăng nếu tiền mặt đủ chi trả.',
        teachingPoint: 'Mua đất minh họa việc vốn hóa địa tô thành giá đất.',
        effect: { landUnitsDelta: 1 },
      },
      {
        id: 'calculate-only',
        label: 'Chỉ quan sát công thức',
        resultText: 'Bạn không mua đất ở vòng này.',
        teachingPoint: 'Quan sát công thức cũng đủ thấy giá đất không phải giá trị tự sinh độc lập.',
        effect: {},
      },
    ],
  },
  {
    id: 'mass-of-surplus-workers',
    unlockRound: 6,
    concept: 'surplus_value',
    title: 'Tăng quy mô lao động để quan sát M',
    description: 'Một ca sản xuất có thể nhận thêm công nhân trong vòng này.',
    teachingPoint: 'Khối lượng giá trị thặng dư M phụ thuộc vào m\' và tổng tư bản khả biến V.',
    choices: [
      {
        id: 'add-workers',
        label: 'Nhận thêm 1 công nhân',
        resultText: 'Quy mô lao động tăng nhẹ trong vòng này.',
        teachingPoint: 'Khi V tăng, M có thể tăng dù m\' không đổi.',
        effect: {},
      },
      {
        id: 'same-workers',
        label: 'Giữ số công nhân',
        resultText: 'Bạn giữ V ổn định để quan sát m\'.',
        teachingPoint: 'Giữ V ổn định giúp phân biệt m\' với M.',
        effect: {},
      },
    ],
  },
  {
    id: 'materials-shortfall',
    unlockRound: 4,
    concept: 'surplus_value',
    requiredFeatures: ['materials'],
    title: 'Nguyên liệu chỉ vừa đủ cho kế hoạch',
    description: 'Bạn có thể bổ sung một lượng nhỏ để quá trình sản xuất ít bị gián đoạn.',
    teachingPoint: 'Thiếu c lưu động có thể làm quá trình sản xuất không diễn ra đầy đủ, dù nguồn gốc m vẫn là lao động.',
    choices: [
      {
        id: 'top-up',
        label: 'Bổ sung 50 triệu nguyên liệu',
        resultText: 'Tư bản lưu động tăng nhẹ.',
        teachingPoint: 'c lưu động là điều kiện vật chất để lao động tạo giá trị mới trong sản phẩm.',
        effect: { cashDelta: -50 * MILLION, materialsDelta: 50 * MILLION },
      },
      {
        id: 'continue',
        label: 'Không bổ sung',
        resultText: 'Bạn giữ nguyên lượng c lưu động.',
        teachingPoint: 'Nếu đầu vào vật chất hạn chế, sản xuất có thể không biểu hiện đầy đủ giá trị mới.',
        effect: {},
      },
    ],
  },
  {
    id: 'turnover-or-scale',
    unlockRound: 10,
    concept: 'turnover',
    requiredFeatures: ['logistics'],
    title: 'Tăng tốc chu chuyển hay tăng dự trữ?',
    description: 'Bạn có thể chi một khoản nhỏ cho lưu thông hoặc cho nguyên liệu.',
    teachingPoint: 'Chu chuyển tư bản nhấn mạnh tốc độ quay vòng, không chỉ quy mô ứng trước.',
    choices: [
      {
        id: 'turnover',
        label: 'Chi cho rút ngắn lưu thông',
        resultText: 'Cấp lưu thông tăng nhẹ.',
        teachingPoint: 'Tăng n có thể làm M_năm tăng mà không nhất thiết tăng cùng tỷ lệ vốn ứng trước.',
        effect: { cashDelta: -80 * MILLION, logisticsLevelDelta: 1 },
      },
      {
        id: 'stock',
        label: 'Chi cho nguyên liệu',
        resultText: 'Tư bản lưu động tăng.',
        teachingPoint: 'Tăng c lưu động là tăng điều kiện sản xuất, khác với rút ngắn ch.',
        effect: { cashDelta: -80 * MILLION, materialsDelta: 80 * MILLION },
      },
    ],
  },
  {
    id: 'average-profit-view',
    unlockRound: 15,
    concept: 'profit',
    requiredFeatures: ['surplus_reveal'],
    title: 'So sánh p\' với P̄',
    description: 'Bạn xem p\' cá biệt của mình bên cạnh tỷ suất lợi nhuận bình quân P̄.',
    teachingPoint: 'Cạnh tranh làm xuất hiện xu hướng hình thành lợi nhuận bình quân giữa các ngành.',
    choices: [
      {
        id: 'read-chart',
        label: 'Đọc biểu đồ p\' và P̄',
        resultText: 'Bạn tập trung quan sát sự khác biệt giữa p\' cá biệt và P̄.',
        teachingPoint: 'p\' là cách lợi nhuận biểu hiện so với toàn bộ tư bản ứng trước.',
        effect: {},
      },
      {
        id: 'save-c',
        label: 'Tiết kiệm 40 triệu chi phí c',
        resultText: 'Tiền mặt tăng nhẹ nhờ tiết kiệm tư bản bất biến.',
        teachingPoint: 'Tiết kiệm c là một nhân tố có thể ảnh hưởng p\'.',
        effect: { cashDelta: 40 * MILLION },
      },
    ],
  },
  {
    id: 'accumulation-ratio',
    unlockRound: 12,
    concept: 'accumulation',
    title: 'Chọn tỷ lệ tích lũy trong phần m',
    description: 'Bạn cân nhắc tăng nhẹ phần giá trị thặng dư chuyển thành tư bản mới.',
    teachingPoint: 'Quy mô tích lũy phụ thuộc tỷ lệ phân chia m cho tích lũy và tiêu dùng.',
    choices: [
      {
        id: 'increase-alpha',
        label: 'Tăng α thêm 3%',
        resultText: 'Phần m dùng để tích lũy tăng nhẹ.',
        teachingPoint: 'α cao hơn nghĩa là tái sản xuất mở rộng mạnh hơn.',
        effect: { alphaDelta: 0.03 },
      },
      {
        id: 'keep-alpha',
        label: 'Giữ α hiện tại',
        resultText: 'Tỷ lệ phân chia m không đổi.',
        teachingPoint: 'Giữ α giúp quan sát các nhân tố khác của quy mô tích lũy.',
        effect: {},
      },
    ],
  },
  {
    id: 'necessary-labour-time-check',
    unlockRound: 8,
    concept: 'relative_surplus_value',
    requiredFeatures: ['rnd'],
    title: 'Đo lại thời gian lao động tất yếu',
    description: 'Bạn có thể dành một khoản nhỏ để chuẩn hóa thao tác và đo lại t_n trong xưởng.',
    teachingPoint: 't_n là mốc để phân biệt lao động tất yếu và lao động thặng dư trong ngày lao động.',
    choices: [
      {
        id: 'measure-and-standardize',
        label: 'Chi 45 triệu chuẩn hóa thao tác',
        resultText: 't_n giảm rất nhẹ nhờ thao tác ổn định hơn.',
        teachingPoint: 'Khi t_n giảm, phần thời gian lao động thặng dư tăng ngay cả khi h không đổi.',
        effect: { cashDelta: -45 * MILLION, tNDelta: -0.06 },
      },
      {
        id: 'skip-measure',
        label: 'Giữ cách làm hiện tại',
        resultText: 'Bạn chưa thay đổi t_n ở vòng này.',
        teachingPoint: 'Không đổi t_n giúp so sánh rõ phương pháp GTTD tuyệt đối và tương đối.',
        effect: {},
      },
    ],
  },
  {
    id: 'rent-or-interest-comparison',
    unlockRound: 18,
    concept: 'rent',
    requiredFeatures: ['rent', 'interest'],
    title: 'So sánh địa tô và lợi tức',
    description: 'Bạn xem cùng lúc chi phí thuê đất và lãi suất ngân hàng để giải thích giá đất.',
    teachingPoint: 'Công thức giá đất nối địa tô với tỷ suất lợi tức ngân hàng, giúp thấy giá đất là địa tô tư bản hóa.',
    choices: [
      {
        id: 'rent-one-unit',
        label: 'Thuê đất để thấy R trong phân phối m',
        resultText: 'Vòng này ưu tiên quan sát địa tô trong dòng chảy khối m.',
        teachingPoint: 'R là phần m chuyển cho chủ sở hữu đất, khác với z là lợi tức của tư bản cho vay.',
        effect: { forceRentMode: true },
      },
      {
        id: 'compare-formula',
        label: 'Chỉ so sánh công thức R / i',
        resultText: 'Bạn không đổi biến, chỉ tập trung đọc công thức.',
        teachingPoint: 'Giá đất = địa tô / tỷ suất lợi tức ngân hàng là cách giáo trình giải thích giá đất.',
        effect: {},
      },
    ],
  },]

export function makeEventSeed(playerName: string, initialCapital: number): string {
  return `${playerName.trim().toLowerCase()}::${initialCapital}`
}

function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededUnit(seed: string): number {
  return hashString(seed) / 0xffffffff
}

function hasRequiredFeatures(event: QuickEvent, features: Feature[]): boolean {
  return (event.requiredFeatures ?? []).every((feature) => features.includes(feature))
}

export function getQuickEventForRound(
  seed: string,
  round: number,
  unlockedFeatures: Feature[],
  history: HistoryEntry[],
  options: { forceEvent?: boolean } = {},
): ResolvedQuickEvent | undefined {
  const usedIds = new Set(history.map((entry) => entry.event?.id).filter(Boolean))
  const eligible = QUICK_EVENTS.filter((event) => (
    event.unlockRound <= round &&
    hasRequiredFeatures(event, unlockedFeatures) &&
    !usedIds.has(event.id)
  ))

  if (eligible.length === 0) return undefined
  if (!options.forceEvent && seededUnit(`${seed}::chance::${round}`) >= 0.45) return undefined

  const index = Math.floor(seededUnit(`${seed}::pick::${round}`) * eligible.length) % eligible.length
  return { ...eligible[index], round }
}

export function getQuickEventChoice(event: QuickEvent, choiceId: string): QuickEventChoice | undefined {
  return event.choices.find((choice) => choice.id === choiceId)
}

