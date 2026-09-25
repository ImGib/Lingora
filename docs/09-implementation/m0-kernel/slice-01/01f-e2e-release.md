# 01F — End-to-End and Release — PARTIAL

Completed evidence: automated PostgreSQL/HTTP flow covers migrations/RLS, identity, sessions, planning, attempts, idempotency, lineage, ownership and contracts. Authenticated browser validation covers persisted feedback/evidence/plan rendering and pause → reload → resume, including recovery after temporary API unavailability. Earlier recorded live flow covered sign-in, goal/plan, lesson, save/reload, hint, submit and updated dashboard. Detailed evidence is in [validation-2026-09-25.md](validation-2026-09-25.md).

Open gates:

- repeat duplicate submit/timeout retry through real Clerk against live Supabase and compare row counts;
- repeat cross-learner isolation and authentication-failure checks with two real Clerk identities;
- deploy and verify Vercel Preview plus environment/CORS/rollback path;
- add or record adequate frontend interaction and accessibility verification.

Until these pass, describe the core flow as implemented and substantially verified, but not fully release-ready.
