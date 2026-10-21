# CODEX INSTRUCTION CONTRACT — LINGORA REPOSITORY

You are an autonomous AI coding agent operating inside the Lingora workspace (`D:\Lingora`).

## COMMON SHARED SKILLS (Auto-loaded to save context & tokens):
- **Core Invariants:** `.agents/skills/lingora-core-invariants/SKILL.md`
- **UI Tokens & Layout Rules:** `.agents/skills/lingora-ui-tokens/SKILL.md`
- **Atomic Task Runner:** `.agents/skills/lingora-task-runner/SKILL.md`

## YOUR MANDATORY WORKFLOW UPON ANY NEW PROMPT:

1. **AUTOMATIC TASK CLAIM VIA COORDINATOR SCRIPT (Recommended - Fast & Zero-Race-Condition):**
   - Run command: `node .agents/scripts/task-coordinator.mjs claim Codex`
   - It outputs the exact JSON of the claimed task with `allowed_files` and auto-releases any stale zombie tasks.
   - Or atomically edit `.agents/coordination/parallel-task-pool.json` to change the first `AVAILABLE` task to `IN_PROGRESS`.

2. **REUSE EXISTING SHARED COMPONENTS (Save 80% tokens - DO NOT REINVENT):**
   - Check `.agents/coordination/component-catalog.json` before writing any new UI component.
   - All core components (`InteractiveBackground`, `HeaderNav`, `AudioButton`, `IpaMouthStudio`, `GrammarMasterclass`, `MultipleChoiceCard`, `FillBlankCard`, `SpeechRecorderCard`, `ModalFaultSimulation`) are ALREADY built and tested. Simply import and assemble them!

3. **STRICT ISOLATION BOUNDARY:**
   - You are ONLY permitted to edit or create files explicitly listed in that claimed task's `"allowed_files"` array.
   - Touching any file outside this list is a critical violation and will break other agents.

4. **PEDAGOGICAL & CODE INVARIANTS (From `docs/09-implementation/active-plans/completion-criteria.md`):**
   - `Skipped != Failed`: Skipping or deferring must never reduce scores or flag errors.
   - `Support != Independent`: Using hints must set `has_support: true`.
   - `IPA Studio`: Strict 1 phoneme/viewport. All text labels MUST be HTML outside `<svg>`.
   - `Grammar`: 6-part ForumFlash structure.

5. **TOKEN EXHAUSTION & RECOVERY PROTOCOL (If your context window is filling up > 70%):**
   - Save your current work immediately by running:
     `node .agents/scripts/task-coordinator.mjs checkpoint <TASK_ID> <current_progress_%> "Summary of work done"`
   - If you cannot continue due to hard token limit, release the task back to the pool:
     `node .agents/scripts/task-coordinator.mjs release <TASK_ID>`
   - The user or next agent will read `.agents/coordination/checkpoints/<TASK_ID>.json` and resume seamlessly without losing a single line of progress!

6. **VERIFICATION & HANDOVER:**
   - Execute: `pnpm --filter @lingora/web typecheck`
   - Once it exits with 0 errors:
     - Run: `node .agents/scripts/task-coordinator.mjs complete <TASK_ID>`
     - Or set `"status": "COMPLETED"` and `"progress_percentage": 100` in `parallel-task-pool.json`.
   - Report concise completion to the user.
