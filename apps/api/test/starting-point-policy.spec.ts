import { describe, expect, it } from 'vitest';
import { evaluateStartingPoint } from '../src/domain/placement/starting-point-policy.js';

const items = [
  { id: 'name', claimCode: 'NAME', modality: 'READING', accepted: ['Linh'] },
  { id: 'be', claimCode: 'BE', modality: 'WRITING', accepted: ['am'] },
];

describe('M1 Starting Point policy', () => {
  it('reports missing or incorrect responses as need-more-evidence, never weakness', () => {
    const result = evaluateStartingPoint(items, [{ itemId: 'name', value: 'Mai' }]);
    expect(result.coverage.map((claim) => claim.result)).toEqual([
      'NEED_MORE_EVIDENCE',
      'NEED_MORE_EVIDENCE',
    ]);
    expect(result.recommendedStart).toBe('WEEK_1_DAY_1');
  });

  it('recommends the next day only when every sampled claim is demonstrated', () => {
    const result = evaluateStartingPoint(items, [
      { itemId: 'name', value: ' linh ' },
      { itemId: 'be', value: 'AM' },
    ]);
    expect(result.coverage.every((claim) => claim.result === 'ALREADY_DEMONSTRATED')).toBe(true);
    expect(result.recommendedStart).toBe('WEEK_1_DAY_2');
  });
});
