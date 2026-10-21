# plans — Quy Chuẩn Kế Hoạch Vận Hành Đa Agent (Planning Protocol)

> **QUY CHUẨN ĐẶT TÊN & TỐI ƯU TOKEN CHO AI (Lấy cảm hứng từ TDC PRJ_FOLDER):**
> Nhằm ngăn ngừa tràn ngữ cảnh và đảm bảo tính liên tục khi bàn giao giữa các phiên làm việc, toàn bộ kế hoạch thực thi phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Quy Tắc Đặt Tên Thư Mục Kế Hoạch
Mỗi kế hoạch độc lập phải tạo một thư mục con theo cú pháp có gắn dấu thời gian:
```text
plans/{YYMMDD}-{HHmm}-{slug-nhiệm-vụ}/
```
**Ví dụ:**
- `plans/261021-1800-roadmap-view-impl/`
- `plans/261022-0900-ipa-lab-integration/`

---

## 2. Cấu Trúc File & Bất Biến $\le 80$ Dòng (`Progressive Disclosure`)
Một thư mục kế hoạch bao gồm:
```text
plans/{YYMMDD}-{HHmm}-{slug}/
├── plan.md               ← File kế hoạch tổng quan (BẮT BUỘC ≤ 80 dòng)
├── phase-01-setup.md     ← Chi tiết bước 1 (Chỉ đọc khi chạy phase 1)
├── phase-02-core.md      ← Chi tiết bước 2 (Chỉ đọc khi chạy phase 2)
└── phase-03-verify.md    ← Tiêu chí nghiệm thu & lệnh kiểm thử
```

### File `plan.md` bắt buộc chứa 5 mục:
1. **Goal & Target Directory:** Mục tiêu ngắn gọn 1 câu và thư mục bị cô lập (`isolated_directory`).
2. **Upstream SoT:** Trỏ tới tài liệu gốc trong `00-intake/` hoặc `03-dd/`.
3. **Allowed Files:** Danh sách các file được phép chỉnh sửa.
4. **Phase Checklist:** Thứ tự các pha thực thi (mỗi pha trỏ tới 1 file `phase-XX-*.md`).
5. **Verification Command:** Lệnh máy kiểm tra (`pnpm --filter @lingora/web typecheck`).

---

## 3. Mẫu Kế Hoạch Chuẩn (Template)
Xem file mẫu tham khảo tại: [`plans/_template/plan.md`](_template/plan.md).
