import assert from 'node:assert/strict';
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./task-coordinator.mjs', import.meta.url));

function fixture(tasks) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lingora-coordinator-'));
  const scripts = path.join(root, '.agents', 'scripts');
  const coordination = path.join(root, '.agents', 'coordination');
  fs.mkdirSync(scripts, { recursive: true });
  fs.mkdirSync(coordination, { recursive: true });
  fs.mkdirSync(path.join(root, '04-coding'), { recursive: true });
  fs.copyFileSync(script, path.join(scripts, 'task-coordinator.mjs'));
  fs.writeFileSync(path.join(coordination, 'parallel-task-pool.json'), JSON.stringify({
    active_tasks: tasks,
  }));
  execFileSync('git', ['init', '-q'], { cwd: root });
  fs.writeFileSync(path.join(root, '04-coding', 'seed.txt'), 'fixture');
  fs.writeFileSync(path.join(root, '04-coding', 'verify.mjs'), "import fs from 'node:fs'; process.exit(fs.existsSync('a.ts') && fs.readFileSync('a.ts', 'utf8').includes('bad') ? 1 : 0);");
  execFileSync('git', ['add', '04-coding/seed.txt', '04-coding/verify.mjs'], { cwd: root });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'Fixture'], { cwd: root });
  return {
    root,
    pool: path.join(coordination, 'parallel-task-pool.json'),
    lock: path.join(coordination, 'parallel-task-pool.json.lock'),
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

function task(taskId, status, files) {
  return {
    task_id: taskId,
    status,
    allowed_files: files,
    assigned_agent: status === 'IN_PROGRESS' ? 'Agent' : null,
    locked_at: status === 'IN_PROGRESS' ? '2020-01-01T00:00:00.000Z' : null,
    progress_percentage: status === 'IN_PROGRESS' ? 15 : 0,
    verification_command: 'node verify.mjs',
  };
}

function run(root, ...args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, '.agents', 'scripts', 'task-coordinator.mjs'), ...args], { cwd: root });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('simultaneous claims receive distinct tasks and leave no lock', async () => {
  const { root, pool, lock, cleanup } = fixture([
    task('A', 'AVAILABLE', ['04-coding/a.ts']),
    task('B', 'AVAILABLE', ['04-coding/b.ts']),
  ]);
  try {
    const results = await Promise.all([run(root, 'claim', 'One'), run(root, 'claim', 'Two')]);
    assert.deepEqual(results.map((result) => result.code), [0, 0]);
    assert.deepEqual(new Set(results.map((result) => JSON.parse(result.stdout).task_id)), new Set(['A', 'B']));
    assert.deepEqual(JSON.parse(fs.readFileSync(pool, 'utf8')).active_tasks.map((item) => item.status), ['IN_PROGRESS', 'IN_PROGRESS']);
    assert.equal(fs.existsSync(lock), false);
  } finally {
    cleanup();
  }
});

test('claim does not steal an old active task or claim overlapping files', async () => {
  const first = fixture([
    task('A', 'IN_PROGRESS', ['04-coding/a.ts']),
    task('B', 'AVAILABLE', ['04-coding/b.ts']),
  ]);
  try {
    const result = await run(first.root, 'claim', 'Another');
    assert.equal(result.code, 0);
    assert.equal(JSON.parse(result.stdout).task_id, 'B');
    assert.equal(JSON.parse(fs.readFileSync(first.pool, 'utf8')).active_tasks[0].status, 'IN_PROGRESS');
  } finally {
    first.cleanup();
  }

  const second = fixture([
    task('A', 'IN_PROGRESS', ['04-coding/a.ts']),
    task('B', 'AVAILABLE', ['04-coding/a.ts']),
  ]);
  try {
    const result = await run(second.root, 'claim', 'Another');
    assert.equal(result.code, 1);
    assert.equal(JSON.parse(result.stderr).message, 'FILE_CONFLICT');
    assert.equal(JSON.parse(fs.readFileSync(second.pool, 'utf8')).active_tasks[1].status, 'AVAILABLE');
  } finally {
    second.cleanup();
  }
});

test('parallel task files pass scope checks, unassigned files block completion', async () => {
  const { root, pool, cleanup } = fixture([
    task('A', 'IN_PROGRESS', ['04-coding/a.ts']),
    task('B', 'IN_PROGRESS', ['04-coding/b.ts']),
  ]);
  try {
    fs.writeFileSync(path.join(root, '04-coding', 'a.ts'), 'export const a = 1;');
    fs.writeFileSync(path.join(root, '04-coding', 'b.ts'), 'export const b = 1;');
    assert.equal((await run(root, 'verify-boundary', 'A')).code, 0);
    fs.writeFileSync(path.join(root, '04-coding', 'unexpected.ts'), 'export const x = 1;');
    assert.equal((await run(root, 'verify-boundary', 'A')).code, 1);
    assert.equal((await run(root, 'complete', 'A')).code, 1);
    assert.equal(JSON.parse(fs.readFileSync(pool, 'utf8')).active_tasks[0].status, 'IN_PROGRESS');
    fs.unlinkSync(path.join(root, '04-coding', 'unexpected.ts'));
    assert.equal((await run(root, 'complete', 'A')).code, 0);
    assert.equal((await run(root, 'complete', 'A')).code, 1);
  } finally {
    cleanup();
  }
});

test('a dead process lock is recovered without changing the task pool unexpectedly', async () => {
  const { root, pool, lock, cleanup } = fixture([task('A', 'AVAILABLE', ['04-coding/a.ts'])]);
  try {
    fs.writeFileSync(lock, JSON.stringify({ pid: 99999999, token: 'dead-process' }));
    const result = await run(root, 'claim', 'Recovery');
    assert.equal(result.code, 0);
    assert.equal(JSON.parse(result.stdout).task_id, 'A');
    assert.equal(fs.existsSync(lock), false);
    assert.equal(JSON.parse(fs.readFileSync(pool, 'utf8')).active_tasks[0].assigned_agent, 'Recovery');
  } finally {
    cleanup();
  }
});

test('checkpoint and release reject invalid task states and progress', async () => {
  const { root, pool, cleanup } = fixture([task('A', 'AVAILABLE', ['04-coding/a.ts'])]);
  try {
    assert.equal((await run(root, 'checkpoint', 'A', '50')).code, 1);
    assert.equal((await run(root, 'release', 'A')).code, 1);
    assert.equal((await run(root, 'claim', 'Worker')).code, 0);
    assert.equal((await run(root, 'checkpoint', 'A', '101')).code, 1);
    assert.equal((await run(root, 'checkpoint', 'A', '40')).code, 0);
    assert.equal((await run(root, 'release', 'A')).code, 0);
    const released = JSON.parse(fs.readFileSync(pool, 'utf8')).active_tasks[0];
    assert.equal(released.status, 'AVAILABLE');
    assert.equal(released.progress_percentage, 0);
  } finally {
    cleanup();
  }
});

test('git can create a task worktree inside the coordination directory', () => {
  const { root, cleanup } = fixture([task('A', 'AVAILABLE', ['04-coding/a.ts'])]);
  const workspace = path.join(root, '.agents', 'worktrees', 'A');
  try {
    fs.mkdirSync(path.dirname(workspace), { recursive: true });
    execFileSync('git', ['worktree', 'add', '--detach', workspace, 'HEAD'], { cwd: root });
    assert.equal(fs.existsSync(path.join(workspace, '04-coding', 'seed.txt')), true);
    execFileSync('git', ['worktree', 'remove', '--force', workspace], { cwd: root });
  } finally {
    cleanup();
  }
});

test('new tasks edit separate worktrees and merge only their assigned files', async () => {
  const { root, pool, cleanup } = fixture([
    task('A', 'AVAILABLE', ['04-coding/a.ts']),
    task('B', 'AVAILABLE', ['04-coding/b.ts']),
  ]);
  try {
    const first = JSON.parse((await run(root, 'claim', 'One')).stdout);
    const second = JSON.parse((await run(root, 'claim', 'Two')).stdout);
    assert.notEqual(first.workspace_path, second.workspace_path);
    fs.writeFileSync(path.join(first.workspace_path, '04-coding', 'a.ts'), 'export const a = 1;');
    fs.writeFileSync(path.join(second.workspace_path, '04-coding', 'b.ts'), 'export const b = 2;');
    assert.equal(fs.existsSync(path.join(root, '04-coding', 'a.ts')), false);
    assert.equal((await run(root, 'verify-boundary', 'A')).code, 0);
    assert.equal((await run(root, 'complete', 'A')).code, 0);
    assert.equal((await run(root, 'complete', 'B')).code, 0);
    assert.equal(fs.readFileSync(path.join(root, '04-coding', 'a.ts'), 'utf8'), 'export const a = 1;');
    assert.equal(fs.readFileSync(path.join(root, '04-coding', 'b.ts'), 'utf8'), 'export const b = 2;');
    assert.deepEqual(JSON.parse(fs.readFileSync(pool, 'utf8')).active_tasks.map((item) => item.status), ['COMPLETED', 'COMPLETED']);
  } finally {
    cleanup();
  }
});

test('worktree scope, merge conflicts, and failed verification preserve the main workspace', async () => {
  const { root, pool, cleanup } = fixture([
    task('A', 'AVAILABLE', ['04-coding/a.ts']),
    task('B', 'AVAILABLE', ['04-coding/b.ts']),
  ]);
  try {
    const first = JSON.parse((await run(root, 'claim', 'One')).stdout);
    fs.writeFileSync(path.join(first.workspace_path, '04-coding', 'b.ts'), 'wrong task');
    assert.equal((await run(root, 'verify-boundary', 'A')).code, 1);
    assert.equal((await run(root, 'complete', 'A')).code, 1);
    fs.unlinkSync(path.join(first.workspace_path, '04-coding', 'b.ts'));

    fs.writeFileSync(path.join(first.workspace_path, '04-coding', 'a.ts'), 'new version');
    fs.writeFileSync(path.join(root, '04-coding', 'a.ts'), 'other version');
    assert.equal((await run(root, 'complete', 'A')).code, 1);
    assert.equal(fs.readFileSync(path.join(root, '04-coding', 'a.ts'), 'utf8'), 'other version');
    fs.unlinkSync(path.join(root, '04-coding', 'a.ts'));

    fs.writeFileSync(path.join(first.workspace_path, '04-coding', 'a.ts'), 'bad version');
    assert.equal((await run(root, 'complete', 'A')).code, 1);
    assert.equal(fs.existsSync(path.join(root, '04-coding', 'a.ts')), false);
    assert.equal(JSON.parse(fs.readFileSync(pool, 'utf8')).active_tasks[0].status, 'IN_PROGRESS');
    fs.writeFileSync(path.join(first.workspace_path, '04-coding', 'a.ts'), 'new version');
    assert.equal((await run(root, 'complete', 'A')).code, 0);
  } finally {
    cleanup();
  }
});

test('real Lingora worktree installs and typechecks without changing the main workspace', {
  skip: process.env.LINGORA_REAL_WORKTREE !== '1',
}, () => {
  const root = path.resolve(path.dirname(script), '../..');
  const workspace = path.join(root, '.agents', 'worktrees', '__coordinator_validation__');
  assert.equal(path.relative(root, workspace).replaceAll('\\', '/'), '.agents/worktrees/__coordinator_validation__');
  assert.equal(fs.existsSync(workspace), false);
  const pool = JSON.parse(fs.readFileSync(path.join(root, '.agents', 'coordination', 'parallel-task-pool.json'), 'utf8'));
  fs.mkdirSync(path.dirname(workspace), { recursive: true });
  execFileSync('git', ['worktree', 'add', '--detach', workspace, 'HEAD'], { cwd: root });
  try {
    for (const taskItem of pool.active_tasks.filter((item) => item.status === 'COMPLETED')) {
      for (const relative of taskItem.allowed_files) {
        const source = path.join(root, relative);
        const target = path.join(workspace, relative);
        if (fs.existsSync(source)) {
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.copyFileSync(source, target);
        }
      }
    }
    const options = { cwd: workspace, shell: process.platform === 'win32', encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 };
    const install = spawnSync('pnpm', ['--filter', '@lingora/web...', 'install', '--no-frozen-lockfile', '--prefer-offline'], options);
    assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
    const typecheck = spawnSync('pnpm', ['--filter', '@lingora/web', 'typecheck'], { ...options, cwd: path.join(workspace, '04-coding') });
    assert.equal(typecheck.status, 0, `${typecheck.stdout}\n${typecheck.stderr}`);
  } finally {
    try {
      execFileSync('git', ['worktree', 'remove', '--force', workspace], { cwd: root, stdio: 'ignore' });
    } catch {
      // Git for Windows may unregister the worktree but leave long pnpm paths.
    }
    fs.rmSync(path.toNamespacedPath(workspace), { recursive: true, force: true, maxRetries: 3 });
    const worktrees = execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: root, encoding: 'utf8' });
    assert.equal(worktrees.includes(`worktree ${workspace.replaceAll('\\', '/')}`), false);
  }
});
