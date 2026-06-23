# AGENT_CONTEXT.md — Cáo Tử MLN

## Tên và mục tiêu

- Tên hiển thị: **Cáo Tử MLN**.
- Slug deploy/repo khuyến nghị: `cao-tu-mln`.
- Mục tiêu: game web giáo dục mô phỏng **Chương 3 — Giá trị thặng dư trong nền kinh tế thị trường** của giáo trình Kinh tế chính trị Mác–Lênin.
- Không mở rộng thành game quản trị doanh nghiệp; nội dung phải bám giáo trình.

## Cấu trúc chính

```text
src/data/theory.ts        18 bài học bám giáo trình
src/engine/economy.ts    công thức mô phỏng c, v, m, chu chuyển, phân phối GTTD
src/store/gameStore.ts   state Zustand và vòng chơi
src/components/          UI React
GAME_CONTENT.md          mapping nội dung game với giáo trình
HOSTING.md               hướng dẫn deploy Netlify/GitHub Pages/Vercel
```

## Deploy

- Netlify/Vercel: build command `npm run build`, publish/output directory `dist`.
- GitHub Pages: repo nên tên `cao-tu-mln`; `vite.config.ts` đặt base `/cao-tu-mln/` khi `GITHUB_PAGES=true`.

## Kiểm tra

```powershell
npm test
npm run build
```

## Guardrail nội dung

- Test `src/data/theory.test.ts` kiểm tra game có các khái niệm giáo trình còn thiếu trước đây.
- Test cũng chặn việc đưa lại khái niệm vượt phạm vi như tư bản ảo, chứng khoán, khủng hoảng thanh khoản, M&A hoặc quy luật xu hướng tỷ suất lợi nhuận.
