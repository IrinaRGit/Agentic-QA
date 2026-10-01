import { Locator, Page } from '@playwright/test';

/** Password confirmation step for account deletion on Profile. */
export class DeleteAccountFormComponent {
  readonly formRoot: Locator;
  readonly passwordInput: Locator;
  readonly deleteForeverButton: Locator;
  readonly keepAccountButton: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.passwordInput = formRoot.getByRole('textbox', { name: 'Your password' });
    this.deleteForeverButton = formRoot.getByRole('button', { name: 'Delete forever', exact: true });
    this.keepAccountButton = formRoot.getByRole('button', { name: 'Keep my account', exact: true });
  }

  /** Fill the confirmation password field. */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /** Dismiss deletion and keep the account. */
  async cancel(): Promise<void> {
    await this.keepAccountButton.click();
  }

  /** Submit permanent account deletion. */
  async submitDelete(): Promise<void> {
    await this.deleteForeverButton.click();
  }
}
