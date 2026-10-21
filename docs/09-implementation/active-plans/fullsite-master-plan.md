# 🏛️ Kế Hoạch Triển Khai Toàn Diện Lingora (CEFR x ForumFlash)

**Đường dẫn tài liệu:** `docs/09-implementation/active-plans/fullsite-master-plan.md`  
**Trạng thái:** 🟡 **ĐANG TRIỂN KHAI THEO KHUNG CEFR X FORUMFLASH**  
**Triết lý nền tảng:** Kết hợp mô hình **2-Step Route** và **Growth Garden** của ForumFlashStudy với Khung tham chiếu chuẩn Châu Âu **CEFR (A1 $\rightarrow$ B2 / 6.5 IELTS)**.

---

## 🗺️ 1. LỘ TRÌNH 3 CHẶNG TIẾN TRÌNH CEFR THỰC CHỨNG

| Chặng | Cấp Độ CEFR | Trọng Tâm Học Liệu ForumFlash | Mục Tiêu Ngữ Pháp & Âm Vị | Bằng Chứng Đầu Ra (Proof Gate) |
| :--- | :---: | :--- | :--- | :--- |
| **Chặng 1: Nền Tảng (Foundation)** | **A1 $\rightarrow$ A2.1** *(Breakthrough)* | • 44 âm IPA (1 âm/viewport)<br>• 200 từ vựng cốt lõi đời sống<br>• Hội thoại ngữ cảnh chậm | • Động từ *To be*, Đại từ nhân xưng, Sở hữu cách<br>• Thì Hiện tại đơn, Bảng chia ngôi<br>• Cụm câu hỏi WH- & Yes/No cơ bản | • Tự viết bài giới thiệu bản thân 3–5 câu.<br>• Thu âm phát âm chuẩn không nuốt âm cuối `/s/`, `/z/`, `/m/`.<br>• Vượt qua bài kiểm tra chéo (Transfer Check). |
| **Chặng 2: Tăng Tốc (Expansion)** | **A2.2 $\rightarrow$ B1** *(Threshold)* | • 500 từ vựng tình huống (mua sắm, công việc, du lịch)<br>• Hội thoại phản xạ 2 chiều tự nhiên | • Thì Quá khứ đơn (Động từ bất quy tắc)<br>• Thì Tương lai đơn & *Be going to*<br>• Động từ khuyết thiếu: *Can / Should / Must*<br>• So sánh hơn / So sánh nhất | • Viết nhật ký ngắn về một chuyến đi (80 từ).<br>• Ghi âm đoạn hội thoại xử lý tình huống phát sinh (90 giây).<br>• Vượt qua bài kiểm tra duy trì trí nhớ sau 7 ngày. |
| **Chặng 3: Về Đích (Mastery & IELTS)** | **B1+ $\rightarrow$ B2** *(IELTS 6.5)* | • 800 từ vựng học thuật (Academic Word List)<br>• Bài đọc báo & phân tích biểu đồ cơ bản<br>• Tư duy phản biện song ngữ | • Mệnh đề quan hệ (Relative Clauses)<br>• Câu điều kiện loại 1 & loại 2<br>• Thể bị động (Passive Voice)<br>• Liên từ học thuật: *Although, Furthermore, However* | • Viết đoạn văn nghị luận 150 từ có luận điểm mạch lạc.<br>• Trình bày bài nói độc thoại 2 phút (chuẩn format IELTS Speaking Part 2). |

---

## 🏛️ 2. SƠ ĐỒ TUYẾN ĐƯỜNG WEBSITE ĐÍCH (ROUTE MAP)

```text
apps/web/src/app/
├── (public)/
│   ├── page.tsx                     👉 Landing Page Hero + Demo Khẩu hình + So sánh phương pháp
│   ├── roadmap/page.tsx             👉 Lộ trình 3 Chặng CEFR A1 -> B2 chuẩn ForumFlash
│   └── about/page.tsx               👉 Triết lý 8 Bất biến Sư phạm & Phương pháp Growth Garden
│
├── (learner)/
│   ├── dashboard/page.tsx           👉 Kế hoạch Hôm nay 20p vs 5p + Cây năng lực Growth Tree
│   ├── lab/
│   │   ├── ipa/page.tsx             👉 Phòng Lab 44 âm IPA toàn diện (1 âm/viewport)
│   │   └── grammar/page.tsx         👉 Thư viện Masterclass Ngữ pháp 6 phần chuẩn mực
│   ├── lessons/[lessonId]/page.tsx  👉 Trình chạy bài học 5 bước: IPA -> Vocab -> Ngữ pháp -> Runner -> Proof
│   └── progress/page.tsx            👉 Hồ sơ năng lực thực tế, Lịch sử nộp bài & Bằng chứng CEFR
│
└── layout.tsx                       👉 Root layout: Canvas Nền động 60fps, HeaderNav, ClerkProvider
```

---

## 📋 3. BẢNG TIẾN ĐỘ 4 GIAI ĐOẠN TRIỂN KHAI

| Giai Đoạn | Mục Tiêu Triển Khai | Trạng Thái | Tiến Độ |
| :--- | :--- | :---: | :---: |
| **Giai Đoạn 1** | **Hoàn Thiện Landing Page & Trang Lộ Trình CEFR 3 Chặng**<br>• Xây dựng trang `/roadmap` tương tác 3 Chặng CEFR chuẩn ForumFlash<br>• Cập nhật Landing Page (`/`) với Hero, so sánh phương pháp học thực chất và Footer đầy đủ | 🟡 **SẴN SÀNG THỰC HIỆN** | 0% |
| **Giai Đoạn 2** | **Nâng Cấp Dashboard Học Viên & Hệ Thống Phòng Lab Tự Do**<br>• Cập nhật `/dashboard` Thẻ Hôm nay 20p vs 5p<br>• Trang Phòng Lab 44 âm IPA `/lab/ipa` (1 âm/viewport)<br>• Trang Thư viện Masterclass Ngữ pháp 6 phần `/lab/grammar` | ⏳ Chờ Giai đoạn 1 | 0% |
| **Giai Đoạn 3** | **Lesson Runner Đa Bước Chuẩn Chỉnh**<br>• Nối luồng 5 bước: Khẩu hình $\rightarrow$ Từ vựng $\rightarrow$ Ngữ pháp $\rightarrow$ Luyện tập $\rightarrow$ Ghi nhận<br>• Kích hoạt cứu hộ kỹ thuật khi mất mic / audio lỗi | ⏳ Chờ Giai đoạn 2 | 0% |
| **Giai Đoạn 4** | **Tích Hợp API Supabase, Lưu Tiến Độ Đa Thiết Bị & Deploy**<br>• Lưu kết quả làm bài vào PostgreSQL qua NestJS API<br>• Hỗ trợ chế độ Guest Demo lưu `localStorage`<br>• Kiểm thử E2E Playwright và xuất bản Vercel Production | ⏳ Chờ Giai đoạn 3 | 0% |
