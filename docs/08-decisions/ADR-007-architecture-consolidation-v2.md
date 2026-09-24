# ADR-007 — Architecture Gap Audit and Consolidation v2

**Status:** ACCEPTED  
**Date:** 2026-09-24  
**Supersedes:** no frozen invariant; refines Baseline v1 where this ADR and updated canonical documents are more specific

## Context

Baseline v1 separated content, performance, observation, evidence, state, and decision, but several inference, governance, and delivery semantics remained implicit. Implementing them as dozens of speculative tables would harden untested assumptions; leaving them implicit would make decisions irreproducible.

## Decision

The Learning Kernel has four conceptual planes:

1. **Definition:** versioned curriculum, competencies, learning claims, content/item families, evidence requirements, policies, goals, targets, and locales.
2. **Learning:** exposure, practice and evidence opportunities, performance/context/support, evaluation, observations, evidence, feedback, retention, transfer, and learner state.
3. **Decision:** readiness/gaps, candidate eligibility, DailyPlan sequencing, preferred NextAction, learner override, and DecisionTrace.
4. **Governance/System Learning:** content health, evaluator agreement, invalidation/supersession, policy reprojection, release readiness, cost/degraded modes, privacy/retention, and intervention-effectiveness learning.

Two loops are explicit and separate:

- **Learner Learning Loop:** instruction/practice/performance -> feedback/retry -> evidence/state -> next learning action.
- **System Learning Loop:** outcomes and operational signals -> content/evaluator/policy/intervention review -> governed version change -> monitored release. System learning may improve definitions and policies but never rewrites historical learner facts.

The inference lineage is `State <- Evidence <- Observation <- Evaluation <- Performance <- Content`. `LearningClaim != Competency`; `Exposure != PracticeOpportunity != EvidenceOpportunity`; `Evidence exists != Evidence is sufficient`; and historical evidence does not by itself establish current confidence.

Most additions begin as semantic contracts, versioned policy/configuration, DTOs, or derived projections. A physical table is introduced only when a slice proves transactional identity, query, audit, lifecycle, or performance needs. In particular, no table-per-concept is authorized by this ADR.

## Refined decisions

- Evidence models decay of confidence and retention verification, not deletion of learning. Policies distinguish forgetting, context/performance failure, and never-learned hypotheses.
- Transfer distance, exposure/memorization risk, ItemFamily relationship, session/performance context, cross-skill attribution, integrated-task confounds, pre-feedback confidence, and speed/accuracy context affect interpretation.
- Authored difficulty and empirically observed difficulty are separate. Content Health governs defects, leakage, drift, performance, and quarantine.
- Evaluator disagreement is explicit; invalidation, quarantine, revocation, and supersession retain lineage and trigger bounded reprojection.
- Curriculum, competency, content, evaluator, evidence, decision, goal/target, and feature-release versions have explicit effective semantics. Historical decisions retain their original inputs/policies; current projections may be recomputed under a declared policy.
- DailyPlan owns planned sequencing. NextAction is the preferred executable projection, not a second plan. Decisions use standardized reason codes and a concise DecisionTrace.
- Learners may skip, defer, replace, or explore. Overrides affect plans and intervention evidence, not learner capability facts.
- Language capability, IELTS strategy, and IELTS performance remain separate. Study Abroad competencies and integrated tasks are first-class; readiness requires minimum evidence/coverage and cannot be optimized from a single metric.
- External learning can be recorded with provenance and calibrated trust. L1 risk selects probes; it is not diagnosis.
- AI/ASR/TTS providers sit behind ports with budgets, quality/cost telemetry, fallbacks, and degraded modes. Unavailable automation must not create learner failure or dead ends.
- Privacy classification, purpose, retention, deletion, and provider disclosure are defined by data class. Time uses UTC instants, IANA timezones, explicit local-date semantics, and clock injection.
- `uiLocale`, `instructionLanguage`, `nativeLanguage`, `targetLanguage`, and `contentLocale` are separate concepts.

## Delivery consequence

Slice 01 is split into checkpoints 1A–1F. Competencies are created only when stable, assessable, reusable, and decision-relevant. PracticeItem versus AssessmentItem is decided before migration. `CompetencyState` persists only when it is semantic, explainable, recomputable, and decision-useful. Evidence v0 stays minimal but extensible. Dashboard and goal onboarding remain deliberately small.

After Slices 01–03, horizontal architecture expansion stops unless real usage exposes a blocking need. The default investment moves to curriculum, content quality/health, and real-learner testing.

## Compatibility

Existing frozen invariants and the Soft Study Companion visual direction remain in force. Where Baseline v1 used a broader or ambiguous phrase, the updated canonical document and this ADR provide the v2 interpretation.
