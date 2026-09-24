# Application, Identity, and Async Architecture v1

**Status:** FROZEN

This document owns the application boundary and execution model. Public transport shapes live in `api-contract-v1.md`; domain meaning remains in `04-domain/`.

## Boundary

```text
Next.js -> REST DTO -> NestJS controller -> application use case
                                         -> domain
                                         -> application-owned ports
                                         -> infrastructure adapters
```

`HTTP != Application`, `Application != Domain`, and `Domain != Persistence`. Controllers map and validate DTOs; use cases coordinate authorization, transactions, domain behavior, repositories, and external ports. No full CQRS framework is required, but operations remain explicit commands, queries, or multi-step processes.

## Monorepo and module direction

```text
lingora/
|- apps/
|  |- web/src/{app,features,components,lib}
|  `- api/src/{modules,domain,application,infrastructure,main.ts}
|- packages/
|  |- contracts
|  |- eslint-config
|  `- typescript-config
`- docs/
```

Use a pnpm workspace. Nx/Turborepo is deferred until measured build orchestration needs justify it. `packages/contracts` is limited to DTO-compatible schemas, enums, and generated transport types. It must not become `packages/domain` or expose Evidence/CompetencyState internals to the frontend.

Slice 01 activates only Identity, Goal, Curriculum, Learning, Intelligence, and Planning modules. Later modules stay inside the same modular monolith until measured isolation or scaling pressure justifies extraction.

## Identity boundary

Clerk owns external authentication. Lingora owns learner identity.

```text
Clerk session/JWT
  -> verify at NestJS boundary
  -> identity_accounts lookup/provisioning
  -> Lingora LearnerId
  -> RequestContext
```

```ts
type RequestContext = {
  learnerId: string;
  requestId: string;
  correlationId?: string;
  timezone: string;
  capabilities: string[];
};
```

Application commands never accept `learnerId` from a request body. First-login provisioning is idempotent and transactional. Details and invariants are in ADR-006.

## Core use-case flow

```text
ResolveLearner -> CreateGoal -> GenerateDailyPlan -> GetDashboard
-> GetLesson -> StartAttempt -> SaveResponse -> RecordSupportUsage
-> SubmitAttempt -> Evaluate -> CreateObservations -> DeriveEvidence
-> RecomputeCompetencyState -> CompletePlanBlock -> DecideNextAction
```

Save and submit are separate operations. Submit uses an `Idempotency-Key`; a replay returns the same logical result and cannot duplicate evaluation, observations, evidence, or state updates.

## Synchronous and asynchronous evaluation

- Slice 01 grammar evaluation is deterministic, synchronous, and committed with the submit workflow.
- Writing, speaking, large recomputations, archive restore, and future heavy planning are async-capable.
- The same NestJS codebase has HTTP and worker entry points; it remains one modular monolith.
- Async work uses an application-owned `JobQueue` port. The initial adapter is PostgreSQL, not Redis/Kafka/RabbitMQ.

The operational `jobs` row holds routing and execution metadata, not a large business payload. Workers load the referenced aggregate and atomically claim available work with a `FOR UPDATE SKIP LOCKED`-style strategy.

```text
PENDING -> PROCESSING -> COMPLETED
                    `-> FAILED_RETRYABLE -> PENDING
                    `-> FAILED_FINAL
PROCESSING stale -> recovered -> PENDING
```

Retries operate on the same logical `EvaluationRun`. A worker crash after writing results cannot create duplicate observations/evidence on retry. Completed operational jobs may be compacted after a retention window; historical truth stays in Attempt, EvaluationRun, Observation, and Evidence.

## Failure and continuation

- Auth, network, storage, provider, and evaluator failures are operational states, never learner failures.
- Retryability is explicit. Invalid definitions, unsupported media, or permanently missing artifacts fail final; timeouts, rate limits, and transient provider/storage errors may retry.
- Async submission returns `202 Accepted` plus `evaluation.status`; the learner also receives a valid `NextActionDto` and does not wait on a blocking spinner.
- User override, skip, pause, and replan do not falsify completion or competency state.

## Application invariants

- `APP-01` Learner identity comes from authenticated context.
- `APP-02` DTO, application command, Domain entity, and database row are distinct.
- `APP-03` Core learning writes use application commands.
- `APP-04` Clients cannot create Evidence or mutate CompetencyState.
- `APP-05` Assessment secrets never enter pre-submit learner payloads.
- `APP-06` Submit and other retryable commands are idempotent.
- `APP-07` Evaluation may be synchronous or asynchronous without changing learning semantics.
- `APP-08` Technical evaluation failure is not learner failure.
- `APP-09` Feedback is not mastery.
- `APP-10` User override cannot falsify learner state.
- `APP-11` Historical attempts retain exact content/evaluator/policy context.
- `APP-12` Domain code depends on neither HTTP nor providers.
- `APP-13` API changes cannot silently redefine learning semantics.
- `APP-14` Job retry cannot duplicate learning evidence.
