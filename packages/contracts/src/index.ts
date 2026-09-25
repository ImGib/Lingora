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
    status: z.literal('INCOMPLETE'),
    nextStep: z.literal('SET_GOAL'),
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
