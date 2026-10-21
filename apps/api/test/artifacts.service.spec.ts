import { describe, expect, it, vi } from 'vitest';
import type { Pool } from 'pg';
import { ArtifactsService } from '../src/modules/learning/artifacts.service.js';
import type { StoragePort } from '../src/application/storage/storage.port.js';

describe('ArtifactsService', () => {
  const learnerId = '11111111-1111-4000-8000-111111111111';
  const packageVersionId = '22222222-2222-4000-8000-222222222222';
  const activityId = '33333333-3333-4000-8000-333333333333';

  it('creates and finalizes a text artifact successfully', async () => {
    const mockRow = {
      id: '44444444-4444-4000-8000-444444444444',
      learner_id: learnerId,
      package_version_id: packageVersionId,
      activity_id: activityId,
      item_version_id: null,
      artifact_type: 'TEXT' as const,
      text_content: 'My name is Nam. I am from Vietnam.',
      audio_storage_path: null,
      duration_ms: null,
      mime_type: 'text/plain',
      status: 'FINALIZED' as const,
      fallback_reason: null,
      created_at: new Date('2026-10-21T07:00:00Z'),
      updated_at: new Date('2026-10-21T07:00:00Z'),
    };

    const mockPool = {
      query: vi.fn().mockResolvedValue({ rows: [mockRow] }),
    } as unknown as Pool;

    const mockStorage: StoragePort = {
      upload: vi.fn(),
      getSignedUrl: vi.fn(),
      delete: vi.fn(),
    };

    const service = new ArtifactsService(mockPool, mockStorage);

    const result = await service.create(learnerId, {
      packageVersionId,
      activityId,
      artifactType: 'TEXT',
      textContent: 'My name is Nam. I am from Vietnam.',
      mimeType: 'text/plain',
      status: 'FINALIZED',
    });

    expect(result.id).toBe(mockRow.id);
    expect(result.artifactType).toBe('TEXT');
    expect(result.textContent).toBe('My name is Nam. I am from Vietnam.');
    expect(result.status).toBe('FINALIZED');
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO learner_artifacts'),
      expect.arrayContaining([learnerId, packageVersionId, activityId, null, 'TEXT']),
    );
  });

  it('supports technical fallback when microphone is denied without emitting negative evidence', async () => {
    const mockRow = {
      id: '55555555-5555-4000-8000-555555555555',
      learner_id: learnerId,
      package_version_id: packageVersionId,
      activity_id: activityId,
      item_version_id: null,
      artifact_type: 'AUDIO' as const,
      text_content: 'User chose text alternative due to mic block',
      audio_storage_path: null,
      duration_ms: null,
      mime_type: null,
      status: 'TECHNICAL_FALLBACK' as const,
      fallback_reason: 'MICROPHONE_DENIED',
      created_at: new Date('2026-10-21T07:05:00Z'),
      updated_at: new Date('2026-10-21T07:05:00Z'),
    };

    const mockPool = {
      query: vi.fn().mockResolvedValue({ rows: [mockRow] }),
    } as unknown as Pool;

    const mockStorage: StoragePort = {
      upload: vi.fn(),
      getSignedUrl: vi.fn(),
      delete: vi.fn(),
    };

    const service = new ArtifactsService(mockPool, mockStorage);

    const result = await service.create(learnerId, {
      packageVersionId,
      activityId,
      artifactType: 'AUDIO',
      textContent: 'User chose text alternative due to mic block',
      status: 'TECHNICAL_FALLBACK',
      fallbackReason: 'MICROPHONE_DENIED',
    });

    expect(result.status).toBe('TECHNICAL_FALLBACK');
    expect(result.fallbackReason).toBe('MICROPHONE_DENIED');
  });

  it('marks artifact as deleted and removes binary audio from storage', async () => {
    const artifactId = '66666666-6666-4000-8000-666666666666';
    const audioPath = 'learners/1111/audio-666.webm';

    const mockPool = {
      query: vi.fn().mockResolvedValue({
        rows: [{ audio_storage_path: audioPath }],
      }),
    } as unknown as Pool;

    const mockStorage: StoragePort = {
      upload: vi.fn(),
      getSignedUrl: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    const service = new ArtifactsService(mockPool, mockStorage);

    await service.delete(learnerId, artifactId);

    expect(mockStorage.delete).toHaveBeenCalledWith({
      bucket: 'learner-audio',
      path: audioPath,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE learner_artifacts"),
      [artifactId, learnerId],
    );
  });
});
