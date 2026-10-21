# Sơ Đồ Phân Cấp Màn Hình (Screen Hierarchy & Navigation Flow — Phase 02)

```mermaid
flowchart TD
    A["Màn 1: Landing Page (/)<br/>Hero tương tác, Khám phá 4 Mốc, CTA kép"] --> B["Màn 2: Lộ trình 4 Mốc (/roadmap)<br/>Interactive Roadmap, Chi tiết kiến thức"]
    A --> C["Màn 3: Dashboard Học Viên (/dashboard)<br/>Thẻ Hôm nay 20p vs 5p, Vườn sinh trưởng"]
    C --> D["Màn 4: Phòng Lab Khẩu Hình IPA (/lab/ipa)<br/>Thanh Tab 44 âm, 1 âm/viewport"]
    C --> E["Màn 5: Thư Viện Ngữ Pháp (/lab/grammar)<br/>Danh mục 6-part ForumFlash A1-B2"]
    C --> F["Màn 6: Trình Chạy Bài Học (/lessons/[id])<br/>Luồng 5 bước: Khẩu hình → Từ vựng → Ngữ pháp → Practice → Proof"]
```

## Bảng Đặc Tả Màn Hình:
| Mã Màn | Tên Màn Hình & Tuyến Đường | Mục Tiêu & Trải Nghiệm Cốt Lõi |
| :---: | :--- | :--- |
| **SCR-01** | Landing Page (`/`) | Giới thiệu phương pháp học không áp lực, Hero canvas 60fps, nút Dùng thử không cần đăng nhập |
| **SCR-02** | Lộ trình 4 Mốc (`/roadmap`) | Trực quan hóa 4 chặng từ A1 (3.0) đến B2 (6.5), danh sách chủ đề và dạng bài test |
| **SCR-03** | Dashboard (`/dashboard`) | Thẻ bài học gợi ý hôm nay (20 phút tiêu chuẩn vs 5 phút cứu nguy), lời chào êm dịu |
| **SCR-04** | Lab IPA (`/lab/ipa`) | Xem khẩu hình 2 góc SVG, luyện phát âm chuẩn/chậm, thu âm thử giọng |
| **SCR-05** | Lab Ngữ Pháp (`/lab/grammar`) | Thư viện ngữ pháp 6 phần mổ xẻ màu sắc (Chủ ngữ - Động từ - Tân ngữ) |
| **SCR-06** | Lesson Runner (`/lessons/[id]`) | Trình chạy bài học 5 bước, tích hợp Modal `⚙ Giả lập lỗi kỹ thuật` cho QA |
