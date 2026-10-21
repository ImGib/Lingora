# Triển khai Lingora lên Vercel

Repo này dùng hai Vercel Projects từ cùng một Git repository. `apps/web` là Next.js; `apps/api` là NestJS chạy như một Vercel Function. `packages/contracts` là workspace package dùng chung. Vercel Services hiện ở beta; hai Projects giữ cấu hình và kiểm thử của hai app độc lập, đúng với cấu trúc repo hiện tại.

## 1. Kiểm tra trước khi deploy

1. Dùng Node.js 24 và pnpm 10.34.5 như `package.json` ở gốc. Chạy `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, rồi build riêng từng app bằng `pnpm --filter @lingora/api build` và `pnpm --filter @lingora/web build`.
2. Trong `apps/api/.env`, đặt `DATABASE_URL` của **project Supabase Lingora**. Dùng **Session pooler** (cổng 5432) nếu mạng không có IPv6; username có dạng `postgres.<project-ref>`. Mã hóa ký tự đặc biệt trong mật khẩu khi đặt trong URL. Nên thêm `?sslmode=require`. Chạy `pnpm --filter @lingora/api check:database`; lệnh này không in chuỗi kết nối. Nó phải xác nhận bảng `public.sessions` trước khi deploy API.
3. Tám migration ở `apps/api/supabase/migrations` đã được áp dụng cho project Lingora. Với một database mới, áp dụng theo thứ tự tên file **trước** khi cho API nhận request. Build trên Vercel không tự chạy migration.
4. Tạo Clerk production instance và cấu hình domain thật trước khi dùng production keys. Các khóa `pk_test_`/`sk_test_` hiện tại chỉ phục vụ môi trường development.

Nếu `check:database` trả `28P01`, dừng ở bước 2: database đang từ chối thông tin đăng nhập. Kiểm tra đúng project, password và URL lấy trực tiếp từ nút **Connect** trong Supabase. Sau khi đổi password, Session pooler có thể cần vài phút để làm mới credential.

## 2. Tạo hai Vercel Projects

Import cùng một Git repository hai lần trong Vercel Dashboard:

| Project | Root Directory | Framework Preset |
|---|---|---|
| `lingora-api` | `apps/api` | NestJS |
| `lingora-web` | `apps/web` | Next.js |

Ở cả hai project:

- Bật **Include source files outside of the Root Directory** để build được `packages/contracts`.
- Chọn Node.js 24.x. Các app cũng pin phiên bản này qua `engines.node`.
- Để Vercel tự nhận Install Command và Output Directory. Kiểm tra Build Command thực tế là script `build` của app (`pnpm run build`); nếu preset dùng lệnh khác, override Build Command thành `pnpm run build`. Script này build `@lingora/contracts` trước. Đừng override Install Command thành `pnpm install` vì Vercel có thể chọn pnpm cũ.
- Đặt `ENABLE_EXPERIMENTAL_COREPACK=1` cho Production và Preview để Vercel dùng pnpm 10.34.5 đã pin tại repo gốc.
- Chọn Function Region gần Supabase `ap-southeast-1` cho API.

Vercel sẽ tạo hai URL riêng. Lấy URL web và API thực tế từ dashboard, rồi cấu hình môi trường bên dưới và redeploy. Không suy đoán URL từ tên project.

## 3. Biến môi trường

Đặt biến ở **Project Settings → Environment Variables**. Chọn Production; với Preview, dùng Clerk/database staging và origin preview riêng. Không commit `.env` hoặc secret vào Git.

### `lingora-api`

| Tên | Giá trị |
|---|---|
| `DATABASE_URL` | URL Session pooler của Supabase, có `sslmode=require` |
| `CLERK_SECRET_KEY` | Secret key của Clerk instance tương ứng |
| `CLERK_AUTHORIZED_PARTIES` | Origin chính xác của web, ví dụ `https://app.example.com` |
| `WEB_ORIGIN` | Cùng origin của web để cấu hình CORS |

Vercel đặt `NODE_ENV` và `PORT` cho runtime; không cần đưa chúng vào Dashboard. API hiện chấp nhận một `WEB_ORIGIN` cho CORS, nên mỗi môi trường Preview cần một URL web ổn định và cấu hình tương ứng. Không mở CORS cho mọi origin.

### `lingora-web`

| Tên | Giá trị |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL HTTPS của `lingora-api`, không có `/v1` ở cuối |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable key của cùng Clerk instance với API |
| `CLERK_SECRET_KEY` | Secret key của Clerk instance đó |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |

`NEXT_PUBLIC_*` được đưa vào bundle trình duyệt khi build. Sau khi đổi `NEXT_PUBLIC_API_URL` hoặc publishable key, redeploy web. Trong Clerk Dashboard, cho phép domain web thực tế và các redirect URL đăng nhập/đăng ký tương ứng.

## 4. Kiểm tra Preview và phát hành

1. Mở URL API: một request không có token tới `/v1/me` phải trả `401`, chứng tỏ API khởi động và auth guard đang hoạt động. Nếu Function báo lỗi, xem Vercel Runtime Logs.
2. Mở URL web, đăng nhập qua Clerk, tạo goal/plan, mở lesson, lưu response, tải lại trang, dùng hint, submit, xem dashboard, pause rồi resume session. Kiểm tra request không có lỗi CORS hay `28P01`.
3. Kiểm tra dữ liệu mới trong Supabase project Lingora. Không dùng dữ liệu production thật để thử luồng xóa/sửa rộng.
4. Khi Preview đạt, gán domain production và redeploy cả hai project với biến Production; kiểm tra lại origin và Clerk domain. Git integration sẽ tự deploy các commit tiếp theo. Repo này chưa tự động chạy migration trên mỗi deploy.

## Nguồn Vercel

- [Monorepos và Root Directory](https://vercel.com/docs/monorepos)
- [NestJS trên Vercel](https://vercel.com/docs/frameworks/backend/nestjs)
- [Package managers và Corepack](https://vercel.com/docs/package-managers)
- [Pool PostgreSQL trong Vercel Functions](https://vercel.com/kb/guide/connection-pooling-with-functions)
