# Learning Architecture v1

**Status:** FROZEN

## Architecture

```text
Goal + learner context
        |
Curriculum + competency graph
        |
Planner -> Session -> Attempt -> Response/Artifact
                                  |
                         Evaluation/Observation
                                  |
                               Evidence
                                  |
                    Learner-state projections
                                  |
             Review / Recovery / Transfer / Next action
```

The architecture is a set of cooperating engines, not one “AI tutor”:

- Curriculum Engine: definitions, prerequisites, coverage, criticality, and content readiness.
- Session Engine: time budget, blocks, breaks, pause/resume, fatigue, and continuity.
- Assessment/Evaluation Engine: operational scoring and observation extraction with confidence and provenance.
- Evidence Engine: converts eligible observations into competency-specific evidence.
- Learner Model: current, uncertain, recomputable state by competency and modality.
- Review Engine: retrieval, spacing, retention verification, and learning-debt control.
- Recovery Engine: root-cause probes, alternative explanation, targeted practice, retest, and later verification.
- Planning Engine: selects an explainable next action set under learning, balance, deadline, and sustainability constraints.

## Learner learning patterns

1. Knowledge acquisition: context -> notice -> compare -> guided rule formation -> worked example -> faded example -> retrieval.
2. Skill acquisition: part practice -> supported whole task -> independent performance -> feedback -> retry.
3. Performance and transfer: novel task -> realistic constraints -> delayed verification -> calibration/benchmark.

These patterns interact but do not substitute for each other. Knowing a rule does not prove spontaneous performance; one good performance does not prove durable knowledge. The enclosing Learner Learning Loop and the separate System Learning Loop are canonical in `learning-kernel-v1.md`.

## Capability and readiness boundaries

```text
Language Capability != IELTS Strategy != IELTS Performance
```

Exam strategies depend on language capability; timed IELTS performance additionally depends on task familiarity, pacing, conditions, and calibrated benchmark evidence. Study Abroad competencies—lecture/seminar participation, clarification, note-taking, academic integrity, practical interaction, and help-seeking—are first-class outcomes, not an IELTS afterthought.

Integrated tasks may produce cross-skill observations and evidence, but mappings preserve which claim each source supports, attribution confidence, prerequisites, and confounding load. Readiness requires policy-defined minimum coverage, modality, recency, independence, difficulty, retention/transfer, and benchmark evidence. No average, streak, activity count, or single mock score may dominate the decision; metric-gaming safeguards cap repeated/familiar-item contribution and monitor suspicious optimization.

## Progression

```text
S0 Diagnostic
S1 English Foundation
S2 Core English
S3 Academic English Foundation
S4 Pre-IELTS
S5 IELTS Academic Skills
S6 IELTS Performance
```

Stages orient the roadmap; they are not hard locks. A learner can test out, bridge gaps, revisit prerequisites, and work across adjacent stages. Protected foundations cannot be discarded solely because a deadline is near.

## Daily learning contract

- The learner states the available time and may state energy/environment constraints.
- A plan contains learning, review, assessment, recovery, transfer, and break blocks.
- Templates for 30/60/90/120/180-minute sessions guide composition but are not hard-coded programs.
- The planner preserves productive/receptive balance and prevents overdue review from consuming every session.
- A missed day creates replanning, not punishment; a long absence begins with a light re-entry and state refresh.
- No session must end at a dead end: resume, alternate modality, prerequisite recovery, lighter task, or safe stop is always available.

## Integrity

Definitions, performance, evaluation, observations, evidence, inference, state, and decisions are separate layers. Evaluator disagreement, stale evidence, suspected content defects, support contamination, and technical failures remain explicit. External learning enters only with source/provenance, verification status, context, and calibrated trust. Policies and evaluators are versioned so state can be recomputed.
