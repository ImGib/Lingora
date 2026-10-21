# Cấu Trúc Phân Tầng Thư Mục Chuẩn 00 -> 09 & 99 (Lingora Phased Directory Architecture)

> **Mô hình kiến trúc phân bổ ranh giới chuẩn hóa 1:1 theo TDC PRJ_FOLDER phục vụ vận hành 100% bằng AI đa tác tử.**

Toàn bộ dự án được phân chia thành các tầng công việc được đánh số để mọi Agent tự động nhận diện phạm vi, ranh giới quyền ghi và luồng phụ thuộc một chiều (`Upstream SoT`):

| Tầng / Thư Mục | Tên Giai Đoạn & Bản Chất | Quyền Của Agent | Mục Đích & Ghi Chú |
| :--- | :--- | :---: | :--- |
| **`00-intake/`** | Nguồn Tri Thức Thô (Raw SoT) | Chỉ Đọc (Read-Only) | Khung CEFR A1-B2, Chuẩn 44 âm vị IPA, 4 Bất biến sư phạm cốt lõi, Glossary |
| **`01-rd/`** | Định Nghĩa Yêu Cầu & Giáo Trình | Đọc / Ghi (RD Agent) | Toàn bộ học liệu bài học (`01-rd/curriculum/`), User Stories & Tiêu chí nghiệm thu (`01-rd/requirements/`) |
| **`02-bd/`** | Thiết Kế Cơ Bản (Basic Design) | Đọc / Ghi (Architect) | Sơ đồ màn hình (Screen Flow), Cấu trúc lộ trình 4 mốc IELTS, Sơ đồ ERD khái niệm |
| **`03-dd/`** | Thiết Kế Chi Tiết & Hợp Đồng | Đọc / Ghi (Lead Dev) | Đặc tả màn hình IPA Studio, ForumFlash 6 phần, API REST specs, Roadmap interfaces |
| **`04-coding/`** | Toàn Bộ Mã Nguồn Phát Triển | Đọc / Ghi (Dev Workers) | Frontend Next.js (`04-coding/apps/web`), Backend NestJS (`04-coding/apps/api`), Shared Packages |
| **`05-testing/`** | Kiểm Thử Tự Động & QA | Đọc / Ghi (QA Agent) | Kịch bản Playwright E2E (`05-testing/e2e`), 25 Test cases UAT, 5 Kịch bản giả lập lỗi |
| **`06-delivery/`** | Đóng Gói Bàn Giao & Bản Phát Hành | Đọc / Ghi (Release Lead) | Release Notes theo mốc Milestone M1, Hướng dẫn cài đặt, Báo cáo nghiệm thu |
| **`07-design/`** | Bản Mẫu Tương Tác & Design Tokens | Đọc / Ghi (Designer) | Prototype tương tác độc lập (`index.html`, `app.js`), Bảng màu Soft Study (`design-tokens.json`), SVG khẩu hình |
| **`08-deploy/`** | Hạ Tầng Triển Khai & CI/CD | Đọc / Ghi (DevOps) | Cấu hình Vercel, Docker Supabase PostgreSQL, GitHub Actions workflows |
| **`09-feedback/`** | Thu Thập Phản Hồi & Bug Log | Đọc / Ghi (Support) | Nhật ký lỗi người dùng (`feedback-log.md`), Phân loại P0/P1/P2 |
| **`99-deprecated/`** | Vùng Cấm AI / Rác Đã Loại Bỏ | **CẤM TRUY CẬP** | Code thử nghiệm cũ, prototype lỗi thời. Tuyệt đối không đọc/grep |
| **`plans/`** | Kế Hoạch Vận Hành Từng Phiên | Đọc / Ghi (Planner) | Đặt tên theo `plans/{YYMMDD}-{HHmm}-{slug}/`, file `plan.md` bắt buộc $\le 80$ dòng |
| **`reports/`** | Báo Cáo Cơ Học & Lưu Vết Kiểm Tra | Đọc / Ghi (Audit Lead) | Báo cáo typecheck, audit độ dài context, token benchmarks (tránh xả log vào chat) |

---

## 🔒 Quy Tắc Bất Biến Về Ranh Giới (Isolation Invariants)

1. **Phân làn ghi (Write Boundary):**
   - Agent thuộc làn nào chỉ được phép ghi vào đúng thư mục của tầng đó theo task pool.
   - Ví dụ: Worker làm UI bài tập ở `04-coding/apps/web/src/components/ipa/` tuyệt đối không tự ý sửa `00-intake/` hay `01-rd/`.
2. **Luồng phụ thuộc một chiều (Single Source of Truth):**
   - `00-intake` $\rightarrow$ `01-rd` $\rightarrow$ `02-bd` $\rightarrow$ `03-dd` $\rightarrow$ `04-coding` $\rightarrow$ `05-testing` $\rightarrow$ `06-delivery`.
   - Nếu phát hiện mâu thuẫn, Agent không được tự suy đoán mà phải tôn trọng tầng thượng nguồn (`Upstream`).
3. **Lá chắn rác (`99-deprecated`):**
   - Mọi file cũ hoặc ý tưởng đã loại bỏ phải dời vào `99-deprecated/`. AI coi thư mục này là "vô hình" trong mọi thao tác quét/tìm kiếm.
