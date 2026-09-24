# ADR-006 — Clerk Authentication, Lingora Domain Identity

**Status:** ACCEPTED

## Context

Authentication-provider identity must not become the permanent key for learning history. Lingora needs convenient sign-in while preserving provider portability, server-owned authorization, and a stable learner identity across attempts, evidence, competency state, and plans.

## Decision

Use Clerk for sign-up, sign-in, session management, and external JWT identity. Resolve the authenticated Clerk `sub` through `identity_accounts` to a Lingora-owned UUID `LearnerId`.

```text
Clerk JWT.sub
  -> identity_accounts(provider = CLERK, provider_user_id)
  -> learners.id (UUID)
  -> RequestContext.learnerId
```

`learners` is the durable domain identity root. `profiles` contains learner-facing profile data. Provider identity, email, and provider metadata are not learner foreign keys and are not copied broadly into learning tables.

## Provisioning and authorization

- First authenticated access performs idempotent learner/account/profile provisioning in one transaction.
- Uniqueness is enforced on `(provider, provider_user_id)`; retries return the same learner.
- Application commands take identity from authenticated `RequestContext`, never request bodies.
- Role/capability checks for authoring and publishing are server-controlled.
- Clerk webhooks may synchronize bounded account lifecycle facts, but webhooks do not create learning evidence or own the learner aggregate.
- Account deletion is orchestrated; it must not accidentally cascade-delete learning history before policy, export, retention, and privacy rules are applied.

## Supabase and RLS

Core learning access follows `Next.js -> NestJS -> PostgreSQL`. If an explicitly approved browser-to-Supabase path is needed, such as signed storage upload, RLS may map `auth.jwt()->>'sub'` through `identity_accounts` to the Lingora learner UUID. RLS is defense in depth, not domain authorization.

## Consequences

- Replacing Clerk does not require rewriting learner foreign keys or historical evidence.
- NestJS needs a Clerk verification adapter and identity repository.
- Direct Supabase access requires tested claim mapping and narrow policies.
- Authentication or session failure is operational failure and can never become learner-performance evidence.

## Invariants

- `AUTH-01` External identity is not Domain identity.
- `AUTH-02` Domain code does not depend on Clerk SDKs.
- `AUTH-03` `LearnerId` is owned by Lingora.
- `AUTH-04` Provider identity maps at the infrastructure/application boundary.
- `AUTH-05` Provider replacement preserves learning history.
- `AUTH-06` Authentication/infrastructure failure is not learner failure.
- `AUTH-07` Authorization uses authenticated context, not a client learner ID.
- `AUTH-08` Account deletion cannot accidentally cascade learning history.
