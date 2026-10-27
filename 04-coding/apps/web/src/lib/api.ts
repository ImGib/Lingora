import {
  lessonExposureSchema,
  lessonResponseSchema,
  meResponseSchema,
  type LessonDto,
  type LessonExposureDto,
  type MeResponseDto,
  type UpdateProfileDto,
  attemptSchema,
  dashboardSchema,
  goalSchema,
  type AttemptDto,
  type DashboardDto,
  type GoalDto,
  type GoalInputDto,
  placementSchema,
  type PlacementDto,
  learnerArtifactSchema,
  type CreateArtifactDto,
  type LearnerArtifactDto,
  type LearnerContentReportDto,
  roadmapWorldsListSchema,
  type RoadmapWorldDto,
  ipaPhonemesListSchema,
  type IpaPhonemeDto,
  grammarTopicsListSchema,
  type GrammarTopicDto,
  grammarQuizzesListSchema,
  type GrammarQuizDto,
  growthStagesListSchema,
  type GrowthStageDto,
} from '@lingora/contracts';

function apiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL;
  if (!value) throw new Error('NEXT_PUBLIC_API_URL is required');
  return value.replace(/\/$/, '');
}

async function requestMe(token: string, init?: RequestInit): Promise<MeResponseDto> {
  const response = await fetch(`${apiUrl()}/v1/me${init?.method === 'PATCH' ? '/profile' : ''}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(response.status === 401 ? 'Please sign in again.' : 'Profile service unavailable.');
  return meResponseSchema.parse(await response.json());
}

export function getMe(token: string): Promise<MeResponseDto> {
  return requestMe(token);
}

export function updateProfile(token: string, patch: UpdateProfileDto): Promise<MeResponseDto> {
  return requestMe(token, { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function getLesson(token: string, lessonId: string): Promise<LessonDto> {
  const response = await fetch(`${apiUrl()}/v1/lessons/${encodeURIComponent(lessonId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(response.status === 404 ? 'Lesson unavailable.' : 'Unable to load lesson.');
  return lessonResponseSchema.parse(await response.json()).data;
}

export async function getLessonExposure(token: string, lessonId: string): Promise<LessonExposureDto> {
  return lessonExposureSchema.parse(await apiData(token, `/v1/lessons/${lessonId}/exposure`));
}
export async function completeLessonExposure(token: string, lessonId: string): Promise<LessonExposureDto> {
  return lessonExposureSchema.parse(await apiData(token, `/v1/lessons/${lessonId}/exposure/complete`, { method: 'POST' }));
}

async function apiData(token: string, path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${apiUrl()}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init?.headers },
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    const error = payload as { error?: { message?: string } };
    throw new Error(error.error?.message ?? 'Request failed. Please try again.');
  }
  return (payload as { data: unknown }).data;
}

async function publicApiData(path: string): Promise<unknown> {
  const response = await fetch(`${apiUrl()}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    const error = payload as { error?: { message?: string } };
    throw new Error(error.error?.message ?? 'Request failed. Please try again.');
  }
  return (payload as { data: unknown }).data;
}

export async function getDashboard(token: string): Promise<DashboardDto> {
  return dashboardSchema.parse(await apiData(token, '/v1/dashboard'));
}
export async function createGoal(token: string, input: GoalInputDto): Promise<GoalDto> {
  return goalSchema.parse(await apiData(token, '/v1/goals', { method: 'POST', body: JSON.stringify(input) }));
}
export async function generatePlan(token: string): Promise<void> {
  await apiData(token, '/v1/plans/today/generate', { method: 'POST' });
}
export async function overrideBlock(token: string, blockId: string, action: 'skip' | 'defer' | 'replace' | 'explore'): Promise<DashboardDto> {
  return dashboardSchema.parse(await apiData(token, `/v1/plans/blocks/${blockId}/override`,
    { method: 'POST', body: JSON.stringify({ action }) }));
}
export async function completeBreak(token: string, blockId: string): Promise<DashboardDto> {
  return dashboardSchema.parse(await apiData(token, `/v1/plans/blocks/${blockId}/complete`, { method: 'POST' }));
}
export async function transitionSession(token: string, sessionId: string, action: 'pause' | 'resume' | 'complete'): Promise<void> {
  await apiData(token, `/v1/sessions/${sessionId}/${action}`, { method: 'POST' });
}
export async function startAttempt(token: string, lessonId: string): Promise<AttemptDto> {
  return attemptSchema.parse(await apiData(token, '/v1/attempts', { method: 'POST', body: JSON.stringify({ lessonId }) }));
}
export async function getAttempt(token: string, attemptId: string): Promise<AttemptDto> {
  return attemptSchema.parse(await apiData(token, `/v1/attempts/${attemptId}`));
}
export async function saveResponse(token: string, attemptId: string, itemId: string, value: string): Promise<void> {
  await apiData(token, `/v1/attempts/${attemptId}/responses/${itemId}`, { method: 'PUT', body: JSON.stringify({ value }) });
}
export async function revealHint(token: string, attemptId: string, itemId: string): Promise<string> {
  const data = await apiData(token, `/v1/attempts/${attemptId}/items/${itemId}/hint`, { method: 'POST' });
  return (data as { hint: string }).hint;
}
export async function submitAttempt(token: string, attemptId: string, key: string): Promise<AttemptDto['feedback']> {
  const data = await apiData(token, `/v1/attempts/${attemptId}/submit`, { method: 'POST', headers: { 'Idempotency-Key': key } });
  return (data as { feedback: AttemptDto['feedback'] }).feedback;
}

export async function getCurrentPlacement(token: string): Promise<PlacementDto | null> {
  const data = await apiData(token, '/v1/placements');
  return data === null ? null : placementSchema.parse(data);
}
export async function startPlacement(token: string, mode: 'START' | 'SKIP', key: string): Promise<PlacementDto> {
  return placementSchema.parse(await apiData(token, '/v1/placements', {
    method: 'POST', headers: { 'Idempotency-Key': key }, body: JSON.stringify({ mode }),
  }));
}
export async function savePlacementResponse(token: string, placementId: string, itemId: string, value: string): Promise<PlacementDto> {
  return placementSchema.parse(await apiData(token, `/v1/placements/${placementId}/responses`, {
    method: 'POST', body: JSON.stringify({ itemId, value }),
  }));
}
export async function completePlacement(token: string, placementId: string): Promise<PlacementDto> {
  return placementSchema.parse(await apiData(token, `/v1/placements/${placementId}/complete`, { method: 'POST' }));
}

export async function createArtifact(token: string, dto: CreateArtifactDto): Promise<LearnerArtifactDto> {
  return learnerArtifactSchema.parse(await apiData(token, '/v1/artifacts', { method: 'POST', body: JSON.stringify(dto) }));
}

export async function getLatestArtifactForActivity(token: string, activityId: string): Promise<LearnerArtifactDto | null> {
  const data = await apiData(token, `/v1/artifacts/${activityId}`);
  return data ? learnerArtifactSchema.parse(data) : null;
}

export async function deleteArtifact(token: string, artifactId: string): Promise<void> {
  await apiData(token, `/v1/artifacts/${artifactId}`, { method: 'DELETE' });
}

export async function reportContentIssue(token: string, dto: LearnerContentReportDto): Promise<{ reported: boolean; id: string }> {
  return (await apiData(token, '/v1/curriculum/reports', { method: 'POST', body: JSON.stringify(dto) })) as { reported: boolean; id: string };
}

// Public Curriculum & Reference Data Endpoints
export async function getRoadmap(): Promise<RoadmapWorldDto[]> {
  const data = await publicApiData('/v1/roadmap');
  return roadmapWorldsListSchema.parse(data);
}

export async function getIpaPhonemes(): Promise<IpaPhonemeDto[]> {
  const data = await publicApiData('/v1/ipa/phonemes');
  return ipaPhonemesListSchema.parse(data);
}

export async function getGrammarTopics(): Promise<GrammarTopicDto[]> {
  const data = await publicApiData('/v1/grammar/topics');
  return grammarTopicsListSchema.parse(data);
}

export async function getGrammarQuizzes(topicId?: string): Promise<GrammarQuizDto[]> {
  const path = topicId ? `/v1/grammar/quizzes?topicId=${encodeURIComponent(topicId)}` : '/v1/grammar/quizzes';
  const data = await publicApiData(path);
  return grammarQuizzesListSchema.parse(data);
}

export async function getGrowthStages(): Promise<GrowthStageDto[]> {
  const data = await publicApiData('/v1/growth-stages');
  return growthStagesListSchema.parse(data);
}
