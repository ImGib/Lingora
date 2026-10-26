import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const EVIDENCE_DIR = path.resolve('05-testing/evidence');
const ARTIFACT_DIR = path.resolve('C:/Users/admin/.gemini/antigravity-cli/brain/7c845691-d1fd-407a-8bab-908e3ca1931a/evidence');

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const TARGETS = [
  { name: '01-landing-desktop', path: '/', viewport: { width: 1440, height: 900 } },
  { name: '02-landing-mobile', path: '/', viewport: { width: 390, height: 844 } },
  { name: '03-roadmap-desktop', path: '/roadmap', viewport: { width: 1440, height: 900 } },
  { name: '04-lab-ipa-desktop', path: '/lab/ipa', viewport: { width: 1440, height: 900 } },
  { name: '05-lab-grammar-desktop', path: '/lab/grammar', viewport: { width: 1440, height: 900 } },
  { name: '05-lab-grammar-mobile', path: '/lab/grammar', viewport: { width: 390, height: 844 } },
  { name: '06-dashboard-desktop', path: '/dashboard', viewport: { width: 1440, height: 900 } },
];

async function capture() {
  console.log(`[Evidence Capture] Starting against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  const results = [];

  for (const target of TARGETS) {
    const page = await browser.newPage({ viewport: target.viewport });
    const fullUrl = `${BASE_URL}${target.path}`;
    console.log(`[Evidence Capture] Visiting ${fullUrl} (${target.viewport.width}x${target.viewport.height})...`);

    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
      // Give 1.5s for fonts and canvas to settle
      await page.waitForTimeout(1500);

      const filename = `${target.name}.png`;
      const localPath = path.join(EVIDENCE_DIR, filename);
      const artifactPath = path.join(ARTIFACT_DIR, filename);

      await page.screenshot({ path: localPath, fullPage: false });
      fs.copyFileSync(localPath, artifactPath);

      console.log(`[Evidence Capture] Saved -> ${localPath}`);
      results.push({ name: target.name, url: fullUrl, localPath, artifactPath });
    } catch (err) {
      console.error(`[Evidence Capture] Failed on ${target.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('[Evidence Capture] All captures completed successfully.');
  return results;
}

capture().catch((err) => {
  console.error('[Evidence Capture] Fatal:', err);
  process.exit(1);
});
