# AGENT_CONTEXT.md — CapAccumulate (MLN122)

## Tên và mục tiêu

- **Tên hiển thị:** CapAccumulate
- **Slug repo:** capaccumulate
- **Môn:** MLN122 — Kinh tế chính trị Mác-Lênin
- **Chủ đề:** Phân chia giá trị thặng dư và câu chuyện tiền đẻ ra tiền

## Phạm vi nội dung (QUAN TRỌNG)

> **Chỉ** mô phỏng **phân phối** m, **KHÔNG** mô phỏng quá trình sản xuất G = c + v + m.

| Trong phạm vi | Ngoài phạm vi |
|---|---|
| Lợi nhuận p, p' | Sản xuất GTTD tuyệt đối / tương đối |
| Lợi nhuận bình quân p̄, giá cả sản xuất | Chu chuyển tư bản 
, M_năm |
| Lợi nhuận thương nghiệp | Tư bản ảo, chứng khoán |
| Lãi suất z, tư bản cho vay | Khủng hoảng tín dụng, M&A |
| Địa tô R, giá đất | Địa tô phong kiến |

## Cấu trúc 4 pha

| Pha | Vòng | Nội dung |
|---:|---|---|
| 1 | 1–4 | Lợi nhuận: k = c + v, p = G - k, p', nhân tố ảnh hưởng |
| 2 | 5–8 | Lợi nhuận bình quân: cạnh tranh liên ngành, p̄, giá cả sản xuất |
| 3 | 9–12 | Lợi nhuận thương nghiệp + Lãi suất: z, z', "tiền đẻ ra tiền" |
| 4 | 13–16 | Địa tô: R (CL-I, CL-II, tuyệt đối), giá đất = R / z' |

## File quan trọng

`	ext
src/engine/distribution.ts   — Logic phân phối m (p, p̄, z, R, giá đất)
src/data/caseStudies.ts       — 8 case study từ BCTC HOSE, VARS, NHNN, Batdongsan
src/store/gameStore.ts        — State Zustand, 16 vòng, 4 pha
src/data/theory.ts            — 5 khái niệm lý thuyết tr. 70–78
src/engine/endings.ts         — 5 kiểu kết thúc
src/components/TeacherTools.tsx — Chế độ GV (Teacher Mode)
`

## API quan trọng trong distribution.ts

`	ypescript
// Lợi nhuận
calcProfit(G: number, k: number): number           // p = G - k
calcProfitRate(m: number, cPlusV: number): number  // p' = m / (c+v) × 100%

// Lợi nhuận bình quân
calcAverageProfitRate(totalM: number, totalCapital: number): number

// Lãi suất
calcInterest(z_prime: number, loanAmount: number): number

// Địa tô và giá đất
calcLandPrice(R: number, z_prime: number): number  // = R / z'
`

## Điểm tiết lộ (Key Reveals)

Mỗi vòng cuối pha có modal "tiết lộ" kết nối gameplay với giáo trình:

- **Vòng 4**: Lợi nhuận che giấu bản chất m (tr. 73)
- **Vòng 8**: Bình quân hóa p' qua cạnh tranh (tr. 74–75)
- **Vòng 12**: "Tiền đẻ ra tiền" = phân phối lại m (tr. 76–77)
- **Vòng 16**: Giá đất = địa tô tư bản hóa (tr. 78)

## Deploy

- Netlify / Vercel: build command 
pm run build, output dist/
- GitHub Pages: set GITHUB_PAGES=true, ite.config.ts tự đặt ase

## Kiểm tra

`powershell
npm test
npm run build
`

## Guardrail nội dung

- Test src/data/theory.test.ts đảm bảo 16 vòng đủ khái niệm, không xuất hiện khái niệm ngoài phạm vi.
- Test src/engine/distribution.test.ts kiểm tra công thức p, p̄, z, R, giá đất.
- Test src/data/caseStudies.test.ts kiểm tra mỗi case study có trích dẫn nguồn.

## Tài liệu

- [README.md](./README.md) — Tổng quan dự án, rubric alignment
- [GAME_CONTENT.md](./GAME_CONTENT.md) — 16 vòng, 8 case study, 5 khái niệm
- [TEACHING_GUIDE.md](./TEACHING_GUIDE.md) — Hướng dẫn giáo viên
- [AI_APPENDIX.md](./AI_APPENDIX.md) — Phụ lục AI (Rubric 1.4)
