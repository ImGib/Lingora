import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool } from 'pg';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';

type ExposureRow = { lesson_id: string; package_version_id: string; completed_at: Date | null };

@Injectable()
export class LessonExposureService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async get(learnerId: string, lessonId: string) {
    const result = await this.pool.query<ExposureRow>(
      `SELECT l.id AS lesson_id,lpv.id AS package_version_id,le.completed_at
       FROM lessons l
       JOIN learning_packages lp ON lp.lesson_id = l.id
       JOIN learning_package_versions lpv ON lpv.learning_package_id = lp.id
       LEFT JOIN lesson_exposures le ON le.learner_id = $1 AND le.package_version_id = lpv.id
       WHERE l.id = $2 AND l.status = 'PUBLISHED' AND lpv.status = 'PUBLISHED'
         AND EXISTS (SELECT 1 FROM activities a WHERE a.learning_package_version_id = lpv.id)
         AND NOT EXISTS (
           SELECT 1 FROM activities a WHERE a.learning_package_version_id = lpv.id
             AND a.activity_type NOT IN ('INSTRUCTION', 'REFLECTION'))
         AND NOT EXISTS (
           SELECT 1 FROM activities a JOIN activity_items ai ON ai.activity_id = a.id
           WHERE a.learning_package_version_id = lpv.id)
       ORDER BY lpv.version DESC LIMIT 1`,
      [learnerId, lessonId],
    );
    if (!result.rows[0]) throw new NotFoundException('Published exposure lesson unavailable');
    return this.map(result.rows[0]);
  }

  async complete(learnerId: string, lessonId: string) {
    const exposure = await this.get(learnerId, lessonId);
    const completed = await this.pool.query<{ completed_at: Date }>(
      `INSERT INTO lesson_exposures (learner_id,lesson_id,package_version_id)
       SELECT $1,l.id,lpv.id FROM lessons l
       JOIN learning_packages lp ON lp.lesson_id = l.id
       JOIN learning_package_versions lpv ON lpv.learning_package_id = lp.id
       WHERE l.id = $2 AND l.status = 'PUBLISHED' AND lpv.id = $3 AND lpv.status = 'PUBLISHED'
         AND EXISTS (SELECT 1 FROM activities a WHERE a.learning_package_version_id = lpv.id)
         AND NOT EXISTS (
           SELECT 1 FROM activities a WHERE a.learning_package_version_id = lpv.id
             AND a.activity_type NOT IN ('INSTRUCTION', 'REFLECTION'))
         AND NOT EXISTS (
           SELECT 1 FROM activities a JOIN activity_items ai ON ai.activity_id = a.id
           WHERE a.learning_package_version_id = lpv.id)
       ON CONFLICT (learner_id,package_version_id)
       DO UPDATE SET completed_at = lesson_exposures.completed_at
       RETURNING completed_at`,
      [learnerId, lessonId, exposure.packageVersionId],
    );
    if (!completed.rows[0]) throw new NotFoundException('Published exposure lesson unavailable');
    return { ...exposure, status: 'COMPLETED' as const, completedAt: completed.rows[0].completed_at };
  }

  private map(row: ExposureRow) {
    return { lessonId: row.lesson_id, packageVersionId: row.package_version_id,
      status: row.completed_at ? ('COMPLETED' as const) : ('NOT_COMPLETED' as const),
      completedAt: row.completed_at };
  }
}
