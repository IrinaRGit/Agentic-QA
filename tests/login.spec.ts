import { test, expect } from '../fixtures/cleanup.fixture';
import { LoginPage } from '../pages/login.page';

test('login page shows its heading @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(loginPage.heading).toBeVisible();
});
