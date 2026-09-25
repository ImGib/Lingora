import { Inject, Injectable } from '@nestjs/common';
import type { LessonDto } from '@lingora/contracts';
import type { Pool } from 'pg';
import type { CurriculumRepository } from '../../application/curriculum/curriculum-repository.port.js';
import { DATABASE_POOL } from './database.module.js';

type LessonRow = {
  id: string; code: string; title: string; summary: string;
  package_version_id: string; package_version: number;
};
type ActivityRow = {
  id: string; code: string; activity_type: LessonDto['activities'][number]['type'];
  title: string; position: number; content: Record<string, unknown>;
};
type ItemRow = {
  activity_id: string; item_id: string; version_id: string;
  response_type: 'SINGLE_CHOICE' | 'SHORT_TEXT';
  prompt: Record<string, unknown>; support_policy: Record<string, unknown>;
};

@Injectable()
export class PostgresCurriculumRepository implements CurriculumRepository {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async getPublishedLesson(lessonId: string): Promise<LessonDto | null> {
    const lessonResult = await this.pool.query<LessonRow>(
      `SELECT l.id, l.code, l.title, l.summary,
              lpv.id AS package_version_id, lpv.version AS package_version
       FROM lessons l
       JOIN learning_packages lp ON lp.lesson_id = l.id
       JOIN learning_package_versions lpv ON lpv.learning_package_id = lp.id
       WHERE l.id = $1 AND l.status = 'PUBLISHED' AND lpv.status = 'PUBLISHED'
       ORDER BY lpv.version DESC LIMIT 1`,
      [lessonId],
    );
    const lesson = lessonResult.rows[0];
    if (!lesson) return null;

    const [activitiesResult, itemsResult] = await Promise.all([
      this.pool.query<ActivityRow>(
        `SELECT id, code, activity_type, title, position, content
         FROM activities WHERE learning_package_version_id = $1 ORDER BY position`,
        [lesson.package_version_id],
      ),
      this.pool.query<ItemRow>(
        `SELECT ai.activity_id, li.id AS item_id, liv.id AS version_id,
                liv.response_type, liv.prompt, liv.support_policy
         FROM activity_items ai
         JOIN learning_item_versions liv ON liv.id = ai.learning_item_version_id
         JOIN learning_items li ON li.id = liv.learning_item_id
         JOIN activities a ON a.id = ai.activity_id
         WHERE a.learning_package_version_id = $1
           AND liv.status = 'PUBLISHED' AND liv.purpose <> 'BENCHMARK'
         ORDER BY ai.activity_id, ai.position`,
        [lesson.package_version_id],
      ),
    ]);

    return {
      id: lesson.id,
      code: lesson.code,
      title: lesson.title,
      summary: lesson.summary,
      packageVersionId: lesson.package_version_id,
      packageVersion: lesson.package_version,
      activities: activitiesResult.rows.map((activity) => ({
        id: activity.id,
        code: activity.code,
        type: activity.activity_type,
        title: activity.title,
        position: activity.position,
        content: activity.content,
        items: itemsResult.rows
          .filter((item) => item.activity_id === activity.id)
          .map((item) => ({
            id: item.item_id,
            versionId: item.version_id,
            responseType: item.response_type,
            prompt: item.prompt,
            supportPolicy: { hintAllowed: item.support_policy.hintAllowed === true },
          })),
      })),
    };
  }
}
