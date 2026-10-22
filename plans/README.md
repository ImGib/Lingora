# plans — Multi-Agent Planning Protocol

> **TOKEN OPTIMIZATION & CONTINUITY CONVENTIONS:**
> To eliminate context window saturation and ensure seamless handovers between autonomous agent sessions, all execution plans must adhere strictly to the following standards.

---

## 1. Directory Naming Convention

Each discrete implementation plan must be organized inside a timestamped subdirectory:
```text
plans/{YYMMDD}-{HHmm}-{plan-slug}/
```

**Examples:**
- `plans/261021-1800-roadmap-view-impl/`
- `plans/261022-0900-ipa-lab-integration/`

---

## 2. File Structure & Progressive Disclosure ($\le 80$ lines)

A standardized plan directory consists of:
```text
plans/{YYMMDD}-{HHmm}-{slug}/
├── plan.md               ← High-level master plan (MANDATORY: ≤ 80 lines)
├── phase-01-setup.md     ← Phase 1 detailed execution (loaded only during Phase 1)
├── phase-02-core.md      ← Phase 2 detailed execution (loaded only during Phase 2)
└── phase-03-verify.md    ← Acceptance criteria & verification commands
```

### The `plan.md` file must contain these 5 sections:
1. **Goal & Target Directory:** A 1-sentence objective and isolated directory path (`isolated_directory`).
2. **Upstream Source of Truth:** Direct link to authoritative specs in `00-intake/` or `docs/`.
3. **Allowed Files:** Exact list of files permitted for modification.
4. **Phase Checklist:** Ordered execution phases (each referencing a specific `phase-XX-*.md` file).
5. **Verification Command:** Automated mechanical check (e.g., `pnpm verify:fast` or `pnpm --filter @lingora/web typecheck`).

---

## 3. Reference Template

Refer to the standard template at: [`plans/_template/plan.md`](_template/plan.md).
