# Lingora — Prototype MVP (Tuần 1: Me & My English)

Bản prototype tương tác tĩnh (HTML/CSS/vanilla JS) độc lập, mô phỏng đầy đủ trải nghiệm học tập Tuần 1 theo tài liệu thiết kế và kiến trúc của Lingora.

## Cách mở và trải nghiệm

1. **Cách 1 (Nhanh nhất):** Mở trực tiếp file `index.html` trong thư mục này bằng bất kỳ trình duyệt nào (Edge, Chrome, Safari, Firefox).
2. **Cách 2 (Qua HTTP server):**
   ```bash
   # Dùng Python:
   python -m http.server 3000 --directory prototype
   # Hoặc dùng npx:
   npx serve prototype
   ```
   Sau đó truy cập: `http://localhost:3000`

---

## Luồng trải nghiệm được tích hợp trong Prototype

1. **Onboarding & Mục tiêu thời gian:**
   - Lựa chọn thời gian học mỗi ngày: 15 phút (ngày ngắn), 30 phút (phiên vừa), hoặc 60 phút.
   - Lời hứa cốt lõi: không phán xét, không điểm số ảo, lỗi kỹ thuật không tính cho người học.

2. **Starting Point Check (Tuỳ chọn):**
   - 5 câu hỏi nhanh kiểm tra các kỹ năng của Tuần 1.
   - Có thể **bỏ qua** bất kỳ lúc nào để bắt đầu từ Ngày 1 với nhãn `Chưa biết` (không gắn nhãn `Yếu`).
   - Kết quả xuất ra theo từng claim: `Đã thể hiện` hoặc `Cần thêm bằng chứng`. Nếu làm tốt đọc/ngữ pháp/hỏi đáp, hệ thống gợi ý bắt đầu từ Ngày 3 (vẫn có thể chọn Ngày 1).

3. **Hôm nay (Dashboard & Kế hoạch ngày - Planner v1):**
   - **Việc tiếp theo (Next Action Card):** Hiển thị việc cần làm ưu tiên kèm **lý do giải thích minh bạch** (`DecisionTrace`): ưu tiên tiếp tục bài dở dang (`RESUME`) -> bài ôn tập đến hạn (`REVIEW`) -> kiểm tra ngắn khi nghi ngờ gặp khó (`VERIFY`) -> bài học mới (`LEARN`).
   - Hỗ trợ chuyển đổi giữa **Ngày ngắn (15 phút - chỉ làm bước cốt lõi)** và **Phiên thường**.
   - Các hành động tự chủ trên từng bước trong kế hoạch: `Bỏ qua` (Skip), `Để sau` (Defer) mà không bị trừ điểm hay tính là thất bại.

4. **Nội dung 7 Ngày học đầu tiên (Week 1 Curriculum):**
   - **Ngày 1 (Tiếp xúc):** Gặp lời giới thiệu của Linh và An, nhận diện 3 chi tiết (tên, nơi đến, vai trò). Có hỗ trợ phát âm (Web Speech API) và xem nghĩa tiếng Việt. Không chấm điểm.
   - **Ngày 2 (Luyện tập có hướng dẫn):** Nhận diện `am / are / is` và điền câu có gợi ý (`hints`). Bài làm có gợi ý không tính vào bằng chứng năng lực độc lập.
   - **Ngày 3 (Chi tiết chính & Nghe lần đầu):** Nghe đánh vần tên, câu hỏi trọng âm, nghe đoạn giới thiệu của Mai (ghi nhận nghe lần đầu vs nghe lại vs xem transcript), đọc hồ sơ của Tom.
   - **Ngày 4 (Hỏi đáp):** Hỏi đáp quen thuộc và tự điền không có gợi ý.
   - **Ngày 5 (Tự sản sinh - Viết & Nói):**
     - **Viết 3–5 câu:** Tự động đếm câu/từ, tự động lưu bản nháp trên thiết bị, checklist tự kiểm tra, lưu các phiên bản bất biến (`v1`, `v2`).
     - **Thu âm 20–30s:** Ghi âm trực tiếp qua microphone trình duyệt (MediaRecorder), hiển thị sóng âm/thời gian, nghe lại bản ghi, tự đối chiếu tiêu chí.
   - **Ngày 6 (Chuyển giao ngữ cảnh mới):** Đọc tin nhắn chat của Carlos, nghe Yuki, viết giới thiệu bạn bè (`transfer`).
   - **Ngày 7 (Ngày nhẹ):** 3 lựa chọn không áp lực: Ôn tập ngắn, Bù bài còn thiếu, hoặc Nghỉ ngơi trọn vẹn (nghỉ không làm giảm tín hiệu).

5. **Trang Tiến độ & Tín hiệu học tập (Progress & Evidence):**
   - **Nói thật lòng (Honest Signals):** Không dùng phần trăm hay điểm số tổng hợp.
   - 4 chiều đánh giá định tính: *Làm độc lập*, *Nhiều ngữ cảnh*, *Nội dung mới (transfer)*, *Sau vài ngày (retention)*.
   - Phân biệt rõ giữa *Tiến độ kế hoạch* (số ngày hoàn thành) và *Bằng chứng năng lực* (evidence).
   - Danh sách bài viết & bản ghi âm được lưu trữ dạng phiên bản.

6. **Bảng giả lập tình huống (Góc dưới bên phải - nút ⚙ Giả lập):**
   - **Sang ngày mới:** Tăng ngày giả lập, kiểm tra Spaced Review tự động kích hoạt sau 2 ngày.
   - **Vắng 3 ngày:** Giả lập người học nghỉ 3 ngày quay lại; hệ thống hiển thị thông điệp chào mừng ấm áp và tự động chuyển sang chế độ ngày ngắn để bắt nhịp nhẹ nhàng.
   - **Micro bị từ chối:** Giả lập lỗi truy cập microphone -> hệ thống hiển thị thông báo lỗi kỹ thuật và phương án thay thế (viết thay thế) mà không đánh rớt.
   - **Tải lên thất bại:** Giả lập lỗi mạng khi lưu audio -> bản ghi vẫn giữ nguyên trên máy, không bị mất bài làm.
   - **Âm thanh bài nghe lỗi:** Giả lập không phát được audio -> hiển thị văn bản thay thế và không ghi nhận bằng chứng nghe giả tạo.
