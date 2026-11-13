import { defineConfig, devices } from '@playwright/test';
import { resolveBaseURL } from './guard.mjs';

const { base, isLocal } = resolveBaseURL();

export default defineConfig({
  testDir: './e2e',
  // Visual baselines are rendered in the Claude cloud sandbox; CI font rasterizing can differ, so CI skips them unless VISUAL=1.
  testIgnore: process.env.CI && process.env.VISUAL !== '1' ? ['**/visual.spec.mjs'] : [],
  timeout: 30_000,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  outputDir: 'test-results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}',
  use: { baseURL: base, trace: 'off', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: isLocal ? { command: 'node serve.mjs', url: 'http://127.0.0.1:4173/', reuseExistingServer: true, timeout: 15_000 } : undefined,
});
