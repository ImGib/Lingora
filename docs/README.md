# Lingora Documentation Map

**Status:** CONSOLIDATION V3 — CONCEPTUALLY FROZEN; M0 DONE; M1 SLICE 01 IN PROGRESS

## Architecture map

```text
Product intent
  -> Learning Constitution (what must remain true)
  -> Learning Kernel (Definition, Learning, Decision, Governance/System Learning planes)
  -> Curriculum (what can be learned)
  -> Domain (meaning, ownership, transitions)
  -> Data (durable facts and projections)
  -> Application / Identity / Async boundaries
  -> API DTO contracts
  -> Content authoring and publishing
  -> UI and Design System
  -> Milestones and vertical implementation proofs
  -> ADRs (why the technical choices were made)
```

## Canonical documents

| Topic | Canonical source | Status |
|---|---|---|
| Product intent and boundaries | `01-product/` | BASELINE |
| Learning invariants | `02-learning-architecture/learning-constitution-v1.md` | FROZEN |
| Learning loop and engines | `02-learning-architecture/learning-kernel-v1.md` | FROZEN |
| Competency, evidence, learner state | `02-learning-architecture/` | FROZEN |
| Curriculum S0/S1 | `03-curriculum/` | VALIDATED |
| End-to-end teaching examples | `03-curriculum/vertical-slices/` | VALIDATED |
| Domain language and ownership | `04-domain/domain-model-v1.md` | FROZEN |
| State transitions and decisions | `04-domain/state-machines.md`, `decision-rules.md` | FROZEN |
| Logical/physical persistence direction | `05-data/database-design-v1.md` | PHASE A COMPLETE; PHASE B VALIDATED |
| Application, identity, and async execution | `06-application/application-architecture-v1.md` | FROZEN |
| API DTO Contract v1 | `06-application/api-contract-v1.md` | VALIDATED |
| Content authoring and publishing | `03-curriculum/content-authoring-publishing-v1.md` | FROZEN |
| UI and Information Architecture | `07-ui/ui-architecture.md` | VALIDATED |
| Design System and components | `07-ui/design-system-v1.md` | VALIDATED |
| Implementation milestones | `09-implementation/README.md` | M0 DONE; M1 IN PROGRESS |
| M0 Slice 01 source audit | `09-implementation/m0-kernel/slice-01/README.md` | 01A–01F DONE |
| M1 4-Week Learning MVP | `09-implementation/m1-four-week-learning/` | SLICE 01 IN PROGRESS |
| Vercel deployment | `10-deployment-vercel.md` | LOCAL BUILD VERIFIED; CLOUD PREVIEW PENDING |
| Architecture Gap Audit / Consolidation v2 | `08-decisions/ADR-007-architecture-consolidation-v2.md` | ACCEPTED |
| Architecture Consolidation v3 | `08-decisions/ADR-009-architecture-consolidation-v3.md` | ACCEPTED |
| Unified Practice/Assessment item model | `08-decisions/ADR-008-unified-learning-item-model.md` | ACCEPTED |
| Technical decisions | `08-decisions/` | ACCEPTED |

## Source-of-truth rule

- Curriculum definitions say what learning opportunities exist.
- Attempts, responses, artifacts, and support use record what happened.
- Observations describe what evaluators detected.
- Learning claims state the precise inference being tested within a competency.
- Exposure, practice opportunity, and evidence opportunity remain distinct.
- Evidence interprets observations for a claim/competency under stated conditions; existence is not sufficiency.
- Learner state is a recomputable projection from evidence and policy.
- Learner state is a falsifiable inference with uncertainty, not a fact about the learner.
- Decisions select actions from state, goal/target version, context, constraints, and a curriculum version, and retain a concise trace.

Do not collapse these layers into one table, score, endpoint, or UI percentage.

## Current implementation gate

Architecture v3 is conceptually frozen. The source-backed audit rates 01A–01F DONE, including live retry/idempotency, second-learner/auth-failure isolation, Vercel Preview rollback and automated frontend/accessibility verification. M1 Slice 01 implementation has begun with the Starting Point Check backend and learner-facing flow; do not claim Week 1 or 28-day outcomes until their remaining implementation and real-learner gates pass.
