---
name: lingora-token-optimizer
description: Các nguyên tắc và cơ chế kỹ thuật để tối ưu hóa token triệt để khi vận hành 100% bằng AI (Progressive Disclosure, Context Isolation, Model Tiering, Mechanical-First Gates, Silent Fast Builds, Self-Refining Knowledge).
---

# LINGORA TOKEN OPTIMIZATION CONTRACT

Khi vận hành tự động hóa 100% bằng AI trong Lingora, mọi Agent BẮT BUỘC tuân thủ 7 nguyên lý tối ưu hóa token sau:

## 1. Kiến Trúc Tiết Lộ Tịnh Tiến (Progressive Disclosure)
- **Quy tắc $\le$ 100 dòng:** Mọi file `SKILL.md` và hướng dẫn chỉ chứa định danh, trigger, và ranh giới cốt lõi. Chi tiết chuyên sâu phải đặt trong `references/` và chỉ đọc khi có cờ hoặc yêu cầu cụ thể.
- **Không đọc trước (Zero Pre-loading):** Chỉ đọc các file tham chiếu cần thiết cho tác vụ hiện tại. Không bao giờ nạp toàn bộ thư mục `docs/` hay `curriculum/` vào ngữ cảnh.

## 2. Phân Tầng Mô Hình & Định Tuyến Vai Trò (Model Tiering & Routing)
- **Flash / Flash-Lite (Mô hình Siêu Tốc):** Dùng cho tìm kiếm file (`scout`), đọc lướt, kiểm tra mã lỗi, đếm dòng ngữ cảnh, tra cứu từ vựng.
- **Pro / High-Reasoning (Mô hình Chuyên Sâu):** Dành riêng cho thiết kế kiến trúc State, cấu trúc bài tập phức tạp, phân giải xung đột luồng học và kiểm thử thẩm định chéo.
- **Ngưỡng 25K tokens:** Với file hoặc dữ liệu lớn ($> 25\text{K}$ tokens), tuyệt đối không đọc thô mà phải dùng script hoặc mô hình nhẹ để trích xuất tóm tắt ngắn.

## 3. Nguyên Lý Cô Lập Ngữ Cảnh Subagent (Context Isolation)
- **Không truyền lịch sử chat (Zero Session History):** Khi giao việc cho Subagent hoặc tab mới, tuyệt đối không copy paste toàn bộ đoạn chat cũ.
- **Prompt Chuẩn 5 Thành Phần:**
  ```text
  Task: [Mô tả mục tiêu 1-2 câu]
  Allowed Files: [Danh sách file được sửa]
  Context Files: [Danh sách file chỉ đọc để lấy mẫu]
  Acceptance Criteria: [Tiêu chuẩn nghiệm thu cụ thể]
  Constraints: [Ràng buộc sư phạm / UI Tokens]
  ```
- **Báo cáo kết quả siêu gọn:** Subagent chỉ trả về: `STATUS: DONE | BLOCKED` + `1-2 câu tóm tắt`. Không in lại toàn bộ code đã viết vào hội thoại chính.

## 4. Kiểm Tra Cơ Học Nhanh & Lọc Log Câm (Silent Fast Gates)
- **Cấm chạy build dài xả log thừa:** Tuyệt đối KHÔNG chạy `pnpm build` hoặc `next build` thô khi nghiệm thu vì sẽ xả 50–100 dòng log gây nghẽn ngữ cảnh.
- **Ưu tiên lệnh Fast:**
  - `pnpm verify:fast`: Quét song song 3 package trong ~7s, lọc sạch log thừa, chỉ hiện tối đa 15 dòng lỗi nếu có.
  - `pnpm build:fast`: Build song song với incremental cache contracts, giảm 95% token stdout.
- **Kiểm tra cơ học trước tiên:** Chỉ khi máy báo lỗi cụ thể, mới nạp đúng dòng lỗi đó cho AI xử lý.

## 5. Ranh Giới Thư Mục Cứng (Directory Boundaries & Scope Lock)
- **Vùng cấm `99-deprecated/`:** Tuyệt đối không đọc, không grep, không tìm kiếm file trong thư mục này.
- **Khoanh vùng tìm kiếm:** Luôn chỉ định rõ đường dẫn thư mục khi grep/find, cấm tìm kiếm toàn bộ workspace.
- **Tái sử dụng Component:** Bắt buộc tra cứu `.agents/coordination/component-catalog.json` trước khi viết code mới để tránh viết lại các component đã có.

## 6. Nghiệm Thu Trực Quan Không Đọc Chay Mã (Visual Evidence First)
- Khi hoàn tất tính năng UI, chạy `pnpm test:ui-ux` và `pnpm test:evidence` để máy kiểm tra trợ năng, chống tràn viền và chụp ảnh thay vì đọc hàng trăm dòng CSS/HTML.
- Đính kèm ảnh qua `carousel` trong artifact để người dùng thẩm định nhanh.

## 7. Tự Động Đúc Kết Tri Thức & Script Hóa (Self-Refining Knowledge & Reusable Tooling)
- **Nguyên tắc "Gặp một lần — Đúc kết mãi mãi"**: Không để tri thức giải quyết sự cố trôi mất trong chat history.
- Ngay sau khi giải quyết bất kỳ lỗi môi trường, config, hay bất biến giao diện nào:
  1. **Đúc kết thành Skill/Knowledge**: Bổ sung ngay vào file `SKILL.md` liên quan trong `.agents/skills/`.
  2. **Tự động hóa thành Reusable Script**: Viết script điều phối trong `.agents/scripts/` và thêm lệnh `pnpm <script>` vào `package.json`.
  3. **Tích hợp vào Cổng cơ học**: Biến thành test tự động trong `test:smoke`, `test:ui-ux` hoặc `verify:fast` để mọi Agent tương lai kiểm tra bằng máy trong vài giây, tiết kiệm 100% token chẩn đoán lặp lại.

## 8. Hệ Thống Truy Xuất 3 Phân Tầng Siêu Tốc (3-Tier Zero-Token Retrieval)
- **Cấm đọc toàn bộ file lớn:** Khi cần tìm hiểu nghiệp vụ, cấu trúc trang hay giao diện, tuyệt đối KHÔNG dùng `read_file` đọc cả file hàng trăm dòng JSX/CSS.
- **Hệ thống 3 lớp tra cứu nhanh (< 50 tokens/lần):**
  1. **Lớp 1 - Tri thức & Sư phạm (`pnpm know <từ_khóa>`):** Tra cứu công thức 12 thì, 44 âm IPA, tiêu chuẩn cổng 100% Mastery, mã màu tokens trong `.agents/knowledge/` mà không chạm vào mã code.
  2. **Lớp 2 - Cấu trúc Web & Cây Component (`pnpm web <tên_trang | component>`):** Tra cứu cây component, luồng state, data fetching và các bất biến layout của từng trang (`/roadmap`, `/lab/ipa`, `/dashboard`...). Dùng `pnpm web tree` để xem toàn bộ sitemap.
  3. **Lớp 3 - Định vị Mã nguồn (`pnpm scout <tên_symbol>`):** Lấy chính xác đường dẫn file và số dòng. Dùng `node .agents/scripts/code-scout.mjs show <tên>` để xem 20 dòng định nghĩa kiểu.
- **Tự động làm mới chỉ mục:** Sau khi tạo mới file hoặc đổi export lớn, chạy `pnpm scout:index` để cập nhật `code-index.json` và `component-catalog.json`.
