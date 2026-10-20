# Day 1 content draft — Meet a Simple Introduction

**State:** DRAFT, version 1. Migration `20261020154721_m1_week1_day1_draft_content.sql` stores this lesson and package without publishing either. It cannot be returned by the learner lesson API.

## Intended learner experience

The learner reads Linh's four-sentence introduction, notices how name, place and role are expressed, then reads a second two-detail example about An. This is exposure. It produces no score, observation, competency evidence or weakness label. The short text can fit a minimum viable day, while a longer session can continue into guided practice once Day 2 exists.

## Claim and scope

The lesson targets understanding explicitly stated name, place and role in a short written beginner introduction (`M1.PERSONAL.READ_DETAILS`). Day 1 does not claim independent comprehension. The package has no answerable items; it must not be passed to the existing attempt engine, which requires at least one item.

## Publication blockers

- Add a recorded beginner introduction with checked audio quality and an aligned transcript. A synthetic or missing audio asset cannot silently count as listening evidence.
- Add the Day 2 guided practice and a later independent reading opportunity in a distinct ItemFamily before declaring the Week 1 reading claim covered.
- Check language, names, text alternatives, keyboard flow and screen-reader reading order with a reviewer.
- Connect exposure completion to the M1 planner so the correct episode resumes without marking a missed day as failure.
- Run the content QA/readiness and real-beginner checks before changing the lesson and package from `DRAFT` to learner-exposable status.

The Day 1 draft is an authoring checkpoint. It does not close any Week 1 release gate.

## Exposure progress foundation

An authenticated learner can read and complete a published, item-free lesson through `GET /v1/lessons/:lessonId/exposure` and `POST /v1/lessons/:lessonId/exposure/complete`. Completion is idempotent for a learner and exact package version. It creates a `lesson_exposures` row only; no attempt, observation, evidence or competency state is inferred. The Day 1 draft remains unavailable to these endpoints until its publication gates pass.
