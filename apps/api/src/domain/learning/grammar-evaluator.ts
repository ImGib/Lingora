export const EVALUATOR_VERSION = 'GRAMMAR_3PS_V1';
export const EVIDENCE_POLICY_VERSION = 'EVIDENCE_3PS_V1';

export type GrammarResult = {
  code: 'CORRECT_TARGET_FORM' | 'MISSING_THIRD_PERSON_MARKING' | 'OTHER_RESPONSE';
  correct: boolean;
  explanation: string;
};

export function evaluateGrammar(value: string, accepted: string[], explanation: string): GrammarResult {
  const response = value.trim().toLocaleLowerCase('en');
  if (accepted.some((answer) => answer.toLocaleLowerCase('en') === response)) {
    return { code: 'CORRECT_TARGET_FORM', correct: true, explanation };
  }
  if (accepted.some((answer) => answer.toLocaleLowerCase('en') === `${response}s`)) {
    return { code: 'MISSING_THIRD_PERSON_MARKING', correct: false,
      explanation: 'With he, she, it, or a person’s name, add -s to this regular verb.' };
  }
  return { code: 'OTHER_RESPONSE', correct: false,
    explanation: 'Look at the person doing the action, then try the verb form again in your next practice.' };
}

export function projectState(events: { direction: 'POSITIVE' | 'NEGATIVE'; strength: number; independence: number; item_family_id: string }[]) {
  const independentPositive = events.filter((event) => event.direction === 'POSITIVE' && event.independence === 3);
  const distinctPositive = new Set(independentPositive.map((event) => event.item_family_id)).size;
  if (distinctPositive >= 2 && events.filter((event) => event.direction === 'NEGATIVE').length === 0) {
    return { label: 'DEVELOPING' as const, confidence: 'MODERATE' as const };
  }
  if (events.length > 0) return { label: 'EMERGING' as const, confidence: 'LOW' as const };
  return { label: 'UNKNOWN' as const, confidence: 'LOW' as const };
}
