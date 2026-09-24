# Evidence Model

**Status:** FROZEN

## Chain

```text
Attempt/Response/Artifact
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

## Evidence

Evidence is a versioned interpretation for one competency and modality. It carries:

- direction: positive, negative, or neutral;
- strength and confidence;
- independence and support context;
- novelty and item-family relationship;
- difficulty and processing load;
- transfer distance and retention distance;
- trust tier and source/evaluator provenance;
- active, quarantined, revoked, or superseded status.

Evidence and observations are many-to-many. One observation may inform several competencies; one evidence claim may need several observations.

## Sufficiency and conflict

Evidence sufficiency is not item count. It considers opportunity coverage, diversity, independence, trust, recency, modality, difficulty, and consistency. Conflicting evidence is retained and marked; it may indicate context dependence, unstable performance, evaluator disagreement, or a genuine state transition.

## Support and authorship

Hints, replay, transcript, translation, dictionary, models, AI suggestions, preparation, and repeated exposure lower or change independence. AI-inserted/copy-derived artifact spans cannot support independent learner-production evidence.

## Revocation and recomputation

Content defects, leaked items, faulty answer keys, evaluator defects, or corrupted artifacts can quarantine/revoke affected evidence. Historical facts remain; learner state is recomputed under the relevant policy version.

## Prohibited shortcuts

- `is_correct` is not mastery.
- one assessment score is not a decision.
- an average does not resolve semantic conflict.
- replay-assisted listening is not first-pass listening.
- transcript analysis cannot establish pronunciation.
- correction after full answer reveal is not independent learning evidence.
