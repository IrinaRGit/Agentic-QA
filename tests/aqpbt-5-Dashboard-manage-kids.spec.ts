import { test, expect } from '../fixtures/cleanup.fixture';
import { DashboardPage } from '../pages/dashboard.page';
import { DASHBOARD_SEED_CHILD_SUMMARIES } from '../pages/components/dashboard-kids-section.component';
import {
  ADD_CHILD_GENDER_LABELS,
  ADD_CHILD_INTEREST_CHIPS,
  AVATAR_EDITOR_GENDER_LABELS,
  CHILD_AVATAR_ICONS,
  buildAddChildPayload,
} from '../test-data/factories/child.factory';
import { invalidManageKidsAddChildInputs } from '../test-data/invalid-manage-kids';

const emptyAddChildCase = invalidManageKidsAddChildInputs[0];
const partialAddChildCase = invalidManageKidsAddChildInputs[1];

async function openDashboard(page: import('@playwright/test').Page): Promise<DashboardPage> {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await expect(dashboard.greetingHeading).toBeVisible();
  return dashboard;
}

async function addUniqueChildOnDashboard(dashboard: DashboardPage): Promise<string> {
  const payload = buildAddChildPayload({ gender: 'Boy' });
  await dashboard.addChildForm.fillPayload(payload);
  await dashboard.addChildForm.submit();
  await expect(dashboard.kidsSection.childSummaryForFirstName(payload.firstName)).toBeVisible();
  return payload.firstName;
}

test.beforeEach(async ({ page }) => {
  await openDashboard(page);
});

test('dashboard shows family header, children, add-child form, and matching My Kids count @smoke', async ({
  page,
}) => {
  const dashboard = new DashboardPage(page);
  const { kidsSection, addChildForm } = dashboard;

  await expect(kidsSection.familyName('The Gorfels')).toBeVisible();
  await expect(kidsSection.parentDisplayName('Lev Test')).toBeVisible();
  await expect(kidsSection.childSummaryLine(DASHBOARD_SEED_CHILD_SUMMARIES.mia)).toBeVisible();
  await expect(kidsSection.childInterestTag('drawing')).toBeVisible();
  await expect(kidsSection.childInterestTag('lego')).toBeVisible();
  await expect(kidsSection.childSummaryLine(DASHBOARD_SEED_CHILD_SUMMARIES.maria)).toBeVisible();
  await expect(kidsSection.childInterestTag('art')).toBeVisible();

  await expect(kidsSection.changeAvatarButtonByIndex(0)).toBeVisible();
  await expect(kidsSection.removeButtonByIndex(0)).toBeVisible();
  await expect(kidsSection.changeAvatarButtonByIndex(1)).toBeVisible();
  await expect(kidsSection.removeButtonByIndex(1)).toBeVisible();

  await expect(addChildForm.firstNameInput).toBeVisible();
  await expect(addChildForm.birthYearInput).toBeVisible();
  await expect(addChildForm.monthInput).toBeVisible();
  await expect(addChildForm.interestsInput).toBeVisible();
  await expect(addChildForm.genderCombobox).toBeVisible();
  await expect(addChildForm.addChildButton).toBeVisible();

  for (const icon of CHILD_AVATAR_ICONS) {
    await expect(addChildForm.avatarIconButton(icon)).toBeVisible();
  }

  for (const chip of ADD_CHILD_INTEREST_CHIPS) {
    await expect(addChildForm.interestChip(chip)).toBeVisible();
  }

  const myKids = await kidsSection.myKidsCount();
  const rowCount = await kidsSection.listedChildRowCount();
  expect(myKids).toBe(rowCount);
});

test('opening Change avatar shows icon row, gender combobox, and done @e2e', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.kidsSection.changeAvatarButtonByIndex(0).click();

  const editor = dashboard.kidsSection.avatarEditorPanel();
  for (const icon of CHILD_AVATAR_ICONS) {
    await expect(editor.iconButton(icon)).toBeVisible();
  }

  for (const label of AVATAR_EDITOR_GENDER_LABELS) {
    await expect(editor.genderOption(label)).toBeAttached();
  }

  await expect(editor.doneButton).toBeVisible();
});

test('done without changing avatar keeps child summary and tags @e2e', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await expect(dashboard.kidsSection.childSummaryLine(DASHBOARD_SEED_CHILD_SUMMARIES.mia)).toBeVisible();
  await expect(dashboard.kidsSection.childInterestTag('drawing')).toBeVisible();
  await expect(dashboard.kidsSection.childInterestTag('lego')).toBeVisible();

  await dashboard.kidsSection.changeAvatarButtonByIndex(0).click();
  const editor = dashboard.kidsSection.avatarEditorPanel();
  await editor.finishWithoutChanges();

  await expect(editor.doneButton).toBeHidden();
  await expect(dashboard.kidsSection.childSummaryLine(DASHBOARD_SEED_CHILD_SUMMARIES.mia)).toBeVisible();
  await expect(dashboard.kidsSection.childInterestTag('drawing')).toBeVisible();
  await expect(dashboard.kidsSection.childInterestTag('lego')).toBeVisible();
});

test('interest shortcut + LEGO fills Interests (comma-separated) with LEGO @e2e', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.addChildForm.clickInterestChip('+ LEGO');
  await expect(dashboard.addChildForm.interestsInput).toHaveValue('LEGO');
});

test('remove child drops the row and decreases My Kids by one @e2e', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  const beforeCount = await dashboard.kidsSection.myKidsCount();
  const firstName = await addUniqueChildOnDashboard(dashboard);
  await expect(await dashboard.kidsSection.myKidsCount()).toBe(beforeCount + 1);

  await dashboard.kidsSection.lastChildRemoveButton().click();
  await expect(dashboard.kidsSection.childSummaryForFirstName(firstName)).toBeHidden();
  await expect(await dashboard.kidsSection.myKidsCount()).toBe(beforeCount);
});

test('add child with empty required fields focuses Child\'s first name and does not add a row @e2e', async ({
  page,
}) => {
  const dashboard = new DashboardPage(page);
  await dashboard.addChildForm.clearTextFields();

  const beforeCount = await dashboard.kidsSection.myKidsCount();
  await dashboard.addChildForm.submit();

  await expect(dashboard.addChildForm.firstNameInput).toBeFocused();
  await expect(await dashboard.kidsSection.myKidsCount()).toBe(beforeCount);
  expect(emptyAddChildCase.fields.firstName).toBe('');
});

test('partial add-child with first name and LEGO does not create a child @e2e', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.addChildForm.clearTextFields();
  await dashboard.addChildForm.firstNameInput.fill(partialAddChildCase.fields.firstName);
  if (partialAddChildCase.clickLegoChip) {
    await dashboard.addChildForm.clickInterestChip('+ LEGO');
    await expect(dashboard.addChildForm.interestsInput).toHaveValue(
      partialAddChildCase.expectedInterestsAfterChip,
    );
  }

  const beforeCount = await dashboard.kidsSection.myKidsCount();
  await dashboard.addChildForm.submit();
  await expect(dashboard.kidsSection.childSummaryForFirstName(partialAddChildCase.fields.firstName)).toBeHidden();
  await expect(await dashboard.kidsSection.myKidsCount()).toBe(beforeCount);
});

test('Change avatar toggles the avatar editor closed @regression', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  const changeAvatar = dashboard.kidsSection.changeAvatarButtonByIndex(0);
  await changeAvatar.click();
  const editor = dashboard.kidsSection.avatarEditorPanel();
  await expect(editor.doneButton).toBeVisible();
  await changeAvatar.click();
  await expect(editor.doneButton).toBeHidden();
});

test('remove acts immediately without a confirm or cancel step @regression', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  const firstName = await addUniqueChildOnDashboard(dashboard);
  await expect(dashboard.kidsSection.confirmDialog()).toBeHidden();

  await dashboard.kidsSection.lastChildRemoveButton().click();
  await expect(dashboard.kidsSection.confirmDialog()).toBeHidden();
  await expect(dashboard.kidsSection.childSummaryForFirstName(firstName)).toBeHidden();
});

test('add-child Gender combobox defaults to prefer not to say @regression', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await expect(dashboard.addChildForm.selectedGenderOption()).toHaveText(ADD_CHILD_GENDER_LABELS[0]);
});

test('multiple interest shortcuts append to Interests (comma-separated) @regression', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.addChildForm.clickInterestChip('+ LEGO');
  await dashboard.addChildForm.clickInterestChip('+ Minecraft');
  await expect(dashboard.addChildForm.interestsInput).toHaveValue(/LEGO/);
  await expect(dashboard.addChildForm.interestsInput).toHaveValue(/Minecraft/);
});
