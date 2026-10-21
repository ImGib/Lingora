import { z } from 'zod';

export const modalitySchema = z.enum([
  'WRITTEN',
  'WRITTEN_RECOGNITION',
  'WRITTEN_PRODUCTION',
  'SPOKEN_PRODUCTION',
  'AURAL_RECOGNITION',
]);

export const activityTypeSchema = z.enum([
  'INSTRUCTION',
  'RECOGNITION',
  'CONTROLLED_PRACTICE',
  'INDEPENDENT_CHECK',
  'REFLECTION',
]);

export const opportunityTypeSchema = z.enum([
  'EXPOSURE',
  'GUIDED_PRACTICE',
  'INDEPENDENT_EVIDENCE',
  'REFLECTION',
]);

export const responseTypeSchema = z.enum([
  'SINGLE_CHOICE',
  'SHORT_TEXT',
]);

export const evidenceEligibilitySchema = z.enum([
  'NONE',
  'SUPPORTED',
  'INDEPENDENT',
  'TRANSFER',
]);

export const itemPurposeSchema = z.enum([
  'PRACTICE',
  'EVALUATION',
  'BENCHMARK',
]);

export const supportPolicySchema = z.object({
  hintAllowed: z.boolean(),
  hint: z.string().optional(),
});

export const promptSchema = z.record(z.string(), z.unknown()).refine(
  (obj) => {
    // Invariant: Prompt MUST NOT contain solution/answer data
    const forbiddenKeys = ['accepted', 'answer', 'correct', 'solution', 'correctIndex'];
    const keys = Object.keys(obj);
    return !keys.some((k) => forbiddenKeys.includes(k.toLowerCase()));
  },
  { message: 'Prompt object must never leak answer or solution keys!' }
);

export const answerDefinitionSchema = z.object({
  accepted: z.array(z.string()).min(1),
  matchMode: z.enum(['EXACT', 'CASE_INSENSITIVE', 'NORMALIZED']).default('CASE_INSENSITIVE'),
});

export const feedbackDefinitionSchema = z.object({
  explanation: z.string().min(1),
  ruleRef: z.string().optional(),
});

export const itemSchema = z.object({
  code: z.string().min(3),
  familyCode: z.string().min(3),
  familyConstruct: z.string().min(5),
  purpose: itemPurposeSchema,
  evidenceEligibility: evidenceEligibilitySchema,
  responseType: responseTypeSchema,
  prompt: promptSchema,
  answerDefinition: answerDefinitionSchema,
  feedbackDefinition: feedbackDefinitionSchema,
  supportPolicy: supportPolicySchema,
  claim: z.string().min(2),
  modality: modalitySchema,
});

export const activitySchema = z.object({
  code: z.string().min(3),
  activityType: activityTypeSchema,
  title: z.string().min(2),
  position: z.number().int().positive(),
  content: z.object({
    body: z.string().optional(),
    instruction: z.string().optional(),
    opportunityType: opportunityTypeSchema,
    modality: modalitySchema,
    reviewStatus: z.literal('DRAFT'),
  }).passthrough(),
  items: z.array(itemSchema).optional().default([]),
});

export const competencySchema = z.object({
  code: z.string().min(3),
  title: z.string().min(3),
  description: z.string().min(5),
  role: z.enum(['TARGET', 'PREREQUISITE', 'SUPPORTING']).default('TARGET'),
  targetModality: modalitySchema,
});

export const lessonManifestSchema = z.object({
  day: z.number().int().min(1).max(28),
  lessonCode: z.string().min(3),
  unitCode: z.string().min(3),
  title: z.string().min(3),
  summary: z.string().min(5),
  position: z.number().int().positive(),
  competencies: z.array(competencySchema).min(1),
  packageCode: z.string().min(3),
  activities: z.array(activitySchema).min(1),
});

export type LessonManifest = z.infer<typeof lessonManifestSchema>;
export type ItemManifest = z.infer<typeof itemSchema>;
export type ActivityManifest = z.infer<typeof activitySchema>;
export type CompetencyManifest = z.infer<typeof competencySchema>;
