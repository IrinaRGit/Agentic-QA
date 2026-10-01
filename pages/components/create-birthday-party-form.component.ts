import { Locator, Page } from '@playwright/test';

/** “Create a birthday party” form on Birthdays. */
export class CreateBirthdayPartyFormComponent {
  readonly formRoot: Locator;
  readonly birthdayChildCombobox: Locator;
  readonly inviteChildrenGroup: Locator;
  readonly partyTitleInput: Locator;
  readonly venueInput: Locator;
  readonly detailsInput: Locator;
  readonly invitationCardGroup: Locator;
  readonly createPartyButton: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.birthdayChildCombobox = formRoot.getByRole('combobox').first();
    this.inviteChildrenGroup = formRoot.getByRole('group', { name: 'Invite children' });
    this.partyTitleInput = formRoot.getByRole('textbox', { name: 'Party title' });
    this.venueInput = formRoot.getByRole('textbox', {
      name: 'Venue (e.g. our backyard, Chuck E. Cheese…)',
    });
    this.detailsInput = formRoot.getByRole('textbox', { name: 'Details for guests (optional)' });
    this.invitationCardGroup = formRoot.getByRole('radiogroup', { name: 'Invitation card' });
    this.createPartyButton = formRoot.getByRole('button', { name: 'Create party', exact: true });
  }

  /** Invite a child from the checkbox list. */
  async inviteChild(label: string): Promise<void> {
    await this.inviteChildrenGroup.getByRole('checkbox', { name: label }).check();
  }

  /** Create the birthday party invitation. */
  async submit(): Promise<void> {
    await this.createPartyButton.click();
  }
}
