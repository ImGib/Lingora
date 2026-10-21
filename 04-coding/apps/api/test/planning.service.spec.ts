import { describe, expect, it, vi } from 'vitest';
import type { Pool } from 'pg';
import { PlanningService } from '../src/modules/planning/planning.service.js';

describe('PlanningService M1 increment', () => {
  const learnerId = '11111111-1111-4000-8000-111111111111';
  const planId = '22222222-2222-4000-8000-222222222222';
  const goalId = '33333333-3333-4000-8000-333333333333';

  it('generates a 2-block minimum viable day when learner chose <= 15 minutes', async () => {
    const mockGoal = {
      id: goalId,
      version: 1,
      purpose: 'GENERAL_ENGLISH',
      target_band: null,
      deadline: null,
      study_minutes_per_day: 15,
      status: 'ACTIVE',
    };

    const mockClient = {
      query: vi.fn()
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: planId, local_date: '2026-10-21', timezone: 'Asia/Ho_Chi_Minh', policy_version: 'PLAN_01_V1', goal_id: goalId }] }) // INSERT daily_plans
        .mockResolvedValueOnce({ rows: [{ id: 'lesson-1' }] }) // SELECT nextLesson
        .mockResolvedValueOnce({ rowCount: 2 }) // INSERT plan_blocks (minimum viable)
        .mockResolvedValueOnce(undefined), // COMMIT
      release: vi.fn(),
    };

    const mockPool = {
      query: vi.fn()
        .mockResolvedValueOnce({ rows: [mockGoal] }) // getGoal
        .mockResolvedValueOnce({ rows: [{ timezone: 'Asia/Ho_Chi_Minh' }] }) // get profile
        .mockResolvedValueOnce({ rows: [{ id: planId, local_date: '2026-10-21', timezone: 'Asia/Ho_Chi_Minh', policy_version: 'PLAN_01_V1', goal_id: goalId }] }) // getToday plan
        .mockResolvedValueOnce({
          rows: [
            { id: 'b1', position: 1, block_type: 'LESSON', lesson_id: 'lesson-1', status: 'PENDING', due_at: null, estimated_minutes: 10 },
            { id: 'b2', position: 2, block_type: 'BREAK', lesson_id: null, status: 'PENDING', due_at: null, estimated_minutes: 5 },
          ],
        }), // getToday blocks
      connect: vi.fn().mockResolvedValue(mockClient),
    } as unknown as Pool;

    const service = new PlanningService(mockPool);

    const plan = await service.generate(learnerId);

    expect(plan).not.toBeNull();
    expect(plan?.blocks).toHaveLength(2);
    expect(plan?.blocks[0]?.type).toBe('LESSON');
    expect(plan?.blocks[0]?.estimatedMinutes).toBe(10);
    expect(plan?.blocks[1]?.type).toBe('BREAK');
    expect(plan?.blocks[1]?.estimatedMinutes).toBe(5);

    // Verify minimum viable insertion in transaction client
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining("VALUES\n             ($1,1,'LESSON',$2,'PENDING',10),($1,2,'BREAK',NULL,'PENDING',5)"),
      expect.any(Array),
    );
  });

  it('generates a 3-block normal day when study minutes > 15', async () => {
    const mockGoal = {
      id: goalId,
      version: 1,
      purpose: 'IELTS_ACADEMIC',
      target_band: '6.5',
      deadline: '2026-12-31',
      study_minutes_per_day: 30,
      status: 'ACTIVE',
    };

    const mockClient = {
      query: vi.fn()
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: planId, local_date: '2026-10-21', timezone: 'Asia/Ho_Chi_Minh', policy_version: 'PLAN_01_V1', goal_id: goalId }] })
        .mockResolvedValueOnce({ rows: [{ id: 'lesson-1' }] })
        .mockResolvedValueOnce({ rowCount: 3 })
        .mockResolvedValueOnce(undefined), // COMMIT
      release: vi.fn(),
    };

    const mockPool = {
      query: vi.fn()
        .mockResolvedValueOnce({ rows: [mockGoal] })
        .mockResolvedValueOnce({ rows: [{ timezone: 'Asia/Ho_Chi_Minh' }] })
        .mockResolvedValueOnce({ rows: [{ id: planId, local_date: '2026-10-21', timezone: 'Asia/Ho_Chi_Minh', policy_version: 'PLAN_01_V1', goal_id: goalId }] })
        .mockResolvedValueOnce({
          rows: [
            { id: 'b1', position: 1, block_type: 'LESSON', lesson_id: 'lesson-1', status: 'PENDING', due_at: null, estimated_minutes: 15 },
            { id: 'b2', position: 2, block_type: 'PRACTICE', lesson_id: 'lesson-1', status: 'PENDING', due_at: null, estimated_minutes: 15 },
            { id: 'b3', position: 3, block_type: 'BREAK', lesson_id: null, status: 'PENDING', due_at: null, estimated_minutes: 5 },
          ],
        }),
      connect: vi.fn().mockResolvedValue(mockClient),
    } as unknown as Pool;

    const service = new PlanningService(mockPool);

    const plan = await service.generate(learnerId);

    expect(plan).not.toBeNull();
    expect(plan?.blocks).toHaveLength(3);
    expect(plan?.blocks[0]?.type).toBe('LESSON');
    expect(plan?.blocks[1]?.type).toBe('PRACTICE');
    expect(plan?.blocks[2]?.type).toBe('BREAK');
  });
});
