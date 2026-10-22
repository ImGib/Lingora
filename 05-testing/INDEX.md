# 🧪 Quality Assurance, Verification & Testing Index

**Document Location:** `05-testing/INDEX.md`  
**Purpose:** Authoritative reference for Quality Assurance (QA), Quality Control (QC), and automated testing suites across the Lingora platform.  
**Interactive Checklist:** [https://lingora-prototype.vercel.app/stakeholder-hub.html#qa](https://lingora-prototype.vercel.app/stakeholder-hub.html#qa)

---

## 📑 Testing Documentation & Assets

| Document / Tool | Primary Audience | Description & Focus |
|---|---|---|
| 📄 **[`05-testing/master-test-plan.md`](master-test-plan.md)** | QA Lead, Architects, Developers | **Comprehensive 4-Tier Master Test Plan** covering Unit, Integration, UI/UX Accessibility, and E2E automation |
| 📄 **[`05-testing/INDEX.md`](INDEX.md)** *(Current File)* | QA, QC, Product Owner, BA | Overview of testing architecture, 5 mandatory quality gates, and CLI test runners |
| 📄 **[`05-testing/test-cases-uat.md`](test-cases-uat.md)** | Manual QC, BA, Acceptance Team | **25 acceptance test cases** covering Welcome, Diagnostic, Daily Action, Roadmap, IPA Lab, Grammar, and Lesson Runner |
| 📄 **[`05-testing/fault-scenarios.md`](fault-scenarios.md)** | Manual QC, Developers | Guide to the **`⚙ Fault Simulation`** modal testing 4 environmental errors (*Mic Denied, Audio Failure, Offline, 3-Day Inactivity*) |
| 🤖 **[`05-testing/e2e/slice-01f.spec.ts`](e2e/slice-01f.spec.ts)** | Automation QA, CI | Playwright E2E script verifying login flows, idempotent submissions, session pauses, and accessibility |
| 🤖 **[`04-coding/apps/api/test/`](../04-coding/apps/api/test/)** | Backend QA, Developers | NestJS Unit & Integration test suite for `PlanningService`, `QuarantineService`, and domain repositories |
| 📸 **[`evidence/`](../evidence/)** | Design Reviewers, Stakeholders | Automated visual screenshot captures generated via Playwright Headless |

---

## 🛡️ The 5 Mandatory Quality Gates

Every feature, page, and vertical slice in Lingora must pass these 5 gates prior to release:

### Gate 1 — Pedagogical Invariants Gate
- **Skipped != Failed:** Selecting "Skip" or "Postpone" records state cleanly without penalties, score reductions, or red error alerts.
- **Support != Independent:** Utilizing "Hint", "Transcript", or slow-speed audio flags `has_support: true` and is strictly excluded from independent competency claims.

### Gate 2 — Visual, Responsive & 390px Zero-Overflow Gate
- **IPA Mouth Studio Constraint:** Displays strictly **1 phoneme per viewport** with no vertical page jumping.
- **Zero Horizontal Overflow:** All views must maintain zero horizontal overflow down to **390px mobile viewports**.
- **Dual Perspective SVGs:** Front View (Lips, teeth) and Cross-Section View (Tongue, airflow) render cleanly with all text annotations placed outside SVG containers as HTML elements.

### Gate 3 — Curriculum & Content QC Gate
- **100% IPA Transcriptions:** All newly introduced vocabulary terms include IPA phonetic symbols, syllable breakdowns, and dual audio buttons (`🔊 Standard` & `🐢 Slow`).
- **6-Part Grammar Structure:** Grammar modules strictly follow the ForumFlash schema (*Core Concept, Pragmatics & Function, Component Matrix, 3 Syntactic Forms, Recognition Signals, Sentence Autopsy*).

### Gate 4 — Environmental Fault Tolerance Gate
- When system permissions (e.g. microphone) are blocked or media fails to load, the system displays the non-punitive message: **"This is a technical issue, not your fault"** and provides an instant fallback path (e.g., written submission).

### Gate 5 — Automated Mechanical CI Gate
- Monorepo mechanical gates must exit with code 0:
  ```bash
  # Fast parallel typechecks (~8s)
  pnpm verify:fast

  # Accessibility (WCAG 2.1 AA) & 390px layout check
  pnpm test:ui-ux

  # Infrastructure handshake & CORS preflight
  pnpm test:smoke

  # Visual screenshot evidence generation
  pnpm test:evidence
  ```

---

## 🏃 Running Tests Locally

```bash
# Run all mechanical quality gates
pnpm test:all

# Run backend unit and integration tests
pnpm --filter @lingora/api test

# Run Playwright E2E test suite
pnpm e2e

# Inspect visual evidence screenshots
open evidence/
```
