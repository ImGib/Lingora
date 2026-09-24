# ADR-003 — Supabase as Initial Data Infrastructure

**Status:** ACCEPTED; authentication portion superseded by ADR-006

## Context

The MVP is cost-sensitive and needs PostgreSQL and object storage. Relational modeling and future portability are required. Authentication is decided separately in ADR-006.

## Decision

Use Supabase for PostgreSQL and hot object storage. Treat Supabase as infrastructure—not the identity authority, domain, learning engine, or business-logic owner. Clerk is the primary authentication provider; Supabase third-party auth may be used only for explicitly approved direct storage/data paths.

## Consequences

- Fast initial provisioning for relational data and storage.
- PostgreSQL preserves relational semantics and migration options.
- Free-tier resource limits require compact persistence and lifecycle controls.
- RLS/grants, external identity mapping, and storage migration need explicit design.
- A separate NestJS backend adds operational cost but protects domain authority.

## Mitigation and guardrails

- Repository and ObjectStorage ports; identity provider integration is isolated by ADR-006.
- Provider-specific identifiers remain in infrastructure mappings.
- RLS for exposed data; derived intelligence is server-writable.
- No service-role credentials in the browser.
- Domain imports no Supabase SDK.
- Avoid unnecessary PostgreSQL schema proliferation in MVP; use `public` physically and modular boundaries in NestJS.
