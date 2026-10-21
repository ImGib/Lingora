# 🚀 Bản Đồ Quản Lý Kế Hoạch Triển Khai (`docs/09-implementation/`)

**Trạng thái:** Tinh gọn & Hiện đại hóa (Consolidated for Active Execution)  
**Quy tắc:** Phân tách rõ ràng giữa **Kế hoạch Thực thi Hiện tại (Active Plans)**, **Sản phẩm Đang xây dựng (M1 Learning MVP)** và **Dữ liệu Lịch sử (Archive Legacy)**.

---

## 🧭 Cấu Trúc 3 Ngăn Tinh Gọn (Clean 3-Zone Structure)

```text
docs/09-implementation/
├── 📁 active-plans/           👉 [KẾ HOẠCH ĐANG CHẠY]
│   ├── uiux-coding-master-plan.md     (Kế hoạch 5 Phase chuyển giao 100% Prototype sang Codebase)
│   └── parallel-tasks-codex-matrix.md (Ma trận 4 Làn task song song cho Multi-AI & Codex)
│
├── 📁 m1-four-week-learning/  👉 [MILESTONE TRỌNG TÂM: HÀNH TRÌNH 28 NGÀY]
│   ├── overview.md                    (Tầm nhìn & Mục tiêu M1)
│   ├── definition-of-done.md          (Tiêu chuẩn nghiệm thu DoD)
│   ├── capability-outcomes.md         (Chuẩn đầu ra năng lực học viên)
│   ├── four-week-curriculum.md        (Khung chương trình 4 tuần)
│   ├── slices/                        (Các lát cắt phát triển: 01-entry-and-week-1.md)
│   └── curriculum/                    (Học liệu tuần 1-4 & Day drafts)
│
└── 📁 archive-legacy/         👉 [LỊCH SỬ & KẾ HOẠCH CŨ ĐÃ HOÀN THÀNH HOẶC KHÔNG CÒN PHÙ HỢP]
    ├── m0-kernel/                     (Kiểm toán M0 Kernel Slice 01A -> 01F đã hoàn thành 2026-09-26)
    └── roadmap/                       (Sơ đồ lộ trình cũ giai đoạn tiền khả thi)
```

---

## 📊 Bảng Điều Phối Kế Hoạch Hiện Tại (Active Implementation Board)

| Dự án / Gói công việc | Vị trí tài liệu | Mục tiêu & Phạm vi | Trạng thái |
| :--- | :--- | :--- | :---: |
| 🎨 **UI/UX 100% Prototype** | [`active-plans/uiux-coding-master-plan.md`](active-plans/uiux-coding-master-plan.md) | Chuyển toàn bộ Giao diện, Nền động 60fps, IPA Studio 1 âm/viewport, Masterclass Ngữ pháp 6 phần sang Next.js | 🟡 **ĐANG CHẠY** |
| ⚡ **Ma Trận Song Song Codex** | [`active-plans/parallel-tasks-codex-matrix.md`](active-plans/parallel-tasks-codex-matrix.md) | Phân chia 4 Làn công việc độc lập cho Antigravity & Codex cùng code song song không xung đột | 🟢 **SẴN SÀNG** |
| 📚 **M1: 4-Week Learning MVP** | [`m1-four-week-learning/overview.md`](m1-four-week-learning/overview.md) | Hành trình 28 ngày học thực chất cho người mất gốc, bảo đảm các bất biến học tập | 🟡 **ĐANG CHẠY** |
| 🏛️ **M0 Kernel Archive** | [`archive-legacy/m0-kernel/slice-01/README.md`](archive-legacy/m0-kernel/slice-01/README.md) | Hồ sơ chứng minh hoàn thành 01A–01F (Auth, PostgreSQL, Idempotency, RLS, Playwright) | 📦 **LƯU TRỮ** |

---

## 🎯 Quy Chuẩn Bổ Sung Kế Hoạch Mới
- Mọi kế hoạch mới phục vụ code ngay lập tức đặt tại: `docs/09-implementation/active-plans/`.
- Khi một kế hoạch kết thúc hoặc bị thay thế bởi phương án mới, chuyển vào `docs/09-implementation/archive-legacy/` để giữ thư mục thực thi luôn tinh gọn, rõ ràng cho cả lập trình viên và AI Agents.
