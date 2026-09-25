# Implementation Readiness — Slice 01: Present Simple Third-Person Singular

**Status:** DEFINED  
**Implementation:** 01A LIVE VERIFIED; 01B–01E IMPLEMENTED, LIVE VERIFICATION PENDING; 01F PENDING

Slice 01 is the smallest end-to-end proof of the Lingora kernel. It is not an MCQ demo and does not authorize unrelated platform work.

```text
Clerk Login -> Learner Provisioning -> Goal Setup -> Dashboard/DailyPlan
-> Present Simple Lesson -> Practice -> Submit
-> Deterministic Evaluation -> Observation -> Evidence -> CompetencyState
-> NextAction -> Updated Dashboard
```

## Delivery checkpoints 1A–1F

Each checkpoint must pass its focused integration/contract tests before the next migration group is applied:

| Checkpoint | Proof |
|---|---|
| 1A Identity + Profile | Clerk subject idempotently resolves to Lingora LearnerId; minimal distinct locale/language/timezone preferences round-trip |
| 1B Curriculum + Lesson rendering | real hierarchy and published package render safely through a learner-safe DTO; unified LearningItem model follows ADR-008; no learner facts/intelligence required |
| 1C Attempt + Response + deterministic evaluation | save/submit/support/idempotency and source-near evaluation work with exact versions |
| 1D Observation + Evidence + CompetencyState | minimal Evidence v0 and semantic state projection preserve lineage and uncertainty |
| 1E Planner + Dashboard | DailyPlan owns sequence; compact dashboard renders preferred NextAction and reason code |
| 1F Full E2E | login -> goal -> plan -> lesson -> submit -> state -> refreshed action, including resume/failure/security paths |

This staging changes delivery order, not the final vertical-slice contract.

### Checkpoint 01A freeze

Architecture v2 is **FROZEN FOR IMPLEMENTATION**. Checkpoint 01A is limited to the pnpm foundation, Next.js + Clerk presentation boundary, NestJS authentication/identity boundary, `RequestContext { learnerId, requestId }`, and PostgreSQL `learners`, `identity_accounts`, and `profiles` persistence. Its public API is only `GET /v1/me` and `PATCH /v1/me/profile`.

The 01A profile stores only `display_name`, `native_language`, and IANA `timezone`. It does not prematurely implement goal or locale/content preferences required by later checkpoints. Authentication/database failures have no path to learning facts or derived state because no such module or table exists in 01A.

### Checkpoint 01A live verification

On 2026-09-25, the timestamped 01A migration was applied to Supabase PostgreSQL and verified for table creation, constraints, RLS enablement, and absence of `anon`/`authenticated` grants. A temporary Clerk test identity completed the browser-to-database flow: Clerk login, `GET /v1/me` provisioning, `PATCH /v1/me/profile`, and persisted values after reload. A request without a token returned `401 AUTHENTICATION_REQUIRED`. The temporary Clerk user and its database rows were removed after the verification run.

## Workspace and code boundaries

Use a pnpm monorepo:

```text
lingora/
|- apps/
|  |- web/src/{app,features,components,lib}
|  `- api/src/
|     |- modules/{identity,goal,curriculum,learning,intelligence,planning}
|     |- domain
|     |- application
|     |- infrastructure
|     `- main.ts
|- packages/{contracts,eslint-config,typescript-config}
|- docs/
|- package.json
`- pnpm-workspace.yaml
```

Do not add Nx/Turborepo without a demonstrated need. `packages/contracts` contains only transport-compatible schemas/enums/types. Frontend and backend do not share Domain aggregates or learner-intelligence internals.

## Slice curriculum and competencies

Seed the real curriculum hierarchy:

```text
PROGRAM.IELTS_ACADEMIC
`- STAGE.S1
   `- TRACK.GRAMMAR
      `- Foundation Grammar module
         `- Daily Routine unit
            `- LESSON.PRESENT_SIMPLE.THIRD_PERSON
```

Target lesson: “Talk About Another Person's Routine.” Outcome: in familiar daily-routine contexts, the learner independently selects or produces the correct third-person singular form of familiar regular verbs.

Competencies:

```text
GRAM.PRESENT_SIMPLE.MEANING
  -> supports GRAM.PRESENT_SIMPLE.AFFIRMATIVE
  -> prerequisite for GRAM.PRESENT_SIMPLE.THIRD_PERSON
```

The slice targets `GRAM.PRESENT_SIMPLE.THIRD_PERSON`; it does not collapse the catalog to a generic `PRESENT_SIMPLE` skill.

Before seeding, validate every proposed competency against the creation criteria in `competency-model.md`. The precise Slice claim is independent controlled written production of the regular third-person form in familiar context; recognition and supported production are separate claims/evidence conditions, not new competencies by default.

## Seed package v1

`PACKAGE.PRESENT_SIMPLE_3PS.V1` is reproducibly seeded and `PUBLISHED` so a learner can use it. It contains:

1. Instruction: contrast `I work` with `he/she works`; regular familiar verbs only.
2. Recognition: choose the correct form in a familiar sentence.
3. Controlled practice: type a supplied verb in the correct form.
4. Independent check: produce the form without a hint or choices on first response.
5. Summary/reflection.

Support policy:

- recognition receives explanation after response;
- controlled practice may offer an optional hint;
- independent check has no hint before first response;
- every revealed support is recorded as `SupportUsage` because supported and independent correctness carry different evidence meaning.

Later package versions cover `-es`, consonant-`y`, `have -> has`, broader morphology, transfer, speaking, and delayed retrieval. They are outside Slice 01, not removed from the validated curriculum.

## Migration gates

The following is a logical destination, not one migration. Apply groups A–F only with checkpoints 1A–1F and omit any table not yet required:

- Identity: `learners`, `identity_accounts`, `profiles`.
- Goal: `learner_goals`.
- Curriculum: `programs`, `stages`, `tracks`, `stage_tracks`, `modules`, `units`, `lessons`.
- Competency: `competencies`, `competency_relations`, `lesson_competencies`.
- Content: `learning_packages`, `learning_package_versions`, `activities`, `assessment_items`, `assessment_item_versions`, `activity_items`, `assessment_item_competencies`.
- Learning facts: `sessions`, `attempts`, `responses`, `support_usages`.
- Intelligence: `observations`, `evidence`, `competency_states`.
- Planning: `daily_plans`, `plan_blocks`.

Before Content group C, record the PracticeItem versus AssessmentItem decision: either one versioned item model with explicit purpose/evidence eligibility or separate roots with justified lifecycle/security differences. Do not inherit the current `assessment_items` name unexamined.

Do not create artifact, async job/evaluation-run, issue/recovery, knowledge/lexeme, roadmap, QA-result, Content Health, intervention, feature-release, event/outbox, readiness-snapshot, or forecast-snapshot tables yet. LearningClaim/opportunity/DecisionTrace details remain stable codes/configuration or compact metadata unless this slice proves persistence needs.

## Identity, goal, and plan

Clerk `sub` resolves idempotently through `identity_accounts` to one Lingora UUID. Goal v0 creates/reads one active IELTS/study goal and study preference. Goal UI uses short progressive/resumable steps for purpose, target, study time, deadline, and summary, permits uncertainty, and avoids advanced preference capture.

Planner v0 is intentionally small:

```text
no goal -> SET_GOAL
goal + no target evidence -> OPEN_LESSON
unfinished lesson/attempt -> RESUME
lesson complete + insufficient evidence -> PRACTICE
sufficient current-objective evidence -> NEXT_LESSON
```

DailyPlan v0 contains a Present Simple lesson block, short practice block, and break and owns their ordering. NextAction is the preferred executable projection with a standardized reason code. Completing a block updates plan state only: `PlanBlock COMPLETED != competency mastered`. Skip/defer/replace/explore remain distinct and never mean failure.

## Attempt and deterministic evaluation v0

StartAttempt authenticates the learner, validates eligibility, resolves the published package and exact item versions, captures performance conditions, and creates `IN_PROGRESS`.

`PUT /v1/attempts/:attemptId/responses/:itemId` verifies ownership, attempt state, item membership, and response shape, then upserts learner fact. Save does not evaluate.

`POST /v1/attempts/:id/submit` requires an idempotency key and transactionally validates owner/state/required responses, marks submitted, evaluates deterministically, creates observations, derives evidence, recomputes affected state, marks evaluated, completes the plan block when appropriate, and returns feedback plus the next action. A replay cannot duplicate any effect.

Evaluator v0 recognizes at least:

- `CORRECT_TARGET_FORM` for an accepted target form;
- `MISSING_THIRD_PERSON_MARKING` when a base form is used where third-person marking is required.

It records evaluator/policy version and high confidence for exact deterministic matches. It does not infer a confirmed weakness from one answer.

## Observation, Evidence, and CompetencyState v0

Observation stays source-near: what form was produced/selected, under which item/version/family, support, and performance condition. Evidence v0 interprets that observation for one competency + claim/modality with direction, strength, independence, authored difficulty, confidence, source/trust, validity, occurred time, and policy version. Optional extension metadata preserves future retention/transfer/context fields without adding speculative tables.

Policy examples are provisional configuration, not educational truth:

| Opportunity | Direction | Relative strength | Independence |
|---|---|---:|---:|
| Independent correct | Positive | 3 | 3 |
| Correct after hint | Positive | 1 | 1 |
| Independent incorrect | Negative | 2 | 3 |

Never calculate mastery as a naive correct/total average. Slice 01 uses conservative learner-facing v0 labels `UNKNOWN`, `EMERGING`, `DEVELOPING`, with `FUNCTIONAL` reserved and normally unreachable from this single lesson/context. These labels are a bounded Slice 01 policy/projection and do not permit `MASTERED` or weaken the full frozen retention/transfer requirements.

A first meaningful opportunity may move unknown toward emerging; consistent independent evidence may support developing. Persist CompetencyState only because it is recomputable, uncertainty-bearing, explainable, and consumed by the planner/UI. One wrong answer remains an observation and uncertainty signal—not a confirmed LearningIssue, Weakness, Bottleneck, or RecoveryPlan.

## Visual baseline

The goal, dashboard, lesson, and feedback screens implement the locked Soft Study Companion identity from `design-system-v1.md`:

- warm blush/cream background, lavender primary, blush/mint/peach accents;
- calm rounded surfaces, generous learning spacing, subtle borders/shadows;
- cute but restrained language/illustration, never childish;
- Learning Mode soft and encouraging; Exam Mode remains out of this slice but its restrained policy is preserved;
- color never carries state alone; focus, contrast, keyboard, text labels, reduced motion, and touch targets meet the accessibility baseline.

Dashboard is resume/next-action first and shows only the compact daily sequence, one attention signal, and honest uncertainty. Lesson uses Focus Mode. Correct feedback explains the successful target form; incorrect feedback calmly prompts attention/self-correction without a giant red failure state. The Soft Study Companion direction remains locked.

## Acceptance criteria

Slice 01 is complete only when a real learner can:

1. Sign in with Clerk and receive one stable Lingora `LearnerId` across retries/sessions.
2. Set an IELTS/study goal and reopen the resumable state.
3. Open the dashboard and receive a backend-generated next action/daily plan.
4. Open the published Present Simple lesson pinned to exact package/item versions.
5. Complete instruction, recognition, controlled practice, independent check, and summary.
6. Save/change responses without triggering evaluation.
7. Reveal a permitted hint and have support use persisted accurately.
8. Submit safely and idempotently, including a retried request.
9. Receive deterministic, learner-safe feedback without pre-submit answer leakage.
10. Produce source-near observations and separate evidence records.
11. Recompute only the affected competency state under a versioned conservative policy.
12. Complete a plan block without claiming mastery.
13. Receive an updated next action/dashboard after evaluation.
14. Refresh, close, reopen, and resume correctly without losing learner work.
15. Never read or mutate another learner's data or derived intelligence.
16. Experience the Soft Study Companion baseline consistently and accessibly.
17. Reproduce the selected action from its relevant goal/curriculum/policy versions and standardized reason code.
18. Distinguish exposure, practice opportunity, and evidence opportunity in seeded activity semantics.

## Verification plan

- Domain tests: evaluator rules, evidence interpretation, conservative transitions, and planner cases.
- Application tests: learner provisioning, CreateGoal, StartAttempt, SaveResponse, RecordSupportUsage, SubmitAttempt/idempotent replay, and GetDashboard.
- Integration tests: PostgreSQL repositories, transaction rollback/commit, exact content version pinning, and Clerk-to-learner mapping.
- Security tests: learner A isolation from learner B, no client intelligence writes, assessment secret exclusion, and auth failure not producing evidence.
- Contract tests: envelopes, `NextActionDto`, safe lesson/activity projections, errors, version/date semantics.
- UI/accessibility tests: focus order, keyboard question flow, labels/contrast, non-color status, loading/error/resume behavior, and responsive baseline.
- E2E: Login -> Goal -> Dashboard -> Lesson -> Practice -> Feedback -> Updated Dashboard, including refresh and duplicate submit.

## Definition of Done

The page looking correct or an endpoint returning 200 is insufficient. UI, API DTO, application use case, Domain invariants, persistence, authorization/RLS, content versioning, idempotency, learning semantics, and automated verification must agree. No required path may be mocked as complete, and no deferred subsystem may be implemented speculatively to declare Slice 01 done.

## Planned slice sequence

```text
01 Grammar deterministic
02 Vocabulary + review/retention
03 Listening + audio + replay/transcript support
04 Writing + artifact versions + async AI evaluation
05 Speaking + audio upload + ASR + async evaluation
06 Placement
07 Reading
08 Checkpoint / Exam Mode
```

The order introduces one major architectural difficulty at a time. Coding begins only after this documentation baseline; this document does not contain or create application code.

After Slices 01–03, stop horizontal architecture expansion by default. Prioritize curriculum depth, Content Health, learning/evidence quality, and observation with real learners; add infrastructure concepts only for demonstrated blockers.
