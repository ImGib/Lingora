# 🤖 Multi-Agent Coordination & Autonomous Task Runner

**Document Location:** `.agents/coordination/README.md`  
**Purpose:** Orchestration protocol for parallel AI agents (Codex, Antigravity, and specialized subagents) ensuring zero merge conflicts, strict file isolation, token budget preservation, and automatic cleanup.

---

## 🚦 Live Agent Coordination Board

Machine-readable task states are synchronized in [`.agents/coordination/tasks-board.json`](tasks-board.json) and [`.agents/coordination/parallel-task-pool.json`](parallel-task-pool.json).

| Workstream ID | Workstream & Scope | Assigned Agent | Status | Progress | Token Status | Scope & Deliverable |
|:---:|:---|:---:|:---:|:---:|:---:|:---|
| **WS-01** | **Visual System & Background 60fps**<br>`apps/web/src/components/common/` | **Antigravity** | 🟢 `COMPLETED` | **100%** | 🟢 Optimal | Canvas gradient mesh 60fps, Background Singleton, and Header navigation |
| **WS-02** | **IPA Mouth Studio (1 Phoneme/Viewport)**<br>`apps/web/src/components/ipa/` | **Antigravity** | 🟢 `COMPLETED` | **100%** | 🟢 Optimal | 44-phoneme IPA interactive chart, dual SVGs with HTML external labels |
| **WS-03** | **Grammar Masterclass (ForumFlash)**<br>`apps/web/src/components/grammar/` | **Antigravity** | 🟢 `COMPLETED` | **100%** | 🟢 Optimal | 6-part grammar component with syntax chips (`[S]`, `[V]`, `[O]`) |
| **WS-04** | **Practice Runner & QA Fault Modal**<br>`apps/web/src/components/practice/` | **Antigravity** | 🟢 `COMPLETED` | **100%** | 🟢 Optimal | MultipleChoice, FillBlank, SpeechRecorderCard, and Fault Injection Modal |

### Pooled Implementation Tasks (`parallel-task-pool.json`)

| Task ID | Phase | Target Directory | Assigned Agent | Status | Verified Command |
|---|---|---|---|---|---|
| **TASK-2A** | Phase 2 | `04-coding/apps/web/src/app/roadmap/` | Codex | `COMPLETED` | `pnpm --filter @lingora/web typecheck` |
| **TASK-2B** | Phase 2 | `04-coding/apps/web/src/app/` | Codex | `COMPLETED` | `pnpm --filter @lingora/web typecheck` |
| **TASK-3A** | Phase 3 | `04-coding/apps/web/src/app/lab/ipa/` | Codex | `COMPLETED` | `pnpm --filter @lingora/web typecheck` |
| **TASK-3B** | Phase 3 | `04-coding/apps/web/src/app/lab/grammar/` | Codex | `COMPLETED` | `pnpm --filter @lingora/web typecheck` |
| **TASK-3C** | Phase 3 | `04-coding/apps/web/src/features/dashboard/` | Codex | `COMPLETED` | `pnpm --filter @lingora/web typecheck` |
| **TASK-4A** | Phase 4 | `04-coding/apps/web/src/features/lesson/` | Codex | `COMPLETED` | `pnpm --filter @lingora/web typecheck` |

---

## 🔒 Atomic Locking & Git Worktree Isolation

To eliminate race conditions when multiple agents work in parallel:

1. **Atomic File Locking:**
   Task acquisition uses an OS-level file lock on `parallel-task-pool.json` (`.agents/coordination/parallel-task-pool.json.lock`).
2. **Git Worktree Isolation:**
   When an agent claims a task, the coordinator creates an isolated Git worktree under `.agents/worktrees/<TASK_ID>`. The agent edits code **only** inside its assigned worktree.
3. **Strict Boundary Enforcement:**
   The coordinator monitors `allowed_files`. Changes to any file outside the declared scope are detected immediately and block task completion.
4. **Automatic Pruning upon Completion:**
   Once verified, the coordinator copies only the assigned files back into the main workspace, records the merge journal, marks the task `COMPLETED`, and automatically prunes and unregisters the temporary Git worktree.

---

## ⚡ Task Coordinator CLI Commands

```bash
# 1. Claim the next available task
node .agents/scripts/task-coordinator.mjs claim <AGENT_NAME>

# 2. Check current status of all tasks
node .agents/scripts/task-coordinator.mjs list

# 3. Verify boundary and scope compliance
node .agents/scripts/task-coordinator.mjs verify-boundary <TASK_ID>

# 4. Save intermediate progress without losing state
node .agents/scripts/task-coordinator.mjs checkpoint <TASK_ID> <PERCENTAGE> "Description of progress"

# 5. Complete task, merge changes to main, and clean up worktree
node .agents/scripts/task-coordinator.mjs complete <TASK_ID>

# 6. Release task back to pool if token limit is reached
node .agents/scripts/task-coordinator.mjs release <TASK_ID>

# 7. Generate a zero-history, token-optimized prompt for a new agent session
node .agents/scripts/task-coordinator.mjs generate-prompt <TASK_ID>
```

---

## 💡 Token Burn & Context Window Management

1. **Context Window Traffic-Light Standard:**
   - 🟢 **Green (< 60% Context):** Optimal reasoning and memory retrieval.
   - 🟡 **Yellow (60% - 80% Context):** Restrict file reads strictly to `allowed_files`; avoid exploratory scans.
   - 🔴 **Red (> 80% Context):** High risk of forgetting pedagogical invariants. Run `checkpoint`, commit changes, and open a new session.
2. **Reuse Catalog Before Coding:**
   Before authoring new components, agents must check `.agents/coordination/component-catalog.json`. All core building blocks (`InteractiveBackground`, `HeaderNav`, `AudioButton`, `IpaMouthStudio`, `GrammarMasterclass`, `MultipleChoiceCard`, `FillBlankCard`, `SpeechRecorderCard`, `ModalFaultSimulation`) are already built, tested, and ready for reuse.
3. **Forbidden Directory `99-deprecated/`:**
   Agents are strictly forbidden from searching, reading, or referencing anything inside `99-deprecated/`.

---

## 📋 Copy-Paste Prompt Templates for Parallel Coding Agents

When launching a new chat tab or subagent, use these pre-packaged prompts:

<details>
<summary>👉 <strong>Prompt for IPA Mouth Studio</strong></summary>

```text
You are the assigned agent for the IPA Mouth Studio component in the Lingora workspace (D:\Lingora).
Scope: 04-coding/apps/web/src/components/ipa/ and audio button components.
Mandatory Invariants:
1. Strict 1 phoneme per viewport using top selection tabs.
2. Dual SVG views: Front View (Lips, teeth) and Cross-section View (Tongue, airflow).
3. Do NOT embed text labels inside SVG elements. All labels must be external HTML elements to prevent horizontal overflow on mobile viewports.
4. Audio button supports standard (1.0x) and slow (0.75x) speeds.
Verify: pnpm --filter @lingora/web typecheck
```
</details>

<details>
<summary>👉 <strong>Prompt for Grammar Masterclass</strong></summary>

```text
You are the assigned agent for the Grammar Masterclass component in the Lingora workspace (D:\Lingora).
Scope: 04-coding/apps/web/src/components/grammar/
Mandatory Invariants:
1. Strict 6-part ForumFlash schema: 1. Core Concept, 2. Practical Function & Context, 3. Component Matrix, 4. Three Syntactic Forms (+/-/?), 5. Recognition Signals, 6. Sentence Autopsy.
2. Sentence autopsy uses distinct syntax badges: Subject [S] (green), Verb [V] (blue), Object/Complement [O] (orange).
Verify: pnpm --filter @lingora/web typecheck
```
</details>

<details>
<summary>👉 <strong>Prompt for Practice Runner & Fault Simulation Hub</strong></summary>

```text
You are the assigned agent for the Practice Runner and QA Fault Simulation in the Lingora workspace (D:\Lingora).
Scope: 04-coding/apps/web/src/components/practice/ and modal-fault-simulation.tsx.
Mandatory Invariants:
1. "Skip" / "Postpone" calls onSkip() with NO score penalty and no red error flags (Skipped != Failed).
2. "Hint" / "Transcript" flags has_support = true (isolated from independent mastery proof).
3. SpeechRecorderCard: If microphone access is denied, display "This is a technical issue, not your fault" and seamlessly provide a writing fallback.
4. QA Fault Modal supports 4 scenarios: Microphone denied, Audio load failure, Network disconnect, 3-day inactivity gap.
Verify: pnpm --filter @lingora/web typecheck
```
</details>
