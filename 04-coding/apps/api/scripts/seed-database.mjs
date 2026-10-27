import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import ts from 'typescript';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing.');
  process.exit(1);
}

const url = new URL(process.env.DATABASE_URL);
if (url.searchParams.get('sslmode') === 'require') {
  url.searchParams.set('uselibpqcompat', 'true');
}

const pool = new pg.Pool({ connectionString: url.toString() });

function extractAndImportData(filePath, pattern) {
  let code = fs.readFileSync(filePath, 'utf8');
  let dataCode = '';
  if (pattern) {
    const match = code.match(pattern);
    if (!match) throw new Error(`Pattern not matched in ${filePath}`);
    dataCode = 'export const data = ' + match[1];
  } else {
    code = code.replace(/import\s+type\s+[\s\S]*?;/g, '');
    code = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];/g, '');
    dataCode = code;
  }
  const transpiled = ts.transpileModule(dataCode, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import('data:text/javascript,' + encodeURIComponent(transpiled));
}

async function seed() {
  console.log('⚡ [Lingora Database Seed] Starting database content synchronization...');

  // 1. Seed Module & Unit for Week 1 (if missing)
  console.log('Step 1: Synchronizing Curriculum Module & Unit for Milestone 1...');
  const stageTrackId = '10000000-0000-4000-8000-000000000005';
  const moduleId = '3b8e230d-60e9-4181-a185-101b92f711fb';
  const unitId = '3b8e230d-60e9-4181-a185-101b92f711fc';

  await pool.query(`
    INSERT INTO modules (id, stage_track_id, code, title, position)
    VALUES ($1, $2, 'MODULE.M1.INTRODUCTIONS', 'Me and My English', 2)
    ON CONFLICT (stage_track_id, code) DO UPDATE SET title = EXCLUDED.title;
  `, [moduleId, stageTrackId]);

  // Retrieve actual module ID in case of existing position/code
  const modRes = await pool.query(`SELECT id FROM modules WHERE code = 'MODULE.M1.INTRODUCTIONS' OR id = $1 LIMIT 1`, [moduleId]);
  const actualModuleId = modRes.rows[0]?.id || moduleId;

  await pool.query(`
    INSERT INTO units (id, module_id, code, title, position)
    VALUES ($1, $2, 'UNIT.M1.INTRODUCTIONS', 'Introductions & Basic Identity', 1)
    ON CONFLICT (module_id, code) DO UPDATE SET title = EXCLUDED.title;
  `, [unitId, actualModuleId]);
  console.log('✔ Milestone 1 Module & Unit ready.');

  // 2. Apply Curriculum Migrations for Days 1 to 7 (Publishing them)
  console.log('Step 2: Publishing Day 1 to Day 7 Curriculum Lessons...');
  const migrationsDir = '04-coding/apps/api/supabase/migrations';
  const dayFiles = [
    '20261020154721_m1_week1_day1_draft_content.sql',
    '20261020155801_m1_week1_day2_draft_content.sql',
    '20261021000000_m1_week1_day3_draft_content.sql',
    '20261021000001_m1_week1_day4_draft_content.sql',
    '20261021000002_m1_week1_day5_draft_content.sql',
    '20261021000003_m1_week1_day6_draft_content.sql',
    '20261021000004_m1_week1_day7_draft_content.sql',
  ];

  for (const f of dayFiles) {
    const fullPath = path.join(migrationsDir, f);
    if (fs.existsSync(fullPath)) {
      let sql = fs.readFileSync(fullPath, 'utf8');

      // 1. Lessons: fix ON CONFLICT and status
      sql = sql.replace(/'DRAFT'\)/g, "'PUBLISHED')");
      sql = sql.replace(/(INSERT INTO lessons[\s\S]*?)ON CONFLICT \(code\)/g, '$1ON CONFLICT (unit_id, code)');

      // 2. Lesson competencies: fix conflict target
      sql = sql.replace(/ON CONFLICT \(lesson_id, competency_id\) DO UPDATE SET role = EXCLUDED\.role/g, 'ON CONFLICT (lesson_id, competency_id, role) DO UPDATE SET target_modality = EXCLUDED.target_modality');

      // 3. Learning package versions: add published_at for PUBLISHED constraint
      sql = sql.replace(/INSERT INTO learning_package_versions \(id, learning_package_id, version, status, provenance\)/g,
        'INSERT INTO learning_package_versions (id, learning_package_id, version, status, provenance, published_at)');
      sql = sql.replace(/'DRAFT', 'AI_ASSISTED'\)/g, "'PUBLISHED', 'AI_ASSISTED', now())");
      sql = sql.replace(/ON CONFLICT \(learning_package_id, version\) DO UPDATE SET status = 'DRAFT'/g,
        "ON CONFLICT (learning_package_id, version) DO UPDATE SET status = 'PUBLISHED', published_at = now()");

      // 4. Learning item versions: add published_at for PUBLISHED constraint & normalize enums
      sql = sql.replace(/INSERT INTO learning_item_versions\s+\(id, learning_item_id, version, status, purpose/g,
        'INSERT INTO learning_item_versions (id, learning_item_id, version, status, published_at, purpose');
      sql = sql.replace(/1, 'DRAFT',/g, "1, 'PUBLISHED', now(),");
      sql = sql.replace(/'EVALUATION'/g, "'ASSESSMENT'");
      sql = sql.replace(/'INDEPENDENT'/g, "'SUMMATIVE'");
      sql = sql.replace(/'TRANSFER'/g, "'SUMMATIVE'");
      // 5. Learning item competencies: fix conflict
      sql = sql.replace(/ON CONFLICT \(learning_item_version_id, competency_id\) DO NOTHING/g, 'ON CONFLICT DO NOTHING');

      try {
        await pool.query(sql);
        console.log(`  ✔ Applied & Published: ${f}`);
      } catch (sqlErr) {
        console.error(`Migration error in ${f}:`, sqlErr.message);
        throw sqlErr;
      }
    }
  }

  // Also apply exposure progress, artifacts, planner and quarantine migrations if present
  const helperMigrations = [
    '20261020155214_m1_exposure_progress.sql',
    '20261021000005_m1_learner_artifacts.sql',
    '20261021000006_m1_planner_due_and_block_types.sql',
    '20261021000007_m1_quarantine_audit.sql',
  ];
  for (const f of helperMigrations) {
    const fullPath = path.join(migrationsDir, f);
    if (fs.existsSync(fullPath)) {
      const sql = fs.readFileSync(fullPath, 'utf8');
      try {
        await pool.query(sql);
        console.log(`  ✔ Applied helper migration: ${f}`);
      } catch (e) {
        console.log(`  (Note on ${f}: ${e.message.split('\n')[0]})`);
      }
    }
  }

  // 3. Seed Roadmap Worlds (4 Worlds, 8 Gates, 32 Lessons)
  console.log('Step 3: Seeding Roadmap Worlds...');
  const roadmapMod = await extractAndImportData(
    '04-coding/apps/web/src/components/roadmap/roadmap-interactive-view.tsx',
    /export const WORLDS_DATA: WorldSpec\[\] = (\[[\s\S]*?\n\];)/
  );
  const worldsData = roadmapMod.data;
  for (const w of worldsData) {
    await pool.query(`
      INSERT INTO roadmap_worlds
        (world_id, level, title, band, badge, duration, theme_color, summary, outcome, gates, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
      ON CONFLICT (world_id) DO UPDATE SET
        level = EXCLUDED.level,
        title = EXCLUDED.title,
        band = EXCLUDED.band,
        badge = EXCLUDED.badge,
        duration = EXCLUDED.duration,
        theme_color = EXCLUDED.theme_color,
        summary = EXCLUDED.summary,
        outcome = EXCLUDED.outcome,
        gates = EXCLUDED.gates,
        updated_at = now();
    `, [
      w.worldId, w.level, w.title, w.band, w.badge,
      w.duration, w.themeColor, w.summary, w.outcome,
      JSON.stringify(w.gates)
    ]);
  }
  console.log(`✔ Seeded ${worldsData.length} Roadmap Worlds.`);

  // 4. Seed 44 IPA Phonemes
  console.log('Step 4: Seeding 44 IPA Phonemes...');
  const ipaMod = await extractAndImportData(
    '04-coding/apps/web/src/components/ipa/ipa-full-chart.tsx',
    /const RAW_44_IPA_PHONEMES: FullIpaSoundItem\[\] = (\[[\s\S]*?\n\];)/
  );
  let pos = 1;
  for (const p of ipaMod.data) {
    await pool.query(`
      INSERT INTO ipa_phonemes
        (symbol, label, category, sub_category, tag, mouth_desc, tongue_desc, voice_desc,
         front_caption, side_caption, sample_word, sample_ipa, sample_meaning,
         vietnamese_tip, is_voiced, is_long, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (symbol) DO UPDATE SET
        label = EXCLUDED.label,
        category = EXCLUDED.category,
        sub_category = EXCLUDED.sub_category,
        tag = EXCLUDED.tag,
        mouth_desc = EXCLUDED.mouth_desc,
        tongue_desc = EXCLUDED.tongue_desc,
        voice_desc = EXCLUDED.voice_desc,
        front_caption = EXCLUDED.front_caption,
        side_caption = EXCLUDED.side_caption,
        sample_word = EXCLUDED.sample_word,
        sample_ipa = EXCLUDED.sample_ipa,
        sample_meaning = EXCLUDED.sample_meaning,
        vietnamese_tip = EXCLUDED.vietnamese_tip,
        is_voiced = EXCLUDED.is_voiced,
        is_long = EXCLUDED.is_long,
        position = EXCLUDED.position;
    `, [
      p.symbol, p.label, p.category, p.subCategory ?? null, p.tag,
      p.mouthDesc, p.tongueDesc, p.voiceDesc, p.frontCaption, p.sideCaption,
      p.sampleWord, p.sampleIpa, p.sampleMeaning, p.vietnameseTip ?? null,
      Boolean(p.isVoiced), Boolean(p.isLong), pos++
    ]);
  }
  console.log(`✔ Seeded ${ipaMod.data.length} IPA Phonemes.`);

  // 5. Seed Grammar Topics & Quiz Bank
  console.log('Step 5: Seeding 32 Grammar Topics & Quizzes...');
  const grammarTopicsMod = await extractAndImportData(
    '04-coding/apps/web/src/components/grammar/grammar-catalog.tsx',
    /export const GRAMMAR_TOPICS_CATALOG: GrammarTopicItem\[\] = (\[[\s\S]*?\n\];)/
  );
  const grammarTopics = grammarTopicsMod.data;
  let gPos = 1;
  for (const t of grammarTopics) {
    await pool.query(`
      INSERT INTO grammar_topics
        (id, milestone, category, band_target, short_desc, masterclass, position, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, now())
      ON CONFLICT (id) DO UPDATE SET
        milestone = EXCLUDED.milestone,
        category = EXCLUDED.category,
        band_target = EXCLUDED.band_target,
        short_desc = EXCLUDED.short_desc,
        masterclass = EXCLUDED.masterclass,
        position = EXCLUDED.position,
        updated_at = now();
    `, [
      t.id, t.milestone, t.category, t.bandTarget, t.shortDesc,
      JSON.stringify(t.masterclass), gPos++
    ]);
  }
  console.log(`✔ Seeded ${grammarTopics.length} Grammar Masterclass Topics.`);

  const quizMod = await extractAndImportData('04-coding/apps/web/src/components/grammar/grammar-quiz-bank.ts', null);
  const topicQuizBank = quizMod.TOPIC_QUIZ_BANK;
  let qCount = 0;
  for (const [topicId, questions] of Object.entries(topicQuizBank)) {
    const mcItems = questions.filter(q => q.type === 'multiple-choice');
    const fillBlankItems = questions.filter(q => q.type === 'fill-blank');
    await pool.query(`
      INSERT INTO grammar_quizzes
        (id, topic_id, title, milestone, mc_items, fill_blank_items, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        milestone = EXCLUDED.milestone,
        mc_items = EXCLUDED.mc_items,
        fill_blank_items = EXCLUDED.fill_blank_items;
    `, [
      `quiz_${topicId}`, topicId, `Luyện tập: ${topicId}`, 'MỐC 1-4',
      JSON.stringify(mcItems), JSON.stringify(fillBlankItems), qCount + 1
    ]);
    qCount += questions.length;
  }
  console.log(`✔ Seeded ${Object.keys(topicQuizBank).length} Grammar Quiz Sets (${qCount} questions).`);

  // 6. Seed Growth Stages (Tree Card)
  console.log('Step 6: Seeding 6 Growth Stages...');
  const growthMod = await extractAndImportData(
    '04-coding/apps/web/src/features/dashboard/growth-tree-card.tsx',
    /export const GROWTH_STAGES: GrowthStage\[\] = (\[[\s\S]*?\n\];)/
  );
  const growthStages = growthMod.data;
  for (const s of growthStages) {
    await pool.query(`
      INSERT INTO growth_stages
        (id, name, day_tag, icon, kicker, focus, description, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        day_tag = EXCLUDED.day_tag,
        icon = EXCLUDED.icon,
        kicker = EXCLUDED.kicker,
        focus = EXCLUDED.focus,
        description = EXCLUDED.description,
        position = EXCLUDED.position;
    `, [
      s.id, s.name, s.dayTag, s.icon, s.kicker, s.focus, s.desc, s.id
    ]);
  }
  console.log(`✔ Seeded ${growthStages.length} Growth Stages.`);

  console.log('\n🎉 ALL DATA HAS BEEN SUCCESSFULLY PUSHED TO THE DATABASE!');
}

seed()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
