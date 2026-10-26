# Pha 3: Nút Âm Thanh Kép, Mẹo Người Việt & Nghiệm Thu Cơ Học

## 1. Mục tiêu
- **Âm thanh song tốc:** Trang bị 2 nút nghe rõ nét: `🔊 Chuẩn (1.0x)` và `🐢 Chậm (0.75x)` ngay tại thẻ từ vựng mẫu.
- **Mẹo người Việt:** Bổ sung thẻ cảnh báo & hướng dẫn khắc phục các lỗi phát âm kinh điển của người Việt cho từng âm (ví dụ: không phân biệt `/iː/` và `/ɪ/`, nuốt âm đuôi, phát âm sai âm kẹp lưỡi `/θ/`).
- **Nghiệm thu:**
  - `pnpm --filter @lingora/web typecheck` (0 errors)
  - `pnpm verify:fast` (Mechanical parallel gates pass trong < 10s)
  - Kiểm tra 390px zero overflow trên di động.

## 2. File sửa đổi
- `04-coding/apps/web/src/components/ipa/ipa-mouth-studio.tsx`
- `04-coding/apps/web/src/components/ipa/ipa-full-chart.tsx`
