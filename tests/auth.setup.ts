import fs from 'fs';
import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { AUTH_FILE, ALT_AUTH_FILE } from '../support/auth.constants';
import { LoginPage } from '../pages';
import { AppRoute } from '../test-data/routes';

setup('authenticate main family', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(loginPage.heading).toBeVisible();
  await loginPage.submitLogin(
    process.env.APP_USER_EMAIL!,
    process.env.APP_USER_PASSWORD!,
  );
  await expect(page).toHaveURL(new RegExp(`${AppRoute.Dashboard}(\\?|$|/)`));
  await expect(page).not.toHaveURL(new RegExp(`${AppRoute.Login}(\\?|$|/)`));
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});

setup('authenticate second family', async ({ page }) => {
  setup.skip(
    !process.env.APP_ALT_USER_EMAIL || !process.env.APP_ALT_USER_PASSWORD,
    'APP_ALT_USER_EMAIL or APP_ALT_USER_PASSWORD is unset; skipping second-family auth setup.',
  );

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(loginPage.heading).toBeVisible();
  await loginPage.submitLogin(
    process.env.APP_ALT_USER_EMAIL!,
    process.env.APP_ALT_USER_PASSWORD!,
  );
  await expect(page).toHaveURL(new RegExp(`${AppRoute.Dashboard}(\\?|$|/)`));
  await expect(page).not.toHaveURL(new RegExp(`${AppRoute.Login}(\\?|$|/)`));
  fs.mkdirSync(path.dirname(ALT_AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: ALT_AUTH_FILE });
});
