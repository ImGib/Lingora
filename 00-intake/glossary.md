# Thuật Ngữ Sư Phạm & Kỹ Thuật Dự Án Lingora (Glossary)

Tài liệu định nghĩa chuẩn xác các khái niệm cốt lõi của Lingora để mọi AI Agent đồng nhất cách hiểu, không dịch nhầm hoặc diễn giải sai:

## 1. Thuật Ngữ Trạng Thái Học Tập (Learning States)
- **Exposure (Tiếp xúc):** Học viên lần đầu nhìn thấy hoặc nghe từ/mẫu câu. Chưa tính là bằng chứng năng lực.
- **Practice (Luyện tập):** Học viên làm bài tập có hỗ trợ (gợi ý, nghe chậm, transcript). Gán cờ `has_support: true`.
- **Evidence (Bằng chứng độc lập):** Học viên tự làm bài tập độc lập không dùng gợi ý (`has_support: false`).
- **Mastery (Thành thạo):** Năng lực được chứng minh qua nhiều lần làm đúng trong các phiên ngắt quãng (Spaced Retrieval).

## 2. Bất Biến Sư Phạm (Invariants)
- **Skipped != Failed:** Hành động bỏ qua câu hỏi hoặc chọn "Để sau" là quyền điều phối nhịp độ học. Không bao giờ trừ điểm hay gắn mác thất bại.
- **Support != Independent Evidence:** Dùng trợ giúp là bình thường trong luyện tập, nhưng không được tính vào bài kiểm tra năng lực độc lập.
- **Technical Failure != Learner Failure:** Lỗi rớt mạng, mic hỏng hoặc âm thanh lỗi là sự cố kỹ thuật, không phải lỗi của học viên. Phải có luồng cứu trợ (gõ văn bản).
- **Growth Garden != Streak Punishment:** Vắng mặt vài ngày không bị trừng phạt mất toàn bộ thành quả. Đón chào quay lại êm dịu.

## 3. Thành Phần Giao Diện & Bài Học (Components & Lesson Units)
- **IPA Mouth Studio:** Phòng Lab khẩu hình chuẩn 1 âm / viewport, gồm 2 góc nhìn SVG (trực diện và cắt ngang) kèm text nhãn bên ngoài SVG bằng HTML.
- **ForumFlash 6-Part Masterclass:** Cấu trúc bài giảng ngữ pháp 6 phần (Bản chất $\rightarrow$ Chức năng $\rightarrow$ Bảng chia $\rightarrow$ 3 thể $\rightarrow$ Dấu hiệu $\rightarrow$ Mổ xẻ câu).
- **Soft Study Palette:** Hệ màu pastel dịu nhẹ (Indigo `#6366f1`, Canvas `#fff9fb`, Mint `#10b981`, Peach `#f6c89f`, Blush `#f3a8c4`).
