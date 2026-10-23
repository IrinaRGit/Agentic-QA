import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { DeleteAccountFormComponent } from './components/delete-account-form.component';
import { HeaderComponent } from './components/header.component';

/** My Profile — account, family, and settings. */
export class ProfilePage {
  readonly header: HeaderComponent;
  readonly familyDetailsHeading: Locator;
  readonly familyDetailsSavingStatus: Locator;
  readonly displayNameInput: Locator;
  readonly phoneInput: Locator;
  readonly saveMyDetailsButton: Locator;
  readonly familyNameInput: Locator;
  readonly hostAddressInput: Locator;
  readonly addressVisibilityCombobox: Locator;
  readonly saveFamilyDetailsButton: Locator;
  readonly privacySafetyButton: Locator;
  readonly notificationsSettingsButton: Locator;
  readonly calendarSyncButton: Locator;
  readonly deleteAccountButton: Locator;
  readonly logOutButton: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.familyDetailsHeading = page.getByText('Family details', { exact: true });
    const familyDetailsRoot = page.locator('div').filter({
      has: page.getByRole('textbox', { name: 'Family name' }),
    });
    this.familyDetailsSavingStatus = familyDetailsRoot.getByText('Saving...', { exact: true });
    this.displayNameInput = page.getByRole('textbox', {
      name: 'Display name (how your circle sees you)',
    });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone (optional)' });
    this.saveMyDetailsButton = page.getByRole('button', { name: 'Save my details', exact: true });
    this.familyNameInput = page.getByRole('textbox', { name: 'Family name' });
    this.hostAddressInput = page.getByRole('textbox', { name: 'Host address or meeting note' });
    this.addressVisibilityCombobox = page
      .locator('div')
      .filter({ has: page.getByRole('textbox', { name: 'Family name' }) })
      .getByRole('combobox');
    this.saveFamilyDetailsButton = page.getByRole('button', {
      name: 'Save family details',
      exact: true,
    });
    this.privacySafetyButton = page.getByRole('button', { name: /Privacy & Safety/ });
    this.notificationsSettingsButton = page.getByRole('button', { name: /Notifications/ });
    this.calendarSyncButton = page.getByRole('button', { name: /Calendar Sync/ });
    this.deleteAccountButton = page.getByRole('button', { name: 'Delete account…', exact: true });
    this.logOutButton = page.getByRole('button', { name: 'Log out', exact: true }).last();
  }

  /** Open the profile page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Profile);
  }

  /** Currently selected address-visibility option on the native `<select>`. */
  selectedAddressVisibilityOption(): Locator {
    return this.addressVisibilityCombobox.locator('option:checked');
  }

  /** Option in the open address-visibility list. */
  addressVisibilityOption(label: string): Locator {
    return this.page.getByRole('option', { name: label, exact: true });
  }

  /** Open the address visibility dropdown in Family details. */
  async openAddressVisibilityCombobox(): Promise<void> {
    await this.addressVisibilityCombobox.click();
  }

  /** Replace the family name field value. */
  async setFamilyName(name: string): Promise<void> {
    await this.familyNameInput.fill(name);
  }

  /** Clear the family name field. */
  async clearFamilyName(): Promise<void> {
    await this.familyNameInput.fill('');
  }

  /** Activate Save family details. */
  async saveFamilyDetails(): Promise<void> {
    await this.saveFamilyDetailsButton.click();
  }

  /** Open the delete-account confirmation form. */
  async openDeleteAccountForm(): Promise<DeleteAccountFormComponent> {
    await this.deleteAccountButton.click();
    const formRoot = this.page.locator('div').filter({ hasText: 'Confirm with your password' }).first();
    return new DeleteAccountFormComponent(this.page, formRoot);
  }

  /** Toggle privacy & safety (shows status feedback). */
  async openPrivacySafety(): Promise<void> {
    await this.privacySafetyButton.click();
  }

  /** Open notification preferences. */
  async openNotificationsSettings(): Promise<void> {
    await this.notificationsSettingsButton.click();
  }
}
