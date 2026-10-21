# 04-coding — Mã Nguồn Triển Khai (Source Code Space)

> **VAI TRÒ TRONG KIẾN TRÚC LINGORA:**
> Phase 04 là không gian làm việc độc quyền của các Dev Agent (Frontend, Backend, Compiler).
> Mọi code Next.js, NestJS, Supabase và packages đều nằm tại đây.

## Cấu trúc Monorepo:
```text
04-coding/
├── apps/
│   ├── web/            ← Frontend Next.js 15 (Tailwind CSS, Plus Jakarta Sans)
│   └── api/            ← Backend NestJS 11 (Supabase PostgreSQL, Planning & Quarantine Services)
└── packages/
    ├── contracts/      ← @lingora/contracts (Shared DTOs & Domain Types)
    ├── content-compiler/ ← CLI thẩm định và biên soạn bài học JSON sang SQL
    ├── typescript-config/ ← Shared tsconfig
    └── eslint-config/  ← Shared eslint config
```

## Lệnh vận hành thường dùng:
- Chạy môi trường dev: `pnpm dev`
- Kiểm tra lỗi typecheck: `pnpm --filter @lingora/web typecheck`
- Thẩm định bài học: `node 04-coding/packages/content-compiler/dist/cli.js validate 01-rd/curriculum/week-1/day-1.json`
