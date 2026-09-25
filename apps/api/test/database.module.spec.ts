import { describe, expect, it } from 'vitest';
import { normalizeDatabaseUrl } from '../src/infrastructure/database/database.module.js';

describe('normalizeDatabaseUrl', () => {
  it('opts sslmode=require into standard libpq semantics', () => {
    const result = new URL(
      normalizeDatabaseUrl('postgresql://user:secret@db.example.test:5432/app?sslmode=require'),
    );

    expect(result.searchParams.get('sslmode')).toBe('require');
    expect(result.searchParams.get('uselibpqcompat')).toBe('true');
  });

  it('does not weaken verify-full connections', () => {
    const original =
      'postgresql://user:secret@db.example.test:5432/app?sslmode=verify-full&sslrootcert=ca.crt';

    expect(normalizeDatabaseUrl(original)).toBe(original);
  });
});
