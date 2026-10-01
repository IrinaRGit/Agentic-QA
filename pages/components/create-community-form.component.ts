import { Locator, Page } from '@playwright/test';

/** “Create a community” form at /communities/new. */
export class CreateCommunityFormComponent {
  readonly formRoot: Locator;
  readonly groupNameInput: Locator;
  readonly typeCombobox: Locator;
  readonly descriptionInput: Locator;
  readonly childrenGroup: Locator;
  readonly createGroupButton: Locator;
  readonly cancelLink: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.groupNameInput = formRoot.getByRole('textbox', { name: 'Group name' });
    this.typeCombobox = formRoot.getByRole('combobox', { name: 'Type' });
    this.descriptionInput = formRoot.getByRole('textbox', { name: 'Description (optional)' });
    this.childrenGroup = formRoot.getByRole('group', {
      name: 'Which of your children are in this group?',
    });
    this.createGroupButton = formRoot.getByRole('button', { name: 'Create group', exact: true });
    this.cancelLink = formRoot.getByRole('link', { name: 'Cancel', exact: true });
  }

  /** Fill the community name. */
  async fillGroupName(name: string): Promise<void> {
    await this.groupNameInput.fill(name);
  }

  /** Include a child in the new group. */
  async includeChild(name: string): Promise<void> {
    await this.childrenGroup.getByRole('checkbox', { name, exact: true }).check();
  }

  /** Abandon creation and return to the communities list. */
  async cancel(): Promise<void> {
    await this.cancelLink.click();
  }

  /** Submit the new community. */
  async submit(): Promise<void> {
    await this.createGroupButton.click();
  }
}
