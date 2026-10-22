---
name: lingora-visual-verifier
description: Kỹ năng chụp và kiểm chứng bằng chứng trực quan (Visual Evidence Testing) và kiểm thử UI/UX & Trợ năng (A11y WCAG 2.1 AA, 390px Zero Overflow) bằng Playwright Headless để phát hiện lỗi giao diện mà không tốn token đọc HTML/CSS.
---

# LINGORA VISUAL EVIDENCE & UI/UX VERIFIER SKILL

Kỹ năng dùng chung cho mọi Agent để tự động kiểm thử và nghiệm thu giao diện, trải nghiệm người dùng (UX) và chuẩn trợ năng (A11y) bằng máy tự động thay vì suy đoán hoặc đọc mã nguồn gây tốn token.

## 1. Nguyên Lý Tối Ưu Hóa "Mắt Nhìn Bằng Máy" (Vision-First Zero Token Waste)
- **Cấm đọc chay mã HTML/CSS để đoán giao diện**: Khi nghi ngờ vỡ layout hoặc lỗi hiển thị di động, không đọc toàn bộ file CSS hay in HTML dài hàng trăm dòng vào ngữ cảnh.
- **Kiểm thử cơ học tự động trước**:
  1. Quét trợ năng Axe-core WCAG 2.1 AA & kiểm tra chống tràn viền 390px: `pnpm test:ui-ux`.
  2. Kiểm tra sức khỏe hạ tầng (CORS, DB live, Auth): `pnpm test:smoke`.
  3. Chụp ảnh màn hình 6 luồng trọng yếu: `pnpm test:evidence`.

## 2. Quy Trình Vận Hành 3 Lệnh Chính:

```bash
# 1. Kiểm thử UI/UX & A11y (0 lỗi tràn viền mobile 390px, 0 vi phạm WCAG AA)
pnpm test:ui-ux

# 2. Kiểm thử khói hạ tầng (CORS preflight, DB connection, Auth)
pnpm test:smoke

# 3. Chụp tự động 6 ảnh bằng chứng trực quan Desktop + Mobile
pnpm test:evidence
```

## 3. Quản Lý Bằng Chứng Trực Quan:
- Thư mục lưu ảnh máy chụp: `05-testing/evidence/`
  - `01-landing-desktop.png` & `02-landing-mobile.png`: Landing page
  - `03-roadmap-desktop.png`: Bản đồ 4 mốc IELTS
  - `04-lab-ipa-desktop.png`: Lab 44 âm & khẩu hình
  - `05-lab-grammar-desktop.png`: Thư viện Masterclass ForumFlash
  - `06-dashboard-desktop.png`: Bàn học hôm nay / Auth guard
- **Báo cáo Carousel**: Nhúng ảnh vào artifact dạng `carousel` Markdown để người dùng và agent thẩm định ngay lập tức mà không xả token vào luồng chat chính.
