# 📚 Quy Chuẩn Biên Soạn Học Liệu Lingora (`curriculum/GUIDE.md`)

> **Quy tắc 3 giây:** Dành cho **Giáo vụ (Curriculum Team)** và **Content QC**. Mọi bài học mới trong thư mục `curriculum/week-1..4/` đều phải tuân thủ 3 quy chuẩn cốt lõi dưới đây.

---

## 1. Cấu trúc 3 Chặng Học trong Mỗi Tuần (`3 Learning Stages per Week`)

Mỗi tuần (7 ngày) không được để rời rạc mà phải chia thành **3 Chặng năng lực** rõ ràng:
- **Chặng 1 (Ngày 1 – Ngày 2) · Nền tảng Ngữ âm IPA & Mảnh ghép Ngữ pháp (`Foundation`)**:
  - Làm quen hội thoại mẫu, khẩu hình các âm IPA cốt lõi, từ vựng trọng tâm và chuyên đề ngữ pháp nền tảng.
- **Chặng 2 (Ngày 3 – Ngày 4) · Phản xạ Hỏi - Đáp & Nghe - Đọc Thực chiến (`Comprehension & Q&A`)**:
  - Đánh vần, nghe hiểu lần đầu độc lập (`firstPass`), đọc quét thông tin và luyện phản xạ câu hỏi Wh- / Yes-No.
- **Chặng 3 (Ngày 5 – Ngày 7) · Thực hành Sản sinh, Chuyển giao & Tuần hoàn (`Production, Transfer & Review`)**:
  - Tự viết đoạn văn ngắn (Ngày 5), ghi âm giọng nói 20–30 giây (Ngày 5), xử lý văn bản trong bối cảnh hoàn toàn mới như tin nhắn Slack/thẻ hội nghị (Ngày 6) và ôn tập ngắt quãng nhẹ nhàng (Ngày 7).

---

## 2. Quy chuẩn Bắt buộc cho Học phần Ngữ âm (`IPA Studio`)

1. **Hiển thị 1 Âm / 1 Màn hình (`Single-Phoneme Viewport`)**:
   - Dữ liệu `phonemes` trong bước `ipa` được hiển thị qua thanh chọn tab để học viên tập trung tối đa vào 1 âm, không phải cuộn trang.
2. **Đầy đủ Công thức Ghép vần (`blendParts` & `blendFormula`)**:
   - Mỗi âm hoặc từ mẫu phải tách rõ: `Phụ âm đầu + Nguyên âm + Âm cuối -> Từ hoàn chỉnh` (VD: `/m/ + /iː/ + /t/ = /miːt/ (meet)`).
3. **100% Từ vựng mới phải có**:
   - Phiên âm `ipa`, chia âm tiết `syllables`, ghi chú trọng âm `stressNote`, hướng dẫn đánh vần `spellSteps` và câu ví dụ `collocation`.

---

## 3. Quy chuẩn 6 Phần cho Chuyên đề Ngữ pháp (`ForumFlash-Style 6-Part Grammar Masterclass`)

Mỗi bước `grammar-pieces` (hoặc hoạt động `INSTRUCTION` về ngữ pháp trong file JSON) phải cung cấp đủ **6 trường dữ liệu**:
1. **`coreConcept`**: Giải thích bản chất trọng tâm (`summary`) và Quy tắc Vàng (`goldenRule`).
2. **`functions`**: Mảng 3 chức năng sử dụng thực tế (kèm `title`, `formula`, `desc`, `examples`).
3. **`subject / be / complement` & `rows` (`pieces`)**: Mô hình mảnh ghép và bảng chia theo các ngôi.
4. **`polarityMatrix`**: Bảng đối chiếu 3 thể **Khẳng định (`affirmative`) · Phủ định (`negative`) · Nghi vấn (`interrogative`)**, nêu rõ quy tắc viết tắt và cách trả lời ngắn.
5. **`recognitionTips`**: Các bước phân tích dấu hiệu câu giúp học viên nhận biết nhanh khi làm bài.
6. **`annotatedExamples`**: Ví dụ giảng giải bóc tách từng từ/cụm từ trong câu (`tokens`: từ + vai trò ngữ pháp) kèm lời phân tích (`analysis`).

---

## 4. Công cụ Kiểm tra & Biên dịch Học liệu (`Content Compiler`)

Sau khi chỉnh sửa các file JSON trong `curriculum/week-1/day-*.json`, chạy lệnh kiểm tra cấu trúc tại thư mục gốc:
```powershell
pnpm typecheck
```
Trình biên dịch tại [`packages/content-compiler/`](../packages/content-compiler/) sẽ kiểm tra tính hợp lệ của Schema và sinh ra file SQL seed tương ứng.
