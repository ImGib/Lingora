# Slice 01F Closure Validation — 2026-09-26

## Result

Slice 01F and M0 Slice 01 are **DONE**. All four gates left open by the 2026-09-25 audit now have repeatable or recorded evidence.

## Live identity, retry and isolation

The Playwright release suite creates two disposable users in the Clerk development instance, signs in through Clerk's supported test helper, obtains real session tokens and exercises the local NestJS API against the live Supabase PostgreSQL target.

- The first learner creates a goal, plan and three-response attempt.
- The first submit creates exactly three observations and three evidence rows.
- Repeating submit with the same idempotency key returns `replayed: true`; live row counts remain exactly 3/3.
- The second Clerk identity receives `404` for the first learner's attempt read, response write and submit paths.
- Missing and invalid bearer tokens receive `401`.
- Test learners, identity mappings and Clerk users are removed after the run; the post-run fixture audit found no remaining 01F users.

Command: `pnpm e2e`
Result: **3/3 passed**.

## Frontend and accessibility

The same Chromium suite verifies keyboard focus on the public sign-in action and runs axe against the public page and authenticated dashboard using WCAG 2 A/AA and 2.1 A/AA tags. All scans passed. The scan exposed a primary-button contrast ratio below 4.5:1; the primary color was darkened before the successful rerun.

## Vercel Preview and rollback

- API Preview: `https://lingora-api-preview.vercel.app` — READY.
- Web Preview: `https://lingora-web-preview.vercel.app` — READY.
- An unauthenticated API request returns `401 AUTHENTICATION_REQUIRED` and allows origin `https://lingora-web-preview.vercel.app`.
- The stable API Preview alias was moved to the preceding READY deployment, checked, then restored to the current READY deployment.
- After restoration, the API again returned the expected `401` and the correct Preview CORS header.
- `.vercelignore` excludes local environment files and generated artifacts from deployment uploads.

The first API deployment attempt failed because the project build initially lacked monorepo workspace context. The project configuration was corrected and superseded by the READY deployment above; it is retained in Vercel history as failure evidence.

## Scope of the claim

This closes the engineering proof required for M0 Slice 01. It does not claim production-scale operations, completed M1 content, real-learner retention/transfer evidence or the 28-day outcome.
