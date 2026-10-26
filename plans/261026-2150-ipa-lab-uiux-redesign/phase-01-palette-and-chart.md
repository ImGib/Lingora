# Pha 1: Hệ thống Bảng 44 Âm Phân Màu Sư Phạm & Lọc Âm Vị

## 1. Mục tiêu
Thay thế giao diện danh sách 44 âm trắng xám đơn điệu bằng bảng màu ngữ âm học hiện đại:
- **Nguyên âm dài (Long Vowels):** Nền hổ phách/vàng ấm (`amber-50`), viền `amber-300`, badge nhịp `⏱️ 2 nhịp`.
- **Nguyên âm ngắn (Short Vowels):** Nền xanh dương dịu (`sky-50`), viền `sky-300`, badge nhịp `⚡ 1 nhịp`.
- **Nguyên âm đôi (Diphthongs):** Nền tím oải hương (`violet-50`), viền `violet-300`, badge `↷ Trượt âm`.
- **Phụ âm hữu thanh (Voiced Consonants):** Nền xanh ngọc (`emerald-50`), viền `emerald-300`, badge `⚡ Rung cổ`.
- **Phụ âm vô thanh (Voiceless Consonants):** Nền cam hồng (`rose-50`), viền `rose-300`, badge `💨 Bật hơi`.

## 2. File sửa đổi
- `04-coding/apps/web/src/components/ipa/ipa-full-chart.tsx`

## 3. Tiêu chí hoàn thành
- Bảng 44 âm trực quan, có thể lọc nhanh theo: Tất cả, Nguyên âm đơn, Nguyên âm đôi, Phụ âm hữu thanh, Phụ âm vô thanh.
- Thẻ âm active có hiệu ứng glow/ring nổi bật, tự động cuộn vào vùng nhìn.
