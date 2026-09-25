import { describe, expect, it } from 'vitest';
import { evaluateGrammar, projectState } from '../src/domain/learning/grammar-evaluator.js';

describe('Slice 01 grammar policy', () => {
  it('separates exact regular form from a missing third-person marker', () => {
    expect(evaluateGrammar(' plays ', ['plays'], 'She plays.').code).toBe('CORRECT_TARGET_FORM');
    expect(evaluateGrammar('play', ['plays'], 'She plays.').code).toBe('MISSING_THIRD_PERSON_MARKING');
    expect(evaluateGrammar('playing', ['plays'], 'She plays.').code).toBe('OTHER_RESPONSE');
  });

  it('does not claim strong ability after one family or one supported answer', () => {
    const evidence = [
      { direction: 'POSITIVE' as const, strength: 3, independence: 3, item_family_id: 'routine' },
      { direction: 'POSITIVE' as const, strength: 3, independence: 3, item_family_id: 'routine' },
      { direction: 'POSITIVE' as const, strength: 1, independence: 1, item_family_id: 'other' },
    ];
    expect(projectState(evidence).label).toBe('EMERGING');
    expect(projectState([...evidence, { direction: 'NEGATIVE', strength: 2, independence: 3, item_family_id: 'other' }]).label).toBe('EMERGING');
  });
});
