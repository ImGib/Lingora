import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import type { LessonDto } from '@lingora/contracts';
import { lessonResponseSchema } from '@lingora/contracts';
import { GetPublishedLesson } from '../src/application/curriculum/get-published-lesson.js';

const lesson: LessonDto = {
  id: '10000000-0000-4000-8000-000000000008',
  code: 'LESSON.PRESENT_SIMPLE.THIRD_PERSON',
  title: "Talk About Another Person's Routine",
  summary: 'A safe lesson.',
  packageVersionId: '30000000-0000-4000-8000-000000000002',
  packageVersion: 1,
  activities: [{
    id: '30000000-0000-4000-8000-000000000004', code: 'ACT.RECOGNIZE',
    type: 'RECOGNITION', title: 'Choose', position: 2, content: {},
    items: [{
      id: '40000000-0000-4000-8000-000000000002',
      versionId: '40000000-0000-4000-8000-000000000004',
      responseType: 'SINGLE_CHOICE', prompt: { text: 'Prompt' }, supportPolicy: {},
    }],
  }],
};

describe('Slice 01B curriculum and content', () => {
  it('returns a learner-safe published lesson contract without answer or inference internals', async () => {
    const useCase = new GetPublishedLesson({ getPublishedLesson: () => Promise.resolve(lesson) });
    const dto = await useCase.execute(lesson.id);
    const response = lessonResponseSchema.parse({
      data: dto,
      meta: { requestId: '90000000-0000-4000-8000-000000000001' },
    });
    const serialized = JSON.stringify(response);
    expect(serialized).not.toMatch(/answerDefinition|accepted|competency|learningClaim|evidenceEligibility/i);
  });

  it('creates only Slice 01B definition/content tables with RLS and no learner facts', () => {
    const path = fileURLToPath(new URL('../supabase/migrations/20260925000823_slice_01b_curriculum_competency_content.sql', import.meta.url));
    const sql = readFileSync(path, 'utf8');
    expect(sql).toContain('CREATE TABLE curriculum_versions');
    expect(sql).toContain('CREATE TABLE learning_item_versions');
    expect(sql).toContain("purpose IN ('PRACTICE', 'ASSESSMENT', 'BENCHMARK')");
    expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
    expect(sql).not.toMatch(/CREATE TABLE (attempts|responses|observations|evidence|competency_states|daily_plans|plan_blocks)/i);
  });
});
