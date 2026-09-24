# Lingora Documentation Map

**Status:** ARCHITECTURE V2 — FROZEN FOR IMPLEMENTATION

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
  -> Implementation Readiness slices
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
| Implementation Readiness — Slice 01 | `09-implementation-readiness/slice-01-present-simple.md` | 01A IMPLEMENTED, LIVE VERIFICATION PENDING; 01B–01F DEFERRED |
| Architecture Gap Audit / Consolidation v2 | `08-decisions/ADR-007-architecture-consolidation-v2.md` | ACCEPTED |
| Technical decisions | `08-decisions/` | ACCEPTED |

## Source-of-truth rule

- Curriculum definitions say what learning opportunities exist.
- Attempts, responses, artifacts, and support use record what happened.
- Observations describe what evaluators detected.
- Learning claims state the precise inference being tested within a competency.
- Exposure, practice opportunity, and evidence opportunity remain distinct.
- Evidence interprets observations for a claim/competency under stated conditions; existence is not sufficiency.
- Learner state is a recomputable projection from evidence and policy.
- Decisions select actions from state, goal/target version, context, constraints, and a curriculum version, and retain a concise trace.

Do not collapse these layers into one table, score, endpoint, or UI percentage.

## Current implementation gate

Architecture v2 is frozen for implementation. Slice 01A Foundation & Identity is implemented in code; live Clerk + Supabase verification awaits configured credentials/infrastructure. Checkpoints 01B–01F remain planned and are not authorized by the 01A checkpoint. Migration groups remain gated by integration tests, and PracticeItem versus AssessmentItem must be resolved before the first content migration.
