# Database migrations

Canonical Supabase migrations live under `../supabase/migrations` and apply in lexical timestamp order. Slice 01A contains `learners`, `identity_accounts`, and `profiles`; Slice 01B adds curriculum, competency, and versioned content definitions. The follow-up 01B migration publishes package v2 without altering v1. Groups 01C, 01D, and 01E add attempt facts, evidence/state, and goal/plan persistence respectively. Apply each group only after verifying the previous checkpoint.

M1 adds the optional Starting Point Check, an unpublished Day 1 content draft, and version-pinned `lesson_exposures` for published item-free lessons. Exposure completion is engagement history and never competency evidence.

The API uses `DATABASE_URL`; `SUPABASE_URL` and a service-role key are not required because this slice does not use the Supabase SDK or Storage.

All learner and definition tables enable RLS and revoke `anon`/`authenticated` table privileges. The API defines no Data API policy for authoritative learner mutations; authenticated NestJS application commands enforce ownership.
