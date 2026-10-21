import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool } from 'pg';
import type { LearnerContentReportDto, QuarantineCommandDto } from '@lingora/contracts';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';

@Injectable()
export class QuarantineService {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async quarantine(dto: QuarantineCommandDto, operator: string = 'SYSTEM_COMMAND'): Promise<{ quarantined: boolean; id: string }> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      let found = false;
      if (dto.targetType === 'PACKAGE_VERSION') {
        const updateResult = await client.query(
          `UPDATE learning_package_versions
           SET status = 'QUARANTINED'
           WHERE id = $1
           RETURNING id`,
          [dto.targetId],
        );
        found = (updateResult.rowCount ?? 0) > 0;
      } else {
        const updateResult = await client.query(
          `UPDATE learning_item_versions
           SET status = 'QUARANTINED'
           WHERE id = $1
           RETURNING id`,
          [dto.targetId],
        );
        found = (updateResult.rowCount ?? 0) > 0;
      }

      if (!found) {
        throw new NotFoundException(`Target ${dto.targetType} with id ${dto.targetId} not found`);
      }

      const record = await client.query<{ id: string }>(
        `INSERT INTO content_quarantine_records (target_type, target_id, reason, details, quarantined_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [dto.targetType, dto.targetId, dto.reason, dto.details || null, operator],
      );

      await client.query('COMMIT');
      return { quarantined: true, id: record.rows[0]?.id ?? dto.targetId };
    } catch (err) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw err;
    } finally {
      client.release();
    }
  }

  async reportIssue(learnerId: string, dto: LearnerContentReportDto): Promise<{ reported: boolean; id: string }> {
    const result = await this.pool.query<{ id: string }>(
      `INSERT INTO learner_content_reports (learner_id, package_version_id, activity_id, item_version_id, issue_category, comment)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        learnerId,
        dto.packageVersionId,
        dto.activityId || null,
        dto.itemVersionId || null,
        dto.issueCategory,
        dto.comment || null,
      ],
    );

    return { reported: true, id: result.rows[0]?.id ?? '' };
  }
}
