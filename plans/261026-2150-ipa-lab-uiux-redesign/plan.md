# Kế Hoạch Nhiệm Vụ: Tái Cấu Trúc Toàn Diện UI/UX Phòng Lab 44 Âm IPA (/lab/ipa)

> **Phạm vi cô lập:** `04-coding/apps/web/src/components/ipa/`  
> **Ngày khởi tạo:** 2026-10-26 · **Agent phụ trách:** Codex

## 1. Mục Tiêu & Nguồn Chân Lý
- **Mục tiêu:** Xóa bỏ sự đơn điệu và thô ráp của Phòng Lab IPA bằng hệ thống màu sư phạm trực quan (Vowels/Consonants/Voiced), bộ SVG khẩu hình giải phẫu chi tiết cho 8 nhóm cơ âm và cụm điều khiển âm thanh song tốc (1.0x / 0.75x) kèm mẹo phát âm cho người Việt.
- **SoT tham chiếu:** `.agents/skills/lingora-ui-tokens/SKILL.md` (chuẩn 1 âm / 1 viewport, HTML outside SVG, âm thanh kép), `.agents/plugins/ui-ux-pro-max/rules/ui-ux-rules.md` (WCAG AA, Touch target 44px, Soft Study Companion).

## 2. Ranh Giới Quyền Ghi (Allowed Files)
- `04-coding/apps/web/src/components/ipa/ipa-front-view.tsx`
- `04-coding/apps/web/src/components/ipa/ipa-side-view.tsx`
- `04-coding/apps/web/src/components/ipa/ipa-mouth-studio.tsx`
- `04-coding/apps/web/src/components/ipa/ipa-full-chart.tsx`

## 3. Các Pha Thực Thi (Chi tiết đọc on-demand)
- [x] **Pha 1: Hệ thống Bảng 44 Âm Phân Màu Sư Phạm & Lọc Âm Vị** $\rightarrow$ xem `phase-01-palette-and-chart.md` (HOÀN TẤT)
- [x] **Pha 2: Nâng Cấp Hệ Thống SVG Giải Phẫu 8 Nhóm Cơ & Studio Khẩu Hình** $\rightarrow$ xem `phase-02-svg-anatomy-studio.md` (HOÀN TẤT)
- [x] **Pha 3: Tích Hợp Nút Âm Thanh Kép, Mẹo Người Việt & Nghiệm Thu Cơ Học** $\rightarrow$ xem `phase-03-verify.md` (HOÀN TẤT)

## 4. Lệnh Nghiệm Thu Cơ Học
```bash
pnpm --filter @lingora/web typecheck
pnpm verify:fast
```
