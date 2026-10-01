import path from 'path';
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';
import { AUTH_FILE } from './support/auth.constants';

dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

/** Playwright treats `/login` as site-root absolute; baseURL must be the app origin only. */
function appOrigin(): string {
  const raw = process.env.APP_URL?.trim();
  if (!raw) {
    throw new Error(
      'APP_URL is missing. Copy .env.example to .env and set APP_URL (e.g. https://test.buddytime.ca/).',
    );
  }
  return new URL(raw.endsWith('/') ? raw : `${raw}/`).origin;
}

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
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
