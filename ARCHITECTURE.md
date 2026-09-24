# Lingora Architecture Guardrails — Consolidation v2

**Status:** Architecture v2 — FROZEN FOR IMPLEMENTATION
**Audience:** Developers, reviewers, and coding agents

This file is the short, mandatory contract. Detailed rationale lives under `docs/`.

## Authority map

```text
Next.js       = presentation and user interaction
Clerk          = external authentication and session identity
NestJS        = application workflows + domain authority
Supabase      = PostgreSQL + hot object storage infrastructure
Google Drive  = optional cold/archive/backup adapter
Vercel        = frontend hosting/runtime
```

The browser may read explicitly exposed learner-owned or definition data under RLS. Authoritative commands—attempt submission, evaluation, evidence creation, state recomputation, planning, goal changes, and content publication—go through NestJS.

Authentication resolves `Clerk JWT.sub -> identity_accounts -> Lingora LearnerId`. Application and Domain code receive the Lingora UUID through `RequestContext`; they do not receive Clerk objects or trust a client-supplied learner ID.

## Learning invariants

```text
Observation != Evidence
Evidence != Mastery
Learning Claim != Competency
Exposure != Practice Opportunity != Evidence Opportunity
Evidence Exists != Evidence Sufficiency
Historical Evidence != Current Confidence
Assessment != Decision
Curriculum != Learner State
Curriculum != Calendar
Knowledge != Performance
Language Capability != IELTS Strategy != IELTS Performance
Weakness != Bottleneck
Unknown != Weak
Skipped != Failed
Feedback != Learning
Correction != Mastery
Technical failure != Learner failure
AI output != Learner production
```

- Correct with high support is weaker evidence than independent success.
- One error must not create a confirmed weakness or downgrade mastery.
- Repetition is not transfer; immediate success is not retention.
- Stale evidence means confidence needs refreshing, not that learning vanished.
- Forgetting and never learned are different hypotheses; neither is inferred from one failure.
- Transfer distance, item-family exposure, session context, and processing conditions change evidential meaning.
- Conflicting evidence remains visible and lowers certainty; it is not averaged away.
- L1-associated risk is a probe-selection hypothesis, never a learner diagnosis.
- Cross-skill and integrated-task evidence may inform several claims but must preserve attribution and confounds.
- Every state, error, interruption, and failure path must offer a valid next action.

## Data and code boundaries

- DTO != Domain Entity != Database Row.
- External identity != Domain identity.
- Domain entities contain behavior and invariants, not transport or persistence annotations.
- Database rows are storage representations, not domain objects.
- API DTOs are versioned boundary contracts.
- The Domain layer must not import SDKs for Clerk, Supabase, Next.js, Vercel, Google Drive, or an AI provider.
- `packages/contracts` may contain versioned DTO-compatible schemas/enums, never Domain aggregates or learner-intelligence internals.
- Infrastructure implements ports owned by the application/domain boundary.
- Learners cannot directly write observations, evidence, competency state, learning issues, or readiness projections.
- Service-role credentials never reach the browser.

## Persistence rules

- Store immutable or append-oriented learner facts; derive intelligence projections.
- Keep definitions, learner facts, learner intelligence, and orchestration conceptually separate.
- Store text writing artifacts in PostgreSQL; store binary audio/assets outside PostgreSQL.
- Preserve exact definition, package, item, evaluator, and policy versions used by an attempt.
- Preserve the lineage `State <- Evidence <- Observation <- Evaluation <- Performance <- Content`; invalidation and supersession propagate by recomputation without deleting history.
- Policy changes create a new projection context. Historical decisions remain reproducible under their original policy; current state may be reprojected explicitly.
- Separate stable content identity from immutable `learning_package_versions` and assessment-item versions.
- Prefer compact relational cores and bounded JSONB for type-specific payloads.
- Free-tier lifecycle rules are part of the design, not an afterthought.

## Content and publishing rules

- Published versions are immutable; revisions create a new draft version.
- Readiness, reference, coverage, asset, assessment, and QA checks gate publication.
- AI-generated core content cannot publish itself. Content provenance and trust tier constrain allowable evidence strength.
- Benchmark items, answers, calibration, and evaluator internals never appear in ordinary learner queries or pre-submit DTOs.
- An in-progress attempt remains pinned to the exact package and assessment-item versions resolved at start.
- Publishing changes curriculum availability, never learner ability.

## Application and UI rules

- REST v1 exposes commands, queries, and learner-safe projections—not generic CRUD over source tables.
- Save and submit are distinct; retryable mutations and evaluation effects are idempotent.
- Grammar Slice 01 evaluates synchronously and deterministically. Later slow evaluation uses the same NestJS codebase with a PostgreSQL-backed job adapter and worker entry point.
- UI renders server-owned decisions through `NextActionDto`; it does not infer learning policy from scores.
- `DailyPlan` owns selected sequencing; `NextAction` is its preferred executable projection, with standardized reason codes and a reproducible `DecisionTrace`.
- Learner skip, defer, replace, and explore are first-class overrides. They change orchestration, never falsify completion, evidence, or ability.
- Learning Mode is soft and encouraging. Exam Mode is restrained and protects assessment conditions.
- Color, motion, charts, completion, streaks, or XP must not imply competence unsupported by evidence.

## Change rule

Changing a frozen invariant requires: a new ADR, affected-document updates, migration/recomputation impact, and a compatibility plan. Silent divergence is not allowed.

Consolidation v2 is recorded in `docs/08-decisions/ADR-007-architecture-consolidation-v2.md`. After Slices 01–03, horizontal architecture expansion stops by default; effort shifts to curriculum quality, content health, and real-learner validation.
