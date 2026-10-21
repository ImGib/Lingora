# 🧪 Cổng Kiểm Thử & Nghiệm Thu Dành Cho QA / QC (`qa/INDEX.md`)

> **Quy tắc 3 giây:** Mọi tài liệu về **Kế hoạch Test (Test Plan)**, **Danh sách Test Cases nghiệm thu (UAT)**, **Kịch bản Giả lập Lỗi (Fault Injection)** và **Test Tự động (E2E)** đều nằm tại đây.
> 🌐 **Mở Bảng Checklist UAT Tương tác trên trình duyệt:** [https://lingora-prototype.vercel.app/stakeholder-hub.html#qa](https://lingora-prototype.vercel.app/stakeholder-hub.html#qa)

---

## 1. Danh mục Tài liệu & Công cụ trong Thư mục `qa/`

| Tệp / Thư mục | Dành cho ai? | Mục đích sử dụng |
|---|---|---|
| 📄 **[`qa/INDEX.md`](INDEX.md)** *(File hiện tại)* | QA Lead, QC, BA, PO | Tổng quan chiến lược kiểm thử, 5 cổng chất lượng (Quality Gates) & lệnh chạy test |
| 📄 **[`qa/test-cases-uat.md`](test-cases-uat.md)** | Manual QC, BA, Khách hàng | Danh sách **25 Test Cases trọng tâm** phủ kín Welcome, Check, Hôm nay, Lộ trình 3 Chặng, IPA Studio, Ngữ pháp 6 phần, Viết/Thu âm và Tiến độ |
| 📄 **[`qa/fault-scenarios.md`](fault-scenarios.md)** | Manual QC, Dev | Hướng dẫn sử dụng nút **`⚙ Giả lập`** trên Prototype để test 4 sự cố kỹ thuật (*Mất Mic, Lỗi tải bản ghi, Lỗi Audio, Nghỉ 3 ngày*) |
| 🤖 **[`qa/e2e/slice-01f.spec.ts`](e2e/slice-01f.spec.ts)** | Automation QA, Dev | Kịch bản Playwright E2E tự động kiểm tra luồng đăng nhập, nộp bài chống trùng lặp (idempotency) và chuẩn trợ năng WCAG AA |
| 🤖 **[`../apps/api/test/`](../apps/api/test/)** | Backend QA, Dev | Bộ kiểm thử Unit & Integration cho `PlanningService`, `ArtifactsService`, `QuarantineService` |

---

## 2. Năm Cổng Chất Lượng Bắt Buộc (`5 Mandatory Quality Gates`)

Trước khi nghiệm thu bất kỳ tính năng hay bài học nào của Lingora, QA/QC kiểm tra theo 5 cổng sau:

1. **Cổng 1 — Bất biến Sư phạm (`Pedagogical Invariants Gate`)**:
   - Học viên bấm `Bỏ qua` hoặc `Để sau` $\rightarrow$ Hệ thống ghi nhận bình thường, **không trừ điểm, không báo lỗi đỏ**.
   - Học viên bấm xem `Gợi ý (Hint)` hoặc `Xem lời thoại (Transcript)` $\rightarrow$ Kết quả hiển thị nhãn **`Ghi nhận: có hỗ trợ`**, không tính vào bằng chứng độc lập.
2. **Cổng 2 — Giao diện Không Tràn Viền & 1 Âm/Viewport (`Visual & Layout QC Gate`)**:
   - Trong bước **Phòng Lab Khẩu hình IPA**: Chỉ hiển thị đúng **1 âm IPA trên 1 màn hình** (chuyển qua lại bằng thanh tab), không bắt người dùng cuộn lên xuống.
   - Hai khung hình **1. NHÌN THẲNG (MÔI & RĂNG)** và **2. MẶT CẮT NGANG (LƯỠI & HƠI)** hiển thị sắc nét, chữ nằm trong khung HTML, không tràn viền ở mọi kích thước màn hình.
3. **Cổng 3 — Chuẩn Học liệu & Ngữ pháp 6 Phần (`Content & Curriculum QC Gate`)**:
   - 100% từ vựng mới có ký hiệu phiên âm IPA, hướng dẫn đánh vần và 2 nút âm thanh (`🔊 Chuẩn` & `🐢 Chậm`).
   - Bài giảng ngữ pháp (Ngày 2 & Ngày 4) có đủ **6 mục**: *1. Giải thích trọng tâm, 2. Chức năng & Ví dụ, 3. Mảnh ghép & Bảng chia ngôi, 4. Cấu trúc 3 thể (+/-/?), 5. Cách phân tích nhận biết, 6. Ví dụ giảng giải mổ xẻ câu*.
4. **Cổng 4 — An toàn Sự cố Kỹ thuật (`Fault Tolerance Gate`)**:
   - Khi Micro bị từ chối hoặc Audio lỗi, hệ thống hiển thị thông báo **"Đây là lỗi kỹ thuật, không phải lỗi của bạn"** kèm phương án thay thế (xem lời thoại hoặc viết thay cho ghi âm).
5. **Cổng 5 — Kỹ thuật Tự động (`Automated CI Gate`)**:
   - Chạy lệnh kiểm tra tự động đạt 100% Pass:
     ```powershell
     pnpm typecheck
     pnpm lint
     pnpm test
     ```
