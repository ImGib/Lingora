# ⚡ Kịch Bản Kiểm Thử Giả Lập Lỗi Kỹ Thuật (`qa/fault-scenarios.md`)

Một nguyên tắc bất biến của Lingora là **`Technical failure != Learner failure` (Lỗi kỹ thuật không bao giờ bị tính là lỗi của người học)**.
Tài liệu này hướng dẫn QA/QC dùng nút **`⚙ Giả lập`** ở góc dưới bên phải màn hình Prototype để kiểm tra 4 tình huống sự cố.

---

## Cách mở Bảng Giả lập Sự cố
1. Mở trang Prototype: [https://lingora-prototype.vercel.app](https://lingora-prototype.vercel.app)
2. Nhìn góc dưới bên phải màn hình, bấm nút **`⚙ Giả lập`**.

---

## 4 Kịch Bản Kiểm Thử Bắt Buộc Cho QC

### Kịch bản F-01: Học viên bị Từ chối Quyền Micro (`[x] Micro bị từ chối`)
- **Cách kích hoạt**: Tích chọn ô `[x] Micro bị từ chối` trong bảng `⚙ Giả lập`.
- **Màn hình cần mở**: Mở **Ngày 5** (`#/run/lesson/5`) $\rightarrow$ Chuyển tới **Bước 3 (Phòng thu nói)** $\rightarrow$ Bấm nút `🎙 Nhấn để ghi âm`.
- **Kết quả Đạt (PASS)**:
  1. Hệ thống hiển thị hộp thông báo màu cam: *"Không truy cập được micro. Đây là vấn đề kỹ thuật, không phải lỗi của bạn — không có gì bị tính là chưa đạt."*
  2. Cung cấp 3 nút cứu hộ: **`Thử lại`**, **`Để sau`**, và **`Viết thay lần này`**.
  3. Khi bấm `Viết thay lần này`, học viên gõ văn bản và lưu lại bình thường để hoàn thành bài học mà không bị kẹt.

### Kịch bản F-02: Tải Bản Ghi Âm Lên Mạng Thất Bại (`[x] Tải bản ghi lên thất bại`)
- **Cách kích hoạt**: Bỏ tích `Micro bị từ chối`, tích chọn ô `[x] Tải bản ghi lên thất bại`.
- **Màn hình cần mở**: Tại **Ngày 5 - Bước 3**, thu âm thử vài giây rồi bấm `Lưu bản ghi`.
- **Kết quả Đạt (PASS)**:
  1. Hiển thị thông báo: *"Tải lên chưa thành công. Bản ghi vẫn còn trên máy bạn — không mất gì, và không bị tính là chưa đạt."*
  2. File ghi âm của học viên vẫn nghe lại được ngay trên trình duyệt, không bị xóa mất.

### Kịch bản F-03: Âm Thanh Bài Nghe Bị Lỗi (`[x] Âm thanh bài nghe lỗi`)
- **Cách kích hoạt**: Tích chọn ô `[x] Âm thanh bài nghe lỗi`.
- **Màn hình cần mở**: Mở **Ngày 3** (`#/run/lesson/3`) $\rightarrow$ Bước 3 (`Nghe Lời Giới thiệu của Mai`) $\rightarrow$ Bấm nút `▶` phát âm thanh.
- **Kết quả Đạt (PASS)**:
  1. Hệ thống báo: *"Âm thanh không phát được. Đây là lỗi kỹ thuật, không phải lỗi của bạn — lần này sẽ không được tính là bằng chứng nghe."*
  2. Tự động hiển thị lời thoại (Transcript) để học viên vẫn đọc và làm tiếp được câu hỏi.
  3. Khi bấm `Kiểm tra`, nhãn trạng thái ghi rõ `Không tính: lỗi âm thanh` (không phạt học viên nếu trả lời sai).

### Kịch bản F-04: Học Viên Nghỉ Học 3 Ngày Mới Quay Lại (`Vắng 3 ngày`)
- **Cách kích hoạt**: Bấm nút **`Vắng 3 ngày`** trong bảng `⚙ Giả lập`.
- **Màn hình cần mở**: Tự động chuyển về màn hình `#/today`.
- **Kết quả Đạt (PASS)**:
  1. Hiển thị thẻ chào mừng ấm áp: *"Chào mừng bạn quay lại! Bạn đã nghỉ 3 ngày — không sao cả. Hôm nay mình bắt đầu bằng ngày ngắn..."*
  2. Chế độ tự động chuyển sang **`Ngày ngắn · 15′`**.
  3. Không cộng dồn bài tập của 3 ngày nghỉ thành một danh sách khổng lồ gây nản chí.
