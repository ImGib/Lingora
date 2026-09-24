# Domain Model v1

**Status:** FROZEN

## Domain layers

```text
Definition State: curriculum, competency, content, assessment definitions
Learner Facts: goals, sessions, attempts, responses, artifacts, support use
Observations: versioned evaluator output close to source events
Derived Intelligence: evidence, competency state, issues, forecasts
Orchestration: roadmaps, daily plans, plan blocks, recovery/review schedules
Governance: provenance, policies, QA, versions, domain events
```

## Bounded responsibilities

### Identity

`Learner` owns the stable Lingora UUID. `IdentityAccount` maps an external provider subject such as Clerk to that learner; `Profile` owns learner-facing preferences. Provider identity never becomes Domain identity or a learning-history foreign key.

### Goal

`LearnerGoal` owns the active target profile and lifecycle. Goal history is retained; at most one primary goal is active initially. Goal changes invalidate forecasts and require replanning but do not mutate evidence.

### Learning Definition

`Program`, `StageDefinition`, `TrackDefinition`, `StageTrack`, `ModuleDefinition`, `UnitDefinition`, `LessonDefinition`, `LearningObjective`, and `LearningOutcome` define learning intent. Definitions never own learner progress.

### Competency

`Competency`, `CompetencyRelation`, and `CompetencyIndicator` own stable capability meaning and graph relationships. `OutcomeEvidenceRequirement` declares what kind of evidence an outcome requires.

### Content

`CanonicalKnowledge`, `ContentObject`, `LearningPackage`/`LearningPackageVersion`, `ActivityDefinition`, `AssessmentItem`/`AssessmentItemVersion`, `ItemFamily`, `Asset`, and transcript/audio metadata own teachable and assessable material. Stable identities are distinct from immutable published versions. A lesson references canonical truth; it does not duplicate it.

### Learner Experience

`Session`, `LearningAttempt`, `Response`, `SupportUsage`, `LearnerArtifact`, `ArtifactVersion`, and `ContributionProvenance` record what happened. Attempt types include practice, review, transfer, assessment, checkpoint, mock, and benchmark.

### Evaluation and Observation

`EvaluationRun` records evaluator/provider/model/prompt/policy versions and operational status. `Observation` is immutable/source-near and can be invalidated or superseded without deletion. `TechnicalEvent` is kept out of learner performance.

### Learner Intelligence

`Evidence`, `EvidenceOpportunity`, `EvidenceBundle` (initially a DTO), `CompetencyState`, `KnowledgeItemState`, and `LearningIssue` interpret facts. State and decisions remain recomputable.

### Planning

`Roadmap`/version, `DailyPlan`, `PlanBlock`, `ReviewSchedule`, and `RecoveryPlan` turn learning needs into selected work. `ActionCandidate` and `NextActionSet` are decision concepts; rejected candidates are not persisted by default.

## Core relationships

```text
Program 1--N Stage; Program 1--N Track; Stage N--N Track
StageTrack 1--N Module 1--N Unit 1--N Lesson
Lesson N--N Competency; Outcome N--N Competency
Lesson 1--N LearningPackage; LearningPackage 1--N LearningPackageVersion
PackageVersion 1--N Activity; Activity N--N AssessmentItemVersion
AssessmentItem 1--N AssessmentItemVersion; AssessmentItem N--N Competency
Activity/Item 1--N Attempt 1--N Response / 0--N Artifact
Attempt 1--N EvaluationRun 1--N Observation
Evidence N--N Observation; Evidence N--1 Competency
Learner + Competency + Modality -> CompetencyState
DailyPlan 1--N PlanBlock 1--N Attempt
```

## Invariants

- Definitions, learner facts, and derived intelligence never share ownership.
- Attempts reference exact definition/package/item versions.
- Published package and item versions are immutable and remain resolvable while referenced.
- External provider subjects map to, but never replace, Lingora LearnerId.
- Observation != Evidence; Evidence != State; State != Decision.
- AI contributions never masquerade as learner-authored production.
- Domain objects have no infrastructure SDK dependencies.
