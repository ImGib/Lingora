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
    task.status = 'COMPLETED';
    task.progress_percentage = 100;
    task.completed_at = new Date().toISOString();
    pool.updated_at = new Date().toISOString();
    writeJson(POOL_PATH, pool);

    console.log(JSON.stringify({ success: true, task_id: taskId, status: 'COMPLETED' }));
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
  node .agents/scripts/task-coordinator.mjs list
`);
}
