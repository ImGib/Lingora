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
- PostgreSQL/Auth/hot storage on Supabase with cloud-portable application boundaries.

## Next design scope

- REST API command/query contracts, idempotency, error vocabulary, asynchronous evaluation, and versioning.
- UI information architecture, accessibility flows, responsive behavior, charts, and interaction states.

## Out of scope for Consolidation v1

- Application code, generated types, SQL migrations, seed data, deployment scripts, and provider configuration.
- Final numeric mastery formulas or universal thresholds.
- Medical/psychological claims, human examiner replacement, or guaranteed IELTS bands.
- Social network, classroom/LMS administration, and marketplace features.
- Unbounded generative content published without provenance and QA.

## MVP boundary

The first implementation slice proves: sign in -> profile -> goal -> curriculum/competency -> one lesson/activity -> attempt/response/support -> observation -> evidence -> competency-state projection -> explainable next daily action. Broader skills are added only after this chain is correct.
