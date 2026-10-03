import path from 'path';
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';
import { AUTH_FILE } from './support/auth.constants';
import { appOrigin } from './support/app-origin';

dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  globalSetup: './support/global-setup.ts',
  globalTeardown: './support/global-teardown.ts',
  reporter: [['./support/cleanup-reporter.ts'], ['html', { open: 'never' }]],
  use: {
    baseURL: appOrigin(),
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    locale: 'en-CA',
    timezoneId: 'America/Toronto',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      fullyParallel: false,
    },
    {
      name: 'app',
      testMatch: '**/*.spec.ts',
      use: {
        storageState: AUTH_FILE,
      },
      dependencies: ['setup'],
    },
  ],
});
