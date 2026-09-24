# Storage Strategy

**Status:** VALIDATED

## Storage roles

| Data | Initial store | Notes |
|---|---|---|
| Relational definitions/facts/intelligence | Supabase PostgreSQL | Transactional source of truth |
| Writing text | PostgreSQL | Versioned, compact, queryable |
| Content audio/images/diagrams | Supabase Storage | Private/public policy by content class |
| Learner speaking audio | Supabase Storage hot/private | Learner-scoped access, lifecycle managed |
| Cold/archive/backup objects | Optional Google Drive adapter | Never accessed directly by domain |
| Frontend assets/build | Vercel | Deployment concern, not learning truth |

## Asset metadata

PostgreSQL stores asset identity, logical owner/purpose, provider, bucket/container, object key, MIME type, size, duration, checksum, language, lifecycle state, version, provenance, timestamps, and optional bounded metadata. Do not persist signed URLs; generate short-lived access URLs on demand.

System-provided content assets and learner-produced artifacts have different semantics and access rules. They must not be conflated.

## Ports

Application-owned interfaces include:

- `ObjectStoragePort`: put, stat, read/stream, delete, copy/move, signed access.
- `ArchiveStoragePort`: archive, restore, verify checksum, delete.
- `BackupPort`: create/verify/list retention points where applicable.

Adapters may target Supabase Storage or Google Drive. Domain objects use asset IDs/value objects, never provider SDK types, bucket URLs, or Drive file IDs as business meaning.

## Hot/cold behavior

- New content and active learner artifacts are hot.
- Archive eligibility is policy-driven by age, evaluation completion, active issue/regrade needs, consent, and legal/privacy rules.
- Restore is asynchronous; UI/application state must express `RESTORE_PENDING` and offer a valid next action.
- Move/archive operations are idempotent, checksum-verified, and recorded before hot deletion.
- A failed archive never deletes the hot source.

## Portability

Provider-specific identifiers are isolated in infrastructure mapping. Migration requires copying objects, verifying checksums, switching adapter mappings, and preserving stable asset identity; learning facts/evidence should not change.

## Backup distinction

Archive optimizes cost/access; backup recovers loss/corruption. A single Google Drive copy is not automatically a verified backup. Backup requires retention points, verification, restore testing, access control, and documented recovery objectives.
