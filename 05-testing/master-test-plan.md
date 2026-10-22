# Kế Hoạch Kiểm Thử Toàn Diện: UT, IT, Automation Test & UI/UX Accessibility Có Visual Evidence

> File tài liệu chuẩn hóa chiến lược kiểm thử 4 tầng của Lingora: Unit Testing (UT), Integration Testing (IT), Automation E2E kèm Visual Evidence, và Kiểm thử Chuyên sâu UI/UX & Trợ năng (A11y WCAG 2.1 AA).

Chi tiết kế hoạch đầy đủ xem tại artifact: [master-test-plan.md](file:///C:/Users/admin/.gemini/antigravity-cli/brain/7c845691-d1fd-407a-8bab-908e3ca1931a/master-test-plan.md).

## Tóm tắt 4 Tầng Kiểm Thử:
1. **Tầng 1 (Unit Testing - UT)**:
   - Backend: 29 tests hiện có (Vitest) + bổ sung kiểm thử Health và Auth Verifier.
   - Frontend: Vitest + RTL kiểm tra bất biến 1 âm/viewport của IPA, 6 phần ForumFlash ngữ pháp, và luật `Skipped != Failed`.
2. **Tầng 2 (Integration Testing - IT & Smoke Test)**:
   - Endpoint `GET /health` trả về trạng thái sống/chết của Postgres Pool và Clerk Auth.
   - Script `pnpm test:smoke` tự động kiểm tra CORS, kết nối DB thật trước khi deploy.
3. **Tầng 3 (Automation Test có Visual Evidence)**:
   - Playwright E2E phủ 6 luồng màn hình chính ở 2 kích thước (Desktop 1440x900 & Mobile 390x844).
   - Tự động lưu ảnh chụp bằng chứng vào `05-testing/evidence/` và tạo Carousel Report.
4. **Tầng 4 (Kiểm thử UI/UX & Trợ năng A11y WCAG 2.1 AA)**:
   - Tự động quét vi phạm khả năng tiếp cận bằng `@axe-core/playwright` (`pnpm test:ui-ux`).
   - Kiểm tra chống tràn viền di động trên khung 390px (`scrollWidth <= innerWidth`).
   - Kiểm tra diện tích chạm tối thiểu (Touch Target $\ge 44 \times 44\text{px}$).
   - Kiểm tra tỷ lệ tương phản màu sắc (Contrast Ratio $\ge 4.5:1$).
   - Kiểm tra an toàn chuyển động (`prefers-reduced-motion` và nút toggle nền 60fps).
