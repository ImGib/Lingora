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
  -> Application API (commands and queries — next)
  -> UI (learner experience — pending)
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
| API | `06-application/api-contract-v1.md` | DRAFT / NEXT |
| UI | `07-ui/ui-architecture.md` | PENDING |
| Technical decisions | `08-decisions/` | ACCEPTED |

## Source-of-truth rule

- Curriculum definitions say what learning opportunities exist.
- Attempts, responses, artifacts, and support use record what happened.
- Observations describe what evaluators detected.
- Evidence interprets observations for a competency under stated conditions.
- Learner state is a recomputable projection from evidence and policy.
- Decisions select actions from state, goal, context, constraints, and curriculum.

Do not collapse these layers into one table, score, endpoint, or UI percentage.
