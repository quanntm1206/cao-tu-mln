import type { Feature, HistoryEntry } from '../store/gameStore'

export const FORBIDDEN_QUICK_EVENT_TERMS = [
  'tư bản đảo',
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
  round: number
  eventId: string
  choiceId: string
  title: string
  choiceLabel: string
  resultText: string
  teachingPoint: string
  effect: QuickEventEffect
  forcedByTeacher?: boolean
}

const M = 1_000_000

export const QUICK_EVENTS: QuickEvent[] = [
  // ── Pha 1: Tư bản công nghiệp (vòng 1-4) ──────────────────────────────────
  {
    id: 'import-materials-cheap',
    unlockRound: 1,
    concept: 'reproduction',
    title: 'Nguyên liệu nhập khẩu giá ưu đãi',
    description: 'Một lô nguyên liệu nhập khẩu với giá thấp hơn 15% so với thị trường nội địa vừa về cảng.',
    teachingPoint: 'Nguyên liệu là tư bản bất biến lưu động; mua được giá tốt trực tiếp giảm chi phí sản xuất k.',
    choices: [
      {
        id: 'buy-batch',
        label: 'Mua lô hàng 80 triệu đồng',
        resultText: 'Bạn nhập thêm nguyên liệu giá tốt, tăng dự trữ đầu vào sản xuất.',
        teachingPoint: "Tư bản bất biến được tái tạo ở mức chi phí thấp hơn, cải thiện tỷ suất lợi nhuận p'.",
        effect: { cashDelta: -80 * M, materialsDelta: 80 * M },
      },
      {
        id: 'hold-cash',
        label: 'Giữ tiền mặt, tiếp tục như cũ',
        resultText: 'Bạn không mở rộng dự trữ nguyên liệu vòng này.',
        teachingPoint: 'Tiền nhàn rỗi không tham gia sản xuất không tạo ra giá trị thặng dư mới.',
        effect: {},
      },
    ],
  },
  {
    id: 'machinery-upgrade',
    unlockRound: 1,
    concept: 'profit',
    requiredFeatures: ['machines'],
    title: 'Cơ hội nâng cấp máy móc giá tốt',
    description: 'Một doanh nghiệp giải thể đang thanh lý máy móc ngành cơ khí với giá thấp hơn 20% thị trường.',
    teachingPoint: 'Tư bản cố định (máy móc) là tư bản bất biến; đầu tư đúng thời điểm giảm chi phí khấu hao tính trên đơn vị sản phẩm.',
    choices: [
      {
        id: 'buy-machines',
        label: 'Mua máy móc 100 triệu đồng',
        resultText: 'Bạn tăng tư bản cố định, nâng cao năng lực sản xuất dài hạn.',
        teachingPoint: 'Máy móc (c) chuyển giá trị của mình dần vào sản phẩm qua khấu hao — KHÔNG tự tạo thêm giá trị thặng dư m mới. Chỉ lao động sống (v) mới tạo ra m.',
        effect: { cashDelta: -100 * M, machinesDelta: 100 * M },
      },
      {
        id: 'skip-upgrade',
        label: 'Không mua, giữ nguyên trang thiết bị',
        resultText: 'Bạn quan sát năng lực sản xuất với tư bản cố định hiện tại.',
        teachingPoint: "Tư bản cố định không đổi giúp theo dõi tác động riêng lẻ của các yếu tố khác lên p'.",
        effect: {},
      },
    ],
  },
  {
    id: 'export-order-boom',
    unlockRound: 2,
    concept: 'profit',
    title: 'Đơn hàng xuất khẩu lớn bất ngờ',
    description: 'Đối tác nước ngoài đặt đơn hàng khẩn, trả trước 120 triệu đồng tiền đặt cọc ngay hôm nay.',
    teachingPoint: 'Doanh thu từ thị trường xuất khẩu phản ánh quá trình thực hiện giá trị hàng hóa trên quy mô quốc tế.',
    choices: [
      {
        id: 'accept-order',
        label: 'Nhận đơn, nhận cọc 120 triệu đồng',
        resultText: 'Tiền mặt tăng nhờ đặt cọc xuất khẩu, sản xuất cần tăng tốc.',
        teachingPoint: 'Khi hàng hóa được bán ra, giá trị thặng dư được thực hiện dưới dạng lợi nhuận tiền tệ.',
        effect: { cashDelta: 120 * M },
      },
      {
        id: 'decline-focus',
        label: 'Từ chối, tập trung tích lũy nội bộ',
        resultText: 'Bạn không nhận đơn ngoài, ưu tiên tái đầu tư lợi nhuận.',
        teachingPoint: 'Tái đầu tư thay vì thực hiện lợi nhuận ngay phản ánh chiến lược tích lũy mở rộng quy mô tư bản.',
        effect: { alphaDelta: 0.04 },
      },
    ],
  },
  {
    id: 'power-outage',
    unlockRound: 2,
    concept: 'reproduction',
    title: 'Cắt điện đột xuất khu công nghiệp',
    description: 'Lưới điện khu vực mất ổn định, sản xuất có thể bị gián đoạn nếu không có nguồn dự phòng.',
    teachingPoint: 'Điện là điều kiện vật chất cho sản xuất; gián đoạn chuỗi cung ứng tác động đến toàn bộ quá trình tạo ra giá trị mới.',
    choices: [
      {
        id: 'buy-generator',
        label: 'Mua máy phát dự phòng 50 triệu đồng',
        resultText: 'Bạn đảm bảo liên tục sản xuất bằng nguồn điện dự phòng.',
        teachingPoint: 'Đầu tư vào điều kiện hạ tầng sản xuất là một phần của tư bản cố định, duy trì quá trình tạo ra m.',
        effect: { cashDelta: -50 * M, machinesDelta: 50 * M },
      },
      {
        id: 'accept-downtime',
        label: 'Chấp nhận giảm sản lượng vòng này',
        resultText: 'Sản xuất giảm nhẹ do điện không ổn định.',
        teachingPoint: 'Điều kiện vật chất không đủ làm cho tư bản lưu động không được sử dụng triệt để, giảm tổng m.',
        effect: { materialsDelta: -20 * M },
      },
    ],
  },
  {
    id: 'supply-disruption',
    unlockRound: 3,
    concept: 'reproduction',
    requiredFeatures: ['materials'],
    title: 'Chuỗi cung ứng nguyên liệu gián đoạn',
    description: 'Nhà cung cấp chính thông báo chậm giao hàng 3 tuần do vấn đề vận chuyển quốc tế.',
    teachingPoint: 'Đứt gãy chuỗi cung ứng làm thiếu tư bản bất biến lưu động, tác động trực tiếp đến quá trình sản xuất.',
    choices: [
      {
        id: 'buy-reserve',
        label: 'Mua dự trữ khẩn 60 triệu từ nguồn khác',
        resultText: 'Bạn đảm bảo nguyên liệu cho sản xuất từ nguồn cung thay thế.',
        teachingPoint: 'Dự trữ tư bản bất biến lưu động là đệm an toàn cho tái sản xuất liên tục.',
        effect: { cashDelta: -60 * M, materialsDelta: 60 * M },
      },
      {
        id: 'wait-supplier',
        label: 'Chờ nhà cung cấp, giảm nhẹ sản xuất',
        resultText: 'Sản xuất vòng này bị ảnh hưởng do thiếu nguyên liệu đầu vào.',
        teachingPoint: "Thiếu điều kiện vật chất làm chu trình T → H → T' bị ngắt quãng tại khâu sản xuất.",
        effect: { materialsDelta: -40 * M },
      },
    ],
  },
  {
    id: 'industrial-fair',
    unlockRound: 3,
    concept: 'accumulation',
    title: 'Hội chợ triển lãm công nghiệp cơ khí',
    description: 'Hội chợ công nghiệp quốc tế khai mạc tại Hà Nội, cơ hội kết nối đối tác và tìm hiểu công nghệ.',
    teachingPoint: 'Triển lãm hỗ trợ kết nối và thực hiện giá trị hàng hóa — không tạo ra m mới. Chỉ lao động sống trong sản xuất mới tạo ra giá trị thặng dư.',
    choices: [
      {
        id: 'attend-fair',
        label: 'Tham gia hội chợ, chi 30 triệu đồng',
        resultText: 'Bạn kết nối với đối tác tiềm năng và nắm bắt xu hướng ngành.',
        teachingPoint: 'Đầu tư vào quan hệ thương mại và thông tin có thể tăng tỷ lệ tích lũy dài hạn.',
        effect: { cashDelta: -30 * M, alphaDelta: 0.03 },
      },
      {
        id: 'skip-fair',
        label: 'Không tham gia, tiết kiệm chi phí',
        resultText: 'Bạn tập trung vào sản xuất nội bộ vòng này.',
        teachingPoint: 'Giữ nguyên tỷ lệ tích lũy giúp quan sát tác động thuần túy của các yếu tố sản xuất.',
        effect: {},
      },
    ],
  },
  {
    id: 'competitor-expansion',
    unlockRound: 4,
    concept: 'accumulation',
    title: 'Đối thủ mở rộng quy mô sản xuất',
    description: 'Doanh nghiệp cạnh tranh trong ngành vừa tăng vốn và mở thêm xưởng sản xuất mới.',
    teachingPoint: 'Cạnh tranh buộc các tư bản riêng lẻ phải tích lũy và mở rộng quy mô để duy trì vị thế trên thị trường.',
    choices: [
      {
        id: 'increase-reinvest',
        label: 'Tăng tích lũy tư bản thêm 5%',
        resultText: 'Bạn gia tăng tỷ lệ lợi nhuận dùng để tái đầu tư mở rộng sản xuất.',
        teachingPoint: 'Tích lũy tư bản là điều kiện tất yếu để duy trì và mở rộng quá trình sản xuất trong cạnh tranh.',
        effect: { alphaDelta: 0.05 },
      },
      {
        id: 'observe-market',
        label: 'Quan sát thêm trước khi quyết định',
        resultText: 'Bạn giữ nguyên tỷ lệ tích lũy và theo dõi động thái đối thủ.',
        teachingPoint: 'Quan sát cạnh tranh giúp hiểu cơ chế bình quân hóa tỷ suất lợi nhuận giữa các tư bản cạnh tranh.',
        effect: {},
      },
    ],
  },
  {
    id: 'raw-material-spike',
    unlockRound: 4,
    concept: 'reproduction',
    requiredFeatures: ['materials'],
    title: 'Giá nguyên liệu đầu vào tăng đột biến',
    description: 'Giá thép và nhôm tăng 20% do căng thẳng thương mại quốc tế. Chi phí sản xuất sẽ tăng vòng tới.',
    teachingPoint: "Biến động giá tư bản bất biến tác động trực tiếp đến chi phí sản xuất k và tỷ suất lợi nhuận p'.",
    choices: [
      {
        id: 'stockpile',
        label: 'Mua trữ nguyên liệu 90 triệu trước khi tăng',
        resultText: 'Bạn dự trữ nguyên liệu với giá thấp hơn để sản xuất vòng sau.',
        teachingPoint: "Dự trữ đầu vào khi giá còn thấp là cách bảo vệ tỷ suất lợi nhuận trước biến động chi phí c.",
        effect: { cashDelta: -90 * M, materialsDelta: 90 * M },
      },
      {
        id: 'no-stockpile',
        label: 'Không tích trữ, chấp nhận giá mới',
        resultText: 'Bạn tiếp tục với lượng nguyên liệu hiện có và chấp nhận chi phí cao hơn.',
        teachingPoint: "Không dự trữ cho thấy tác động trực tiếp của tăng chi phí c lên k và p'.",
        effect: {},
      },
    ],
  },

  // ── Pha 2: Tư bản thương nghiệp (vòng 5-8) ────────────────────────────────
  {
    id: 'merchant-contract-offer',
    unlockRound: 5,
    concept: 'merchant_capital',
    requiredFeatures: ['merchant'],
    title: 'Thương nhân đề xuất hợp đồng phân phối',
    description: 'Một hệ thống phân phối lớn đề nghị bán hàng của bạn trên toàn quốc với chiết khấu thương mại 12%.',
    teachingPoint: 'Tư bản thương nghiệp đảm nhận khâu lưu thông, đổi lại nhận một phần giá trị thặng dư dưới dạng lợi nhuận thương nghiệp.',
    choices: [
      {
        id: 'sign-contract',
        label: 'Ký hợp đồng, chiết khấu 12%',
        resultText: 'Bạn tiếp cận thị trường rộng hơn nhờ kênh phân phối chuyên nghiệp.',
        teachingPoint: 'Phần m chuyển cho thương nhân là giá phải trả để tăng tốc độ thực hiện giá trị hàng hóa.',
        effect: { forceMerchant: true, merchantRateDelta: -0.02 },
      },
      {
        id: 'self-distribute',
        label: 'Tự phân phối, không chia sẻ lợi nhuận',
        resultText: 'Bạn giữ toàn bộ phần m nhưng chịu chi phí lưu thông tự quản lý.',
        teachingPoint: 'Tự phân phối giúp giữ lại toàn bộ giá trị thặng dư nhưng tốn tư bản và thời gian lưu thông.',
        effect: {},
      },
    ],
  },
  {
    id: 'trade-fair-international',
    unlockRound: 5,
    concept: 'merchant_capital',
    requiredFeatures: ['merchant'],
    title: 'Hội chợ thương mại quốc tế tại TP.HCM',
    description: 'Hội chợ mở ra cơ hội ký kết hợp đồng bán hàng với đối tác nước ngoài, doanh thu dự kiến tăng.',
    teachingPoint: 'Hội chợ thương mại hỗ trợ LƯU THÔNG và THỰC HIỆN giá trị hàng hóa — không TẠO RA giá trị thặng dư m mới. M chỉ sinh ra trong quá trình sản xuất (v × m′).',
    choices: [
      {
        id: 'exhibit',
        label: 'Tham gia triển lãm, thu về 80 triệu',
        resultText: 'Bạn ký được hợp đồng mới với đối tác quốc tế.',
        teachingPoint: "Lưu thông hàng hóa quốc tế là giai đoạn H' - T' trong chu kỳ tư bản công nghiệp.",
        effect: { cashDelta: 80 * M },
      },
      {
        id: 'skip-fair',
        label: 'Không tham gia, tiết kiệm chi phí đi lại',
        resultText: 'Bạn không mở rộng kênh thương mại quốc tế vòng này.',
        teachingPoint: 'Bỏ qua cơ hội lưu thông quốc tế có thể làm chậm quá trình thực hiện giá trị thặng dư.',
        effect: {},
      },
    ],
  },
  {
    id: 'online-retail-channel',
    unlockRound: 6,
    concept: 'merchant_capital',
    requiredFeatures: ['merchant'],
    title: 'Mở kênh bán lẻ trực tuyến',
    description: 'Nền tảng thương mại điện tử đề xuất hợp tác, phí chiết khấu chỉ 8%, thấp hơn kênh truyền thống.',
    teachingPoint: 'Kênh phân phối điện tử rút ngắn thời gian lưu thông, làm tăng tốc độ chu chuyển tư bản.',
    choices: [
      {
        id: 'join-platform',
        label: 'Mở kênh online, đầu tư 40 triệu phí vận hành',
        resultText: 'Bạn tiếp cận khách hàng trực tuyến với chi phí phân phối thấp hơn.',
        teachingPoint: 'Giảm tỷ lệ chiết khấu cho thương nhân đồng nghĩa giữ lại phần lớn m hơn sau phân phối.',
        effect: { cashDelta: -40 * M, merchantRateDelta: -0.02 },
      },
      {
        id: 'keep-traditional',
        label: 'Giữ kênh phân phối truyền thống',
        resultText: 'Bạn tiếp tục với kênh thương mại hiện tại.',
        teachingPoint: 'Kênh truyền thống có chi phí chiết khấu cao hơn nhưng quen thuộc và ổn định hơn.',
        effect: {},
      },
    ],
  },
  {
    id: 'distributor-demands-discount',
    unlockRound: 6,
    concept: 'merchant_capital',
    requiredFeatures: ['merchant'],
    title: 'Nhà phân phối yêu cầu tăng chiết khấu',
    description: 'Đối tác phân phối lớn đòi tăng chiết khấu thêm 2% hoặc sẽ chuyển sang hàng đối thủ.',
    teachingPoint: 'Tương quan lực lượng giữa nhà sản xuất và thương nhân quyết định cách phân chia giá trị thặng dư.',
    choices: [
      {
        id: 'grant-discount',
        label: 'Đồng ý tăng chiết khấu thêm 2%',
        resultText: 'Bạn nhượng thêm phần m cho thương nhân để giữ kênh phân phối.',
        teachingPoint: 'Phần m nhượng cho thương nhân tăng lên khi thương nhân có ưu thế đàm phán lớn hơn.',
        effect: { merchantRateDelta: 0.02 },
      },
      {
        id: 'refuse-discount',
        label: 'Không đồng ý, tìm đối tác phân phối mới',
        resultText: 'Bạn từ chối và tìm kiếm kênh phân phối thay thế.',
        teachingPoint: 'Chủ động đa dạng hóa kênh phân phối giảm phụ thuộc vào một thương nhân duy nhất.',
        effect: { cashDelta: -20 * M },
      },
    ],
  },
  {
    id: 'market-share-battle',
    unlockRound: 7,
    concept: 'profit',
    requiredFeatures: ['merchant'],
    title: 'Cạnh tranh quyết liệt giành thị phần',
    description: 'Doanh nghiệp cùng ngành hạ giá bán 10% để giành thị phần. Bạn phải quyết định chiến lược.',
    teachingPoint: "Cạnh tranh về giá là biểu hiện của quá trình bình quân hóa tỷ suất lợi nhuận giữa các tư bản.",
    choices: [
      {
        id: 'lower-price',
        label: 'Hạ giá theo để giữ thị phần, chi 50 triệu marketing',
        resultText: 'Bạn chấp nhận giảm biên lợi nhuận để bảo vệ thị phần.',
        teachingPoint: "Cạnh tranh về giá làm cho tỷ suất lợi nhuận cá biệt hội tụ về mức bình quân ngành.",
        effect: { cashDelta: -50 * M },
      },
      {
        id: 'hold-price',
        label: 'Giữ nguyên giá, tập trung vào chất lượng',
        resultText: 'Bạn không tham gia cuộc chiến giá, ưu tiên biên lợi nhuận.',
        teachingPoint: 'Giữ nguyên giá bán phản ánh chiến lược duy trì phần m trên mỗi đơn vị sản phẩm.',
        effect: { alphaDelta: 0.02 },
      },
    ],
  },
  {
    id: 'distribution-investment',
    unlockRound: 8,
    concept: 'accumulation',
    requiredFeatures: ['merchant'],
    title: 'Đầu tư mở rộng hệ thống phân phối',
    description: 'Có cơ hội góp vốn vào công ty phân phối, hưởng lợi nhuận thương nghiệp ổn định dài hạn.',
    teachingPoint: 'Đầu tư vào tư bản thương nghiệp là một hình thức tích lũy, giúp thu được phần lợi nhuận từ khâu lưu thông.',
    choices: [
      {
        id: 'invest-distribution',
        label: 'Góp 80 triệu, tăng tỷ lệ tích lũy',
        resultText: 'Bạn mở rộng sang lĩnh vực phân phối, đa dạng hóa nguồn lợi nhuận.',
        teachingPoint: 'Tích lũy vào tư bản thương nghiệp thể hiện sự chuyển dịch từ lợi nhuận công nghiệp sang lợi nhuận thương nghiệp.',
        effect: { cashDelta: -80 * M, alphaDelta: 0.04 },
      },
      {
        id: 'focus-production',
        label: 'Không góp vốn, tập trung sản xuất',
        resultText: 'Bạn tiếp tục với mô hình hiện tại, không mở rộng thương mại.',
        teachingPoint: 'Giữ nguyên cơ cấu tư bản giúp quan sát rõ vai trò riêng biệt của sản xuất và lưu thông.',
        effect: {},
      },
    ],
  },

  // ── Pha 3: Tư bản tài chính (vòng 9-12) ───────────────────────────────────
  {
    id: 'rate-hike-shock',
    unlockRound: 9,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Ngân hàng Nhà nước tăng lãi suất điều hành',
    description: 'Lãi suất tái cấp vốn tăng 0,5 điểm phần trăm, chi phí vốn vay thương mại sẽ tăng theo.',
    teachingPoint: 'Lãi suất là giá của tư bản cho vay; tăng lãi suất làm tăng chi phí tài chính và giảm phần lợi nhuận giữ lại.',
    choices: [
      {
        id: 'borrow-now',
        label: 'Vay thêm 200 triệu trước khi lãi tăng',
        resultText: 'Bạn huy động vốn vay với lãi suất hiện tại trước khi điều chỉnh.',
        teachingPoint: 'Vay trước khi lãi tăng là hành vi tối ưu hóa chi phí tư bản cho vay z.',
        effect: { debtDelta: 200 * M, cashDelta: 200 * M },
      },
      {
        id: 'no-new-debt',
        label: 'Không vay thêm, giảm phụ thuộc tín dụng',
        resultText: 'Bạn chọn ít nợ hơn để tránh chi phí lãi suất cao.',
        teachingPoint: 'Giảm nợ làm giảm z phải trả, bảo vệ phần m còn lại sau phân phối.',
        effect: {},
      },
    ],
  },
  {
    id: 'credit-support-package',
    unlockRound: 9,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Gói hỗ trợ tín dụng ưu đãi từ ngân hàng nhà nước',
    description: 'Ngân hàng chính sách triển khai gói vay sản xuất với lãi suất ưu đãi 2% trong 12 tháng.',
    teachingPoint: 'Tín dụng ưu đãi là hình thức phân phối lại giá trị thặng dư qua kênh tài chính của nhà nước.',
    choices: [
      {
        id: 'take-preferential-loan',
        label: 'Vay ưu đãi 150 triệu đồng',
        resultText: 'Bạn tiếp cận nguồn vốn rẻ, giảm chi phí tài chính z.',
        teachingPoint: 'Lãi suất ưu đãi thấp hơn lãi suất thị trường phản ánh sự can thiệp của nhà nước vào phân phối z.',
        effect: { cashDelta: 150 * M, debtDelta: 150 * M },
      },
      {
        id: 'no-loan',
        label: 'Không vay, tự chủ tài chính',
        resultText: 'Bạn giữ nguyên cơ cấu vốn không có nợ vay ưu đãi.',
        teachingPoint: 'Không vay giúp so sánh tỷ suất lợi nhuận khi không có đòn bẩy tài chính.',
        effect: {},
      },
    ],
  },
  {
    id: 'private-fund-opportunity',
    unlockRound: 10,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Quỹ đầu tư tư nhân tìm kiếm đối tác cho vay',
    description: 'Một quỹ tư nhân muốn vay 100 triệu đồng trong 6 tháng với lãi suất 9%/năm.',
    teachingPoint: 'Cho vay là hình thức tư bản hóa tiền tệ nhàn rỗi; lãi suất thu về là phần m mà tư bản cho vay chiếm đoạt.',
    choices: [
      {
        id: 'lend-fund',
        label: 'Cho quỹ vay 100 triệu đồng',
        resultText: 'Bạn chuyển tiền nhàn rỗi thành tư bản cho vay, hưởng lãi suất 9%/năm.',
        teachingPoint: 'Lãi suất z = phần m mà tư bản cho vay thu được từ quá trình sản xuất qua trung gian tài chính.',
        effect: { lendingDelta: 100 * M, cashDelta: -100 * M },
      },
      {
        id: 'keep-cash',
        label: 'Giữ tiền mặt, không cho vay',
        resultText: 'Bạn giữ thanh khoản và không chuyển tiền thành tư bản cho vay.',
        teachingPoint: 'Tiền không tham gia cho vay không tạo ra z; đây là sự lãng phí tư bản dưới góc nhìn kinh tế tư bản.',
        effect: {},
      },
    ],
  },
  {
    id: 'rate-cut-surprise',
    unlockRound: 10,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Lãi suất giảm bất ngờ sau báo cáo kinh tế',
    description: 'Ngân hàng Nhà nước giảm lãi suất 0,25% do lạm phát giảm. Đây là cơ hội vay vốn rẻ.',
    teachingPoint: 'Lãi suất biến động theo chu kỳ kinh tế; lãi suất thấp mở rộng cơ hội tiếp cận tư bản cho vay.',
    choices: [
      {
        id: 'expand-loan',
        label: 'Vay thêm 300 triệu mở rộng sản xuất',
        resultText: 'Bạn tận dụng lãi suất thấp để mở rộng quy mô tư bản.',
        teachingPoint: 'Lãi suất thấp giảm z phải trả, làm tăng phần m còn lại sau phân phối cho tư bản cho vay.',
        effect: { debtDelta: 300 * M, cashDelta: 300 * M },
      },
      {
        id: 'stay-conservative',
        label: 'Không vay thêm, giữ mức nợ hiện tại',
        resultText: 'Bạn không thay đổi cơ cấu vốn dù lãi suất giảm.',
        teachingPoint: 'Thận trọng trong sử dụng đòn bẩy tài chính giúp bảo vệ khỏi rủi ro khi lãi suất tăng trở lại.',
        effect: {},
      },
    ],
  },
  {
    id: 'monetary-tightening',
    unlockRound: 11,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Chính sách thắt chặt tiền tệ toàn hệ thống',
    description: 'Ngân hàng Nhà nước siết tín dụng bất động sản; vốn tín dụng trở nên khan hiếm và đắt đỏ hơn.',
    teachingPoint: 'Thắt chặt tiền tệ làm tăng z, giảm phần m còn lại sau phân phối và hạn chế mở rộng tư bản.',
    choices: [
      {
        id: 'repay-debt',
        label: 'Trả bớt 200 triệu nợ, giảm gánh lãi',
        resultText: 'Bạn giảm dư nợ để cắt giảm chi phí lãi suất z trong bối cảnh tín dụng siết chặt.',
        teachingPoint: 'Giảm nợ trong giai đoạn lãi suất cao bảo vệ tỷ suất lợi nhuận khỏi bị ăn mòn bởi z.',
        effect: { debtDelta: -200 * M, cashDelta: -200 * M },
      },
      {
        id: 'maintain-debt',
        label: 'Giữ nguyên khoản vay, quan sát thị trường',
        resultText: 'Bạn giữ nguyên cơ cấu nợ và chịu mức z cao hơn trong kỳ này.',
        teachingPoint: 'Giữ nợ trong bối cảnh thắt chặt giúp quan sát trực tiếp tác động của z đến lợi nhuận thực giữ lại.',
        effect: {},
      },
    ],
  },
  {
    id: 'high-yield-lending',
    unlockRound: 12,
    concept: 'interest',
    requiredFeatures: ['interest'],
    title: 'Cơ hội cho vay liên doanh lãi suất cao',
    description: 'Một liên doanh cần vay 200 triệu đồng gấp với cam kết lãi suất 11%/năm, cao hơn ngân hàng thương mại.',
    teachingPoint: 'Lãi suất cao hơn phản ánh rủi ro lớn hơn; đây là biểu hiện của cạnh tranh trên thị trường tư bản cho vay.',
    choices: [
      {
        id: 'lend-high-yield',
        label: 'Cho vay 200 triệu lãi 11%/năm',
        resultText: 'Bạn chuyển tiền mặt thành tư bản cho vay với lãi suất cao hơn mức thị trường.',
        teachingPoint: 'Lãi suất cao bù đắp rủi ro; z thu về phản ánh phần m được phân phối cho tư bản cho vay.',
        effect: { lendingDelta: 200 * M, cashDelta: -200 * M },
      },
      {
        id: 'avoid-risk',
        label: 'Không cho vay, tránh rủi ro',
        resultText: 'Bạn ưu tiên an toàn tài chính thay vì thu lãi cao.',
        teachingPoint: 'Từ chối rủi ro cao bảo vệ thanh khoản nhưng cũng bỏ lỡ phần z có thể thu được.',
        effect: {},
      },
    ],
  },

  // ── Pha 4: Địa tô - Tư bản đất đai (vòng 13-16) ──────────────────────────
  {
    id: 'industrial-land-price-rise',
    unlockRound: 13,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Đất khu công nghiệp tăng giá mạnh',
    description: 'Quy hoạch mới đẩy giá đất khu công nghiệp lân cận tăng 25%. Đây là cơ hội đầu tư hay rủi ro?',
    teachingPoint: 'Giá đất = địa tô / lãi suất; giá tăng phản ánh kỳ vọng về địa tô tương lai, không phải giá trị lao động.',
    choices: [
      {
        id: 'buy-land',
        label: 'Mua đất khu công nghiệp, đầu tư dài hạn',
        resultText: 'Bạn chuyển tư bản thành tài sản bất động sản công nghiệp.',
        teachingPoint: 'Mua đất là vốn hóa địa tô; giá trị đất không phát sinh từ lao động mà từ quan hệ sở hữu.',
        effect: { landUnitsDelta: 1 },
      },
      {
        id: 'continue-leasing',
        label: 'Tiếp tục thuê đất, không mua',
        resultText: 'Bạn giữ thanh khoản và tránh rủi ro bất động sản.',
        teachingPoint: 'Thuê đất thay vì mua giúp giữ lại tư bản lưu động cho sản xuất, nhưng phải trả địa tô hàng kỳ.',
        effect: {},
      },
    ],
  },
  {
    id: 'long-term-land-lease',
    unlockRound: 13,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Đề xuất thuê đất dài hạn 10 năm',
    description: 'Chủ đất đề xuất hợp đồng thuê 10 năm với giá cố định, thấp hơn giá thị trường 8% hiện tại.',
    teachingPoint: 'Địa tô là khoản nộp cho chủ sở hữu đất; hợp đồng dài hạn cố định địa tô và giảm rủi ro biến động.',
    choices: [
      {
        id: 'sign-lease',
        label: 'Ký hợp đồng thuê dài hạn',
        resultText: 'Bạn cố định chi phí địa tô R trong 10 năm với mức giá ưu đãi.',
        teachingPoint: 'Hợp đồng thuê dài hạn biến địa tô thành chi phí cố định, ổn định kế hoạch tài chính dài hạn.',
        effect: { forceRentMode: true },
      },
      {
        id: 'short-term-only',
        label: 'Chỉ thuê ngắn hạn, giữ linh hoạt',
        resultText: 'Bạn giữ khả năng thương lượng lại giá thuê mỗi năm.',
        teachingPoint: 'Thuê ngắn hạn cho phép điều chỉnh theo thị trường nhưng chịu rủi ro tăng địa tô.',
        effect: {},
      },
    ],
  },
  {
    id: 'land-bubble-burst-nearby',
    unlockRound: 14,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Giá đất vùng lân cận sụt giảm mạnh',
    description: 'Một số khu vực gần đây giá đất giảm 30-40% sau khi dự án hạ tầng bị hoãn vô thời hạn.',
    teachingPoint: 'Khi cơ sở vật chất không hình thành, địa tô kỳ vọng không thành hiện thực, giá đất sụt giảm.',
    choices: [
      {
        id: 'sell-fast',
        label: 'Bán bất động sản hiện có, thu tiền mặt',
        resultText: 'Bạn thanh lý tài sản đất đai trước khi thị trường xấu thêm.',
        teachingPoint: 'Bán kịp thời khi bong bóng vỡ cho thấy giá đất không có nền tảng từ địa tô thực tế.',
        effect: { cashDelta: 80 * M },
      },
      {
        id: 'hold-wait',
        label: 'Giữ đất, chờ thị trường phục hồi',
        resultText: 'Bạn không bán, chịu giảm giá ngắn hạn và chờ phục hồi.',
        teachingPoint: 'Giữ đất khi giá giảm phản ánh kỳ vọng về sự phục hồi địa tô trong tương lai.',
        effect: {},
      },
    ],
  },
  {
    id: 'urbanization-wave',
    unlockRound: 14,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Đô thị hóa mạnh đẩy giá đất tăng',
    description: 'Làn sóng đô thị hóa từ tỉnh về thành phố làm tăng nhu cầu đất ở và đất công nghiệp.',
    teachingPoint: 'Đô thị hóa tăng nhu cầu đất, làm tăng địa tô và theo đó làm tăng giá đất theo công thức P = R/i.',
    choices: [
      {
        id: 'invest-urban-land',
        label: 'Đầu tư thêm đất gần đô thị, chi 50 triệu',
        resultText: 'Bạn tận dụng xu hướng đô thị hóa để tăng tài sản đất đai.',
        teachingPoint: 'Đô thị hóa tạo địa tô chênh lệch mới khi vị trí đất trở nên có lợi thế hơn.',
        effect: { landUnitsDelta: 1, cashDelta: -50 * M },
      },
      {
        id: 'no-new-land',
        label: 'Không mua thêm, quan sát xu hướng',
        resultText: 'Bạn giữ nguyên danh mục đất đai và theo dõi diễn biến.',
        teachingPoint: 'Quan sát giúp hiểu cơ chế địa tô chênh lệch hình thành theo vị trí và hạ tầng.',
        effect: {},
      },
    ],
  },
  {
    id: 'land-law-amendment',
    unlockRound: 15,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Luật Đất đai sửa đổi thay đổi quy tắc định giá',
    description: 'Luật Đất đai mới (có hiệu lực 2024) thay đổi phương pháp định giá đất tiệm cận giá thị trường.',
    teachingPoint: 'Quy định pháp luật về đất đai ảnh hưởng trực tiếp đến địa tô và giá đất, phản ánh quan hệ sở hữu được luật hóa.',
    choices: [
      {
        id: 'restructure-portfolio',
        label: 'Điều chỉnh chiến lược đất đai, tăng tích lũy',
        resultText: 'Bạn thích nghi với quy định mới, điều chỉnh kế hoạch sử dụng và đầu tư đất.',
        teachingPoint: 'Thay đổi luật định tác động đến địa tô pháp lý, buộc tư bản điều chỉnh chiến lược sở hữu đất.',
        effect: { alphaDelta: 0.03 },
      },
      {
        id: 'wait-guidance',
        label: 'Chờ hướng dẫn cụ thể, chưa thay đổi',
        resultText: 'Bạn chờ thông tư hướng dẫn trước khi điều chỉnh chiến lược.',
        teachingPoint: 'Chờ đợi phản ánh độ bất định trong quan hệ pháp lý về sở hữu đất đai.',
        effect: {},
      },
    ],
  },
  {
    id: 'realestate-fund-volatility',
    unlockRound: 16,
    concept: 'rent',
    requiredFeatures: ['rent'],
    title: 'Quỹ đầu tư bất động sản biến động mạnh',
    description: 'Quỹ đầu tư bất động sản (REIT) nội địa tăng 15% trong quý sau khi lãi suất điều hành giảm.',
    teachingPoint: 'Lãi suất giảm làm tăng giá tài sản bất động sản theo công thức P = R/i; đây là minh họa trực tiếp vốn hóa địa tô.',
    choices: [
      {
        id: 'invest-reit',
        label: 'Đầu tư vào quỹ bất động sản, thu lợi 60 triệu',
        resultText: 'Bạn thu lợi từ tăng giá tài sản bất động sản theo xu hướng thị trường.',
        teachingPoint: 'Lợi nhuận từ tăng giá tài sản phản ánh phần địa tô được vốn hóa thêm khi lãi suất giảm.',
        effect: { cashDelta: 60 * M },
      },
      {
        id: 'avoid-volatility',
        label: 'Không đầu tư, tránh rủi ro biến động',
        resultText: 'Bạn không tham gia vào đợt biến động giá tài sản lớn này.',
        teachingPoint: 'Thị trường bất động sản biến động mạnh khi lãi suất thay đổi, phản ánh tính không ổn định của vốn hóa địa tô.',
        effect: {},
      },
    ],
  },
]

export function makeEventSeed(playerName: string, initialCapital: number): string {
  return `${playerName.trim().toLowerCase()}::${initialCapital}`
}

function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  hash += hash << 13
  hash ^= hash >>> 7
  hash += hash << 3
  hash ^= hash >>> 17
  hash += hash << 5
  return hash >>> 0
}

export function seededUnit(seed: string): number {
  return hashString(seed) / 0x100000000
}

function hasRequiredFeatures(event: QuickEvent, features: Feature[]): boolean {
  return (event.requiredFeatures ?? []).every((f) => features.includes(f))
}

export function getQuickEventForRound(
  seed: string,
  round: number,
  unlockedFeatures: Feature[],
  history: HistoryEntry[],
  options: { forceEvent?: boolean } = {},
): ResolvedQuickEvent | undefined {
  const usedIds = new Set(history.map((entry) => entry.event?.id).filter(Boolean))
  const eligible = QUICK_EVENTS.filter(
    (event) =>
      event.unlockRound <= round &&
      hasRequiredFeatures(event, unlockedFeatures) &&
      !usedIds.has(event.id),
  )

  if (eligible.length === 0) return undefined
  if (!options.forceEvent && seededUnit(`${seed}::quick-event::chance::round-${round}`) >= 0.4) {
    return undefined
  }

  const index =
    Math.floor(seededUnit(`${seed}::quick-event::pick::round-${round}`) * eligible.length) %
    eligible.length
  return { ...eligible[index], round }
}

export function getQuickEventChoice(
  event: QuickEvent,
  choiceId: string,
): QuickEventChoice | undefined {
  return event.choices.find((c) => c.id === choiceId)
}