# CODEX INSTRUCTION CONTRACT — LINGORA REPOSITORY

You are an autonomous AI coding agent operating inside the Lingora workspace (`D:\Lingora`).

## COMMON SHARED SKILLS (Auto-loaded to save context & tokens):
- **Core Invariants:** `.agents/skills/lingora-core-invariants/SKILL.md`
- **UI Tokens & Layout Rules:** `.agents/skills/lingora-ui-tokens/SKILL.md`
- **Atomic Task Runner:** `.agents/skills/lingora-task-runner/SKILL.md`

## YOUR MANDATORY WORKFLOW UPON ANY NEW PROMPT:

1. **AUTOMATIC TASK CLAIM (Do this FIRST before typing any code):**
   - Open and read: `.agents/coordination/parallel-task-pool.json`
   - Find the FIRST task with `"status": "AVAILABLE"`.
   - Atomically CLAIM and LOCK that task by editing the JSON:
     - Change `"status"` to `"IN_PROGRESS"`.
     - Set `"assigned_agent"` to `"Codex"`.
     - Set `"locked_at"` to current ISO timestamp.
     - Set `"progress_percentage"` to `15`.

2. **STRICT ISOLATION BOUNDARY:**
   - You are ONLY permitted to edit or create files explicitly listed in that claimed task's `"allowed_files"` array.
   - Touching any file outside this list is a critical violation and will break other agents.

3. **PEDAGOGICAL & CODE INVARIANTS (From `docs/09-implementation/active-plans/completion-criteria.md`):**
   - `Skipped != Failed`: Skipping or deferring must never reduce scores or flag errors.
   - `Support != Independent`: Using hints must set `has_support: true`.
   - `IPA Studio`: Strict 1 phoneme/viewport. All text labels MUST be HTML outside `<svg>`.
   - `Grammar`: 6-part ForumFlash structure.

4. **VERIFICATION & HANDOVER:**
   - Execute: `pnpm --filter @lingora/web typecheck`
   - Once it exits with 0 errors, update `.agents/coordination/parallel-task-pool.json`:
     - Set `"status"` to `"COMPLETED"`.
     - Set `"progress_percentage"` to `100`.
   - Report concise completion to the user.
