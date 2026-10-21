import { lessonManifestSchema, type LessonManifest } from './schema.js';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  manifest?: LessonManifest | undefined;
}

export function validateLessonManifest(raw: unknown): ValidationResult {
  const parseResult = lessonManifestSchema.safeParse(raw);

  if (!parseResult.success) {
    const errors: ValidationError[] = parseResult.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return { valid: false, errors };
  }

  const manifest = parseResult.data;
  const errors: ValidationError[] = [];

  // Invariant 1: ItemFamily Separation between Guided Practice and Independent Evidence
  const familyEligibilityMap = new Map<string, Set<string>>();

  manifest.activities.forEach((activity, actIdx) => {
    activity.items.forEach((item, itemIdx) => {
      if (!familyEligibilityMap.has(item.familyCode)) {
        familyEligibilityMap.set(item.familyCode, new Set());
      }
      familyEligibilityMap.get(item.familyCode)!.add(item.evidenceEligibility);

      // Invariant 2: Answer Secrecy in Prompt
      const forbidden = ['accepted', 'answer', 'correct', 'solution'];
      for (const key of Object.keys(item.prompt)) {
        if (forbidden.includes(key.toLowerCase())) {
          errors.push({
            path: `activities[${actIdx}].items[${itemIdx}].prompt.${key}`,
            message: `Learner prompt must never contain answer or solution key "${key}"!`,
          });
        }
      }
    });

    // Invariant 3: Exposure activities should not contain independent evidence items
    if (activity.content.opportunityType === 'EXPOSURE') {
      const independentItems = activity.items.filter((i) => i.evidenceEligibility !== 'NONE');
      if (independentItems.length > 0) {
        errors.push({
          path: `activities[${actIdx}]`,
          message: `Exposure activity "${activity.code}" cannot contain independent evidence items!`,
        });
      }
    }
  });

  // Verify family eligibility separation
  familyEligibilityMap.forEach((eligibilities, familyCode) => {
    const hasNone = eligibilities.has('NONE');
    const hasIndependent = eligibilities.has('INDEPENDENT') || eligibilities.has('TRANSFER');
    if (hasNone && hasIndependent) {
      errors.push({
        path: `item_families.${familyCode}`,
        message: `Pedagogical Invariant Violation: ItemFamily "${familyCode}" cannot mix guided practice (NONE) with independent evidence!`,
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    manifest: errors.length === 0 ? manifest : undefined,
  };
}
