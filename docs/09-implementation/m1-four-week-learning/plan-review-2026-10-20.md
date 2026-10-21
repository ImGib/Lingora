# M1 Plan Review — 2026-10-20

**Status:** ACCEPTED REVIEW NOTE. It reorders remaining Slice 01 work. It does not change frozen invariants, claim sets or exit gates.

## Source-checked baseline

| Area | Code reality | Gap against Slice 01 |
|---|---|---|
| Starting Point Check | API, migration, learner UI, resume and honest per-claim output exist | migration and HTTP flow not yet verified on a disposable PostgreSQL database |
| Exposure lessons | item-free exposure read/complete endpoints and `lesson_exposures` exist | no published M1 content uses them yet |
| Week 1 content | Day 1 (exposure) and Day 2 (guided practice) are unpublished drafts written as hand-authored SQL migrations | Days 3–7, audio assets, independent/transfer families and delayed probes are missing |
| Learner artifacts | none; attempts handle short text responses only | Day 5 writing (3–5 sentences) and 20–30s recording cannot be captured |
| Planner | `DailyPlan` always creates `LESSON → PRACTICE → BREAK`; next action covers paused session, attempt in progress and break | no `REVIEW`, `VERIFY`, `RECOVER`, `TRANSFER` candidates, due-time persistence or minimum-viable-day shape |
| Quarantine | lifecycle designed in content authoring v1 | no command, flag or selection filter |

## Risks

1. **Content velocity.** 28 days of reviewed content cannot be produced at the current one-SQL-migration-per-day rate. Hand-written SQL also makes readiness checks (references, ItemFamily distinctness, evidence eligibility, answer secrecy) depend on reviewer attention.
2. **Artifact infrastructure is on the critical path.** Day 5, Day 6 and the Week 1 production claims depend on immutable text/audio artifacts, a NestJS-owned storage port, retention/deletion and microphone-denied/upload-failure paths. None exist.
3. **Planner is still the M0 shape.** Days 1–7 cannot resume, shorten or schedule review/probes without due-time persistence and new candidate types.
4. **Quarantine is a release gate, not a later feature.** Publishing Week 1 without a way to stop selection of unhealthy content would violate the Slice 01 exit gates.
5. **Release-gate pressure on drafts.** Drafts must not be published early to show progress; each publication blocker in the day drafts remains binding.

## Reordered NOW sequence for Slice 01

| # | Work | Why this position | Done when | Status |
|---:|---|---|---|:---:|
| 1 | Verify Starting Point Check on disposable PostgreSQL | closes an already-built path; cheap | migration applies clean; HTTP start/skip/resume/save/complete pass against it | PENDING DB |
| 2 | Content source format + validator that emits `DRAFT` migrations | unblocks Days 3–7 and Weeks 2–4 without weakening review | Day 1/2 drafts round-trip from source files; validator rejects missing references, shared families across guided/independent items, and answer data in learner DTO fields | ✅ DONE (`packages/content-compiler`) |
| 3 | Learner artifacts v0 (text in PostgreSQL, audio via storage port) | critical path for production claims | immutable versions, owner-only access, idempotent finalize, deletion, privacy notice, microphone-denied and upload-failure alternatives with no negative evidence | ✅ DONE (`apps/api` & `apps/web`) |
| 4 | Planner v1 increment: due-time persistence, `RESUME`/`REVIEW`/`VERIFY`, minimum viable day | needed before Days 1–7 can be lived as days | 15-minute and normal plans differ; a delayed probe becomes due; reason codes appear in `DecisionTrace` | ✅ DONE (`apps/api`) |
| 5 | Quarantine command and selection filter | required before any publication | quarantined version is no longer selected; affected evidence is flagged for review | ✅ DONE (`apps/api` & `apps/web`) |
| 6 | Author Days 3–7 through the validator; record Day 1/3 audio | content can now move fast and safely | every day draft lists its claim, family, evidence eligibility and blockers | ✅ DONE (Days 1–7 authored, validated & migrations generated) |
| 7 | Publish Week 1 through the authoritative command, then run accessibility, privacy and real-beginner gates | publication last, not first | Slice 01 exit gates pass with recorded evidence | READY FOR LIVE DB & GATES |

## Guardrails for the content tooling

- The tool produces `DRAFT` versions only. Publication remains an authoritative NestJS command; AI-assisted source text cannot publish itself.
- Source files are authoring inputs, not a second source of truth: published versions in PostgreSQL stay immutable and pinned by attempts.
- Validation failures block migration output; they are never downgraded to warnings for convenience.

## Prototype MVP & Visual Pedagogy Integration

1. **Interactive Prototype Sandbox:** Built in `prototype/` and mounted in Next.js (`apps/web/src/app/prototype`). It verifies Week 1 flows (Starting Point Check, Day 1–7 runner, audio recorder with microphone-denied fallback, text writing workspace, and qualitative 4-dimensional evidence display) before heavy backend implementation.
2. **Pedagogical Visualization (ForumFlash inspiration):**
   - **Grammar Pieces:** Decompose sentence structures into tactile cards (`[Subject: I] + [Verb: am] + [Complement: Linh]`) on Day 2 (`be`) and Day 4 (`QA`) instead of dry rules.
   - **Learning Growth Garden:** Progress surfaces adopt organic growth metaphors (Seed → Sprout → Tree → Leaves → Fruit) to express sustained learning rhythm without punitive streaks or fake mastery percentages.
   - **Support & Quarantine Widget:** Floating learner feedback trigger allowing immediate reporting of confusing text or broken audio, directly wired to the content quarantine path.

## Governance via `lingora-plan-flow` Skill

All future plan reviews, vertical-slice audits, and prototype updates are governed by the dedicated skill:
[`.agents/skills/lingora-plan-flow/SKILL.md`](file:///d:/Lingora/.agents/skills/lingora-plan-flow/SKILL.md).

Every update must execute the 7-step cycle:
`Code Reality Audit -> Gap/Risk Analysis -> External Inspiration Integration -> INTERACTIVE RED-TEAMING FLOW (4 Phases) -> Plan Documenting -> Prototype/UI Sync -> Verification & Reporting`.

### Red-Teaming Verdict for this Review (Bước 4 Record)

| Hạng mục đề xuất | Lăng kính thử thách | Rủi ro phát hiện | Kết luận | Giải pháp thống nhất |
|---|---|---|---|---|
| AI scoring / ASR tự động chấm điểm phát âm | Sư phạm & Kỹ thuật | Tạo ảo tưởng thành thạo, phát âm vùng miền bị chấm sai, tốn chi phí hạ tầng | `REJECTED / LATER` | Giữ nguyên ghi âm định tính (`SPEAK`), chỉ lưu trữ artifact độc lập để học viên tự nghe lại |
| Streak số ngày liên tục hiển thị ở Dashboard | Người học & Tâm lý | Tạo áp lực trừng phạt khi học viên bận rộn, vi phạm `Skipped != Failed` | `REJECTED` | Thay bằng Learning Garden (khu vườn sinh trưởng theo lượng giờ và bằng chứng định tính tích lũy) |
| Viết migration SQL thủ công cho 28 ngày | Kỹ thuật & Bền vững | Tốc độ chậm, dễ sai lệch ItemFamily, khó kiểm soát chất lượng | `REFACTORED` | Xây dựng CLI content validator kiểm tra claim alignment rồi mới sinh file migration DRAFT |
| Tích hợp prototype độc lập vào Next.js | Kỹ thuật & Người học | Tránh xung đột với nhánh `codex` đang chạy và cho phép kiểm chứng UX nhanh | `DEFENDED` | Mount static prototype tại `/prototype` qua iframe/public asset, bảo toàn WCAG 2.1 AA |

## Explicitly not changed

- No Week 2–4 slice briefs are created; their boundaries still follow the Slice 01 report.
- No AI/ASR scoring, CEFR/IELTS mapping, universal SRS or generic workflow engine is pulled forward.
- Real-learner validation remains a required gate for Slice 01 and for M1.

