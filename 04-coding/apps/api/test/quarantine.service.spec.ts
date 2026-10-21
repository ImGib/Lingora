import { describe, expect, it, vi } from 'vitest';
import type { Pool } from 'pg';
import { QuarantineService } from '../src/modules/curriculum/quarantine.service.js';

describe('QuarantineService', () => {
  const targetId = '11111111-1111-4000-8000-111111111111';

  it('marks a package version as QUARANTINED and records audit trail', async () => {
    const mockClient = {
      query: vi.fn()
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: targetId }] }) // UPDATE
        .mockResolvedValueOnce({ rows: [{ id: 'record-123' }] }) // INSERT audit
        .mockResolvedValueOnce(undefined), // COMMIT
      release: vi.fn(),
    };

    const mockPool = {
      connect: vi.fn().mockResolvedValue(mockClient),
    } as unknown as Pool;

    const service = new QuarantineService(mockPool);

    const result = await service.quarantine({
      targetType: 'PACKAGE_VERSION',
      targetId,
      reason: 'BROKEN_AUDIO',
      details: 'Audio stream corrupt on Day 3',
    }, 'OPERATOR_TEST');

    expect(result.quarantined).toBe(true);
    expect(result.id).toBe('record-123');
    expect(mockClient.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("UPDATE learning_package_versions"),
      [targetId],
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('records learner content report in learner_content_reports', async () => {
    const mockPool = {
      query: vi.fn().mockResolvedValue({ rows: [{ id: 'report-999' }] }),
    } as unknown as Pool;

    const service = new QuarantineService(mockPool);

    const result = await service.reportIssue('learner-123', {
      packageVersionId: targetId,
      issueCategory: 'AUDIO_UNPLAYABLE',
      comment: 'Audio button throws silence',
    });

    expect(result.reported).toBe(true);
    expect(result.id).toBe('report-999');
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO learner_content_reports'),
      expect.arrayContaining(['learner-123', targetId, null, null, 'AUDIO_UNPLAYABLE']),
    );
  });
});
