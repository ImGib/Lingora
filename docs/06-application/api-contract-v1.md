# API DTO Contract v1

**Status:** VALIDATED  
**Stability:** Structure and semantics are accepted; exact field names may be refined during implementation without changing the invariants below.

The public application boundary is versioned REST from the NestJS modular monolith. DTOs are learner-safe transport contracts, not Domain entities or database rows.

## Common contract

Success:

```json
{ "data": {}, "meta": { "requestId": "req_xxx" } }
```

Collection:

```json
{ "data": [], "meta": { "nextCursor": null, "requestId": "req_xxx" } }
```

Failure:

```json
{
  "error": {
    "code": "ATTEMPT_ALREADY_SUBMITTED",
    "message": "This attempt has already been submitted.",
    "retryable": false,
    "requestId": "req_xxx"
  }
}
```

IDs are opaque. Instants use ISO 8601 UTC; learner calendar dates use `YYYY-MM-DD` plus the applicable IANA timezone. Timezone changes do not silently relocate historical plan/session dates. Historical collections use cursor pagination. Retryable commands carry `Idempotency-Key`.

## Identity and onboarding

`GET /v1/me` returns Lingora learner/profile identity and resumable onboarding state. It never returns Clerk identifiers or Supabase internals.

Slice 01A returns the minimal implemented profile subset: `displayName`, `nativeLanguage`, and `timezone`. The richer locale/language fields shown below remain the forward v1 contract and are added only with the slice that consumes them.

```json
{
  "data": {
    "id": "learner_uuid",
    "profile": {
      "displayName": "Bảo",
      "uiLocale": "vi-VN",
      "instructionLanguage": "vi",
      "nativeLanguage": "vi",
      "targetLanguage": "en",
      "contentLocale": "en-GB",
      "timezone": "Asia/Ho_Chi_Minh"
    },
    "onboarding": {
      "status": "IN_PROGRESS",
      "nextStep": "GOAL_SETUP"
    }
  }
}
```

Onboarding is resumable across `PROFILE -> GOAL -> PLACEMENT -> BASELINE_READY -> ROADMAP_READY -> COMPLETED`. Slice 01 ends after goal and plan creation; placement remains in the validated v1 contract for its planned slice.

## Goal, plan, dashboard, and resume

- `PATCH /v1/me/profile`
- `GET /v1/goals/current`
- `POST /v1/goals`
- `POST /v1/goals/:id/activate`
- `GET /v1/plans/today`
- `POST /v1/plans/today/generate`
- `POST /v1/plans/:id/replan`
- `GET /v1/dashboard`
- `GET /v1/resume`

Goal input is deliberately small: purpose/goal type, overall/skill targets when known, intended study level, deadline, and sustainable study preference. Advanced constraints are progressive/resumable, not one blocking form. Goal responses expose `goalVersion`/`targetVersion` and effective time where relevant. Learner identity is omitted because it comes from authenticated context.

Dashboard, plan, progress, and resume are projections. They carry server-selected semantic actions rather than asking the frontend to reconstruct planning policy.

```ts
type NextActionType =
  | "COMPLETE_PROFILE" | "SET_GOAL"
  | "START_PLACEMENT" | "CONTINUE_PLACEMENT"
  | "OPEN_ROADMAP" | "OPEN_TODAY_PLAN"
  | "START_SESSION" | "RESUME_SESSION"
  | "OPEN_LESSON" | "START_ACTIVITY" | "RESUME_ATTEMPT"
  | "START_REVIEW" | "START_RECOVERY" | "START_TRANSFER"
  | "VIEW_FEEDBACK" | "TAKE_BREAK" | "FINISH_DAY";
```

`NextActionDto` includes a typed target, standardized `reasonCodes`, optional localized learner-facing reason, plan/block reference when planned, and a decision trace identifier/version when retained. It is the preferred executable projection of DailyPlan, not an independent plan or permanent source truth.

Plan commands distinguish `skip`, `defer`, `replace`, and `explore`; responses return the revised plan projection and next action. None records learner failure or completion. Dashboard v0 remains resume/next-action first: current action, compact today sequence, due review/recovery signal, and honest uncertainty—no speculative analytics wall.

## Placement and curriculum

- `POST /v1/placements`
- `GET /v1/placements/:id`
- `GET /v1/placements/:id/next`
- `POST /v1/placements/:id/responses`
- `POST /v1/placements/:id/complete`
- `GET /v1/roadmap`
- `GET /v1/stages/:id`
- `GET /v1/tracks/:id`
- `GET /v1/modules/:id`
- `GET /v1/units/:id`
- `GET /v1/lessons/:id`
- `GET /v1/activities/:id`

Placement item delivery excludes answers, competency weights, difficulty calibration, and adaptive rules. Diagnostic responses generally do not reveal immediate correctness. Baseline results express stage orientation and confidence, never a fixed learner identity label.

Lesson DTOs contain navigation and instruction metadata: title, stage/track, duration, objectives, and activity summaries. Activity/attempt DTOs contain only the learner-safe prompt, options, support capabilities, and interaction policy. Correct answers, rubrics, evidence mappings, benchmark metadata, and evaluator rules remain server-controlled.

## Sessions, attempts, and responses

- `POST /v1/sessions`
- `POST /v1/sessions/:id/pause|resume|complete|abandon`
- `POST /v1/attempts`
- `GET /v1/attempts/:id`
- `PUT /v1/attempts/:attemptId/responses/:itemId`
- `POST /v1/attempts/:id/submit`

Starting an attempt resolves and pins exact package and delivered item versions plus relevant curriculum/goal context. `planBlockId` may be absent in Explore mode. Response payloads are tagged by response type; save is upsertable while the attempt is in progress and does not evaluate. Where useful, responses capture pre-feedback confidence separately from correctness.

Submit sends no duplicate response body. For deterministic grammar it may return `EVALUATED/COMPLETED`, feedback, and a next action synchronously. For async skills it returns `EVALUATING/QUEUED` or `PROCESSING`, normally with HTTP `202`, plus a non-blocking next action. `GET /v1/attempts/:id` is the common polling contract.

## Artifacts

- `POST /v1/artifacts`
- `POST /v1/artifacts/audio/uploads`
- `POST /v1/artifacts/:id/complete-upload`

Writing uses first-class artifact versions. Speaking requests signed direct upload, uploads to private hot storage, then completes registration after the backend verifies the object. Large binary media does not traverse NestJS by default. Signed URLs/tokens are short-lived and never stable identity.

## Feedback, state, and progress

- `GET /v1/competencies/:id/state`
- `GET /v1/progress/overview`

Feedback is a learner-facing sibling of evidence generation, not the input to mastery. The common projection includes summary, strengths, limited priority improvements, next step, and optional skill-specific details. AI-supported estimates include value/range, confidence, source, and disclaimer.

Competency DTOs expose qualitative state, evidence sufficiency/confidence, retention status, and review timing. They do not expose internal policy weights or fake precision. Completion, study time, IELTS estimate, evidence confidence, and competency state remain different constructs.

## Error vocabulary

At minimum distinguish authentication required, forbidden, not found, validation, invalid transition, idempotent replay, concurrency/version conflict, content unavailable/not ready/quarantined, assessment integrity, artifact/upload failure, evaluation pending/retryable/final failure, and rate limit. Every recoverable error supplies a valid retry, resume, alternative, or safe-exit action. No operational error is serialized as learner failure.

## Contract invariants

- `DTO-01` Success is `{ data, meta? }`; failure is `{ error }`.
- `DTO-02` DTOs are public contracts, not persistence representations.
- `DTO-03` Learner identity never comes from a request body.
- `DTO-04` Pre-submit DTOs never expose assessment secrets.
- `DTO-05` Pending evaluation never blocks the next valid learner action.
- `DTO-06` AI uncertainty is represented explicitly.
- `DTO-07` Technical failure is distinguishable from learner performance.
- `DTO-08` `NextActionDto` communicates semantics, not planner internals.
- `DTO-09` Dashboard/progress DTOs are projections, not source entities.
- `DTO-10` UTC instants and learner-timezone day semantics remain distinct.
- `DTO-11` Different educational constructs are not collapsed into one generic score.
- `DTO-12` Historical collections use cursor pagination.
- `DTO-13` Consumers cannot mutate derived intelligence.
- `DTO-14` Compatibility-relevant content, evaluator, and policy versions remain traceable server-side and are exposed only where useful.
- `DTO-15` Locale/language fields and UTC/local-date/timezone semantics remain distinct.
- `DTO-16` Overrides and degraded modes are explicit and cannot serialize as learner failure.
- `DTO-17` Reason codes are stable/versioned semantics; localized reason text is presentation.

OpenAPI examples and contract tests must enforce these projections during implementation. No client may infer missing answer, evidence, state, or planning fields from database shape.
