# Mẫu Prompt Giao Việc Chuẩn Cô Lập Ngữ Cảnh (TDC-Style Context Isolation)

Dùng mẫu này khi gửi lệnh cho Subagent hoặc copy sang Tab Codex / Claude Code mới:

```text
[TASK OBJECTIVE]
Xây dựng component [Tên Component] tại [Đường dẫn file].

[WORK CONTEXT]
Project Root: C:\BaoTG\Lingora
Isolated Directory: [apps/web/src/...]

[ALLOWED FILES - STRICT WRITE BOUNDARY]
- [file 1]
- [file 2]

[REFERENCE FILES - READ ONLY]
- .agents/skills/lingora-core-invariants/SKILL.md
- .agents/coordination/component-catalog.json

[ACCEPTANCE CRITERIA]
1. Tuân thủ 100% Invariants: Skipped != Failed, Support != Independent.
2. Tái sử dụng component có sẵn trong catalog, không tự viết lại nút bấm/nền.
3. Không có lỗi TypeScript khi chạy lệnh nghiệm thu.

[VERIFICATION COMMAND]
pnpm --filter @lingora/web typecheck

[REPORT FORMAT]
Kết thúc bằng:
STATUS: DONE | BLOCKED
Summary: [1-2 câu tóm tắt những file đã thay đổi]
```
