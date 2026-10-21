import 'dotenv/config';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing.');
  process.exitCode = 1;
} else {
  let pool;
  try {
    const url = new URL(process.env.DATABASE_URL);
    if (url.searchParams.get('sslmode') === 'require') {
      url.searchParams.set('uselibpqcompat', 'true');
    }
    pool = new pg.Pool({ connectionString: url.toString(), connectionTimeoutMillis: 8000 });
    const result = await pool.query("SELECT to_regclass('public.sessions') IS NOT NULL AS ready");
    if (!result.rows[0]?.ready) throw new Error('SLICE_01_SCHEMA_MISSING');
    console.log('Database connection and Slice 01 schema are ready.');
  } catch (error) {
    console.error(`Database check failed: ${error.code ?? (error.message === 'SLICE_01_SCHEMA_MISSING' ? error.message : 'INVALID_CONNECTION')}`);
    process.exitCode = 1;
  } finally {
    await pool?.end();
  }
}
