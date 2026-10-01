import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { DeleteAccountFormComponent } from './components/delete-account-form.component';
import { HeaderComponent } from './components/header.component';

/** My Profile — account, family, and settings. */
export class ProfilePage {
  readonly header: HeaderComponent;
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
