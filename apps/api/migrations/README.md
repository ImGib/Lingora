# Database migrations

Canonical Supabase migrations live under `../supabase/migrations` and apply in lexical timestamp order. Slice 01A contains only `learners`, `identity_accounts`, and `profiles`; Slice 01B adds only curriculum, competency, and versioned content definitions.

The API uses `DATABASE_URL`; `SUPABASE_URL` and a service-role key are not required because this slice does not use the Supabase SDK or Storage.

All three tables enable RLS and revoke `anon`/`authenticated` table privileges. Slice 01A intentionally defines no Data API policy because every identity/profile read and write goes through authenticated NestJS application authorization.
