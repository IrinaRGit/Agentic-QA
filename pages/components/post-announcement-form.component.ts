import { Locator, Page } from '@playwright/test';

/** “New announcement” composer on a community’s Announcements tab. */
export class PostAnnouncementFormComponent {
  readonly formRoot: Locator;
  readonly bodyInput: Locator;
  readonly postButton: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.bodyInput = formRoot.getByRole('textbox', {
      name: 'Share an update with every family in the group…',
    });
    this.postButton = formRoot.getByRole('button', { name: 'Post announcement', exact: true });
  }

  /** Enter announcement text. */
  async fillBody(text: string): Promise<void> {
    await this.bodyInput.fill(text);
  }

  /** Publish the announcement. */
  async submit(): Promise<void> {
    await this.postButton.click();
  }
}
