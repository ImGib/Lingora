# 01A — Foundation and Identity — DONE

Implemented: pnpm workspace; Next.js presentation; NestJS API; Clerk token verification adapter; idempotent `Clerk sub -> identity_accounts -> LearnerId`; `GET /v1/me`; profile update; identity migration/RLS.

Evidence: identity/auth-failure/database tests, migration scope test, Git history and recorded live Clerk + Supabase verification. Vendor identity remains infrastructure; learner foreign keys use Lingora UUIDs.
