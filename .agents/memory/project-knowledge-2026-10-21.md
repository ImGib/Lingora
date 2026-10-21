# Lingora Agent Knowledge & Session Memory (`2026-10-21`)

Tài liệu này lưu trữ toàn bộ tri thức sư phạm, quyết định thiết kế UI/UX, cấu trúc dữ liệu bài học và trạng thái triển khai mà Agent đã đúc kết cùng Product Owner để đảm bảo tính liên tục tuyệt đối trong các phiên làm việc tiếp theo.

---

## 1. Tri thức Sư phạm & Thiết kế Nội dung Đã Thống Nhất (Pedagogical & Content Learnings)

### 1.1. Phòng Lab Khẩu hình & Đánh vần IPA (`IPA Studio & Phonetic Blending`)
- **Nguyên tắc 1 Âm / 1 Màn hình (`Single-Phoneme Viewport Stage`)**:
  - Tuyệt đối không xếp chồng nhiều thẻ IPA dọc khiến học viên phải cuộn lên xuống.
  - Sử dụng thanh chuyển tab tương tác (`.ipa-tabs-bar`) ở đầu bước học (`1/5 /iː/ meet`, `2/5 /ɪ/ is`, v.v.) để học viên xem trọn vẹn 1 âm trên cùng 1 khung nhìn.
- **Sơ đồ Khẩu hình Trực quan Cỡ lớn (`Mouth & Tongue Articulation Studio`)**:
  - Mỗi âm IPA hiển thị song song 2 góc nhìn SVG cỡ lớn:
    1. **1. NHÌN THẲNG (MÔI & RĂNG)**: Khẩu hình căng ngang cười tươi (`/iː/`), mở hờ tự nhiên (`/ɪ/`), trượt đôi (`/eɪ/`, `/aɪ/`), khép hờ răng rung (`/z/`), ngậm môi âm mũi (`/m/`).
    2. **2. MẶT CẮT NGANG (LƯỠI & HƠI)**: Vị trí lưỡi nâng cao/hạ thấp, luồng hơi đi qua miệng hoặc mũi, độ rung dây thanh quản (`Dây thanh rung 〰️`).
  - **Quy tắc chống tràn viền (`Zero Text Overflow`)**: Toàn bộ tiêu đề panel và chú thích khẩu hình phải đặt trong thẻ HTML flexbox/grid bên ngoài `<svg>`, không nhét chữ dài vào bên trong `<svg>`.
- **Công thức Đánh vần 3 Bước & Máy Đánh vần Tên A–Z (`Interactive Name Speller`)**:
  - Học viên mất gốc cần cầu nối giữa chữ viết tiếng Anh và ký hiệu IPA giống như đánh vần tiếng Việt lớp 1 (`Phụ âm đầu + Nguyên âm + Âm cuối`).
  - Tích hợp **Máy Đánh vần Tên Riêng A–Z** cho phép gõ tên bất kỳ (VD: *Linh, Minh, Huong, Nam, Trang*) để tách từng chữ cái sang IPA kèm âm thanh đọc chậm `0.55x`.

### 1.2. Cấu trúc Bài giảng Ngữ pháp 6 Phần (ForumFlash-Inspired Grammar Masterclass)
- Mọi chuyên đề ngữ pháp cốt lõi (như **Ngày 2: Đại từ Nhân xưng & Động từ To Be**, **Ngày 4: Câu hỏi Đảo Yes/No & Wh- Questions**) phải được trình bày theo **6 phần sư phạm rõ ràng**:
  1. **Giải thích Trọng tâm (`coreConcept` + `goldenRule`)**: So sánh sự khác biệt giữa tiếng Việt (thường lược bỏ động từ nối) và tiếng Anh (bắt buộc có `To Be`), kèm Quy tắc Vàng.
  2. **Chức năng Giao tiếp & Ví dụ Thực tế (`functions`)**: Chia rõ từng chức năng (Định danh Tên/Nghề, Chỉ Quê quán/Vị trí, Miêu tả Đặc điểm/Tuổi tác) kèm công thức và âm thanh.
  3. **Mô hình Mảnh ghép & Bảng Phối hợp Đại từ (`Grammar Pieces + Pronoun Table`)**: Sơ đồ `[Chủ ngữ S] + [To Be V] + [Bổ ngữ C]`.
  4. **Cấu trúc 3 Thể (`polarityMatrix`)**: Bảng đối chiếu 3 cột màu trực quan **Khẳng định (`+`) · Phủ định (`-`) · Nghi vấn (`?`)**, giải thích rõ quy tắc viết tắt (`I'm, You're, He's, isn't, aren't`, lưu ý `am not` không viết tắt thành `amn't`, và câu trả lời ngắn `Yes, I am` cấm viết tắt).
  5. **Cách Phân tích & Mẹo Nhận biết Nhanh (`recognitionTips`)**: Thuật toán 3 bước giúp học viên nhìn Chủ ngữ, Dấu câu (`?`, `not`) và Mạo từ (`a/an`) để chọn đáp án đúng ngay lập tức.
  6. **Ví dụ Giảng giải — Mổ xẻ Thành phần Câu (`annotatedExamples`)**: Tách câu thành từng chip thành phần ngữ pháp (`[Mai -> Chủ ngữ số ít] + [is -> Động từ To Be] + [a caring nurse -> Bổ ngữ danh từ]`) kèm lời giảng giải chi tiết.

### 1.3. Lộ trình Chia theo Chặng Năng lực (`Stage-Grouped Roadmap`)
- Tuần 1 được chia thành **3 Chặng học (Learning Stages)** rõ ràng thay vì danh sách 7 ngày rời rạc:
  - **Chặng 1 (Ngày 1–2)**: *Nền tảng Ngữ âm IPA, Đại từ Nhân xưng & Động từ To Be*.
  - **Chặng 2 (Ngày 3–4)**: *Đánh vần Tên Riêng, Phản xạ Hỏi - Đáp Wh-/Yes-No & Nghe - Đọc Thực chiến*.
  - **Chặng 3 (Ngày 5–7)**: *Thực hành Sản sinh (Viết & Nói), Chuyển giao Bối cảnh Mới & Tuần hoàn*.

---

## 2. Tri thức Thiết kế UI/UX & Nền Động (`UI/UX Pro Max & Live Ambient Canvas`)
- **Bố cục Rộng 2 Cột (`Wide 2-Column Studio Workspace` — `1440px`)**:
  - Tránh bố cục 1 cột hẹp ở giữa gây lãng phí khoảng trống hai bên màn hình.
  - Trong màn hình học (`Runner`), cột trái là `Mục lục bài học + Mẹo giải mã IPA` cố định (`sticky`), cột phải là nội dung bài học kèm thanh **Chuyển nhanh Ngày 1–7** ở trên cùng.
- **Nền Động Đa Tầng (`Multi-Layered Live Interactive Background`)**:
  - Kết hợp 4 lớp: (1) Lưới chấm kiến trúc `Dot-Matrix Grid` trôi nhẹ, (2) 5 quầng sáng `Aurora Orbs`, (3) Sóng âm thanh & vòng cộng hưởng `Animated SVG Soundwaves`, (4) Canvas 60fps tương tác chuột (`initLiveBackground()`) với 38 hạt ánh sáng nối dây chòm sao và các thẻ ký hiệu IPA bay lơ lửng.
  - Luôn tôn trọng `prefers-reduced-motion: reduce` để đảm bảo chuẩn trợ năng WCAG 2.1 AA.

---

## 3. Trạng thái Triển khai Hiện tại (Deployment & Repository Reality)
- **GitHub Repository**: `https://github.com/ImGib/Lingora.git` (nhánh `main`).
- **Customer Demo Prototype URL (Vercel Production)**: `https://lingora-prototype.vercel.app`
  - Project Vercel: `bao5102s-projects/lingora-prototype` (triển khai trực tiếp từ thư mục `prototype/`, đồng bộ 100% với `apps/web/public/prototype/`).
