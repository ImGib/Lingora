import { createHash } from 'node:crypto';
import type { LessonManifest } from './schema.js';

// Deterministic UUID generator based on entity namespace and code
export function deterministicUuid(prefix: string, code: string): string {
  const hash = createHash('sha256').update(`${prefix}:${code}`).digest('hex');
  // Format as valid UUID: 8-4-4-4-12
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    '4' + hash.substring(13, 16), // version 4 style
    'a' + hash.substring(17, 20), // variant 10xx
    hash.substring(20, 32),
  ].join('-');
}

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function jsonSql(obj: unknown): string {
  return `'${escapeSql(JSON.stringify(obj))}'`;
}

export function generateDraftMigrationSql(manifest: LessonManifest): string {
  const lines: string[] = [];

  lines.push('BEGIN;\n');
  lines.push(`-- Auto-generated DRAFT migration for Day ${manifest.day}: ${manifest.title}`);
  lines.push('-- Strict Guardrail: Status is locked to DRAFT. Publication requires human review.\n');

  // 1. Lesson
  const lessonId = deterministicUuid('LESSON', manifest.lessonCode);
  const unitId = deterministicUuid('UNIT', manifest.unitCode);

  lines.push(
    `INSERT INTO lessons (id, unit_id, code, title, summary, position, status) VALUES\n` +
    `  ('${lessonId}', '${unitId}', '${escapeSql(manifest.lessonCode)}', '${escapeSql(manifest.title)}',\n` +
    `   '${escapeSql(manifest.summary)}', ${manifest.position}, 'DRAFT')\n` +
    `  ON CONFLICT (unit_id, code) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;`
  );

  // 2. Competencies & Lesson Competencies
  const competencyIdMap = new Map<string, string>();
  for (const comp of manifest.competencies) {
    const compId = deterministicUuid('COMPETENCY', comp.code);
    competencyIdMap.set(comp.code, compId);

    lines.push(
      `INSERT INTO competencies (id, code, title, description, status) VALUES\n` +
      `  ('${compId}', '${escapeSql(comp.code)}', '${escapeSql(comp.title)}',\n` +
      `   '${escapeSql(comp.description)}', 'ACTIVE')\n` +
      `  ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;`
    );

    lines.push(
      `INSERT INTO lesson_competencies (lesson_id, competency_id, role, target_modality) VALUES\n` +
      `  ('${lessonId}', '${compId}', '${comp.role}', '${comp.targetModality}')\n` +
      `  ON CONFLICT (lesson_id, competency_id, role) DO UPDATE SET target_modality = EXCLUDED.target_modality;`
    );
  }

  // 3. Learning Package & Version (Always DRAFT)
  const pkgId = deterministicUuid('PACKAGE', manifest.packageCode);
  const pkgVersionId = deterministicUuid('PACKAGE_VERSION', `${manifest.packageCode}.v1`);

  lines.push(
    `INSERT INTO learning_packages (id, lesson_id, code) VALUES\n` +
    `  ('${pkgId}', '${lessonId}', '${escapeSql(manifest.packageCode)}')\n` +
    `  ON CONFLICT (code) DO NOTHING;`
  );

  lines.push(
    `INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance) VALUES\n` +
    `  ('${pkgVersionId}', '${pkgId}', 1, 'DRAFT', 'AI_ASSISTED')\n` +
    `  ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'DRAFT';`
  );

  // 4. Activities & Items
  manifest.activities.forEach((activity) => {
    const activityId = deterministicUuid('ACTIVITY', activity.code);
    lines.push(
      `INSERT INTO activities (id, learning_package_version_id, code, activity_type, title, position, content) VALUES\n` +
      `  ('${activityId}', '${pkgVersionId}', '${escapeSql(activity.code)}', '${activity.activityType}',\n` +
      `   '${escapeSql(activity.title)}', ${activity.position}, ${jsonSql(activity.content)})\n` +
      `  ON CONFLICT (learning_package_version_id, code) DO UPDATE SET content = EXCLUDED.content;`
    );

    activity.items.forEach((item, itemIdx) => {
      const familyId = deterministicUuid('FAMILY', item.familyCode);
      const itemId = deterministicUuid('ITEM', item.code);
      const itemVersionId = deterministicUuid('ITEM_VERSION', `${item.code}.v1`);

      // Item Family
      lines.push(
        `INSERT INTO item_families (id, code, construct, exposure_policy) VALUES\n` +
        `  ('${familyId}', '${escapeSql(item.familyCode)}', '${escapeSql(item.familyConstruct)}',\n` +
        `   '{"strongEvidenceRepeatLimit":0}')\n` +
        `  ON CONFLICT (code) DO NOTHING;`
      );

      // Learning Item
      lines.push(
        `INSERT INTO learning_items (id, item_family_id, code) VALUES\n` +
        `  ('${itemId}', '${familyId}', '${escapeSql(item.code)}')\n` +
        `  ON CONFLICT (code) DO NOTHING;`
      );

      // Learning Item Version (Strict DRAFT)
      lines.push(
        `INSERT INTO learning_item_versions\n` +
        `  (id, learning_item_id, version, status, purpose, evidence_eligibility, response_type,\n` +
        `   prompt, answer_definition, feedback_definition, support_policy, provenance) VALUES\n` +
        `  ('${itemVersionId}', '${itemId}', 1, 'DRAFT', '${item.purpose}', '${item.evidenceEligibility}',\n` +
        `   '${item.responseType}', ${jsonSql(item.prompt)}, ${jsonSql(item.answerDefinition)},\n` +
        `   ${jsonSql(item.feedbackDefinition)}, ${jsonSql(item.supportPolicy)}, 'AI_ASSISTED')\n` +
        `  ON CONFLICT (learning_item_id, version) DO UPDATE SET prompt = EXCLUDED.prompt, answer_definition = EXCLUDED.answer_definition;`
      );

      // Activity Item link
      lines.push(
        `INSERT INTO activity_items (activity_id, learning_item_version_id, position) VALUES\n` +
        `  ('${activityId}', '${itemVersionId}', ${itemIdx + 1})\n` +
        `  ON CONFLICT (activity_id, learning_item_version_id) DO UPDATE SET position = EXCLUDED.position;`
      );

      // Competency mapping
      const firstComp = manifest.competencies[0];
      const targetCompId = firstComp ? competencyIdMap.get(firstComp.code) : undefined;
      if (targetCompId) {
        lines.push(
          `INSERT INTO learning_item_competencies (learning_item_version_id, competency_id, learning_claim, modality) VALUES\n` +
          `  ('${itemVersionId}', '${targetCompId}', '${escapeSql(item.claim)}', '${item.modality}')\n` +
          `  ON CONFLICT (learning_item_version_id, competency_id) DO NOTHING;`
        );
      }
    });
  });

  lines.push('\nCOMMIT;\n');
  return lines.join('\n');
}
