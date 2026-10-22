---
name: lingora-core-invariants
description: Core pedagogical, business, and authentication invariants of Lingora (Skipped != Failed, Support != Independent, Fault Tolerance, Resource-Based Auth).
---

# LINGORA CORE INVARIANTS

Every developer and AI agent must adhere strictly to these invariants without exception:

1. **`Skipped != Failed`:**
   - When a learner clicks "Skip", "Postpone", or takes a study pause $\rightarrow$ This is a valid pacing decision.
   - Never deduct score, never count as an error, and never display red alert banners.

2. **`Support != Independent Evidence`:**
   - When a learner accesses a "Hint" or "Transcript" $\rightarrow$ Set `has_support: true`.
   - Results are counted as supported practice and isolated from independent mastery evidence.

3. **`Technical Failure != Learner Failure`:**
   - When microphone permissions are denied, audio fails to load, or network drops $\rightarrow$ Display: *"This is a technical issue, not your fault"*.
   - Always offer an immediate fallback path (e.g., written input instead of speech recording).

4. **`Growth Garden != Streak Punishment`:**
   - When a learner returns after an absence (3–7 days) $\rightarrow$ Never reset progress to zero.
   - Display a gentle welcome and propose a 5-minute lightweight review (*Verify before Recovery*).

5. **`Resource-Based Authentication (Clerk Standard)`:**
   - Deprecated `createRouteMatcher` in middleware/proxy is strictly forbidden.
   - Protect sensitive routes at the resource level via `await auth.protect()` in layouts/pages (`/dashboard/layout.tsx`, `/lessons/layout.tsx`, `/attempts/layout.tsx`).
   - Every individual app workspace (`04-coding/apps/web`, `04-coding/apps/api`) must maintain its own `.env` / `.env.local` containing `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
