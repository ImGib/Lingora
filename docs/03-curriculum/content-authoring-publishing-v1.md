# Content Authoring & Publishing Architecture v1

**Status:** FROZEN

This document governs how curriculum, lessons, packages, activities, assessment items, and assets become learner-ready. It does not replace curriculum meaning in `curriculum-architecture.md` or persistence details in `database-design-v1.md`.

## Surfaces and ownership

Learner and Authoring experiences share one Next.js application and one NestJS modular monolith, but have separate navigation and capabilities. Authoring covers Curriculum, Competencies, Knowledge, Lessons, Activities, Assessment Items, Assets, QA, and Publishing. Publication remains an authoritative NestJS command.

## Lifecycle and immutable publication

```text
DRAFT -> IN_REVIEW -> VALIDATED -> READY -> PUBLISHED -> ARCHIVED
                      `-> REJECTED
PUBLISHED -> QUARANTINED -> PUBLISHED | ARCHIVED
```

Not every object uses every state, but `PUBLISHED` always means learner-exposable. Drafts may be autosaved and mutated. A published version is immutable: changes clone it into a new draft version, pass validation/readiness again, and publish atomically.

Stable identity and version identity are separate:

```text
LearningPackage -> LearningPackageVersion 1, 2, ...
AssessmentItem  -> AssessmentItemVersion 1, 2, ...
```

Attempts pin `learning_package_version_id` and every delivered `assessment_item_version_id` at start. A publication while an attempt is in progress cannot replace its content or answer definition. Archived referenced versions remain addressable; published referenced content is not hard-deleted.

Before the first content migration, resolve whether practice interactions and assessment evidence need distinct `PracticeItem` and `AssessmentItem` roots or one versioned item with explicit purpose/evidence eligibility. The decision must preserve exact delivery version, answer/rubric secrecy where applicable, support policy, and evidence-opportunity meaning; table naming must not decide pedagogy.

## Authoring sequence

```text
define lesson intent
-> objectives and observable outcomes
-> target/prerequisite competencies and modality/depth
-> evidence requirements
-> instruction and examples
-> guided/controlled/independent practice
-> assessment opportunities
-> support/feedback/recovery/transfer/review
-> QA and readiness
-> publish
```

Authors do not begin with a question dump. Curriculum hierarchy and the competency graph stay independent and link explicitly at lesson, outcome, activity, and item levels.

## Readiness gate

A core package version can become `READY` only when validators confirm:

- lesson, objective, outcome, competency, and prerequisite references exist;
- instruction, controlled practice, independent practice, and a valid evidence opportunity exist;
- answer/rubric definitions and required explanations are valid;
- evidence mapping/claim, modality, cognitive demand, authored difficulty, and confounding are coherent;
- required assets are ready and references are not broken;
- coverage includes the intended teach/practice/independent/review/transfer obligations;
- prerequisite graphs have no forbidden cycles, unreachable outcomes, or orphan references;
- blocking QA results are resolved.

Readiness is policy-driven and versioned. It is not equivalent to “all required columns are non-null.”

## Assessment QA and benchmark isolation

Assessment item versions record prompt, response type, answer/rubric, explanation, competency/claim mapping, modality, authored difficulty, cognitive demand, evidence opportunity strength, confounding load, ItemFamily/exposure policy, provenance, and trust. Empirical difficulty/calibration is a separately versioned projection based on adequate data; it never silently overwrites the authored intent.

Benchmark content is isolated:

- it is never returned through ordinary content/item listing;
- answers, calibration, mappings, and adaptive/evaluator rules remain server-only;
- delivery and reuse are controlled and auditable;
- exposure or compromise prevents strong benchmark claims and may quarantine derived evidence.

## Provenance, AI, and trust

Important content records origin, author/generator, source references, review state, and reviewer. Origins include `HUMAN_AUTHORED`, `AI_ASSISTED`, `AI_GENERATED`, `IMPORTED`, and `ADAPTED`.

Conceptual trust tiers are:

```text
T0 UNKNOWN
T1 GENERATED
T2 AUTO_VALIDATED
T3 REVIEWED
T4 BENCHMARK
```

AI may propose examples, distractors, scripts, explanations, mappings, or constrained variants, but it is an authoring assistant—not curriculum authority. Canonical core content follows `AI -> DRAFT -> automated checks -> review -> READY -> PUBLISHED`.

Adaptive ephemeral practice may use lower-trust generated variants, preferably from reviewed `ItemFamily` constraints. It cannot support high-stakes evidence or benchmark claims; its trust tier reduces allowable evidence strength. Avoid persisting thousands of near-identical generated items when a reviewed family plus bounded generation is sufficient.

ItemFamily also bounds exposure and memorization risk. A cosmetically different variant from a repeatedly seen family is not automatically novel or transfer evidence.

## Content Health and release readiness

Content Health combines reference/asset integrity, learner reports, answer/rubric disputes, evaluator disagreement, empirical difficulty drift, anomalous success/failure, exposure/leakage, accessibility, and outcome effectiveness. Signals do not automatically condemn content; they open review, can cap evidence trust, or quarantine an exact version/family. Resolution records reason and may invalidate/supersede downstream interpretations through lineage-aware reprojection.

Content readiness means an exact package/item version may be delivered. Feature release readiness is broader: learning semantics, migration/contract compatibility, privacy/security, accessibility, provider cost/degraded modes, observability, rollback, and appropriate real-learner validation. Both gates are versioned and neither is a synonym for deployment success.

## Core, supplemental, and external content

- `CORE` is self-contained, passes readiness, and cannot depend on an external site.
- `SUPPLEMENTAL` may link optional external resources.
- `EXPLORATORY` may be more dynamic but cannot silently enter the core learning path.

System content assets and learner artifacts are different entities and access classes. Audio readiness includes readable format, duration, volume, and transcript alignment where required. Asset failure blocks content readiness; it never becomes learner failure.

## Publication command and concurrency

Publishing is a command such as `POST /v1/admin/package-versions/:id/publish`, not a generic status patch. It runs readiness, coverage, reference, asset, assessment, and authorization checks, then atomically publishes the coherent package version and changes current-version pointers. A `LearningPackagePublished` event may invalidate curriculum caches, refresh coverage projections, or affect future planner eligibility; it does not recompute learner ability.

Draft editing uses optimistic concurrency (`expectedRevision`) and returns a conflict rather than silently overwriting a newer draft. Solo MVP users may hold editor/reviewer/publisher capabilities simultaneously, but those capabilities remain distinct for future collaboration.

## Governance projections

`content_qa_results` may use controlled polymorphism for governance targets and records check type, status, severity, code, message, validator version, and resolution. Authoring read models may summarize drafts, QA blockers, ready versions, coverage gaps, broken assets, and missing transfer evidence. They are projections, not source entities.

## Invariants

- `CONTENT-01` Published versions are immutable.
- `CONTENT-02` In-progress attempts pin exact package and item versions.
- `CONTENT-03` Historical semantic definitions cannot be silently redefined.
- `CONTENT-04` AI-generated content is not automatically trusted content.
- `CONTENT-05` Core content passes readiness validation.
- `CONTENT-06` Core learning cannot depend on external resources.
- `CONTENT-07` Assessment secrets are server-controlled.
- `CONTENT-08` Benchmark content is isolated.
- `CONTENT-09` Publication does not modify learner ability.
- `CONTENT-10` Archiving does not erase historical interpretation.
- `CONTENT-11` Learner artifacts and system content are distinct.
- `CONTENT-12` Draft mutation and published-version mutation follow different rules.
- `CONTENT-13` Content trust constrains allowable evidence strength.
- `CONTENT-14` Core readiness requires competency and evidence mapping.
- `CONTENT-15` Technical asset failure is not learner failure.
- `CONTENT-16` Authored and empirical difficulty remain distinct.
- `CONTENT-17` ItemFamily exposure constrains novelty and memorization risk.
- `CONTENT-18` Content Health changes propagate by traceable invalidation/supersession, never history deletion.
