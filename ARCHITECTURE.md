# Lingora Architecture Guardrails

**Status:** FROZEN  
**Audience:** Developers, reviewers, and coding agents

This file is the short, mandatory contract. Detailed rationale lives under `docs/`.

## Authority map

```text
Next.js       = presentation and user interaction
NestJS        = application workflows + domain authority
Supabase      = PostgreSQL + identity + hot object storage infrastructure
Google Drive  = optional cold/archive/backup adapter
Vercel        = frontend hosting/runtime
```

The browser may read explicitly exposed learner-owned or definition data under RLS. Authoritative commands—attempt submission, evaluation, evidence creation, state recomputation, planning, goal changes, and content publication—go through NestJS.

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
- Domain entities contain behavior and invariants, not transport or persistence annotations.
- Database rows are storage representations, not domain objects.
- API DTOs are versioned boundary contracts.
- The Domain layer must not import SDKs for Supabase, Next.js, Vercel, Google Drive, or an AI provider.
- Infrastructure implements ports owned by the application/domain boundary.
- Learners cannot directly write observations, evidence, competency state, learning issues, or readiness projections.
- Service-role credentials never reach the browser.

## Persistence rules

- Store immutable or append-oriented learner facts; derive intelligence projections.
- Keep definitions, learner facts, learner intelligence, and orchestration conceptually separate.
- Store text writing artifacts in PostgreSQL; store binary audio/assets outside PostgreSQL.
- Preserve exact definition, package, item, evaluator, and policy versions used by an attempt.
- Prefer compact relational cores and bounded JSONB for type-specific payloads.
- Free-tier lifecycle rules are part of the design, not an afterthought.

## Change rule

Changing a frozen invariant requires: a new ADR, affected-document updates, migration/recomputation impact, and a compatibility plan. Silent divergence is not allowed.
