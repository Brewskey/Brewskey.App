import { defineConfig, devices, ReporterDescription } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ...(process.env.CI ? [] : [['list'] as ReporterDescription]),
  ],
  
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run web',
    url: 'http://localhost:8081',
    timeout: 120 * 1000, // 2 minutes for Expo to start
    reuseExistingServer: !process.env.CI, // Always restart in CI for clean state
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
