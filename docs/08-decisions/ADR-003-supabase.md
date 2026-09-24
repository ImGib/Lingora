# ADR-003 — Supabase as Initial Infrastructure

**Status:** ACCEPTED

## Context

The MVP is cost-sensitive and needs PostgreSQL, authentication, and object storage. Relational modeling and future portability are required.

## Decision

Use Supabase for PostgreSQL, Auth, and hot object storage. Treat Supabase as infrastructure—not the domain, learning engine, or business-logic owner.

## Consequences

- Fast initial provisioning and integrated identity/storage.
- PostgreSQL preserves relational semantics and migration options.
- Free-tier resource limits require compact persistence and lifecycle controls.
- RLS/grants, Auth migration, and storage migration need explicit design.
- A separate NestJS backend adds operational cost but protects domain authority.

## Mitigation and guardrails

- Repository, IdentityProvider, and ObjectStorage ports.
- Provider-specific identifiers remain in infrastructure mappings.
- RLS for exposed data; derived intelligence is server-writable.
- No service-role credentials in the browser.
- Domain imports no Supabase SDK.
- Avoid unnecessary PostgreSQL schema proliferation in MVP; use `public` physically and modular boundaries in NestJS.
