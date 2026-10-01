import { Locator, Page } from '@playwright/test';
import { AppRoute } from '../test-data/routes';
import { CreateBirthdayPartyFormComponent } from './components/create-birthday-party-form.component';
import { HeaderComponent } from './components/header.component';

/** Birthday party invitations page. */
export class BirthdaysPage {
  readonly header: HeaderComponent;
  readonly createBirthdayPartyForm: CreateBirthdayPartyFormComponent;
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    const formRoot = page.locator('div').filter({ hasText: 'Create a birthday party' }).first();
    this.createBirthdayPartyForm = new CreateBirthdayPartyFormComponent(page, formRoot);
    this.emptyState = page.getByText(/No upcoming parties yet/);
  }

  /** Open the birthdays page. */
  async goto(): Promise<void> {
    await this.page.goto(AppRoute.Birthdays);
  }
}
