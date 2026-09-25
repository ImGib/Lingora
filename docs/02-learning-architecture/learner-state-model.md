# Learner State Model

**Status:** FROZEN

Learner state is a family of projections, not a single mastery score.

## Competency state

Conceptual key: `(learner, competency, modality)`.

Dimensions include acquisition, accuracy, independence, retention, transfer, contextual automaticity, estimate confidence, evidence sufficiency, freshness, last evidence, last verification, policy version, and computed time. Historical evidence and current confidence are distinct. Exact numeric formulas are intentionally not frozen.

Proficiency states:

```text
UNKNOWN -> INTRODUCED -> LEARNING -> FAMILIAR -> PROFICIENT -> MASTERED
```

Transitions are evidence-gated and may skip early labels when diagnostic evidence is strong. `MASTERED` is a high-confidence current claim, not permanence. One error does not trigger downgrade; hysteresis prevents oscillation.

Persist a `CompetencyState` only when its key/meaning is stable, it is recomputable from traceable evidence under a named policy, its uncertainty/sufficiency are expressible, and at least one product decision or learner explanation consumes it. Do not persist decorative percentages or one state row per microscopic rubric feature.

## Orthogonal state families

- Evidence sufficiency: insufficient, emerging, sufficient, conflicted.
- Retention: unverified, fresh, due, stale, refreshed; confidence may decay with time, but stale does not mean forgotten. `FORGOTTEN` is not inferred without prior learning evidence and discriminating verification.
- Transfer: untested, near, varied, far/generalized as appropriate.
- Performance: supported, controlled, independent, automatic/real-time, context-sensitive. Speed and accuracy are interpreted only under comparable context/load.
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

Current state is derived from durable facts and versioned policies. Reprojection records policy/effective time and never mutates source facts or historical DecisionTrace. Early versions avoid a full state-history table; add periodic snapshots only for proven analytics/performance needs. Learner-facing UI uses qualitative language and uncertainty rather than fake precision.
# Consolidation v3 inference contract

Learner State is a versioned, recomputable and falsifiable inference over an evidence cutoff. It must include uncertainty/sufficiency and must be possible to state a future observation that would weaken it. Absence of evidence remains `UNKNOWN`; stale evidence lowers current confidence rather than rewriting historical success.

Decision consumers must respect horizon and impact. One observation may drive feedback; it cannot by itself justify a weekly progression, confirmed weakness, placement or readiness claim. High-impact decisions require independent, varied, technically valid and appropriately retained/transferred evidence or must return `INSUFFICIENT EVIDENCE`.
