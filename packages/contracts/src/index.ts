import { z } from 'zod';

function isIanaTimezone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return value.includes('/');
  } catch {
    return false;
  }
}

export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(80).nullable(),
  nativeLanguage: z.string().trim().min(2).max(35).nullable(),
  timezone: z.string().trim().min(1).max(100).refine(isIanaTimezone, 'Invalid IANA timezone'),
});

export const updateProfileSchema = profileSchema.partial().strict();

export const meDataSchema = z.object({
  id: z.uuid(),
  profile: profileSchema,
  onboarding: z.object({
    status: z.enum(['INCOMPLETE','READY_FOR_LEARNING']),
    nextStep: z.enum(['SET_GOAL','OPEN_TODAY_PLAN']),
  }),
});

export const meResponseSchema = z.object({
  data: meDataSchema,
  meta: z.object({ requestId: z.uuid() }),
});

export type ProfileDto = z.infer<typeof profileSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type MeDataDto = z.infer<typeof meDataSchema>;
export type MeResponseDto = z.infer<typeof meResponseSchema>;

export const lessonActivitySchema = z.object({
  id: z.uuid(),
  code: z.string(),
  type: z.enum(['INSTRUCTION', 'RECOGNITION', 'CONTROLLED_PRACTICE', 'INDEPENDENT_CHECK', 'REFLECTION']),
  title: z.string(),
  position: z.number().int().nonnegative(),
  content: z.record(z.string(), z.unknown()),
  items: z.array(
    z.object({
      id: z.uuid(),
      versionId: z.uuid(),
      responseType: z.enum(['SINGLE_CHOICE', 'SHORT_TEXT']),
      prompt: z.record(z.string(), z.unknown()),
      supportPolicy: z.record(z.string(), z.unknown()),
    }),
  ),
});

export const lessonResponseSchema = z.object({
  data: z.object({
    id: z.uuid(),
    code: z.string(),
    title: z.string(),
    summary: z.string(),
    packageVersionId: z.uuid(),
    packageVersion: z.number().int().positive(),
    activities: z.array(lessonActivitySchema),
  }),
  meta: z.object({ requestId: z.uuid() }),
});

export type LessonDto = z.infer<typeof lessonResponseSchema>['data'];

export const lessonExposureSchema = z.object({
  lessonId: z.uuid(),
  packageVersionId: z.uuid(),
  status: z.enum(['NOT_COMPLETED', 'COMPLETED']),
  completedAt: z.coerce.date().nullable(),
});
export type LessonExposureDto = z.infer<typeof lessonExposureSchema>;

export const attemptSchema = z.object({
  id: z.uuid(), lessonId: z.uuid(), packageVersionId: z.uuid(), sessionId: z.uuid().nullable(),
  status: z.enum(['IN_PROGRESS','SUBMITTED','EVALUATED']),
  items: z.array(z.object({
    id: z.uuid(), versionId: z.uuid(), responseType: z.enum(['SINGLE_CHOICE','SHORT_TEXT']),
    prompt: z.record(z.string(), z.unknown()), supportPolicy: z.object({ hintAllowed: z.boolean() }),
    response: z.string().nullable(), hintRevealed: z.boolean(),
  })),
  feedback: z.object({ items: z.array(z.object({
    itemId: z.uuid(), code: z.string(), correct: z.boolean(), explanation: z.string(),
  })) }).nullable(),
});
export type AttemptDto = z.infer<typeof attemptSchema>;

export const goalSchema = z.object({
  id: z.uuid(), goalVersion: z.number().int().positive(), targetVersion: z.number().int().positive(),
  purpose: z.enum(['IELTS_ACADEMIC','STUDY_ABROAD','GENERAL_ENGLISH']),
  targetBand: z.number().nullable(), deadline: z.string().nullable(), studyMinutesPerDay: z.number().int(),
});
export type GoalDto = z.infer<typeof goalSchema>;
export const goalInputSchema = goalSchema.pick({ purpose: true, targetBand: true, deadline: true, studyMinutesPerDay: true });
export type GoalInputDto = z.infer<typeof goalInputSchema>;

export const nextActionSchema = z.object({
  type: z.string(), target: z.record(z.string(), z.string()), reasonCodes: z.array(z.string()),
  planBlockId: z.uuid().nullable(),
  decisionTrace: z.object({ policyVersion: z.string(), goalVersion: z.number().nullable(),
    curriculumVersion: z.number(), evidenceState: z.string() }),
});
export const dashboardSchema = z.object({
  goal: goalSchema.nullable(),
  session: z.object({ id: z.uuid(), status: z.enum(['IN_PROGRESS','PAUSED']) }).nullable(),
  plan: z.object({
    id: z.uuid(), localDate: z.string(), timezone: z.string(), policyVersion: z.string(), goalId: z.uuid(),
    blocks: z.array(z.object({ id: z.uuid(), position: z.number(), type: z.enum(['LESSON','PRACTICE','BREAK']),
      lessonId: z.uuid().nullable(), status: z.enum(['PENDING','COMPLETED','SKIPPED','DEFERRED']) })),
  }).nullable(),
  competency: z.object({ label: z.string(), confidence: z.string() }),
  nextAction: nextActionSchema,
});
export type DashboardDto = z.infer<typeof dashboardSchema>;

export const placementItemSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  position: z.number().int().positive(),
  claimCode: z.string(),
  modality: z.string(),
  responseType: z.enum(['SINGLE_CHOICE', 'SHORT_TEXT']),
  prompt: z.record(z.string(), z.unknown()),
  response: z.string().nullable(),
  result: z.enum(['ALREADY_DEMONSTRATED', 'NEED_MORE_EVIDENCE']).nullable(),
});

export const placementSchema = z.object({
  id: z.uuid(),
  status: z.enum(['IN_PROGRESS', 'SKIPPED', 'COMPLETED']),
  version: z.number().int().positive(),
  policyVersion: z.string(),
  recommendedStart: z.enum(['WEEK_1_DAY_1', 'WEEK_1_DAY_2']).nullable(),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  items: z.array(placementItemSchema),
});

export type PlacementDto = z.infer<typeof placementSchema>;
