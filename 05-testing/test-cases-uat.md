# ✅ Danh Sách Test Cases Nghiệm Thu UAT (`qa/test-cases-uat.md`)

Tài liệu này cung cấp bảng kiểm thử nghiệm thu (UAT) cho **BA, Manual QC và Khách hàng** khi kiểm tra trên bản Prototype (`https://lingora-prototype.vercel.app`) hoặc ứng dụng chính (`apps/web`).

---

## Nhóm 1: Khởi đầu, Lộ trình 3 Chặng & Kế hoạch Hôm nay

| Mã TC | Tên Kịch bản Kiểm thử | Bước thực hiện (Steps) | Kết quả Kỳ vọng (Expected Result) | Link Test Nhanh |
|---|---|---|---|---|
| **TC-01** | Màn hình Chào mừng & Nền động 60fps | 1. Mở `#/welcome` (hoặc bấm `Xoá dữ liệu & bắt đầu lại` trong `⚙ Giả lập`).<br/>2. Quan sát nền động và di chuột.<br/>3. Chọn thời lượng `30 phút / ngày` rồi bấm `🚀 Bắt đầu ngay từ Ngày 1`. | - Nền có hiệu ứng hạt sáng & sóng âm mượt mà.<br/>- Chuyển thẳng vào màn hình `Hôm nay` với thông báo bắt đầu từ Ngày 1, mọi kỹ năng ở trạng thái "Chưa biết" (không phải "yếu"). | `#/welcome` |
| **TC-02** | Chuyển đổi Chế độ Ngày ngắn (15p) vs Phiên thường (30p) | 1. Tại màn hình `#/today`, bấm nút `Ngày ngắn · 15′` ở góc phải trên.<br/>2. Bấm bắt đầu bài học Ngày 1. | - Thời lượng ước tính giảm xuống, khi vào bài học chỉ lọc các học phần có nhãn `★ Cốt lõi`. | `#/today` |
| **TC-03** | Tương tác Cây Tiến Độ 6 Cột Mốc (`Growth Tree V2`) | 1. Tại cột phải trang `#/today`, bấm lần lượt vào các mốc `01 Hạt giống` -> `06 Kết trái`.<br/>2. Bấm `Quay lại mốc hiện tại ↩`. | - Hình minh họa SVG cây thay đổi theo đúng 6 giai đoạn phát triển.<br/>- Hiển thị nhãn `👁 Xem trước cột mốc` và nút quay lại hoạt động chuẩn. | `#/today` |
| **TC-04** | Kiểm tra Lộ trình Chia rõ 3 Chặng (`Stage-Grouped Roadmap`) | 1. Bấm menu `🗺️ Lộ trình 3 Chặng` (`#/roadmap`).<br/>2. Quan sát cách phân nhóm 7 ngày. | - Hiển thị rõ 3 khung lớn: **Chặng 1 (Ngày 1–2)**, **Chặng 2 (Ngày 3–4)**, **Chặng 3 (Ngày 5–7)**.<br/>- Mỗi ngày có các chip tóm tắt trọng tâm bài học (`✓ Khẩu hình 5 âm IPA...`). | `#/roadmap` |

---

## Nhóm 2: Phòng Lab Khẩu hình IPA & Máy Đánh vần Tên (Ngày 1 & Ngày 3)

| Mã TC | Tên Kịch bản Kiểm thử | Bước thực hiện (Steps) | Kết quả Kỳ vọng (Expected Result) | Link Test Nhanh |
|---|---|---|---|---|
| **TC-05** | Khẩu hình IPA: 1 Âm / 1 Viewport (Không cuộn trang) | 1. Mở Ngày 1 (`#/run/lesson/1`), chuyển tới bước 2 (`Phòng Lab Khẩu hình & Cách Đánh vần 5 Âm Cốt lõi`).<br/>2. Bấm chuyển qua lại các tab `1/5 /iː/`, `2/5 /ɪ/`, `3/5 /eɪ/`, `4/5 /aɪ/`, `5/5 /z/`. | - Trên màn hình chỉ hiển thị **duy nhất 1 âm IPA** tại một thời điểm.<br/>- Người dùng không phải cuộn lên xuống để xem các âm khác. | `#/run/lesson/1` |
| **TC-06** | Sơ đồ Khẩu hình Cỡ lớn & Không Tràn Viền | 1. Quan sát 2 khung `1. NHÌN THẲNG (MÔI & RĂNG)` và `2. MẶT CẮT NGANG (LƯỠI & HƠI)`.<br/>2. Thu nhỏ cửa sổ trình duyệt xuống kích thước Tablet/Mobile. | - Hình vẽ môi, răng, lưỡi to, rõ nét.<br/>- Tiêu đề 1 và 2 nằm gọn trong thanh header HTML, **tuyệt đối không tràn chữ ra ngoài viền**. | `#/run/lesson/1` |
| **TC-07** | Máy Đánh Vần Tên Tương Tác (`Custom Name Speller`) | 1. Cuộn xuống khung `🔤 MÁY ĐÁNH VẦN IPA TƯƠNG TÁC`.<br/>2. Gõ tên bất kỳ (VD: `Phuong`, `Quang`, `Minh`) vào ô input.<br/>3. Bấm vào từng thẻ chữ cái. | - Tự động tách từng chữ cái sang phiên âm IPA kèm cách đọc tiếng Việt tương đương.<br/>- Bấm từng chữ cái phát âm thanh đọc chậm rõ ràng. | `#/run/lesson/1` |
| **TC-08** | Bài Test IPA: Nhận diện Khẩu hình & Trọng âm | 1. Chuyển tới bước 5 của Ngày 1 (`Bài Test IPA: Nhận diện Khẩu hình...`).<br/>2. Chọn đáp án cho 4 câu hỏi và bấm `Kiểm tra`. | - Câu 1 hiển thị trực tiếp sơ đồ khẩu hình để học viên đoán âm.<br/>- Khi bấm `Kiểm tra`, hiển thị giải thích chi tiết vì sao đúng/sai. | `#/run/lesson/1` |

---

## Nhóm 3: Chuyên đề Ngữ pháp 6 Phần — ForumFlash Style (Ngày 2 & Ngày 4)

| Mã TC | Tên Kịch bản Kiểm thử | Bước thực hiện (Steps) | Kết quả Kỳ vọng (Expected Result) | Link Test Nhanh |
|---|---|---|---|---|
| **TC-09** | Kiểm tra Đầy đủ 6 Phần trong Bài Ngữ pháp Ngày 2 (`To Be & Subject Pronouns`) | 1. Mở Ngày 2 (`#/run/lesson/2`), xem ngay Bước 1.<br/>2. Kiểm tra thứ tự các khối nội dung từ 1 đến 6. | Hiển thị đầy đủ 6 khối rõ ràng:<br/>1. **Giải thích trọng tâm & Quy tắc Vàng**<br/>2. **Chức năng giao tiếp & Ví dụ** (3 thẻ)<br/>3. **Mô hình Mảnh ghép & Bảng chia ngôi**<br/>4. **Cấu trúc 3 Thể: Khẳng định (+) · Phủ định (-) · Nghi vấn (?)**<br/>5. **Cách phân tích & Mẹo nhận biết nhanh** (3 bước)<br/>6. **Ví dụ giảng giải — Mổ xẻ thành phần câu** | `#/run/lesson/2` |
| **TC-10** | Kiểm tra Chuyên đề Câu hỏi Đảo Yes/No & Wh- (Ngày 4) | 1. Mở Ngày 4 (`#/run/lesson/4`), bấm sang Bước 2.<br/>2. Bấm các nút `🔊` trong bảng 3 thể và phần mổ xẻ câu. | - Hiển thị đầy đủ 6 phần chuyên sâu về đảo ngữ `Am/Is/Are` và từ để hỏi `What/Where`.<br/>- Âm thanh đọc câu mẫu hoạt động tốt. | `#/run/lesson/4` |

---

## Nhóm 4: Xưởng Viết, Phòng Thu Nói & Tiến Độ Bằng Chứng (Ngày 5 – Ngày 7)

| Mã TC | Tên Kịch bản Kiểm thử | Bước thực hiện (Steps) | Kết quả Kỳ vọng (Expected Result) | Link Test Nhanh |
|---|---|---|---|---|
| **TC-11** | Xưởng Viết Tự Động Lưu Nháp (`Writing Studio`) | 1. Mở Ngày 5 (`#/run/lesson/5`), sang Bước 2.<br/>2. Gõ 4 câu giới thiệu bản thân, tích chọn Checklist và bấm `Nộp bài viết`. | - Hiển thị trạng thái `Đã lưu trên thiết bị` và đếm số câu/số từ.<br/>- Sau khi nộp, lưu thành phiên bản `v1` trong trang `Tiến độ`. | `#/run/lesson/5` |
| **TC-12** | Trang Tiến Độ & Tín Hiệu Năng Lực (`#/progress`) | 1. Mở menu `🌱 Tiến độ & Tín hiệu` (`#/progress`).<br/>2. Kiểm tra 6 thẻ kỹ năng và danh sách bài làm. | - Hiển thị trạng thái định tính (`Chưa biết`, `Bắt đầu có tín hiệu`, `Đang phát triển`...), **không dùng điểm % ảo**.<br/>- Bấm `Xem quan sát` thấy rõ lịch sử làm độc lập hay có hỗ trợ. | `#/progress` |
