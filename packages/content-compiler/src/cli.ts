#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validateLessonManifest } from './validator.js';
import { generateDraftMigrationSql } from './sql-generator.js';

function printHelp() {
  console.log(`
Lingora Content Compiler & Invariant Validator CLI

Usage:
  content-compiler validate <manifest.json>
  content-compiler compile <manifest.json> [--out <file.sql>]
  content-compiler compile-all <manifests-dir> [--out-dir <migrations-dir>]

Examples:
  content-compiler validate curriculum/week-1/day-1.json
  content-compiler compile curriculum/week-1/day-2.json --out apps/api/supabase/migrations/20261021000000_m1_w1_d2.sql
`);
}

function run() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  if (command === 'validate') {
    const file = args[1];
    if (!file) {
      console.error('Error: Missing file path for validation.');
      process.exit(1);
    }

    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const result = validateLessonManifest(raw);

    if (!result.valid) {
      console.error(`❌ Validation failed for ${file}:`);
      result.errors.forEach((e) => console.error(`  - [${e.path}]: ${e.message}`));
      process.exit(1);
    }

    console.log(`✅ Validation PASSED: ${file} satisfies all pedagogical and architectural invariants.`);
    process.exit(0);
  }

  if (command === 'compile') {
    const file = args[1];
    if (!file) {
      console.error('Error: Missing manifest file path.');
      process.exit(1);
    }

    const outFlagIdx = args.indexOf('--out');
    const outFile = outFlagIdx !== -1 ? args[outFlagIdx + 1] : undefined;

    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const result = validateLessonManifest(raw);

    if (!result.valid) {
      console.error(`❌ Cannot compile! Validation failed for ${file}:`);
      result.errors.forEach((e) => console.error(`  - [${e.path}]: ${e.message}`));
      process.exit(1);
    }

    const sql = generateDraftMigrationSql(result.manifest!);

    if (outFile) {
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, sql, 'utf-8');
      console.log(`✨ Successfully compiled ${file} to DRAFT migration: ${outFile}`);
    } else {
      console.log(sql);
    }
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

run();
