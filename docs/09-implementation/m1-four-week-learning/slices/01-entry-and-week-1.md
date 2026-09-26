# M1 Slice 01 — Entry and Week 1: Me & My English

**Status:** READY FOR IMPLEMENTATION
**Outcome:** a beginner can start safely, learn across several resumable days, understand a simple unseen introduction and produce a short original self-introduction.

## Vertical learner flow

```text
optional Starting Point Check
-> recommended start or Day 1
-> plan for available time
-> introduction input and personal vocabulary
-> be/pronoun/question practice
-> name spelling and word stress
-> short reading/listening
-> original 3–5 sentence writing + 20–30s recording
-> novel transfer check
-> delayed verification / next episode
```

The Starting Point Check may be skipped. A learner may pause, resume, shorten the day, catch up or rest without being marked failed.

## NOW

- Week 1 reviewed content and explicit claims for personal-information comprehension/production.
- Exposure, guided practice and evidence opportunities with distinct ItemFamilies.
- First-pass listening/read-detail capture; replay/support provenance.
- Small text and audio learner artifacts; audio playback and structured self-check are sufficient for v0.
- Minimal review scheduling, a delayed probe, verification-before-recovery and planner reason codes.
- Content health/report/quarantine path sufficient to stop selection and flag affected evidence.
- Privacy/retention notice for recordings, authenticated ownership and deletion behavior.
- Keyboard/focus/labels/contrast, transcript where appropriate, microphone-denied and upload-failure alternatives.

## PROTECT

- Immutable artifact versions and contribution provenance.
- PerformanceOpportunity and complete lineage to content/evaluator/policy versions.
- Separate reading/listening/writing/speaking claims and uncertainty.
- Idempotent artifact upload/submission and evaluation effects.
- Reprojection after content/evaluator invalidation.

## LATER

- phoneme-level automated pronunciation scoring;
- generative writing correction or fluency scoring;
- general adaptive placement, universal SRS or a generic workflow engine;
- CEFR/IELTS mapping.

## Claim set v1

- understand selected explicit personal details in a short beginner profile;
- understand selected explicit details in a short spoken introduction under stated replay/support conditions;
- use `be` and subject pronouns to communicate basic personal facts in familiar conditions;
- ask/answer a small set of personal-information questions;
- independently write 3–5 comprehensible original sentences;
- independently record a 20–30 second self-introduction with basic comprehensibility.

Exact wording, conditions and evidence requirements must be versioned before content publication. Do not infer one broad “personal information mastery” state from a single integrated response.

## Persistence and API direction

Reuse M0 learner, session, attempt, response, support, observation, evidence, state and plan foundations. Add only persistence proven necessary for review due-times and learner artifact/version ownership. Binary audio belongs in Supabase Storage behind a NestJS-owned port; text may remain PostgreSQL. Do not expose storage credentials or allow clients to create evidence/state.

Commands that can be retried—starting/resuming a check, artifact finalization, submit and evaluation—must be idempotent. Technical failures retain work where possible and never emit negative evidence.

## Exit gates

- A new learner can skip or complete the Starting Point Check and sees honest unknown/known coverage.
- A learner can complete or resume Days 1–7 using a minimum viable day and a normal session.
- Support use changes evidence meaning; exact/repeated items do not count as transfer.
- An unseen profile/introduction and original writing/audio artifacts produce separate, traceable observations/evidence.
- A delayed probe can become due and update current confidence without rewriting history.
- A suspected difficulty is verified before targeted recovery; one error never creates a confirmed weakness.
- Cross-learner access, unauthenticated writes, duplicate effects and content-answer leakage fail security tests.
- Broken audio/microphone/upload paths offer retry or an alternative and produce no learner failure.
- Week 1 content, accessibility, privacy, health/quarantine and real-beginner usability gates pass.

Passing this slice proves Week 1, not the 28-day M1 outcome. Week 2 should open only after the slice report identifies actual coverage and usability gaps.
