# Kế Hoạch Nhiệm Vụ: [Tên Nhiệm Vụ]

> **Phạm vi cô lập:** `apps/web/src/...`  
> **Ngày khởi tạo:** 2026-10-21 · **Agent phụ trách:** [Tên Agent]

## 1. Mục Tiêu & Nguồn Chân Lý
- **Mục tiêu:** [Mô tả ngắn gọn 1 câu về tính năng cần xây dựng]
- **SoT tham chiếu:** `00-intake/sot/...` và `03-dd/screens/...`

## 2. Ranh Giới Quyền Ghi (Allowed Files)
- `apps/web/src/components/...`
- `apps/web/src/app/...`

## 3. Các Pha Thực Thi (Chi tiết đọc on-demand)
- [ ] **Pha 1: Khởi tạo Component & DTOs** $\rightarrow$ xem `phase-01-setup.md`
- [ ] **Pha 2: Tích hợp Logic & Invariants** $\rightarrow$ xem `phase-02-core.md`
- [ ] **Pha 3: Kiểm chứng & Hoàn tất** $\rightarrow$ xem `phase-03-verify.md`

## 4. Lệnh Nghiệm Thu Cơ Học
```bash
pnpm --filter @lingora/web typecheck
```
