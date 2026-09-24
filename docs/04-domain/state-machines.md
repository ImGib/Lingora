# State Machines

**Status:** FROZEN

No single state machine represents “learning.” Orthogonal state families prevent semantic collapse.

## Proficiency

```text
UNKNOWN -> INTRODUCED -> LEARNING -> FAMILIAR -> PROFICIENT -> MASTERED
```

Diagnostic evidence may enter above `INTRODUCED`. Promotion requires competency-specific evidence. Regression uses hysteresis and repeated meaningful evidence; one bad day is insufficient.

## Evidence lifecycle

```text
ACTIVE -> QUARANTINED -> ACTIVE | REVOKED
ACTIVE -> SUPERSEDED
```

Quarantine is used for suspected item, content, artifact, or evaluator defects while impact is reviewed.

## Retention and transfer

```text
Retention: UNVERIFIED -> FRESH -> DUE -> STALE -> REFRESHED
Transfer:  UNTESTED -> NEAR -> VARIED -> FAR/GENERALIZED
```

Stale evidence triggers verification; it does not assert forgetting. Transfer failure updates transfer/performance state before changing knowledge state.

Evidence-age policy may decay current confidence and make verification due. `NEVER_LEARNED`, `FORGOTTEN`, and `CONTEXT/PERFORMANCE_FAILURE` are competing hypotheses requiring different prior history and probes, not proficiency states assigned from one response.

## Learning issue and recovery

```text
SUSPECTED -> CONFIRMED -> RECOVERING -> RESOLVED
                   |          |            |
                   `-> DISMISSED           `-> REOPENED
```

If recovery fails, change modality/explanation, run a discriminating prerequisite probe, or escalate uncertainty. Do not repeat the same activity indefinitely.

## Attempt and evaluation

```text
Attempt: CREATED -> IN_PROGRESS -> SUBMITTED -> EVALUATING -> EVALUATED
                     |              |              |
                     -> ABANDONED   -> CANCELLED   -> EVALUATION_FAILED/RETRYABLE
```

Skipped, abandoned, and technical failure remain distinct. Evaluation failure cannot become learner failure.

## Session and plan

```text
Session: PLANNED -> ACTIVE -> PAUSED -> ACTIVE -> COMPLETED
                         |               `-> SAFELY_ENDED
                         `-> INTERRUPTED -> RESUMABLE

Plan: DRAFT -> READY -> ACTIVE -> COMPLETED
                 |         |-> REPLAN_REQUIRED -> SUPERSEDED/READY
                 `-> BLOCKED_CONTENT -> ALTERNATIVE_READY
```

`BREAK` is a real PlanBlock type. Every interruption state defines resume, replan, alternative, or safe stop.

## Goal and roadmap

```text
Goal: DRAFT -> ACTIVE -> PAUSED -> SUPERSEDED | COMPLETED
Roadmap: DRAFT -> ACTIVE -> REQUIRES_REPLAN -> SUPERSEDED
```

Changing goal, deadline, meaningful state, availability, or curriculum version may require replanning. It does not erase history.

Each activation/supersession records version and effective time. A historical plan/decision retains the goal/target and curriculum versions it used; a newer version affects future decisions unless explicit reprojection is requested.

## Content

```text
DRAFT -> IN_REVIEW -> VALIDATED -> READY -> PUBLISHED -> ARCHIVED
                   `-> REJECTED
PUBLISHED -> QUARANTINED -> PUBLISHED | ARCHIVED
```

Generated content cannot self-promote to ready or published status. Published versions are immutable; revision creates a new draft version.
