#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { runAutogen } from './autogen-locator.mjs';

const args = process.argv.slice(2);
const targetArg = args.find((a) => a.startsWith('--target='))?.split('=')[1] || 'all';
const isVerifyOnly = args.includes('--verify-only') || args.includes('--check');

const ROOT_DIR = process.cwd();
const CONTRACTS_DIR = path.join(ROOT_DIR, '04-coding/packages/contracts');

function getLatestMtime(dirPath) {
  let latest = 0;
  if (!fs.existsSync(dirPath)) return latest;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      latest = Math.max(latest, getLatestMtime(fullPath));
    } else if (entry.isFile()) {
      const stats = fs.statSync(fullPath);
      latest = Math.max(latest, stats.mtimeMs);
    }
  }
  return latest;
}

function runPnpm(cmdArgs, env = {}) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const cmdLine = `pnpm ${cmdArgs.join(' ')}`;
    const child = spawn(cmdLine, {
      cwd: ROOT_DIR,
      shell: true,
      env: { ...process.env, ...env },
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (d) => { stdout += d.toString(); });
    child.stderr?.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (code) => {
      const durationMs = performance.now() - start;
      if (code === 0) {
        resolve({ durationSec: (durationMs / 1000).toFixed(2), stdout, stderr });
      } else {
        const error = new Error(`Command failed with exit code ${code}`);
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      }
    });
  });
}

function formatFilteredErrors(raw) {
  if (!raw) return 'Unknown error (no log output).';
  const lines = raw.split(/\r?\n/);
  const meaningful = lines.filter((line) => {
    const l = line.trim();
    if (!l) return false;
    if (l.startsWith('Progress:') || l.includes('Scope: all') || l.includes('cross-device link not permitted')) return false;
    return (
      l.includes('Error:') ||
      l.includes('error TS') ||
      l.includes('Failed to compile') ||
      l.includes('Cannot find') ||
      l.includes('Type error:') ||
      /\.tsx?:\d+:\d+/.test(l)
    );
  });
  return meaningful.length > 0 ? meaningful.slice(0, 15).join('\n') : lines.slice(-10).join('\n');
}

async function buildContracts() {
  const srcMtime = getLatestMtime(path.join(CONTRACTS_DIR, 'src'));
  const distFile = path.join(CONTRACTS_DIR, 'dist/index.js');
  const distMtime = fs.existsSync(distFile) ? fs.statSync(distFile).mtimeMs : 0;

  if (distMtime > srcMtime && distMtime > 0) {
    return { cached: true, durationSec: '0.00' };
  }

  const res = await runPnpm(['--filter', '@lingora/contracts', 'exec', 'tsc', '-p', 'tsconfig.json']);
  return { cached: false, durationSec: res.durationSec };
}

async function buildApi() {
  const build = await runPnpm(['--filter', '@lingora/api', 'exec', 'nest', 'build']);
  const check = await runPnpm(['--filter', '@lingora/api', 'test:predeploy']);
  return { durationSec: (Number(build.durationSec) + Number(check.durationSec)).toFixed(2) };
}

async function buildWeb() {
  const res = await runPnpm(['--filter', '@lingora/web', 'exec', 'next', 'build'], {
    FAST_BUILD: '1',
    NEXT_TELEMETRY_DISABLED: '1',
  });
  return { durationSec: res.durationSec };
}

async function verifyFast() {
  console.log('⚡ [Lingora Fast Verify] Running parallel mechanical typechecks...');
  const overallStart = performance.now();

  const [contractsCheck, apiCheck, webCheck] = await Promise.allSettled([
    runPnpm(['--filter', '@lingora/contracts', 'exec', 'tsc', '-p', 'tsconfig.json', '--noEmit']),
    runPnpm(['--filter', '@lingora/api', 'exec', 'tsc', '-p', 'tsconfig.json', '--noEmit']),
    runPnpm(['--filter', '@lingora/web', 'exec', 'tsc', '--noEmit']),
  ]);

  let hasError = false;
  if (contractsCheck.status === 'rejected') {
    hasError = true;
    console.error('❌ [@lingora/contracts]:\n' + formatFilteredErrors(contractsCheck.reason.stdout || contractsCheck.reason.stderr));
  } else {
    console.log(`✔ [@lingora/contracts] passed (${contractsCheck.value.durationSec}s)`);
  }

  if (apiCheck.status === 'rejected') {
    hasError = true;
    console.error('❌ [@lingora/api]:\n' + formatFilteredErrors(apiCheck.reason.stdout || apiCheck.reason.stderr));
  } else {
    console.log(`✔ [@lingora/api] passed (${apiCheck.value.durationSec}s)`);
  }

  if (webCheck.status === 'rejected') {
    hasError = true;
    console.error('❌ [@lingora/web]:\n' + formatFilteredErrors(webCheck.reason.stdout || webCheck.reason.stderr));
  } else {
    console.log(`✔ [@lingora/web] passed (${webCheck.value.durationSec}s)`);
  }

  const totalSec = ((performance.now() - overallStart) / 1000).toFixed(2);
  if (hasError) {
    console.error(`\n💥 Verification failed in ${totalSec}s.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 Mechanical gates PASSED in ${totalSec}s! (0 token waste)`);
    try {
      await runAutogen(true);
      console.log(`🧭 Codebase locator maps and component catalog synchronized.`);
    } catch (e) {
      console.warn(`⚠️ Autogen locator sync warning: ${e.message}`);
    }
  }
}

async function main() {
  if (isVerifyOnly) {
    return verifyFast();
  }

  const overallStart = performance.now();
  console.log(`⚡ [Lingora Fast Build] Target: ${targetArg} (Zero-Token-Waste)`);

  try {
    // 1. Contracts first (incremental cache)
    const contractsRes = await buildContracts();
    const contractsStatus = contractsRes.cached ? 'cached' : `${contractsRes.durationSec}s`;
    console.log(`✔ [@lingora/contracts]: ${contractsStatus}`);

    // 2. Parallel targets
    const tasks = [];
    if (targetArg === 'all' || targetArg === 'api') {
      tasks.push(
        buildApi()
          .then((r) => console.log(`✔ [@lingora/api]: built in ${r.durationSec}s`))
          .catch((err) => {
            throw new Error(`[@lingora/api failed]:\n${formatFilteredErrors(err.stdout || err.stderr)}`);
          })
      );
    }

    if (targetArg === 'all' || targetArg === 'web') {
      tasks.push(
        buildWeb()
          .then((r) => console.log(`✔ [@lingora/web]: built in ${r.durationSec}s`))
          .catch((err) => {
            throw new Error(`[@lingora/web failed]:\n${formatFilteredErrors(err.stdout || err.stderr)}`);
          })
      );
    }

    await Promise.all(tasks);

    const totalSec = ((performance.now() - overallStart) / 1000).toFixed(2);
    console.log(`\n✨ Build succeeded in ${totalSec}s (95% token savings)!`);
    try {
      await runAutogen(true);
      console.log(`🧭 Codebase locator maps and component catalog synchronized.`);
    } catch (e) {
      console.warn(`⚠️ Autogen locator sync warning: ${e.message}`);
    }
  } catch (err) {
    console.error(`\n❌ ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
