# Cáo Tử MLN – Mô phỏng Chương 3 KTCT Mác–Lênin

**Cáo Tử MLN** là game web giáo dục mô phỏng **Chương 3: Giá trị thặng dư trong nền kinh tế thị trường** theo giáo trình Kinh tế chính trị Mác–Lênin. Người chơi điều chỉnh một mô hình sản xuất tối giản để thấy các quan hệ `c`, `v`, `m`, tích lũy tư bản và các hình thức biểu hiện của giá trị thặng dư.

## Phạm vi nội dung

- Công thức chung của tư bản `T–H–T'`.
- Hàng hóa sức lao động, tiền công, sản xuất giá trị thặng dư.
- Tư bản bất biến `c`, tư bản khả biến `v`, giá trị thặng dư `m`.
- Giá trị thặng dư tuyệt đối, tương đối và siêu ngạch.
- Tuần hoàn, chu chuyển, tái sản xuất giản đơn và tái sản xuất mở rộng.
- Tích lũy tư bản, cấu tạo hữu cơ, tích tụ và tập trung tư bản.
- Lợi nhuận, lợi nhuận bình quân, lợi nhuận thương nghiệp, lợi tức, địa tô và giá đất.

## Nguyên tắc thiết kế

- Game chỉ bao quát nội dung Chương 3 của giáo trình, không mở rộng thành môn quản trị kinh doanh.
- Các yếu tố như sự kiện ngẫu nhiên, tinh thần công nhân, phá sản, khủng hoảng tín dụng, M&A hoặc tư bản ảo không còn là nội dung gameplay.
- Các quyết định trong game chỉ đóng vai trò minh họa công thức và quan hệ lý luận.

## Công nghệ

Vite · React · TypeScript · Zustand · Tailwind v4 · Recharts · Vitest

## Cài đặt

```bash
npm install
npm run dev
npm test
npm run build
```

## Tài liệu

| File | Nội dung |
|---|---|
| [AGENT_CONTEXT.md](./AGENT_CONTEXT.md) | Bản đồ repo cho AI agent |
| [GAME_CONTENT.md](./GAME_CONTENT.md) | Nội dung game và mapping giáo trình |
| [TEACHING_GUIDE.md](./TEACHING_GUIDE.md) | Kịch bản dùng từng màn game để dạy học |
| [HOSTING.md](./HOSTING.md) | Deploy GitHub Pages / Netlify |

## Cấu trúc `src/`

```text
engine/economy.ts      – công thức mô phỏng giá trị, chu chuyển, phân phối GTTD
store/gameStore.ts     – state Zustand + vòng chơi 18 quý
data/theory.ts         – 18 bài học bám Chương 3 giáo trình
components/            – UI React
lib/                   – currency, networth, storage
```
