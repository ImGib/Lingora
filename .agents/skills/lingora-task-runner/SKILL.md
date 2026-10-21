---
name: lingora-task-runner
description: Kỹ năng điều phối tự động nhận task, khóa task nguyên tử và xác minh chất lượng tự động bằng pnpm typecheck trước khi đóng task.
---

# LINGORA ATOMIC TASK RUNNER SKILL

Kỹ năng dùng chung cho mọi Agent để tự vận hành vòng đời task mà không cần con người nhắc nhở:

## Vòng Đời Task 4 Bước:
1. **Quét Task Khả Dụng:** Đọc file `.agents/coordination/parallel-task-pool.json`, tìm task đầu tiên có `"status": "AVAILABLE"`.
2. **Khóa Nguyên Tử (Lock):**
   - Đổi `"status"` $\rightarrow$ `"IN_PROGRESS"`
   - Gán `"assigned_agent"` $\rightarrow$ Tên Agent
   - Gán `"locked_at"` $\rightarrow$ Thời gian hiện tại
   - Gán `"progress_percentage"` $\rightarrow$ `15`
3. **Thực Thi Trong Khu Vực Được Giao:**
   - Chỉ sửa hoặc tạo các file trong mảng `"allowed_files"`.
   - Sử dụng các component dùng chung đã có sẵn trong `apps/web/src/components/common/`.
4. **Kiểm Chứng Độc Lập:**
   - Chạy: `pnpm --filter @lingora/web typecheck`
   - Chỉ khi lệnh thoát với mã `0 error`, mới cập nhật `"status": "COMPLETED"`, `"progress_percentage": 100`.
