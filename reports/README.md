# reports — Mechanical Reporting & Test Tracing Protocol

> **TOKEN OPTIMIZATION INVARIANT:**
> Agents must NEVER dump hundreds of lines of raw build output, verbose typecheck errors, or unprocessed test logs directly into the conversation window. All mechanical outputs must be persisted to structured files under `reports/`. Agents only reference compact summaries in conversation.

---

## 1. Directory Structure & Categories

```text
reports/
├── README.md               ← This protocol guide
├── typecheck/              ← Typecheck verification logs (e.g. 261021-gate-audit.log)
├── token-audits/           ← Context window and skill line audits
├── reviews/                ← Architectural & pedagogical review logs
└── benchmarks/             ← Execution timings and token consumption statistics
```

---

## 2. Reporting Protocol for AI Agents

1. **Concise User Summaries:**
   - When executing verification suites, persist full outputs to `reports/{category}/{YYMMDD}-{name}.log`.
   - Provide a concise status in the chat:
     ```text
     Gate Typecheck: PASS (0 errors).
     Detailed report saved to: reports/typecheck/261021-gate.log
     ```
2. **Error Diagnosis Protocol:**
   - Do NOT load log files $> 5,000$ lines into conversation context.
   - Extract only the core 3–5 error lines (file path, line number, TypeScript error code) to form targeted diagnosis prompts.
