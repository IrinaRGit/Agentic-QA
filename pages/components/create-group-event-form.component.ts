import { Locator, Page } from '@playwright/test';

/** “Create a group event” form on a community’s Events tab. */
export class CreateGroupEventFormComponent {
  readonly formRoot: Locator;
  readonly eventTitleInput: Locator;
  readonly venueInput: Locator;
  readonly detailsInput: Locator;
  readonly invitationCardGroup: Locator;
  readonly noCardRadio: Locator;
  readonly createEventButton: Locator;

  constructor(page: Page, formRoot: Locator) {
    this.formRoot = formRoot;
    this.eventTitleInput = formRoot.getByRole('textbox', { name: 'Event title' });
    this.venueInput = formRoot.getByRole('textbox', { name: 'Venue (optional)' });
    this.detailsInput = formRoot.getByRole('textbox', { name: 'Details for families (optional)' });
    this.invitationCardGroup = formRoot.getByRole('radiogroup', { name: 'Invitation card' });
    this.noCardRadio = this.invitationCardGroup.getByRole('radio', { name: 'No card', exact: true });
    this.createEventButton = formRoot.getByRole('button', { name: 'Create event', exact: true });
  }

  /** Fill the event title. */
  async fillEventTitle(title: string): Promise<void> {
    await this.eventTitleInput.fill(title);
  }

  /** Submit a new group event. */
  async submit(): Promise<void> {
    await this.createEventButton.click();
  }
}
