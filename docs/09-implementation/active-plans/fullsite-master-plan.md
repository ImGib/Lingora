# 🌐 Kế Hoạch Triển Khai Toàn Diện Website Hoàn Chỉnh (`Fullsite Implementation Plan`)

**Đường dẫn tài liệu:** `docs/09-implementation/active-plans/fullsite-master-plan.md`  
**Trạng thái:** 🟡 **ĐANG BẮT ĐẦU TRIỂN KHAI**  
**Mục tiêu:** Chuyển hóa toàn bộ codebase `apps/web` thành một **nền tảng học tiếng Anh trực tuyến hoàn chỉnh (Production-grade SaaS Platform)** với đầy đủ các trang công khai (Landing, Roadmap 3 Chặng), khu vực học viên (Dashboard, Lab IPA, Lab Ngữ pháp, Trình chạy bài học đa bước), và kết nối dữ liệu Supabase/Clerk.

---

## 📊 Bảng Theo Dõi Tiến Độ Toàn Diện (Fullsite Progress Board)

| Chặng (Stage) | Nội dung triển khai chính | Trạng thái | Tiến độ |
| :--- | :--- | :---: | :---: |
| **Stage 1** | **Hệ Thống Điều Hướng Đa Trang & Landing Page Hoàn Chỉnh**<br>• Header & Footer toàn trang có Auth Clerk<br>• Landing Page tương tác (Hero, So sánh phương pháp, Demo tại chỗ)<br>• Trang Lộ trình 3 Chặng (`/roadmap`) | 🟡 **SẴN SÀNG** | 0% |
| **Stage 2** | **Dashboard Học Viên & Trung Tâm Học Tập Cá Nhân Hóa**<br>• Trang Kế hoạch Hôm nay (Học 20p vs Học nhẹ 5p)<br>• Trang Phòng Lab 44 âm IPA chuyên biệt (`/lab/ipa`)<br>• Trang Thư viện Masterclass Ngữ pháp (`/lab/grammar`) | ⏳ Chờ Stage 1 | 0% |
| **Stage 3** | **Lesson Runner Đa Bước Chuẩn Chỉnh**<br>• Tích hợp luồng 5 bước: Khởi động IPA $\rightarrow$ Từ vựng $\rightarrow$ Ngữ pháp $\rightarrow$ Luyện tập $\rightarrow$ Ghi nhận<br>• Cơ chế cứu hộ kỹ thuật khi mất mic/lỗi audio | ⏳ Chờ Stage 2 | 0% |
| **Stage 4** | **Tích Hợp API Supabase, Lưu Tiến Độ Đám Mây & Deploy**<br>• Kết nối NestJS API lưu bài làm vào PostgreSQL<br>• Chế độ Khách (Guest mode) lưu `localStorage` khi chưa đăng nhập<br>• Kiểm thử E2E Playwright và xuất bản Vercel Production | ⏳ Chờ Stage 3 | 0% |

---

## 🧭 Cấu Trúc Tuyến Đường Đích (Target Route Map)

```text
apps/web/src/app/
├── page.tsx                     👉 Trang chủ Landing Page hoàn chỉnh
├── roadmap/page.tsx             👉 Lộ trình 3 Chặng (90 Ngày)
├── lab/
│   ├── ipa/page.tsx             👉 Phòng Lab 44 âm IPA (1 âm/viewport)
│   └── grammar/page.tsx         👉 Thư viện Ngữ pháp 6 phần
├── dashboard/page.tsx           👉 Kế hoạch Hôm nay & Tiến độ người học
├── lessons/[lessonId]/page.tsx  👉 Trình chạy bài học 5 bước tương tác
└── layout.tsx                   👉 Khung nền động 60fps & Clerk Auth Provider
```
