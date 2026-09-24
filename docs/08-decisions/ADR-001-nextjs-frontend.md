# ADR-001 — Next.js Frontend on Vercel

**Status:** ACCEPTED

## Context

Lingora needs a responsive learner web application, server-aware rendering, strong TypeScript integration, and straightforward deployment. Domain authority must remain outside the frontend.

## Decision

Use Next.js with TypeScript for presentation and interaction; Tailwind CSS and shadcn/ui for the component/design foundation; Recharts for accessible data visualization with text alternatives. Deploy the frontend on Vercel. Consume the NestJS REST API.

## Consequences

- Fast product iteration and mature React ecosystem.
- Clear support for server/client rendering choices.
- Vercel-specific deployment convenience without making Vercel part of the domain.
- An additional network boundary to the NestJS API.
- Next.js server features must not become a second, competing domain/application layer.

## Guardrails

- No Supabase service-role or provider secrets in browser bundles.
- No client-written mastery/evidence/state.
- Domain does not import Next.js or Vercel SDKs.
- Shared API types, if generated, remain transport contracts rather than domain entities.
