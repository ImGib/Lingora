# Lingora — Markdown Consolidation v1

**Document set:** Consolidation v1  
**Status:** BASELINE  
**Product:** English learning system for a beginner-to-IELTS Academic and study-abroad journey

This folder is the implementation-neutral design baseline for Lingora. It consolidates the final decisions from the learning, curriculum, domain, data, application, and infrastructure design work. Superseded brainstorms are intentionally excluded.

## Current baseline

| Area | Status |
|---|---|
| Learning Architecture, Constitution, Kernel | **FROZEN** |
| Domain Model v1 | **FROZEN** |
| Curriculum S0/S1 | **VALIDATED** |
| Grammar, Listening, Writing, Speaking slices | **VALIDATED** |
| Database Design v1 — Phase A | **COMPLETE** |
| Database Design v1 — Phase B strategy and first vertical slice | **VALIDATED** |
| API Contract v1 | **DRAFT / NEXT** |
| UI Architecture | **PENDING** |

`FROZEN` means implementation must conform to the document. A change to a frozen invariant requires an explicit decision record and impact review; it does not mean the design can never evolve.

## Product and stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Recharts on Vercel.
- Backend: NestJS REST modular monolith. Application workflows and domain authority live here.
- Initial infrastructure: Supabase PostgreSQL, Auth, and hot object storage.
- Optional cold/archive/backup storage: Google Drive through a provider port.
- Portability: repositories, identity, storage, evaluation, and AI providers are behind ports/adapters.

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
- Domain code must not import Supabase, Next.js, Vercel, or Google Drive SDKs.

## Reading path

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) for the rules implementation must not break.
2. Use [docs/README.md](docs/README.md) as the architecture map.
3. Read the Learning Constitution and Kernel before implementing assessment, state, planning, or feedback.
4. Read Domain Model and Database Design together before persistence work.
5. Treat the API and UI documents as placeholders until their next design passes are accepted.

## Deliberate exclusions

This package contains no application source code, SQL migrations, generated schema, secrets, deployment configuration, or Git history.
