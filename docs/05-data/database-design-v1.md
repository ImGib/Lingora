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

## Slice 01 first migration set

```text
Identity
  learners, identity_accounts, profiles

Goal
  learner_goals

Curriculum
  programs, stages, tracks, stage_tracks, modules, units, lessons

Competency
  competencies, competency_relations, lesson_competencies

Content
  learning_packages, learning_package_versions, activities
  assessment_items, assessment_item_versions
  activity_items, assessment_item_competencies

Learning facts
  sessions, attempts, responses, support_usages

Intelligence
  observations, evidence, competency_states

Planning
  daily_plans, plan_blocks
```

This is approximately 30 physical tables after the package/item versioning refinement; exact migration grouping may change without changing ownership. It must support: Clerk login/provisioning -> set goal -> daily plan/dashboard -> learn Present Simple -> save/use support/submit -> deterministic evaluation -> Observation -> Evidence -> CompetencyState -> updated next action.

Slice 01 deliberately defers `artifacts`, `artifact_versions`, `evaluation_runs`, `jobs`, `learning_issues`, `knowledge_objects`, `lexemes`, `roadmaps`, `content_qa_results`, domain-event/outbox tables, and readiness/forecast snapshots. They remain valid architecture concepts and are introduced by the slice that demonstrates the need. Deterministic grammar evaluation records evaluator/policy version directly with source-near facts until `EvaluationRun` is required.

## Definition tables

- `learners(id UUID, lifecycle timestamps)` is the durable Lingora identity root.
- `identity_accounts(id, learner_id, provider, provider_user_id, timestamps)` maps Clerk subjects; unique `(provider, provider_user_id)`. Provider IDs never become learner foreign keys.
- `profiles(learner_id, display_name, native_language, timezone, timestamps)` contains learner-facing data; do not duplicate passwords or broad provider metadata.
- `programs`, `stages`, `tracks`, `stage_tracks`, `modules`, `units`, `lessons`: codes, ordering, purpose, status, version.
- `competencies`, `competency_relations`, `competency_indicators`.
- `lesson_competencies(role, target_depth, target_modality)`.
- `learning_objectives`, `learning_outcomes`, `outcome_competencies`, `outcome_evidence_requirements(policy_config JSONB)`.
- `knowledge_objects(knowledge_type, canonical_definition, knowledge_data JSONB)`; vocabulary specialization through `lexemes` and `lexeme_senses` as needed.
- `learning_packages` owns stable package identity; `learning_package_versions` owns monotonic version number, lifecycle/readiness, policy/configuration, provenance, and publication timestamps.
- `activities(config JSONB)` belongs to an exact package version.
- `content_objects`, `content_competencies`, `activity_content`.
- `item_families`, stable `assessment_items`, immutable `assessment_item_versions`, `activity_items`, and `assessment_item_competencies`. Delivered attempts/responses reference exact item versions.
- `assets`: metadata/reference only; binary lives in object storage.

## Learner fact tables

- `learner_goals`: target columns, study level, deadline, availability, lifecycle/version; retain history and enforce at most one active primary goal.
- `sessions`: learner, optional plan, status, available time, energy/environment, timestamps.
- `attempts`: learner, session/plan block, activity, exact package version, type, status, performance condition, timestamps, idempotency key.
- Attempt item resolution pins exact `assessment_item_version_id`; response ownership validates membership through `activity_items`.
- `responses`: response type/value JSONB, timing, revision; correctness is not source response data.
- `support_usages`: hint/transcript/replay/dictionary/translation/model/AI support, level, time, duration, metadata.
- `artifacts` and `artifact_versions`: text in PostgreSQL; audio via storage asset reference.
- `artifact_contributions`: learner/AI-suggested/AI-inserted/copied-model/unknown provenance.
- `observations`: source references, type/target, raw value JSONB, confidence, observed time, validity.

## Intelligence and orchestration

- `evidence`: learner, competency, modality/type/direction, strength, independence, novelty, difficulty, transfer/retention distance, trust/confidence, status, policy version.
- Slice 01 may link Evidence directly to its source Observation. Add `evidence_observations` when multi-observation/multi-evidence interpretation is implemented.
- `competency_states`: unique learner/competency/modality projection with multidimensional state, confidence/sufficiency/freshness and policy/computation metadata.
- `knowledge_item_states`: compact SRS-oriented state where justified.
- `learning_issues`, `learning_issue_competencies`, `learning_issue_evidence`.
- `roadmaps`, `roadmap_versions`, `roadmap_milestones`.
- `daily_plans`, `plan_blocks`; block types include learning, review, assessment, recovery, transfer, and break.

`EvidenceBundle`, weakness, bottleneck, readiness, ActionCandidate, and rejected candidates are not mandatory base tables in MVP. Derive them until performance/audit needs justify persistence.

## Index/constraint direction

- Unique definition code within its owner; unique `(stage_id, track_id)`.
- Unique external identity `(provider, provider_user_id)` and idempotent first-login provisioning.
- Unique package/item version number within stable identity; at most one current published package version.
- Unique current state `(learner_id, competency_id, modality)`.
- Partial uniqueness for active primary goal/current published package where applicable.
- Index high-volume facts by learner/time, attempt, competency/time/status, plan/date, and storage lifecycle state.
- Validate bounded enums/ranges, mutually valid source references, positive durations, and version monotonicity.
- Partitioning is deferred until measured volume requires it.

## Seed contract for Slice 01

Seed data is reproducible and uses stable codes with deterministic UUIDs or a stable lookup layer:

```text
PROGRAM.IELTS_ACADEMIC
STAGE.S1
TRACK.GRAMMAR
LESSON.PRESENT_SIMPLE.THIRD_PERSON
GRAM.PRESENT_SIMPLE.MEANING
GRAM.PRESENT_SIMPLE.AFFIRMATIVE
GRAM.PRESENT_SIMPLE.THIRD_PERSON
PACKAGE.PRESENT_SIMPLE_3PS.V1
```

The package is `PUBLISHED` and contains instruction, recognition, controlled practice, independent check, and summary/reflection. Seed scripts are planned implementation artifacts, not part of this Markdown-only update.
