# Bất Biến Sư Phạm & Quy Tắc Nghiệp Vụ Cốt Lõi (Source of Truth)

Mọi dòng code, component, logic bài tập hoặc câu lệnh truy vấn trong Lingora đều phải thỏa mãn 4 bất biến sau:

## 1. `Skipped != Failed` (Bỏ qua không phải Thất bại)
- Học viên có quyền bấm nút "Bỏ qua", "Để sau", hoặc "Hôm nay tôi mệt".
- Hệ thống tôn trọng nhịp độ cá nhân, lưu bài tập vào hàng đợi ôn tập tiếp theo.
- Tuyệt đối KHÔNG trừ điểm, KHÔNG tính là lỗi sai (error), KHÔNG hiển thị màu đỏ cảnh báo.

## 2. `Support != Independent Evidence` (Luyện tập có trợ giúp khác Bài thi độc lập)
- Khi học viên bấm xem "Gợi ý", "Bản dịch", "Nghe chậm" hoặc "Xem transcript" $\rightarrow$ Hệ thống gán cờ `has_support: true`.
- Kết quả này chỉ phục vụ mục đích Luyện tập (Practice Opportunity), KHÔNG ĐƯỢC tính vào Bằng chứng làm chủ độc lập (Mastery Evidence).

## 3. `Technical Failure != Learner Failure` (Lỗi kỹ thuật không phải lỗi người học)
- Khi micro bị chặn quyền, kết nối API bị timeout, hoặc file âm thanh lỗi tải:
  - Hiển thị thông báo êm dịu: *"Đây là lỗi kỹ thuật của hệ thống, không ảnh hưởng đến kết quả học của bạn"*.
  - Luôn cung cấp luồng cứu hộ ngay tức thì (Ví dụ: Cho phép chuyển từ thu âm sang gõ bàn phím).

## 4. `Growth Garden != Streak Punishment` (Vườn sinh trưởng thay cho Trừng phạt Streak)
- Không dùng chuỗi ngày học liên tục (Streak) mang tính trừng phạt (mất toàn bộ về 0 khi bận 1 ngày).
- Áp dụng mô hình Cây sinh trưởng (Learning Garden): Tiến độ tích lũy tự nhiên; khi quay lại sau vài ngày nghỉ, hệ thống hiển thị thông điệp chào mừng và đề xuất phiên ôn tập ngắn 5 phút (`Verify before Recovery`).
