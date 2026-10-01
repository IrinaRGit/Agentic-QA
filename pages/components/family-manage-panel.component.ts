import { Locator, Page } from '@playwright/test';

/** Inline manage actions for a connected family on Friends. */
export class FamilyManagePanelComponent {
  readonly panelRoot: Locator;
  readonly reportButton: Locator;
  readonly blockButton: Locator;
  readonly removeButton: Locator;
  readonly cancelButton: Locator;

  constructor(_page: Page, panelRoot: Locator) {
    this.panelRoot = panelRoot;
    this.reportButton = panelRoot.getByRole('button', { name: 'report', exact: true });
    this.blockButton = panelRoot.getByRole('button', { name: 'block', exact: true });
    this.removeButton = panelRoot.getByRole('button', { name: 'remove', exact: true });
    this.cancelButton = panelRoot.getByRole('button', { name: 'cancel', exact: true });
  }

  /** Close manage actions without changing the connection. */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
