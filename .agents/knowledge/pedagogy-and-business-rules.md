# LINGORA PEDAGOGICAL & BUSINESS INVARIANTS (KNOWLEDGE ONLY)

> **Mục đích:** Sổ tay tri thức tinh gọn về các quy tắc sư phạm, tâm lý học và cơ chế vận hành của Lingora. Không chứa code.

## 1. BỐN BẤT BIẾN SƯ PHẠM CỐT LÕI (CORE PEDAGOGICAL INVARIANTS)

### 1. `Skipped != Failed` (Bỏ qua khác với Thất bại)
- **Triết lý:** Tự điều chỉnh tốc độ (self-pacing) là quyền năng của người học thông minh.
- **Quy tắc:**
  - Nhấp "Bỏ qua", "Học sau", hoặc tạm dừng buổi học KHÔNG BAO GIỜ bị trừ điểm hay tính là lỗi sai.
  - Không hiển thị thông báo màu đỏ cảnh báo gay gắt (`#ef4444`).
  - Hệ thống âm thầm ghi nhận nhãn `status: 'deferred'` và đưa vào hàng đợi nhắc nhở ôn tập nhẹ nhàng sau 48 giờ.

### 2. `Support != Independent Evidence` (Có hỗ trợ khác với Bằng chứng độc lập)
- **Triết lý:** Sử dụng gợi ý là hành vi học tập tích cực, nhưng không được đánh đồng với năng lực tự thân đã thành thục.
- **Quy tắc:**
  - Bất kỳ khi nào học viên mở "Gợi ý", "Xem bản dịch", hoặc "Xem khẩu hình mẫu" $\rightarrow$ Gán cờ `has_support: true`.
  - Kết quả có hỗ trợ được tích lũy vào thanh tiến độ luyện tập (Practice Progress), nhưng KHÔNG ĐƯỢC tính vào điểm số đánh giá Cổng Độc Lập (Mastery Gate Evidence).

### 3. `Technical Failure != Learner Failure` (Lỗi kỹ thuật không phải lỗi người học)
- **Triết lý:** Bảo vệ tâm lý tự tin của người học trước các sự cố phần cứng/mạng.
- **Quy tắc:**
  - Khi trình duyệt chặn quyền micro, mạng rớt, hoặc audio không tải được:
    - Bắt buộc hiển thị thông điệp thấu hiểu: *"Đây là sự cố kỹ thuật của hệ thống, không phải lỗi của bạn"*.
    - Cung cấp ngay phương án dự phòng (Fallback): Chuyển sang dạng gõ bàn phím hoặc nghe âm mẫu thay vì bắt buộc ghi âm.

### 4. `Growth Garden != Streak Punishment` (Vườn ươm tăng trưởng không trừng phạt chuỗi)
- **Triết lý:** Cuộc sống có những gián đoạn không thể tránh khỏi. Trừng phạt làm mất chuỗi 30 ngày chỉ khiến người học bỏ cuộc vĩnh viễn.
- **Quy tắc:**
  - Khi học viên vắng mặt 3–7 ngày rồi quay lại:
    - TUYỆT ĐỐI KHÔNG reset toàn bộ chuỗi về con số 0 tròn trĩnh.
    - Hiển thị lời chào mừng ấm áp: *"Chào mừng bạn quay lại khu vườn học tập"*, và đề xuất một bài ôn tập nhẹ 5 phút để kích hoạt lại trí nhớ trước khi tiếp tục.

---

## 2. QUY CHUẨN XÁC THỰC VÀ BẢO MẬT TÀI NGUYÊN (CLERK AUTH)

1. **Bảo vệ theo tài nguyên (Resource-Based Protection):**
   - Không dùng `createRouteMatcher` cũ trong middleware.
   - Kiểm tra quyền truy cập trực tiếp tại Layout/Page bằng `await auth.protect()`.
2. **Riêng tư dữ liệu ghi âm (Acoustic Privacy):**
   - File thu âm giọng nói của học viên chỉ được phân tích âm học và lưu trữ mã hóa riêng tư. Tuyệt đối không công khai nếu không có sự cho phép rõ ràng của người học.
