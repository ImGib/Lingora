# Lingora Architecture Guardrails

**Status:** FROZEN  
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
Assessment != Decision
Curriculum != Learner State
Knowledge != Performance
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
- Conflicting evidence remains visible and lowers certainty; it is not averaged away.
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
- Learning Mode is soft and encouraging. Exam Mode is restrained and protects assessment conditions.
- Color, motion, charts, completion, streaks, or XP must not imply competence unsupported by evidence.

## Change rule

Changing a frozen invariant requires: a new ADR, affected-document updates, migration/recomputation impact, and a compatibility plan. Silent divergence is not allowed.
