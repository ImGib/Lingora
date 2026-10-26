---
name: lingora-task-runner
description: Kỹ năng điều phối tự động nhận task, khóa task nguyên tử và xác minh chất lượng tự động bằng verify:fast trước khi đóng task.
---

# LINGORA ATOMIC TASK RUNNER SKILL

Kỹ năng dùng chung cho mọi Agent để tự vận hành vòng đời task mà không cần con người nhắc nhở:

## Vòng Đời Task 4 Bước:
1. **Nhận task mới:** Chạy `node .agents/scripts/task-coordinator.mjs claim Codex` từ repository root. Dùng `workspace_path` trả về làm gốc làm việc; không claim thêm khi đang tiếp tục task đã nhận hoặc bảo trì coordinator.
2. **Khóa Nguyên Tử (Lock):** Coordinator tự khóa task pool, kiểm tra trùng `allowed_files`, chuẩn bị Git worktree riêng, rồi gán `IN_PROGRESS`, agent, thời gian và tiến độ 15%. Không sửa task pool trực tiếp. Task đang làm không bị tự thu hồi chỉ vì quá 45 phút; chỉ `release <TASK_ID>` khi xác nhận agent đã dừng.
3. **Thực Thi Trong Khu Vực Được Giao:**
   - Chỉ sửa hoặc tạo các file trong mảng `"allowed_files"` dưới `workspace_path`; không sửa các file task trong workspace chính.
   - Sử dụng các component dùng chung đã có sẵn trong `apps/web/src/components/common/`.
4. **Kiểm Chứng Độc Lập & Tiết Kiệm Token:**
   - **Cổng cơ học siêu tốc:** Chạy `pnpm verify:fast` (song song cả contracts, api, web trong ~7s, lọc 95% log thừa).
   - **Kiểm chứng giao diện (Nếu là task UI):** Chạy `pnpm test:evidence` để sinh ảnh bằng chứng tại `05-testing/evidence/`.
   - **Đóng task:** Chỉ khi lệnh thoát với mã `0 error`, chạy `node D:\Lingora\.agents\scripts\task-coordinator.mjs complete <TASK_ID>`. Coordinator kiểm tra lại trong worktree và chỉ hợp nhất `allowed_files` khi không có xung đột.

## API Dashboard deploy gate
- `test:smoke` chỉ xác nhận CORS và `SELECT 1`; nó không xác nhận dashboard sau đăng nhập. Khi gặp 500 ở `/v1/dashboard`, kiểm tra cả `/v1/me` để xác định lỗi chung của xác thực/kết nối trước khi sửa planning logic.
- API build và `build:api:fast` phải chạy `test:predeploy`: unit tests cùng truy vấn dashboard đọc thực tế trên `DATABASE_URL`. Không deploy nếu cổng này thất bại.
- Nếu mọi route có Bearer token trả 500 còn route không token trả 401, đối chiếu `supavisor_logs` của Supabase đúng thời điểm request. Mã `28P01` / `ECHECKOUTFAILED` chỉ ra credentials của pool không hợp lệ; kiểm tra `DATABASE_URL` trên Vercel và project Supabase đích trước khi thay đổi logic dashboard.
