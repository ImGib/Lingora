---
name: lingora-ui-tokens
description: Hệ thống Design Tokens, quy chuẩn Responsive, quy tắc IPA Studio (1 âm/viewport, HTML ngoài SVG) và cấu trúc Ngữ pháp 6 phần ForumFlash.
---

# LINGORA UI/UX DESIGN TOKENS & COMPONENT STANDARDS

Bộ quy chuẩn giao diện dùng chung giữa tất cả các Agent để code chuẩn ngay từ lần đầu, không bị lệch màu hay vỡ khung:

## 1. Bảng Màu "Soft Study Companion"
- Nền chính: `--bg-canvas` (`#fff9fb`), Card: `rgba(255, 255, 255, 0.95)` với `backdrop-blur-md`
- Màu chủ đạo: Indigo / Lavender (`#6f5fdf`, `#6366f1`)
- Màu nhấn thành công / Nền tảng: Mint / Emerald (`#10b981`, `#8fd8c5`)
- Màu hỗ trợ / Gợi ý: Amber / Peach (`#f59e0b`, `#f6c89f`)
- Màu cảnh báo nhẹ: Rose / Blush (`#f43f5e`, `#f3a8c4`)
- Đường viền: Border mỏng mềm mại (`border-slate-200/80` hoặc `border-indigo-100`)

## 2. Quy Chuẩn Phòng Lab Khẩu Hình IPA (Bắt buộc)
- **1 Âm / 1 Viewport:** Mỗi màn hình chỉ hiển thị đúng 1 âm qua thanh Tab chọn âm. Tuyệt đối không xếp 44 âm thành danh sách dài gây cuộn trang mệt mỏi.
- **2 Khung hình SVG:** `1. Nhìn thẳng (Môi & Răng)` và `2. Mặt cắt ngang (Lưỡi & Hơi)`.
- **Text nằm ngoài SVG bằng HTML thuần:** Mọi nhãn chú thích phải đặt trong thẻ HTML `div` hoặc `p` bên ngoài SVG. Cấm nhúng thẻ `<text>` cố định trong SVG vì sẽ tràn viền trên di động (iPhone 390px).
- **Âm thanh kép:** Luôn có 2 nút: `🔊 Chuẩn (1.0x)` và `🐢 Chậm (0.75x)`.

## 3. Quy Chuẩn Chuyên Đề Ngữ Pháp 6 Phần (ForumFlash)
Mọi component bài giảng ngữ pháp bắt buộc dựng đủ 6 phần theo thứ tự:
1. *Khái niệm & Bản chất cốt lõi*
2. *Chức năng thực tế & Ví dụ*
3. *Mảnh ghép cú pháp & Bảng chia ngôi*
4. *Cấu trúc 3 thể (+ Khẳng định, - Phủ định, ? Nghi vấn)*
5. *Dấu hiệu nhận biết & Mẹo nhận diện*
6. *Phân tích mổ xẻ câu (Color-coded chips: Chủ ngữ Xanh lá, Động từ Xanh dương, Tân ngữ Vàng cam)*
