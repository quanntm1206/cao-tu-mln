# AI_APPENDIX.md — Phụ lục sử dụng AI (Rubric 1.4)

Môn: MLN122 — Kinh tế chính trị Mác-Lênin  
Nhóm: CapAccumulate  
Học kỳ: HK2 2024–2025

---

## 1. Bảng phân công AI / Con người

| Hạng mục | AI thực hiện | Con người kiểm tra |
|---|---|---|
| Scaffold React + Zustand | Tạo cấu trúc file ban đầu | Review logic gameStore.ts, sửa sai |
| Công thức kinh tế (c, v, m) | Gợi ý hàm tính | Đối chiếu giáo trình tr. 70–78 |
| Nội dung 16 vòng chơi | Dự thảo tiêu đề, giải thích | Sửa theo đúng thuật ngữ giáo trình |
| Case studies (8 tình huống) | Gợi ý cấu trúc bảng | **Tất cả số liệu do nhóm tự tra** |
| CSS / Tailwind | Gợi ý class | Review giao diện trực tiếp |
| Viết test (Vitest) | Tạo bộ test mẫu | Kiểm tra coverage thực tế |
| Dịch thuật Anh–Việt | Gợi ý bản dịch | Sửa theo giáo trình tiếng Việt |

---

## 2. Mẫu prompt đã dùng (3–5 prompt tiêu biểu)

### Prompt 1 — Scaffold cấu trúc game

**Prompt gốc:**
`
Create a React + TypeScript + Zustand game structure for a Marxist political economy
educational game. The game should simulate surplus value production with variables c, v, m.
4 phases, 4 rounds each, total 16 rounds. Each round reveals one textbook concept.
`

**Output thô (tóm tắt):**
`	ypescript
// AI gợi ý gameStore.ts với interface:
interface GameState {
  round: number; // 1–16
  capital: { c: number; v: number };
  surplusValue: number; // m
  phase: 1 | 2 | 3 | 4;
}
`

**Phiên bản đã chỉnh sửa:**
`	ypescript
// Nhóm đổi sang 4 pha với cấu trúc phân phối rõ ràng hơn:
interface DistributionState {
  round: number;
  phase: Phase; // 'profit' | 'avg-profit' | 'commerce-interest' | 'rent'
  surplusValue: number;
  distribution: {
    commercialProfit: number;  // lợi nhuận thương nghiệp
    interest: number;          // lãi suất
    rent: number;              // địa tô
    netProfit: number;         // lợi nhuận ròng
  };
}
`

---

### Prompt 2 — Nội dung case study

**Prompt gốc:**
`
Generate 8 Vietnamese real estate and banking case studies illustrating surplus value
distribution (profit, interest, rent) for a university-level game. Use realistic numbers.
`

**Output thô:**
> AI gợi ý các con số ước tính chung về lợi nhuận ngân hàng Việt Nam khoảng 15–20%.

**Phiên bản đã chỉnh sửa:**
> Nhóm thay toàn bộ số liệu bằng số liệu thực từ BCTC niêm yết HOSE (VNM, VHM, TCB, MSN),
> báo cáo VARS, dữ liệu NHNN, Batdongsan.com, Bộ Xây dựng. Xem Bảng Case Studies
> tại [GAME_CONTENT.md](./GAME_CONTENT.md).

---

### Prompt 3 — Tạo công thức kinh tế

**Prompt gốc:**
`
Write a TypeScript function to calculate annual surplus value M_year given:
m' (rate of surplus value), V (variable capital), n (turnover cycles per year).
`

**Output thô:**
`	ypescript
function calcAnnualSurplus(mRate: number, V: number, n: number) {
  return mRate * V * n;
}
`

**Phiên bản đã chỉnh sửa:**
`	ypescript
// src/engine/distribution.ts — nhóm thêm kiểm tra đầu vào và đổi tên theo giáo trình
export function calcM_nam(mPrime: number, V: number, n: number): number {
  if (V <= 0 || n <= 0) return 0;
  return mPrime * V * n; // M_năm = m' × V × n (giáo trình tr. 71)
}
`

---

### Prompt 4 — Viết teaching guide

**Prompt gốc:**
`
Write a teaching guide for Vietnamese university lecturers to run this game in class.
Include key reveal moments, discussion questions after each phase, and GV (teacher) mode.
`

**Output thô:**
> AI tạo guide bằng tiếng Anh với cấu trúc "Phase 1–4 key moments".

**Phiên bản đã chỉnh sửa:**
> Nhóm viết lại hoàn toàn bằng tiếng Việt, bổ sung câu hỏi thảo luận cụ thể theo giáo trình
> Mác-Lênin và hướng dẫn nút GV (Teacher Mode). Xem [TEACHING_GUIDE.md](./TEACHING_GUIDE.md).

---

### Prompt 5 — Viết test kiểm tra nội dung

**Prompt gốc:**
`
Write Vitest tests to ensure all 16 rounds have textbook concepts mapped,
and no out-of-scope concepts (stock market, bankruptcy, M&A) appear in game data.
`

**Output thô:**
`	ypescript
// AI tạo test cơ bản kiểm tra array length
expect(rounds).toHaveLength(16);
`

**Phiên bản đã chỉnh sửa:**
`	ypescript
// src/data/theory.test.ts — nhóm thêm kiểm tra chi tiết thuật ngữ
it('each round maps to a valid textbook concept', () => {
  rounds.forEach(r => {
    expect(r.concept).toBeTruthy();
    expect(r.textbookRef).toMatch(/tr\.\s*\d+/); // phải có trích dẫn trang
  });
});
it('no out-of-scope concepts', () => {
  const forbidden = ['chứng khoán', 'phá sản', 'M&A', 'tư bản ảo'];
  rounds.forEach(r => {
    forbidden.forEach(w => expect(r.description).not.toContain(w));
  });
});
`

---

## 3. Tuyên bố về số liệu tài chính

> **TUYÊN BỐ: KHÔNG SỬ DỤNG AI ĐỂ TẠO SỐ LIỆU TÀI CHÍNH.**
>
> Tất cả số liệu trong game (lợi nhuận doanh nghiệp, lãi suất ngân hàng, giá đất,
> địa tô, tỷ suất lợi nhuận) đều được nhóm tự tra cứu từ các nguồn chính thức sau:
>
> - **BCTC HOSE**: Báo cáo tài chính niêm yết Sàn giao dịch Chứng khoán TP.HCM
>   (VNM, VHM, TCB, MSN, năm 2023–2024)
> - **VARS**: Báo cáo thị trường bất động sản Việt Nam 2023–2024
>   (Hội Môi giới Bất động sản Việt Nam)
> - **NHNN**: Thống kê lãi suất cho vay của Ngân hàng Nhà nước Việt Nam
> - **Batdongsan.com**: Chỉ số giá đất nền TP.HCM, Hà Nội 2023–2024
> - **Bộ Xây dựng**: Báo cáo thị trường bất động sản quý IV/2024

---

## 4. Tuyên bố liêm chính học thuật

Nhóm xác nhận:

1. AI chỉ được dùng để **hỗ trợ lập trình** (scaffold, boilerplate, gợi ý cú pháp).
2. Tất cả **nội dung giáo trình** (khái niệm, công thức, diễn giải) do nhóm viết
   và đối chiếu trực tiếp với giáo trình *Kinh tế chính trị Mác-Lênin* (Bộ GD&ĐT, 2021).
3. Tất cả **số liệu thực tế** do nhóm tự tra cứu từ nguồn chính thức, không dùng AI.
4. Game không sử dụng nội dung có bản quyền của bên thứ ba.
5. Các thành viên nhóm đã đọc và đồng ý với tuyên bố này.

---

*Phụ lục này được viết theo Rubric 1.4 — AI Usage Appendix của môn MLN122.*
