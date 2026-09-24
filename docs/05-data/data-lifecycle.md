# Data Lifecycle

**Status:** VALIDATED

## Principles

- Preserve learning traceability while minimizing high-cost binary and duplicative projections.
- Separate active/hot access, compact historical facts, cold/archive copies, and true backup.
- Retention is explicit by data class and may be shortened by learner deletion/privacy requirements.
- Archival never silently changes learner evidence semantics.
- Every class declares privacy sensitivity, purpose, lawful/consent basis where applicable, audience, provider disclosure, hot/archive duration, deletion behavior, and whether it may train/improve a model.

## Data classes

### Durable definitions and governance

Curriculum, competency, canonical knowledge, immutable published `learning_package_versions` and assessment-item versions, provenance, policies, and ADR-linked versions remain durable while referenced. Stable content identities remain separate from versions. Draft/unpublished generated variants may be pruned after review windows.

### Learner facts

Goals, attempts, responses, support use, observations, evidence links, and essential artifact metadata are retained to explain and recompute state. Use compact JSONB only for varying payloads; do not store repeated rendered/derived content.

### Derived projections

Competency states, readiness, dashboards, and forecasts are recomputable. Keep current projections; add periodic snapshots only for proven analytics/performance needs. Do not duplicate every transition by default.

DecisionTrace retains only the minimum inputs/version references/reason codes necessary to reproduce or explain a consequential decision. Product analytics, provider telemetry, and learner evidence have different purposes and retention; do not merge them into one event lake by default.

### Writing

Text artifacts are small and remain in PostgreSQL with version history and contribution provenance. Redundant evaluator payloads can be compacted after extracting durable observations, subject to audit needs.

### Speaking/audio

Original recent/active audio is hot in Supabase Storage. After evaluation, verification windows, and retry/regrade needs pass, eligible audio may move to optional cold/archive storage or be deleted according to policy and consent. Keep checksum, duration, format, provenance, lifecycle status, and any required derived facts. A transcript does not automatically justify deleting original audio when pronunciation evidence must remain auditable.

## Free-tier-aware controls

- Cap upload duration/size/format and reject failed/empty recordings before durable storage.
- Avoid duplicate originals, waveform files, and intermediate conversions; regenerate ephemeral derivatives when cheaper.
- Remove abandoned multipart uploads and failed temporary artifacts on a short TTL.
- Compress audio with a learning-appropriate codec/bitrate; do not preserve lossless media without a use case.
- Use lifecycle jobs in bounded batches and maintain retry/idempotency.
- Keep generated candidates in memory; persist only selected plans/actions and concise reason traces.
- Prefer recomputation over redundant tables until measurement proves otherwise.

## Lifecycle states

```text
TEMPORARY -> HOT -> COLD_ARCHIVED -> DELETE_ELIGIBLE -> DELETED
                 -> RESTORE_PENDING -> HOT
```

`BACKED_UP` is an orthogonal property, not a storage tier. Google Drive can be an optional cold/archive or backup destination through a provider; it is not the transactional database.

## Deletion and export

Learner deletion is orchestrated across database and providers, with legal/operational exceptions explicit. Tombstones/audit records must contain no unnecessary content. Export includes understandable learner-owned data and artifact references/files where permitted.

Derived state, caches, embeddings, transcripts, evaluator payloads, provider copies, and backups are included in the retention/deletion inventory. Invalidation retains only the lineage and audit facts needed to explain why evidence no longer contributes.
