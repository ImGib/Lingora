#!/usr/bin/env node
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('04-coding/apps/api/.env') });

const WEB_URL = process.env.BASE_URL || 'https://lingora-web-psi.vercel.app';
const API_URL = process.env.API_URL || 'https://lingora-api.vercel.app';

async function runSmokeTest() {
  console.log('⚡ [Lingora Smoke Test] Running infrastructure health checks...');
  const start = performance.now();
  let hasFailure = false;

  // 1. Frontend Web Reachability
  try {
    const t0 = performance.now();
    const res = await fetch(WEB_URL, { method: 'HEAD' });
    const latency = (performance.now() - t0).toFixed(0);
    if (res.ok) {
      console.log(`✔ [Frontend Web] ${WEB_URL} -> HTTP ${res.status} (${latency}ms)`);
    } else {
      hasFailure = true;
      console.error(`❌ [Frontend Web] ${WEB_URL} -> HTTP ${res.status}`);
    }
  } catch (err) {
    hasFailure = true;
    console.error(`❌ [Frontend Web] Không thể truy cập ${WEB_URL}:`, err.message);
  }

  // 2. Backend API CORS & Preflight Check
  try {
    const t0 = performance.now();
    const res = await fetch(`${API_URL}/v1/dashboard`, {
      method: 'OPTIONS',
      headers: {
        Origin: WEB_URL,
        'Access-Control-Request-Method': 'GET',
      },
    });
    const latency = (performance.now() - t0).toFixed(0);
    const allowOrigin = res.headers.get('access-control-allow-origin');
    const isRedirected = res.redirected;

    if (!isRedirected && (res.status === 200 || res.status === 204) && allowOrigin) {
      console.log(`✔ [Backend API CORS] ${API_URL} -> 204 OK, No-Redirect, Origin: ${allowOrigin} (${latency}ms)`);
    } else {
      hasFailure = true;
      console.error(`❌ [Backend API CORS] Lỗi Preflight: Status=${res.status}, Redirected=${isRedirected}, AllowOrigin=${allowOrigin}`);
    }
  } catch (err) {
    hasFailure = true;
    console.error(`❌ [Backend API CORS] Không thể kiểm tra ${API_URL}:`, err.message);
  }

  // 3. PostgreSQL Database Connection Check
  if (process.env.DATABASE_URL) {
    let pool;
    try {
      const t0 = performance.now();
      const url = new URL(process.env.DATABASE_URL);
      if (url.searchParams.get('sslmode') === 'require') {
        url.searchParams.set('uselibpqcompat', 'true');
      }
      pool = new pg.Pool({ connectionString: url.toString(), connectionTimeoutMillis: 5000 });
      await pool.query('SELECT 1');
      const latency = (performance.now() - t0).toFixed(0);
      console.log(`✔ [PostgreSQL Database] Kết nối thành công (${latency}ms)`);
    } catch (err) {
      hasFailure = true;
      console.error(`❌ [PostgreSQL Database] Kết nối thất bại: ${err.message} (Supabase có thể đang bị tạm dừng)`);
    } finally {
      await pool?.end();
    }
  } else {
    console.log('⚠ [PostgreSQL Database] Bỏ qua kiểm tra: Chưa cấu hình DATABASE_URL.');
  }

  const durationSec = ((performance.now() - start) / 1000).toFixed(2);
  if (hasFailure) {
    console.error(`\n💥 Smoke Test PHÁT HIỆN LỖI HẠ TẦNG trong ${durationSec}s.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 Toàn bộ hạ tầng HEALTHY 100% trong ${durationSec}s! (0 token waste)`);
  }
}

runSmokeTest().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
