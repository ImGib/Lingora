# UI & Information Architecture v1

**Status:** VALIDATED

The UI presents learning decisions; it does not make them. NestJS owns planning, learner state, and `NextAction`; Next.js owns routing, interaction, accessibility, local editing resilience, and presentation.

## Surfaces and routes

Lingora has Public, Learner, and Authoring surfaces in one Next.js App Router application for v1.

```text
app/
|- (public)/
|- (auth)/sign-in, sign-up
|- (onboarding)/onboarding/{profile,goal,placement,result}
|- (learner)/
|  |- dashboard
|  |- learn/{roadmap,grammar,vocabulary,pronunciation,listening,reading,writing,speaking}
|  |- lessons/[lessonId]
|  |- practice/{daily,[skill]}
|  |- attempts/[attemptId]
|  |- review/{due,issues,weak-points}
|  |- tests/{placement,checkpoint,skills,mocks}
|  |- progress/{overview,skills,vocabulary,study-time,history}
|  `- settings
`- (admin)/admin/{overview,curriculum,competencies,content,assessments,assets,qa,publishing}
```

Routes are presentation organization, not Domain boundaries. Learner primary navigation stays small: Dashboard, Learn, Practice, Review, Tests, and Progress; Profile/Settings are secondary. Authoring uses a visibly separate “Lingora Author” context.

## Dashboard and resume

Dashboard answers “What should I do today?” rather than maximizing charts. v0 is deliberately small: next/resume action, compact ordered plan, one due review/recovery signal, and a concise honest progress/uncertainty summary. Journey and richer analytics are progressive disclosure. A `GET /v1/dashboard` projection can aggregate the learner-safe view; it is not a Dashboard entity.

Resume priority is unfinished attempt, unfinished session, today's plan, then next recommended action. DailyPlan owns order; the primary CTA is its server-selected `NextActionDto` projection. Frontend code must not derive a recommendation from score thresholds.

Goal onboarding asks only what planning currently needs: purpose, target (including per-skill when known), deadline, and sustainable availability. It is resumable, permits “not sure,” and defers advanced preferences rather than presenting one large form.

## Learn, Practice, Review, and Progress

- Learn uses progressive disclosure `Stage -> Track -> Module -> Unit -> Lesson` and allows adjacent/independent track progress. Locking appears only for real prerequisites.
- Practice separates recommended practice from learner-controlled Explore mode.
- Plan actions make skip, defer, replace, and explore visibly distinct; none uses failure language. A replacement explains whether it preserves the same learning obligation.
- Review includes due knowledge/skills, issues, and recovery; it is not only flashcards. Learner-facing issue language uses “Needs Attention” and appears only after backend diagnosis policy confirms it.
- Progress separates overview, skills, vocabulary, study time, and test history. It shows qualitative state, evidence sufficiency/confidence, review health, and ranges. No universal mastery percentage or false-precision radar chart.

## Focus and activity architecture

Lesson, practice, writing, speaking, and tests use Focus Mode with reduced navigation. `ActivityRenderer` selects a typed renderer from a registry for instruction, choice, fill blank, matching, ordering, dictation, reading, listening, writing, or speaking. The server supplies the interaction/support policy; the UI does not expose answer definitions or infer evaluation.

Learning Mode may provide hints, replay, explanations, transcripts, and friendly feedback according to policy. Exam Mode has a clearly distinct restrained shell, authoritative timing, controlled navigation, limited support/replay, delayed answers, and protected benchmark behavior. Placement has its own adaptive, resumable, low-feedback flow and reports an orientation/confidence rather than a shaming percentage.

## Writing, speaking, and async evaluation

Writing uses prompt/editor workspace, autosave status, immutable artifact versions, feedback, rewrite, and optional comparison. Speaking uses explicit preparation/recording/upload/submission/evaluation states. Permission, recording, upload, storage, and evaluator failures are technical states with retry/alternative actions; they never say the learner failed.

Pending evaluation is persistent UI state:

```text
Submission received
-> evaluation queued/processing
-> learner may continue today's plan
-> feedback ready
```

Important results are not delivered only by toast.

Provider degradation is explicit and calm: evaluation queued, transcript unavailable, text alternative, alternate modality, retry, or safe stop. Cost/provider limits never appear as learner error. Pre-feedback confidence, when requested, is captured before correctness/reveal and is optional/non-punitive.

## Authoring information architecture

- Curriculum uses a tree plus focused editor workspace, not one giant table.
- Competencies use table editing and an optional graph for understanding relationships.
- QA behaves like CI for content: readiness checks, blocking issues, coverage gaps, and asset/reference failures are explicit.
- Publishing is a confirmed command with validation summary. Published versions are read-only and offer “Create new draft,” never in-place edit.
- Optimistic concurrency conflicts are surfaced rather than silently resolved.

## Empty, error, loading, and interruption states

- Empty states explain what the state means and provide a valid next action.
- User-correctable, technical, and system/policy errors look and read differently.
- Layout skeletons replace avoidable full-screen spinners; evaluation processing is not page loading.
- Temporary network loss preserves learner input locally and exposes save/retry status. Full offline mode is deferred.
- Mobile is not a shrunken desktop. Dashboard, grammar, vocabulary, listening, review, and speaking are mobile-friendly; long writing remains functional but desktop/tablet-preferred.

## Frontend organization

Use feature-oriented folders for onboarding, goals, roadmap, planning, learning, practice, review, assessment, writing, speaking, progress, and authoring. Generic primitives stay in `components/ui`; shared layout and learning components are promoted only under the rules in `design-system-v1.md`. API access maps DTOs and does not import Domain aggregates.

## UI invariants

- `UI-01` UI renders decisions; it does not own learning policy.
- `UI-02` Every state has a valid next action, including pending/failure/interruption.
- `UI-03` Resume is first-class and does not require reconstructing state client-side.
- `UI-04` Completion, competence, evidence, retention, transfer, and readiness remain visually distinct.
- `UI-05` Assessment answers and benchmark internals remain protected.
- `UI-06` Support reveal and first-attempt/first-listen conditions are explicit.
- `UI-07` Learning and Exam modes are unmistakable and policy-correct.
- `UI-08` Async evaluation never creates a learner dead end.
- `UI-09` Uncertainty and insufficient evidence are visible without false precision.
- `UI-10` Learner work survives recoverable network/provider failure.
- `UI-11` Authoring makes readiness, immutable publication, and QA blockers visible.
- `UI-12` Accessibility and responsive behavior are acceptance criteria, not polish.
- `UI-13` Standard reason codes drive stable semantics; learner-facing explanation is localized presentation.
- `UI-14` UI locale, instruction language, native language, target language, and content locale remain separate preferences.

Visual tokens, component contracts, and the locked Soft Study Companion identity are canonical in `design-system-v1.md`.
