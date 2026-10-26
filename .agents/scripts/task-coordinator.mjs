#!/usr/bin/env node

/**
 * Lingora Multi-Agent Task Coordinator CLI
 * Usage:
 *   node .agents/scripts/task-coordinator.mjs claim <agent_name>
 *   node .agents/scripts/task-coordinator.mjs complete <task_id>
 *   node .agents/scripts/task-coordinator.mjs list
 *   node .agents/scripts/task-coordinator.mjs release <task_id>
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POOL_PATH = path.resolve(__dirname, '../coordination/parallel-task-pool.json');
const POOL_LOCK_PATH = `${POOL_PATH}.lock`;
const REPO_ROOT = path.resolve(__dirname, '../..');
const WORKTREES_ROOT = path.resolve(__dirname, '../worktrees');
const MERGE_JOURNAL_PATH = path.resolve(__dirname, '../coordination/merge-journal.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`;
  try {
    const handle = fs.openSync(temporary, 'wx');
    try {
      fs.writeFileSync(handle, JSON.stringify(data, null, 2) + '\n', 'utf8');
      fs.fsyncSync(handle);
    } finally {
      fs.closeSync(handle);
    }
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function acquirePoolLock() {
  const deadline = Date.now() + 180_000;
  const pause = new Int32Array(new SharedArrayBuffer(4));
  const owner = { pid: process.pid, token: randomUUID() };
  while (true) {
    try {
      const handle = fs.openSync(POOL_LOCK_PATH, 'wx');
      try {
        fs.writeFileSync(handle, JSON.stringify(owner));
        fs.fsyncSync(handle);
      } catch (writeError) {
        fs.closeSync(handle);
        fs.unlinkSync(POOL_LOCK_PATH);
        throw writeError;
      } finally {
        try { fs.closeSync(handle); } catch { /* Already closed after a write failure. */ }
      }
      return () => {
        try {
          const current = JSON.parse(fs.readFileSync(POOL_LOCK_PATH, 'utf8'));
          if (current.token === owner.token) fs.unlinkSync(POOL_LOCK_PATH);
        } catch (error) {
          if (error.code !== 'ENOENT') console.error('Could not release task pool lock:', error.message);
        }
      };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      try {
        const current = JSON.parse(fs.readFileSync(POOL_LOCK_PATH, 'utf8'));
        if (Number.isInteger(current.pid) && current.pid > 0 && typeof current.token === 'string') {
          try {
            process.kill(current.pid, 0);
          } catch (probeError) {
            if (probeError.code === 'ESRCH') {
              // Recheck the token so another waiter cannot delete a replacement lock.
              const latest = JSON.parse(fs.readFileSync(POOL_LOCK_PATH, 'utf8'));
              if (latest.token === current.token) fs.unlinkSync(POOL_LOCK_PATH);
              continue;
            }
            if (probeError.code !== 'EPERM') throw probeError;
          }
        } else if (Date.now() - fs.statSync(POOL_LOCK_PATH).mtimeMs > 10_000) {
          fs.unlinkSync(POOL_LOCK_PATH);
          continue;
        }
      } catch (readError) {
        if (readError.code === 'ENOENT') continue;
        // A process may have created the lock but not written its owner yet.
        if (!(readError instanceof SyntaxError)) throw readError;
        try {
          if (Date.now() - fs.statSync(POOL_LOCK_PATH).mtimeMs > 10_000) {
            fs.unlinkSync(POOL_LOCK_PATH);
            continue;
          }
        } catch (statError) {
          if (statError.code === 'ENOENT') continue;
          throw statError;
        }
      }
      if (Date.now() >= deadline) throw new Error('Task pool is busy; retry the coordinator command.');
      Atomics.wait(pause, 0, 0, 50);
    }
  }
}

function normalizeFile(file) {
  return file.replace(/\\/g, '/');
}

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function taskFile(root, relative) {
  const file = path.resolve(root, relative);
  const sourceRoot = path.resolve(root, '04-coding') + path.sep;
  if (!file.startsWith(sourceRoot)) throw new Error(`Unsafe task file: ${relative}`);
  return file;
}

function fileHash(file) {
  return fs.existsSync(file) ? createHash('sha256').update(fs.readFileSync(file)).digest('hex') : null;
}

function getStatusFiles(root) {
  // -z preserves filenames with spaces/newlines; -uall lists files inside untracked directories.
  const status = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', '04-coding/'], {
    cwd: root,
    encoding: 'utf8',
  });
  const entries = status.split('\0');
  const changedFiles = new Set();

  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    if (!entry) continue;
    const code = entry.slice(0, 2);
    changedFiles.add(normalizeFile(entry.slice(3)));
    if (/[RC]/.test(code)) {
      const previousPath = entries[++index];
      if (previousPath) changedFiles.add(normalizeFile(previousPath));
    }
  }
  return [...changedFiles].sort();
}

function getWorktreeChanges(task) {
  const tracked = git(task.workspace_path, ['diff', '--name-only', '-z', task.baseline_tree, '--', '04-coding/']);
  const untracked = git(task.workspace_path, ['ls-files', '--others', '--exclude-standard', '-z', '--', '04-coding/']);
  return [...new Set([...tracked.split('\0'), ...untracked.split('\0')].filter(Boolean).map(normalizeFile))].sort();
}

function copySourceFile(sourceRoot, targetRoot, relative) {
  const source = taskFile(sourceRoot, relative);
  const target = taskFile(targetRoot, relative);
  if (fs.existsSync(source)) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  } else if (fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
}

function installDependencies(workspace) {
  if (!fs.existsSync(path.join(workspace, 'pnpm-workspace.yaml'))) return;
  const result = spawnSync('pnpm', ['--filter', '@lingora/web...', 'install', '--no-frozen-lockfile', '--prefer-offline'], {
    cwd: workspace,
    shell: process.platform === 'win32',
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Could not install task worktree dependencies: ${result.error?.message ?? `${result.stdout}\n${result.stderr}`.slice(-3000)}`);
  }
}

function removeTaskWorktree(workspace) {
  const expected = path.join(WORKTREES_ROOT, path.basename(workspace));
  if (path.resolve(workspace) !== expected) throw new Error(`Unsafe worktree path: ${workspace}`);
  try {
    git(REPO_ROOT, ['worktree', 'remove', '--force', workspace]);
  } catch (error) {
    // Git for Windows can unregister a worktree but fail to delete long pnpm paths.
    if (process.platform !== 'win32') throw error;
  }
  if (fs.existsSync(workspace)) {
    fs.rmSync(path.toNamespacedPath(workspace), { recursive: true, force: true, maxRetries: 3 });
  }
  const registered = git(REPO_ROOT, ['worktree', 'list', '--porcelain'])
    .split(/\r?\n/)
    .some((line) => line.startsWith('worktree ') && path.resolve(line.slice(9)) === path.resolve(workspace));
  if (registered) throw new Error(`Could not unregister task worktree: ${workspace}`);
}

function prepareWorktree(task, pool) {
  if (!/^[A-Za-z0-9_-]+$/.test(task.task_id)) throw new Error(`Unsafe task ID: ${task.task_id}`);
  for (const file of task.allowed_files) taskFile(REPO_ROOT, file);
  const workspace = path.join(WORKTREES_ROOT, task.task_id);
  if (task.workspace_path) {
    if (!fs.existsSync(task.workspace_path)) throw new Error(`Missing task worktree: ${task.workspace_path}`);
    return;
  }
  if (fs.existsSync(workspace)) throw new Error(`Task worktree path already exists: ${workspace}`);
  fs.mkdirSync(WORKTREES_ROOT, { recursive: true });
  git(REPO_ROOT, ['worktree', 'add', '--detach', workspace, 'HEAD']);
  try {
    const snapshotFiles = new Set(pool.active_tasks
      .filter((item) => item.status === 'COMPLETED' || item.task_id === task.task_id)
      .flatMap((item) => item.allowed_files.map(normalizeFile)));
    for (const file of getStatusFiles(REPO_ROOT).filter((file) => snapshotFiles.has(file))) {
      copySourceFile(REPO_ROOT, workspace, file);
    }
    installDependencies(workspace);
    git(workspace, ['add', '-A', '--', '04-coding/']);
    task.workspace_path = workspace;
    task.baseline_tree = git(workspace, ['write-tree']);
    task.baseline_hashes = Object.fromEntries(task.allowed_files.map((file) => [normalizeFile(file), fileHash(taskFile(REPO_ROOT, file))]));
  } catch (error) {
    removeTaskWorktree(workspace);
    throw error;
  }
}

function getScopeViolations(pool, task) {
  if (task.workspace_path) {
    const allowed = new Set(task.allowed_files.map(normalizeFile));
    return getWorktreeChanges(task).filter((file) => !allowed.has(file));
  }

  const changedFiles = getStatusFiles(REPO_ROOT);

  const allowed = new Set(task.allowed_files.map(normalizeFile));
  const otherTaskFiles = new Set(pool.active_tasks
    .filter((candidate) => candidate.task_id !== task.task_id && candidate.status !== 'AVAILABLE')
    .flatMap((candidate) => candidate.allowed_files.map(normalizeFile)));

  // A shared worktree cannot attribute edits by process. Files assigned to another task
  // are excluded; unassigned changed files remain genuine scope violations.
  return changedFiles.filter((file) => !allowed.has(file) && !otherTaskFiles.has(file));
}

function restoreMerge(journal) {
  for (const { file, original } of journal.backups) {
    const target = taskFile(REPO_ROOT, file);
    if (original === null) {
      if (fs.existsSync(target)) fs.unlinkSync(target);
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, Buffer.from(original, 'base64'));
    }
  }
}

function recoverMergeJournal() {
  if (!fs.existsSync(MERGE_JOURNAL_PATH)) return;
  const journal = readJson(MERGE_JOURNAL_PATH);
  const pool = readJson(POOL_PATH);
  const task = pool.active_tasks.find((item) => item.task_id === journal.task_id);
  if (task?.status !== 'COMPLETED') restoreMerge(journal);
  fs.unlinkSync(MERGE_JOURNAL_PATH);
}

function verifyWorktreeTask(task) {
  const [command, ...args] = task.verification_command?.trim().split(/\s+/) ?? [];
  if (!command) throw new Error(`No verification command for ${task.task_id}`);
  if (command === 'pnpm' && args.some((argument) => !/^[A-Za-z0-9@./-]+$/.test(argument))) {
    throw new Error(`Unsafe verification argument for ${task.task_id}`);
  }
  const result = spawnSync(command, args, {
    cwd: path.join(task.workspace_path, '04-coding'),
    shell: command === 'pnpm' && process.platform === 'win32',
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    const details = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim().slice(-3000);
    throw new Error(`Verification failed for ${task.task_id}: ${result.error?.message ?? details}`);
  }
}

function completeWorktreeTask(pool, task) {
  const changed = getWorktreeChanges(task);
  const allowed = new Set(task.allowed_files.map(normalizeFile));
  const violations = changed.filter((file) => !allowed.has(file));
  if (violations.length > 0) throw new Error(`Files outside allowed_files changed: ${violations.join(', ')}`);
  for (const file of changed) {
    if (fileHash(taskFile(REPO_ROOT, file)) !== task.baseline_hashes[file]) {
      throw new Error(`Merge conflict in ${file}: main workspace changed since claim.`);
    }
  }

  verifyWorktreeTask(task);

  const journal = {
    task_id: task.task_id,
    backups: changed.map((file) => {
      const target = taskFile(REPO_ROOT, file);
      return { file, original: fs.existsSync(target) ? fs.readFileSync(target).toString('base64') : null };
    }),
  };
  writeJson(MERGE_JOURNAL_PATH, journal);
  try {
    for (const file of changed) copySourceFile(task.workspace_path, REPO_ROOT, file);
    task.status = 'COMPLETED';
    task.progress_percentage = 100;
    task.completed_at = new Date().toISOString();
    pool.updated_at = task.completed_at;
    const oldWorkspace = task.workspace_path;
    delete task.workspace_path;
    delete task.baseline_tree;
    delete task.baseline_hashes;
    writeJson(POOL_PATH, pool);
    if (oldWorkspace) {
      removeTaskWorktree(oldWorkspace);
    }
  } catch (error) {
    restoreMerge(journal);
    fs.unlinkSync(MERGE_JOURNAL_PATH);
    throw error;
  }
  fs.unlinkSync(MERGE_JOURNAL_PATH);
}

const [action, param1, param2] = process.argv.slice(2);
if (['claim', 'complete', 'checkpoint', 'release'].includes(action)) {
  const releasePoolLock = acquirePoolLock();
  process.on('exit', releasePoolLock);
  recoverMergeJournal();
}

switch (action) {
  case 'claim': {
    const agentName = param1 || 'Codex';
    const pool = readJson(POOL_PATH);

    // Find first available task
    const task = pool.active_tasks.find((t) => t.status === 'AVAILABLE');
    if (!task) {
      console.log(JSON.stringify({ success: false, message: 'NO_TASK_AVAILABLE' }));
      process.exit(0);
    }

    const claimedFiles = new Set(task.allowed_files.map(normalizeFile));
    const overlap = pool.active_tasks
      .filter((candidate) => candidate.status === 'IN_PROGRESS')
      .flatMap((candidate) => candidate.allowed_files
        .map(normalizeFile)
        .filter((file) => claimedFiles.has(file))
        .map((file) => ({ task_id: candidate.task_id, file })));
    if (overlap.length > 0) {
      console.error(JSON.stringify({ success: false, message: 'FILE_CONFLICT', task_id: task.task_id, overlap }));
      process.exit(1);
    }

    prepareWorktree(task, pool);

    // Atomically claim after the isolated worktree is ready.
    task.status = 'IN_PROGRESS';
    task.assigned_agent = agentName;
    task.locked_at = new Date().toISOString();
    task.progress_percentage = 15;
    pool.updated_at = new Date().toISOString();
    writeJson(POOL_PATH, pool);

    console.log(JSON.stringify({
      success: true,
      task_id: task.task_id,
      name: task.name,
      phase: task.phase,
      isolated_directory: task.isolated_directory,
      workspace_path: task.workspace_path,
      coordinator_path: __filename,
      allowed_files: task.allowed_files,
      verification_command: task.verification_command,
    }, null, 2));
    break;
  }

  case 'verify-boundary': {
    const taskId = param1;
    if (!taskId) {
      console.error('Error: task_id is required');
      process.exit(1);
    }
    const pool = readJson(POOL_PATH);
    const task = pool.active_tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Error: Task ${taskId} not found`);
      process.exit(1);
    }
    try {
      const violations = getScopeViolations(pool, task);
      if (violations.length === 0) {
        console.log(`✅ [BOUNDARY PASS] No unassigned files changed for ${taskId}.`);
      } else {
        console.error(`❌ [SCOPE DRIFT DETECTED] ${violations.length} file(s) modified outside allowed_files:`);
        violations.forEach((v) => console.error(`   - ${v}`));
        process.exit(1);
      }
    } catch (e) {
      console.error('Boundary check failed:', e.message);
      process.exit(1);
    }
    break;
  }

  case 'complete': {
    const taskId = param1;
    if (!taskId) {
      console.error('Error: task_id is required');
      process.exit(1);
    }
    const pool = readJson(POOL_PATH);
    const task = pool.active_tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Error: Task ${taskId} not found`);
      process.exit(1);
    }
    if (task.status !== 'IN_PROGRESS') {
      console.error(`Error: Task ${taskId} must be IN_PROGRESS to complete.`);
      process.exit(1);
    }

    // Existing claims remain in the shared workspace; new claims use strict worktree checks.
    try {
      const violations = getScopeViolations(pool, task);
      if (violations.length > 0) {
        console.error(`❌ [SCOPE DRIFT DETECTED] ${violations.length} unassigned file(s) changed for ${taskId}:`);
        violations.forEach((v) => console.error(`   - ${v}`));
        process.exit(1);
      }
    } catch (e) {
      console.error('Boundary check failed:', e.message);
      process.exit(1);
    }

    if (task.workspace_path) {
      try {
        completeWorktreeTask(pool, task);
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    } else {
      task.status = 'COMPLETED';
      task.progress_percentage = 100;
      task.completed_at = new Date().toISOString();
      pool.updated_at = task.completed_at;
      writeJson(POOL_PATH, pool);
    }

    // Automatically regenerate codebase locator maps upon task completion
    try {
      spawnSync(process.execPath, [path.resolve(__dirname, 'autogen-locator.mjs')], {
        stdio: 'inherit',
        cwd: REPO_ROOT,
      });
    } catch (e) {
      console.warn('⚠️ Autogen locator update warning:', e.message);
    }

    console.log(JSON.stringify({ success: true, task_id: taskId, status: 'COMPLETED' }));
    break;
  }

  case 'checkpoint': {
    const taskId = param1;
    const progress = param2 === undefined ? 50 : Number(param2);
    const note = process.argv[5] || 'Token limit reached or intermediate save';
    if (!taskId) {
      console.error('Error: task_id is required');
      process.exit(1);
    }
    const pool = readJson(POOL_PATH);
    const task = pool.active_tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Error: Task ${taskId} not found`);
      process.exit(1);
    }
    if (task.status !== 'IN_PROGRESS' || !Number.isInteger(progress) || progress < 1 || progress > 99) {
      console.error('Error: Checkpoint requires an IN_PROGRESS task and progress from 1 to 99.');
      process.exit(1);
    }

    const checkpointsDir = path.resolve(__dirname, '../coordination/checkpoints');
    if (!fs.existsSync(checkpointsDir)) {
      fs.mkdirSync(checkpointsDir, { recursive: true });
    }
    const checkpointFile = path.join(checkpointsDir, `${taskId}.json`);
    const checkpointData = {
      task_id: taskId,
      saved_at: new Date().toISOString(),
      progress_percentage: progress,
      assigned_agent: task.assigned_agent,
      note,
      workspace_path: task.workspace_path ?? REPO_ROOT,
      modified_files: task.workspace_path
        ? getWorktreeChanges(task).filter((file) => task.allowed_files.map(normalizeFile).includes(file))
        : task.allowed_files.filter((file) => fs.existsSync(taskFile(REPO_ROOT, file))),
    };
    fs.writeFileSync(checkpointFile, JSON.stringify(checkpointData, null, 2) + '\n', 'utf8');

    task.progress_percentage = progress;
    task.checkpoint_saved_at = checkpointData.saved_at;
    pool.updated_at = new Date().toISOString();
    writeJson(POOL_PATH, pool);

    console.log(JSON.stringify({ success: true, message: 'CHECKPOINT_SAVED', checkpoint: checkpointData }, null, 2));
    break;
  }

  case 'release': {
    const taskId = param1;
    if (!taskId) {
      console.error('Error: task_id is required');
      process.exit(1);
    }
    const pool = readJson(POOL_PATH);
    const task = pool.active_tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Error: Task ${taskId} not found`);
      process.exit(1);
    }
    if (task.status !== 'IN_PROGRESS') {
      console.error(`Error: Task ${taskId} must be IN_PROGRESS to release.`);
      process.exit(1);
    }
    task.status = 'AVAILABLE';
    task.assigned_agent = null;
    task.locked_at = null;
    task.progress_percentage = 0;
    pool.updated_at = new Date().toISOString();
    writeJson(POOL_PATH, pool);

    console.log(JSON.stringify({ success: true, message: 'TASK_RELEASED_FOR_NEXT_AGENT', task_id: taskId }));
    break;
  }

  case 'audit-context': {
    const skillsDir = path.resolve(__dirname, '../skills');
    const MAX_LINES = 100;
    const results = [];

    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const fullPath = path.join(dir, e.name);
        if (e.isDirectory()) {
          scanDir(fullPath);
        } else if (e.name.endsWith('.md')) {
          const lines = fs.readFileSync(fullPath, 'utf8').split('\n').length;
          const relPath = path.relative(path.resolve(__dirname, '../../'), fullPath).replace(/\\/g, '/');
          results.push({
            file: relPath,
            lines,
            status: lines <= MAX_LINES ? 'PASS' : 'WARN_EXCEEDS_100',
          });
        }
      }
    }

    scanDir(skillsDir);
    console.log('\n--- LINGORA TOKEN BUDGET / PROGRESSIVE DISCLOSURE AUDIT ---');
    console.table(results);
    const violations = results.filter((r) => r.status !== 'PASS');
    if (violations.length === 0) {
      console.log('✅ ALL SKILLS COMPLY WITH THE <= 100 LINES PROGRESSIVE DISCLOSURE RULE!\n');
    } else {
      console.warn(`⚠️ ${violations.length} file(s) exceed 100 lines. Consider moving details into references/\n`);
    }
    break;
  }

  case 'generate-prompt': {
    const taskId = param1;
    if (!taskId) {
      console.error('Error: task_id is required');
      process.exit(1);
    }
    const pool = readJson(POOL_PATH);
    const task = pool.active_tasks.find((t) => t.task_id === taskId);
    if (!task) {
      console.error(`Error: Task ${taskId} not found`);
      process.exit(1);
    }

    const promptPacket = `================================================================================
AI SUBAGENT DISPATCH PACKET (ZERO SESSION HISTORY) — ${task.task_id}
================================================================================
[TASK IDENTITY]
ID: ${task.task_id} (${task.phase})
Name: ${task.name}

[ISOLATED WORK CONTEXT]
Directory: ${task.isolated_directory}
Workspace Root: ${task.workspace_path ?? REPO_ROOT}
Coordinator CLI: node "${__filename}"
For tasks with a workspace_path, edit and typecheck only there; complete merges allowed files after verification.

[ALLOWED FILES - STRICT WRITE BOUNDARY]
${task.allowed_files.map((f) => `- ${f}`).join('\n')}

[REFERENCE FILES - READ ONLY (ON DEMAND)]
- .agents/skills/lingora-core-invariants/SKILL.md (Core pedagogy)
- .agents/skills/lingora-ui-tokens/SKILL.md (UI Tokens & Soft Study Palette)
- .agents/coordination/component-catalog.json (Shared component reuse)

[INVARIANTS TO ENFORCE]
1. Skipped != Failed (Skipping does not penalize score)
2. Support != Independent (Hints set has_support: true)
3. Reuse existing components from component-catalog.json (Never duplicate buttons or canvas)
4. Do NOT read or search in 99-deprecated/

[VERIFICATION COMMAND]
${task.verification_command}

[REPORTING PROTOCOL]
When finished, reply concisely:
STATUS: DONE | BLOCKED
Summary: [1-2 sentences on what was implemented]
Concerns: [Optional blocker details]
================================================================================`;

    console.log(promptPacket);
    break;
  }

  case 'list': {
    const pool = readJson(POOL_PATH);
    console.table(pool.active_tasks.map((t) => ({
      ID: t.task_id,
      Phase: t.phase,
      Status: t.status,
      Agent: t.assigned_agent || '-',
      Progress: `${t.progress_percentage}%`,
      Directory: t.isolated_directory,
    })));
    break;
  }

  default:
    console.log(`
Lingora Multi-Agent Task Coordinator CLI
Usage:
  node .agents/scripts/task-coordinator.mjs claim [agent_name]
  node .agents/scripts/task-coordinator.mjs complete <task_id>
  node .agents/scripts/task-coordinator.mjs checkpoint <task_id> <progress_%> [summary]
  node .agents/scripts/task-coordinator.mjs release <task_id>
  node .agents/scripts/task-coordinator.mjs verify-boundary <task_id>
  node .agents/scripts/task-coordinator.mjs generate-prompt <task_id>
  node .agents/scripts/task-coordinator.mjs audit-context
  node .agents/scripts/task-coordinator.mjs list
`);
}

