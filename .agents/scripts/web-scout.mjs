#!/usr/bin/env node
/**
 * @file web-scout.mjs
 * @description Ultra-fast Web Architecture & Component Hierarchy Explorer.
 * Allows AI agents to query route trees, component hierarchies, state flows,
 * and layout invariants in <40 tokens without reading JSX/CSS files.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const WEB_MAP_PATH = path.join(ROOT_DIR, '.agents', 'knowledge', 'web-architecture-map.md');

function showSiteTree() {
  console.log(`
🌐 LINGORA NEXT.JS WEB ARCHITECTURE TREE (SITE MAP)
======================================================
/ (Landing Page)
  ├── HeaderNav (Public)
  ├── 4 Pillar Cards (IPA, Roadmap, Grammar, Acoustic)
  └── Footer

/roadmap (Lộ Trình 4 Mốc IELTS)
  ├── MilestoneWorldSidebar [A1, A2, B1, B2]
  └── LevelRoadContainer
      ├── RoadLessonList (Sequential RoadLessonCards)
      └── GateAssessmentCard (100% Mastery Required)

/lab/ipa (Phòng Lab Khẩu Hình IPA)
  ├── QuickNavRibbon (Monophthongs / Diphthongs / Consonants)
  ├── PhonemesGrid (44 PhonemeChips)
  └── IpaMouthStudio [STICKY]
      ├── Front View SVG (Lips & Teeth)
      ├── Side View SVG (Tongue & Airflow)
      ├── HTML External Labels (No SVG text)
      └── AudioButton (1.0x & 0.75x)

/lab/grammar (Thư Viện Masterclass Ngữ Pháp)
  ├── Filter & Search Section (32 Topics, 14 Tenses)
  ├── TopicsGrid
  └── GrammarMasterclass (Standard 6-Part Viewer)

/dashboard (Bảng Điều Khiển Học Viên) [AUTH PROTECTED]
  ├── WelcomeBanner
  ├── TodayActionCard (Next Best Action)
  ├── PracticeHistoryList
  ├── StudyRhythmCard
  └── QuickActionsCard (Width: 380px)

/lessons/:lessonId (Trình Chạy Bài Học Micro-learning)
  ├── StepProgressBar
  ├── MultipleChoiceCard / FillBlankCard / SpeechRecorderCard
  └── ActionFooter (Skip != Failed, Hint support)

/prototype (Phòng Thử Nghiệm Mô Phỏng Lỗi QA)
  └── ModalFaultSimulation (mic_denied, audio_error, network_drop)
======================================================
💡 Tip: Run \`pnpm web <page_name>\` (e.g. \`pnpm web ipa\`) for full state & component breakdown.
`);
}

function searchRoute(query) {
  if (!fs.existsSync(WEB_MAP_PATH)) {
    console.log('❌ Web architecture map not found at:', WEB_MAP_PATH);
    return;
  }

  const content = fs.readFileSync(WEB_MAP_PATH, 'utf8');
  const sections = content.split(/\n(?=### ROUTE )/);

  const q = query.toLowerCase().trim();

  // Check if user asked for tree or routes
  if (q === 'tree' || q === 'routes' || q === 'all') {
    showSiteTree();
    return;
  }

  const matches = sections.filter(sec => {
    const header = sec.split('\n')[0].toLowerCase();
    const body = sec.toLowerCase();
    return header.includes(q) || body.includes(q);
  });

  if (matches.length === 0) {
    console.log(`🔍 [Web Scout] No route found matching: "${query}"`);
    console.log('Available routes: landing (/), roadmap, ipa, grammar, dashboard, lessons, prototype');
    return;
  }

  console.log(`\n🗺️ [Web Scout] Found ${matches.length} matching route architecture(s) for "${query}":\n`);
  for (const m of matches) {
    console.log('```text');
    console.log(m.trim());
    console.log('```\n');
  }
}

function searchComponentUsage(componentName) {
  const indexFile = path.join(ROOT_DIR, '.agents', 'coordination', 'code-index.json');
  if (!fs.existsSync(indexFile)) {
    console.log('❌ Code index not found. Run `pnpm scout:index` first.');
    return;
  }

  const raw = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  const comp = raw.symbols.find(s => s.name.toLowerCase() === componentName.toLowerCase());

  if (!comp) {
    console.log(`❌ Component "${componentName}" not found in code index.`);
    return;
  }

  console.log(`\n🧩 [Component Usage] ${comp.name}`);
  console.log(`   Defined at: ${comp.file}#L${comp.line}`);

  // Find references in 04-coding/apps/web/src
  const webSrc = path.join(ROOT_DIR, '04-coding', 'apps', 'web', 'src');
  function findUsages(dir) {
    let usages = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (item.name !== 'node_modules' && item.name !== '.next') {
          usages.push(...findUsages(full));
        }
      } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
        const text = fs.readFileSync(full, 'utf8');
        if (text.includes(`<${comp.name}`) || text.includes(`import { ${comp.name}`)) {
          const rel = path.relative(ROOT_DIR, full).replace(/\\/g, '/');
          if (rel !== comp.file) {
            usages.push(rel);
          }
        }
      }
    }
    return usages;
  }

  const usages = findUsages(webSrc);
  console.log(`   Imported & Rendered by (${usages.length} locations):`);
  for (const u of usages) {
    console.log(`     ↳ ${u}`);
  }
  console.log('');
}

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  showSiteTree();
} else if (command === 'component' || command === 'comp') {
  searchComponentUsage(args[1] || '');
} else {
  searchRoute(args.join(' '));
}
