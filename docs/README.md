# Lingora Documentation Map

**Status:** BASELINE

## Architecture map

```text
Product intent
  -> Learning Constitution (what must remain true)
  -> Learning Kernel (the closed learning loop)
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
| Implementation Readiness — Slice 01 | `09-implementation-readiness/slice-01-present-simple.md` | DEFINED |
| Technical decisions | `08-decisions/` | ACCEPTED |

## Source-of-truth rule

- Curriculum definitions say what learning opportunities exist.
- Attempts, responses, artifacts, and support use record what happened.
- Observations describe what evaluators detected.
- Evidence interprets observations for a competency under stated conditions.
- Learner state is a recomputable projection from evidence and policy.
- Decisions select actions from state, goal, context, constraints, and curriculum.

Do not collapse these layers into one table, score, endpoint, or UI percentage.

## Current implementation gate

No coding has started. The next authorized build scope is only Slice 01: Clerk login and learner provisioning through goal, dashboard, Present Simple third-person singular lesson, deterministic evaluation, evidence/state update, and a refreshed next action. Later slices remain planned, not implemented.
