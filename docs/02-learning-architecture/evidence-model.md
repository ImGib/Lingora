# Evidence Model

**Status:** FROZEN

## Chain

```text
Attempt/Response/Artifact
  -> Performance (with session/context/support)
  -> EvaluationRun
  -> Observation
  -> EvidenceOpportunity
  -> Evidence
  -> CompetencyState projection
  -> Decision
```

## Observation

An observation stays close to what happened: answer chosen, form produced, pause pattern, self-correction, missing sound, rubric signal, or technical condition. It identifies its source, evaluator/version, target, raw value, confidence, time, and validity. It must not assert “the learner is weak.”

## Evidence opportunity

Before interpreting success/failure, the system asks whether the task actually offered an attributable opportunity to demonstrate the competency. Opportunity includes modality, salience, task demands, confounding load, prompt/support, and attribution confidence.

Three events remain distinct:

- **Exposure:** the learner encountered a concept/model.
- **Practice Opportunity:** the learner could rehearse or apply it.
- **Evidence Opportunity:** the performance can legitimately support a specified LearningClaim.

An exposure or supported practice can help learning while providing no valid evidence opportunity.

## Evidence

Evidence is a versioned interpretation for one competency and modality. It carries:

- direction: positive, negative, or neutral;
- strength and confidence;
- independence and support context;
- novelty and item-family relationship;
- authored difficulty, empirical difficulty (when enough data exists), and processing load;
- transfer distance and retention distance;
- session/performance context, timing, pre-feedback confidence, and speed/accuracy interpretation;
- trust tier and source/evaluator provenance;
- active, quarantined, revoked, or superseded status.

Evidence and observations are many-to-many. One observation may inform several competencies; one evidence claim may need several observations.

`ItemFamily` groups variants sharing the same generative template, construct, or memorization risk. Repeated exposure to a family reduces novelty and can cap evidence strength even when the exact item text differs. Transfer distance is explicit (same-item/family, near context, varied context/modality, far/generalized) rather than a generic novelty flag.

## Sufficiency and conflict

Evidence existence is not evidence sufficiency. Sufficiency is not item count: it considers claim/opportunity coverage, diversity across ItemFamilies/contexts, independence, trust, recency, modality, difficulty, retention/transfer distance, and consistency. Historical evidence remains true history but current confidence may decay as verification becomes stale. Conflicting evidence is retained and marked; it may indicate context dependence, unstable performance, evaluator disagreement, or a genuine state transition.

Forgetting and never learned are different hypotheses. A failed delayed retrieval can lower current confidence or suggest decay, but classification needs prior acquisition evidence, time distance, comparable conditions, and discriminating follow-up. Absence of prior evidence remains unknown.

## Support and authorship

Hints, replay, transcript, translation, dictionary, models, AI suggestions, preparation, and repeated exposure lower or change independence. AI-inserted/copy-derived artifact spans cannot support independent learner-production evidence.

## Revocation and recomputation

Content defects, leaked/memorized item families, faulty answer keys, evaluator defects, or corrupted artifacts can quarantine/revoke affected evidence. Evaluator runs retain identity/version; disagreement is represented rather than silently averaged. Later adjudication may invalidate or supersede an evaluation/observation/evidence link while preserving both the original and replacement lineage.

Canonical lineage is `State <- Evidence <- Observation <- Evaluation <- Performance <- Content`. A policy change may reproject current state using eligible historical facts, but historical decisions retain the policy/version and inputs used at the time.

## Minimal extensible Evidence v0

Slice 01 Evidence v0 requires source observation/content version, learner, competency + claim/modality, direction, bounded strength/confidence, independence/support, opportunity/ItemFamily context, occurred time, validity status, and policy version. Transfer distance, retention distance, empirical difficulty, evaluator disagreement, and richer context are optional structured extension fields until a slice proves dedicated persistence/query needs.

## Prohibited shortcuts

- `is_correct` is not mastery.
- one assessment score is not a decision.
- an average does not resolve semantic conflict.
- replay-assisted listening is not first-pass listening.
- transcript analysis cannot establish pronunciation.
- correction after full answer reveal is not independent learning evidence.
