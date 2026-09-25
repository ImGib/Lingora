# ADR-009 — Architecture Consolidation v3 and M1

**Status:** ACCEPTED  
**Date:** 2026-09-25

## Decision

Freeze the conceptual learning architecture at Consolidation v3 and make **M1 — 4-Week Learning MVP** the next product milestone. The architecture remains a modular monolith:

```text
Next.js = Presentation
NestJS  = Application + Domain authority
Supabase PostgreSQL/Object Storage = Infrastructure
Clerk   = Authentication infrastructure
```

Domain and application policy remain independent from vendor SDKs. The repository is organized by milestones and vertical proofs rather than a rigid ten-slice feature queue.

## Consolidated model

```text
Language Model
  -> Competency
  -> Learning Claim
  -> Exposure | Practice Opportunity | Evidence Opportunity
  -> Performance Opportunity
  -> Performance
  -> Evaluation
  -> Observation
  -> Evidence + lineage
  -> Learner State (versioned inference)
  -> Decision + DecisionTrace
  -> Learning Episode / Next Action
```

A `PerformanceOpportunity` records the claim, modality, context, difficulty, allowed support, independence expectation, time condition, transfer distance and technical validity. It is the interpretive boundary between “an activity existed” and “the learner had a valid chance to demonstrate something.”

Measurement must be both valid (the task measures the intended construct) and sufficiently reliable for the decision. Evidence is evaluated by coverage, quantity, independence, breadth, recency, retention, transfer, trust and technical validity. High-impact decisions require stronger and broader evidence than low-impact recommendations.

Learner State is never a stored fact about a person. It is a falsifiable, recomputable inference under a named policy and evidence cutoff. Every inference must state what future observation could weaken or overturn it. Conflicting evidence remains visible.

## Decision horizons

- **Immediate:** feedback and the next executable action; may use narrow, recent evidence.
- **Session/day:** sequencing, review and recovery; requires enough evidence to avoid reacting to one item.
- **Episode/week:** progression and capability emphasis; requires coverage across opportunities.
- **Milestone/high impact:** placement, readiness, acceleration or deprioritization; requires independent, varied, retained/transfer evidence and explicit uncertainty.

Every consequential decision retains a compact `DecisionTrace`: policy/evaluator/curriculum/goal versions, evidence cutoff or digest, candidates considered where material, selected action, reason codes, constraints, learner override and degraded-mode state.

## Learning and content decisions

- Curriculum is organized around communicative goals and coherent `LearningEpisode`s, not grammar chapters.
- Verification probes test uncertain claims before diagnosis or high-cost recovery.
- `ItemFamily` and exposure history protect against memorization masquerading as transfer.
- Feedback/support provenance records what was shown, when, by whom/what, and whether it was merely suggested, inserted or independently produced.
- Immediate performance, delayed retention, relearning and transfer are distinct.
- Content has health states and can be quarantined. Invalid content triggers evidence review/invalidation and state reprojection; history is retained.
- Curriculum, content, evaluator and decision policies are independently versioned.
- Learners may skip, defer, replace or explore. Agency changes orchestration, not historical evidence or ability.

## Cross-cutting requirements

Governance owns policy approval, auditability, content incident handling and reprojection. Privacy uses data minimization, explicit retention/deletion rules and restricted artifact access. Security requires server-owned commands, learner isolation, no browser service credentials and idempotent mutations. Accessibility and a usable degraded mode are release gates, not later polish. Technical failure produces no negative learner evidence.

## Scope discipline

- **NOW:** concepts required to deliver and verify M0/M1.
- **PROTECT:** invariants and extension seams that must not be designed away, but need not be materialized as tables/services.
- **LATER:** systems requiring evidence of need, calibration or operational scale.

This supersedes roadmap implications in ADR-007 without discarding its accepted boundaries. ADR-008 remains valid.
