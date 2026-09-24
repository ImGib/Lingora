# API Contract v1

**Status:** DRAFT / NEXT  
**Warning:** Direction is known; endpoint and payload contracts are not yet frozen.

## Known direction

- Public application boundary is versioned REST served by a NestJS modular monolith.
- Next.js is an API consumer/presentation layer, not the domain authority.
- Commands and queries are explicit; high-authority changes never become generic table CRUD.
- DTO != Domain Entity != Database Row.
- Authentication uses Supabase identity/JWT verification through an identity adapter; authorization remains application/domain-aware.
- Long-running writing/speaking evaluation, archive restore, and heavy recomputation use asynchronous job/status flows.
- Every mutation with retry risk has idempotency and trace/correlation semantics.

## Candidate resource areas

```text
/v1/me/profile
/v1/goals
/v1/curriculum, /competencies, /lessons
/v1/plans, /sessions
/v1/attempts, /responses, /artifacts
/v1/evaluations
/v1/learner-state, /learning-issues
/v1/reviews, /recovery
/v1/roadmaps, /readiness
```

These paths are placeholders, not accepted endpoint names.

## Required command semantics

- Create/activate/replace goal.
- Generate/replan/accept daily plan and start/pause/resume/complete session.
- Start and submit attempt; record support; upload/finalize artifact.
- Request/retry evaluation and retrieve status/feedback.
- Self-correct/rewrite/retry and challenge/report a result/content defect.
- Request test-out, review, recovery, transfer, or alternative next action.
- Export/delete learner data and restore archived artifact.

## Error vocabulary direction

Distinguish validation, unauthenticated, unauthorized, conflict/version mismatch, idempotent replay, prerequisite/eligibility failure, content unavailable/quarantined, assessment-integrity failure, technical artifact failure, evaluation retryable/final failure, rate limit, and asynchronous pending. None should be serialized as a learner failure.

## Next design pass acceptance criteria

The next pass must freeze:

1. aggregate-aligned endpoints and command/query DTOs;
2. auth/ownership rules and RLS interaction;
3. idempotency, concurrency/versioning, and retry behavior;
4. artifact upload/finalize and asynchronous evaluation protocols;
5. pagination/filtering, error envelope, timestamps/enums, and API versioning;
6. learner-safe projections that do not leak answer keys or internal evaluator data;
7. OpenAPI examples and contract tests;
8. event/job boundaries and observability fields.

No controller or client should be implemented from this placeholder alone.
