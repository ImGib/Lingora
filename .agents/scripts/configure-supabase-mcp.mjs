#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const newProjectRef = process.argv[2]?.trim();

if (!newProjectRef) {
  console.error('❌ Thiếu project_ref. Cách dùng:');
  console.error('   node .agents/scripts/configure-supabase-mcp.mjs <NEW_PROJECT_REF>');
  console.error('Ví dụ:');
  console.error('   node .agents/scripts/configure-supabase-mcp.mjs qbuwapkmltftedtrolhl');
  process.exit(1);
}

const userHome = os.homedir();
const configPaths = [
  path.join(userHome, '.gemini/config/mcp_config.json'),
  path.join(userHome, '.gemini/antigravity/mcp_config.json'),
];

const newServerUrl = `https://mcp.supabase.com/mcp?project_ref=${newProjectRef}&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching`;

for (const configPath of configPaths) {
  try {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    let config = { mcpServers: {} };
    if (fs.existsSync(configPath)) {
      try {
        const raw = fs.readFileSync(configPath, 'utf8').trim();
        if (raw) config = JSON.parse(raw);
      } catch {
        // Fallback to fresh config if malformed
      }
    }
    if (!config.mcpServers) config.mcpServers = {};

    config.mcpServers.supabase = {
      serverUrl: newServerUrl,
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
    console.log(`✔ Đã cập nhật Supabase MCP serverUrl tại: ${configPath}`);
  } catch (err) {
    console.error(`⚠ Không thể ghi file ${configPath}:`, err.message);
  }
}

console.log(`\n✨ Đã chuyển đổi Supabase MCP sang Project Ref: ${newProjectRef}`);
console.log(`🔗 URL: ${newServerUrl}`);
console.log('💡 Lưu ý: Hãy mở menu Agent > MCP Servers > Refresh server configs hoặc khởi động lại Antigravity để nạp URL mới.');
