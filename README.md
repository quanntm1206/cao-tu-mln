# CapAccumulate – Tích lũy Tư bản

Trò chơi mô phỏng quá trình tích lũy tư bản theo lý luận kinh tế chính trị Marx–Engels.
Người chơi đóng vai nhà tư bản **doanh nghiệp sản xuất SME Việt Nam**, đưa ra quyết định qua 18 vòng (mỗi vòng = 1 quý) và học các khái niệm:
giá trị thặng dư, tỷ suất lợi nhuận, thành phần hữu cơ, vòng quay tư bản, tín dụng, địa tô, v.v.

**Quy mô tiền tệ:** vốn khởi đầu 1,5–5 tỷ ₫, lương ~15–45 triệu/người/quý, đầu tư máy móc theo bước 50 triệu ₫.

## Công nghệ

- **Vite** + **React** + **TypeScript**
- **Zustand** – quản lý trạng thái game
- **Tailwind CSS v4** – giao diện dark dashboard
- **Recharts** – biểu đồ tích lũy
- **Vitest** – kiểm thử engine kinh tế

## Cài đặt và chạy

```bash
# Cài phụ thuộc
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Chạy kiểm thử
npm test
```

Mở trình duyệt tại `http://localhost:5173`

## Cơ chế kinh tế

### 5 Mảnh ghép lý thuyết (Supplements)

| # | Khái niệm | Công thức |
|---|-----------|-----------|
| 1 | Phương trình giá trị | `G = c + v + m` |
| 2 | Vòng quay tư bản | `M_năm = m' × V × n`, `n = CH/ch` |
| 3 | GTTT tương đối & siêu GTTT | `m' = (h−t_n)/t_n`, R&D giảm `t_n` |
| 4 | Bình quân hóa tỷ suất LN | `p'_cá_thể → p̄` (thị trường) |
| 5 | Phân phối GTTT | `m → z (lãi) + R (địa tô) + p_tn (thương nghiệp) + p (còn lại)` |

### Mở khóa theo vòng

| Vòng | Tính năng mới |
|------|---------------|
| 1–2  | Giờ làm, tái đầu tư α |
| 3–4  | Máy móc (c_cố_định), nguyên liệu (c_lưu_động) |
| 5–6  | Nghiên cứu & Phát triển (giảm t_n, tăng tech_lead) |
| 7–8  | Kho vận (tăng n), kênh thương nghiệp |
| 9–10 | Vay vốn, cho vay (tư bản tài chính) |
| 11–12| Thuê/mua đất (địa tô) |
| 13+  | Hiển thị đầy đủ m, m', p', q |

## Cấu trúc dự án

```
src/
  engine/economy.ts       – Hàm thuần túy: tất cả công thức kinh tế
  engine/economy.test.ts  – Kiểm thử 5 mảnh ghép lý thuyết
  store/gameStore.ts      – Zustand: trạng thái + hành động game
  data/theory.ts          – Bài học lý luận theo vòng
  lib/storage.ts          – Lưu bảng xếp hạng vào LocalStorage
  components/
    IntroScreen.tsx       – Màn hình giới thiệu
    Dashboard.tsx         – Bảng điều khiển chính
    MetricsPanel.tsx      – Bảng chỉ số kinh tế
    DecisionPanel.tsx     – Các đòn bẩy quyết định
    SurplusFlow.tsx       – Biểu đồ dòng chảy GTTT
    Charts.tsx            – Biểu đồ Recharts
    RoundResultModal.tsx  – Kết quả vòng + bài học
    Leaderboard.tsx       – Bảng xếp hạng
    TheoryTooltip.tsx     – Tooltip công thức
```
