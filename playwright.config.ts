import { defineConfig, devices, ReporterDescription } from '@playwright/test';

/**
 * E2E runs against the REAL Brewskey.Web API (the GHCR Docker image + fresh
 * SQL Server) — no API mocks. Start the stack first:
 *
 *   npm run e2e-stack:up
 *
 * globalSetup verifies the stack is reachable before any test runs.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e-stack/global-setup.ts',
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
    env: {
      ...(process.env as Record<string, string>),
      // Point the app at the e2e API stack (inlined into the bundle by the
      // Expo dev server).
      EXPO_PUBLIC_API_HOST:
        process.env.EXPO_PUBLIC_API_HOST ?? 'http://localhost:8080',
    },
  },
});
