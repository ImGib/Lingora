# Lingora — Architecture Baseline v1

**Document set:** Architecture Baseline v1  
**Status:** IMPLEMENTATION READY — SLICE 01  
**Product:** English learning system for a beginner-to-IELTS Academic and study-abroad journey

This folder is the implementation-neutral design baseline for Lingora. It consolidates the accepted learning, curriculum, domain, data, application, content-authoring, UI, and infrastructure decisions. Superseded brainstorms are intentionally excluded; coding has not started.

## Current baseline

| Area | Status |
|---|---|
| Learning Architecture, Constitution, Kernel | **FROZEN** |
| Domain Model v1 | **FROZEN** |
| Curriculum S0/S1 | **VALIDATED** |
| Grammar, Listening, Writing, Speaking slices | **VALIDATED** |
| Database Design v1 — Phase A | **COMPLETE** |
| Database Design v1 — Phase B strategy and first vertical slice | **VALIDATED** |
| Application / Identity / Async Architecture v1 | **FROZEN** |
| API DTO Contract v1 | **VALIDATED** |
| Content Authoring & Publishing Architecture v1 | **FROZEN** |
| UI & Information Architecture v1 | **VALIDATED** |
| Design System & Component Architecture v1 | **VALIDATED** |
| Visual identity — Soft Study Companion | **LOCKED** |
| Implementation Readiness — Slice 01 | **DEFINED** |

`FROZEN` means implementation must conform to the document. A change to a frozen invariant requires an explicit decision record and impact review; it does not mean the design can never evolve.

## Product and stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Recharts on Vercel.
- Backend: NestJS REST modular monolith. Application workflows and domain authority live here.
- Authentication: Clerk. External identity is mapped to a Lingora-owned learner UUID.
- Initial infrastructure: Supabase PostgreSQL and hot object storage; Supabase Auth is not the primary identity source.
- Optional cold/archive/backup storage: Google Drive through a provider port.
- Portability: repositories, identity, storage, evaluation, and AI providers are behind ports/adapters.
- Workspace: pnpm monorepo with `apps/web`, `apps/api`, and a deliberately narrow `packages/contracts` package. Shared transport contracts are not a shared domain model.

## Non-negotiable boundaries

- Observation is not Evidence; Evidence is not Mastery; Assessment is not Decision.
- Curriculum is not Learner State; Knowledge is not Performance.
- Weakness is not Bottleneck; Unknown is not Weak; Skipped is not Failed.
- Feedback is not Learning; Correction is not Mastery.
- Support usage changes the meaning and weight of evidence.
- Transfer and delayed retention are required for strong mastery claims.
- Technical failure is never learner failure.
- AI output is never learner production.
- Every state must have a valid next action.
- DTO, Domain Entity, and Database Row are separate representations.
- External identity is not Domain identity; Clerk IDs never become learner foreign keys.
- Published content versions are immutable; attempts pin exact package and assessment-item versions.
- AI-generated content is not validated or published content, and benchmark content remains isolated.
- Domain code must not import Clerk, Supabase, Next.js, Vercel, Google Drive, or AI-provider SDKs.

## Reading path

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) for the rules implementation must not break.
2. Use [docs/README.md](docs/README.md) as the architecture map.
3. Read the Learning Constitution and Kernel before implementing assessment, state, planning, or feedback.
4. Read Domain Model and Database Design together before persistence work.
5. Read the Application Architecture and API DTO Contract before controllers, clients, jobs, or auth integration.
6. Read Content Authoring before changing package/item lifecycle or publishing behavior.
7. Read UI Architecture and Design System together before implementing learner or authoring surfaces.
8. Implement only the defined [Slice 01](docs/09-implementation-readiness/slice-01-present-simple.md) before expanding horizontally.

## Deliberate exclusions

This package contains no application source code, executable SQL migrations, generated schema, secrets, deployment configuration, or Git history. The first migration set and seed package are specifications only.
