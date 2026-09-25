# Lingora — Architecture Baseline v2

**Document set:** Architecture Consolidation v2
**Status:** ARCHITECTURE V2 — FROZEN FOR IMPLEMENTATION; 01A LIVE VERIFIED; 01B–01F IMPLEMENTED, LIVE SUPABASE CORE FLOW VERIFIED; 01F FINAL GATES PENDING
**Product:** English learning system for a beginner-to-IELTS Academic and study-abroad journey

This repository contains the frozen Architecture v2 baseline and the staged Slice 01 implementation. Consolidation v2 refines the accepted learning, curriculum, domain, data, application, content-authoring, UI, and infrastructure decisions without speculatively materializing every concept as a table.

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
| Implementation Readiness — Slice 01 | **01A LIVE VERIFIED; 01B–01F IMPLEMENTED, LIVE SUPABASE CORE FLOW VERIFIED; 01F FINAL GATES PENDING** |
| Architecture Gap Audit / Consolidation v2 | **ACCEPTED** |

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
- Learning Claim is not Competency; exposure, practice opportunity, and evidence opportunity are distinct.
- Evidence existence is not sufficiency; historical evidence is not current confidence.
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
8. Use [ADR-007](docs/08-decisions/ADR-007-architecture-consolidation-v2.md) for the v2 refinements.
9. Implement Slice 01 through checkpoints 1A–1F before expanding; after Slices 01–03, prioritize curriculum/content and real-learner testing over horizontal architecture.
10. Use the [post-Slice 01 roadmap](docs/09-implementation-readiness/post-slice-01-roadmap.md) for the concrete gates and work order after 01F.

## Implemented checkpoint

Slice 01A provides the pnpm workspace, Next.js presentation shell, NestJS API, Clerk token verification boundary, Lingora-owned learner identity provisioning, profile endpoints, and the identity-only PostgreSQL migration. No real secrets are stored in the repository.

Slice 01B adds versioned curriculum hierarchy, bounded competencies/relations, immutable published package/item definitions, ItemFamily exposure boundaries, a learner-safe lesson endpoint, and lesson rendering. ADR-008 keeps Practice and Assessment semantically distinct inside one versioned LearningItem lifecycle.

Slice 01B package v2 adds the missing controlled-practice activity and a hint delivered only after support use is recorded. It retains package v1 for already-pinned attempts. Slices 01C–01E add exact-version attempts, saved responses, support use, deterministic submit with idempotency, source-near observations, separate evidence and conservative competency state, plus a versioned goal, daily plan, dashboard action and resume path. Slice 01F adds persisted study sessions, explicit pause/resume/complete/abandon transitions, and an attempt-to-session link. The dashboard and practice UI connect these steps. Typecheck, lint, unit tests, build, and the disposable PostgreSQL integration/HTTP suite pass. All eight Slice 01 migration groups are applied to the Lingora Supabase project; its `public` schema contains 33 tables with RLS enabled and no `anon`/`authenticated` table SELECT grants. A disposable Clerk development user completed the browser flow against both local PostgreSQL and live Supabase: sign in, goal and plan, lesson, saved responses across reload, hint, submit, feedback, updated evidence/action, and pause/resume across reload. The live fixture was removed after verification.

Slice 01A was live-verified on 2026-09-25 against a Clerk development instance and Supabase PostgreSQL: login, idempotent learner provisioning, profile read/update/reload, unauthenticated rejection, schema constraints, RLS, and revoked browser-role grants all passed. The temporary Clerk and database fixtures were removed after verification.

## Run Slice 01

1. Install with `pnpm install`.
2. Copy `apps/web/.env.example` to `apps/web/.env.local` and `apps/api/.env.example` to `apps/api/.env`, then replace placeholders with the same Clerk instance and a PostgreSQL connection.
3. Apply the timestamped migrations under `apps/api/supabase/migrations` in lexical order to the target Supabase PostgreSQL database. Use a disposable database first for integration verification.
4. Run `pnpm dev`, then open `http://localhost:3000`.

To repeat the backend verification, set `TEST_DATABASE_URL` to a PostgreSQL database reserved for tests and run `pnpm --filter @lingora/api verify:slice01`. The command creates an isolated schema, applies all migrations, checks RLS and learner ownership, exercises the learning flow and HTTP contracts with a test identity verifier, then drops that schema. The connection needs permission to create schemas (and to create the `anon`/`authenticated` roles if the database does not already have them). This check does not replace the real Clerk browser flow.

The API fails at startup when required server configuration is absent. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are intentionally absent: these checkpoints connect to PostgreSQL through `DATABASE_URL` and do not use Supabase Storage or the Supabase SDK.

## Deploy

Use two Vercel Projects from this monorepo, with root directories `apps/api` and `apps/web`. Follow the [Vercel deployment guide](docs/10-deployment-vercel.md) for build settings, environment variables, database preflight, and Preview verification. The Supabase database preflight now passes; no Vercel Preview has been deployed or verified yet.

## Deliberate exclusions

Slice 01F remains incomplete pending a live duplicate-submit/retry check and a second-learner/auth-failure isolation check. These paths pass the disposable PostgreSQL/HTTP suite, but have not been repeated with real Clerk identities against Supabase. Vercel Preview and production Clerk keys also remain to be configured and verified. Placement, audio, AI evaluation, retention, transfer, and later slices remain outside this checkpoint.
