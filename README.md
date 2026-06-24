# CapAccumulate — MLN122: Phân chia giá trị thặng dư

**CapAccumulate** là game web giáo dục mô phỏng **phân phối giá trị thặng dư**
theo giáo trình Kinh tế chính trị Mác-Lênin (Chương 3, tr. 70–78).

Chủ đề: **Phân chia giá trị thặng dư và câu chuyện tiền đẻ ra tiền**  
Môn học: MLN122 — Kinh tế chính trị Mác-Lênin  
Cấu trúc: 4 pha × 4 vòng = **16 vòng chơi**

---

## Phạm vi nội dung

Game tập trung vào **phân phối** m (giá trị thặng dư), **không** mô phỏng quá trình sản xuất:

- Pha 1 (Vòng 1–4): Lợi nhuận p, tỷ suất lợi nhuận p'
- Pha 2 (Vòng 5–8): Lợi nhuận bình quân p̄, giá cả sản xuất
- Pha 3 (Vòng 9–12): Lợi nhuận thương nghiệp, lãi suất z
- Pha 4 (Vòng 13–16): Địa tô R, giá đất = R / z'

---

## Cài đặt và chạy

`ash
npm install
npm run dev        # Chạy development server tại localhost:5173
npm run build      # Build production → thư mục dist/
npm test           # Chạy test suite (Vitest)
`

### Yêu cầu
- Node.js >= 18
- npm >= 9

---

## Công nghệ

Vite · React · TypeScript · Zustand · Tailwind v4 · Recharts · Vitest

---

## Tài liệu

| File | Nội dung |
|---|---|
| [GAME_CONTENT.md](./GAME_CONTENT.md) | 16 vòng, 8 case study, 5 khái niệm lý thuyết, kiểu kết thúc |
| [TEACHING_GUIDE.md](./TEACHING_GUIDE.md) | Hướng dẫn giáo viên, điểm tiết lộ, câu hỏi thảo luận, nút GV |
| [AI_APPENDIX.md](./AI_APPENDIX.md) | Phụ lục AI (Rubric 1.4) — bảng AI/người, prompt mẫu, tuyên bố |
| [AGENT_CONTEXT.md](./AGENT_CONTEXT.md) | Bản đồ repo cho AI agent |
| [HOSTING.md](./HOSTING.md) | Deploy Netlify / Vercel / GitHub Pages |

---

## Cấu trúc src/

`	ext
src/engine/distribution.ts   — công thức phân phối m (p, p̄, z, R, giá đất)
src/data/caseStudies.ts       — 8 tình huống thực tế với nguồn BCTC/VARS/NHNN
src/store/gameStore.ts        — state Zustand và 16 vòng chơi
src/data/theory.ts            — 5 khái niệm lý thuyết tr. 70–78
src/engine/endings.ts         — 5 kiểu kết thúc
src/components/               — UI React (Dashboard, DecisionPanel, Charts, ...)
src/lib/                      — currency, networth, storage
`

---

## Alignment với Rubric MLN122

| Rubric | Nội dung | File liên quan |
|---|---|---|
| 1.1 Chủ đề đúng giáo trình | Phân phối m, tr. 70–78 | GAME_CONTENT.md |
| 1.2 Số liệu thực tế | 8 case study từ BCTC HOSE, VARS, NHNN, Batdongsan | GAME_CONTENT.md |
| 1.3 Tính học thuật | 5 khái niệm có trích dẫn trang giáo trình | GAME_CONTENT.md |
| 1.4 AI Appendix | Bảng AI/người, 5 prompt mẫu, tuyên bố liêm chính | AI_APPENDIX.md |
| 2.1 Thiết kế game | 16 vòng, 4 pha, điểm tiết lộ tại vòng 4/8/12/16 | GAME_CONTENT.md |
| 2.2 Hỗ trợ giảng dạy | Teacher mode (nút GV), câu hỏi thảo luận | TEACHING_GUIDE.md |
| 3.1 Kỹ thuật | Build pass, test pass, TypeScript strict | package.json |

---

## Số liệu tài chính

> **Tất cả số liệu trong game do nhóm tự tra cứu** từ:
> BCTC HOSE (VNM, VHM, TCB, MSN), VARS, NHNN, Batdongsan.com, Bộ Xây dựng.  
> Không sử dụng AI để tạo số liệu. Chi tiết tại [AI_APPENDIX.md](./AI_APPENDIX.md).
