#!/usr/bin/env node

/**
 * Lingora Multi-Agent Task Coordinator CLI
 * Usage:
 *   node .agents/scripts/task-coordinator.mjs claim <agent_name>
 *   node .agents/scripts/task-coordinator.mjs complete <task_id>
 *   node .agents/scripts/task-coordinator.mjs list
 *   node .agents/scripts/task-coordinator.mjs prune-stale <timeout_minutes>
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POOL_PATH = path.resolve(__dirname, '../coordination/parallel-task-pool.json');
const BOARD_PATH = path.resolve(__dirname, '../coordination/tasks-board.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

const [action, param1, param2] = process.argv.slice(2);

switch (action) {
  case 'claim': {
    const agentName = param1 || 'Codex';
    const pool = readJson(POOL_PATH);
    const now = Date.now();
    const TIMEOUT_MS = (parseInt(param2, 10) || 45) * 60 * 1000;

    // First, auto-release any zombie/stale task older than timeout
    let recovered = 0;
    for (const t of pool.active_tasks) {
      if (t.status === 'IN_PROGRESS' && t.locked_at) {
        const lockedTime = new Date(t.locked_at).getTime();
        if (now - lockedTime > TIMEOUT_MS) {
          console.warn(`[WATCHDOG] Releasing zombie task ${t.task_id} (locked by ${t.assigned_agent} at ${t.locked_at})`);
          t.status = 'AVAILABLE';
          t.assigned_agent = null;
          t.locked_at = null;
          t.progress_percentage = 0;
          recovered++;
        }
      }
    }

    // Find first available task
    const task = pool.active_tasks.find((t) => t.status === 'AVAILABLE');
    if (!task) {
      if (recovered > 0) writeJson(POOL_PATH, pool);
      console.log(JSON.stringify({ success: false, message: 'NO_TASK_AVAILABLE' }));
      process.exit(0);
    }

    // Atomically claim
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
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const modifiedFiles = gitStatus
        .split('\n')
        .map((line) => line.slice(3).trim())
        .filter((file) => file.length > 0 && file.startsWith('04-coding/') && !file.endsWith('/'));
      const allowedSet = new Set(task.allowed_files.map((f) => f.replace(/\\/g, '/')));
      const violations = modifiedFiles.filter((f) => !allowedSet.has(f.replace(/\\/g, '/')));

      if (violations.length === 0) {
        console.log(`✅ [BOUNDARY PASS] All modified files strictly comply with ${taskId} allowed_files.`);
      } else {
        console.error(`❌ [SCOPE DRIFT DETECTED] ${violations.length} file(s) modified outside allowed_files:`);
        violations.forEach((v) => console.error(`   - ${v}`));
        process.exit(1);
      }
    } catch (e) {
      console.log('⚠️ Boundary check skipped (git command unavailable or error):', e.message);
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

    // TDC-inspired Scope Drift Watchdog: check git status
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const modifiedFiles = gitStatus
        .split('\n')
        .map((line) => line.slice(3).trim())
        .filter((file) => file.length > 0 && file.startsWith('04-coding/') && !file.endsWith('/'));
      const allowedSet = new Set(task.allowed_files.map((f) => f.replace(/\\/g, '/')));
      const violations = modifiedFiles.filter((f) => !allowedSet.has(f.replace(/\\/g, '/')));

      if (violations.length > 0) {
        console.warn(`\n⚠️ [SCOPE DRIFT ALERT] Agent modified files outside allowed_files for ${taskId}:`);
        violations.forEach((v) => console.warn(`   - ${v}`));
        console.warn('Review scope violations to prevent breaking other parallel agents.\n');
      }
    } catch {
      // Git command failed or not in git repo, bypass check
    }

    task.status = 'COMPLETED';
    task.progress_percentage = 100;
    task.completed_at = new Date().toISOString();
    pool.updated_at = new Date().toISOString();
    writeJson(POOL_PATH, pool);

    console.log(JSON.stringify({ success: true, task_id: taskId, status: 'COMPLETED' }));
    break;
  }

  case 'checkpoint': {
    const taskId = param1;
    const progress = parseInt(param2, 10) || 50;
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
      modified_files: task.allowed_files.filter((f) => fs.existsSync(path.resolve(__dirname, '../../', f))),
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
    task.status = 'AVAILABLE';
    task.assigned_agent = null;
    task.locked_at = null;
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
Workspace Root: C:\\BaoTG\\Lingora

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
  node .agents/scripts/task-coordinator.mjs claim [agent_name] [stale_timeout_mins]
  node .agents/scripts/task-coordinator.mjs complete <task_id>
  node .agents/scripts/task-coordinator.mjs checkpoint <task_id> <progress_%> [summary]
  node .agents/scripts/task-coordinator.mjs release <task_id>
  node .agents/scripts/task-coordinator.mjs verify-boundary <task_id>
  node .agents/scripts/task-coordinator.mjs generate-prompt <task_id>
  node .agents/scripts/task-coordinator.mjs audit-context
  node .agents/scripts/task-coordinator.mjs list
`);
}

