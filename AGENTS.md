# CODEX INSTRUCTION CONTRACT — LINGORA REPOSITORY

You are an autonomous AI coding agent operating inside the Lingora workspace (`D:\Lingora`).

## COMMON SHARED SKILLS (Auto-loaded to save context & tokens):
- **Core Invariants:** `.agents/skills/lingora-core-invariants/SKILL.md`
- **UI Tokens & Layout Rules:** `.agents/skills/lingora-ui-tokens/SKILL.md`
- **Atomic Task Runner:** `.agents/skills/lingora-task-runner/SKILL.md`
- **Token Optimization Contract:** `.agents/skills/lingora-token-optimizer/SKILL.md`
- **Visual Evidence Verifier:** `.agents/skills/lingora-visual-verifier/SKILL.md`
- **Directory Structure Architecture:** `.agents/contracts/directory-structure.md`

## YOUR MANDATORY WORKFLOW FOR A NEW POOLED IMPLEMENTATION TASK:

1. **AUTOMATIC TASK CLAIM VIA COORDINATOR SCRIPT (Fast & Zero-Race-Condition):**
   - Run command: `node .agents/scripts/task-coordinator.mjs claim Codex`
   - Claim only when starting a new pooled implementation task. Follow-up questions, coordinator maintenance, and work on an already claimed task must not claim another task.
   - It outputs `allowed_files` and an isolated `workspace_path`. Edit task files only inside that worktree. It never reassigns an `IN_PROGRESS` task based on elapsed time alone; explicitly use `release <TASK_ID>` only after confirming the owner has stopped.
   - For subagent dispatch / new chat tab: Run `node .agents/scripts/task-coordinator.mjs generate-prompt <TASK_ID>` to get a zero-history, token-optimized prompt packet.

2. **REUSE EXISTING SHARED COMPONENTS (Save 80% tokens - DO NOT REINVENT):**
   - Check `.agents/coordination/component-catalog.json` before writing any new UI component.
   - All core components (`InteractiveBackground`, `HeaderNav`, `AudioButton`, `IpaMouthStudio`, `GrammarMasterclass`, `MultipleChoiceCard`, `FillBlankCard`, `SpeechRecorderCard`, `ModalFaultSimulation`) are ALREADY built and tested. Simply import and assemble them!

3. **STRICT ISOLATION & DIRECTORY BOUNDARY:**
   - You are ONLY permitted to edit or create files explicitly listed in that claimed task's `"allowed_files"` array.
   - Explicit user requests to maintain the coordinator itself may edit its script, tests, and instructions without claiming an unrelated implementation task.
   - New claims use separate Git worktrees. Keep each agent inside its own `workspace_path` and `allowed_files`. Existing tasks claimed before this rule finish in the main workspace.
   - **VÙNG CẤM `99-deprecated/`:** Tuyệt đối KHÔNG đọc, KHÔNG tìm kiếm (grep/find), KHÔNG trích dẫn bất kỳ file nào trong `99-deprecated/`.
   - Luôn chỉ định thư mục tìm kiếm hẹp (`SearchPath`), không tìm kiếm toàn bộ workspace.

4. **PEDAGOGICAL & CODE INVARIANTS (From `docs/09-implementation/active-plans/completion-criteria.md`):**
   - `Skipped != Failed`: Skipping or deferring must never reduce scores or flag errors.
   - `Support != Independent`: Using hints must set `has_support: true`.
   - `IPA Studio`: Strict 1 phoneme/viewport. All text labels MUST be HTML outside `<svg>`.
   - `Grammar`: 6-part ForumFlash structure.
   - `Background Singleton`: `<InteractiveBackground />` is mounted ONLY once in `RootLayout`. Never mount inside child pages.

5. **TOKEN EXHAUSTION & RECOVERY PROTOCOL (If your context window is filling up > 70%):**
   - Save your current work immediately by running:
     `node .agents/scripts/task-coordinator.mjs checkpoint <TASK_ID> <current_progress_%> "Summary of work done"`
   - If you cannot continue due to hard token limit, release the task back to the pool:
     `node .agents/scripts/task-coordinator.mjs release <TASK_ID>`
   - The user or next agent will read `.agents/coordination/checkpoints/<TASK_ID>.json` and resume seamlessly without losing a single line of progress!

6. **MECHANICAL-FIRST VERIFICATION & HANDOVER (Fast & Zero-Token-Waste):**
   - Run `pnpm verify:fast` (parallel mechanical typechecks in ~7s with filtered stdout) or `pnpm --filter @lingora/web typecheck`.
   - For UI tasks: run `pnpm test:ui-ux` (WCAG AA & 390px zero overflow) and `pnpm test:evidence` (Playwright screenshot evidence).
   - For infrastructure verification: run `pnpm test:smoke` (CORS preflight & live DB handshake).
   - For build validation: use `pnpm build:fast` (incremental contracts cache, parallel build in ~13s).
   - Once it exits with 0 errors, run `node D:\Lingora\.agents\scripts\task-coordinator.mjs complete <TASK_ID>`. For worktree tasks, this command verifies again, checks merge conflicts, and copies only assigned files into the main workspace.
   - Never edit `parallel-task-pool.json` directly; that bypasses the coordinator lock and state checks.
   - Report concise completion to the user (status + 1-2 sentence summary).

7. **CONTINUOUS KNOWLEDGE & SCRIPT AUGMENTATION (Self-Refining Intelligence):**
   - **Nguyên tắc "Gặp một lần — Đúc kết mãi mãi"**: Mọi bài học thực tế, lỗi môi trường, bất biến layout, hoặc cách khắc phục sự cố (như CORS redirect, Tailwind setup, DB pool pause, mobile overflow) KHÔNG ĐƯỢC trôi mất trong chat history mà **BẮT BUỘC phải đúc kết tự động**:
     1. **Cập nhật Skill/Knowledge**: Bổ sung quy tắc vào file `SKILL.md` liên quan trong `.agents/skills/` (hoặc tạo skill mới theo chuẩn $\le 100$ dòng).
     2. **Tự động hóa thành Reusable Script**: Chuyển các thao tác khắc phục/kiểm tra thủ công thành script tự động trong `.agents/scripts/` và đăng ký lệnh vào `package.json`.
     3. **Chuyển thành Cổng cơ học**: Bổ sung vào các lệnh `test:smoke`, `test:ui-ux`, hoặc `verify:fast` để mọi Agent sau tự động kiểm tra bằng máy chỉ trong vài giây mà không tốn token chẩn đoán lại.
