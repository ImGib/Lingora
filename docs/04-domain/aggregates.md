# Aggregates and Transaction Boundaries

**Status:** FROZEN

Aggregates are kept small. A user workflow may coordinate several aggregates through application services and domain events; it does not create a giant `Learner` aggregate.

## Primary aggregates

### LearnerGoal

Owns target profile, status, activation/supersession, and goal version rules. Commands: create, activate, pause, replace, change deadline/target. Emits goal-change events for forecast/roadmap invalidation.

### Curriculum definitions

`Program` and scoped definition roots protect unique codes, ordering, version status, and publishability. Competency and content catalogs remain separate aggregates linked by IDs.

### LearningPackage

Owns package versions and exactly one current published version when active. Publication requires readiness/QA; historical versions remain resolvable.

### AssessmentItem

Owns stable item identity and immutable published item versions. An attempt references the exact delivered version; answer/rubric changes require a new draft version.

### LearningAttempt

Owns attempt lifecycle, idempotency key, source definition references, performance conditions, responses, and support records. Artifacts may be separate aggregates referenced by attempt because writing/speaking versions have their own lifecycle.

### LearnerArtifact

Owns immutable versions and contribution provenance. Original speaking media is retained according to storage policy; transcripts are interpretations, not replacements.

### EvaluationRun

Owns evaluator execution state and its observations. Multiple runs can exist for an attempt. It cannot directly mutate competency state.

### Evidence/State projection

Evidence records are append-oriented interpretations linked to observations. `CompetencyState` is a projection updated by an application process under a versioned policy, never by the browser.

### LearningIssue / RecoveryPlan

Issue clusters repeated attributable evidence and moves through suspicion, confirmation, recovery, resolution, and reopening. RecoveryPlan owns target, hypothesis, activities, retest, and later verification.

### Roadmap and DailyPlan

Roadmap versions provide longer orientation; DailyPlan owns a dated set of ordered blocks and is the source for planned sequence. NextAction is the preferred executable projection, not an independent plan. A block can produce many attempts. Replanning or skip/defer/replace/explore creates/revises plan state without rewriting learning facts.

### DecisionTrace and governance projections

A concise DecisionTrace captures decision type/time, relevant goal/target and curriculum versions, state/evidence snapshot references or digest, policy version, hard constraints/vetoes, selected action, standardized reason codes, and override. It need not store every candidate. Content Health, intervention effectiveness, release readiness, and evaluator-quality views remain projections/configuration until a slice proves aggregate persistence.

## Transaction examples

### Submit attempt

Atomically finalize attempt input, responses/support metadata, exact package/item version references, and artifact reference under an idempotency key. Emit `AttemptSubmitted`; evaluation may be synchronous for deterministic grammar or asynchronous for later skills.

### Evaluate attempt

Create an EvaluationRun and observations atomically. Subsequent handlers create evidence and recompute affected projections. A failed evaluator leaves the attempt intact and creates a recoverable operational state.

### Change goal

Replace/activate goal atomically, emit `GoalChanged`, then asynchronously invalidate forecast, recalculate gap/critical path, and mark roadmap for replanning. No evidence rewrite occurs.

## Domain events

Domain events coordinate processes and explain important transitions. They are not a complete event-sourcing strategy and are distinct from analytics telemetry. An outbox or equivalent may be introduced at the application/infrastructure boundary when reliable asynchronous processing is implemented.
