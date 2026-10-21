import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Pool } from 'pg';
import type { CreateArtifactDto, LearnerArtifactDto } from '@lingora/contracts';
import { DATABASE_POOL } from '../../infrastructure/database/database.module.js';
import { STORAGE_PORT, type StoragePort } from '../../application/storage/storage.port.js';

type ArtifactRow = {
  id: string;
  learner_id: string;
  package_version_id: string;
  activity_id: string;
  item_version_id: string | null;
  artifact_type: 'TEXT' | 'AUDIO';
  text_content: string | null;
  audio_storage_path: string | null;
  duration_ms: number | null;
  mime_type: string | null;
  status: 'FINALIZED' | 'TECHNICAL_FALLBACK' | 'DELETED';
  fallback_reason: string | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class ArtifactsService {
  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
    @Inject(STORAGE_PORT) private readonly storage: StoragePort,
  ) {}

  async create(learnerId: string, dto: CreateArtifactDto): Promise<LearnerArtifactDto> {
    const result = await this.pool.query<ArtifactRow>(
      `INSERT INTO learner_artifacts
         (learner_id, package_version_id, activity_id, item_version_id,
          artifact_type, text_content, audio_storage_path, duration_ms,
          mime_type, status, fallback_reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        learnerId,
        dto.packageVersionId,
        dto.activityId,
        dto.itemVersionId || null,
        dto.artifactType,
        dto.textContent || null,
        dto.audioStoragePath || null,
        dto.durationMs || null,
        dto.mimeType || null,
        dto.status,
        dto.fallbackReason || null,
      ],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Failed to insert learner artifact');
    return this.mapRow(row);
  }

  async getLatestForActivity(learnerId: string, activityId: string): Promise<LearnerArtifactDto | null> {
    const result = await this.pool.query<ArtifactRow>(
      `SELECT * FROM learner_artifacts
       WHERE learner_id = $1 AND activity_id = $2 AND status <> 'DELETED'
       ORDER BY created_at DESC LIMIT 1`,
      [learnerId, activityId],
    );

    const row = result.rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async delete(learnerId: string, artifactId: string): Promise<void> {
    const result = await this.pool.query<ArtifactRow>(
      `UPDATE learner_artifacts
       SET status = 'DELETED', updated_at = NOW()
       WHERE id = $1 AND learner_id = $2
       RETURNING *`,
      [artifactId, learnerId],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Artifact not found');
    }

    // Optionally delete from storage port if audio
    if (result.rows[0].audio_storage_path) {
      try {
        await this.storage.delete({
          bucket: 'learner-audio',
          path: result.rows[0].audio_storage_path,
        });
      } catch {
        // Soft fail on external storage delete
      }
    }
  }

  private mapRow(row: ArtifactRow): LearnerArtifactDto {
    return {
      id: row.id,
      learnerId: row.learner_id,
      packageVersionId: row.package_version_id,
      activityId: row.activity_id,
      itemVersionId: row.item_version_id,
      artifactType: row.artifact_type,
      textContent: row.text_content,
      audioStoragePath: row.audio_storage_path,
      durationMs: row.duration_ms,
      mimeType: row.mime_type,
      status: row.status,
      fallbackReason: row.fallback_reason,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
