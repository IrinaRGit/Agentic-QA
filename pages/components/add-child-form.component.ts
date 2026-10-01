import { Locator, Page } from '@playwright/test';

/** Inline “add child” form on the dashboard kids section. */
export class AddChildFormComponent {
  readonly formRoot: Locator;
  readonly firstNameInput: Locator;
  readonly birthYearInput: Locator;
  readonly monthInput: Locator;
  readonly interestsInput: Locator;
  readonly genderCombobox: Locator;
  readonly addChildButton: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.firstNameInput = formRoot.getByRole('textbox', { name: "Child's first name" });
    this.birthYearInput = formRoot.getByRole('spinbutton', { name: 'Birth year' });
    this.monthInput = formRoot.getByRole('spinbutton', { name: 'Month' });
    this.interestsInput = formRoot.getByRole('textbox', { name: 'Interests (comma-separated)' });
    this.genderCombobox = formRoot.getByRole('combobox', { name: 'Gender' });
    this.addChildButton = formRoot.getByRole('button', { name: 'Add child', exact: true });
  }

  /** Pick an avatar icon for the new child. */
  async selectAvatar(name: string): Promise<void> {
    await this.formRoot.getByRole('button', { name, exact: true }).click();
  }

  /** Submit the new child profile. */
  async submit(): Promise<void> {
    await this.addChildButton.click();
  }
}
