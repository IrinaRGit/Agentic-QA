import { Locator, Page } from '@playwright/test';

/** Expanded “Circle invite” link panel after “+ Invite a family”. */
export class CircleInvitePanelComponent {
  readonly panelRoot: Locator;
  readonly inviteLink: Locator;
  readonly copyButton: Locator;

  constructor(page: Page, panelRoot: Locator) {
    this.panelRoot = panelRoot;
    this.inviteLink = panelRoot.locator('code');
    this.copyButton = panelRoot.getByRole('button', { name: 'copy', exact: true });
  }

  /** Copy the circle invite link to the clipboard. */
  async copyInviteLink(): Promise<void> {
    await this.copyButton.click();
  }
}
