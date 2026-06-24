export interface TeachingAid {
  round: number
  objective: string
  discussionQuestion: string
  focusMetric: string
}

export interface GlossaryItem {
  term: string
  meaning: string
}

export const TEACHING_AIDS: TeachingAid[] = [
  { round: 1, objective: "Nhận diện vận động T-H-T' và vì sao tiền ứng trước trở thành tư bản.", discussionQuestion: "Vì sao mua rẻ bán đắt không đủ để giải thích nguồn gốc giá trị thặng dư?", focusMetric: "Quan sát tiền T chuyển thành yếu tố sản xuất rồi quay về thành T'." },
  { round: 2, objective: 'Hiểu sức lao động là hàng hóa đặc biệt tạo ra giá trị mới.', discussionQuestion: 'Điểm đặc biệt của hàng hóa sức lao động so với nguyên liệu và máy móc là gì?', focusMetric: 'Quan sát số công nhân và tiền công như tư bản khả biến v.' },
  { round: 3, objective: 'Phân biệt c, v, m trong giá trị hàng hóa G = c + v + m.', discussionQuestion: 'Vì sao máy móc, nguyên liệu chỉ chuyển giá trị còn lao động sống tạo giá trị mới?', focusMetric: 'Quan sát tư bản cố định, tư bản lưu động và lợi nhuận vòng.' },
  { round: 4, objective: 'Củng cố tư bản bất biến c và tư bản khả biến v.', discussionQuestion: 'Nếu tăng máy móc mà không tăng lao động sống thì nguồn m được giải thích thế nào?', focusMetric: 'Quan sát cấu tạo hữu cơ c/v bắt đầu xuất hiện.' },
  { round: 5, objective: 'Hiểu tiền công là biểu hiện bằng tiền của giá trị sức lao động.', discussionQuestion: 'Vì sao tiền công không phải toàn bộ giá trị lao động tạo ra?', focusMetric: 'Quan sát tác động của lương mỗi công nhân lên v.' },
  { round: 6, objective: "Đọc tỷ suất và khối lượng giá trị thặng dư: m' và M.", discussionQuestion: "m' cao và M lớn khác nhau như thế nào trong mô hình?", focusMetric: "Quan sát m', lợi nhuận vòng và tổng V." },
  { round: 7, objective: 'Minh họa giá trị thặng dư tuyệt đối bằng kéo dài ngày lao động.', discussionQuestion: 'Khi h tăng còn t_n không đổi, phần lao động thặng dư thay đổi ra sao?', focusMetric: 'Quan sát slider giờ lao động / ngày.' },
  { round: 8, objective: 'Minh họa giá trị thặng dư tương đối bằng giảm t_n.', discussionQuestion: 'Tăng năng suất khác gì với kéo dài ngày lao động?', focusMetric: 'Quan sát đầu tư cải tiến năng suất và t_n.' },
  { round: 9, objective: 'Nhận diện giá trị thặng dư siêu ngạch từ lợi thế năng suất cá biệt.', discussionQuestion: 'Vì sao siêu GTTD chỉ có tính tạm thời?', focusMetric: 'Quan sát lợi thế năng suất và m_super khi có.' },
  { round: 10, objective: 'Hiểu tuần hoàn và chu chuyển tư bản qua n = CH / ch.', discussionQuestion: 'Vì sao rút ngắn lưu thông có thể làm M_năm tăng?', focusMetric: 'Quan sát cấp lưu thông, vòng quay n và M_năm.' },
  { round: 11, objective: 'Phân biệt tái sản xuất giản đơn và tái sản xuất mở rộng.', discussionQuestion: 'Khi α tăng, phần m nào được biến thành tư bản phụ thêm?', focusMetric: 'Quan sát tỷ lệ tái đầu tư α.' },
  { round: 12, objective: 'Nhận diện các nhân tố ảnh hưởng quy mô tích lũy.', discussionQuestion: 'Trong game, nhân tố nào làm quy mô tích lũy tăng rõ nhất?', focusMetric: 'Quan sát α, năng suất, quy mô lao động và tư bản ứng trước.' },
  { round: 13, objective: 'Đọc hệ quả tích lũy qua c/v, tích tụ và tập trung tư bản.', discussionQuestion: 'c/v tăng nói gì về cấu trúc tư bản?', focusMetric: 'Quan sát thành phần hữu cơ c/v.' },
  { round: 14, objective: 'Hiểu chi phí sản xuất k = c + v và lợi nhuận là hình thức biểu hiện của m.', discussionQuestion: 'Vì sao cùng một m có thể được nhìn thành p khi xét từ chi phí k?', focusMetric: 'Quan sát k, m và lợi nhuận ròng.' },
  { round: 15, objective: "Đọc p' và lợi nhuận bình quân P̄.", discussionQuestion: "Những nhân tố nào làm p' khác P̄?", focusMetric: "Quan sát biểu đồ p' so với P̄." },
  { round: 16, objective: 'Hiểu lợi nhuận thương nghiệp là một phần m được phân chia.', discussionQuestion: 'Tư bản thương nghiệp có tạo nguồn m độc lập không?', focusMetric: 'Quan sát kênh thương nghiệp và lợi nhuận thương nghiệp trong dòng m.' },
  { round: 17, objective: 'Hiểu lãi tức là phần lợi nhuận trả cho tư bản cho vay.', discussionQuestion: 'Vì sao lãi vay vẫn được quy về phân chia giá trị thặng dư?', focusMetric: 'Quan sát nợ, cho vay và Z.' },
  { round: 18, objective: 'Hiểu địa tô và giá đất như địa tô tư bản hóa.', discussionQuestion: 'Công thức Giá cả đất đai = Địa tô / Tỷ suất lợi tức ngân hàng cho thấy quan hệ nào giữa địa tô và lãi tức?', focusMetric: 'Quan sát R, Z và chi phí thuê đất.' },
]

export const GLOSSARY: GlossaryItem[] = [
  { term: "T-H-T'", meaning: "Công thức chung của tư bản: T − H − T′; phần chênh biểu hiện m đã tạo trong sản xuất, không phải m mới do mua bán." },
  { term: 'c', meaning: 'Tư bản bất biến: máy móc, nguyên liệu; chuyển giá trị vào sản phẩm, không tự tạo m.' },
  { term: 'v', meaning: 'Tư bản khả biến: tiền mua sức lao động; biến đổi vì lao động sống tạo giá trị mới.' },
  { term: 'm', meaning: 'Giá trị thặng dư: phần giá trị mới vượt quá v do lao động tạo ra.' },
  { term: "m'", meaning: 'Tỷ suất giá trị thặng dư: m / v, đo mức độ bóc lột lao động thặng dư trong mô hình giáo trình.' },
  { term: "p'", meaning: 'Tỷ suất lợi nhuận: p / (c + v), nhìn m dưới hình thức lợi nhuận so với toàn bộ tư bản ứng trước.' },
  { term: 'P̄', meaning: 'Lợi nhuận bình quân / tỷ suất bình quân dùng để so sánh với p cá biệt.' },
  { term: 'Z', meaning: 'Lợi tức: phần m chuyển cho chủ tư bản cho vay.' },
  { term: "Z'", meaning: 'Tỷ suất lợi tức = Z/T.' },
  { term: 'R', meaning: 'Địa tô: phần giá trị thặng dư chuyển cho chủ sở hữu đất.' },
  { term: 'ch', meaning: 'Thời gian chu chuyển/lưu thông trong mô hình.' },
  { term: 'n', meaning: 'Số vòng chu chuyển: n = CH / ch.' },
]

export function getTeachingAidForRound(round: number): TeachingAid {
  return TEACHING_AIDS.find((aid) => aid.round === round) ?? TEACHING_AIDS[TEACHING_AIDS.length - 1]
}

export const FINAL_CHECKLIST: string[] = [
  "Có thể trình bày công thức T − H − T′ và giải thích tại sao m phát sinh trong sản xuất, không phải lưu thông.",
  'Phân biệt được p (lợi nhuận CN), lợi nhuận thương nghiệp, Z (lãi tức), R (địa tô) và mối quan hệ với m.',
  'Sử dụng công thức Giá cả đất đai = Địa tô / Tỷ suất lợi tức ngân hàng để giải thích tại sao giá đất tăng khi Z′ giảm.',
  'Liên hệ được dữ liệu thực tế VN (Z′ theo NHNN 2022-2024, đất Hoài Đức, Bắc Ninh) với lý thuyết.',
  "Trả lời được: 'Tiền đẻ ra tiền' có nghĩa gì trong khuôn khổ giáo trình MLN Chương 3?",
]