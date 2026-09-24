# ADR-002 — NestJS REST Backend

**Status:** ACCEPTED

## Context

The product requires authoritative workflows for attempts, evaluation, evidence, state, plans, goals, privacy, and provider coordination. Direct browser-to-database CRUD cannot protect these invariants.

## Decision

Use NestJS with TypeScript as the REST application backend. It owns application use cases, transaction coordination, authorization, domain model execution, asynchronous evaluation orchestration, and infrastructure ports.

## Consequences

- Strong separation between presentation and learning authority.
- One language across frontend/backend while preserving bounded models.
- Explicit API and operational deployment are required.
- Some safe data could be read via Supabase directly, but v1 favors a coherent NestJS application contract unless an explicitly reviewed read path is justified.

## Guardrails

- Controllers map DTOs and invoke use cases; they do not contain domain policy.
- Modules align with domain responsibilities, not database table CRUD.
- Infrastructure adapters implement ports for persistence, Clerk identity verification/mapping, storage, AI/evaluation, jobs, and time.
- The Application and Domain layers receive a Lingora `LearnerId`, never a Clerk user object or client-supplied learner ID.
- Service-role use is narrow and server-only.
- Domain remains free of NestJS decorators where they would couple the model to the framework.
