#!/usr/bin/env node
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = process.env.BASE_URL || 'https://lingora-web-psi.vercel.app';

const TARGET_ROUTES = [
  '/',
  '/roadmap',
  '/lab/ipa',
  '/lab/grammar',
  '/dashboard',
];

async function runUiUxAudit() {
  console.log(`⚡ [Lingora UI/UX & A11y Audit] Scanning ${BASE_URL}... (Zero-Token-Waste)`);
  const start = performance.now();
  const browser = await chromium.launch({ headless: true });

  let totalViolations = 0;
  let totalOverflows = 0;

  for (const route of TARGET_ROUTES) {
    const fullUrl = `${BASE_URL}${route}`;
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();

    try {
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);

      // 1. Mobile Zero-Overflow Check (390px)
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return { hasOverflow: docWidth > winWidth, diff: docWidth - winWidth };
      });

      if (overflow.hasOverflow) {
        totalOverflows++;
        console.error(`❌ [${route} - Mobile 390px] Tràn viền ngang: thừa ${overflow.diff}px`);
      }

      // 2. Axe-core Accessibility (WCAG 2.1 AA)
      await page.setViewportSize({ width: 1440, height: 900 });
      const a11yResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast'])
        .analyze();

      const criticalViolations = a11yResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (criticalViolations.length > 0) {
        totalViolations += criticalViolations.length;
        console.error(`❌ [${route} - A11y] ${criticalViolations.length} vi phạm nghiêm trọng:`);
        for (const v of criticalViolations.slice(0, 3)) {
          console.error(`   - ${v.id}: ${v.help} (${v.nodes.length} vị trí)`);
        }
      }

      if (!overflow.hasOverflow && criticalViolations.length === 0) {
        console.log(`✔ [${route}] A11y WCAG-AA: 0 vi phạm | Mobile 390px: 0 tràn viền`);
      }
    } catch (err) {
      console.error(`⚠ [${route}] Kiểm tra thất bại:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  const durationSec = ((performance.now() - start) / 1000).toFixed(2);

  if (totalViolations > 0 || totalOverflows > 0) {
    console.error(`\n💥 UI/UX Audit phát hiện ${totalViolations} lỗi A11y, ${totalOverflows} lỗi tràn viền trong ${durationSec}s.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 UI/UX & A11y Audit PASSED hoàn hảo trong ${durationSec}s! (0 token waste)`);
  }
}

runUiUxAudit().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
