# 🚀 Kế Hoạch Triển Khai Coding Hệ Thống UI/UX Chuẩn Prototype 100%

**Đường dẫn tài liệu:** `docs/09-implementation/uiux-implementation-plan.md`  
**Trạng thái:** 🟡 **ĐANG TRIỂN KHAI (IN PROGRESS)**  
**Mục tiêu cốt lõi:** Chuyển giao 100% giao diện, hiệu ứng visual, phòng Lab khẩu hình IPA 1 âm/viewport, Masterclass ngữ pháp 6 phần, runner luyện tập, và trung tâm giả lập lỗi từ [`prototype/`](../../prototype/) sang [`apps/web/`](../../apps/web/) (Next.js 15 + React + Tailwind + TypeScript + Clerk Auth + NestJS API).

---

## 📊 Bảng Theo Dõi Tiến Độ Tổng Quan (Progress Tracker)

| Giai đoạn (Phase) | Nội dung triển khai chính | Trạng thái | Tỷ lệ hoàn thành |
| :--- | :--- | :---: | :---: |
| **Phase 1** | Design Tokens, Theme Soft Study Companion & Canvas Nền Động 60fps | ⏳ **SẴN SÀNG** | 0% |
| **Phase 2** | Số Hóa Khẩu Hình IPA (Mouth Studio) & Bài Giảng Ngữ Pháp 6 Phần | ⏳ **CHỜ BƯỚC 1** | 0% |
| **Phase 3** | Bộ Runner Luyện Tập Đa Dạng (Multiple Choice, Fill, Speech, Translate) | ⏳ **CHỜ BƯỚC 2** | 0% |
| **Phase 4** | Dashboard Hôm Nay, Lộ Trình 3 Chặng 90 Ngày & Modal Giả Lập Lỗi (QA Hub) | ⏳ **CHỜ BƯỚC 3** | 0% |
| **Phase 5** | Tích Hợp Real API, Playwright E2E, Kiểm Định Trợ Năng WCAG AA & Deploy | ⏳ **CHỜ BƯỚC 4** | 0% |

> ⚡ **Cơ chế chạy song song (Multi-Agent / Codex):** Để tăng tốc độ triển khai bằng nhiều AI đồng thời mà không bị xung đột code (Zero Merge Conflict), xem chi tiết phân chia 4 Làn công việc tại: [`docs/09-implementation/parallel-tasks-matrix.md`](parallel-tasks-matrix.md).

---

## 🧭 Kiến Trúc & Quy Chuẩn Bất Biến (Architecture & Invariants)

1. **Hiến pháp Sư phạm (Pedagogical Invariants):**
   - `Skipped != Failed`: Học viên bấm *Bỏ qua* hoặc *Để sau* không bao giờ bị trừ điểm hay báo lỗi đỏ.
   - `Support != Independent Evidence`: Bấm xem *Gợi ý (Hint)* hoặc *Lời thoại (Transcript)* sẽ đánh dấu "Có hỗ trợ", không tính làm bằng chứng độc lập.
   - `Technical Failure != Learner Failure`: Sự cố Micro, rớt mạng hoặc lỗi âm thanh có thông báo êm dịu và cho phép chuyển dạng bài học.
2. **Quy chuẩn Giao diện (UI/UX Invariants):**
   - **Canvas Background 60fps:** Gradient Mesh tương tác chuột nhẹ nhàng, floating particles, toggle On/Off lưu `localStorage`.
   - **Phòng Lab Khẩu Hình IPA:** Đúng **1 âm IPA trên 1 viewport**, điều hướng thanh Tab con thoi, 2 sơ đồ SVG (`1. NHÌN THẲNG` & `2. MẶT CẮT NGANG`), chữ chú thích thuần HTML nằm ngoài SVG chống tràn viền 100%.
   - **Chuyên Đề Ngữ Pháp 6 Phần:** 1. Giải thích trọng tâm $\rightarrow$ 2. Chức năng & Ví dụ $\rightarrow$ 3. Mảnh ghép & Bảng chia ngôi $\rightarrow$ 4. Cấu trúc 3 thể (+/-/?), 5. Cách phân tích nhận biết $\rightarrow$ 6. Ví dụ mổ xẻ câu.
3. **Cấu Trúc Thư Mục Component Codebase (`apps/web/src/components/`):**
   ```text
   apps/web/src/components/
   ├── common/
   │   ├── interactive-background.tsx   (Canvas 60fps dynamic mesh & particles)
   │   ├── audio-button.tsx             (Phát âm thanh chuẩn & chậm)
   │   ├── modal-fault-simulation.tsx   (Hộp thoại giả lập lỗi kỹ thuật QA/QC)
   │   └── header-nav.tsx               (Navigation bar + nút chế độ nền + Auth Clerk)
   ├── ipa/
   │   ├── ipa-mouth-studio.tsx         (Phòng Lab khẩu hình 1 âm/viewport)
   │   ├── ipa-front-view.tsx           (SVG nhìn thẳng: môi & răng)
   │   ├── ipa-side-view.tsx            (SVG mặt cắt ngang: lưỡi, vòm họng, luồng hơi)
   │   └── ipa-formula-badge.tsx        (Công thức ghép âm trực quan)
   ├── grammar/
   │   ├── grammar-masterclass.tsx      (Khung bài giảng 6 phần chuẩn mực)
   │   ├── grammar-table.tsx            (Bảng chia ngôi, mảnh ghép)
   │   └── grammar-sentence-breakdown.tsx (Mổ xẻ câu màu sắc)
   ├── practice/
   │   ├── multiple-choice-card.tsx     (Trắc nghiệm ngữ cảnh)
   │   ├── fill-blank-card.tsx          (Điền từ có hỗ trợ phân tích)
   │   ├── speech-recorder-card.tsx     (Thu âm luyện nói kèm kiểm tra micro)
   │   └── translation-writer-card.tsx  (Luyện dịch viết kèm gợi ý từng bước)
   └── roadmap/
       ├── stage-roadmap-timeline.tsx   (Lộ trình 3 Chặng 90 Ngày)
       └── daily-progress-card.tsx      (Thẻ tiến độ ngày học)
   ```

---

## 📋 Chi Tiết 5 Giai Đoạn Triển Khai (Phase Breakdown)

### 📍 Giai Đoạn 1: Design Tokens, Typography & Interactive Background Canvas
- **Mục tiêu:** Đồng bộ bảng màu Soft Study Companion, Typography và nền Canvas tương tác chuột 60fps.
- **Checklist công việc:**
  - [ ] Port đầy đủ biến màu CSS (`--bg-canvas`, `--primary`, `--accent`, `--border`) và animations vào `apps/web/src/app/globals.css`.
  - [ ] Tạo component `InteractiveBackground` tại `apps/web/src/components/common/interactive-background.tsx`.
  - [ ] Thêm nút bật/tắt hiệu ứng nền vào Header, lưu trạng thái vào `localStorage('lingora-bg-fx')`.
  - [ ] Tích hợp vào `apps/web/src/app/layout.tsx` đảm bảo chạy mượt trên mọi trang.
  - [ ] Kiểm chứng: `pnpm --filter @lingora/web typecheck` & `pnpm --filter @lingora/web lint`.

### 📍 Giai Đoạn 2: Số Hóa Khẩu Hình IPA & Masterclass Ngữ Pháp 6 Phần
- **Mục tiêu:** Xây dựng 2 component sư phạm độc quyền của Lingora chuẩn React + TypeScript.
- **Checklist công việc:**
  - [ ] Tạo component `IpaMouthStudio` với cấu trúc **1 âm/viewport** + thanh Tab chọn âm.
  - [ ] Tạo `IpaFrontView` và `IpaSideView` (SVG minh họa khẩu hình có nhãn HTML bên ngoài chống tràn viền).
  - [ ] Tạo component `AudioButton` (phát âm thanh Web Audio API / synthesis 2 chế độ Chuẩn & Chậm).
  - [ ] Tạo component `GrammarMasterclass` chuẩn 6 phần (Lý thuyết, Chức năng, Mảnh ghép, Cấu trúc, Nhận biết, Mổ xẻ câu).
  - [ ] Kiểm chứng hiển thị trên cả màn hình Desktop và Mobile (390px).

### 📍 Giai Đoạn 3: Bộ Runner Luyện Tập Đa Dạng (Practice & Assessment)
- **Mục tiêu:** Chuyển đổi 4 dạng bài tập thực hành từ prototype sang code React.
- **Checklist công việc:**
  - [ ] Tạo component `MultipleChoiceCard` (trắc nghiệm, giải thích chi tiết, nút Bỏ qua & Gợi ý).
  - [ ] Tạo component `FillBlankCard` (điền từ, hiển thị IPA gợi ý, tra từ điển mini).
  - [ ] Tạo component `SpeechRecorderCard` (sử dụng Web Audio / MediaRecorder API, cơ chế cứu hộ khi mất quyền micro).
  - [ ] Tạo component `TranslationWriterCard` (gõ bản dịch, phân tích từ vựng đối chiếu).
  - [ ] Đảm bảo ghi nhận nhãn `has_support` khi bấm gợi ý đúng theo Hiến pháp học tập.

### 📍 Giai Đoạn 4: Dashboard Hôm Nay, Lộ Trình 3 Chặng & Modal Giả Lập Lỗi (QA Hub)
- **Mục tiêu:** Giao diện tổng quan học viên, bản đồ tiến độ 90 ngày và công cụ phục vụ QA.
- **Checklist công việc:**
  - [ ] Cập nhật giao diện `apps/web/src/features/dashboard/dashboard-view.tsx` theo chuẩn prototype.
  - [ ] Tạo component `StageRoadmapTimeline` hiển thị 3 Chặng (Khởi động $\rightarrow$ Tăng tốc $\rightarrow$ Về đích).
  - [ ] Tạo component `FaultSimulationModal` (nút `⚙ Giả lập lỗi` nổi trên màn hình cho Tester).
  - [ ] Đảm bảo lưu tiến độ học tập vào `localStorage` hoặc state của phiên học.

### 📍 Giai Đoạn 5: Tích Hợp API Thực Tế, Chạy Kiểm Thử Toàn Diện & Deploy
- **Mục tiêu:** Nối API NestJS, kiểm tra Playwright E2E và deploy Production.
- **Checklist công việc:**
  - [ ] Tích hợp API DTOs từ `packages/contracts` vào các màn hình bài học.
  - [ ] Kiểm thử tự động `pnpm typecheck` đạt 100% Pass.
  - [ ] Kiểm thử cú pháp `pnpm lint` đạt 100% Pass (0 lỗi, 0 cảnh báo).
  - [ ] Chạy bộ kiểm thử E2E Playwright `pnpm e2e` (bao gồm test trợ năng WCAG AA `@axe-core/playwright`).
  - [ ] Build production `pnpm build` và kiểm tra trên môi trường Vercel.

---

## 📝 Nhật Ký Thực Hiện (Execution Log)

*Nhật ký này sẽ được cập nhật liên tục sau mỗi Phase hoàn thành.*

- **2026-10-21:** Khởi tạo kế hoạch triển khai UI/UX Coding Master Plan tại `docs/09-implementation/uiux-implementation-plan.md`. Bắt đầu chuẩn bị Phase 1.
