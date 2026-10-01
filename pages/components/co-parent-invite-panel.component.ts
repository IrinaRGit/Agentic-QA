import { Locator, Page } from '@playwright/test';

/** Expanded co-parent invite link panel after “Invite co-parent”. */
export class CoParentInvitePanelComponent {
  readonly panelRoot: Locator;
  readonly inviteLink: Locator;
  readonly copyButton: Locator;

  constructor(_page: Page, panelRoot: Locator) {
    this.panelRoot = panelRoot;
    this.inviteLink = panelRoot.locator('code');
    this.copyButton = panelRoot.getByRole('button', { name: 'copy', exact: true });
  }

  /** Copy the co-parent invite link to the clipboard. */
  async copyInviteLink(): Promise<void> {
    await this.copyButton.click();
  }
}
