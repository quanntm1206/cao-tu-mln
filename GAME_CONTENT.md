# GAME_CONTENT.md — Nội dung Cáo Tử MLN sau khi siết theo giáo trình

## Mục tiêu

Cáo Tử MLN là game web giáo dục cho **Chương 3 — Giá trị thặng dư trong nền kinh tế thị trường** của giáo trình Kinh tế chính trị Mác–Lênin. Game chỉ mô phỏng các quan hệ lý luận cần học, không mở rộng thành game quản trị doanh nghiệp.

Nếu cần dùng game trực tiếp trên lớp, xem kịch bản từng màn tại [`TEACHING_GUIDE.md`](./TEACHING_GUIDE.md).

## Nguyên tắc phạm vi

- Giữ: `T–H–T'`, hàng hóa sức lao động, tiền công, `G = c + v + m`, `m'`, `M`, tích lũy tư bản, chu chuyển, lợi nhuận, lợi tức, lợi nhuận thương nghiệp, địa tô và giá đất.
- Giữ có đổi ngôn ngữ: cải tiến năng suất dùng để minh họa giá trị thặng dư tương đối; rút ngắn lưu thông dùng để minh họa chu chuyển tư bản.
- Bỏ khỏi gameplay: sự kiện ngẫu nhiên, tinh thần công nhân, phá sản sớm, khủng hoảng tín dụng, M&A, chu kỳ suy thoái, tư bản ảo và các mô phỏng quản trị SME.

## Luồng chơi

1. Người chơi nhập tên và chọn vốn khởi đầu.
2. Mỗi vòng là một quý sản xuất, tổng cộng 18 vòng.
3. Người chơi điều chỉnh các biến đã mở khóa: giờ lao động, tiền công, lao động, máy móc, nguyên liệu, cải tiến năng suất, thời gian lưu thông, thương nghiệp, lợi tức, địa tô và tái đầu tư.
4. Sau mỗi vòng, modal hiển thị kết quả sản xuất và một bài học bám giáo trình.
5. Kết thúc vòng 18, game hiển thị tổng kết học phần.

## Mapping 18 vòng với giáo trình

| Vòng | Bài học | Trọng tâm giáo trình |
|---|---|---|
| 1 | Công thức chung của tư bản | `T–H–T'`, tiền biến thành tư bản khi tạo giá trị thặng dư |
| 2 | Hàng hóa sức lao động | Sức lao động là hàng hóa đặc biệt tạo giá trị mới |
| 3 | Sản xuất giá trị thặng dư | `G = c + v + m` |
| 4 | Tư bản bất biến và tư bản khả biến | `c` chỉ chuyển giá trị, `v` tạo điều kiện sinh `m` |
| 5 | Tiền công | Tiền công là biểu hiện bằng tiền của giá trị sức lao động |
| 6 | Tỷ suất và khối lượng GTTD | `m' = m/v`, `M = m' × V` |
| 7 | GTTD tuyệt đối | Kéo dài ngày lao động làm tăng lao động thặng dư |
| 8 | GTTD tương đối | Tăng năng suất làm giảm thời gian lao động tất yếu |
| 9 | GTTD siêu ngạch | Giá trị cá biệt thấp hơn giá trị xã hội |
| 10 | Tuần hoàn và chu chuyển tư bản | `n = CH/ch`, `M_năm = m' × V × n` |
| 11 | Tái sản xuất giản đơn và mở rộng | Tích lũy là biến một phần `m` thành tư bản mới |
| 12 | Nhân tố ảnh hưởng quy mô tích lũy | Phân chia `m`, khai thác sức lao động, năng suất, máy móc, tư bản ứng trước |
| 13 | Hệ quả của tích lũy tư bản | Cấu tạo hữu cơ tăng, tích tụ và tập trung tư bản |
| 14 | Chi phí sản xuất và lợi nhuận | `k = c + v`, lợi nhuận là hình thức biểu hiện của `m` |
| 15 | Tỷ suất lợi nhuận và lợi nhuận bình quân | `p'`, cạnh tranh và lợi nhuận bình quân |
| 16 | Lợi nhuận thương nghiệp | Một phần `m` phân chia cho tư bản thương nghiệp |
| 17 | Lợi tức | Một phần lợi nhuận bình quân trả cho tư bản cho vay |
| 18 | Địa tô và giá đất | `Giá đất = Địa tô / tỷ suất lợi tức ngân hàng` |

## Feature unlock

| Vòng mở khóa | Feature | Ý nghĩa giáo trình |
|---|---|---|
| 1 | Giờ lao động, tái đầu tư | GTTD tuyệt đối và tích lũy |
| 3 | Máy móc, nguyên liệu | Tư bản bất biến `c` |
| 5 | Cải tiến năng suất | GTTD tương đối |
| 7 | Thời gian lưu thông, thương nghiệp | Chu chuyển và tư bản thương nghiệp |
| 9 | Vay, trả nợ, cho vay | Lợi tức |
| 11 | Thuê/mua đất | Địa tô và giá đất |
| 13 | Hiện đầy đủ ký hiệu Marx | `m`, `m'`, `G`, `k`, `c/v` |

## Kiểm tra nội dung

Test `src/data/theory.test.ts` bảo đảm game có đủ các khái niệm giáo trình còn thiếu trước đây và không đưa lại các khái niệm vượt phạm vi như tư bản ảo, chứng khoán, khủng hoảng thanh khoản, M&A hoặc quy luật xu hướng tỷ suất lợi nhuận.
