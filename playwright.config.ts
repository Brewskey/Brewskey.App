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
    // Always restart in CI for clean state. REAL_API must also never reuse:
    // EXPO_PUBLIC_API_HOST is inlined into the bundle by the Expo dev server,
    // so a server started in mock mode would serve a brewskey.com-pointed app.
    reuseExistingServer: !process.env.CI && !process.env.REAL_API,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      ...(process.env as Record<string, string>),
      // Real-API mode points the app at the Docker stack (tests/e2e-stack).
      ...(process.env.REAL_API
        ? {
            EXPO_PUBLIC_API_HOST:
              process.env.EXPO_PUBLIC_API_HOST ?? 'http://localhost:8080',
          }
        : {}),
    },
  },
});
