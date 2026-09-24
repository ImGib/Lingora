# Curriculum Architecture

**Status:** VALIDATED

## Definition

Curriculum is the versioned universe of learning definitions and relationships. A roadmap is one learner-specific path through it; a daily plan is a time-bounded action set. Neither belongs inside curriculum definitions.

## Structure

```text
Program
  |- Stages (S0-S6 orientation)
  |- Tracks (continuous skill/knowledge dimensions)
  `- StageTrack
       `- Module -> Unit -> LessonDefinition

LessonDefinition <-> Competency
LearningOutcome <-> Competency
LessonDefinition -> LearningPackage -> immutable LearningPackageVersion
LearningPackageVersion -> Activities/Content/AssessmentItemVersions
```

Stages and tracks are many-to-many so listening, vocabulary, writing, and other tracks continue across stages. Topics provide contexts; they do not own grammar, vocabulary, or competencies.

## Stages

- S0 Diagnostic: adaptive profile and safe entry action.
- S1 English Foundation: survival through connected foundational use.
- S2 Core English: broader everyday language and independent use.
- S3 Academic English Foundation: academic genres, discourse, input, and production.
- S4 Pre-IELTS: progressive exam exposure without question-type domination.
- S5 IELTS Academic Skills: integrated language and task-specific performance.
- S6 IELTS Performance: calibrated mocks, timing, stability, and final preparation.

Study-abroad capabilities are cross-stage and continue beyond the exam.

## Definition hierarchy

- Stage: purpose, orientation, and transition profile—not a rigid lock.
- Track: durable domain such as listening or grammar.
- Module: coherent progression cluster.
- Unit: teachable sequence with integrated contexts.
- Lesson: stable learning intent and outcomes.
- Learning package: stable identity for a lesson's instructional realization.
- Learning package version: immutable learner-delivered realization once published.
- Activity: an interaction with purpose, load, support, and evidence opportunities.
- Assessment item and item version: stable item family identity plus the exact delivered prompt/answer/rubric definition.

## Coverage contract

Each stage declares required coverage across language knowledge, receptive skills, productive skills, pronunciation, discourse/functions, integration, review, transfer, and assessment. Coverage is not equal time; it is protection against invisible omission.

Validators detect missing prerequisites, orphan competencies/content, dead ends, unready packages, absent recovery/retest paths, insufficient evidence opportunity, and assessment leakage.

Detailed lifecycle, readiness, QA, provenance, AI governance, and benchmark isolation are canonical in `content-authoring-publishing-v1.md`.

## Progression rules

- Soft transitions allow adjacent-stage work and bridge content.
- Test-out requires trustworthy evidence, not lesson completion.
- Protected foundations survive deadline compression.
- Target band influences depth, not only content volume.
- Spiral learning revisits capabilities with greater independence, novelty, speed, genre, and integration.
- Skill-first learning precedes extensive exam question-type optimization.
- A stage transition is a multidimensional readiness profile, never one boolean.

## Lesson contract

A ready lesson has objectives, observable outcomes, competency mappings, prerequisites/bridges, canonical knowledge references, instruction, examples, guided/controlled/independent practice, support ladder, feedback/recovery, assessment opportunities, transfer, review, accessibility, provenance, and a valid next action for every exit.

Readiness applies to an exact package version. Publication is atomic and immutable; attempts pin the exact package and assessment-item versions they receive.
