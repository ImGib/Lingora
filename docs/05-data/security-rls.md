# Security and RLS

**Status:** VALIDATED

## Trust boundaries

Browser access is untrusted. Next.js renders/presents; NestJS authenticates and authorizes domain commands. Supabase RLS and grants provide defense in depth, not business-rule ownership.

## Identity

Clerk is the external authentication identity. `identity_accounts(provider, provider_user_id)` maps Clerk JWT `sub` to `learners.id`, the Lingora-owned UUID used by goals, attempts, evidence, state, and plans. `profiles.learner_id` references that UUID. Do not duplicate passwords or broad provider metadata into learning tables. Authorization capabilities are server-controlled and do not rely on user-editable metadata.

## Access matrix

| Data | Learner read | Learner direct write | Trusted backend |
|---|---:|---:|---:|
| Own profile | Yes | Limited safe fields | Yes |
| Own goals | Yes | Through commands | Yes |
| Published curriculum/content | Yes | No | Yes |
| Own attempts/responses/artifacts | Yes | Through commands/upload flow | Yes |
| Observations/evidence | Optional/explained view | No | Yes |
| Competency state/issues/plans | Yes | No, except bounded plan actions | Yes |
| Assessment answers/benchmark internals | No | No | Yes |
| Governance/provenance/internal policies | No | No | Yes |

## RLS direction

- Enable RLS on every exposed table.
- Slice 01A revokes all `anon` and `authenticated` privileges on identity/profile tables and defines no Data API policies because every access goes through NestJS. A later direct-access path requires a separate reviewed grant plus ownership policy.
- Core flows use NestJS authorization with `RequestContext.learnerId`; no client-provided learner ID is trusted.
- For an explicitly approved direct Supabase path, ownership checks map `auth.jwt()->>'sub'` through `identity_accounts` to the Lingora learner UUID. Provider subjects are never compared directly to learner foreign keys.
- Derived intelligence is learner-readable through safe views/queries but server-writable only.
- Definition reads expose only published fields; answer keys, evaluator configuration, and benchmark internals are excluded.
- Storage policies restrict learner artifacts by authenticated ownership/path metadata; paths alone are not authorization.
- Grants and RLS are configured separately and minimally.

## Credential rules

- Clerk publishable configuration and Supabase publishable configuration may be used in the browser only for explicitly allowed operations.
- Clerk secret keys, webhook secrets, and Supabase secret/service-role credentials stay server-side.
- Secret/service-role credentials stay in NestJS/server infrastructure and can bypass RLS; use them narrowly.
- Prefer authenticated user context when it can satisfy the operation.
- Google Drive and AI-provider credentials are server-only and accessed by adapters.
- Logs and error payloads must not expose secrets, signed URLs, assessment answers, or learner content unnecessarily.

Authentication/session failure, webhook failure, and identity-provider outage are technical conditions. They do not fail an attempt, create an Observation/Evidence record, or lower CompetencyState.

## Command security

All authoritative mutation endpoints enforce authentication, learner/resource ownership, domain authorization, input limits, idempotency, and rate/abuse controls. Client-provided learner IDs, scores, evidence, evaluator results, or state are never trusted.

Publishing additionally enforces authoring capability, readiness/QA, optimistic concurrency, and benchmark isolation. Ordinary learner DTOs and direct definition reads exclude answer keys, rubrics, calibration, evidence mappings, and benchmark banks.

## Privacy

Speaking/writing data receives explicit consent, private access, retention visibility, export/deletion support, and purpose limitation. AI-provider submission is minimized and governed; learner content is not silently reused. Audit access to sensitive artifacts and privileged operations.

Data classes carry privacy/retention classification. Native language, disability/accessibility signals, voice, free writing, and inferred learning issues are sensitive in different ways and are exposed only for a declared purpose. `uiLocale`, `instructionLanguage`, `nativeLanguage`, `targetLanguage`, and `contentLocale` must never be silently conflated.
