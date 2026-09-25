import { lessonResponseSchema, meResponseSchema, type LessonDto, type MeResponseDto, type UpdateProfileDto } from '@lingora/contracts';

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
