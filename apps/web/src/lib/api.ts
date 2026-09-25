import { lessonResponseSchema, meResponseSchema, type LessonDto, type MeResponseDto, type UpdateProfileDto } from '@lingora/contracts';
import { attemptSchema, dashboardSchema, goalSchema, type AttemptDto, type DashboardDto, type GoalDto, type GoalInputDto } from '@lingora/contracts';

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
