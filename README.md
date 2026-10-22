# Lingora — Architecture Consolidation v3

**Document Set:** Architecture Consolidation v3 + M1 4-Week Learning MVP  
**Status:** CONCEPTUALLY FROZEN; M0 AUDIT COMPLETED; M1 VERTICAL SLICES IN PROGRESS  
**Product:** Adaptive English learning ecosystem for the beginner-to-IELTS Academic and study-abroad journey  
**Live Deployments:**
- 🌐 **Web Frontend (Production):** [https://lingora-web-psi.vercel.app](https://lingora-web-psi.vercel.app)
- 🚀 **REST API (Production):** [https://lingora-api.vercel.app](https://lingora-api.vercel.app)
- 🎨 **Interactive Prototype Hub:** [https://lingora-prototype.vercel.app](https://lingora-prototype.vercel.app)

---

## 🧭 5-Zone Stakeholder Navigation Map

To ensure every stakeholder, developer, and AI agent locates authoritative documentation within **3 seconds**, the repository is organized into **5 functional zones**:

| Stakeholder Zone | Focus & Purpose | Local Workspace Path | Live Portal / Reference |
|---|---|---|---|
| 📜 **0. Tri-Knowledge & SoT** | CEFR Standards, 44-Phoneme IPA Spec, 4 Core Pedagogical Invariants | 📁 [`00-intake/README.md`](00-intake/README.md) & [`00-intake/sot/`](00-intake/sot/) | *Source of Truth (P0)* |
| 👔 **1. Product & Architecture** | Business Requirements (PRD), Architecture Decisions (ADR), Slice Progress | 📁 [`docs/INDEX.md`](docs/INDEX.md) & [`docs/README.md`](docs/README.md) | 🌐 [Stakeholder Hub — BA & Plan](https://lingora-prototype.vercel.app/stakeholder-hub.html#ba) |
| 📚 **2. Curriculum & Learning** | 28-Day Syllabus, 100% IPA Vocabulary, 6-Part ForumFlash Grammar Modules | 📁 [`01-curriculum/GUIDE.md`](01-curriculum/GUIDE.md) & [`01-curriculum/week-1/`](01-curriculum/week-1/) | 🌐 [Stakeholder Hub — Curriculum](https://lingora-prototype.vercel.app/stakeholder-hub.html#curriculum) |
| 🎨 **3. UI/UX & Design** | Design System, Soft Study Companion Tokens, IPA Mouth Studio, Responsive | 📁 [`02-design/`](02-design/index.html) & [`docs/07-ui/`](docs/07-ui/design-system-v1.md) | 🌐 [Interactive Prototype Demo](https://lingora-prototype.vercel.app) |
| 🧪 **4. QA / QC & Testing** | Master Test Plan, UAT Test Cases, Fault Injection Simulator, Automation | 📁 [`05-testing/INDEX.md`](05-testing/INDEX.md) & [`05-testing/master-test-plan.md`](05-testing/master-test-plan.md) | 🌐 [Stakeholder Hub — QA Center](https://lingora-prototype.vercel.app/stakeholder-hub.html#qa) |
| 💻 **5. Engineering & Monorepo** | Next.js 15 Web, NestJS 11 REST API, Supabase PostgreSQL, Shared DTOs | 📁 [`04-coding/`](04-coding/README.md) | 🌐 [Stakeholder Hub — Tech](https://lingora-prototype.vercel.app/stakeholder-hub.html#dev) |

> 💡 **Quick Navigation Rule:**
> - **Tri-Knowledge & SoT** $\rightarrow$ `00-intake/`
> - **Curriculum & Pedagogical Content** $\rightarrow$ `01-curriculum/`
> - **UI/UX Design, Prototypes & Tokens** $\rightarrow$ `02-design/`
> - **Shared Transport Contracts & DTOs** $\rightarrow$ `03-contracts/` & `04-coding/packages/contracts/`
> - **Source Code Implementation (Web & API)** $\rightarrow$ `04-coding/`
> - **Verification, UAT & Quality Assurance** $\rightarrow$ `05-testing/`
> - **Autonomous Multi-Agent Coordination** $\rightarrow$ `.agents/coordination/` & `.agents/skills/`

---

## 🏛️ Architectural Baseline & Frozen Decisions

| Architectural Area | Baseline Status | Authoritative Reference |
|---|---|---|
| Learning Architecture & Pedagogical Constitution | **FROZEN** | [`docs/01-learning/`](docs/01-learning/) |
| Domain Model v1 | **FROZEN** | [`docs/02-domain/`](docs/02-domain/) |
| Curriculum S0/S1 & Competency Mapping | **VALIDATED** | [`01-curriculum/`](01-curriculum/) |
| Grammar, Listening, Writing, Speaking Slices | **VALIDATED** | [`docs/01-learning/`](docs/01-learning/) |
| Database Schema v1 & Supabase Migrations | **COMPLETE** | [`04-coding/apps/api/supabase/migrations/`](04-coding/apps/api/supabase/migrations/) |
| Application / Identity / Async Boundary | **FROZEN** | [`docs/04-application/`](docs/04-application/) |
| Shared API DTO Contracts v1 | **VALIDATED** | [`04-coding/packages/contracts/`](04-coding/packages/contracts/) |
| Content Authoring & Publishing Lifecycle | **FROZEN** | [`docs/06-content/`](docs/06-content/) |
| Design System & Responsive Tokens | **VALIDATED** | [`docs/07-ui/design-system-v1.md`](docs/07-ui/design-system-v1.md) |
| Visual Identity: *Soft Study Companion* | **LOCKED** | [`02-design/`](02-design/) |
| M0 Implementation Kernel Audit | **01A–01F DONE** | [`docs/09-implementation/`](docs/09-implementation/) |
| M1 4-Week Learning MVP | **IN PROGRESS** | [`docs/09-implementation/m1-four-week-learning/`](docs/09-implementation/m1-four-week-learning/) |
| Architecture Consolidation v3 | **ACCEPTED** | [`docs/08-decisions/ADR-009-architecture-consolidation-v3.md`](docs/08-decisions/ADR-009-architecture-consolidation-v3.md) |

`FROZEN` indicates mandatory compliance. Altering any frozen invariant requires an explicit Architectural Decision Record (ADR) and formal impact review.

---

## 🛡️ Non-Negotiable Pedagogical & Technical Invariants

These core invariants govern all code, UI components, backend services, and automated agents:

1. **Observation $\neq$ Evidence $\neq$ Mastery $\neq$ Decision:** Every learning state transition must follow verified empirical criteria.
2. **Skipped $\neq$ Failed:** Deferring or skipping an item/activity must NEVER reduce a learner's score, apply penalties, or flag red errors.
3. **Support $\neq$ Independent:** Using a hint, transcript, or pronunciation slow-mode sets `has_support: true` and is isolated from independent mastery proofs.
4. **Technical Failure $\neq$ Learner Failure:** Network drops, audio decode failures, or microphone permission denials are classified as environmental faults; the system provides transparent fallbacks without penalizing the user.
5. **IPA Mouth Studio Constraint:** Strict 1 phoneme per viewport. All instructional text labels must be HTML elements outside the SVG viewport to prevent horizontal mobile overflow.
6. **Grammar Structure:** Strict 6-part ForumFlash schema (*Core Concept, Pragmatics & Function, Component Matrix, 3 Syntactic Forms, Recognition Signals, Sentence Autopsy*).
7. **Background Singleton:** `<InteractiveBackground />` is mounted exactly once in `RootLayout`. Child pages must never instantiate duplicate canvas backdrops.
8. **External Identity $\neq$ Domain Identity:** Clerk IDs authenticate sessions but are never used as learner foreign keys in the domain model.
9. **Zero Drift & Clean Boundaries:** Agents operate within atomic Git worktrees and are strictly confined to their declared `allowed_files`.

---

## 🧰 Technology Stack

- **Frontend:** Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS v4, Plus Jakarta Sans, Lucide React).
- **Backend:** NestJS 11 REST modular monolith with clean Ports and Adapters architecture.
- **Identity & Authentication:** Clerk with decoupled domain UUID provisioning.
- **Database & Storage:** Supabase PostgreSQL with strict Row Level Security (RLS) enabled on all tables, supplemented by Supabase MCP integration.
- **Transport Contracts:** `@lingora/contracts` shared across web and API.
- **Testing & Quality:** Playwright (E2E and visual evidence screenshots), `@axe-core/playwright` (WCAG 2.1 AA accessibility), Vitest, Supertest, and custom mechanical zero-token gates.
- **Package Manager:** `pnpm` workspace monorepo (Node $\ge 22$, pnpm $\ge 10.3$).

---

## ⚡ Fast Mechanical Gates & Tooling

Lingora includes specialized zero-token-waste automation scripts located in `.agents/scripts/`:

```bash
# Parallel mechanical typecheck for contracts, web, and api (~8s, filtered stdout)
pnpm verify:fast

# Incremental monorepo build with contracts caching (~13s)
pnpm build:fast

# Automated UI/UX accessibility (WCAG 2.1 AA) and 390px zero-overflow layout check
pnpm test:ui-ux

# Infrastructure preflight: live DB handshake & CORS headers verification
pnpm test:smoke

# Automated Playwright visual evidence screenshots (stored in evidence/ directory)
pnpm test:evidence

# Run fast typechecks and UI/UX checks in combination
pnpm test:all

# Configure Supabase MCP server dynamically for AI agents
pnpm mcp:supabase <PROJECT_REF>
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js:** $\ge 22.0.0$
- **pnpm:** $\ge 10.3.0$
- Active PostgreSQL database (or Supabase project)

### 2. Installation & Environment
```bash
# Clone the repository
git clone https://github.com/ImGib/Lingora.git
cd Lingora

# Install all workspace dependencies
pnpm install

# Configure environment variables
cp 04-coding/apps/web/.env.example 04-coding/apps/web/.env.local
cp 04-coding/apps/api/.env.example 04-coding/apps/api/.env
```

Ensure `04-coding/apps/web/.env.local` contains:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Ensure `04-coding/apps/api/.env` contains:
```env
PORT=3001
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
CLERK_SECRET_KEY=sk_test_...
CORS_ORIGIN=http://localhost:3000
```

### 3. Run Development Servers
```bash
# Concurrently runs @lingora/contracts build, @lingora/api, and @lingora/web
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) for the web client, and [http://localhost:3001/v1/health](http://localhost:3001/v1/health) for the API health check.

---

## 🤖 Multi-Agent Coordination Protocol

Lingora operates under an autonomous multi-AI coordination workflow to prevent merge conflicts and context exhaustion:

1. **Atomic Task Claiming:**
   ```bash
   node .agents/scripts/task-coordinator.mjs claim <AGENT_NAME>
   ```
   Locks an available task atomically, creates an isolated Git worktree under `.agents/worktrees/<TASK_ID>`, and outputs strict `allowed_files`.

2. **Scope Boundaries:**
   Agents are forbidden from modifying files outside their assigned `allowed_files`. Scope drift is mechanically detected and blocks completion.

3. **Atomic Verification & Handover:**
   ```bash
   node .agents/scripts/task-coordinator.mjs complete <TASK_ID>
   ```
   Runs mechanical verification, confirms clean diffs, merges assigned files back into the main workspace, and automatically prunes the temporary Git worktree.

4. **Progress Checkpoint & Context Recovery:**
   ```bash
   node .agents/scripts/task-coordinator.mjs checkpoint <TASK_ID> <PERCENTAGE> "Summary of progress"
   node .agents/scripts/task-coordinator.mjs release <TASK_ID>
   ```

---

## 🧪 Master Test Plan & Quality Gates

For in-depth test design, test matrices, and execution procedures, see:
- 📑 **[`05-testing/master-test-plan.md`](05-testing/master-test-plan.md)**: Comprehensive 4-Tier Master Test Plan (Unit, Integration, UI/UX Accessibility, E2E Playwright).
- 📑 **[`05-testing/INDEX.md`](05-testing/INDEX.md)**: 5 Mandatory Quality Gates and testing index.
- 📑 **[`05-testing/test-cases-uat.md`](05-testing/test-cases-uat.md)**: 25 end-to-end acceptance test scenarios.
- 📑 **[`05-testing/fault-scenarios.md`](05-testing/fault-scenarios.md)**: Fault injection scenarios (Microphone denial, network drop, audio error, 3-day inactivity).

---

## 📄 License & Governance

Lingora is proprietary intellectual property. All rights reserved. Refer to architectural invariants in [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`AGENTS.md`](AGENTS.md) before contributing.
