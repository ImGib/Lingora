# ADR-008 — Unified Versioned Learning Item Model

**Status:** ACCEPTED
**Date:** 2026-09-25

## Context

Slice 01B must resolve whether practice interactions and assessment items are separate aggregate roots. Both need stable identity, immutable published versions, exact attempt pinning, content provenance, ItemFamily exposure control, competency/claim mappings, and answer/rubric secrecy. Splitting them now would duplicate lifecycle and publishing behavior before a proven security or workflow difference exists. Conversely, naming every interaction `AssessmentItem` would incorrectly imply that all practice is assessment or evidence-bearing.

## Decision

Use one stable `LearningItem` identity with immutable `LearningItemVersion` records. Purpose and evidence semantics are explicit rather than inferred from a table name:

- `purpose`: `PRACTICE`, `ASSESSMENT`, or `BENCHMARK`;
- `evidence_eligibility`: `NONE`, `FORMATIVE`, or `SUMMATIVE`;
- delivery/support policy and answer/rubric remain version-owned;
- `ItemFamily` defines shared construct/variant constraints and exposure risk;
- benchmark versions are excluded from ordinary learner projections regardless of purpose metadata.

`Practice != Assessment`, even though both currently share a lifecycle model. An activity may expose a practice item without creating an evidence opportunity. Evidence eligibility is necessary but never sufficient to create Evidence.

## Consequences

- Slice 01B uses `learning_items` and `learning_item_versions`, not `assessment_items`.
- Attempts in Slice 01C will pin exact learning-item versions.
- Learner-facing content DTOs exclude answer keys, rubrics, competency mappings, benchmark metadata, and evidence policy.
- If future authoring, secrecy, calibration, or lifecycle requirements materially diverge, a new ADR may split the aggregate with a compatibility migration.

## Rejected alternatives

- Separate PracticeItem and AssessmentItem roots now: rejected as premature duplicated architecture.
- Treat every practice question as AssessmentItem: rejected because it collapses practice and assessment semantics.
- Store purpose only on Activity: rejected because the same item version may be assembled under different activities while retaining its own evidence/security constraints.
