# Security and RLS

**Status:** VALIDATED

## Trust boundaries

Browser access is untrusted. Next.js renders/presents; NestJS authenticates and authorizes domain commands. Supabase RLS and grants provide defense in depth, not business-rule ownership.

## Identity

`auth.users` is the authentication identity. `profiles.id` references it. Do not duplicate email, password, or provider credentials into learning tables. Authorization roles/entitlements are server-controlled and must not rely on user-editable metadata.

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
- Ownership checks use `auth.uid()` against learner identity for learner-owned reads.
- Derived intelligence is learner-readable through safe views/queries but server-writable only.
- Definition reads expose only published fields; answer keys, evaluator configuration, and benchmark internals are excluded.
- Storage policies restrict learner artifacts by authenticated ownership/path metadata; paths alone are not authorization.
- Grants and RLS are configured separately and minimally.

## Credential rules

- Supabase publishable configuration may be used in the browser only for explicitly allowed operations.
- Secret/service-role credentials stay in NestJS/server infrastructure and can bypass RLS; use them narrowly.
- Prefer authenticated user context when it can satisfy the operation.
- Google Drive and AI-provider credentials are server-only and accessed by adapters.
- Logs and error payloads must not expose secrets, signed URLs, assessment answers, or learner content unnecessarily.

## Command security

All authoritative mutation endpoints enforce authentication, learner/resource ownership, domain authorization, input limits, idempotency, and rate/abuse controls. Client-provided learner IDs, scores, evidence, evaluator results, or state are never trusted.

## Privacy

Speaking/writing data receives explicit consent, private access, retention visibility, export/deletion support, and purpose limitation. AI-provider submission is minimized and governed; learner content is not silently reused. Audit access to sensitive artifacts and privileged operations.
