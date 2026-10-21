# BỘ KHUNG KIẾN TRÚC VẬN HÀNH 100% BẰNG AI (AI-AUTONOMOUS BASE ARCHITECTURE KIT)

> **MỤC TIÊU CỐT LÕI:**
> Tài liệu này chuẩn hóa toàn bộ "Hệ điều hành AI" (AI Operating System) được đúc kết từ kinh nghiệm thực chiến của dự án **`TDC/PRJ_FOLDER`**.
> Bộ khung này đóng vai trò là **NỀN TẢNG DÙNG CHUNG (BASE KIT)**. Khi bắt đầu bất kỳ dự án mới nào (Web, Mobile, AI SaaS, E-commerce, ERP), chỉ cần copy bộ khung này sang mà **không cần học hỏi lại từ đầu**, chỉ việc thừa kế và phát triển tính năng mới.

---

## 🛑 PHẦN 1: MA TRẬN 6 RỦI RO CHÍ MẠNG & CƠ CHẾ HÓA GIẢI KHI CHẠY 100% BẰNG AI

| Mã | Rủi Ro Chí Mạng | Bản Chất Nguy Hiểm | Cơ Chế Hóa Giải Đã Tích Hợp (TDC Style) |
| :---: | :--- | :--- | :--- |
| **R1** | **Ảo giác kiến trúc & Mất trí nhớ (`Context Drift`)** | Khi phiên chat vượt quá 70% context, LLM bắt đầu quên các ràng buộc cốt lõi và tự sáng tác logic mâu thuẫn. | • **Progressive Disclosure:** File chỉ dẫn $\le 100$ dòng; file kế hoạch $\le 80$ dòng.<br>• **Decision Registry (P1):** Đóng băng quyết định trong file YAML máy đọc, đọc trước mỗi phiên. |
| **R2** | **Xâm lấn phạm vi & Xung đột ghi đè (`Scope Drift`)** | Khi 3-5 AI làm việc song song, các Agent sửa đè vào file của nhau hoặc file cấu hình chung gây gãy build. | • **Directory Isolation:** Mỗi task chỉ có quyền ghi trong `allowed_files`.<br>• **Boundary Watchdog:** Lệnh `verify-boundary` tự động đối chiếu git diff, chặn đóng task nếu sửa file ngoài luồng. |
| **R3** | **Vòng lặp đốt token khi gỡ lỗi (`Circular Debug Loops`)** | Agent gặp lỗi compile/test, tự đoán mò và sửa lan man qua 5-10 lượt gọi tool, tiêu tốn $100\text{k}-200\text{k}$ tokens. | • **Mechanical-First Gate:** Bắt buộc chạy `pnpm typecheck` trước khi hỏi LLM.<br>• **Silent-Log:** Đẩy toàn bộ log lỗi vào `reports/`, chỉ trích xuất 3-5 dòng lỗi chính vào prompt. |
| **R4** | **Báo cáo hoàn thành ảo & Thỏa hiệp (`Sycophancy`)** | Agent tự tuyên bố "Đã xong 100%" mà không kiểm chứng lệnh thật, hoặc vội vã lùi bước khi bị chất vấn. | • **Gate Verification:** Phải có exit code `0` từ script máy mới được đổi trạng thái `COMPLETED`.<br>• **SoT Hierarchy:** P0 (User) > P1 (Decisions) > P2 (Design) > P3 (Code) > P4 (AI Inference). |
| **R5** | **Tắc nghẽn nhiệm vụ bị treo (`Zombie Deadlock`)** | Agent bị crash, hết token giữa chừng hoặc tab bị đóng, khiến task bị khóa vĩnh viễn ở `IN_PROGRESS`. | • **Watchdog Auto-Pruning:** `task-coordinator.mjs` tự động thu hồi và mở lại task (`AVAILABLE`) sau 45 phút không hoạt động. |
| **R6** | **Tái tạo bánh xe vô ích (`Component Duplication`)** | Agent tự viết lại các nút bấm, modal, background đã có sẵn, làm tăng 80% lượng code thừa. | • **Component Catalog:** Bắt buộc import từ `.agents/coordination/component-catalog.json`. |

---

## 🏛️ PHẦN 2: CHUẨN THƯ MỤC PHÂN TẦNG 00 $\rightarrow$ 09 & 99 (THE 11-PHASE LIFECYCLE)

Toàn bộ dự án tuân thủ nghiêm ngặt 11 tầng phân định trách nhiệm một chiều:

```text
Project_Root/
├── 00-intake/         ← Tri thức gốc (Raw SoT, Specs chuẩn, Glossary) [Chỉ đọc]
├── 01-rd/             ← Phân tích yêu cầu (User Stories, UAT Criteria, Syllabus)
├── 02-bd/             ← Thiết kế cơ bản (Screen Flow, Kiến trúc lộ trình, Sơ đồ ERD)
├── 03-dd/             ← Thiết kế chi tiết & Hợp đồng (Screen detail specs, API DTOs)
├── 04-coding/         ← Toàn bộ mã nguồn thực thi (Frontend, Backend, Packages)
├── 05-testing/        ← Kiểm thử tự động (Playwright E2E, Test cases, Giả lập lỗi)
├── 06-delivery/       ← Đóng gói bàn giao & Release Notes theo Milestone
├── 07-design/         ← Bản mẫu tương tác (Prototype), Design Tokens, SVG assets
├── 08-deploy/         ← Cấu hình hạ tầng triển khai (Vercel, Docker, CI/CD)
├── 09-feedback/       ← Tiếp nhận & phân loại phản hồi người dùng (P0/P1/P2)
├── 99-deprecated/     ← VÙNG CẤM AI (Code/Tài liệu cũ, cấm Agent đọc/grep)
│
├── plans/             ← Kế hoạch từng phiên: plans/{YYMMDD}-{HHmm}-{slug}/ (plan.md ≤ 80 dòng)
├── reports/           ← Báo cáo cơ học: reports/{type}/{stamp}-{name}.log (tránh xả log vào chat)
├── .agents/           ← Não bộ điều phối AI (coordinator, memory, skills, contracts)
└── AGENTS.md          ← Bản hợp đồng tối thượng nạp đầu phiên cho mọi AI
```

---

## ⚡ PHẦN 3: ĐỘNG CƠ ĐIỀU PHỐI ĐA AGENT (`TASK-COORDINATOR ENGINE`)

Được vận hành bởi công cụ điều phối CLI [`.agents/scripts/task-coordinator.mjs`](../scripts/task-coordinator.mjs):

| Câu lệnh CLI | Mục Đích & Cơ Chế An Toàn |
| :--- | :--- |
| `node .agents/scripts/task-coordinator.mjs claim [AgentName]` | Tự động nhận task trống (`AVAILABLE`), khóa nguyên tử, tự quét và mở khóa zombie task quá 45 phút. |
| `node .agents/scripts/task-coordinator.mjs generate-prompt <ID>` | Sinh ra gói Prompt nén ($\approx 200$ tokens, Zero Session History) sẵn sàng paste sang tab mới / subagent. |
| `node .agents/scripts/task-coordinator.mjs verify-boundary <ID>` | **Scope Drift Watchdog:** Đối chiếu git diff với `allowed_files`. Báo lỗi ngay nếu AI sửa file ngoài phạm vi. |
| `node .agents/scripts/task-coordinator.mjs complete <ID>` | Chạy kiểm tra Scope Drift, nghiệm thu và cập nhật trạng thái `COMPLETED` 100%. |
| `node .agents/scripts/task-coordinator.mjs checkpoint <ID> <%>` | Lưu vết tiến độ khẩn cấp khi sắp hết context window để tab khác tiếp quản mượt mà. |
| `node .agents/scripts/task-coordinator.mjs audit-context` | Tự động quét kiểm tra xem có file `SKILL.md` nào vượt quá giới hạn 100 dòng hay không. |

---

## 🚀 PHẦN 4: HƯỚNG DẪN KÉO BỘ KHUNG BASE SANG DỰ ÁN MỚI TRONG 3 BƯỚC

Khi khởi tạo một dự án mới hoàn toàn, bạn **không cần phát minh lại bánh xe**:

1. **Bước 1 (Copy lõi Base Kit):**
   * Copy toàn bộ thư mục `.agents/`
   * Copy file `AGENTS.md`
   * Tạo sẵn bộ khung thư mục: `00-intake/`, `01-rd/`, `02-bd/`, `03-dd/`, `04-coding/`, `05-testing/`, `06-delivery/`, `07-design/`, `08-deploy/`, `09-feedback/`, `99-deprecated/`, `plans/`, `reports/`.
2. **Bước 2 (Nạp đầu vào ban đầu):**
   * Đặt tài liệu yêu cầu khách hàng hoặc specs gốc vào `00-intake/`.
   * Cập nhật danh sách task ban đầu vào `.agents/coordination/parallel-task-pool.json`.
3. **Bước 3 (Khai hỏa AI):**
   * Gõ: `node .agents/scripts/task-coordinator.mjs claim Codex` $\rightarrow$ AI bắt đầu coding song song ngay lập tức với 100% cơ chế bảo vệ token và chống xung đột file!
