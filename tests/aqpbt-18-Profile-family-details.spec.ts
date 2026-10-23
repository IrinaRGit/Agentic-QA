import fs from 'fs';
import { test, expect } from '../fixtures/cleanup.fixture';
import { ProfilePage } from '../pages/profile.page';
import { ALT_AUTH_FILE } from '../support/auth.constants';

const MAIN_FAMILY_NAME = 'The Gorfels';
const ALT_FAMILY_NAME = 'Flintstones';
const UNSAVED_PROBE_FAMILY_NAME = 'Unsaved probe name';

const ADDRESS_VISIBILITY_OPTIONS = [
  'Show only after confirmation',
  'Show to trusted circle',
  'Keep hidden',
] as const;

const REQUIRED_FAMILY_NAME_MESSAGE = 'Please fill out this field.';

async function openProfile(page: import('@playwright/test').Page): Promise<ProfilePage> {
  const profile = new ProfilePage(page);
  await profile.goto();
  await expect(profile.familyDetailsHeading).toBeVisible();
  return profile;
}

test.beforeEach(async ({ page }) => {
  await openProfile(page);
});

test('Family details section shows name, host note, visibility, and save @smoke', async ({ page }) => {
  const profile = new ProfilePage(page);

  await expect(profile.familyDetailsHeading).toBeVisible();
  await expect(profile.familyNameInput).toBeVisible();
  await expect(profile.hostAddressInput).toBeVisible();
  await expect(profile.addressVisibilityCombobox).toBeVisible();
  await expect(profile.selectedAddressVisibilityOption()).toHaveText('Show to trusted circle');
  await expect(profile.saveFamilyDetailsButton).toBeVisible();
});

test('address visibility combobox lists all three privacy options @smoke', async ({ page }) => {
  const profile = new ProfilePage(page);
  await profile.openAddressVisibilityCombobox();

  for (const label of ADDRESS_VISIBILITY_OPTIONS) {
    await expect(profile.addressVisibilityOption(label)).toBeAttached();
  }
});

test('save family details without changes shows success feedback @e2e', async ({ page }) => {
  const profile = new ProfilePage(page);

  await expect(profile.familyNameInput).not.toHaveValue('');

  await page.route('**/api/v1/families', async (route) => {
    if (route.request().method() === 'PATCH') {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    await route.continue();
  });

  await Promise.all([
    expect(profile.familyDetailsSavingStatus).toBeVisible(),
    profile.saveFamilyDetails(),
  ]);
  await expect(page.getByText('Family settings saved')).toBeVisible();
  await expect(profile.saveFamilyDetailsButton).toBeEnabled();
  await expect(profile.saveFamilyDetailsButton).toHaveText('Save family details', { exact: true });
});

test('empty family name blocks save with required-field validation @regression', async ({ page }) => {
  const profile = new ProfilePage(page);

  await profile.clearFamilyName();
  await profile.saveFamilyDetails();

  await expect(profile.familyNameInput).toHaveJSProperty(
    'validationMessage',
    REQUIRED_FAMILY_NAME_MESSAGE,
  );
  await expect(page.getByText('Family settings saved')).toBeHidden();
});

test('unsaved family name edit is discarded after leaving profile @e2e', async ({ page }) => {
  const profile = new ProfilePage(page);

  await expect(profile.familyNameInput).toHaveValue(MAIN_FAMILY_NAME);
  await profile.setFamilyName(UNSAVED_PROBE_FAMILY_NAME);

  await profile.header.gotoDashboard();
  await openProfile(page);

  await expect(profile.familyNameInput).toHaveValue(MAIN_FAMILY_NAME);
});

test('alt family has its own Family details defaults @smoke', async ({ browser }) => {
  test.skip(
    !process.env.APP_ALT_USER_EMAIL || !process.env.APP_ALT_USER_PASSWORD,
    'APP_ALT_USER_EMAIL or APP_ALT_USER_PASSWORD is unset; skipping alt-family scenario.',
  );
  test.skip(
    !fs.existsSync(ALT_AUTH_FILE),
    `${ALT_AUTH_FILE} is missing; run auth setup for the second family first.`,
  );

  const context = await browser.newContext({ storageState: ALT_AUTH_FILE });
  const page = await context.newPage();
  const profile = await openProfile(page);

  await expect(profile.familyNameInput).toHaveValue(ALT_FAMILY_NAME);
  await expect(profile.selectedAddressVisibilityOption()).toHaveText('Show only after confirmation');

  await context.close();
});
