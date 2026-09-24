# Learner State Model

**Status:** FROZEN

Learner state is a family of projections, not a single mastery score.

## Competency state

Conceptual key: `(learner, competency, modality)`.

Dimensions include acquisition, accuracy, independence, retention, transfer, automaticity, estimate confidence, evidence sufficiency, freshness, last evidence, last verification, policy version, and computed time. Exact numeric formulas are intentionally not frozen.

Proficiency states:

```text
UNKNOWN -> INTRODUCED -> LEARNING -> FAMILIAR -> PROFICIENT -> MASTERED
```

Transitions are evidence-gated and may skip early labels when diagnostic evidence is strong. `MASTERED` is a high-confidence current claim, not permanence. One error does not trigger downgrade; hysteresis prevents oscillation.

## Orthogonal state families

- Evidence sufficiency: insufficient, emerging, sufficient, conflicted.
- Retention: unverified, fresh, due, stale, refreshed; stale does not mean forgotten.
- Transfer: untested, near, varied, far/generalized as appropriate.
- Performance: supported, controlled, independent, automatic/real-time, context-sensitive.
- Diagnostic issue: suspected, confirmed, recovering, resolved, reopened.
- Learning debt: none, manageable, elevated, critical; it guides compression and review.
- Session/plan/goal/roadmap state: operational projections with their own transitions.

## Learning issue, weakness, bottleneck

- Error: one source-near event.
- Learning issue: a clustered pattern with confidence and status.
- Weakness: a projection requiring adequate repeated negative evidence and below-target state.
- Bottleneck: a weakness that blocks a goal-relevant critical path.

Weakness and bottleneck need not be base tables; they can be explained projections from evidence, state, goals, and the competency graph.

## Knowledge-item state

Vocabulary/knowledge items may maintain receptive/productive state, exposure, successful recall, and review timing separately from broader competency state.

## Recomputability

Current state is derived from durable facts and versioned policies. Early versions avoid a full state-history table; add periodic snapshots only for proven analytics/performance needs. Learner-facing UI uses qualitative language and uncertainty rather than fake precision.
