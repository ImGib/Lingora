#!/usr/bin/env node
/**
 * @file code-scout.mjs
 * @description Lingora Zero-Token Code Scout & Symbol Indexer.
 * Scans all TypeScript/React source files in 04-coding/ in <200ms,
 * indexes exported components, types, functions, and routes, and provides
 * hyper-compact (<50 tokens) retrieval for AI agents and developers.
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const CODING_DIR = path.join(ROOT_DIR, '04-coding');
const INDEX_PATH = path.join(ROOT_DIR, '.agents', 'coordination', 'code-index.json');
const COMPONENT_CATALOG_PATH = path.join(ROOT_DIR, '.agents', 'coordination', 'component-catalog.json');

// Directories to scan
const SCAN_TARGETS = [
  path.join(CODING_DIR, 'apps', 'web', 'src'),
  path.join(CODING_DIR, 'packages', 'contracts', 'src'),
  path.join(CODING_DIR, 'packages', 'api', 'src'),
];

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== 'dist' && entry.name !== 'coverage') {
        files.push(...getAllFiles(fullPath, exts));
      }
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Fast AST-free regex parser for TS/TSX exports
 */
function parseFileExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');

  const symbols = [];
  const routes = [];

  // Check if App Router route
  if (relativePath.includes('apps/web/src/app/')) {
    const routeMatch = relativePath.match(/apps\/web\/src\/app\/(.+?)\/(page|route)\.tsx?/);
    if (routeMatch) {
      const routePath = '/' + routeMatch[1].replace(/\/page$/, '').replace(/\[(.+?)\]/g, ':$1');
      routes.push({
        route: routePath === '/.' ? '/' : routePath,
        type: routeMatch[2] === 'route' ? 'api' : 'page',
        file: relativePath,
      });
    } else if (relativePath.endsWith('app/page.tsx')) {
      routes.push({ route: '/', type: 'page', file: relativePath });
    }
  }

  // Regex patterns for symbols
  const componentRegex = /^export\s+(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/;
  const functionRegex = /^export\s+(?:async\s+)?function\s+([a-z][A-Za-z0-9_]*)/;
  const constFuncRegex = /^export\s+const\s+([a-z][A-Za-z0-9_]*)\s*=\s*(?:async\s*)?\(/;
  const interfaceRegex = /^export\s+interface\s+([A-Za-z0-9_]+)/;
  const typeRegex = /^export\s+type\s+([A-Za-z0-9_]+)/;
  const classRegex = /^export\s+class\s+([A-Za-z0-9_]+)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;

    let match = line.match(componentRegex);
    if (match) {
      symbols.push({
        name: match[1],
        kind: 'component',
        file: relativePath,
        line: lineNum,
        snippet: line.slice(0, 100)
      });
      continue;
    }

    match = line.match(interfaceRegex);
    if (match) {
      symbols.push({
        name: match[1],
        kind: 'interface',
        file: relativePath,
        line: lineNum,
        snippet: line.slice(0, 100)
      });
      continue;
    }

    match = line.match(typeRegex);
    if (match) {
      symbols.push({
        name: match[1],
        kind: 'type',
        file: relativePath,
        line: lineNum,
        snippet: line.slice(0, 100)
      });
      continue;
    }

    match = line.match(functionRegex) || line.match(constFuncRegex);
    if (match) {
      symbols.push({
        name: match[1],
        kind: match[1].startsWith('use') ? 'hook' : 'function',
        file: relativePath,
        line: lineNum,
        snippet: line.slice(0, 100)
      });
      continue;
    }

    match = line.match(classRegex);
    if (match) {
      symbols.push({
        name: match[1],
        kind: 'class',
        file: relativePath,
        line: lineNum,
        snippet: line.slice(0, 100)
      });
    }
  }

  return { symbols, routes };
}

/**
 * Builds the full code index and updates component catalog
 */
function buildIndex() {
  const startTime = Date.now();
  const allFiles = [];

  for (const target of SCAN_TARGETS) {
    allFiles.push(...getAllFiles(target));
  }

  const allSymbols = [];
  const allRoutes = [];

  for (const file of allFiles) {
    const { symbols, routes } = parseFileExports(file);
    allSymbols.push(...symbols);
    allRoutes.push(...routes);
  }

  const indexData = {
    version: '2.0.0',
    generated_at: new Date().toISOString(),
    total_files_scanned: allFiles.length,
    total_symbols_indexed: allSymbols.length,
    routes: allRoutes,
    symbols: allSymbols,
  };

  // Write code index
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, JSON.stringify(indexData, null, 2), 'utf8');

  // Also update component-catalog.json automatically
  const components = allSymbols
    .filter(s => s.kind === 'component')
    .map(c => ({
      name: c.name,
      file: c.file,
      line: c.line,
      import_path: c.file
        .replace(/^04-coding\/apps\/web\/src\//, '@/')
        .replace(/\.tsx?$/, ''),
    }));

  const catalogData = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'LingoraSharedComponentsCatalog',
    version: '2.0.0',
    updated_at: new Date().toISOString(),
    total_components: components.length,
    exported_components: components,
  };

  fs.writeFileSync(COMPONENT_CATALOG_PATH, JSON.stringify(catalogData, null, 2), 'utf8');

  const duration = Date.now() - startTime;
  console.log(`⚡ [Code Scout Indexer] Indexed ${allSymbols.length} symbols across ${allFiles.length} files in ${duration}ms.`);
  console.log(`   Saved index -> ${INDEX_PATH}`);
  console.log(`   Updated component catalog (${components.length} components) -> ${COMPONENT_CATALOG_PATH}`);
}

/**
 * Search the index for matching symbols or routes
 */
function search(query) {
  if (!fs.existsSync(INDEX_PATH)) {
    buildIndex();
  }

  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  const index = JSON.parse(raw);
  const q = query.toLowerCase().trim();

  // Search symbols
  const matches = index.symbols.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.file.toLowerCase().includes(q) ||
    s.kind.toLowerCase().includes(q)
  );

  // Search routes
  const routeMatches = index.routes.filter(r =>
    r.route.toLowerCase().includes(q) || r.file.toLowerCase().includes(q)
  );

  if (matches.length === 0 && routeMatches.length === 0) {
    console.log(`🔍 [Code Scout] No symbols or routes found matching: "${query}"`);
    return;
  }

  console.log(`🔍 [Code Scout] Found ${matches.length} symbols and ${routeMatches.length} routes matching "${query}":`);

  if (routeMatches.length > 0) {
    console.log('\n--- ROUTES ---');
    for (const r of routeMatches) {
      console.log(`  [Route] ${r.route} (${r.type}) -> ${r.file}`);
    }
  }

  if (matches.length > 0) {
    console.log('\n--- SYMBOLS ---');
    for (const m of matches.slice(0, 30)) {
      console.log(`  [${m.kind.padEnd(9)}] ${m.name.padEnd(28)} -> ${m.file}:${m.line}`);
    }
    if (matches.length > 30) {
      console.log(`  ... and ${matches.length - 30} more (refine query to narrow down)`);
    }
  }
  console.log('\n💡 Tip: Use `node .agents/scripts/code-scout.mjs show <SymbolName>` to view source snippet.');
}

/**
 * Show exact definition snippet of a symbol
 */
function showSymbol(name) {
  if (!fs.existsSync(INDEX_PATH)) {
    buildIndex();
  }

  const raw = fs.readFileSync(INDEX_PATH, 'utf8');
  const index = JSON.parse(raw);
  const target = index.symbols.find(s => s.name.toLowerCase() === name.toLowerCase());

  if (!target) {
    console.log(`❌ [Code Scout] Symbol "${name}" not found in index.`);
    return;
  }

  const fullPath = path.join(ROOT_DIR, target.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${target.file}`);
    return;
  }

  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
  const startLine = Math.max(0, target.line - 1);
  const endLine = Math.min(lines.length, target.line + 25);
  const snippet = lines.slice(startLine, endLine).join('\n');

  console.log(`\n📍 [${target.kind.toUpperCase()}] ${target.name}`);
  console.log(`   File: ${target.file}#L${target.line}`);
  console.log(`   Link: file:///${fullPath.replace(/\\/g, '/')}#L${target.line}\n`);
  console.log('```typescript');
  console.log(snippet);
  console.log('```');
}

// CLI handler
const [,, command, ...args] = process.argv;

if (!command || command === 'help' || command === '--help') {
  console.log(`
Lingora Code Scout CLI (Zero-Token Retrieval)
Usage:
  node .agents/scripts/code-scout.mjs index           Re-index entire codebase (<200ms)
  node .agents/scripts/code-scout.mjs find <query>    Fast search for components, types, functions, routes
  node .agents/scripts/code-scout.mjs show <symbol>   Print definition snippet without loading full file
  node .agents/scripts/code-scout.mjs routes          List all App Router pages and API routes
`);
} else if (command === 'index') {
  buildIndex();
} else if (command === 'find' || command === 'search') {
  const query = args.join(' ');
  if (!query) {
    console.log('Please provide a search query.');
  } else {
    search(query);
  }
} else if (command === 'show') {
  const symbol = args[0];
  if (!symbol) {
    console.log('Please provide a symbol name.');
  } else {
    showSymbol(symbol);
  }
} else if (command === 'routes') {
  search('page');
} else {
  // Default to search if query passed directly
  search([command, ...args].join(' '));
}
