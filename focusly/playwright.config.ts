import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright-tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4200',
    testIdAttribute: 'data-test-id',
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'ng serve focusly-demo-app',
    port: 4200,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
