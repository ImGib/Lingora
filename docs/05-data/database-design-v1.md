# Database Design v1

**Status:** Phase A logical model **COMPLETE**; Phase B physical strategy and first vertical slice **VALIDATED**

This is a design specification, not a migration.

## Physical strategy

Use PostgreSQL `public` for the MVP physical schema and preserve module boundaries in NestJS. This supersedes the earlier idea of many PostgreSQL schemas: multiple schemas would add RLS, migration, Data API, and tooling complexity without enough early benefit.

Keep four conceptual planes aligned with the Learning Kernel:

1. Definition: curriculum, competency, content, and assessment.
2. Learning: learner facts plus evaluation, observations, evidence, feedback and state.
3. Decision: roadmaps, daily plans, plan blocks, review/recovery and concise decision traces.
4. Governance/System Learning: policies, provenance, health/quality signals, releases, invalidation and reprojection.

These planes do not imply one schema or table per concept. Default to semantic contracts, stable codes, bounded JSONB/configuration, and recomputable projections until a slice demonstrates identity, lifecycle, audit, query, or performance requirements.

Use UUID primary keys, `timestamptz`, stable human-readable codes for definitions, explicit status/version fields, foreign keys, and append-oriented facts. Use relational columns for stable/queryable semantics and bounded JSONB for varying response/config/raw-evaluator payloads.

## Slice 01 migration gates

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

The list below is the validated logical destination, not permission to create approximately 30 tables in one first migration. Apply grouped migrations only after the preceding checkpoint has an integration test:

```text
A Identity
B Curriculum + Competency
C Content (only after PracticeItem vs AssessmentItem decision)
D Learning facts
E Intelligence
F Planning
```

Each group contains only the subset required by Slice checkpoints 1A–1F. A table named below may remain deferred even if its concept is valid.

Slice 01 deliberately defers `artifacts`, `artifact_versions`, `evaluation_runs`, `jobs`, `learning_issues`, `knowledge_objects`, `lexemes`, `roadmaps`, `content_qa_results`, intervention/content-health/release tables, full decision-candidate logs, domain-event/outbox tables, and readiness/forecast snapshots. They remain valid architecture concepts and are introduced by the slice that demonstrates the need. Deterministic grammar evaluation records evaluator/policy version directly with source-near facts until `EvaluationRun` is required.

## Definition tables

- `learners(id UUID, lifecycle timestamps)` is the durable Lingora identity root.
- `identity_accounts(id, learner_id, provider, provider_user_id, timestamps)` maps Clerk subjects; unique `(provider, provider_user_id)`. Provider IDs never become learner foreign keys.
- `profiles` begins in Slice 01A with `display_name`, `native_language`, and an IANA `timezone`. Later slices may add `ui_locale`, `instruction_language`, `target_language`, and `content_locale` only when their UI/content use cases exist; these concepts remain distinct and must never be inferred from one another. Do not duplicate passwords/provider metadata.
- `programs`, `stages`, `tracks`, `stage_tracks`, `modules`, `units`, `lessons`: codes, ordering, purpose, status, version.
- `competencies`, `competency_relations`, `competency_indicators`.
- `lesson_competencies(role, target_depth, target_modality)`.
- `learning_objectives`, `learning_outcomes`, `outcome_competencies`, `outcome_evidence_requirements(policy_config JSONB)`.
- `knowledge_objects(knowledge_type, canonical_definition, knowledge_data JSONB)`; vocabulary specialization through `lexemes` and `lexeme_senses` as needed.
- `learning_packages` owns stable package identity; `learning_package_versions` owns monotonic version number, lifecycle/readiness, policy/configuration, provenance, and publication timestamps.
- `activities(config JSONB)` belongs to an exact package version.
- `content_objects`, `content_competencies`, `activity_content`.
- ADR-008 selects one `learning_items` / `learning_item_versions` model with explicit purpose and evidence eligibility for Migration C. Practice and Assessment remain semantically distinct despite sharing lifecycle persistence.
- `item_families` express shared construct/generation constraints and exposure/memorization risk; authored difficulty is definition data while empirical difficulty is a versioned aggregate/projection requiring adequate samples. Delivered attempts/responses reference exact item versions.
- `assets`: metadata/reference only; binary lives in object storage.

## Learner fact tables

- `learner_goals`: target columns, study level, deadline, availability, lifecycle/version; retain history and enforce at most one active primary goal.
- `sessions`: learner, optional plan, status, available time, energy/environment/device/modality context, learner local date + IANA timezone, UTC timestamps.
- `attempts`: learner, session/plan block, activity, exact package version, type, status, performance condition, timestamps, idempotency key.
- Attempt item resolution pins exact `assessment_item_version_id`; response ownership validates membership through `activity_items`.
- `responses`: response type/value JSONB, timing, revision, and optional pre-feedback confidence; correctness is not source response data.
- `support_usages`: hint/transcript/replay/dictionary/translation/model/AI support, level, time, duration, metadata.
- `artifacts` and `artifact_versions`: text in PostgreSQL; audio via storage asset reference.
- `artifact_contributions`: learner/AI-suggested/AI-inserted/copied-model/unknown provenance.
- `observations`: source references, type/target, raw value JSONB, confidence, observed time, validity.

## Intelligence and orchestration

- `evidence` v0 stays minimal/extensible: source lineage, learner, competency + claim/modality, direction, strength/confidence, independence/support, opportunity/ItemFamily context, occurred time, validity, and policy version. Richer retention/transfer/context/difficulty fields may remain bounded extensions until queried at scale.
- Slice 01 may link Evidence directly to its source Observation. Add `evidence_observations` when multi-observation/multi-evidence interpretation is implemented.
- `competency_states`: unique learner/competency/modality projection with multidimensional state, confidence/sufficiency/freshness and policy/computation metadata.
- `knowledge_item_states`: compact SRS-oriented state where justified.
- `learning_issues`, `learning_issue_competencies`, `learning_issue_evidence`.
- `roadmaps`, `roadmap_versions`, `roadmap_milestones`.
- `daily_plans`, `plan_blocks`; block types include learning, review, assessment, recovery, transfer, and break.

`LearningClaim`, Opportunity types, EvidenceBundle, weakness, bottleneck, readiness, Content Health, intervention effectiveness, feature-release readiness, ActionCandidate, and rejected candidates are not mandatory base tables in MVP. Derive/configure them until performance/audit/lifecycle needs justify persistence. Retain only a concise DecisionTrace when decision reproducibility requires it.

## Version and time semantics

- Stable identity is separate from immutable version; versions carry status, created/published/effective times, and supersession linkage.
- Attempts pin content/item/evaluator versions. Decisions pin or digest the goal/target, curriculum, state/evidence, and policy context used.
- Reprojection creates a new computed result under a declared policy; it never overwrites historical evidence or the decision trace that used an older projection.
- UTC instants record events. Learner calendar dates are interpreted with the IANA timezone effective for that plan/session; timezone changes do not move historical days silently. Application clocks are injectable for tests.

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
