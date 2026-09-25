import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';
import type { Environment } from '../../config/environment.js';
import { ENVIRONMENT } from '../environment.module.js';

export const DATABASE_POOL = Symbol('DATABASE_POOL');

export function normalizeDatabaseUrl(databaseUrl: string): string {
  const url = new URL(databaseUrl);

  // pg 8 currently aliases sslmode=require to verify-full. Opt into libpq
  // semantics explicitly so `require` keeps TLS mandatory without requiring a
  // project CA; deployments that provide a CA should use verify-full instead.
  if (url.searchParams.get('sslmode') === 'require') {
    url.searchParams.set('uselibpqcompat', 'true');
  }

  return url.toString();
}

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_POOL,
      inject: [ENVIRONMENT],
      useFactory: (environment: Environment) => {
        const pool = new Pool({ connectionString: normalizeDatabaseUrl(environment.DATABASE_URL), max: 5 });
        if (process.env.VERCEL) attachDatabasePool(pool);
        return pool;
      },
    },
  ],
  exports: [DATABASE_POOL],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}
  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
