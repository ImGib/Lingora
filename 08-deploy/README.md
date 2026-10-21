# 08-deploy — Hạ Tầng Triển Khai & CI/CD (Infrastructure & Deployment)

> **VAI TRÒ TRONG KIẾN TRÚC LINGORA:**
> Phase 08 quản lý toàn bộ cấu hình hạ tầng triển khai đám mây (Vercel cho Web frontend, Supabase/NestJS cho Backend, Docker cho môi trường local).

## Cấu trúc:
- `README.md`: Hướng dẫn này.
- `vercel/`: Cấu hình deploy Vercel và custom domain.
- `docker-supabase/`: Script khởi chạy Supabase PostgreSQL cục bộ qua Docker.
- `ci-cd/`: Kịch bản GitHub Actions tự động chạy typecheck, lint, và Playwright E2E.
