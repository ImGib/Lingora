#!/usr/bin/env node
/**
 * @file skill-scout.mjs
 * @description Ultra-fast knowledge retrieval across .agents/knowledge/, .agents/skills/ and .agents/contracts/.
 * Returns hyper-compact (<30 tokens) rule excerpts instead of loading full SKILL.md or code files.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const KNOWLEDGE_DIR = path.join(ROOT_DIR, '.agents', 'knowledge');
const SKILLS_DIR = path.join(ROOT_DIR, '.agents', 'skills');
const CONTRACTS_DIR = path.join(ROOT_DIR, '.agents', 'contracts');

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(full));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function searchKnowledge(query) {
  const q = query.toLowerCase().trim();
  const qWords = q.split(/\s+/).filter(Boolean);
  const qNorm = q.replace(/[-_]/g, ' ');

  const allFiles = [
    ...getMarkdownFiles(KNOWLEDGE_DIR),
    ...getMarkdownFiles(SKILLS_DIR),
    ...getMarkdownFiles(CONTRACTS_DIR)
  ];

  const results = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    const relFile = path.relative(ROOT_DIR, file).replace(/\\/g, '/');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLower = line.toLowerCase();
      const lineNorm = lineLower.replace(/[-_]/g, ' ');

      const isMatch = lineLower.includes(q) ||
        lineNorm.includes(qNorm) ||
        (qWords.length > 1 && qWords.every(w => lineNorm.includes(w)));

      if (isMatch) {
        // Grab context block (from closest heading or 2 lines before/after)
        let start = Math.max(0, i - 2);
        let end = Math.min(lines.length, i + 5);

        // Try to find the heading above
        for (let h = i; h >= Math.max(0, i - 12); h--) {
          if (lines[h].startsWith('#')) {
            start = h;
            break;
          }
        }

        const excerpt = lines.slice(start, end).join('\n');
        results.push({
          file: relFile,
          line: i + 1,
          excerpt,
        });

        // Skip ahead to avoid duplicate overlapping blocks
        i = end;
      }
    }
  }

  if (results.length === 0) {
    console.log(`🔍 [Knowledge Scout] No rules, invariants or facts found matching: "${query}"`);
    return;
  }

  console.log(`\n📚 [Knowledge Scout] Found ${results.length} relevant knowledge entries for "${query}":\n`);
  for (const res of results.slice(0, 5)) {
    console.log(`📍 ${res.file}#L${res.line}`);
    console.log('```markdown');
    console.log(res.excerpt);
    console.log('```\n');
  }

  if (results.length > 5) {
    console.log(`... and ${results.length - 5} more matches.`);
  }
}

const query = process.argv.slice(2).join(' ');
if (!query) {
  console.log('Usage: node .agents/scripts/skill-scout.mjs <query>');
  console.log('Examples:');
  console.log('  pnpm know "future perfect"');
  console.log('  pnpm know "minimal pairs"');
  console.log('  pnpm know "monophthongs"');
  console.log('  pnpm know "gate 1"');
  console.log('  pnpm know "Skipped"');
} else {
  searchKnowledge(query);
}
