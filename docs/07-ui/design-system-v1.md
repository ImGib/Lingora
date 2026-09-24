# Design System & Component Architecture v1

**Status:** VALIDATED  
**Visual identity:** Soft Study Companion — LOCKED

## Product character

Lingora is warm, calm, cute, supportive, focused, and modern. It should feel inviting enough to open daily and quiet enough for a long study session. Cute never becomes childish; visual encouragement never rewrites learning truth.

Learning Mode is soft, rounded, pastel, and encouraging. Exam Mode is neutral, restrained, focused, minimally decorative, and governed by real assessment rules. Mascot/illustration appears sparingly in onboarding, empty states, breaks, milestones, completion, and welcome-back moments—not beside every question.

## Palette and semantic use

Reference light palette:

| Role | Value |
|---|---|
| Warm blush background | `#FFF9FB` |
| Surface | `#FFFFFF` |
| Soft blush surface | `#FFF3F7` |
| Primary lavender | `#8B7CF6` |
| Primary soft | `#EEEBFF` |
| Accent blush/pink | `#F3A8C4` |
| Accent mint | `#8FD8C5` |
| Accent peach | `#F6C89F` |
| Primary text | `#34303D` |
| Secondary text | `#77717F` |
| Border | `#ECE7EF` |

Activity moods may use lavender for learning, mint for review, blush for practice, peach for assessment, warm cream for breaks, and soft rose for recovery. Mood is not state truth. Every status also has text/icon/structure, and semantic tokens—not raw color names—drive components.

Required tokens include background/foreground, surface/surface-muted, primary/secondary, success/warning/danger/info, learning/review/recovery/assessment, evidence-low/moderate/strong, border/focus/disabled. A future dark theme uses deep plum/charcoal, muted plum surfaces, soft lavender, dusty pink, and warm off-white; dark mode is not ahead of the core flow.

## Typography, shape, and motion

- UI/body: Geist or Inter; friendly headings may use Nunito Sans.
- No handwritten type for sustained learning content.
- Reading width targets roughly 65–80 characters per line.
- Normal cards use about 16 px radius, feature cards about 20 px, small controls 10–12 px, subtle borders, and very soft shadows.
- Learning surfaces have more breathing room than dashboards/admin tables.
- Motion is limited to meaningful transition, feedback reveal, progress, and recording state; `prefers-reduced-motion` is respected. No constant floating, confetti after each item, or animated mastery theater.

## Component layers

```text
semantic design tokens
-> accessible UI primitives (shadcn/ui)
-> layout/application components
-> learning components
-> feature views
-> pages
```

Layout primitives include `AppShell`, `PageContainer`, `PageHeader`, `Section`, `Stack`, `Cluster`, `SplitPane`, `FocusShell`, `ScrollablePanel`, and `StickyActions`.

Application components include `EmptyState`, `ErrorState`, `LoadingState`, `AsyncStatus`, `ConfirmAction`, pagination/filter/search, and domain-aware chart wrappers.

Learning components include `NextActionCard`, `DailyPlan`, `PlanBlock`, `RoadmapStage`, `SkillState`, `EvidenceStatus`, `ReviewStatus`, `LearningIssueCard`, `ActivityShell`, typed question/answer renderers, `SupportToolbar`, `FeedbackPanel`, `WritingWorkspace`, `ListeningPlayer`, `AudioRecorder`, `EvaluationStatus`, and distinct Learning/Exam mode headers.

Promote a component to shared only when multiple features share the same semantics and behavior. Similar appearance alone is insufficient; avoid a universal learning card with dozens of flags.

## Critical behavioral contracts

- `NextActionCard` renders a backend `NextActionDto`; it never chooses the action.
- `PlanBlock` distinguishes learning, review, recovery, transfer, assessment, and break. `SKIPPED` is not styled as failure; completed is not mastery.
- `SkillState` and `EvidenceStatus` use qualitative state/sufficiency/confidence and accessible text, never an unexplained percentage.
- `ActivityShell` owns navigation, local progress, save state, support controls, exit behavior, and keyboard behavior—not evaluation.
- A renderer registry selects instruction, choice, fill-blank, listening, writing, or speaking UI from the DTO activity type. It is not one giant switch page.
- Support capabilities come from content/backend policy. If a hint is revealed, support use must remain recordable even across a network retry.
- `FeedbackPanel` orders summary, strengths, limited priority improvements, detail, and next action. Incorrect feedback is calm and actionable, not a red judgment screen.
- Writing autosave distinguishes saving/saved/offline/save-failed and preserves local work. AI-suggested text retains provenance.
- Listening/recording states distinguish technical load/upload/permission failure from learner performance and always offer retry, alternative, or safe exit.
- Exam timer truth uses server `startedAt/deadlineAt`; client countdown is presentation only.
- Toasts report transient system interaction; pedagogical feedback remains a persistent learning artifact.

## Component state matrix

Every significant component defines Loading, Ready, Empty, Error, Disabled-with-reason, Processing, Stale, and Offline behavior where applicable. Persistent async evaluation is not an ordinary loading spinner. Empty/error/interruption states include a valid next action.

## Accessibility and internationalization

Component acceptance requires keyboard operation, visible focus, semantic HTML, correct fieldset/radio semantics, labeled icons and audio controls, touch targets, screen-reader labels, reduced motion, and color-independent meaning. Charts have textual alternatives and do not imply unsupported precision.

UI locale, learner native language, and target language are separate concepts. V1 may prioritize English/Vietnamese UI, but shared components do not hardwire copy. Scaffolding is capability/policy-driven rather than a permanent “beginner UI” flag.

## Invariants

- `DS-01` Semantic meaning never depends on raw color.
- `DS-02` Completion visuals never imply mastery.
- `DS-03` Streak/XP/motivation signals never represent ability.
- `DS-04` Evidence uncertainty remains visible.
- `DS-05` Learning and Exam modes use distinct interaction policies.
- `DS-06` Activity renderers are type-driven and extensible.
- `DS-07` Support controls follow backend/content policy.
- `DS-08` Evidence-relevant support use is recordable.
- `DS-09` Technical and pedagogical states remain distinct.
- `DS-10` Long-form learner work survives recoverable failures.
- `DS-11` Charts cannot imply precision unsupported by evidence.
- `DS-12` Shared components require shared semantics.
- `DS-13` Accessibility is a component-level requirement.
- `DS-14` Authoring UI respects published-content immutability.
- `DS-15` Tokens express semantics rather than implementation colors.
