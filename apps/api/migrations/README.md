# Database migrations

Apply SQL files in lexical order to the Supabase PostgreSQL database with the platform SQL editor or a PostgreSQL migration runner. Slice 01A intentionally contains only `learners`, `identity_accounts`, and `profiles`.

The API uses `DATABASE_URL`; `SUPABASE_URL` and a service-role key are not required because this slice does not use the Supabase SDK or Storage.

All three tables enable RLS and revoke `anon`/`authenticated` table privileges. Slice 01A intentionally defines no Data API policy because every identity/profile read and write goes through authenticated NestJS application authorization.
