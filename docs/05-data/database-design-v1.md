# Database Design v1

**Status:** Phase A logical model **COMPLETE**; Phase B physical strategy and first vertical slice **VALIDATED**

This is a design specification, not a migration.

## Physical strategy

Use PostgreSQL `public` for the MVP physical schema and preserve module boundaries in NestJS. This supersedes the earlier idea of many PostgreSQL schemas: multiple schemas would add RLS, migration, Data API, and tooling complexity without enough early benefit.

Keep four conceptual layers:

1. Definition: curriculum, competency, content, and assessment.
2. Learner fact: goals, sessions, attempts, responses, artifacts, support.
3. Learner intelligence: observations, evidence, state, issues.
4. Orchestration: roadmaps, daily plans, plan blocks, review/recovery.

Use UUID primary keys, `timestamptz`, stable human-readable codes for definitions, explicit status/version fields, foreign keys, and append-oriented facts. Use relational columns for stable/queryable semantics and bounded JSONB for varying response/config/raw-evaluator payloads.

## Phase B first vertical slice

```text
auth.users -> profiles -> learner_goals
programs -> stages/tracks/stage_tracks -> modules -> units -> lessons
competencies + competency_relations + lesson_competencies
learning_packages/versions -> activities
sessions -> daily_plans/plan_blocks -> attempts -> responses/support_usages
evaluation_runs -> observations -> evidence/evidence_observations
competency_states
```

It must support: register -> set goal -> learn Present Simple -> attempt -> evaluate -> update state -> explain next dashboard action.

## Definition tables

- `profiles(id -> auth.users.id, display_name, native_language, timezone, timestamps)`; do not duplicate password/provider credentials.
- `programs`, `stages`, `tracks`, `stage_tracks`, `modules`, `units`, `lessons`: codes, ordering, purpose, status, version.
- `competencies`, `competency_relations`, `competency_indicators`.
- `lesson_competencies(role, target_depth, target_modality)`.
- `learning_objectives`, `learning_outcomes`, `outcome_competencies`, `outcome_evidence_requirements(policy_config JSONB)`.
- `knowledge_objects(knowledge_type, canonical_definition, knowledge_data JSONB)`; vocabulary specialization through `lexemes` and `lexeme_senses` as needed.
- `learning_packages`, `learning_package_versions`, `activities(config JSONB)`.
- `content_objects`, `content_competencies`, `activity_content`.
- `item_families`, `assessment_items`, `assessment_item_competencies`.
- `assets`: metadata/reference only; binary lives in object storage.

## Learner fact tables

- `learner_goals`: target columns, study level, deadline, availability, lifecycle/version; retain history and enforce at most one active primary goal.
- `sessions`: learner, optional plan, status, available time, energy/environment, timestamps.
- `attempts`: learner, session/plan block, activity/item/package version, type, status, performance condition, timestamps, idempotency key.
- `responses`: response type/value JSONB, timing, revision; correctness is not source response data.
- `support_usages`: hint/transcript/replay/dictionary/translation/model/AI support, level, time, duration, metadata.
- `artifacts` and `artifact_versions`: text in PostgreSQL; audio via storage asset reference.
- `artifact_contributions`: learner/AI-suggested/AI-inserted/copied-model/unknown provenance.
- `evaluation_runs`: evaluator/provider/model/prompt versions, status, confidence, error details.
- `observations`: source references, type/target, raw value JSONB, confidence, observed time, validity.

## Intelligence and orchestration

- `evidence`: learner, competency, modality/type/direction, strength, independence, novelty, difficulty, transfer/retention distance, trust/confidence, status, policy version.
- `evidence_observations`: many-to-many links and optional contribution weight.
- `competency_states`: unique learner/competency/modality projection with multidimensional state, confidence/sufficiency/freshness and policy/computation metadata.
- `knowledge_item_states`: compact SRS-oriented state where justified.
- `learning_issues`, `learning_issue_competencies`, `learning_issue_evidence`.
- `roadmaps`, `roadmap_versions`, `roadmap_milestones`.
- `daily_plans`, `plan_blocks`; block types include learning, review, assessment, recovery, transfer, and break.

`EvidenceBundle`, weakness, bottleneck, readiness, ActionCandidate, and rejected candidates are not mandatory base tables in MVP. Derive them until performance/audit needs justify persistence.

## Index/constraint direction

- Unique definition code within its owner; unique `(stage_id, track_id)`.
- Unique current state `(learner_id, competency_id, modality)`.
- Partial uniqueness for active primary goal/current published package where applicable.
- Index high-volume facts by learner/time, attempt, competency/time/status, plan/date, and storage lifecycle state.
- Validate bounded enums/ranges, mutually valid source references, positive durations, and version monotonicity.
- Partitioning is deferred until measured volume requires it.
