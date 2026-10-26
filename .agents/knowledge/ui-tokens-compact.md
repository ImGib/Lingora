# LINGORA UI/UX DESIGN TOKENS & ACCESSIBILITY (KNOWLEDGE ONLY)

> **Mục đích:** Bảng thông số màu sắc, khoảng cách, tương phản WCAG và kích thước chuẩn của Lingora. Không chứa CSS/JSX.

## 1. HỆ MÀU CHỦ ĐẠO "SOFT STUDY COMPANION"

| Vai Trò | Mã Màu Hex | Tên Màu | Ứng Dụng |
| :--- | :--- | :--- | :--- |
| **Nền Canvas Toàn Cục** | `#FFF9FB` | Warm Pearl Sand | Nền chính của toàn bộ trang web (dịu mắt, không lóa) |
| **Thẻ / Card Nội Dung** | `#FFFFFF` (95% blur) | Pure Glass Card | Nền của các hộp bài học, card với border mỏng mềm mại |
| **Đường Viền Thẻ** | `#E8E1EC` | Soft Border | Viền card tiêu chuẩn, không gây chói |
| **Chữ Chính (Heading/Text)** | `#34303D` | Deep Slate Violet | Độ tương phản cao $\ge 7:1$, đọc lâu không mỏi mắt |
| **Màu Nhấn Hành Động (Primary)** | `#6366F1` / `#6F5FDF` | Gentle Indigo | Nút bấm chính, tab đang chọn, liên kết điều hướng |
| **Thành Tựu / Mốc Đạt** | `#10B981` / `#059669` | Mint Emerald | Trạng thái hoàn thành bài học, 100% Mastery, thẻ thì động từ |
| **Gợi Ý / Hỗ Trợ** | `#F59E0B` / `#D97706` | Warm Amber | Nhãn gợi ý có hỗ trợ (`has_support`), cảnh báo nhẹ |
| **Âm Thanh Chậm (Slow Audio)** | `#0D9488` | Teal Calming | Nút nghe âm chậm 0.75x |

---

## 2. QUY CHUẨN TRỢ NĂNG WCAG 2.1 AA & DI ĐỘNG

1. **Độ tương phản văn bản (Contrast Ratio):**
   - Chữ thông thường: Tối thiểu `4.5:1` so với nền.
   - Chữ lớn ($\ge 18\text{pt}$ hoặc $\ge 14\text{pt}$ bold): Tối thiểu `3.0:1`.
2. **Kích thước vùng chạm cảm ứng (Touch Target):**
   - Mọi nút bấm, icon và toggle trên di động BẮT BUỘC đạt tối thiểu `44 x 44px`.
   - Nếu icon nhỏ hơn (ví dụ 24px), dùng `p-2.5` hoặc `p-3` để mở rộng vùng bấm vô hình.
3. **Tiêu chuẩn chống tràn viền di động (390px Zero Overflow):**
   - Thiết bị chuẩn nghiệm thu hẹp nhất: iPhone 390px.
   - Không có thanh cuộn ngang ngoài ý muốn (`scrollWidth <= innerWidth`).
   - Cấm đặt `width` cố định vượt quá `350px` trên mobile.
4. **Bất biến Nền Động Singleton (Background Singleton):**
   - Component `<InteractiveBackground />` CHỈ ĐƯỢC PHÉP gắn duy nhất 1 lần tại `RootLayout` (`app/layout.tsx`).
   - Tuyệt đối cấm render lại trong các trang con (`app/page.tsx`, `roadmap/page.tsx`, `lab/grammar/page.tsx`...).
5. **Quy chuẩn Lab Khẩu Hình IPA:**
   - Mỗi màn hình chỉ hiển thị đúng 1 âm vị (Strict 1 phoneme/viewport).
   - Mọi nhãn chú thích giải thích khẩu hình bắt buộc là thẻ HTML bên ngoài thẻ `<svg>`, cấm dùng thẻ `<text>` cố định trong SVG.
