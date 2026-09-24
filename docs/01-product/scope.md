# Scope

**Status:** BASELINE

## In scope for the designed product

- Adult beginner/returning learner diagnostic and profile.
- S0–S6 curriculum architecture, with validated S0 and S1 contracts.
- Grammar, vocabulary, pronunciation, listening, reading, writing, speaking, academic, IELTS, and study-abroad tracks.
- Evidence-aware practice, assessment, review, recovery, transfer, and retention.
- Adaptive roadmap, daily planning, sessions, managed breaks, resume, and return after absence.
- Writing and speaking artifact versioning and evaluator traceability.
- Learner-facing explanations of recommendations and uncertainty.
- Clerk authentication plus PostgreSQL/hot storage on Supabase, with cloud-portable identity, persistence, storage, job, and evaluation boundaries.

## Current delivery scope

- Implement the defined Present Simple Slice 01 only after this documentation checkpoint is accepted.
- Prove the complete learner loop before adding broad subsystems: identity, goal, plan, lesson, attempt, deterministic evaluation, observation, evidence, competency state, and updated next action.
- Preserve the Soft Study Companion baseline on goal, dashboard, lesson, and feedback surfaces.

## Out of scope for Consolidation v1

- Application code, generated types, executable SQL migrations, deployment scripts, and provider configuration in this documentation pass.
- Final numeric mastery formulas or universal thresholds.
- Medical/psychological claims, human examiner replacement, or guaranteed IELTS bands.
- Social network, classroom/LMS administration, and marketplace features.
- Unbounded generative content published without provenance and QA.

## MVP boundary

The first implementation slice proves: Clerk sign in -> Lingora learner provisioning -> goal -> dashboard/daily plan -> Present Simple third-person singular lesson -> attempt/response/support -> deterministic evaluation -> observation -> evidence -> competency-state projection -> explainable next action. Broader skills are added only after this chain is correct.
