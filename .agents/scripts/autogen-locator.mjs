#!/usr/bin/env node
/**
 * @file autogen-locator.mjs
 * @description Lingora Autonomous Locator & Architecture Autogen Engine.
 * Automatically scans the entire codebase upon code completion to regenerate:
 * 1. .agents/coordination/code-index.json (Symbols, Types, Functions)
 * 2. .agents/coordination/component-catalog.json (Shared Components)
 * 3. .agents/knowledge/web-architecture-autogen.md (Real-time Route & Component Tree Map)
 * Zero manual maintenance. Zero stale documentation.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const CODING_DIR = path.join(ROOT_DIR, '04-coding');
const WEB_SRC = path.join(CODING_DIR, 'apps', 'web', 'src');
const APP_DIR = path.join(WEB_SRC, 'app');

const INDEX_PATH = path.join(ROOT_DIR, '.agents', 'coordination', 'code-index.json');
const COMPONENT_CATALOG_PATH = path.join(ROOT_DIR, '.agents', 'coordination', 'component-catalog.json');
const AUTOGEN_MAP_PATH = path.join(ROOT_DIR, '.agents', 'knowledge', 'web-architecture-autogen.md');
const ARCHITECTURE_MAP_PATH = path.join(ROOT_DIR, '.agents', 'knowledge', 'web-architecture-map.md');

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', 'dist', 'coverage', '.turbo'].includes(entry.name)) {
        files.push(...getAllFiles(fullPath, exts));
      }
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * 1. Parse Exports across all workspaces
 */
function parseCodeSymbols() {
  const scanDirs = [
    path.join(CODING_DIR, 'apps', 'web', 'src'),
    path.join(CODING_DIR, 'packages', 'contracts', 'src'),
    path.join(CODING_DIR, 'packages', 'api', 'src'),
  ];

  const allFiles = scanDirs.flatMap(dir => getAllFiles(dir));
  const symbols = [];
  const routes = [];

  const compRegex = /^export\s+(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/;
  const funcRegex = /^export\s+(?:async\s+)?function\s+([a-z][A-Za-z0-9_]*)/;
  const constFuncRegex = /^export\s+const\s+([a-z][A-Za-z0-9_]*)\s*=\s*(?:async\s*)?\(/;
  const interfaceRegex = /^export\s+interface\s+([A-Za-z0-9_]+)/;
  const typeRegex = /^export\s+type\s+([A-Za-z0-9_]+)/;

  for (const file of allFiles) {
    const relativePath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    // Route tracking
    if (relativePath.includes('apps/web/src/app/')) {
      const match = relativePath.match(/apps\/web\/src\/app\/(.+?)\/(page|route)\.tsx?/);
      if (match) {
        const routePath = '/' + match[1].replace(/\/page$/, '').replace(/\[(.+?)\]/g, ':$1');
        routes.push({
          route: routePath === '/.' ? '/' : routePath,
          type: match[2] === 'route' ? 'api' : 'page',
          file: relativePath,
        });
      } else if (relativePath.endsWith('app/page.tsx')) {
        routes.push({ route: '/', type: 'page', file: relativePath });
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;

      let m = line.match(compRegex);
      if (m) {
        symbols.push({ name: m[1], kind: 'component', file: relativePath, line: lineNum });
        continue;
      }
      m = line.match(interfaceRegex);
      if (m) {
        symbols.push({ name: m[1], kind: 'interface', file: relativePath, line: lineNum });
        continue;
      }
      m = line.match(typeRegex);
      if (m) {
        symbols.push({ name: m[1], kind: 'type', file: relativePath, line: lineNum });
        continue;
      }
      m = line.match(funcRegex) || line.match(constFuncRegex);
      if (m) {
        symbols.push({ name: m[1], kind: m[1].startsWith('use') ? 'hook' : 'function', file: relativePath, line: lineNum });
      }
    }
  }

  return { allFiles, symbols, routes };
}

/**
 * 2. Deep Page Analyzer: extracts JSX trees, imports, state and auth
 */
function analyzeWebPages() {
  if (!fs.existsSync(APP_DIR)) return [];

  const pageFiles = getAllFiles(APP_DIR).filter(f => f.endsWith('page.tsx') || f.endsWith('layout.tsx'));
  const pageData = [];

  for (const file of pageFiles) {
    const relFile = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');

    // Route calculation
    let route = '/';
    const match = relFile.match(/apps\/web\/src\/app\/(.+?)\/(page|layout)\.tsx/);
    if (match) {
      route = '/' + match[1].replace(/\[\.\.\.(.+?)\]/g, '*$1').replace(/\[(.+?)\]/g, ':$1');
    }
    const isLayout = relFile.endsWith('layout.tsx');

    // Extract imports
    const customImports = [];
    const importRegex = /import\s+(?:\{([^}]+)\}|([A-Za-z0-9_]+))\s+from\s+['"](@\/[^'"]+)['"]/g;
    let m;
    while ((m = importRegex.exec(content)) !== null) {
      const importedNames = (m[1] ? m[1].split(',') : [m[2]])
        .map(s => s.trim().split(/\s+as\s+/)[0])
        .filter(s => s && /^[A-Z]/.test(s));
      customImports.push(...importedNames.map(name => ({ name, source: m[3] })));
    }

    // Extract JSX usage
    const jsxRegex = /<([A-Z][A-Za-z0-9_]*)/g;
    const jsxComponents = new Set();
    while ((m = jsxRegex.exec(content)) !== null) {
      jsxComponents.add(m[1]);
    }

    // Detect Auth & State
    const hasAuth = content.includes('auth.protect') || content.includes('currentUser') || content.includes('auth()');
    const hasState = content.includes('useState');
    const stateMatches = [...content.matchAll(/useState(?:<([^>]+)>)?\(([^)]*)\)/g)].map(st => st[1] || 'state');

    pageData.push({
      route,
      isLayout,
      file: relFile,
      auth: hasAuth ? 'Auth Protected (Clerk)' : 'Public',
      componentsUsed: Array.from(jsxComponents),
      imports: customImports,
      state: hasState ? (stateMatches.length > 0 ? stateMatches : ['local state']) : ['none'],
    });
  }

  // Sort routes logically
  return pageData.sort((a, b) => a.route.localeCompare(b.route));
}

/**
 * 3. Generate Markdown Architecture Map
 */
function generateMarkdown(pageData, symbols, allFiles) {
  const timestamp = new Date().toISOString();
  const components = symbols.filter(s => s.kind === 'component');

  let md = '# LINGORA AUTONOMOUS WEB LOCATOR & ARCHITECTURE MAP\n\n';
  md += '> **Trạng thái:** Tự động sinh (Autogenerated). Cập nhật ngay sau mỗi lần hoàn thành code.\n';
  md += '> **Thời gian cập nhật:** `' + timestamp + '`\n';
  md += '> **Tổng quan:** `' + pageData.length + '` routes/layouts | `' + components.length + '` components | `' + symbols.length + '` symbols | `' + allFiles.length + '` files\n\n';

  md += '## 1. SƠ ĐỒ CÂY TỔNG QUAN HỆ THỐNG ROUTE (SITE MAP)\n\n```text\n';
  md += 'Lingora Web Application Root (/)\n';

  const distinctRoutes = Array.from(new Set(pageData.map(p => p.route)));
  for (const r of distinctRoutes) {
    const pages = pageData.filter(p => p.route === r);
    const page = pages.find(p => !p.isLayout) || pages[0];
    const comps = page ? page.componentsUsed.slice(0, 5).join(', ') : '';
    md += '├── ' + r.padEnd(28) + ' [' + (page?.auth || 'Public') + ']\n';
    if (comps) {
      md += '│   └── Components: <' + comps + '>\n';
    }
  }
  md += '```\n\n---\n\n';

  md += '## 2. CHI TIẾT TỪNG ROUTE & CẤU TRÚC ĐỊNH VỊ\n\n';

  for (const page of pageData) {
    const typeLabel = page.isLayout ? 'LAYOUT' : 'PAGE';
    md += '### [' + typeLabel + '] `' + page.route + '`\n';
    md += '- **File nguồn:** [' + page.file + '](file:///' + path.join(ROOT_DIR, page.file).replace(/\\/g, '/') + ')\n';
    md += '- **Bảo mật:** `' + page.auth + '`\n';
    md += '- **Components được render:** ' + (page.componentsUsed.length > 0 ? page.componentsUsed.map(c => '<' + c + '>').join(', ') : '_Không có JSX custom_') + '\n';
    md += '- **Trạng thái Local State:** `' + page.state.join(', ') + '`\n';

    if (page.imports.length > 0) {
      md += '- **Mô-đun import vào trang:**\n';
      for (const imp of page.imports.slice(0, 10)) {
        md += '  - `<' + imp.name + '>` từ `' + imp.source + '`\n';
      }
      if (page.imports.length > 10) {
        md += '  - _... và ' + (page.imports.length - 10) + ' mô-đun khác_\n';
      }
    }
    md += '\n';
  }

  md += '---\n\n## 3. LỆNH TRUY XUẤT NHANH (ZERO-TOKEN RETRIEVAL)\n\n';
  md += '```bash\n';
  md += '# Xem sitemap cây tổng quan:\npnpm web tree\n\n';
  md += '# Xem cấu trúc chi tiết 1 trang:\npnpm web ipa\npnpm web roadmap\npnpm web dashboard\n\n';
  md += '# Tra cứu nơi nhúng của 1 component:\npnpm web component AudioButton\n\n';
  md += '# Làm mới định vị sau khi sửa code:\npnpm autogen\n';
  md += '```\n';

  return md;
}

/**
 * Main Autogen Execution
 */
export async function runAutogen(silent = false) {
  const startTime = Date.now();

  // Step 1: Parse code symbols
  const { allFiles, symbols, routes } = parseCodeSymbols();

  // Step 2: Save code index
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, JSON.stringify({
    version: '3.0.0',
    autogenerated_at: new Date().toISOString(),
    total_files: allFiles.length,
    total_symbols: symbols.length,
    routes,
    symbols
  }, null, 2), 'utf8');

  // Step 3: Update component catalog
  const components = symbols.filter(s => s.kind === 'component').map(c => ({
    name: c.name,
    file: c.file,
    line: c.line,
    import_path: c.file.replace(/^04-coding\/apps\/web\/src\//, '@/').replace(/\.tsx?$/, '')
  }));

  fs.writeFileSync(COMPONENT_CATALOG_PATH, JSON.stringify({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'LingoraSharedComponentsCatalog',
    autogenerated_at: new Date().toISOString(),
    total_components: components.length,
    exported_components: components
  }, null, 2), 'utf8');

  // Step 4: Analyze Web Pages
  const pageData = analyzeWebPages();

  // Step 5: Generate and write Markdown locator maps
  const mdContent = generateMarkdown(pageData, symbols, allFiles);
  fs.mkdirSync(path.dirname(AUTOGEN_MAP_PATH), { recursive: true });
  fs.writeFileSync(AUTOGEN_MAP_PATH, mdContent, 'utf8');
  fs.writeFileSync(ARCHITECTURE_MAP_PATH, mdContent, 'utf8');

  const durationMs = Date.now() - startTime;
  if (!silent) {
    console.log(`⚡ [Autogen Engine] Successfully regenerated all locator structures in ${durationMs}ms:`);
    console.log(`   ✔ Code Index: ${symbols.length} symbols -> ${INDEX_PATH}`);
    console.log(`   ✔ Component Catalog: ${components.length} components -> ${COMPONENT_CATALOG_PATH}`);
    console.log(`   ✔ Web Architecture Map: ${pageData.length} routes -> ${AUTOGEN_MAP_PATH}`);
  }
  return { durationMs, symbolsCount: symbols.length, componentsCount: components.length, routesCount: pageData.length };
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('autogen-locator.mjs')) {
  runAutogen();
}
