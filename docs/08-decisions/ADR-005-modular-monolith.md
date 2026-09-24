# ADR-005 — Modular Monolith First

**Status:** ACCEPTED

## Context

Lingora has rich domain boundaries but an early-stage workload and a single product team. Microservices would add distributed consistency, deployment, observability, and cost before scaling evidence exists.

## Decision

Build the NestJS backend as a modular monolith. Keep explicit modules, ports, aggregate boundaries, and asynchronous process boundaries inside one deployable application and one primary PostgreSQL database.

Representative modules: Identity/Profile, Goal, Curriculum, Competency, Content, Learning Experience, Evaluation, Learner Intelligence, Review/Recovery, Planning, Storage, and Governance.

## Consequences

- Simpler transactions, development, and deployment.
- Easier enforcement of the end-to-end vertical slice.
- Risk of accidental coupling if modules access each other's tables/models directly.
- Future extraction remains possible only if boundaries and contracts are respected.

## Guardrails

- Modules communicate through application interfaces/events, not cross-module repository access.
- Domain authority and ownership are documented.
- Domain events are distinct from analytics events; full event sourcing is not required.
- External providers are adapters.
- Extract a service only with measured scaling, isolation, security, or organizational need and a migration plan.
