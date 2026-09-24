# UI Architecture

**Status:** PENDING

UI architecture has not been designed or validated. This placeholder records constraints already imposed by the frozen learning/domain architecture.

## Known stack

Next.js + TypeScript + Tailwind CSS + shadcn/ui + Recharts, deployed on Vercel. The frontend consumes NestJS REST contracts.

## Mandatory UX constraints

- Always show a valid next action, including pending evaluation, content failure, device failure, interruption, and archive restore.
- Explain “why this today” using learner-safe reason traces.
- Distinguish completion, competence, performance, evidence confidence/sufficiency, transfer, and retention.
- Avoid a single mastery percentage and false precision.
- Show support use and uncertainty without shaming.
- Make pause/resume, managed breaks, light-day/re-entry, and alternative modality first-class.
- Preserve first-attempt/first-listen states and clearly mark when transcripts/models/hints are revealed.
- Protect assessment answers and benchmark internals.
- Writing/speaking feedback must be actionable, limited, and tied to artifact/audio evidence.
- Charts must remain accessible and have textual alternatives.
- Consent, privacy, recording state, upload state, and deletion/export controls must be explicit.

## Candidate surfaces (not final IA)

- Onboarding/diagnostic and goal setup.
- Today/Daily Mission and session player with block/break/resume states.
- Lesson/practice, review center, recovery flow, and transfer tasks.
- Writing studio and speaking recorder/evaluation status.
- Competency/skill dashboard, roadmap, mistake/issue view, and weekly reflection.
- Settings for accessibility, privacy, language scaffolding, storage/export/deletion.

## Next design pass

Define information architecture, routes, responsive layouts, design tokens, component/state model, loading/error/empty/pending flows, accessibility target, offline/poor-network behavior, visualization semantics, recording/upload UX, and end-to-end prototypes for the Phase B vertical slice.

No UI implementation should infer missing contracts from this placeholder.
