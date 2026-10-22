---
name: lingora-visual-verifier
description: Kỹ năng chụp và kiểm chứng bằng chứng trực quan (Visual Evidence Testing) bằng Playwright Headless để phát hiện lỗi vỡ UI, layout shift mà không tốn token đọc HTML/CSS.
---

# LINGORA VISUAL EVIDENCE & REGRESSION SKILL

Kỹ năng dùng chung cho mọi Agent để tự động kiểm thử và nghiệm thu giao diện bằng hình ảnh thực tế thay vì suy đoán hoặc đọc mã nguồn gây tốn token.

## 1. Nguyên Lý Tối Ưu Hóa "Mắt Nhìn Bằng Máy" (Vision-First Zero Token Waste)
- **Cấm đọc chay mã HTML/CSS để đoán giao diện**: Khi nghi ngờ vỡ giao diện, không đọc toàn bộ file CSS hay in HTML dài hàng trăm dòng vào ngữ cảnh.
- **Chụp ảnh tự động**: Kích hoạt Playwright Headless chụp trực tiếp các trang trọng yếu ở 2 kích thước chuẩn: Desktop (1440x900) và Mobile (390x844).

## 2. Quy Trình Vận Hành 3 Bước:
1. **Chạy lệnh chụp tự động:**
   ```bash
   # Chụp trên môi trường Production (mặc định)
   pnpm test:evidence

   # Hoặc trỏ vào môi trường local khi đang dev
   BASE_URL=http://localhost:3000 pnpm test:evidence
   ```
2. **Kiểm tra ảnh tại thư mục đích:**
   - Thư mục lưu trữ: `05-testing/evidence/`
   - Các file chuẩn:
     - `01-landing-desktop.png` & `02-landing-mobile.png`: Landing page
     - `03-roadmap-desktop.png`: Bản đồ 4 mốc IELTS
     - `04-lab-ipa-desktop.png`: Lab 44 âm & khẩu hình
     - `05-lab-grammar-desktop.png`: Thư viện Masterclass ForumFlash
     - `06-dashboard-desktop.png`: Bàn học hôm nay / Auth guard
3. **Báo cáo bằng chứng qua Carousel trong Artifact:**
   - Sao chép ảnh vào thư mục artifact (`C:\Users\admin\.gemini\antigravity-cli\brain\<conversation-id>\evidence/`).
   - Nhúng vào artifact dạng `carousel` Markdown để người dùng và agent thẩm định ngay lập tức mà không xả token vào luồng chat chính.
