# Implementation — Milestones and Vertical Proofs

**Status:** Consolidation v3 baseline; implementation status audited 2026-09-25

This area answers four separate questions: what exists in code, what has automated proof, what has been verified in a live environment, and what is release-ready. A feature is not `DONE` merely because a table or endpoint exists.

## Current milestones

| Milestone | Purpose | Status |
|---|---|---|
| M0 — Learning Kernel | Prove one trustworthy end-to-end learning loop | **PARTIAL**; 01A–01E done, 01F partial |
| M1 — 4-Week Learning MVP | A beginner can learn meaningfully for 28 continuous days | **DESIGNED / NOT STARTED** |
| Later maturity | Multi-skill depth, calibration, IELTS and academic readiness | **LATER** |

Read [M0 overview](m0-kernel/overview.md), the [Slice 01 audit](m0-kernel/slice-01/README.md), and [M1 overview](m1-four-week-learning/overview.md). Cross-milestone views live under [roadmap](roadmap/learner-journey.md).

## Status vocabulary

- `DONE`: implementation exists and the checkpoint's required proof is present.
- `PARTIAL`: useful implementation exists, but at least one required gate lacks evidence.
- `NOT STARTED`: no material implementation proof exists.
- `DESIGNED`: documentation exists; this never implies implementation.

## Delivery rule

Work milestone-first: learner outcome → vertical slice → evidence → release gates. Do not revive the old assumption that ten horizontal slices should be built in order. Use `NOW / PROTECT / LATER` in every implementation brief and add slice files only when work is ready to begin.

Release readiness requires: `TECH + CONTENT + PEDAGOGY + DATA + SECURITY/PRIVACY + ACCESSIBILITY + OPERATIONS + REAL-LEARNER` gates appropriate to risk.
