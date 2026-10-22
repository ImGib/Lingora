# 04-coding — Source Code Implementation Workspace

> **MONOREPO ARCHITECTURAL BOUNDARY:**
> Phase `04-coding` is the dedicated implementation workspace for developers and AI coding agents.
> All production Next.js frontend code, NestJS REST backend services, Supabase migrations, and shared TypeScript contracts reside exclusively within this directory.

---

## 📂 Workspace Structure

```text
04-coding/
├── apps/
│   ├── web/                    ← Frontend: Next.js 15 (App Router, Tailwind CSS v4, Plus Jakarta Sans, Lucide)
│   └── api/                    ← Backend: NestJS 11 REST Modular Monolith (Supabase PostgreSQL, Planning & Quarantine)
└── packages/
    ├── contracts/              ← @lingora/contracts: Shared DTOs, domain models, and transport schemas
    ├── content-compiler/       ← CLI tool for validating and compiling curriculum JSON packages to SQL
    ├── typescript-config/      ← Shared base tsconfig configurations
    └── eslint-config/          ← Shared ESLint & Prettier linting rules
```

---

## 🛠️ Essential Operational Commands

Run these commands from the repository root:

| Command | Description | Target |
|---|---|---|
| `pnpm dev` | Starts `@lingora/contracts` build and runs API and Web servers in parallel | Development |
| `pnpm verify:fast` | Parallel mechanical typechecks (~8s, filters verbose stdout) | Quality Gate |
| `pnpm build:fast` | Incremental monorepo build with contracts cache (~13s) | Build |
| `pnpm test:ui-ux` | Automated WCAG 2.1 AA accessibility and 390px zero-overflow layout check | Testing |
| `pnpm test:smoke` | Preflight check for live database handshake and CORS preflight headers | Infrastructure |
| `pnpm test:evidence` | Captures headless Playwright screenshots for visual verification | Testing |
| `pnpm --filter @lingora/web typecheck` | Typechecks the Next.js web application | Frontend |
| `pnpm --filter @lingora/api typecheck` | Typechecks the NestJS backend application | Backend |
| `pnpm --filter @lingora/contracts build` | Rebuilds shared contracts and types | Core Package |

---

## 🌐 Application Architecture & Conventions

### Frontend (`apps/web`)
- **Framework:** Next.js 15 (App Router, React 19).
- **Styling:** Tailwind CSS v4 configured via `@tailwindcss/postcss`. Design tokens follow the *Soft Study Companion* palette (`brand-teal`, `mint`, `canvas-creamy`, `deep-ink`).
- **Layout Invariant:** `<InteractiveBackground />` is mounted once in `RootLayout`. Individual pages must not instantiate duplicate backgrounds.
- **Mobile Viewport Invariant:** All interactive components (IPA Mouth Studio, Grammar Masterclass, Practice Runner) must maintain **zero horizontal overflow** at a minimum viewport width of 390px.
- **IPA Invariant:** Strict 1 phoneme per viewport. All text labels must be HTML elements outside the SVG container.

### Backend (`apps/api`)
- **Framework:** NestJS 11 REST modular monolith with Ports and Adapters architecture.
- **Database:** Supabase PostgreSQL. All tables enforce strict Row Level Security (RLS). Database migrations are maintained in `04-coding/apps/api/supabase/migrations/`.
- **Identity Invariant:** Clerk authenticates user sessions. External Clerk user IDs are mapped to internal Lingora learner UUIDs; external IDs are never used as foreign keys in the domain schema.
- **Pedagogical Invariant:** The backend enforces the *Skipped != Failed* and *Support != Independent* principles in assessment and competency calculation.

### Shared Contracts (`packages/contracts`)
- Acts as the single source of truth for API request/response DTOs and domain transfer schemas.
- Must be compiled before running Web or API builds (`pnpm --filter @lingora/contracts build`).
