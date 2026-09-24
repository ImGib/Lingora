# ADR-004 — Hot, Cold/Archive, and Backup Storage

**Status:** ACCEPTED

## Context

Speaking audio and content assets can exceed free-tier storage. Learner evidence still needs traceability, privacy, and restoration behavior. Cold storage and backup serve different goals.

## Decision

Use Supabase Storage for hot content and private learner artifacts. Use Google Drive only as an optional cold/archive or backup adapter. Keep metadata and stable asset identity in PostgreSQL. Apply explicit lifecycle policies and compact persistence.

## Consequences

- Active experiences remain fast and integrated.
- Older eligible binaries can move out of the hot tier.
- Restore may become asynchronous.
- Google Drive rate limits, folder/file semantics, access control, and backup verification require adapter logic.
- Archive is not automatically backup.

## Guardrails

- Object/archive/backup ports are application-owned.
- Checksum-verify archive copies before hot deletion.
- Never delete the source after a failed or unverified copy.
- Signed URLs are short-lived and not persisted as identity.
- Retention/consent determine whether original speaking audio may be archived or deleted.
- Domain imports no Google Drive or Supabase SDK.
