# Learning Kernel v1

**Status:** FROZEN

The kernel is the smallest complete loop that can produce defensible learning and an uninterrupted next action.

## Four conceptual planes

The kernel is one system viewed through four planes; these are ownership boundaries, not four required services or schemas.

| Plane | Owns |
|---|---|
| Definition | Versioned curriculum, competency and LearningClaim meanings, content/ItemFamily, evidence requirements, goals/targets, locales, and policies |
| Learning | Exposure, practice/evidence opportunities, performance/context/support, evaluation, observation, evidence, feedback, retention/transfer, and learner state |
| Decision | Readiness/gaps, eligibility/ranking, DailyPlan sequence, preferred NextAction, overrides, and DecisionTrace |
| Governance / System Learning | Content Health, evaluator agreement, invalidation/supersession, reprojection, intervention effectiveness, privacy/retention, cost/degraded modes, and release readiness |

`LearningClaim != Competency`. A claim is the precise proposition supported by evidence—for example recognize, recall, independently produce, transfer, retain, or use in real-time communication. Claims may remain policy/configuration until persistence is proven necessary.

## Learner Learning Loop

1. Establish goal and current context.
2. Select a learning need before selecting content.
3. Verify prerequisites and content readiness.
4. Present context and activate/teach the target with controlled cognitive load.
5. Move from worked examples through fading and guided practice toward independent production.
6. Capture attempt, response/artifact, session/performance context, pre-feedback confidence, timing, and all support use.
7. Evaluate through versioned evaluators; create source-near observations with confidence.
8. Determine evidence opportunities and eligibility.
9. Produce positive, negative, or neutral evidence for explicit claims with independence, novelty, authored/empirical difficulty, item-family exposure risk, transfer/retention distance, trust, and confidence.
10. Recompute relevant learner-state projections under a versioned policy.
11. Choose feedback and a next action: continue, review, recover, transfer, verify, assess, bridge, rest, or resume later.
12. Schedule delayed retrieval/verification where required.

An encounter may be only **Exposure**, may offer **Practice Opportunity**, or may additionally be a valid **Evidence Opportunity**. These are not interchangeable. Feedback/retry closes the learner loop; completion alone does not.

## System Learning Loop

```text
content/evaluator/decision/intervention outcomes
-> health and disagreement signals
-> governed diagnosis and proposed change
-> new version + feature release gate
-> monitored rollout / rollback / reprojection
```

This loop learns whether content, evaluators, policies, and interventions work. It never overwrites historical performance or silently relabels the learner. Intervention effectiveness compares intended outcome, baseline/current state, exposure, cost, and follow-up evidence; correlation is not automatically causation.

## Instructional sequence

```text
CONTEXT -> NOTICE -> COMPARE -> HYPOTHESIZE -> RULE
-> WORKED EXAMPLE -> FADED EXAMPLE -> GUIDED PRACTICE
-> CONTROLLED PRACTICE -> INDEPENDENT PRODUCTION
-> TRANSFER -> DELAYED RETENTION
```

Not every competency uses every step identically. Beginner discovery remains guided; pure rule dumping and pure discovery are both rejected.

## Five planning obligations

- Acquisition: learn a necessary new capability.
- Consolidation/review: retrieve and stabilize prior learning.
- Recovery: address a confirmed issue or prerequisite cause.
- Transfer: use learning in a new context or modality.
- Assessment/verification: reduce meaningful uncertainty.

The planner also honors continuity and sustainability. Acquisition cost is an action cost; current capability is learner state—never one substitute metric. An action candidate is an in-memory option, not a persisted task. Only selected actions become plan blocks. `DailyPlan` owns ordering; `NextAction` is the preferred executable projection of that plan.

## Eligibility before scoring

An action is ineligible when prerequisites are unmet without a bridge, content is not ready, required modality is unavailable, privacy/technical constraints fail, assessment integrity is compromised, or workload violates a hard safety/sustainability constraint.

Eligible actions may then be ranked by goal impact, critical-path relevance, evidence need, retention urgency, expected learning value, continuity, learner choice, time/acquisition cost, cognitive/production load, and recent workload. Learner skip, defer, replace, and explore produce explicit override semantics and replanning without falsifying state.

## Completion contract

A kernel run never equates “finished activity” with “learned.” It records what happened and creates the next valid action. If evaluation is asynchronous, the learner receives a provisional continuation that cannot falsely update mastery.
