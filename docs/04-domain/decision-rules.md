# Decision Rules

**Status:** FROZEN

## Planner pipeline

1. Eligibility filter: prerequisites/bridge, content readiness, modality/device, privacy, assessment integrity, time, and hard constraints.
2. Obligation classification: acquisition, consolidation, recovery, transfer, or assessment/verification.
3. Learning value: goal impact, critical-path importance, uncertainty reduction, retention urgency, expected transfer, and continuity.
4. Cost/risk: minutes, cognitive load, production fatigue, novelty, setup cost, and recent workload.
5. Balance guard: protect productive/receptive, language/exam, and skill balance.
6. Sustainability veto: prevent overload, excessive novelty, repeated failure, or unsafe cadence.
7. Continuity validator: ensure prerequisites, follow-ups, recovery, and valid next action.
8. Explainability trace: record decisive facts, goal/target and curriculum versions, policy version, hard constraints/vetoes, selected action, standardized reason codes, and learner override.

DailyPlan owns selected sequence. NextAction is the preferred executable projection for the current moment; it cannot silently create a competing plan.

Standard reason codes start with: `GOAL_CRITICAL_PATH`, `PREREQUISITE_BRIDGE`, `ACQUISITION_NEEDED`, `EVIDENCE_INSUFFICIENT`, `RETENTION_DUE`, `TRANSFER_NEEDED`, `RECOVERY_CONFIRMED`, `CONTINUE_IN_PROGRESS`, `LEARNER_OVERRIDE`, `MODALITY_UNAVAILABLE`, `CONTENT_UNAVAILABLE`, `SUSTAINABILITY_LIMIT`, and `SAFE_STOP`. Human text may vary by locale; code semantics are versioned.

## Hard constraints and vetoes

- Unready/quarantined content is ineligible.
- Content trust tier constrains whether an opportunity may contribute ordinary, strong, or benchmark evidence.
- Compromised benchmark/item exposure blocks strong assessment claims.
- Technical unavailability selects recovery/alternative; it never penalizes state.
- Sustainability and privacy may veto a high-scoring action.
- The system cannot silently lower the target or raise workload without bound.

## Promotion

- Recognition alone cannot promote productive competency.
- Supported correctness has lower independence.
- Productive promotion needs independent whole-task evidence.
- Mastery-level claims require adequate novelty, delayed retention, and transfer for the competency type.
- Strategy promotion requires applicable underlying language competence.
- Conflicted or insufficient evidence favors verification, not forced classification.
- Readiness promotion requires minimum claim/skill coverage and cannot be satisfied by optimizing one score, repeating one ItemFamily, or accumulating activity/XP.

## Diagnostic decisions

- First error -> observation, possibly suspected issue.
- Repeated attributable pattern across opportunities -> confirmed issue.
- Confirmed issue + below-target state -> weakness projection.
- Weakness + goal relevance + critical-path impact -> bottleneck.
- Minimal discriminating probes are preferred over broad retesting.
- Native-language-associated risk may prioritize a probe but cannot confirm an issue. External learning is a lead with provenance/trust and normally requires verification before strong promotion.

## Learner override and intervention learning

- `SKIP`: omit this instance without recording failure.
- `DEFER`: retain need and reschedule with an optional time/reason.
- `REPLACE`: choose an eligible alternative satisfying the same obligation where possible.
- `EXPLORE`: learner-selected work may sit outside the plan and does not silently displace protected obligations.

Intervention effectiveness is evaluated against its intended claim, baseline, delivered exposure/support, cost, follow-up window, and comparable outcome. It informs the System Learning Loop and future policy versions; it does not retroactively rewrite the learner's history.

## Feedback priority

Prioritize the lesson target, high-impact/comprehensibility issues, transferable patterns, and issues the learner can act on now. Preserve positive evidence. Ask for self-correction before revealing complete corrections when appropriate. Limit feedback volume.

## Deadline compression

Compress breadth, optional content, and repetition before protected foundations. Use forecast ranges based on actual learning velocity. Increase benchmark/task exposure progressively, but do not replace language learning with exam tactics.

## Replanning triggers

Goal/deadline change, sustained velocity difference, meaningful new evidence, confirmed bottleneck, elevated learning debt, long absence, fatigue pattern, content invalidation, curriculum/policy version change, or unavailable modality. Routine small fluctuations should not cause thrashing; apply rate limits and hysteresis.
