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
    blocks: z.array(z.object({ id: z.uuid(), position: z.number(), type: z.enum(['LESSON','PRACTICE','BREAK','REVIEW','VERIFY','TRANSFER']), dueAt: z.coerce.date().nullable().optional(), estimatedMinutes: z.number().int().optional(),
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

export const createArtifactSchema = z.object({
  packageVersionId: z.uuid(),
  activityId: z.uuid(),
  itemVersionId: z.uuid().optional(),
  artifactType: z.enum(['TEXT', 'AUDIO']),
  textContent: z.string().max(5000).optional(),
  audioStoragePath: z.string().optional(),
  durationMs: z.number().int().nonnegative().optional(),
  mimeType: z.string().max(50).optional(),
  status: z.enum(['FINALIZED', 'TECHNICAL_FALLBACK', 'DELETED']).default('FINALIZED'),
  fallbackReason: z.enum(['MICROPHONE_DENIED', 'UPLOAD_FAILED', 'CODEC_UNSUPPORTED', 'LEARNER_BYPASS']).optional(),
});

export const learnerArtifactSchema = z.object({
  id: z.uuid(),
  learnerId: z.uuid(),
  packageVersionId: z.uuid(),
  activityId: z.uuid(),
  itemVersionId: z.uuid().nullable(),
  artifactType: z.enum(['TEXT', 'AUDIO']),
  textContent: z.string().nullable(),
  audioStoragePath: z.string().nullable(),
  durationMs: z.number().int().nullable(),
  mimeType: z.string().nullable(),
  status: z.enum(['FINALIZED', 'TECHNICAL_FALLBACK', 'DELETED']),
  fallbackReason: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreateArtifactDto = z.infer<typeof createArtifactSchema>;
export type LearnerArtifactDto = z.infer<typeof learnerArtifactSchema>;

export const quarantineCommandSchema = z.object({
  targetType: z.enum(['PACKAGE_VERSION', 'ITEM_VERSION']),
  targetId: z.uuid(),
  reason: z.enum(['CONFUSING_INSTRUCTION', 'BROKEN_AUDIO', 'INCORRECT_ANSWER_KEY', 'ACCESSIBILITY_VIOLATION', 'LEARNER_REPORTED']),
  details: z.string().max(2000).optional(),
});

export const learnerContentReportSchema = z.object({
  packageVersionId: z.uuid(),
  activityId: z.uuid().optional(),
  itemVersionId: z.uuid().optional(),
  issueCategory: z.enum(['AUDIO_UNPLAYABLE', 'TYPO_ERROR', 'CONFUSING_INSTRUCTION', 'ACCESSIBILITY_BARRIER', 'OTHER']),
  comment: z.string().max(1000).optional(),
});

export type QuarantineCommandDto = z.infer<typeof quarantineCommandSchema>;
export type LearnerContentReportDto = z.infer<typeof learnerContentReportSchema>;

// Roadmap Contracts
export const roadmapLessonSchema = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string(),
  focus: z.string(),
  duration: z.string(),
  skill: z.string(),
  icon: z.string(),
  summary: z.string(),
});

export const roadmapGateSchema = z.object({
  gateNumber: z.number(),
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  criterion: z.string(),
  targetScore: z.string(),
  duration: z.string(),
  testName: z.string(),
  lessons: z.array(roadmapLessonSchema),
});

export const roadmapWorldSchema = z.object({
  worldId: z.number(),
  level: z.string(),
  title: z.string(),
  band: z.string(),
  badge: z.string(),
  duration: z.string(),
  themeColor: z.string(),
  summary: z.string(),
  outcome: z.string(),
  gates: z.array(roadmapGateSchema),
});

export type RoadmapWorldDto = z.infer<typeof roadmapWorldSchema>;

// IPA Phoneme Contracts
export const ipaPhonemeSchema = z.object({
  symbol: z.string(),
  label: z.string(),
  category: z.enum(['monophthong', 'diphthong', 'consonant']),
  subCategory: z.string().nullable().optional(),
  tag: z.string(),
  mouthDesc: z.string(),
  tongueDesc: z.string(),
  voiceDesc: z.string(),
  frontCaption: z.string(),
  sideCaption: z.string(),
  sampleWord: z.string(),
  sampleIpa: z.string(),
  sampleMeaning: z.string(),
  vietnameseTip: z.string().nullable().optional(),
  isVoiced: z.boolean().optional(),
  isLong: z.boolean().optional(),
});

export type IpaPhonemeDto = z.infer<typeof ipaPhonemeSchema>;

// Grammar Topic & Masterclass Contracts
export const grammarTopicSchema = z.object({
  id: z.string(),
  milestone: z.string(),
  category: z.string(),
  bandTarget: z.string(),
  shortDesc: z.string(),
  masterclass: z.record(z.string(), z.unknown()),
});

export type GrammarTopicDto = z.infer<typeof grammarTopicSchema>;

// Grammar Quiz Contracts
export const grammarQuizSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  title: z.string(),
  milestone: z.string(),
  mcItems: z.array(z.record(z.string(), z.unknown())),
  fillBlankItems: z.array(z.record(z.string(), z.unknown())),
});

export type GrammarQuizDto = z.infer<typeof grammarQuizSchema>;

// Growth Stages Contracts
export const growthStageSchema = z.object({
  id: z.number(),
  name: z.string(),
  dayTag: z.string(),
  icon: z.string(),
  kicker: z.string(),
  focus: z.string(),
  desc: z.string(),
});

export type GrowthStageDto = z.infer<typeof growthStageSchema>;

export const roadmapWorldsListSchema = z.array(roadmapWorldSchema);
export const ipaPhonemesListSchema = z.array(ipaPhonemeSchema);
export const grammarTopicsListSchema = z.array(grammarTopicSchema);
export const grammarQuizzesListSchema = z.array(grammarQuizSchema);
export const growthStagesListSchema = z.array(growthStageSchema);
export { z };
