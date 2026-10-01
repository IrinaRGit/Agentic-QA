import { Locator, Page } from '@playwright/test';

/** “Propose” playdate request form on Playdates. */
export class ProposePlaydateFormComponent {
  readonly formRoot: Locator;
  readonly familyCombobox: Locator;
  readonly locationNoteInput: Locator;
  readonly optionalNoteInput: Locator;
  readonly sendRequestButton: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.familyCombobox = formRoot.getByRole('combobox').first();
    this.locationNoteInput = formRoot.getByRole('textbox', {
      name: 'Location note, park name, or address',
    });
    this.optionalNoteInput = formRoot.getByRole('textbox', { name: 'Optional note' });
    this.sendRequestButton = formRoot.getByRole('button', { name: 'Send request', exact: true });
  }

  /** Select a matched time slot by its accessible button label. */
  async selectMatchedSlot(name: string): Promise<void> {
    await this.formRoot.getByRole('button', { name }).click();
  }

  /** Toggle which of your children are included. */
  async setChildIncluded(childName: string, checked: boolean): Promise<void> {
    await this.formRoot.getByRole('checkbox', { name: childName, exact: true }).setChecked(checked);
  }

  /** Send the playdate request. */
  async submit(): Promise<void> {
    await this.sendRequestButton.click();
  }
}
