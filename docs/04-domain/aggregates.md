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

Roadmap versions provide longer orientation; DailyPlan owns a dated set of ordered blocks. A block can produce many attempts. Replanning creates or revises plan state without rewriting learning facts.

## Transaction examples

### Submit attempt

Atomically finalize attempt input, responses/support metadata, and artifact reference under an idempotency key. Emit `AttemptSubmitted`; evaluation may be asynchronous.

### Evaluate attempt

Create an EvaluationRun and observations atomically. Subsequent handlers create evidence and recompute affected projections. A failed evaluator leaves the attempt intact and creates a recoverable operational state.

### Change goal

Replace/activate goal atomically, emit `GoalChanged`, then asynchronously invalidate forecast, recalculate gap/critical path, and mark roadmap for replanning. No evidence rewrite occurs.

## Domain events

Domain events coordinate processes and explain important transitions. They are not a complete event-sourcing strategy and are distinct from analytics telemetry. An outbox or equivalent may be introduced at the application/infrastructure boundary when reliable asynchronous processing is implemented.
